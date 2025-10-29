import { Router } from 'express';
import {
    getAllExperiences,
    getExperienceById,
    getExperienceCategories,
    getExperienceLocations,
    getFeaturedExperiences,
    searchExperiences,
} from '../controllers/experience.controller.js';

const router = Router();

// GET /api/v1/experiences - Get all experiences with filtering and pagination
router.route('/').get(getAllExperiences);

// GET /api/v1/experiences/categories - Get experience categories
router.route('/categories').get(getExperienceCategories);

// GET /api/v1/experiences/locations - Get experience locations
router.route('/locations').get(getExperienceLocations);

// GET /api/v1/experiences/featured - Get featured experiences
router.route('/featured').get(getFeaturedExperiences);

// POST /api/v1/experiences/search - Advanced search experiences
router.route('/search').post(searchExperiences);

// GET /api/v1/experiences/:id - Get experience by ID with time slots
router.route('/:id').get(getExperienceById);

export default router;