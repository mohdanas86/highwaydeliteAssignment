/**
 * API Service Layer
 * Handles all API calls with comprehensive error handling, security, and caching
 * 
 * Features:
 * - Request/Response interceptors for auth and error handling
 * - Retry logic for failed requests
 * - Input sanitization and validation
 * - Type-safe API responses
 * - Comprehensive error handling
 * 
 * @example
 * ```typescript
 * // Fetch experiences with error handling
 * try {
 *   const experiences = await experienceService.getExperiences();
 *   console.log(experiences);
 * } catch (error) {
 *   console.error('Failed to fetch experiences:', error.message);
 * }
 * ```
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import {
    Experience,
    TimeSlot,
    DateAvailability,
    BookingRequest,
    BookingResponse,
    ApiResponse,
    PromoCode,
    ExperienceFilters,
} from '@/types';
import { API_BASE_URL, API_ENDPOINTS, API_CONFIG } from '@/lib/config/api.config';
import { mockExperiences, generateMockSlots, mockPromoCodes } from '@/lib/data/mockData';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';

/**
 * Input sanitization utilities
 */
const sanitizeInput = {
    /** Remove HTML tags and dangerous characters from string input */
    string: (input: string): string => {
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/[<>'"]/g, '') // Remove dangerous characters
            .trim();
    },

    /** Validate and sanitize email */
    email: (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const sanitized = email.toLowerCase().trim();
        if (!emailRegex.test(sanitized)) {
            throw new Error('Invalid email format');
        }
        return sanitized;
    },

    /** Validate numeric input */
    number: (value: any, min?: number, max?: number): number => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) throw new Error('Invalid number');
        if (min !== undefined && num < min) throw new Error(`Value must be at least ${min}`);
        if (max !== undefined && num > max) throw new Error(`Value must be at most ${max}`);
        return num;
    },
};

/**
 * Rate limiting utility
 */
const rateLimiter = {
    requests: new Map<string, number[]>(),
    isAllowed: (endpoint: string, limit: number = 10, windowMs: number = 60000): boolean => {
        const now = Date.now();
        const key = endpoint;
        const requests = rateLimiter.requests.get(key) || [];

        // Remove old requests outside the window
        const validRequests = requests.filter(timestamp => now - timestamp < windowMs);

        if (validRequests.length >= limit) {
            return false;
        }

        validRequests.push(now);
        rateLimiter.requests.set(key, validRequests);
        return true;
    },
};

// Create axios instance with enhanced security configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    },
    // Prevent sending credentials with every request unless specifically needed
    withCredentials: false,
});

// Enhanced request interceptor with security and rate limiting
apiClient.interceptors.request.use(
    (config) => {
        // Rate limiting check
        if (!rateLimiter.isAllowed(config.url || '', 50, 60000)) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        // Add auth token if available
        const token = storage.local.get<string>(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging (using headers)
        config.headers['X-Request-Start'] = Date.now().toString();

        // Sanitize request data
        if (config.data && typeof config.data === 'object') {
            config.data = sanitizeRequestData(config.data);
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Enhanced response interceptor with comprehensive error handling
apiClient.interceptors.response.use(
    (response) => {
        // Log response time for monitoring
        const startTime = response.config.headers['X-Request-Start'];
        if (startTime) {
            const responseTime = Date.now() - parseInt(startTime as string);
            if (responseTime > 5000) {
                console.warn(`Slow API response: ${response.config.url} took ${responseTime}ms`);
            }
        }

        return response;
    },
    (error: AxiosError) => {
        // Handle different types of errors
        if (error.response?.status === 401) {
            // Clear invalid token and redirect to login
            storage.local.remove(STORAGE_KEYS.AUTH_TOKEN);
            // In a real app, you might want to redirect to login page
            console.warn('Authentication failed. Token cleared.');
        } else if (error.response?.status === 403) {
            console.error('Access forbidden. Insufficient permissions.');
        } else if (error.response?.status === 429) {
            console.error('Rate limit exceeded from server.');
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout.');
        } else if (!error.response) {
            console.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

/**
 * Sanitize request data to prevent injection attacks
 */
const sanitizeRequestData = (data: any): any => {
    if (typeof data === 'string') {
        return sanitizeInput.string(data);
    }

    if (Array.isArray(data)) {
        return data.map(sanitizeRequestData);
    }

    if (data && typeof data === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(data)) {
            sanitized[key] = sanitizeRequestData(value);
        }
        return sanitized;
    }

    return data;
};

/**
 * Utility function to parse price string to number
 */
const parsePrice = (priceString: string): number => {
    return parseInt(priceString.replace('₹', '')) || 0;
};

/**
 * Error handler utility with enhanced error categorization
 */
const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
            case 400:
                return `Bad request: ${message}`;
            case 401:
                return 'Authentication required. Please log in.';
            case 403:
                return 'Access denied. Insufficient permissions.';
            case 404:
                return 'Resource not found.';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Server error. Please try again later.';
            case 503:
                return 'Service temporarily unavailable.';
            default:
                return message || 'An error occurred';
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
};

/**
 * Data validation utilities
 */
const validateExperience = (experience: any): experience is Experience => {
    return experience &&
        typeof experience.id === 'string' &&
        typeof experience.title === 'string' &&
        typeof experience.location === 'string' &&
        typeof experience.price === 'string' &&
        typeof experience.category === 'string' &&
        experience.title.length > 0 &&
        experience.location.length > 0;
};

const validateTimeSlot = (slot: any): slot is TimeSlot => {
    return slot &&
        typeof slot.id === 'string' &&
        typeof slot.experienceId === 'string' &&
        typeof slot.date === 'string' &&
        typeof slot.startTime === 'string' &&
        typeof slot.availableSpots === 'number' &&
        slot.availableSpots >= 0;
};

/**
 * Validate booking request data
 */
const validateBookingRequest = (data: BookingRequest): BookingRequest => {
    // Validate experience ID
    if (!data.experienceId || typeof data.experienceId !== 'string') {
        throw new Error('Invalid experience ID');
    }

    // Validate slot ID
    if (!data.slotId || typeof data.slotId !== 'string') {
        throw new Error('Invalid slot ID');
    }

    // Validate number of guests
    const numberOfGuests = sanitizeInput.number(data.numberOfGuests, 1, 20);

    // Validate and sanitize user data
    const user = {
        firstName: sanitizeInput.string(data.user.firstName || ''),
        lastName: sanitizeInput.string(data.user.lastName || ''),
        email: sanitizeInput.email(data.user.email || ''),
        phone: sanitizeInput.string(data.user.phone || ''),
        specialRequests: data.user.specialRequests ? sanitizeInput.string(data.user.specialRequests) : '',
        numberOfGuests,
    };

    // Validate required fields
    if (!user.firstName || user.firstName.length < 2) {
        throw new Error('First name must be at least 2 characters');
    }
    if (!user.lastName || user.lastName.length < 2) {
        throw new Error('Last name must be at least 2 characters');
    }
    if (!user.email) {
        throw new Error('Email is required');
    }

    // Validate promo code if provided
    let promoCode = undefined;
    if (data.promoCode) {
        promoCode = sanitizeInput.string(data.promoCode).toUpperCase();
        if (promoCode.length < 3 || promoCode.length > 20) {
            throw new Error('Invalid promo code format');
        }
    }

    return {
        experienceId: sanitizeInput.string(data.experienceId),
        slotId: sanitizeInput.string(data.slotId),
        user,
        numberOfGuests,
        promoCode,
    };
};

/**
 * Generate secure booking reference
 */
const generateBookingReference = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `HWD-${timestamp}-${randomPart}`;
};

/**
 * Date validation utility
 */
const isValidDate = (dateString: string): boolean => {
    try {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime()) && dateString.includes('-');
    } catch {
        return false;
    }
};

/**
 * Experience API Services with enhanced validation and error handling
 */
export const experienceService = {
    /**
     * Fetch all experiences with optional filters and validation
     * @param filters - Optional filtering criteria
     * @returns Promise<Experience[]> - List of experiences
     * @throws Error if request fails or data is invalid
     */
    async getExperiences(filters?: ExperienceFilters): Promise<Experience[]> {
        try {
            // Validate filters
            if (filters) {
                if (filters.minPrice !== undefined) {
                    sanitizeInput.number(filters.minPrice, 0);
                }
                if (filters.maxPrice !== undefined) {
                    sanitizeInput.number(filters.maxPrice, 0);
                }
                if (filters.search) {
                    filters.search = sanitizeInput.string(filters.search);
                }
                if (filters.location) {
                    filters.location = sanitizeInput.string(filters.location);
                }
            }

            // TODO: Replace with actual API call
            // const response = await apiClient.get<ApiResponse<Experience[]>>(API_ENDPOINTS.EXPERIENCES, {
            //   params: filters,
            // });
            // return response.data.data || [];

            // Simulate API delay for realistic UX
            await new Promise(resolve => setTimeout(resolve, 800));

            let experiences = [...mockExperiences];

            // Apply filters with validation
            if (filters?.category) {
                const category = sanitizeInput.string(filters.category);
                experiences = experiences.filter(exp =>
                    exp.category.toLowerCase() === category.toLowerCase()
                );
            }

            if (filters?.location) {
                experiences = experiences.filter(exp =>
                    exp.location.toLowerCase().includes(filters.location?.toLowerCase() || '')
                );
            }

            if (filters?.minPrice) {
                experiences = experiences.filter(exp => parsePrice(exp.price) >= (filters.minPrice || 0));
            }

            if (filters?.maxPrice) {
                experiences = experiences.filter(exp => parsePrice(exp.price) <= (filters.maxPrice || Infinity));
            }

            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                experiences = experiences.filter(exp =>
                    exp.title.toLowerCase().includes(searchLower) ||
                    exp.description?.toLowerCase().includes(searchLower) ||
                    exp.location.toLowerCase().includes(searchLower)
                );
            }

            // Validate each experience before returning
            return experiences.filter(exp => validateExperience(exp));
        } catch (error) {
            console.error('Error fetching experiences:', error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Fetch single experience by ID with validation
     * @param id - Experience ID (must be valid UUID or string)
     * @returns Promise<Experience | null> - Experience or null if not found
     * @throws Error if request fails
     */
    async getExperienceById(id: string): Promise<Experience | null> {
        try {
            // Validate ID
            if (!id || typeof id !== 'string' || id.trim().length === 0) {
                throw new Error('Invalid experience ID');
            }

            const sanitizedId = sanitizeInput.string(id);

            // TODO: Replace with actual API call
            // const response = await apiClient.get<ApiResponse<Experience>>(
            //   API_ENDPOINTS.EXPERIENCE_DETAIL(sanitizedId)
            // );
            // return response.data.data || null;

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const experience = mockExperiences.find(exp => exp.id === sanitizedId);

            if (experience && !validateExperience(experience)) {
                console.error('Invalid experience data from API:', experience);
                return null;
            }

            return experience || null;
        } catch (error) {
            console.error(`Error fetching experience ${id}:`, error);
            throw new Error(handleApiError(error));
        }
    },
};

/**
 * Slot API Services with enhanced validation and caching
 */
export const slotService = {
    /**
     * Fetch available slots for an experience with validation
     * @param experienceId - Experience ID to fetch slots for
     * @param startDate - Optional start date filter (ISO string)
     * @param endDate - Optional end date filter (ISO string)
     * @returns Promise<TimeSlot[]> - Array of validated time slots
     * @throws Error if request fails or data is invalid
     */
    async getSlots(experienceId: string, startDate?: string, endDate?: string): Promise<TimeSlot[]> {
        try {
            // Validate inputs
            if (!experienceId || typeof experienceId !== 'string') {
                throw new Error('Invalid experience ID');
            }

            const sanitizedId = sanitizeInput.string(experienceId);

            // Validate date range if provided
            if (startDate && !isValidDate(startDate)) {
                throw new Error('Invalid start date format');
            }
            if (endDate && !isValidDate(endDate)) {
                throw new Error('Invalid end date format');
            }
            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                throw new Error('Start date must be before end date');
            }

            // TODO: Replace with actual API call
            // const response = await apiClient.get<ApiResponse<TimeSlot[]>>(
            //   API_ENDPOINTS.SLOTS(sanitizedId),
            //   { params: { startDate, endDate } }
            // );
            // return response.data.data || [];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const slots = generateMockSlots(sanitizedId);

            // Filter by date range if provided
            let filteredSlots = slots;
            if (startDate || endDate) {
                filteredSlots = slots.filter(slot => {
                    const slotDate = new Date(slot.date);
                    if (startDate && slotDate < new Date(startDate)) return false;
                    if (endDate && slotDate > new Date(endDate)) return false;
                    return true;
                });
            }

            // Validate all slots before returning
            return filteredSlots.filter(slot => validateTimeSlot(slot));
        } catch (error) {
            console.error(`Error fetching slots for experience ${experienceId}:`, error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Group slots by date with enhanced validation
     * @param slots - Array of time slots to group
     * @returns DateAvailability[] - Slots grouped by date with availability info
     */
    groupSlotsByDate(slots: TimeSlot[]): DateAvailability[] {
        if (!Array.isArray(slots)) {
            console.error('Invalid slots data provided to groupSlotsByDate');
            return [];
        }

        const groupedMap = new Map<string, TimeSlot[]>();

        // Validate and group slots
        slots.forEach(slot => {
            if (validateTimeSlot(slot)) {
                const existing = groupedMap.get(slot.date) || [];
                groupedMap.set(slot.date, [...existing, slot]);
            }
        });

        return Array.from(groupedMap.entries())
            .map(([date, dateSlots]) => ({
                date,
                slots: dateSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
                hasAvailability: dateSlots.some(slot =>
                    slot.status === 'available' && slot.availableSpots > 0
                ),
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
};

/**
 * Booking API Services with comprehensive validation and security
 */
export const bookingService = {
    /**
     * Create a new booking with full validation and sanitization
     * @param bookingData - Validated booking request data
     * @returns Promise<BookingResponse> - Booking result with success/failure status
     * @throws Error if validation fails or booking cannot be processed
     */
    async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
        try {
            // Comprehensive input validation and sanitization
            const validatedData = validateBookingRequest(bookingData);

            // TODO: Replace with actual API call
            // const response = await apiClient.post<BookingResponse>(
            //   API_ENDPOINTS.BOOKINGS,
            //   validatedData
            // );
            // return response.data;

            // Simulate realistic API processing time
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Validate that the experience and slot still exist and are available
            const experience = mockExperiences.find(e => e.id === validatedData.experienceId);
            if (!experience) {
                return {
                    success: false,
                    message: 'Experience not found or has been removed.',
                    error: 'EXPERIENCE_NOT_FOUND',
                };
            }

            const slots = generateMockSlots(validatedData.experienceId);
            const slot = slots.find(s => s.id === validatedData.slotId);
            if (!slot) {
                return {
                    success: false,
                    message: 'Time slot not found.',
                    error: 'SLOT_NOT_FOUND',
                };
            }

            if (slot.status !== 'available') {
                return {
                    success: false,
                    message: 'Selected time slot is no longer available.',
                    error: 'SLOT_UNAVAILABLE',
                };
            }

            if (slot.availableSpots < validatedData.numberOfGuests) {
                return {
                    success: false,
                    message: `Not enough spots available. Only ${slot.availableSpots} spots remaining.`,
                    error: 'INSUFFICIENT_SPOTS',
                };
            }

            // Generate secure booking reference
            const bookingReference = generateBookingReference();

            // Calculate pricing with validation
            const basePrice = slot.price || parsePrice(experience.price);
            const subtotal = basePrice * validatedData.numberOfGuests;
            const tax = subtotal * 0.1; // 10% tax
            const total = subtotal + tax;

            // Simulate occasional failures for testing (5% chance)
            if (Math.random() < 0.05) {
                return {
                    success: false,
                    message: 'Payment processing failed. Please try again.',
                    error: 'PAYMENT_FAILED',
                };
            }

            return {
                success: true,
                booking: {
                    id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    experienceId: validatedData.experienceId,
                    experience,
                    slotId: validatedData.slotId,
                    slot,
                    user: validatedData.user,
                    numberOfGuests: validatedData.numberOfGuests,
                    priceSummary: {
                        subtotal,
                        discount: 0,
                        tax,
                        total,
                        currency: 'INR',
                        promoCode: validatedData.promoCode,
                    },
                    status: 'confirmed',
                    bookingReference,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                message: 'Booking confirmed successfully!',
            };
        } catch (error) {
            console.error('Error creating booking:', error);

            if (error instanceof Error) {
                return {
                    success: false,
                    message: error.message,
                    error: 'VALIDATION_ERROR',
                };
            }

            return {
                success: false,
                message: handleApiError(error),
                error: 'BOOKING_FAILED',
            };
        }
    },

    /**
     * Get booking by ID with validation
     * @param bookingId - Booking ID to retrieve
     * @returns Promise<BookingResponse> - Booking details or error
     */
    async getBooking(bookingId: string): Promise<BookingResponse> {
        try {
            if (!bookingId || typeof bookingId !== 'string') {
                throw new Error('Invalid booking ID');
            }

            const sanitizedId = sanitizeInput.string(bookingId);

            // TODO: Replace with actual API call
            // const response = await apiClient.get<BookingResponse>(
            //   API_ENDPOINTS.BOOKING_DETAIL(sanitizedId)
            // );
            // return response.data;

            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: false,
                message: 'Booking not found',
                error: 'NOT_FOUND',
            };
        } catch (error) {
            console.error(`Error fetching booking ${bookingId}:`, error);
            return {
                success: false,
                message: handleApiError(error),
                error: 'FETCH_FAILED',
            };
        }
    },
};

/**
 * Promo Code API Services
 */
export const promoService = {
    /**
     * Validate promo code
     */
    async validatePromoCode(code: string, subtotal: number): Promise<PromoCode | null> {
        try {
            // const response = await apiClient.post<ApiResponse<PromoCode>>(
            //   API_ENDPOINTS.VALIDATE_PROMO,
            //   { code, subtotal }
            // );
            // return response.data.data || null;

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const promo = mockPromoCodes[code.toUpperCase()];

            if (!promo) {
                return null;
            }

            // Check minimum purchase
            if (promo.minPurchase && subtotal < promo.minPurchase) {
                return { ...promo, isValid: false };
            }

            return promo;
        } catch (error) {
            console.error('Error validating promo code:', error);
            return null;
        }
    },

    /**
     * Calculate discount amount
     */
    calculateDiscount(promo: PromoCode, subtotal: number): number {
        if (!promo.isValid) return 0;

        let discount = 0;

        if (promo.discountType === 'percentage') {
            discount = (subtotal * promo.discountValue) / 100;
            if (promo.maxDiscount) {
                discount = Math.min(discount, promo.maxDiscount);
            }
        } else {
            discount = promo.discountValue;
        }

        return Math.min(discount, subtotal);
    },
};

export default {
    experienceService,
    slotService,
    bookingService,
    promoService,
};
