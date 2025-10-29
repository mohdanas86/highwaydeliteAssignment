import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    })
);
app.use(express.json({ limit: '16Kb' }));
app.use(express.urlencoded({ extended: true, limit: '16Kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// import routes here
import userRouter from './routes/user.routes.js';
import experienceRouter from './routes/experience.routes.js';
import bookingRouter from './routes/booking.routes.js';
import promoRouter from './routes/promo.routes.js';

// Use routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/experiences', experienceRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/promo', promoRouter);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Highway Delite API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        statusCode: 404,
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];

    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errors = Object.values(err.errors).map(val => val.message);
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value';
        const field = Object.keys(err.keyValue)[0];
        errors = [`${field} already exists`];
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        errors = ['Invalid resource ID'];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

export { app };
