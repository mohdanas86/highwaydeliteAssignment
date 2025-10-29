# Highway Delite - Travel Experience Booking Platform

A modern, responsive web application for booking travel experiences built with Next.js, TypeScript, and TailwindCSS.

## 🌟 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with desktop optimization (max-width: 1440px)
- **Experience Discovery**: Browse and search travel experiences with filtering
- **Real-time Availability**: Check available dates and time slots
- **Secure Booking Flow**: Complete booking process with validation
- **Form Validation**: Client-side validation with user-friendly error messages
- **Loading States**: Skeleton components and loading indicators
- **Error Handling**: Comprehensive error handling with retry mechanisms

### Technical Features
- **Type Safety**: Full TypeScript implementation with strict typing
- **Security**: Input sanitization, rate limiting, and XSS protection
- **Performance**: Optimized images, code splitting, and efficient re-renders
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **SEO Optimized**: Meta tags, structured data, and proper heading hierarchy

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/mohdanas86/highwaydeliteAssignment.git
cd highwaydelite

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## � Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── checkout/                 # Checkout page
│   ├── experiences/[id]/         # Experience detail page
│   ├── booking/result/           # Booking confirmation page
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx           # Button component with variants
│   │   ├── Card.tsx             # Card component
│   │   ├── Input.tsx            # Form input component
│   │   ├── Loading.tsx          # Loading states and skeletons
│   │   └── Badge.tsx            # Badge component
│   ├── ExperienceCard.tsx       # Experience listing card
│   └── Header.tsx               # Navigation header
├── lib/                         # Utility libraries
│   ├── config/                  # Configuration files
│   │   └── api.config.ts        # API endpoints and configuration
│   ├── data/                    # Mock data for development
│   │   └── mockData.ts          # Sample experiences and slots
│   ├── services/                # API service layer
│   │   └── api.ts               # HTTP client and API methods
│   └── utils/                   # Utility functions
│       ├── storage.ts           # Client-side storage utilities
│       └── validation.ts        # Form validation helpers
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Core type definitions
├── docs/                        # Documentation
│   └── BACKEND_API_REQUIREMENTS.md  # Backend API specifications
└── public/                      # Static assets
    └── logo.png                 # Application logo
```

## � Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode
- **Package Manager**: npm

## 🎨 Design System

### Color Palette
- **Primary Yellow**: `#FFD11A` (Highway Delite brand color)
- **Success Green**: `#24AC39` (Confirmations and success states)
- **Background Gray**: `#EFEFEF` (Card backgrounds)
- **Text Colors**: 
  - Primary: `#161616`
  - Secondary: `#6C6C6C`
  - Muted: `#838383`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Responsive Scaling**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

### Component Standards
- **Border Radius**: 12px for cards, 4px for buttons
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle shadows for depth and hierarchy

## 🔒 Security Features

### Client-Side Security
- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Rate Limiting**: Client-side rate limiting to prevent API abuse
- **Secure Storage**: Type-safe localStorage/sessionStorage with error handling
- **CSRF Protection**: Added security headers and request validation

### Data Validation
- **Type Safety**: Comprehensive TypeScript interfaces
- **Runtime Validation**: Input validation with user-friendly error messages
- **Business Logic Validation**: Booking constraints and availability checks

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px` (Default)
- **Tablet**: `640px - 768px` (`sm:`)
- **Laptop**: `768px - 1024px` (`md:`)
- **Desktop**: `1024px - 1440px` (`lg:`)
- **Large Desktop**: `> 1440px` (Max-width constraint)

### Mobile Optimizations
- Touch-friendly button sizes (minimum 44px tap targets)
- Optimized image loading and sizing
- Simplified navigation with hamburger menu
- Single-column layouts on small screens

## 🛠 Development Guidelines

### Code Quality
- **ESLint**: Enforces coding standards and best practices
- **TypeScript**: Strict mode enabled for maximum type safety
- **Component Structure**: Functional components with hooks
- **Error Boundaries**: Comprehensive error handling throughout

### Performance Optimization
- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Automatic code splitting with Next.js
- **Lazy Loading**: Components and images loaded on demand
- **Bundle Analysis**: Monitor bundle size and optimize imports

### Testing Strategy
- **Type Safety**: TypeScript provides compile-time error detection
- **Manual Testing**: Cross-browser and device testing
- **Error Scenarios**: Test error states and edge cases

## � API Integration

The application is designed to work with a REST API backend. See [Backend API Requirements](./docs/BACKEND_API_REQUIREMENTS.md) for detailed specifications.

### Key API Endpoints
- `GET /experiences` - Fetch experiences with filtering
- `GET /experiences/:id` - Get experience details
- `GET /experiences/:id/slots` - Get available time slots
- `POST /bookings` - Create new booking
- `POST /promo/validate` - Validate promo codes

### Error Handling
- Comprehensive error categorization
- User-friendly error messages
- Retry mechanisms for failed requests
- Fallback states for network issues

## 🚀 Deployment

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://api.highwaydelite.com/v1
```

### Build Optimization
- Static optimization for improved performance
- Automatic code splitting
- Image optimization and compression
- CSS minification and purging

## 📄 License

This project is proprietary software developed for Highway Delite.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

**Built with ❤️ for Highway Delite**

