const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');


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
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('./dist/css'))
        .pipe(browserSync.stream());
}

// Bundle and minify JavaScript files
function bundleJS() {
    return src('./*.js',)
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
exports.default = _default;

// Export individual tasks
exports.build = build;
exports.cleanDist = cleanDist;
exports.deploy = deploy;


