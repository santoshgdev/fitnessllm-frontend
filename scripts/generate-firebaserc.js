// Updated generate-firebaserc.js
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '.firebaserc.template');
const outputPath = path.join(__dirname, '..', '.firebaserc');

// Add error handling for missing template
if (!fs.existsSync(templatePath)) {
    console.error('Template file not found at:', templatePath);
    process.exit(1);
}
