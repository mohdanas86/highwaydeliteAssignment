/**
 * Client-side Storage Utilities
 * Helper functions for sessionStorage and localStorage
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
 * Booking Data Keys
 */
export const STORAGE_KEYS = {
    BOOKING_DATA: 'bookingData',
    BOOKING_RESULT: 'bookingResult',
    AUTH_TOKEN: 'authToken',
    USER_PREFERENCES: 'userPreferences',
} as const;
