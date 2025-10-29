import mongoose, { Schema } from 'mongoose';

const timeSlotSchema = new Schema(
    {
        experienceId: {
            type: Schema.Types.ObjectId,
            ref: 'Experience',
            required: [true, 'Experience ID is required'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
            validate: {
                validator: function (time) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
                },
                message: 'Start time must be in HH:MM format',
            },
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
            validate: {
                validator: function (time) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
                },
                message: 'End time must be in HH:MM format',
            },
        },
        totalCapacity: {
            type: Number,
            required: [true, 'Total capacity is required'],
            min: [1, 'Capacity must be at least 1'],
            max: [100, 'Capacity cannot exceed 100'],
        },
        bookedSlots: {
            type: Number,
            default: 0,
            min: [0, 'Booked slots cannot be negative'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        specialPrice: {
            type: Number,
            default: null,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isSpecialSlot: {
            type: Boolean,
            default: false,
        },
        slotType: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night', 'full-day'],
            default: 'morning',
        },
        weatherDependent: {
            type: Boolean,
            default: false,
        },
        cancellationDeadline: {
            type: Date,
            default: function () {
                // Default to 24 hours before the slot
                const slotDateTime = new Date(this.date);
                const [hours, minutes] = this.startTime.split(':');
                slotDateTime.setHours(parseInt(hours), parseInt(minutes));
                return new Date(slotDateTime.getTime() - 24 * 60 * 60 * 1000);
            },
        },
        notes: {
            type: String,
            maxLength: [500, 'Notes cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for better query performance
timeSlotSchema.index({ experienceId: 1, date: 1, startTime: 1 });
timeSlotSchema.index({ date: 1, isAvailable: 1 });
timeSlotSchema.index({ experienceId: 1, isAvailable: 1 });

// Virtual for available spots
timeSlotSchema.virtual('availableSpots').get(function () {
    return Math.max(0, this.totalCapacity - this.bookedSlots);
});

// Virtual for fully booked status
timeSlotSchema.virtual('isFullyBooked').get(function () {
    return this.bookedSlots >= this.totalCapacity;
});

// Virtual for formatted date
timeSlotSchema.virtual('formattedDate').get(function () {
    return this.date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

// Virtual for formatted time range
timeSlotSchema.virtual('timeRange').get(function () {
    return `${this.startTime} - ${this.endTime}`;
});

// Virtual for effective price (special price if available, otherwise regular price)
timeSlotSchema.virtual('effectivePrice').get(function () {
    return this.specialPrice || this.price;
});

// Pre-save middleware to update availability based on capacity
timeSlotSchema.pre('save', function (next) {
    if (this.bookedSlots >= this.totalCapacity) {
        this.isAvailable = false;
    } else {
        this.isAvailable = true;
    }

    // Ensure booked slots don't exceed capacity
    if (this.bookedSlots > this.totalCapacity) {
        return next(new Error('Booked slots cannot exceed total capacity'));
    }

    next();
});

// Method to book slots
timeSlotSchema.methods.bookSlots = function (numberOfSlots = 1) {
    if (this.availableSpots < numberOfSlots) {
        throw new Error('Not enough available spots');
    }

    this.bookedSlots += numberOfSlots;
    return this.save();
};

// Method to cancel booking
timeSlotSchema.methods.cancelBooking = function (numberOfSlots = 1) {
    if (this.bookedSlots < numberOfSlots) {
        throw new Error('Cannot cancel more slots than booked');
    }

    this.bookedSlots -= numberOfSlots;
    return this.save();
};

// Static method to find available slots for an experience
timeSlotSchema.statics.findAvailableSlots = function (experienceId, fromDate, toDate) {
    const query = {
        experienceId,
        isAvailable: true,
        date: {
            $gte: fromDate || new Date(),
        },
    };

    if (toDate) {
        query.date.$lte = toDate;
    }

    return this.find(query).sort({ date: 1, startTime: 1 });
};

// Ensure virtuals are included in JSON
timeSlotSchema.set('toJSON', { virtuals: true });
timeSlotSchema.set('toObject', { virtuals: true });

export const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);