const fs = require('fs');
const path = require('path');

// Create public directory for deployment
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Copy HTML file
fs.copyFileSync('index.html', path.join(publicDir, 'index.html'));

// Copy JS files
const jsDir = path.join(publicDir, 'js');
if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir);
}
fs.copyFileSync('movieApp.js', path.join(jsDir, 'movieApp.js'));
fs.copyFileSync('moviePlayer.js', path.join(jsDir, 'moviePlayer.js'));

console.log('Build completed!');