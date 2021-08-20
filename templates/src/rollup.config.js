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
            exclude: 'node_modules/**',
            values: {
                __VERSION__: require('./package.json').version,
                __ENVIRONMENT__: production ? 'production' : 'development',
            }
        }),
        copy({ targets: [{ src: 'public/*', dest: 'build' }] }),
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file - better for performance
            css: css => {
                css.write('bundle.css', !production);
            }
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        // !production && serve({
        //     contentBase: ['build'],
        //     port: 5000
        // }),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        // !production && livereload({ watch: 'build' }),
        !production && browsersync({ server: 'build' }),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return

            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('exit', toExit);
            process.on('SIGTERM', toExit);
        }
    };
}
