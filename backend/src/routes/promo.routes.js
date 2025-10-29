import { Router } from 'express';
import {
    validatePromoCode,
    getAvailablePromoCodes,
} from '../controllers/booking.controller.js';

const router = Router();

// POST /api/v1/promo/validate - Validate promo code
router.route('/validate').post(validatePromoCode);

// GET /api/v1/promo/available - Get available promo codes
router.route('/available').get(getAvailablePromoCodes);

export default router;