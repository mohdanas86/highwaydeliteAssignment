/**
 * API Service Layer
 * Handles all API calls and data fetching with proper error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
    Experience,
    TimeSlot,
    DateAvailability,
    BookingRequest,
    BookingResponse,
    ApiResponse,
    PromoCode,
    ExperienceFilters,
    PaginatedResponse,
} from '@/types';
import { API_BASE_URL, API_ENDPOINTS, API_CONFIG } from '@/lib/config/api.config';
import { mockExperiences, generateMockSlots, mockPromoCodes } from '@/lib/data/mockData';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Handle unauthorized
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Utility function to parse price string to number
 */
const parsePrice = (priceString: string): number => {
    return parseInt(priceString.replace('₹', '')) || 0;
};

/**
 * Error handler utility
 */
const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
};

/**
 * Experience API Services
 */
export const experienceService = {
    /**
     * Fetch all experiences with optional filters
     */
    async getExperiences(filters?: ExperienceFilters): Promise<Experience[]> {
        try {
            // For now, using mock data - replace with actual API call
            // const response = await apiClient.get<ApiResponse<Experience[]>>(API_ENDPOINTS.EXPERIENCES, {
            //   params: filters,
            // });
            // return response.data.data || [];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            let experiences = [...mockExperiences];

            // Apply filters
            if (filters?.category) {
                experiences = experiences.filter(exp =>
                    exp.category.toLowerCase() === filters.category?.toLowerCase()
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

            return experiences;
        } catch (error) {
            console.error('Error fetching experiences:', error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Fetch single experience by ID
     */
    async getExperienceById(id: string): Promise<Experience | null> {
        try {
            // const response = await apiClient.get<ApiResponse<Experience>>(
            //   API_ENDPOINTS.EXPERIENCE_DETAIL(id)
            // );
            // return response.data.data || null;

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const experience = mockExperiences.find(exp => exp.id === id);
            return experience || null;
        } catch (error) {
            console.error(`Error fetching experience ${id}:`, error);
            throw new Error(handleApiError(error));
        }
    },
};

/**
 * Slot API Services
 */
export const slotService = {
    /**
     * Fetch available slots for an experience
     */
    async getSlots(experienceId: string, startDate?: string, endDate?: string): Promise<TimeSlot[]> {
        try {
            // const response = await apiClient.get<ApiResponse<TimeSlot[]>>(
            //   API_ENDPOINTS.SLOTS(experienceId),
            //   { params: { startDate, endDate } }
            // );
            // return response.data.data || [];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600));

            return generateMockSlots(experienceId);
        } catch (error) {
            console.error(`Error fetching slots for experience ${experienceId}:`, error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Group slots by date
     */
    groupSlotsByDate(slots: TimeSlot[]): DateAvailability[] {
        const groupedMap = new Map<string, TimeSlot[]>();

        slots.forEach(slot => {
            const existing = groupedMap.get(slot.date) || [];
            groupedMap.set(slot.date, [...existing, slot]);
        });

        return Array.from(groupedMap.entries()).map(([date, dateSlots]) => ({
            date,
            slots: dateSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
            hasAvailability: dateSlots.some(slot => slot.status === 'available'),
        }));
    },
};

/**
 * Booking API Services
 */
export const bookingService = {
    /**
     * Create a new booking
     */
    async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
        try {
            // const response = await apiClient.post<BookingResponse>(
            //   API_ENDPOINTS.BOOKINGS,
            //   bookingData
            // );
            // return response.data;

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful booking
            const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            // Simulate occasional failures (10% chance)
            if (Math.random() < 0.1) {
                return {
                    success: false,
                    message: 'Booking failed. The selected slot is no longer available.',
                    error: 'SLOT_UNAVAILABLE',
                };
            }

            const experience = mockExperiences.find(e => e.id === bookingData.experienceId);
            const slots = generateMockSlots(bookingData.experienceId);
            const slot = slots.find(s => s.id === bookingData.slotId);

            // Parse price from string format (e.g., "₹999" -> 999)
            const basePrice = slot?.price || parsePrice(experience?.price || '₹100');

            return {
                success: true,
                booking: {
                    id: `booking-${Date.now()}`,
                    experienceId: bookingData.experienceId,
                    experience,
                    slotId: bookingData.slotId,
                    slot,
                    user: bookingData.user,
                    numberOfGuests: bookingData.numberOfGuests,
                    priceSummary: {
                        subtotal: basePrice * bookingData.numberOfGuests,
                        discount: 0,
                        tax: (basePrice * bookingData.numberOfGuests) * 0.1,
                        total: (basePrice * bookingData.numberOfGuests) * 1.1,
                        currency: 'INR',
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
            return {
                success: false,
                message: handleApiError(error),
                error: 'BOOKING_FAILED',
            };
        }
    },

    /**
     * Get booking by ID
     */
    async getBooking(bookingId: string): Promise<BookingResponse> {
        try {
            // const response = await apiClient.get<BookingResponse>(
            //   API_ENDPOINTS.BOOKING_DETAIL(bookingId)
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
