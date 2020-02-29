let babel = require('rollup-plugin-babel');
let css = require('rollup-plugin-hot-css');
let resolve = require('rollup-plugin-node-resolve');

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
        resolve(),
        babel(),
        css({
            filename: 'style.css',
            transform: scss,
            hot: true
        })
    ]
}