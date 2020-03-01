let fs = require('fs');

fs.copyFileSync('README.md', 'dist/README.md');
fs.copyFileSync('LICENSE', 'dist/LICENSE');

let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

fs.writeFileSync('dist/package.json', JSON.stringify({
    name: pkg.name,
    version: pkg.version,
    module: 'index.js'
}));