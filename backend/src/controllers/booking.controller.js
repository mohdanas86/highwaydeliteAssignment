import { Booking } from '../models/booking.model.js';
import { Experience } from '../models/experience.model.js';
import { TimeSlot } from '../models/timeSlot.model.js';
import { PromoCode } from '../models/promoCode.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res) => {
    const {
        experienceId,
        timeSlotId,
        user,
        numberOfGuests,
        promoCode,
        metadata = {},
    } = req.body;

    // Validate required fields
    if (!experienceId || !timeSlotId || !user || !numberOfGuests) {
        throw new ApiError(400, 'Missing required booking information');
    }

    // Validate user information
    if (!user.firstName || !user.lastName || !user.email) {
        throw new ApiError(400, 'User information is incomplete');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        throw new ApiError(400, 'Invalid email format');
    }

    // Validate number of guests
    if (numberOfGuests < 1 || numberOfGuests > 20) {
        throw new ApiError(400, 'Number of guests must be between 1 and 20');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch experience and time slot with session
        const [experience, timeSlot] = await Promise.all([
            Experience.findById(experienceId).session(session),
            TimeSlot.findById(timeSlotId).session(session),
        ]);

        if (!experience) {
            throw new ApiError(404, 'Experience not found');
        }

        if (!experience.isActive) {
            throw new ApiError(400, 'Experience is not currently available');
        }

        if (!timeSlot) {
            throw new ApiError(404, 'Time slot not found');
        }

        if (!timeSlot.isAvailable) {
            throw new ApiError(400, 'Time slot is not available');
        }

        if (timeSlot.experienceId.toString() !== experienceId) {
            throw new ApiError(400, 'Time slot does not belong to the selected experience');
        }

        // Check if there are enough available spots
        if (timeSlot.availableSpots < numberOfGuests) {
            throw new ApiError(400, `Only ${timeSlot.availableSpots} spots available, but ${numberOfGuests} requested`);
        }

        // Check if booking is too late (past cancellation deadline)
        const now = new Date();
        if (now > timeSlot.cancellationDeadline) {
            throw new ApiError(400, 'Booking deadline has passed for this time slot');
        }

        // Calculate pricing
        const basePrice = timeSlot.effectivePrice;
        const totalAmount = basePrice * numberOfGuests;
        let discountAmount = 0;
        let appliedPromoCode = null;

        // Validate and apply promo code if provided
        if (promoCode && promoCode.trim()) {
            const promoCodeDoc = await PromoCode.findByCode(promoCode.trim()).session(session);

            if (!promoCodeDoc) {
                throw new ApiError(400, 'Invalid promo code');
            }

            const validation = promoCodeDoc.validateForUser(
                user.email,
                totalAmount,
                experienceId,
                experience.category
            );

            if (!validation.isValid) {
                throw new ApiError(400, `Promo code validation failed: ${validation.errors.join(', ')}`);
            }

            discountAmount = promoCodeDoc.calculateDiscount(totalAmount);
            appliedPromoCode = {
                code: promoCodeDoc.code,
                discountType: promoCodeDoc.discountType,
                discountValue: promoCodeDoc.discountValue,
            };

            // Use the promo code (increment usage counters)
            await promoCodeDoc.usePromoCode(user.email);
        }

        const finalAmount = totalAmount - discountAmount;

        // Create booking
        const booking = new Booking({
            experienceId,
            timeSlotId,
            user: {
                firstName: user.firstName.trim(),
                lastName: user.lastName.trim(),
                email: user.email.toLowerCase().trim(),
                phone: user.phone?.trim() || '',
                specialRequests: user.specialRequests?.trim() || '',
            },
            numberOfGuests,
            pricing: {
                basePrice,
                totalAmount,
                discountAmount,
                finalAmount,
                currency: 'INR',
            },
            promoCode: appliedPromoCode,
            metadata: {
                source: 'web',
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip,
                ...metadata,
            },
        });

        // Save booking with session
        await booking.save({ session });

        // Update time slot booked count
        await timeSlot.bookSlots(numberOfGuests);

        // Commit transaction
        await session.commitTransaction();

        // Populate booking with experience and time slot details for response
        await booking.populate([
            {
                path: 'experienceId',
                select: 'title location images price duration',
            },
            {
                path: 'timeSlotId',
                select: 'date startTime endTime',
            },
        ]);

        return res.status(201).json(
            new ApiResponse(201, { booking }, 'Booking created successfully')
        );

    } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();

        if (error instanceof ApiError) {
            throw error;
        }

        console.error('Booking creation error:', error);
        throw new ApiError(500, 'Failed to create booking', [error.message]);
    } finally {
        session.endSession();
    }
});

// @desc    Get booking by reference
// @route   GET /api/v1/bookings/:reference
// @access  Public
const getBookingByReference = asyncHandler(async (req, res) => {
    const { reference } = req.params;

    try {
        const booking = await Booking.findOne({ bookingReference: reference })
            .populate({
                path: 'experienceId',
                select: 'title description location images price duration category',
            })
            .populate({
                path: 'timeSlotId',
                select: 'date startTime endTime formattedDate timeRange',
            });

        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        return res.status(200).json(
            new ApiResponse(200, { booking }, 'Booking retrieved successfully')
        );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Error retrieving booking', [error.message]);
    }
});

// @desc    Get bookings by email
// @route   GET /api/v1/bookings/user/:email
// @access  Public
const getBookingsByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, 'Invalid email format');
    }

    try {
        const filter = { 'user.email': email.toLowerCase() };

        if (status) {
            filter.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [bookings, totalBookings] = await Promise.all([
            Booking.find(filter)
                .populate({
                    path: 'experienceId',
                    select: 'title location images price duration',
                })
                .populate({
                    path: 'timeSlotId',
                    select: 'date startTime endTime',
                })
                .sort({ bookingDate: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Booking.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalBookings / Number(limit));

        const response = {
            bookings,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalBookings,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
                limit: Number(limit),
            },
        };

        return res.status(200).json(
            new ApiResponse(200, response, 'Bookings retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Error retrieving bookings', [error.message]);
    }
});

// @desc    Cancel booking
// @route   PATCH /api/v1/bookings/:reference/cancel
// @access  Public
const cancelBooking = asyncHandler(async (req, res) => {
    const { reference } = req.params;
    const { reason = 'User cancellation' } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await Booking.findOne({ bookingReference: reference }).session(session);

        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        if (booking.status === 'cancelled') {
            throw new ApiError(400, 'Booking is already cancelled');
        }

        if (booking.status === 'completed') {
            throw new ApiError(400, 'Cannot cancel completed booking');
        }

        // Check if cancellation is still allowed
        const timeSlot = await TimeSlot.findById(booking.timeSlotId).session(session);
        if (!timeSlot) {
            throw new ApiError(404, 'Time slot not found');
        }

        const now = new Date();
        if (now > timeSlot.cancellationDeadline) {
            throw new ApiError(400, 'Cancellation deadline has passed');
        }

        // Cancel the booking
        await booking.cancelBooking(reason);

        // Return slots to availability
        await timeSlot.cancelBooking(booking.numberOfGuests);

        await session.commitTransaction();

        return res.status(200).json(
            new ApiResponse(200, { booking }, 'Booking cancelled successfully')
        );

    } catch (error) {
        await session.abortTransaction();

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, 'Failed to cancel booking', [error.message]);
    } finally {
        session.endSession();
    }
});

// @desc    Validate promo code
// @route   POST /api/v1/promo/validate
// @access  Public
const validatePromoCode = asyncHandler(async (req, res) => {
    const { code, userEmail, orderValue, experienceId } = req.body;

    // Validate required fields
    if (!code || !userEmail || !orderValue) {
        throw new ApiError(400, 'Promo code, user email, and order value are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        throw new ApiError(400, 'Invalid email format');
    }

    // Validate order value
    if (orderValue <= 0) {
        throw new ApiError(400, 'Order value must be greater than 0');
    }

    try {
        const promoCodeDoc = await PromoCode.findByCode(code.trim());

        if (!promoCodeDoc) {
            throw new ApiError(404, 'Promo code not found');
        }

        if (!promoCodeDoc.isActive) {
            throw new ApiError(400, 'Promo code is inactive');
        }

        // Get experience category if experienceId is provided
        let experienceCategory = null;
        if (experienceId) {
            const experience = await Experience.findById(experienceId).select('category');
            if (experience) {
                experienceCategory = experience.category;
            }
        }

        // Validate promo code for user
        const validation = promoCodeDoc.validateForUser(
            userEmail,
            orderValue,
            experienceId,
            experienceCategory
        );

        if (!validation.isValid) {
            throw new ApiError(400, validation.errors.join(', '));
        }

        // Calculate discount
        const discountAmount = promoCodeDoc.calculateDiscount(orderValue);
        const finalAmount = orderValue - discountAmount;

        const response = {
            isValid: true,
            promoCode: {
                code: promoCodeDoc.code,
                description: promoCodeDoc.description,
                discountType: promoCodeDoc.discountType,
                discountValue: promoCodeDoc.discountValue,
                discountDisplay: promoCodeDoc.discountDisplay,
            },
            pricing: {
                originalAmount: orderValue,
                discountAmount,
                finalAmount,
                savings: discountAmount,
                currency: 'INR',
            },
        };

        return res.status(200).json(
            new ApiResponse(200, response, 'Promo code is valid')
        );

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Error validating promo code', [error.message]);
    }
});

// @desc    Get available promo codes
// @route   GET /api/v1/promo/available
// @access  Public
const getAvailablePromoCodes = asyncHandler(async (req, res) => {
    const { category, experienceId } = req.query;

    try {
        let promoCodes = await PromoCode.findValidCodes()
            .select('code description discountType discountValue minimumOrderValue validityPeriod applicableCategories')
            .limit(10);

        // Filter by category if provided
        if (category) {
            promoCodes = promoCodes.filter(promo =>
                promo.applicableCategories.length === 0 ||
                promo.applicableCategories.includes(category.toLowerCase())
            );
        }

        // Filter by experience if provided
        if (experienceId) {
            promoCodes = promoCodes.filter(promo =>
                promo.applicableExperiences.length === 0 ||
                promo.applicableExperiences.some(id => id.toString() === experienceId)
            );
        }

        // Format response
        const formattedPromoCodes = promoCodes.map(promo => ({
            code: promo.code,
            description: promo.description,
            discountDisplay: promo.discountDisplay,
            minimumOrderValue: promo.minimumOrderValue,
            validUntil: promo.validityPeriod.endDate,
            applicableCategories: promo.applicableCategories,
        }));

        return res.status(200).json(
            new ApiResponse(200, formattedPromoCodes, 'Available promo codes retrieved successfully')
        );

    } catch (error) {
        throw new ApiError(500, 'Error retrieving promo codes', [error.message]);
    }
});

export {
    createBooking,
    getBookingByReference,
    getBookingsByEmail,
    cancelBooking,
    validatePromoCode,
    getAvailablePromoCodes,
};