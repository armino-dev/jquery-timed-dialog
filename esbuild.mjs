import * as esbuild from 'esbuild';
import { sassPlugin } from "esbuild-sass-plugin";
import fileSystem from 'fs';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const WATCH = process.argv.includes('--watch');

console.time('Build time');

const buildCss = async () => {
    await esbuild.build({
        entryPoints: ['src/scss/timed-dialog.scss'],
        outfile: 'dist/timed-dialog.min.css',
        bundle: true,
        minify: true,
        plugins: [
            sassPlugin({
                async transform(source) {
                    const { css } = await postcss([
                        autoprefixer
                    ])
                        .process(source, { from: undefined });
                    return css;
                },
                cssImports: true,
            }),
        ],
        define: {
            'process.env.NODE_ENV': `"${ENVIRONMENT}"`,
        },
    });
}

const buildJs = async () => {
    await esbuild.build({
        entryPoints: ['src/timed-dialog.js'],
        bundle: true,
        minify: true,
        metafile: process.env.NODE_ENV !== 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
        outfile: 'dist/timed-dialog.min.js',
        define: {
            'process.env.NODE_ENV': `"${ENVIRONMENT}"`,
        }
    });
}

try {
    buildCss();
    buildJs();
} catch (e) {
    console.error(e);
}

console.timeEnd('Build time');

if (WATCH) {
    console.log('Watching for changes...');
    console.log();

    const watcher = fileSystem.watch('src', { recursive: true }, async (eventType, filename) => {
        if (filename.includes('scss')) {
            console.log(`${new Date().toLocaleTimeString()} Recompiling css ...`);
            await buildCss();
        } else if (filename.includes('js')) {
            console.log(`${new Date().toLocaleTimeString()} Recompiling javascript ...`);
            await buildJs();
        }

        if (filename.includes('scss') || filename.includes('js')) {
            console.log(`${new Date().toLocaleTimeString()} Done`);
        }
    });

    process.on('SIGINT', () => {
        watcher.close();
        process.exit();
    });
}
