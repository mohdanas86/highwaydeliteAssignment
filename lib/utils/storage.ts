/**
 * Client-side Storage Utilities
 * Type-safe helper functions for sessionStorage and localStorage with error handling
 * 
 * @example
 * ```typescript
 * // Store booking data
 * storage.session.set(STORAGE_KEYS.BOOKING_DATA, bookingData);
 * 
 * // Retrieve booking data
 * const bookingData = storage.session.get<BookingData>(STORAGE_KEYS.BOOKING_DATA);
 * ```
 */

/**
 * Type-safe storage operations with comprehensive error handling
 */
export const storage = {
    /**
     * Session Storage
     */
    session: {
        get: <T>(key: string): T | null => {
            if (typeof window === 'undefined') return null;
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error(`Error reading ${key} from sessionStorage:`, error);
                return null;
            }
        },

        set: <T>(key: string, value: T): void => {
            if (typeof window === 'undefined') return;
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(`Error writing ${key} to sessionStorage:`, error);
            }
        },

        remove: (key: string): void => {
            if (typeof window === 'undefined') return;
            try {
                sessionStorage.removeItem(key);
            } catch (error) {
                console.error(`Error removing ${key} from sessionStorage:`, error);
            }
        },

        clear: (): void => {
            if (typeof window === 'undefined') return;
            try {
                sessionStorage.clear();
            } catch (error) {
                console.error('Error clearing sessionStorage:', error);
            }
        },
    },

    /**
     * Local Storage
     */
    local: {
        get: <T>(key: string): T | null => {
            if (typeof window === 'undefined') return null;
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error(`Error reading ${key} from localStorage:`, error);
                return null;
            }
        },

        set: <T>(key: string, value: T): void => {
            if (typeof window === 'undefined') return;
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(`Error writing ${key} to localStorage:`, error);
            }
        },

        remove: (key: string): void => {
            if (typeof window === 'undefined') return;
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error(`Error removing ${key} from localStorage:`, error);
            }
        },

        clear: (): void => {
            if (typeof window === 'undefined') return;
            try {
                localStorage.clear();
            } catch (error) {
                console.error('Error clearing localStorage:', error);
            }
        },
    },
};

/**
 * Storage Keys - Centralized key management to prevent typos and conflicts
 * Use these constants instead of string literals throughout the application
 */
export const STORAGE_KEYS = {
    /** Temporary booking data during checkout flow */
    BOOKING_DATA: 'highway_delite_booking_data',
    /** Completed booking result */
    BOOKING_RESULT: 'highway_delite_booking_result',
    /** JWT authentication token */
    AUTH_TOKEN: 'highway_delite_auth_token',
    /** User preferences and settings */
    USER_PREFERENCES: 'highway_delite_user_preferences',
    /** Search history for better UX */
    SEARCH_HISTORY: 'highway_delite_search_history',
    /** Recently viewed experiences */
    RECENT_EXPERIENCES: 'highway_delite_recent_experiences',
} as const;

/**
 * Type definitions for stored data
 */
export interface StoredBookingData {
    experience: any; // Replace with proper Experience type
    slot: any; // Replace with proper TimeSlot type
    numberOfGuests: number;
    timestamp: number;
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    currency: string;
    language: string;
    notifications: boolean;
}

/**
 * Utility functions for data validation before storage
 */
export const storageValidators = {
    isValidBookingData: (data: any): data is StoredBookingData => {
        return data &&
            data.experience &&
            data.slot &&
            typeof data.numberOfGuests === 'number' &&
            data.numberOfGuests > 0;
    },

    isExpired: (timestamp: number, maxAgeMs: number = 24 * 60 * 60 * 1000): boolean => {
        return Date.now() - timestamp > maxAgeMs;
    },
};
