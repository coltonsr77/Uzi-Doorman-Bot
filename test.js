// Simple test to verify the bot structure
console.log('Testing Discord Bot structure...');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const requiredFiles = [
    '.env',
    'index.js',
    'package.json',
    'uziAI.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✓ ${file} exists`);
    } else {
        console.log(`✗ ${file} missing`);
        allFilesExist = false;
    }
});

if (fs.existsSync(path.join(__dirname, 'package-lock.json'))) {
    console.log('✓ package-lock.json exists');
} else {
    console.log('⚠ package-lock.json is missing (optional)');
}

// Test 2: Check package.json dependencies
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['axios', 'discord.js', 'dotenv', 'node-fetch'];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✓ ${dep} dependency found`);
        } else {
            console.log(`✗ ${dep} dependency missing`);
            allFilesExist = false;
        }
    });
} catch (error) {
    console.log('✗ Error reading package.json:', error.message);
    allFilesExist = false;
}

try {
    console.log('✓ Checking index.js syntax...');
    execSync('node --check index.js', { stdio: 'ignore' });
    console.log('✓ index.js syntax looks good');
} catch (error) {
    console.log('✗ index.js syntax error:', error.message.trim());
    allFilesExist = false;
}

console.log('\nTest completed:', allFilesExist ? 'PASSED' : 'FAILED');
process.exit(allFilesExist ? 0 : 1);
