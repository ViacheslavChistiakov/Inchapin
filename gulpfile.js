import { src, dest, watch, series, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import clean from 'gulp-clean';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import browserSyncModule from 'browser-sync';
import ghPages from 'gulp-gh-pages';
import babel from 'gulp-babel';


const browserSync = browserSyncModule.create();
const gulpSassInstance = gulpSass(sass);

// Clean the `dist` folder
function cleanDist() {
    return src('./dist', { allowEmpty: true }).pipe(clean());
}

// Copy and minify HTML files
function copyHTML() {
    return src('./*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('./dist'));
}

// Compile SCSS into CSS, bundle, and minify
function compileAndBundleCSS() {
    return src('./*.scss')
        .pipe(gulpSassInstance().on('error', gulpSassInstance.logError))
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('./dist/css'))
        .pipe(browserSync.stream());
}

// Bundle and minify JavaScript files
function bundleJS() {
    return src('./*.js',)
     .pipe(babel({
        presets: ['@babel/preset-env'], 
    }))
        .pipe(concat('bundle.js')) 
        .pipe(uglify()) 
        .pipe(dest('./dist/js')); 
}

// Copy static assets (e.g., images)
function copyAssets() {
    return src('./assets/**/*', { encoding: false })
        .pipe(dest('./dist/assets'))
        .on('error', (err) => console.error('Error in copyAssets task:', err));
}

// Deploy to GitHub Pages
function deploy() {
    return src('./dist/**/*', { encoding: false }).pipe(ghPages());
}

// Start a local server
function startServer(cb) {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
        port: 3000,
    });
    cb();
}

// Reload the browser
function reloadBrowser(cb) {
    browserSync.reload();
    cb();
}

// Watch for file changes
function watchFiles() {
    watch('./*.html', series(copyHTML, reloadBrowser)); 
    watch('./*.scss', compileAndBundleCSS);
    watch('./*.js', series(bundleJS, reloadBrowser));
    watch('./assets/**/*', series(copyAssets, reloadBrowser)); 
}

// Build task
const build = series(
    cleanDist,
    parallel(copyHTML, compileAndBundleCSS, bundleJS, copyAssets)
);

// Default task to build and start the server
const _default = series(build, startServer, watchFiles);
export { _default as default };

// Export individual tasks
const _build = build;
export { _build as build };
const _cleanDist = cleanDist;
export { _cleanDist as cleanDist };
const _deploy = deploy;
export { _deploy as deploy };
