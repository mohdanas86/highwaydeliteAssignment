# BookIt: Experiences & Slots

A fullstack web application for booking travel experiences and activities. Users can explore curated experiences, select available time slots, and complete bookings through a seamless checkout process.

## Overview

This project is a complete end-to-end booking platform built as part of a fullstack intern assignment. It demonstrates modern web development practices with a responsive frontend and robust backend API, featuring real-time availability checking, secure booking management, and comprehensive error handling.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI with custom shadcn/ui components
- **HTTP Client**: Axios with interceptors for security and error handling
- **State Management**: React hooks with local storage utilities

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Bearer tokens)
- **Validation**: Built-in Mongoose validation with custom middleware
- **Security**: CORS, input sanitization, rate limiting

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Version Control**: Git

## Features

### Core Functionality
- **Experience Discovery**: Browse curated travel experiences with filtering and search
- **Detailed Experience Pages**: View comprehensive experience information, availability, and reviews
- **Time Slot Selection**: Interactive calendar with real-time availability checking
- **Secure Booking Process**: Multi-step checkout with form validation
- **Promo Code Support**: Discount codes with validation and automatic calculation
- **Booking Confirmation**: Instant confirmation with unique booking references
- **Responsive Design**: Mobile-first design matching Figma specifications

### Technical Features
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Error Handling**: Comprehensive error boundaries and API error responses
- **Loading States**: Skeleton loaders and progress indicators
- **Input Validation**: Client and server-side validation with sanitization
- **Security**: CSRF protection, XSS prevention, and secure headers
- **Performance**: Optimized images, lazy loading, and efficient API calls

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest version (comes with Node.js)
- **MongoDB**: Local installation or cloud instance (MongoDB Atlas)
- **Git**: For version control

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/highwaydeliteAssignment.git
   cd highwaydeliteAssignment
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## Environment Setup

### Frontend Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/highwaydelite
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

3. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## API Documentation

The backend provides RESTful APIs for managing experiences, bookings, and promo codes.

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication
All protected endpoints require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Experiences
- `GET /experiences` - List all experiences with optional filters
- `GET /experiences/:id` - Get experience details
- `POST /experiences` - Create new experience (Admin only)
- `PUT /experiences/:id` - Update experience (Admin only)
- `DELETE /experiences/:id` - Delete experience (Admin only)

#### Bookings
- `POST /bookings` - Create new booking
- `GET /bookings/:id` - Get booking details
- `GET /bookings` - Get user's bookings (Authenticated)
- `PUT /bookings/:id/cancel` - Cancel booking

#### Promo Codes
- `POST /promo/validate` - Validate promo code

#### Time Slots
- `GET /experiences/:experienceId/slots` - Get available slots
- `POST /experiences/:experienceId/slots` - Create slots (Admin only)

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Database Schema

### Experience Model
- Basic info: title, description, location, category
- Pricing: price, currency, discount information
- Details: duration, difficulty, max group size
- Media: images with alt text
- Metadata: ratings, reviews, highlights

### Booking Model
- Customer info: name, email, phone, special requests
- Booking details: experience, time slot, number of guests
- Pricing: base price, discounts, final amount
- Status tracking: pending, confirmed, cancelled, completed
- Payment info: method, status, transaction details

### TimeSlot Model
- Availability: date, start/end times, spots available
- Pricing: base price with overrides
- Status: available, sold-out, cancelled

## Deployment

### Frontend Deployment
The frontend is optimized for deployment on Vercel, Netlify, or any static hosting service:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `.next` folder contents to your hosting provider

### Backend Deployment
The backend can be deployed to Render, Railway, AWS, or similar platforms:

1. Ensure environment variables are set in your deployment platform
2. Use the production MongoDB URI
3. Set `NODE_ENV=production`

### Cloud Database
- Use MongoDB Atlas for production database
- Configure connection string with authentication
- Enable database user with appropriate permissions

## Project Structure

```
highwaydeliteAssignment/
├── app/                          # Next.js app directory
│   ├── booking/
│   │   ├── result/
│   │   └── checkout/
│   ├── experiences/
│   │   └── [id]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── backend/                      # Express.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── package.json
│   └── index.js
├── components/                   # Reusable UI components
├── lib/                          # Frontend utilities
│   ├── services/
│   ├── utils/
│   └── config/
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
└── docs/                         # Documentation
```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Maintain consistent naming conventions

### Testing
- Write unit tests for utility functions
- Test API endpoints with Postman/Insomnia
- Validate forms with various input scenarios

### Security Best Practices
- Sanitize all user inputs
- Use parameterized queries
- Implement proper authentication
- Validate file uploads
- Use HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on the GitHub repository or contact the development team.

## Acknowledgments

- Design inspiration from the provided Figma mockups
- UI components built with shadcn/ui
- Icons from Lucide React
- Images sourced from Unsplash and Pexels