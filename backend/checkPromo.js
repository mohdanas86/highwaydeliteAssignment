import mongoose from 'mongoose';
import { PromoCode } from './src/models/promoCode.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkPromoCodes() {
    try {
        await mongoose.connect(process.env.MONGO_URL + '/highwaydelite_db');
        console.log('✅ Connected to database');

        // Find all promo codes
        const promoCodes = await PromoCode.find({});
        console.log('🎫 All promo codes:');
        promoCodes.forEach(promo => {
            console.log(`- Code: "${promo.code}", Active: ${promo.isActive}, Valid: ${promo.isCurrentlyValid}`);
        });

        // Test the findByCode method
        console.log('\n🔍 Testing findByCode method:');
        const testCode = await PromoCode.findByCode('SAVE10');
        console.log('Found SAVE10:', testCode ? 'YES' : 'NO');

        const testCodeLower = await PromoCode.findByCode('save10');
        console.log('Found save10:', testCodeLower ? 'YES' : 'NO');

    } catch (error) {
        console.error('❌ Check failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from database');
    }
}

checkPromoCodes();