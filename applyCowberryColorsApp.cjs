const fs = require('fs');

const filepath = 'src/App.tsx';
let content = fs.readFileSync(filepath, 'utf-8');

// Color Palette Replacements
content = content.replace(/#3B6D11/g, '#377355');
content = content.replace(/#2b4d36/g, '#377355');
content = content.replace(/#1b3322/g, '#377355');
content = content.replace(/#c2dd74/g, '#D2AF6E');
content = content.replace(/#f4f7f5/g, '#F6F9F7');

// Note: Not globally replacing shadow-sm or rounded-xl in App.tsx right now 
// to avoid breaking layout, just replacing colors.

fs.writeFileSync(filepath, content, 'utf-8');
console.log("Colors updated in App.tsx.");
