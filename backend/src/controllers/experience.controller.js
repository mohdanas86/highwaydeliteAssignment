import { Experience } from '../models/experience.model.js';
import { TimeSlot } from '../models/timeSlot.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// @desc    Get all experiences with optional filtering and pagination
// @route   GET /api/v1/experiences
// @access  Public
const getAllExperiences = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        category,
        location,
        minPrice,
        maxPrice,
        rating,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) {
        filter.category = category.toLowerCase();
    }

    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
        filter.rating = { $gte: Number(rating) };
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
        ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    try {
        // Get experiences with pagination
        const experiences = await Experience.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select('-metaData -__v');

        // Get total count for pagination
        const totalExperiences = await Experience.countDocuments(filter);
        const totalPages = Math.ceil(totalExperiences / Number(limit));

        // Prepare response with pagination info
        const response = {
            experiences,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalExperiences,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
                limit: Number(limit),
            },
            filters: {
                category,
                location,
                minPrice,
                maxPrice,
                rating,
                search,
            },
        };

        return res.status(200).json(
            new ApiResponse(200, response, 'Experiences retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Error retrieving experiences', [error.message]);
    }
});

// @desc    Get experience by ID with available time slots
// @route   GET /api/v1/experiences/:id
// @access  Public
const getExperienceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fromDate, toDate, slotsLimit = 30 } = req.query;

    try {
        // Find experience by ID
        const experience = await Experience.findById(id).select('-metaData -__v');

        if (!experience) {
            throw new ApiError(404, 'Experience not found');
        }

        if (!experience.isActive) {
            throw new ApiError(404, 'Experience is not currently available');
        }

        // Set default date range if not provided
        const startDate = fromDate ? new Date(fromDate) : new Date();
        const endDate = toDate ? new Date(toDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        // Validate date range
        if (startDate > endDate) {
            throw new ApiError(400, 'Start date must be before end date');
        }

        // Get available time slots for this experience
        const timeSlots = await TimeSlot.findAvailableSlots(id, startDate, endDate)
            .limit(Number(slotsLimit))
            .select('-__v');

        // Group time slots by date for better frontend handling
        const slotsByDate = timeSlots.reduce((acc, slot) => {
            const dateKey = slot.date.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(slot);
            return acc;
        }, {});

        // Calculate some additional stats
        const stats = {
            totalAvailableSlots: timeSlots.length,
            availableDates: Object.keys(slotsByDate).length,
            priceRange: {
                min: Math.min(...timeSlots.map(slot => slot.effectivePrice)),
                max: Math.max(...timeSlots.map(slot => slot.effectivePrice)),
            },
        };

        const response = {
            experience,
            availableSlots: {
                total: timeSlots.length,
                byDate: slotsByDate,
                list: timeSlots,
            },
            stats,
        };

        return res.status(200).json(
            new ApiResponse(200, response, 'Experience details retrieved successfully')
        );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Error retrieving experience details', [error.message]);
    }
});

// @desc    Get experience categories
// @route   GET /api/v1/experiences/categories
// @access  Public
const getExperienceCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Experience.distinct('category', { isActive: true });

        // Get count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const count = await Experience.countDocuments({ category, isActive: true });
                return {
                    name: category,
                    count,
                    displayName: category.charAt(0).toUpperCase() + category.slice(1),
                };
            })
        );

        return res.status(200).json(
            new ApiResponse(200, categoriesWithCount, 'Categories retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Error retrieving categories', [error.message]);
    }
});

// @desc    Get experience locations
// @route   GET /api/v1/experiences/locations
// @access  Public
const getExperienceLocations = asyncHandler(async (req, res) => {
    try {
        const locations = await Experience.distinct('location', { isActive: true });

        // Get count for each location
        const locationsWithCount = await Promise.all(
            locations.map(async (location) => {
                const count = await Experience.countDocuments({ location, isActive: true });
                return {
                    name: location,
                    count,
                };
            })
        );

        return res.status(200).json(
            new ApiResponse(200, locationsWithCount, 'Locations retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Error retrieving locations', [error.message]);
    }
});

// @desc    Get featured experiences
// @route   GET /api/v1/experiences/featured
// @access  Public
const getFeaturedExperiences = asyncHandler(async (req, res) => {
    const { limit = 6 } = req.query;

    try {
        // Get featured experiences (high rating, popular, etc.)
        const featuredExperiences = await Experience.find({
            isActive: true,
            $or: [
                { rating: { $gte: 4.5 } },
                { reviewCount: { $gte: 50 } },
                { tags: { $in: ['featured', 'popular', 'recommended'] } },
            ],
        })
            .sort({ rating: -1, reviewCount: -1 })
            .limit(Number(limit))
            .select('-metaData -__v');

        return res.status(200).json(
            new ApiResponse(200, featuredExperiences, 'Featured experiences retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Error retrieving featured experiences', [error.message]);
    }
});

// @desc    Search experiences with advanced filters
// @route   POST /api/v1/experiences/search
// @access  Public
const searchExperiences = asyncHandler(async (req, res) => {
    const {
        query,
        filters = {},
        sort = { rating: -1 },
        page = 1,
        limit = 12,
    } = req.body;

    try {
        // Build search filter
        const searchFilter = { isActive: true };

        // Text search
        if (query) {
            searchFilter.$text = { $search: query };
        }

        // Apply additional filters
        if (filters.category) {
            searchFilter.category = { $in: Array.isArray(filters.category) ? filters.category : [filters.category] };
        }

        if (filters.location) {
            searchFilter.location = { $regex: filters.location, $options: 'i' };
        }

        if (filters.priceRange) {
            searchFilter.price = {
                $gte: filters.priceRange.min || 0,
                $lte: filters.priceRange.max || Number.MAX_VALUE,
            };
        }

        if (filters.rating) {
            searchFilter.rating = { $gte: filters.rating };
        }

        if (filters.duration) {
            searchFilter.duration = { $regex: filters.duration, $options: 'i' };
        }

        if (filters.difficulty) {
            searchFilter.difficulty = { $in: Array.isArray(filters.difficulty) ? filters.difficulty : [filters.difficulty] };
        }

        if (filters.tags && filters.tags.length > 0) {
            searchFilter.tags = { $in: filters.tags };
        }

        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute search
        const experiences = await Experience.find(searchFilter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select('-metaData -__v');

        const totalResults = await Experience.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalResults / Number(limit));

        const response = {
            experiences,
            searchInfo: {
                query,
                totalResults,
                resultsPerPage: experiences.length,
                currentPage: Number(page),
                totalPages,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
            },
            appliedFilters: filters,
        };

        return res.status(200).json(
            new ApiResponse(200, response, 'Search completed successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Error performing search', [error.message]);
    }
});

export {
    getAllExperiences,
    getExperienceById,
    getExperienceCategories,
    getExperienceLocations,
    getFeaturedExperiences,
    searchExperiences,
};