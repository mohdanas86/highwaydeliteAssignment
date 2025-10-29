import mongoose, { Schema } from 'mongoose';

const experienceSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Experience title is required'],
            trim: true,
            maxLength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Experience description is required'],
            trim: true,
            maxLength: [1000, 'Description cannot exceed 1000 characters'],
        },
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
            trim: true,
            maxLength: [200, 'Short description cannot exceed 200 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            default: function () {
                return this.price;
            },
        },
        duration: {
            type: String,
            required: [true, 'Duration is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['adventure', 'cultural', 'food', 'nature', 'entertainment', 'wellness'],
            lowercase: true,
        },
        images: [{
            url: {
                type: String,
                required: true,
            },
            alt: {
                type: String,
                default: '',
            },
        }],
        highlights: [String],
        inclusions: [String],
        exclusions: [String],
        cancellationPolicy: {
            type: String,
            default: 'Free cancellation up to 24 hours before the experience',
        },
        difficulty: {
            type: String,
            enum: ['easy', 'moderate', 'challenging'],
            default: 'easy',
        },
        minAge: {
            type: Number,
            default: 0,
        },
        maxGroupSize: {
            type: Number,
            default: 20,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        tags: [String],
        metaData: {
            seoTitle: String,
            seoDescription: String,
            keywords: [String],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
experienceSchema.index({ category: 1, isActive: 1 });
experienceSchema.index({ price: 1 });
experienceSchema.index({ rating: -1 });
experienceSchema.index({ location: 1 });
experienceSchema.index({ title: 'text', description: 'text' });

// Virtual for formatted price
experienceSchema.virtual('formattedPrice').get(function () {
    return `₹${this.price.toLocaleString()}`;
});

// Virtual for discount percentage
experienceSchema.virtual('discountPercentage').get(function () {
    if (this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Ensure virtuals are included in JSON
experienceSchema.set('toJSON', { virtuals: true });
experienceSchema.set('toObject', { virtuals: true });

export const Experience = mongoose.model('Experience', experienceSchema);