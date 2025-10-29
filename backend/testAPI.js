// Simple API test script for Highway Delite Backend
// Run this with: node testAPI.js

const BASE_URL = 'http://localhost:8080';

// Helper function to make HTTP requests
async function apiTest(endpoint, method = 'GET', body = null) {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(`\n✅ ${method} ${endpoint}`);
        console.log(`Status: ${response.status}`);
        console.log('Response:', JSON.stringify(data, null, 2));

        return { success: response.ok, data, status: response.status };
    } catch (error) {
        console.log(`\n❌ ${method} ${endpoint}`);
        console.log('Error:', error.message);
        return { success: false, error: error.message };
    }
}

// Test suite
async function runTests() {
    console.log('🧪 Highway Delite API Test Suite');
    console.log('================================');

    // Test 1: Health check
    await apiTest('/health');

    // Test 2: Get all experiences
    const experiencesResult = await apiTest('/api/v1/experiences?limit=3');

    // Test 3: Get experience categories
    await apiTest('/api/v1/experiences/categories');

    // Test 4: Get featured experiences
    await apiTest('/api/v1/experiences/featured?limit=2');

    // Test 5: Validate promo code
    await apiTest('/api/v1/promo/validate', 'POST', {
        code: 'SAVE10',
        userEmail: 'test@example.com',
        orderValue: 2000
    });

    // Test 6: Get available promo codes
    await apiTest('/api/v1/promo/available');

    // Test 7: Get experience by ID (if we have experiences)
    if (experiencesResult.success && experiencesResult.data.experiences?.length > 0) {
        const experienceId = experiencesResult.data.experiences[0]._id;
        await apiTest(`/api/v1/experiences/${experienceId}`);
    }

    console.log('\n🎉 API Test Suite Completed!');
}

// Run the tests
runTests().catch(console.error);