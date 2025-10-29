# Backend API Requirements

## Overview
This document outlines the required backend API endpoints and data models needed for the Highway Delite booking application.

## Base Configuration
- **Base URL**: `https://api.highwaydelite.com/v1`
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **Rate Limiting**: 100 requests per minute per IP

## Security Requirements

### Authentication
```typescript
// JWT Token Structure
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "customer" | "admin",
  "iat": timestamp,
  "exp": timestamp
}
```

### Security Headers
- CORS configuration for allowed origins
- Rate limiting with Redis
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Data Models

### Experience Model
```typescript
interface Experience {
  id: string; // UUID v4
  title: string; // max 100 characters
  location: string; // max 50 characters
  shortDescription: string; // max 200 characters
  description?: string; // max 1000 characters
  price: number; // in smallest currency unit (paise for INR)
  currency: string; // ISO 4217 (INR, USD, etc.)
  category: string; // enum: adventure, cultural, food, nature, etc.
  duration: string; // format: "2 hours", "1 day"
  maxGroupSize: number; // min: 1, max: 50
  rating: number; // 0-5, decimal allowed
  reviewCount: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  highlights: string[]; // max 5 items
  included: string[]; // what's included in the experience
  excluded: string[]; // what's not included
  cancellationPolicy: string;
  imageUrl: string; // CDN URL
  imageAlt: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### TimeSlot Model
```typescript
interface TimeSlot {
  id: string; // UUID v4
  experienceId: string; // foreign key
  date: Date; // ISO date
  startTime: string; // format: "HH:mm" (24-hour)
  endTime: string; // format: "HH:mm" (24-hour)
  availableSpots: number;
  totalSpots: number;
  price: number; // override experience price if needed
  status: 'available' | 'sold-out' | 'cancelled';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Booking Model
```typescript
interface Booking {
  id: string; // UUID v4
  bookingReference: string; // unique human-readable ID
  experienceId: string;
  slotId: string;
  userId?: string; // optional for guest bookings
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  numberOfGuests: number;
  priceSummary: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
    promoCode?: string;
  };
  paymentInfo: {
    paymentId: string;
    method: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### PromoCode Model
```typescript
interface PromoCode {
  id: string;
  code: string; // unique, uppercase
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  applicableExperiences?: string[]; // specific experiences or null for all
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Experiences
```
GET /experiences
- Query params: category, location, minPrice, maxPrice, search, page, limit
- Response: Paginated list of experiences

GET /experiences/:id
- Response: Single experience details

POST /experiences (Admin only)
- Create new experience

PUT /experiences/:id (Admin only)
- Update experience

DELETE /experiences/:id (Admin only)
- Soft delete experience
```

### Time Slots
```
GET /experiences/:experienceId/slots
- Query params: startDate, endDate
- Response: Available time slots for date range

POST /experiences/:experienceId/slots (Admin only)
- Create time slots

PUT /slots/:id (Admin only)
- Update slot availability

DELETE /slots/:id (Admin only)
- Cancel slot
```

### Bookings
```
POST /bookings
- Create new booking
- Include payment processing
- Send confirmation email

GET /bookings/:id
- Get booking details by ID

GET /bookings
- Get user's bookings (authenticated)

PUT /bookings/:id/cancel
- Cancel booking with refund logic

GET /admin/bookings (Admin only)
- Get all bookings with filters
```

### Promo Codes
```
POST /promo/validate
- Validate promo code and calculate discount

GET /admin/promo-codes (Admin only)
- List all promo codes

POST /admin/promo-codes (Admin only)
- Create new promo code
```

## Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string; // ERROR_CODE
    message: string; // User-friendly message
    details?: any; // Additional error details for debugging
    timestamp: string;
    path: string;
  };
}
```

### Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `SLOT_UNAVAILABLE`: Time slot no longer available
- `PAYMENT_FAILED`: Payment processing failed
- `PROMO_INVALID`: Invalid or expired promo code
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Validation Rules

### Input Validation
- All string inputs must be trimmed and sanitized
- Email validation with proper regex
- Phone number validation (international format)
- Date validation (future dates only for bookings)
- Price validation (positive numbers only)
- Enum validation for status fields

### Business Rules
- Bookings can only be made for future dates
- Cannot book more than available spots
- Promo codes have usage limits and expiry dates
- Cancellation allowed up to 24 hours before experience
- Payment must be completed within 15 minutes of booking

## Database Considerations

### Indexes
- Experience: category, location, isActive
- TimeSlot: experienceId, date, status
- Booking: userId, bookingReference, status
- PromoCode: code, validTo, isActive

### Constraints
- Unique booking reference
- Unique promo code
- Foreign key constraints
- Check constraints for positive prices and dates

## Integration Requirements

### Payment Gateway
- Razorpay/Stripe integration
- Webhook handling for payment status
- Refund processing
- Transaction logging

### Email Service
- Booking confirmation emails
- Cancellation notifications
- Payment receipts
- Reminder emails

### File Storage
- CDN for experience images
- Secure URL generation
- Image optimization and resizing

## Monitoring and Logging
- API request/response logging
- Performance monitoring
- Error tracking
- Business metrics (bookings, revenue, etc.)