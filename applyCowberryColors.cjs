const fs = require('fs');

const filepath = 'src/components/ShopModule.tsx';
let content = fs.readFileSync(filepath, 'utf-8');

// Color Palette Replacements
content = content.replace(/#3B6D11/g, '#377355');
content = content.replace(/#2b4d36/g, '#377355');
content = content.replace(/#1b3322/g, '#377355');
content = content.replace(/#c2dd74/g, '#D2AF6E');
content = content.replace(/#f4f7f5/g, '#F6F9F7');

// Shadows & Radii
content = content.replace(/shadow-sm/g, 'shadow-[0px_4px_12px_0px_#0000001F]');
content = content.replace(/rounded-xl/g, 'rounded-[20px]');
content = content.replace(/rounded-2xl/g, 'rounded-[20px]');
content = content.replace(/rounded-3xl/g, 'rounded-[20px]');

// Replace category colors
content = content.replace(/color: 'bg-emerald-100'/g, "color: 'bg-[#3773551F]'");
content = content.replace(/color: 'bg-amber-100'/g, "color: 'bg-[#3773551F]'");
content = content.replace(/color: 'bg-slate-100'/g, "color: 'bg-[#3773551F]'");
content = content.replace(/color: 'bg-orange-100'/g, "color: 'bg-[#3773551F]'");
content = content.replace(/color: 'bg-blue-100'/g, "color: 'bg-[#3773551F]'");
content = content.replace(/color: 'bg-yellow-100'/g, "color: 'bg-[#3773551F]'");

// For the category text icons, make sure they are somewhat golden or green instead of just emojis if possible, 
// but since they are emojis, we leave them. We can add a class to colorize text if they were SVGs.

fs.writeFileSync(filepath, content, 'utf-8');
console.log("Colors updated in ShopModule.tsx.");
