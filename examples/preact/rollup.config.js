let babel = require('rollup-plugin-babel');
let css = require('rollup-plugin-hot-css');
let resolve = require('rollup-plugin-node-resolve');
let alias = require('rollup-plugin-alias');

let scss = (code, id) => {
    return require('node-sass').renderSync({
        data: code,
        compressed: true,
        includePaths: [ require('path').dirname(id) ]
    }).css.toString();
};

module.exports = {
    input: './src/main.js',
    output: {
        dir: 'dist',
        format: 'esm',
        assetFileNames: '[name][extname]',
        entryFileNames: '[name].js'
    },
    plugins: [
        alias({
            // Not necessary in a real app, just needed for the example to run.
            entries:[
                {find: 'preact/hooks', replacement: require.resolve('preact/hooks').replace('.js', '.module.js')}, 
                {find: 'datepicker-interface', replacement: require('path').resolve(__dirname, '../../src') }
            ]
        }),
        resolve(),
        babel(),
        css({
            filename: 'style.css',
            transform: scss,
            hot: true
        })
    ]
}