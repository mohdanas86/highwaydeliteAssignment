import { Router } from 'express';
import {
    createBooking,
    getBookingByReference,
    getBookingsByEmail,
    cancelBooking,
} from '../controllers/booking.controller.js';

const router = Router();

// POST /api/v1/bookings - Create a new booking
router.route('/').post(createBooking);

// GET /api/v1/bookings/:reference - Get booking by reference
router.route('/:reference').get(getBookingByReference);

// PATCH /api/v1/bookings/:reference/cancel - Cancel booking
router.route('/:reference/cancel').patch(cancelBooking);

// GET /api/v1/bookings/user/:email - Get bookings by email
router.route('/user/:email').get(getBookingsByEmail);

export default router;