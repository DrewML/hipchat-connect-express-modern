'use strict';

const rollup = require('rollup').rollup;
const rollupBabel = require('rollup-plugin-babel');

rollup({
    entry: './public/js/bundle/index.js',
    plugins: [rollupBabel({
        presets: ['es2015-rollup']
    })]
}).then(bundle => {
    return bundle.write({
        format: 'iife',
        dest: './public/dist/bundle.js',
        sourceMap: 'inline'
    });
});
