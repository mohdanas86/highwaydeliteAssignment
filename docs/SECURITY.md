# Security Guidelines

## Overview
This document outlines the security measures implemented in the Highway Delite booking application and provides guidelines for maintaining security standards.

## Client-Side Security Measures

### 1. Input Sanitization
All user inputs are sanitized to prevent XSS attacks:

```typescript
// Example: String sanitization
const sanitizeInput = {
    string: (input: string): string => {
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/[<>'"]/g, '') // Remove dangerous characters
            .trim();
    },
    
    email: (email: string): string => {
        const sanitized = email.toLowerCase().trim();
        if (!emailRegex.test(sanitized)) {
            throw new Error('Invalid email format');
        }
        return sanitized;
    }
};
```

### 2. Rate Limiting
Client-side rate limiting prevents API abuse:

```typescript
const rateLimiter = {
    isAllowed: (endpoint: string, limit: number = 10, windowMs: number = 60000): boolean => {
        // Implementation tracks requests per endpoint
        // Returns false if limit exceeded
    }
};
```

### 3. Secure Data Storage
Type-safe storage utilities with error handling:

```typescript
// Secure storage with validation
export const storage = {
    session: {
        get: <T>(key: string): T | null => {
            // Safe parsing with try-catch
        },
        set: <T>(key: string, value: T): void => {
            // Secure storage with error handling
        }
    }
};
```

### 4. Request Security
Enhanced Axios configuration:

```typescript
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    },
    withCredentials: false, // Only when needed
});
```

## Data Validation

### 1. TypeScript Type Safety
Comprehensive type definitions prevent runtime errors:

```typescript
interface BookingRequest {
    experienceId: string;
    slotId: string;
    user: BookingFormData;
    numberOfGuests: number;
    promoCode?: string;
}
```

### 2. Runtime Validation
All API inputs are validated at runtime:

```typescript
const validateBookingRequest = (data: BookingRequest): BookingRequest => {
    // Comprehensive validation with error messages
    if (!data.experienceId || typeof data.experienceId !== 'string') {
        throw new Error('Invalid experience ID');
    }
    // ... more validations
};
```

### 3. Business Logic Validation
Booking constraints and availability checks:

```typescript
// Validate slot availability
if (slot.availableSpots < validatedData.numberOfGuests) {
    return {
        success: false,
        message: `Not enough spots available. Only ${slot.availableSpots} spots remaining.`,
        error: 'INSUFFICIENT_SPOTS',
    };
}
```

## Security Best Practices

### 1. Error Handling
- Never expose sensitive information in error messages
- Use generic error messages for client-facing errors
- Log detailed errors server-side only

### 2. Authentication
- Use secure JWT tokens with proper expiration
- Implement token refresh mechanisms
- Clear tokens on logout or expiration

### 3. Data Transmission
- All API calls use HTTPS in production
- Sensitive data is never logged or stored in localStorage
- Session data has proper expiration

### 4. Frontend Security
- Content Security Policy (CSP) headers
- No inline scripts or styles
- Proper CORS configuration

## Vulnerability Prevention

### 1. XSS Prevention
- All user inputs are sanitized
- Use of React's built-in XSS protection
- No innerHTML usage, only textContent

### 2. CSRF Prevention
- Custom headers on all requests
- SameSite cookie attributes
- Verification of request origin

### 3. Injection Prevention
- Parameterized queries for database operations
- Input validation and sanitization
- Whitelist validation for all inputs

## Security Checklist

### Development
- [ ] All user inputs are validated and sanitized
- [ ] TypeScript strict mode is enabled
- [ ] No sensitive data in client-side code
- [ ] Proper error handling without information leakage
- [ ] Rate limiting implemented

### Production
- [ ] HTTPS only
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

## Reporting Security Issues
If you discover a security vulnerability, please:
1. Do not open a public issue
2. Email security concerns to: security@highwaydelite.com
3. Provide detailed information about the vulnerability
4. Allow time for investigation before public disclosure

## Security Dependencies
Regular updates of security-related dependencies:
- `axios` - HTTP client with security features
- `next` - Framework with built-in security measures
- Regular `npm audit` checks

## Compliance
This application follows:
- OWASP Top 10 security guidelines
- SOC 2 Type II standards
- PCI DSS for payment processing
- GDPR for data protection