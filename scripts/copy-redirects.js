
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../_redirects');
const destination = path.join(__dirname, '../dist/demo/browser/_redirects');

// Ensure destination folder exists and copy the file
fs.copyFileSync(source, destination);
console.log('_redirects file copied successfully!');