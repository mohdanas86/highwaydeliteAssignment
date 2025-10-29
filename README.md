# Highway Delite - Travel Experience Booking Platform# Highway Delite - Travel Experience Booking Platform



A modern, full-stack web application for discovering and booking travel experiences. Built with Next.js, TypeScript, TailwindCSS, and MongoDB, this platform provides a seamless booking experience from browsing to confirmation.A modern, full-stack web application for discovering and booking travel experiences. Built with Next.js, TypeScript, TailwindCSS, and MongoDB, this platform provides a seamless booking experience from browsing to confirmation.



## Overview## Overview



Highway Delite is a professional travel experience booking platform that allows users to browse available experiences, check real-time availability, and complete secure bookings. The application features a responsive design, comprehensive form validation, and robust error handling to ensure a smooth user experience across all devices.Highway Delite is a professional travel experience booking platform that allows users to browse available experiences, check real-time availability, and complete secure bookings. The application features a responsive design, comprehensive form validation, and robust error handling to ensure a smooth user experience across all devices.



## Features## Features



### Core Functionality### Core Functionality

- Browse travel experiences with advanced filtering by category, location, and price range- Browse travel experiences with advanced filtering by category, location, and price range

- Real-time availability checking for dates and time slots- Real-time availability checking for dates and time slots

- Dynamic price calculation with tax breakdown- Dynamic price calculation with tax breakdown

- Promo code validation and discount application- Promo code validation and discount application

- Secure booking flow with comprehensive validation- Secure booking flow with comprehensive validation

- Booking confirmation with unique reference numbers- Booking confirmation with unique reference numbers



### User Experience### User Experience

- Mobile-first responsive design supporting devices from 320px to 1440px- Mobile-first responsive design supporting devices from 320px to 1440px

- Intuitive navigation with clear visual feedback- Intuitive navigation with clear visual feedback

- Loading states and skeleton screens for better perceived performance- Loading states and skeleton screens for better perceived performance

- Comprehensive error handling with user-friendly messages- Comprehensive error handling with user-friendly messages

- Form validation with inline error feedback- Form validation with inline error feedback



### Technical Implementation### Technical Implementation

- Full TypeScript implementation with strict type checking- Full TypeScript implementation with strict type checking

- Server-side rendering and static optimization with Next.js- Server-side rendering and static optimization with Next.js

- RESTful API architecture with Express and MongoDB- RESTful API architecture with Express and MongoDB

- Input sanitization and XSS protection- Input sanitization and XSS protection

- Rate limiting to prevent abuse- Rate limiting to prevent abuse

- Atomic database operations to prevent double-booking- Atomic database operations to prevent double-booking



## Getting Started## Getting Started



### Prerequisites### Prerequisites

- Node.js 18.0 or higher

Before running this application, ensure you have the following installed:- npm or yarn package manager

- Node.js version 18.0 or higher

- npm (Node Package Manager)### Installation

- MongoDB connection (for backend)

```bash

### Frontend Setup# Clone the repository

git clone https://github.com/mohdanas86/highwaydeliteAssignment.git

1. Clone the repository:cd highwaydelite

```bash

git clone https://github.com/mohdanas86/highwaydeliteAssignment.git# Install dependencies

cd highwaydelitenpm install

```

# Start development server

2. Install frontend dependencies:npm run dev

```bash

npm install# Open browser to http://localhost:3000

``````



3. Configure environment variables (optional):### Build for Production



Create a `.env.local` file in the root directory:```bash

```env# Build the application

NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1npm run build

```

# Start production server

4. Start the development server:npm start

```bash```

npm run dev

```## � Project Structure



5. Open your browser and navigate to:```

```├── app/                          # Next.js App Router pages

http://localhost:3000│   ├── checkout/                 # Checkout page

```│   ├── experiences/[id]/         # Experience detail page

│   ├── booking/result/           # Booking confirmation page

### Backend Setup│   ├── globals.css              # Global styles and CSS variables

│   ├── layout.tsx               # Root layout component

1. Navigate to the backend directory:│   └── page.tsx                 # Home page

```bash├── components/                   # React components

cd backend│   ├── ui/                      # Reusable UI components

```│   │   ├── Button.tsx           # Button component with variants

│   │   ├── Card.tsx             # Card component

2. Install backend dependencies:│   │   ├── Input.tsx            # Form input component

```bash│   │   ├── Loading.tsx          # Loading states and skeletons

npm install│   │   └── Badge.tsx            # Badge component

```│   ├── ExperienceCard.tsx       # Experience listing card

│   └── Header.tsx               # Navigation header

3. Configure environment variables:├── lib/                         # Utility libraries

│   ├── config/                  # Configuration files

Create a `.env` file in the backend directory:│   │   └── api.config.ts        # API endpoints and configuration

```env│   ├── data/                    # Mock data for development

MONGODB_URI=your_mongodb_connection_string│   │   └── mockData.ts          # Sample experiences and slots

PORT=8080│   ├── services/                # API service layer

NODE_ENV=development│   │   └── api.ts               # HTTP client and API methods

```│   └── utils/                   # Utility functions

│       ├── storage.ts           # Client-side storage utilities

4. Start the backend server:│       └── validation.ts        # Form validation helpers

```bash├── types/                       # TypeScript type definitions

npm start│   └── index.ts                 # Core type definitions

```├── docs/                        # Documentation

│   └── BACKEND_API_REQUIREMENTS.md  # Backend API specifications

The backend API will be available at `http://localhost:8080`└── public/                      # Static assets

    └── logo.png                 # Application logo

### Production Build```



To build and run the application in production mode:## � Technology Stack



```bash### Frontend

# Build the frontend- **Framework**: Next.js 16 (App Router)

npm run build- **Language**: TypeScript 5

- **Styling**: TailwindCSS 4

# Start the production server- **HTTP Client**: Axios

npm start- **Icons**: Lucide React

```- **State Management**: React Hooks (useState, useEffect)



For the backend, consider using process managers like PM2 for production deployment.### Development Tools

- **Linting**: ESLint with Next.js configuration

## Project Structure- **Type Checking**: TypeScript strict mode

- **Package Manager**: npm

```

highwaydelite/## 🎨 Design System

├── app/                          # Next.js App Router pages

│   ├── checkout/                 # Checkout page with booking form### Color Palette

│   ├── experiences/[id]/         # Dynamic experience detail page- **Primary Yellow**: `#FFD11A` (Highway Delite brand color)

│   ├── booking/result/           # Booking confirmation page- **Success Green**: `#24AC39` (Confirmations and success states)

│   ├── globals.css               # Global styles and CSS variables- **Background Gray**: `#EFEFEF` (Card backgrounds)

│   ├── layout.tsx                # Root layout component- **Text Colors**: 

│   └── page.tsx                  # Home page with experience listing  - Primary: `#161616`

├── backend/                      # Backend API server  - Secondary: `#6C6C6C`

│   ├── src/  - Muted: `#838383`

│   │   ├── controllers/          # Request handlers

│   │   ├── models/               # MongoDB schemas### Typography

│   │   ├── routes/               # API routes- **Font Family**: Inter (Google Fonts)

│   │   ├── middlewares/          # Custom middleware- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

│   │   ├── utils/                # Helper functions- **Responsive Scaling**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

│   │   └── index.js              # Server entry point

│   ├── .env                      # Environment variables (not in git)### Component Standards

│   └── package.json              # Backend dependencies- **Border Radius**: 12px for cards, 4px for buttons

├── components/                   # React components- **Spacing**: Consistent 8px grid system

│   ├── ui/                       # Reusable UI components- **Shadows**: Subtle shadows for depth and hierarchy

│   │   ├── Button.tsx            # Button component with variants

│   │   ├── Card.tsx              # Card component## 🔒 Security Features

│   │   ├── Input.tsx             # Form input component

│   │   ├── Loading.tsx           # Loading states### Client-Side Security

│   │   └── Badge.tsx             # Badge component- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks

│   ├── ExperienceCard.tsx        # Experience listing card- **Rate Limiting**: Client-side rate limiting to prevent API abuse

│   └── Header.tsx                # Navigation header- **Secure Storage**: Type-safe localStorage/sessionStorage with error handling

├── lib/                          # Utility libraries- **CSRF Protection**: Added security headers and request validation

│   ├── config/                   # Configuration files

│   ├── data/                     # Mock data for development### Data Validation

│   ├── services/                 # API service layer- **Type Safety**: Comprehensive TypeScript interfaces

│   └── utils/                    # Helper functions- **Runtime Validation**: Input validation with user-friendly error messages

├── types/                        # TypeScript type definitions- **Business Logic Validation**: Booking constraints and availability checks

│   └── index.ts                  # Core interface definitions

├── docs/                         # Documentation## 📱 Responsive Design

│   └── BACKEND_API_REQUIREMENTS.md

├── public/                       # Static assets### Breakpoints

├── package.json                  # Frontend dependencies- **Mobile**: `< 640px` (Default)

└── tsconfig.json                 # TypeScript configuration- **Tablet**: `640px - 768px` (`sm:`)

```- **Laptop**: `768px - 1024px` (`md:`)

- **Desktop**: `1024px - 1440px` (`lg:`)

## Technology Stack- **Large Desktop**: `> 1440px` (Max-width constraint)



### Frontend### Mobile Optimizations

- **Framework:** Next.js 16 with App Router- Touch-friendly button sizes (minimum 44px tap targets)

- **Language:** TypeScript 5 with strict mode- Optimized image loading and sizing

- **Styling:** TailwindCSS 4- Simplified navigation with hamburger menu

- **HTTP Client:** Axios- Single-column layouts on small screens

- **Icons:** Lucide React

- **State Management:** React Hooks## 🛠 Development Guidelines



### Backend### Code Quality

- **Runtime:** Node.js 18+- **ESLint**: Enforces coding standards and best practices

- **Framework:** Express.js 5- **TypeScript**: Strict mode enabled for maximum type safety

- **Database:** MongoDB with Mongoose ODM- **Component Structure**: Functional components with hooks

- **Validation:** Built-in validators and custom middleware- **Error Boundaries**: Comprehensive error handling throughout



### Development Tools### Performance Optimization

- **Linting:** ESLint with Next.js configuration- **Image Optimization**: Next.js Image component with proper sizing

- **Type Checking:** TypeScript compiler- **Code Splitting**: Automatic code splitting with Next.js

- **Version Control:** Git- **Lazy Loading**: Components and images loaded on demand

- **Bundle Analysis**: Monitor bundle size and optimize imports

## API Documentation

### Testing Strategy

The backend provides a RESTful API with the following main endpoints:- **Type Safety**: TypeScript provides compile-time error detection

- **Manual Testing**: Cross-browser and device testing

### Experience Endpoints- **Error Scenarios**: Test error states and edge cases

- `GET /api/v1/experiences` - List all experiences with filtering

- `GET /api/v1/experiences/:id` - Get single experience details## � API Integration

- `GET /api/v1/experiences/categories` - Get available categories

- `GET /api/v1/experiences/featured` - Get featured experiencesThe application is designed to work with a REST API backend. See [Backend API Requirements](./docs/BACKEND_API_REQUIREMENTS.md) for detailed specifications.



### Booking Endpoints### Key API Endpoints

- `POST /api/v1/bookings` - Create a new booking- `GET /experiences` - Fetch experiences with filtering

- `GET /api/v1/bookings/:reference` - Get booking by reference- `GET /experiences/:id` - Get experience details

- `PATCH /api/v1/bookings/:reference/cancel` - Cancel a booking- `GET /experiences/:id/slots` - Get available time slots

- `POST /bookings` - Create new booking

### Promo Code Endpoints- `POST /promo/validate` - Validate promo codes

- `POST /api/v1/promo/validate` - Validate a promo code

- `GET /api/v1/promo/available` - Get available promo codes### Error Handling

- Comprehensive error categorization

For detailed API specifications, see [Backend API Requirements](./docs/BACKEND_API_REQUIREMENTS.md).- User-friendly error messages

- Retry mechanisms for failed requests

## Design System- Fallback states for network issues



### Color Palette## 🚀 Deployment

The application uses a consistent color scheme throughout:

- **Primary Yellow:** #FFD11A (brand color for CTAs and highlights)### Environment Variables

- **Success Green:** #24AC39 (confirmations and success states)```bash

- **Background Gray:** #EFEFEF (card backgrounds and surfaces)NEXT_PUBLIC_API_URL=https://api.highwaydelite.com/v1

- **Text Primary:** #161616 (main content)```

- **Text Secondary:** #6C6C6C (supporting text)

- **Text Muted:** #838383 (disabled states)### Build Optimization

- Static optimization for improved performance

### Typography- Automatic code splitting

- **Font Family:** Inter (Google Fonts)- Image optimization and compression

- **Font Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)- CSS minification and purging

- **Responsive Scaling:** Mobile-first with breakpoint-based scaling

## 📄 License

### Layout Standards

- **Border Radius:** 12px for cards, 4px for buttonsThis project is proprietary software developed for Highway Delite.

- **Spacing:** Consistent 8px grid system

- **Max Width:** 1440px for main content## 🤝 Contributing

- **Breakpoints:** 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

This is a private project. For questions or support, please contact the development team.

## Security Features

---

The application implements multiple security measures:

**Built with ❤️ for Highway Delite**

### Frontend Security

- Input sanitization to prevent XSS attacks
- Rate limiting on API calls
- CSRF protection headers
- Secure session storage handling
- Type validation with TypeScript

### Backend Security
- MongoDB injection prevention through parameterized queries
- Comprehensive input validation on all endpoints
- Error message sanitization
- CORS configuration
- Environment variable protection

### Data Validation
- Email format validation
- Required field checking
- Numeric range validation (guest count, price)
- Date and time validation
- Promo code format and status validation

## Responsive Design

The application is fully responsive with the following breakpoints:

- **Mobile:** < 640px (single column layout)
- **Tablet:** 640px - 768px (two column grid)
- **Laptop:** 768px - 1024px (three column grid)
- **Desktop:** 1024px - 1440px (four column grid)
- **Large Desktop:** > 1440px (max-width constraint)

### Mobile Optimizations
- Touch-friendly interactive elements (minimum 44x44px)
- Optimized image loading and lazy loading
- Simplified navigation patterns
- Vertical stacking of form elements
- Reduced content density

## Database Schema

### Experience Model
Stores travel experience information including title, description, category, location, pricing, duration, and availability settings.

### TimeSlot Model
Manages available booking slots with date, time, capacity, and booking status. Implements atomic operations to prevent double-booking.

### Booking Model
Records customer bookings with user information, pricing details, payment status, and booking reference.

### PromoCode Model
Handles promotional codes with validation rules including discount type, usage limits, validity periods, and minimum purchase requirements.

## Development Guidelines

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint for code consistency
- Functional components with React Hooks
- Separation of concerns (UI, logic, data)
- Comprehensive error handling

### Performance Optimization
- Next.js Image component for optimized images
- Automatic code splitting
- Efficient database queries with indexing
- Proper React re-render management
- Lazy loading where appropriate

### Testing Approach
- Type safety through TypeScript compilation
- Manual cross-browser testing
- Error scenario validation
- Responsive design testing on multiple devices

## Deployment

### Environment Variables

Ensure the following environment variables are configured:

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=your_api_url
```

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
NODE_ENV=production
```

### Build and Deploy

1. Build the Next.js application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Ensure the backend is running and accessible to the frontend.

### Recommended Hosting
- **Frontend:** Vercel, Netlify, or similar platforms optimized for Next.js
- **Backend:** Heroku, DigitalOcean, AWS, or similar Node.js hosting
- **Database:** MongoDB Atlas (cloud-hosted MongoDB)

## Contributing

This project is developed as part of an internship assignment. For any questions or issues, please contact the development team.

## License

This project is proprietary software developed for Highway Delite. All rights reserved.

## Acknowledgments

Built with modern web technologies to provide a seamless travel booking experience. Special thanks to the Highway Delite team for their requirements and feedback.

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Developed by:** Anas Alam
