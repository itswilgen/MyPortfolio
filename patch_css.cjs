const fs = require('fs');
let css = fs.readFileSync('src/styles/site.css', 'utf-8');
css = css.replace(/\.reveal-section \{[\s\S]*?\}\s*\.reveal-section\.is-visible \{[\s\S]*?\}\s*\.reveal-section \.reveal-item \{[\s\S]*?\}\s*\.reveal-section\.is-visible \.reveal-item \{[\s\S]*?\}/, '');
fs.writeFileSync('src/styles/site.css', css);
