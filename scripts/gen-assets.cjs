// Sinh src/assets.js từ thư mục assets/figma (chỉ giữ ảnh được tham chiếu trong src/ và App.jsx).
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'assets', 'figma');
const files = fs.readdirSync(dir).filter(f => /\.(png|jpg)$/.test(f)).sort();
const lines = files.map(f => `  ${JSON.stringify(f.replace(/\.(png|jpg)$/, ''))}: require('../assets/figma/${f}'),`);
fs.writeFileSync(path.join(root, 'src', 'assets.js'), `// Tự sinh bởi scripts/gen-assets.cjs — ảnh xuất từ Figma.\nexport const IMG = {\n${lines.join('\n')}\n};\n`);
console.log(`assets.js: ${files.length} ảnh`);
