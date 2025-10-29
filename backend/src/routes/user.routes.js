import { Router } from 'express';
// Commented out authentication-related imports for basic booking system
// import { verifyJWT } from '../middlewares/auth.middleware.js';
// import { upload } from '../middlewares/multer.middleware.js';
// import {
//     registerUser,
//     loginUser,
//     logoutUser,
//     refreshAccessToken
// } from '../controllers/user.controllers.js';

// Create a router instance
const userRouter = Router();

// Basic health check for user routes
userRouter.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User routes are working',
        timestamp: new Date().toISOString(),
    });
});

// Future authentication routes can be added here
// userRouter.route('/register').post(registerUser);
// userRouter.route('/login').post(loginUser);
// userRouter.route('/logout').post(verifyJWT, logoutUser);
// userRouter.route('/refresh-token').post(refreshAccessToken);

// Export the router to be used in the main application
export default userRouter;
