import json from '@rollup/plugin-json';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import browsersync from 'rollup-plugin-browsersync'

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'app/main.js',
    output: {
        sourcemap: !production,
        format: 'iife',
        name: 'app',
        file: 'build/bundle.js'
    },

    context: 'window',

    plugins: [

        json({}),

        replace({
            preventAssignment: true,
            exclude: 'node_modules/**',
            values: {
                __VERSION__: require('./package.json').version,
                __ENVIRONMENT__: production ? 'production' : 'development',
            }
        }),

        /**
         * Export assets from public directory
         * to build directory, which will be served
         * in development.
         */
        copy({
            targets: [{
                src: 'public/*',
                dest: 'build'
            }]
        }),

        svelte({
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file - better for performance
            css: css => {
                css.write('bundle.css', !production);
            }
        }),

        resolve({
            browser: true,
            dedupe: ['svelte']
        }),

        /**
         * If you have external dependencies installed from
         * npm, you'll most likely need these plugins. 
         * In some cases you'll need additional configuration.
         * consult the documentation for details:
         * https://github.com/rollup/plugins/tree/master/packages/commonjs
         */
        commonjs(),

        /**
         * Watch the `build` directory and refresh the
         * browser on changes when not in production.
         * If you are developing a SPA and need URLs
         * for internal navigation uncomment `single`.
         */
        !production && browsersync({
            server: 'build',
            // single: true
        }),

        /**
         * If we're building for production minify.
         * `npm run build` instead of `npm run dev`.
         */
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
