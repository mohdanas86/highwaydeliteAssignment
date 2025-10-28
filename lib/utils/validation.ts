/**
 * Validation Utilities
 * Form validation functions and helpers
 */

import { FormErrors } from '@/types';

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Phone number validation (international format)
 */
export const isValidPhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has between 10 and 15 digits
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Name validation (at least 2 characters, letters, spaces, hyphens, apostrophes)
 */
export const isValidName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z]+([ \-']{0,1}[a-zA-Z]+){0,2}[.]{0,1}$/;
    return name.trim().length >= 2 && nameRegex.test(name.trim());
};

/**
 * Required field validation
 */
export const isRequired = (value: string | number | undefined | null): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
};

/**
 * Number validation
 */
export const isValidNumber = (value: string | number, min?: number, max?: number): boolean => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
};

/**
 * Validate booking form
 */
export interface BookingFormValidation {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    numberOfGuests: number;
}

export const validateBookingForm = (data: Partial<BookingFormValidation>): FormErrors => {
    const errors: FormErrors = {};

    // First name
    if (!isRequired(data.firstName)) {
        errors.firstName = 'First name is required';
    } else if (!isValidName(data.firstName!)) {
        errors.firstName = 'Please enter a valid first name';
    }

    // Last name
    if (!isRequired(data.lastName)) {
        errors.lastName = 'Last name is required';
    } else if (!isValidName(data.lastName!)) {
        errors.lastName = 'Please enter a valid last name';
    }

    // Email
    if (!isRequired(data.email)) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email!)) {
        errors.email = 'Please enter a valid email address';
    }

    // Phone
    if (!isRequired(data.phone)) {
        errors.phone = 'Phone number is required';
    } else if (!isValidPhone(data.phone!)) {
        errors.phone = 'Please enter a valid phone number';
    }

    // Number of guests
    if (!isRequired(data.numberOfGuests)) {
        errors.numberOfGuests = 'Number of guests is required';
    } else if (!isValidNumber(data.numberOfGuests!, 1, 20)) {
        errors.numberOfGuests = 'Please enter a valid number of guests (1-20)';
    }

    return errors;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');

    if (digitsOnly.length === 10) {
        return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }

    return phone;
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Parse price string to number (e.g., "₹999" -> 999)
 */
export const parsePrice = (priceString: string): number => {
    return parseInt(priceString.replace('₹', '')) || 0;
};

/**
 * Format date
 */
export const formatDate = (dateString: string, format: 'short' | 'long' = 'long'): string => {
    const date = new Date(dateString);

    if (format === 'short') {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Format time
 */
export const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
};

/**
 * Check if date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
