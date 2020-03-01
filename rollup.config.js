let babel = require('rollup-plugin-babel');

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
    module.exports = [{
        input: './src/DatePickerInterface.js',
        output: {
            file: 'dist/index.js', 
            format: 'esm'
        }
    }, {
        input: './src/hooks/preact.js',
        output: {
            file: 'dist/hooks/preact.js',
            format: 'esm'
        },
        external: [ 'preact/hooks' ]
    }, {
        input: './src/hooks/react.js',
        output: {
            file: 'dist/hooks/react.js',
            format: 'esm'
        },
        external: [ 'react' ]
    }];
}