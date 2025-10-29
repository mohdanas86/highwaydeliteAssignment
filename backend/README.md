# Highway Delite Backend API

A comprehensive RESTful API for the Highway Delite experience booking platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Experience Management**: Browse, search, and filter travel experiences
- **Time Slot Management**: Dynamic slot availability with real-time booking
- **Booking System**: Complete booking workflow with validation and confirmation
- **Promo Code System**: Flexible discount system with validation
- **Advanced Search**: Filter by category, location, price, rating, and more
- **Data Validation**: Comprehensive input validation and error handling
- **Scalable Architecture**: Clean, modular code structure following best practices

## 📋 API Endpoints

### Experiences
- `GET /api/v1/experiences` - Get all experiences with filtering and pagination
- `GET /api/v1/experiences/:id` - Get experience details with available time slots
- `GET /api/v1/experiences/categories` - Get all experience categories
- `GET /api/v1/experiences/locations` - Get all experience locations
- `GET /api/v1/experiences/featured` - Get featured experiences
- `POST /api/v1/experiences/search` - Advanced search with filters

### Bookings
- `POST /api/v1/bookings` - Create a new booking
- `GET /api/v1/bookings/:reference` - Get booking by reference number
- `GET /api/v1/bookings/user/:email` - Get user's booking history
- `PATCH /api/v1/bookings/:reference/cancel` - Cancel a booking

### Promo Codes
- `POST /api/v1/promo/validate` - Validate promo code
- `GET /api/v1/promo/available` - Get available promo codes

### Health Check
- `GET /health` - API health status

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend root directory:

```env
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGO_URL=your_mongodb_connection_string

# JWT Configuration (for future authentication)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=1d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRY=10d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cloudinary (for image uploads - optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Database Setup
```bash
# Seed the database with sample data
npm run seed
```

### 4. Start the Server
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 📊 Data Models

### Experience
- Basic information (title, description, price, duration)
- Location and category details
- Images and highlights
- Ratings and reviews
- Availability settings

### TimeSlot
- Date and time information
- Capacity management
- Pricing (with special pricing support)
- Weather dependency flags
- Cancellation policies

### Booking
- User information
- Experience and slot references
- Pricing breakdown
- Payment status tracking
- Cancellation handling

### PromoCode
- Discount configuration
- Usage limitations
- Validity periods
- Category and experience restrictions
- Usage tracking

## 🔧 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm run lint       # Check code formatting
npm run format     # Format code with Prettier
```

## 📝 API Usage Examples

### Get All Experiences
```bash
curl "http://localhost:3000/api/v1/experiences?category=adventure&limit=5"
```

### Get Experience Details
```bash
curl "http://localhost:3000/api/v1/experiences/EXPERIENCE_ID"
```

### Create a Booking
```bash
curl -X POST "http://localhost:3000/api/v1/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "experienceId": "EXPERIENCE_ID",
    "timeSlotId": "SLOT_ID",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "numberOfGuests": 2,
    "promoCode": "SAVE10"
  }'
```

### Validate Promo Code
```bash
curl -X POST "http://localhost:3000/api/v1/promo/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE10",
    "userEmail": "john@example.com",
    "orderValue": 2000,
    "experienceId": "EXPERIENCE_ID"
  }'
```

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting protection
- CORS configuration
- Error handling without sensitive data exposure
- Double booking prevention
- Promo code usage limitations

## 📈 Sample Data

The seed script creates:
- **6 sample experiences** across different categories (adventure, cultural, nature, food, entertainment)
- **~180 time slots** spread over the next 30 days
- **4 promo codes** with different discount types and restrictions

### Available Promo Codes:
- `SAVE10` - 10% off on all experiences (min order ₹1000)
- `FLAT100` - Flat ₹100 off on orders above ₹2000
- `ADVENTURE20` - 20% off on adventure experiences (min order ₹1500)
- `WEEKEND15` - 15% off on weekend bookings (min order ₹800)

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=8080
MONGO_URL=your_production_mongodb_url
CORS_ORIGIN=your_frontend_domain
```

### Deploy to Railway/Render/Vercel
1. Connect your GitHub repository
2. Set environment variables in the platform
3. Deploy with start command: `npm start`

## 🔍 Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "statusCode": 400
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Highway Delite API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

## 📚 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: Built-in Mongoose validation
- **Security**: CORS, input sanitization
- **Development**: Nodemon, Prettier

## 🤝 Contributing

1. Follow the existing code structure
2. Use Prettier for code formatting
3. Add proper error handling
4. Update documentation for new endpoints
5. Test all API endpoints before submitting

## 📄 License

ISC License - see package.json for details

---

**Happy Coding! 🎉**

For any issues or questions, please check the API endpoints using the health check and sample requests above.