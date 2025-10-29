import mongoose from 'mongoose';
import { Experience } from '../models/experience.model.js';
import { TimeSlot } from '../models/timeSlot.model.js';
import { PromoCode } from '../models/promoCode.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sample experience data
const sampleExperiences = [
    {
        title: 'Goa Beach Adventure',
        description: 'Experience the stunning beaches of Goa with water sports, beach volleyball, and sunset views. Perfect for adventure seekers and beach lovers.',
        shortDescription: 'Beach adventure with water sports and stunning sunset views',
        price: 2500,
        originalPrice: 3000,
        duration: '6 hours',
        location: 'Goa',
        category: 'adventure',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
                alt: 'Goa Beach Adventure',
            },
            {
                url: 'https://images.unsplash.com/photo-1561423635-913d01134b61',
                alt: 'Beach Water Sports',
            },
        ],
        highlights: [
            'Water sports activities',
            'Professional instructors',
            'Beach volleyball',
            'Sunset photography',
            'Refreshments included',
        ],
        inclusions: [
            'All water sports equipment',
            'Professional guidance',
            'Safety gear',
            'Light refreshments',
            'Photography session',
        ],
        exclusions: [
            'Transportation to beach',
            'Personal expenses',
            'Additional food and drinks',
        ],
        difficulty: 'moderate',
        minAge: 12,
        maxGroupSize: 15,
        rating: 4.8,
        reviewCount: 127,
        tags: ['featured', 'popular', 'beach', 'water-sports'],
    },
    {
        title: 'Rajasthan Cultural Heritage Tour',
        description: 'Immerse yourself in the rich cultural heritage of Rajasthan with traditional music, dance, local cuisine, and historical monuments.',
        shortDescription: 'Cultural heritage tour with music, dance, and local cuisine',
        price: 1800,
        originalPrice: 2200,
        duration: '8 hours',
        location: 'Jaipur, Rajasthan',
        category: 'cultural',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
                alt: 'Rajasthan Palace',
            },
            {
                url: 'https://images.unsplash.com/photo-1529336953065-611a194de53d',
                alt: 'Traditional Dance',
            },
        ],
        highlights: [
            'Visit historical monuments',
            'Traditional Rajasthani cuisine',
            'Folk music and dance',
            'Local artisan workshops',
            'Cultural storytelling',
        ],
        inclusions: [
            'Entry tickets to monuments',
            'Traditional lunch',
            'Cultural performances',
            'Local guide',
            'Transportation',
        ],
        exclusions: [
            'Personal shopping',
            'Tips for performers',
            'Extra snacks',
        ],
        difficulty: 'easy',
        minAge: 8,
        maxGroupSize: 20,
        rating: 4.9,
        reviewCount: 89,
        tags: ['cultural', 'heritage', 'recommended'],
    },
    {
        title: 'Kerala Backwater Cruise',
        description: 'Peaceful cruise through the serene backwaters of Kerala with traditional houseboat experience, local cuisine, and nature watching.',
        shortDescription: 'Serene backwater cruise with houseboat experience',
        price: 3200,
        originalPrice: 3800,
        duration: '10 hours',
        location: 'Alleppey, Kerala',
        category: 'nature',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1582550945154-019d9b80271e',
                alt: 'Kerala Backwaters',
            },
            {
                url: 'https://images.unsplash.com/photo-1596176810750-2e31a830e2a5',
                alt: 'Traditional Houseboat',
            },
        ],
        highlights: [
            'Traditional houseboat cruise',
            'Kerala cuisine lunch',
            'Bird watching',
            'Village visits',
            'Coconut farm tour',
        ],
        inclusions: [
            'Houseboat cruise',
            'Traditional Kerala meals',
            'Professional guide',
            'Village tour',
            'Welcome drinks',
        ],
        exclusions: [
            'Transportation to starting point',
            'Personal expenses',
            'Alcoholic beverages',
        ],
        difficulty: 'easy',
        minAge: 5,
        maxGroupSize: 12,
        rating: 4.7,
        reviewCount: 156,
        tags: ['nature', 'peaceful', 'featured'],
    },
    {
        title: 'Mumbai Street Food Tour',
        description: 'Explore the vibrant street food culture of Mumbai with guided visits to famous food streets, local markets, and hidden gems.',
        shortDescription: 'Guided tour of Mumbai\'s famous street food scene',
        price: 800,
        originalPrice: 1000,
        duration: '4 hours',
        location: 'Mumbai',
        category: 'food',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
                alt: 'Mumbai Street Food',
            },
            {
                url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
                alt: 'Local Food Market',
            },
        ],
        highlights: [
            'Visit famous food streets',
            'Taste authentic Mumbai dishes',
            'Local market exploration',
            'Food history and culture',
            'Hidden gem discoveries',
        ],
        inclusions: [
            'Food tastings',
            'Expert local guide',
            'Market visits',
            'Cultural insights',
            'Safety guidelines',
        ],
        exclusions: [
            'Transportation between locations',
            'Additional food purchases',
            'Beverages',
        ],
        difficulty: 'easy',
        minAge: 10,
        maxGroupSize: 8,
        rating: 4.6,
        reviewCount: 203,
        tags: ['food', 'cultural', 'popular'],
    },
    {
        title: 'Himalayan Trekking Adventure',
        description: 'Challenging trek through the beautiful Himalayan trails with stunning mountain views, camping, and adventure activities.',
        shortDescription: 'Challenging Himalayan trek with mountain views and camping',
        price: 5500,
        originalPrice: 6500,
        duration: '3 days',
        location: 'Manali, Himachal Pradesh',
        category: 'adventure',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1464822759844-d150ad6e0889',
                alt: 'Himalayan Mountains',
            },
            {
                url: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
                alt: 'Mountain Trekking',
            },
        ],
        highlights: [
            'Stunning mountain views',
            'Professional trekking guides',
            'Camping under stars',
            'Adventure activities',
            'Local mountain culture',
        ],
        inclusions: [
            'Trekking equipment',
            'Camping gear',
            'All meals during trek',
            'Professional guides',
            'Safety equipment',
        ],
        exclusions: [
            'Transportation to starting point',
            'Personal trekking gear',
            'Emergency evacuation insurance',
        ],
        difficulty: 'challenging',
        minAge: 16,
        maxGroupSize: 10,
        rating: 4.9,
        reviewCount: 67,
        tags: ['adventure', 'trekking', 'featured'],
    },
    {
        title: 'Bollywood Studio Experience',
        description: 'Behind-the-scenes experience at a Bollywood film studio with live sets, celebrity interactions, and dance workshops.',
        shortDescription: 'Behind-the-scenes Bollywood studio experience',
        price: 1500,
        originalPrice: 1800,
        duration: '5 hours',
        location: 'Mumbai',
        category: 'entertainment',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1489599162126-0df9978e8b93',
                alt: 'Bollywood Studio',
            },
            {
                url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
                alt: 'Dance Performance',
            },
        ],
        highlights: [
            'Live film set visits',
            'Celebrity meet opportunities',
            'Bollywood dance workshop',
            'Costume try-on session',
            'Studio tour',
        ],
        inclusions: [
            'Studio tour',
            'Dance workshop',
            'Costume session',
            'Professional photos',
            'Refreshments',
        ],
        exclusions: [
            'Transportation',
            'Personal photos with celebrities',
            'Additional costume changes',
        ],
        difficulty: 'easy',
        minAge: 12,
        maxGroupSize: 25,
        rating: 4.5,
        reviewCount: 134,
        tags: ['entertainment', 'bollywood', 'popular'],
    },
];

// Sample promo codes
const samplePromoCodes = [
    {
        code: 'SAVE10',
        description: 'Get 10% off on all experiences',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderValue: 1000,
        maximumDiscountAmount: 500,
        usageLimit: { total: 100, perUser: 1 },
        validityPeriod: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        isActive: true,
        metadata: { campaign: 'New User Welcome', source: 'marketing' },
    },
    {
        code: 'FLAT100',
        description: 'Flat ₹100 off on bookings above ₹2000',
        discountType: 'fixed',
        discountValue: 100,
        minimumOrderValue: 2000,
        usageLimit: { total: 200, perUser: 2 },
        validityPeriod: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        },
        isActive: true,
        metadata: { campaign: 'Festival Special', source: 'marketing' },
    },
    {
        code: 'ADVENTURE20',
        description: '20% off on adventure experiences',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderValue: 1500,
        maximumDiscountAmount: 1000,
        applicableCategories: ['adventure'],
        usageLimit: { total: 50, perUser: 1 },
        validityPeriod: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        },
        isActive: true,
        metadata: { campaign: 'Adventure Special', source: 'marketing' },
    },
    {
        code: 'WEEKEND15',
        description: '15% off on weekend bookings',
        discountType: 'percentage',
        discountValue: 15,
        minimumOrderValue: 800,
        maximumDiscountAmount: 300,
        dayOfWeekRestriction: ['saturday', 'sunday'],
        usageLimit: { total: 75, perUser: 1 },
        validityPeriod: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        isActive: true,
        metadata: { campaign: 'Weekend Special', source: 'marketing' },
    },
];

// Function to generate time slots for experiences
const generateTimeSlots = (experienceId, days = 30) => {
    const slots = [];
    const timeSlotOptions = [
        { start: '09:00', end: '12:00', type: 'morning' },
        { start: '14:00', end: '17:00', type: 'afternoon' },
        { start: '18:00', end: '21:00', type: 'evening' },
    ];

    for (let i = 1; i <= days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        // Skip some days randomly to simulate realistic availability
        if (Math.random() < 0.3) continue;

        timeSlotOptions.forEach((timeSlot, index) => {
            // Skip some time slots randomly
            if (Math.random() < 0.4) return;

            const capacity = Math.floor(Math.random() * 15) + 5; // 5-20 capacity
            const bookedSlots = Math.floor(Math.random() * (capacity * 0.3)); // 0-30% booked

            slots.push({
                experienceId,
                date,
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                totalCapacity: capacity,
                bookedSlots,
                price: 2000 + (index * 200) + Math.floor(Math.random() * 500), // Variable pricing
                slotType: timeSlot.type,
                isAvailable: bookedSlots < capacity,
                weatherDependent: Math.random() < 0.3,
            });
        });
    }

    return slots;
};

// Main seeding function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Experience.deleteMany({}),
            TimeSlot.deleteMany({}),
            PromoCode.deleteMany({}),
        ]);
        console.log('✅ Existing data cleared');

        // Insert experiences
        console.log('📝 Inserting experiences...');
        const insertedExperiences = await Experience.insertMany(sampleExperiences);
        console.log(`✅ Inserted ${insertedExperiences.length} experiences`);

        // Generate and insert time slots for each experience
        console.log('⏰ Generating time slots...');
        const allTimeSlots = [];
        insertedExperiences.forEach(experience => {
            const slots = generateTimeSlots(experience._id);
            allTimeSlots.push(...slots);
        });

        const insertedTimeSlots = await TimeSlot.insertMany(allTimeSlots);
        console.log(`✅ Inserted ${insertedTimeSlots.length} time slots`);

        // Insert promo codes
        console.log('🎟️  Inserting promo codes...');
        const insertedPromoCodes = await PromoCode.insertMany(samplePromoCodes);
        console.log(`✅ Inserted ${insertedPromoCodes.length} promo codes`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   • ${insertedExperiences.length} experiences`);
        console.log(`   • ${insertedTimeSlots.length} time slots`);
        console.log(`   • ${insertedPromoCodes.length} promo codes`);
        console.log('\n🔗 API Endpoints:');
        console.log('   • GET /api/v1/experiences - List all experiences');
        console.log('   • GET /api/v1/experiences/:id - Get experience details');
        console.log('   • POST /api/v1/bookings - Create booking');
        console.log('   • POST /api/v1/promo/validate - Validate promo code');
        console.log('\n🎫 Available Promo Codes:');
        insertedPromoCodes.forEach(promo => {
            console.log(`   • ${promo.code} - ${promo.description}`);
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase()
        .then(() => {
            console.log('✅ Seeding completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}

export default seedDatabase;