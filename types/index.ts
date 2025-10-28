/**
 * Core type definitions for the BookIt application
 * Defines all data structures used across the application
 */

// Experience-related types
export interface Experience {
    id: string;
    title: string;
    location: string;
    shortDescription: string;
    description?: string; // Full description for detail pages
    price: string; // Formatted price string like "₹999"
    currency: string;
    category: string;
    duration: string;
    maxGroupSize?: number;
    rating: number;
    reviewCount: number;
    difficulty?: 'easy' | 'moderate' | 'hard';
    highlights?: string[];
    included?: string[];
    excluded?: string[];
    cancellationPolicy?: string;
    buttonLabel: string;
    imageAlt: string;
    extraLabel?: string; // Optional extra label
    imageUrl?: string; // For backward compatibility
}

// Slot and availability types
export interface TimeSlot {
    id: string;
    experienceId: string;
    date: string; // ISO date string
    startTime: string;
    endTime: string;
    availableSpots: number;
    totalSpots: number;
    price: number;
    status: 'available' | 'sold-out' | 'cancelled';
}

export interface DateAvailability {
    date: string;
    slots: TimeSlot[];
    hasAvailability: boolean;
}

// Booking-related types
export interface BookingFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
    numberOfGuests: number;
}

export interface PromoCode {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchase?: number;
    maxDiscount?: number;
    expiryDate?: string;
    isValid: boolean;
}

export interface PriceSummary {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
    promoCode?: string;
}

export interface Booking {
    id: string;
    experienceId: string;
    experience?: Experience;
    slotId: string;
    slot?: TimeSlot;
    user: BookingFormData;
    numberOfGuests: number;
    priceSummary: PriceSummary;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    bookingReference: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingRequest {
    experienceId: string;
    slotId: string;
    user: BookingFormData;
    numberOfGuests: number;
    promoCode?: string;
}

export interface BookingResponse {
    success: boolean;
    booking?: Booking;
    message: string;
    error?: string;
}

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Filter and search types
export interface ExperienceFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    rating?: number;
    difficulty?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface SortOptions {
    sortBy: 'price' | 'rating' | 'popularity' | 'newest';
    order: 'asc' | 'desc';
}

// UI state types
export interface LoadingState {
    isLoading: boolean;
    error?: string | null;
}

export interface FormErrors {
    [key: string]: string;
}

// Constants
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
} as const;

export const SLOT_STATUS = {
    AVAILABLE: 'available',
    SOLD_OUT: 'sold-out',
    CANCELLED: 'cancelled',
} as const;
