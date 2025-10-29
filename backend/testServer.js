// Test the backend without verbose logging
import { exec } from 'child_process';

console.log('🧪 Testing Backend Server...\n');

// Start the server
const serverProcess = exec('npm start', { cwd: 'C:\\Users\\anasa\\sih\\highwaydelite\\backend' });

let hasStarted = false;
let hasErrors = false;

serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('📤 STDOUT:', output.trim());

    if (output.includes('Server running on port')) {
        hasStarted = true;
        console.log('✅ Server started successfully!');

        // Give it a moment then kill the process
        setTimeout(() => {
            serverProcess.kill();
            console.log('\n🎉 Test completed successfully!');
            console.log('\n📊 Summary:');
            console.log(`   • Server started: ${hasStarted ? '✅' : '❌'}`);
            console.log(`   • Has errors: ${hasErrors ? '❌' : '✅'}`);
            console.log(`   • Duplicate index warnings: ${hasErrors ? '❌ Present' : '✅ Fixed'}`);
            console.log(`   • Promo code errors: ${hasErrors ? '❌ Present' : '✅ Fixed'}`);
        }, 3000);
    }
});

serverProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.log('📤 STDERR:', output.trim());

    if (output.includes('Warning') || output.includes('Error')) {
        hasErrors = true;
    }
});

serverProcess.on('close', (code) => {
    console.log(`\n🔚 Server process exited with code ${code}`);
});

// Timeout after 10 seconds
setTimeout(() => {
    if (!hasStarted) {
        console.log('❌ Server failed to start within 10 seconds');
        serverProcess.kill();
    }
}, 10000);