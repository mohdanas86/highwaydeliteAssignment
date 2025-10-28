# BookIt: Experiences & Slots

A modern, full-stack booking application for travel experiences built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Features

- **Experience Listing**: Browse and search through various travel experiences
- **Detailed Views**: View comprehensive information about each experience
- **Slot Selection**: Choose available dates and time slots
- **Smart Booking**: Complete bookings with form validation
- **Promo Codes**: Apply discount codes for special offers
- **Responsive Design**: Fully mobile-friendly interface
- **Modern UI**: Clean, professional design with smooth animations
- **Type-Safe**: Built with TypeScript for robust code quality

## 📋 Project Structure

```
highwaydelite/
├── app/
│   ├── page.tsx                    # Home page - Experience listing
│   ├── experiences/[id]/page.tsx   # Experience details page
│   ├── checkout/page.tsx           # Checkout page
│   ├── booking/result/page.tsx     # Booking confirmation/failure
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   └── ExperienceCard.tsx          # Experience card component
├── lib/
│   ├── services/
│   │   └── api.ts                  # API service layer
│   ├── config/
│   │   └── api.config.ts           # API configuration
│   ├── data/
│   │   └── mockData.ts             # Mock data for development
│   └── utils/
│       └── validation.ts           # Validation utilities
├── types/
│   └── index.ts                    # TypeScript type definitions
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **HTTP Client**: Axios
- **Font**: Inter (Google Fonts)

## 📦 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Pages Overview

### 1. Home Page (`/`)
- Grid layout of experience cards with search and category filtering
- Responsive design (1/2/3 column grid)
- Loading states and empty states

### 2. Experience Details (`/experiences/[id]`)
- Full experience information with image gallery
- Available date/time slot selection
- Guest selection and real-time price calculation

### 3. Checkout (`/checkout`)
- Customer information form with validation
- Promo code application
- Order summary and price breakdown

### 4. Booking Result (`/booking/result`)
- Success confirmation with booking reference
- Complete booking details
- Failure handling with helpful error messages

## 💡 Available Promo Codes (Development)
- `WELCOME10`: 10% off (minimum $50 purchase)
- `SUMMER25`: 25% off (minimum $100, max $50 discount)
- `SAVE20`: $20 off (minimum $80 purchase)

## 🔧 Configuration

### Connect to Backend API
Edit `lib/config/api.config.ts`:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=your_backend_url_here
```

## 🚀 Build & Deploy

```bash
# Production build
npm run build
npm start

# Deploy to Vercel
vercel
```

## 📱 Key Features

✅ TypeScript for type safety  
✅ Clean component architecture  
✅ Proper error handling  
✅ Form validation  
✅ Responsive design  
✅ Accessible UI  
✅ SEO optimized  
✅ Performance optimized  

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**

