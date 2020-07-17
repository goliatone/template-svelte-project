'use strict';

const fs = require('fs');
const posthtml = require('posthtml');
const { hash } = require('posthtml-hash');
const htmlnano = require('htmlnano');
//see for list of plugins https://posthtml.github.io/posthtml-plugins/
//see to integrate postcss https://github.com/posthtml/posthtml-postcss

const configTag = require('posthtml-content')({
    config: _ => `
    localStorage.setItem('dataviz.api.token', '<%= locals.token %>');
    `
});

const plugins = [
    /**
     * Hashes `bundle.css` and `bundle.js` in `build/`
     */
    hash({ path: 'build' }),

    configTag,
    /**
     * Minifies `build/index.html`
     */
    // htmlnano()
];

const html = fs.readFileSync('build/index.html');


posthtml(plugins)
    .process(html)
    .then(result => fs.writeFileSync('build/index.html', result.html));