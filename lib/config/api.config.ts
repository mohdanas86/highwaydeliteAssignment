/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base API URL - Update this with your actual backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Endpoints
export const API_ENDPOINTS = {
    EXPERIENCES: '/experiences',
    EXPERIENCE_DETAIL: (id: string) => `/experiences/${id}`,
    SLOTS: (experienceId: string) => `/experiences/${experienceId}/slots`,
    BOOKINGS: '/bookings',
    BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
    VALIDATE_PROMO: '/promo/validate',
} as const;

// API Configuration
export const API_CONFIG = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    CACHE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;
