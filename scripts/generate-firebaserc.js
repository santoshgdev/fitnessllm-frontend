const fs = require('fs');

// Read the project ID from environment variable
const projectId = process.env.FIREBASE_PROJECT_ID;
if (!projectId) {
    console.error('FIREBASE_PROJECT_ID environment variable is required');
    process.exit(1);
}

// Read the template and replace placeholders
let templateContent = fs.readFileSync('.firebaserc.template', 'utf8');
templateContent = templateContent.replace(/PROJECT_ID_PLACEHOLDER/g, projectId);

// Write the generated file
fs.writeFileSync('.firebaserc', templateContent);
console.log(`.firebaserc file generated successfully for project: ${projectId}`);
