let babel = require('rollup-plugin-babel');
let pkg = require('./package.json');

if (process.env.NODE_ENV === 'test') {
    module.exports = {
        input: './test/main.js',
        output: {
            dir: 'dist',
            format: 'esm',
            entryFileNames: 'tests.js'
        },
        plugins: [
            babel()
        ]
    }
} else {
    module.exports = {
        input: './src/DatePickerInterface.js',
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'esm' }
        ],
        plugins: [
            babel()
        ]
    }
}