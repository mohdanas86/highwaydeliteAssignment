import mongoose, { Schema } from 'mongoose';

const promoCodeSchema = new Schema(
    {
        code: {
            type: String,
            required: [true, 'Promo code is required'],
            unique: true,
            uppercase: true,
            trim: true,
            minLength: [3, 'Promo code must be at least 3 characters'],
            maxLength: [20, 'Promo code cannot exceed 20 characters'],
            validate: {
                validator: function (code) {
                    return /^[A-Z0-9]+$/.test(code);
                },
                message: 'Promo code can only contain uppercase letters and numbers',
            },
        },
        description: {
            type: String,
            required: [true, 'Promo code description is required'],
            trim: true,
            maxLength: [200, 'Description cannot exceed 200 characters'],
        },
        discountType: {
            type: String,
            required: [true, 'Discount type is required'],
            enum: ['percentage', 'fixed'],
        },
        discountValue: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: [0, 'Discount value cannot be negative'],
            validate: {
                validator: function (value) {
                    if (this.discountType === 'percentage') {
                        return value <= 100;
                    }
                    return true;
                },
                message: 'Percentage discount cannot exceed 100%',
            },
        },
        minimumOrderValue: {
            type: Number,
            default: 0,
            min: [0, 'Minimum order value cannot be negative'],
        },
        maximumDiscountAmount: {
            type: Number,
            default: null,
            min: [0, 'Maximum discount amount cannot be negative'],
        },
        usageLimit: {
            total: {
                type: Number,
                default: null, // null means unlimited
                min: [1, 'Usage limit must be at least 1'],
            },
            perUser: {
                type: Number,
                default: 1,
                min: [1, 'Per user limit must be at least 1'],
            },
        },
        currentUsage: {
            total: {
                type: Number,
                default: 0,
                min: [0, 'Total usage cannot be negative'],
            },
            byUser: [{
                email: {
                    type: String,
                    required: true,
                    lowercase: true,
                },
                count: {
                    type: Number,
                    default: 1,
                    min: [1, 'User usage count must be at least 1'],
                },
                lastUsed: {
                    type: Date,
                    default: Date.now,
                },
            }],
        },
        validityPeriod: {
            startDate: {
                type: Date,
                required: [true, 'Start date is required'],
            },
            endDate: {
                type: Date,
                required: [true, 'End date is required'],
                validate: {
                    validator: function (endDate) {
                        return endDate > this.validityPeriod.startDate;
                    },
                    message: 'End date must be after start date',
                },
            },
        },
        applicableCategories: [{
            type: String,
            enum: ['adventure', 'cultural', 'food', 'nature', 'entertainment', 'wellness'],
            lowercase: true,
        }],
        applicableExperiences: [{
            type: Schema.Types.ObjectId,
            ref: 'Experience',
        }],
        excludedExperiences: [{
            type: Schema.Types.ObjectId,
            ref: 'Experience',
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        isFirstTimeUser: {
            type: Boolean,
            default: false,
        },
        dayOfWeekRestriction: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            lowercase: true,
        }],
        timeRestriction: {
            startTime: {
                type: String,
                validate: {
                    validator: function (time) {
                        if (!time) return true;
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
                    },
                    message: 'Start time must be in HH:MM format',
                },
            },
            endTime: {
                type: String,
                validate: {
                    validator: function (time) {
                        if (!time) return true;
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
                    },
                    message: 'End time must be in HH:MM format',
                },
            },
        },
        metadata: {
            createdBy: {
                type: String,
                default: 'system',
            },
            campaign: {
                type: String,
                trim: true,
            },
            source: {
                type: String,
                enum: ['system', 'marketing', 'partnership', 'customer-service'],
                default: 'system',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
promoCodeSchema.index({ isActive: 1, 'validityPeriod.startDate': 1, 'validityPeriod.endDate': 1 });
promoCodeSchema.index({ 'applicableCategories': 1 });
promoCodeSchema.index({ 'validityPeriod.endDate': 1 });

// Virtual for checking if promo code is currently valid
promoCodeSchema.virtual('isCurrentlyValid').get(function () {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.validityPeriod.startDate &&
        now <= this.validityPeriod.endDate &&
        (this.usageLimit.total === null || this.currentUsage.total < this.usageLimit.total)
    );
});

// Virtual for remaining usage
promoCodeSchema.virtual('remainingUsage').get(function () {
    if (this.usageLimit.total === null) {
        return 'Unlimited';
    }
    return Math.max(0, this.usageLimit.total - this.currentUsage.total);
});

// Virtual for discount display
promoCodeSchema.virtual('discountDisplay').get(function () {
    if (this.discountType === 'percentage') {
        return `${this.discountValue}% OFF`;
    }
    return `₹${this.discountValue} OFF`;
});

// Method to validate promo code for a specific user and order
promoCodeSchema.methods.validateForUser = function (userEmail, orderValue, experienceId, categoryId) {
    const errors = [];

    // Check if promo code is active and within validity period
    if (!this.isCurrentlyValid) {
        if (!this.isActive) {
            errors.push('Promo code is inactive');
        } else if (new Date() < this.validityPeriod.startDate) {
            errors.push('Promo code is not yet active');
        } else if (new Date() > this.validityPeriod.endDate) {
            errors.push('Promo code has expired');
        } else if (this.usageLimit.total !== null && this.currentUsage.total >= this.usageLimit.total) {
            errors.push('Promo code usage limit reached');
        }
    }

    // Check minimum order value
    if (orderValue < this.minimumOrderValue) {
        errors.push(`Minimum order value of ₹${this.minimumOrderValue} required`);
    }

    // Check per-user usage limit
    const userUsage = this.currentUsage.byUser.find(usage => usage.email === userEmail.toLowerCase());
    if (userUsage && userUsage.count >= this.usageLimit.perUser) {
        errors.push('You have already used this promo code the maximum number of times');
    }

    // Check category restrictions
    if (this.applicableCategories.length > 0 && categoryId) {
        if (!this.applicableCategories.includes(categoryId.toLowerCase())) {
            errors.push('Promo code is not applicable for this experience category');
        }
    }

    // Check experience restrictions
    if (this.applicableExperiences.length > 0 && experienceId) {
        if (!this.applicableExperiences.some(id => id.toString() === experienceId.toString())) {
            errors.push('Promo code is not applicable for this experience');
        }
    }

    // Check excluded experiences
    if (this.excludedExperiences.length > 0 && experienceId) {
        if (this.excludedExperiences.some(id => id.toString() === experienceId.toString())) {
            errors.push('Promo code is not applicable for this experience');
        }
    }

    // Check day of week restrictions
    if (this.dayOfWeekRestriction.length > 0) {
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (!this.dayOfWeekRestriction.includes(currentDay)) {
            errors.push('Promo code is not valid on this day of the week');
        }
    }

    // Check time restrictions
    if (this.timeRestriction.startTime && this.timeRestriction.endTime) {
        const currentTime = new Date().toTimeString().slice(0, 5);
        if (currentTime < this.timeRestriction.startTime || currentTime > this.timeRestriction.endTime) {
            errors.push('Promo code is not valid at this time');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Method to calculate discount amount
promoCodeSchema.methods.calculateDiscount = function (orderValue) {
    let discountAmount = 0;

    if (this.discountType === 'percentage') {
        discountAmount = (orderValue * this.discountValue) / 100;
    } else {
        discountAmount = this.discountValue;
    }

    // Apply maximum discount limit if set
    if (this.maximumDiscountAmount && discountAmount > this.maximumDiscountAmount) {
        discountAmount = this.maximumDiscountAmount;
    }

    // Ensure discount doesn't exceed order value
    discountAmount = Math.min(discountAmount, orderValue);

    return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
};

// Method to use promo code (increment usage counters)
promoCodeSchema.methods.usePromoCode = function (userEmail) {
    this.currentUsage.total += 1;

    const userUsage = this.currentUsage.byUser.find(usage => usage.email === userEmail.toLowerCase());
    if (userUsage) {
        userUsage.count += 1;
        userUsage.lastUsed = new Date();
    } else {
        this.currentUsage.byUser.push({
            email: userEmail.toLowerCase(),
            count: 1,
            lastUsed: new Date(),
        });
    }

    return this.save();
};

// Static method to find valid promo codes
promoCodeSchema.statics.findValidCodes = function () {
    const now = new Date();
    return this.find({
        isActive: true,
        'validityPeriod.startDate': { $lte: now },
        'validityPeriod.endDate': { $gte: now },
        $or: [
            { 'usageLimit.total': null },
            { $expr: { $lt: ['$currentUsage.total', '$usageLimit.total'] } },
        ],
    }).sort({ createdAt: -1 });
};

// Static method to find promo code by code
promoCodeSchema.statics.findByCode = function (code) {
    return this.findOne({ code: code.toUpperCase() });
};

// Ensure virtuals are included in JSON
promoCodeSchema.set('toJSON', { virtuals: true });
promoCodeSchema.set('toObject', { virtuals: true });

export const PromoCode = mongoose.model('PromoCode', promoCodeSchema);