import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
    {
        bookingReference: {
            type: String,
            required: true,
            unique: true,
        },
        experienceId: {
            type: Schema.Types.ObjectId,
            ref: 'Experience',
            required: [true, 'Experience ID is required'],
        },
        timeSlotId: {
            type: Schema.Types.ObjectId,
            ref: 'TimeSlot',
            required: [true, 'Time slot ID is required'],
        },
        user: {
            firstName: {
                type: String,
                required: [true, 'First name is required'],
                trim: true,
                maxLength: [50, 'First name cannot exceed 50 characters'],
            },
            lastName: {
                type: String,
                required: [true, 'Last name is required'],
                trim: true,
                maxLength: [50, 'Last name cannot exceed 50 characters'],
            },
            email: {
                type: String,
                required: [true, 'Email is required'],
                trim: true,
                lowercase: true,
                validate: {
                    validator: function (email) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                    },
                    message: 'Please provide a valid email address',
                },
            },
            phone: {
                type: String,
                trim: true,
                validate: {
                    validator: function (phone) {
                        if (!phone) return true; // Optional field
                        return /^[+]?[\d\s\-\(\)]{10,15}$/.test(phone);
                    },
                    message: 'Please provide a valid phone number',
                },
            },
            specialRequests: {
                type: String,
                maxLength: [500, 'Special requests cannot exceed 500 characters'],
            },
        },
        numberOfGuests: {
            type: Number,
            required: [true, 'Number of guests is required'],
            min: [1, 'At least 1 guest is required'],
            max: [20, 'Maximum 20 guests allowed'],
        },
        pricing: {
            basePrice: {
                type: Number,
                required: true,
                min: [0, 'Base price cannot be negative'],
            },
            totalAmount: {
                type: Number,
                required: true,
                min: [0, 'Total amount cannot be negative'],
            },
            discountAmount: {
                type: Number,
                default: 0,
                min: [0, 'Discount amount cannot be negative'],
            },
            finalAmount: {
                type: Number,
                required: true,
                min: [0, 'Final amount cannot be negative'],
            },
            currency: {
                type: String,
                default: 'INR',
                enum: ['INR', 'USD', 'EUR'],
            },
        },
        promoCode: {
            code: {
                type: String,
                uppercase: true,
                trim: true,
            },
            discountType: {
                type: String,
                enum: ['percentage', 'fixed'],
            },
            discountValue: {
                type: Number,
                min: 0,
            },
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
            default: 'pending',
        },
        paymentDetails: {
            paymentMethod: {
                type: String,
                enum: ['card', 'upi', 'netbanking', 'wallet', 'cash'],
                default: 'card',
            },
            paymentStatus: {
                type: String,
                enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
                default: 'pending',
            },
            transactionId: {
                type: String,
                trim: true,
            },
            paymentDate: {
                type: Date,
            },
            refundId: {
                type: String,
                trim: true,
            },
            refundDate: {
                type: Date,
            },
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        cancellationDetails: {
            cancelledAt: Date,
            cancelledBy: {
                type: String,
                enum: ['user', 'admin', 'system'],
            },
            cancellationReason: String,
            refundAmount: {
                type: Number,
                min: 0,
            },
        },
        confirmationDetails: {
            confirmedAt: Date,
            confirmationEmail: {
                sent: {
                    type: Boolean,
                    default: false,
                },
                sentAt: Date,
            },
            confirmationSMS: {
                sent: {
                    type: Boolean,
                    default: false,
                },
                sentAt: Date,
            },
        },
        metadata: {
            source: {
                type: String,
                default: 'web',
                enum: ['web', 'mobile', 'api'],
            },
            userAgent: String,
            ipAddress: String,
            referrer: String,
        },
        notes: {
            type: String,
            maxLength: [1000, 'Notes cannot exceed 1000 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
bookingSchema.index({ 'user.email': 1 });
bookingSchema.index({ experienceId: 1, status: 1 });
bookingSchema.index({ timeSlotId: 1 });
bookingSchema.index({ status: 1, bookingDate: -1 });
bookingSchema.index({ 'paymentDetails.paymentStatus': 1 });

// Virtual for full name
bookingSchema.virtual('user.fullName').get(function () {
    return `${this.user.firstName} ${this.user.lastName}`;
});

// Virtual for formatted booking reference
bookingSchema.virtual('formattedBookingReference').get(function () {
    return `HD-${this.bookingReference}`;
});

// Virtual for total savings
bookingSchema.virtual('totalSavings').get(function () {
    return this.pricing.totalAmount - this.pricing.finalAmount;
});

// Pre-save middleware to generate booking reference
bookingSchema.pre('save', async function (next) {
    if (this.isNew && !this.bookingReference) {
        // Generate unique booking reference
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.bookingReference = `${timestamp.slice(-6)}${random}`;
    }

    // Calculate final amount if not set
    if (this.isModified('pricing')) {
        this.pricing.finalAmount = this.pricing.totalAmount - this.pricing.discountAmount;
    }

    next();
});

// Method to confirm booking
bookingSchema.methods.confirmBooking = function () {
    this.status = 'confirmed';
    this.confirmationDetails.confirmedAt = new Date();
    this.paymentDetails.paymentStatus = 'completed';
    this.paymentDetails.paymentDate = new Date();
    return this.save();
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = function (reason, cancelledBy = 'user') {
    this.status = 'cancelled';
    this.cancellationDetails = {
        cancelledAt: new Date(),
        cancelledBy,
        cancellationReason: reason,
    };
    return this.save();
};

// Method to process refund
bookingSchema.methods.processRefund = function (refundAmount, refundId) {
    this.status = 'refunded';
    this.paymentDetails.paymentStatus = 'refunded';
    this.paymentDetails.refundId = refundId;
    this.paymentDetails.refundDate = new Date();
    this.cancellationDetails.refundAmount = refundAmount;
    return this.save();
};

// Static method to generate booking report
bookingSchema.statics.getBookingStats = function (startDate, endDate) {
    const matchStage = {
        bookingDate: {
            $gte: startDate,
            $lte: endDate,
        },
    };

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalRevenue: { $sum: '$pricing.finalAmount' },
                avgAmount: { $avg: '$pricing.finalAmount' },
            },
        },
        {
            $group: {
                _id: null,
                totalBookings: { $sum: '$count' },
                totalRevenue: { $sum: '$totalRevenue' },
                statusBreakdown: {
                    $push: {
                        status: '$_id',
                        count: '$count',
                        revenue: '$totalRevenue',
                        avgAmount: '$avgAmount',
                    },
                },
            },
        },
    ]);
};

// Static method to find bookings by email
bookingSchema.statics.findByEmail = function (email) {
    return this.find({ 'user.email': email })
        .populate('experienceId', 'title location images price')
        .populate('timeSlotId', 'date startTime endTime')
        .sort({ bookingDate: -1 });
};

// Ensure virtuals are included in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

export const Booking = mongoose.model('Booking', bookingSchema);