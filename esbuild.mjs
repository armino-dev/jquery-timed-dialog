import * as esbuild from 'esbuild';
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const ENVIRONMENT = process.env.NODE_ENV || 'development';

console.time('Build time');

try {
    await esbuild.build({
        entryPoints: ['scss/timed-dialog.scss'],
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
} catch (e) {
    console.error(e);
}

console.timeEnd('Build time');