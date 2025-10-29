import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from '../controllers/user.controllers.js';

// Create a router instance
const userRouter = Router();

// Route for user registration
userRouter
    .route('/register')
    .post(
        upload.fields([
            {
                name: 'avatar',
                maxCount: 1,
            },
            {
                name: 'coverImage',
                maxCount: 1,
            },
        ]),
        registerUser
    );

// Route for user login
userRouter
    .route('/login')
    .post(loginUser);

// ======================================================================
// secured route only for logged in users
// ======================================================================

// Route for user logout
userRouter
    .route('/logout')
    .post(verifyJWT, logoutUser);

// Route for refreshing access token
userRouter
    .route("/refresh-token")
    .post(refreshAccessToken)

// Export the router to be used in the main application
export default userRouter;
