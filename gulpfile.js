const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();




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
        .pipe(sass().on('error', sass.logError)) 
        .pipe(concat('styles.min.css')) 
        .pipe(cleanCSS()) 
        .pipe(dest('./dist/css')) 
        .pipe(browserSync.stream()); 
}

// Concatenate and minify JavaScript files
function bundleJS() {
    return src(['./*.js', '!gulpfile.js']) 
        .pipe(concat('main.js')) 
        .pipe(uglify()) 
        .pipe(dest('./dist/js')) 
        .pipe(browserSync.stream()); 
}

// Copy static assets (e.g., images)
async function copyAssets() {
    return src('./assets/**/*', { encoding: false })
        .pipe(dest('./dist/assets'))
        .on('error', (err) => console.error('Error in copyAssets task:', err));
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
    watch(['./*.js', '!gulpfile.js'], bundleJS, reloadBrowser); 
    watch('./assets/**/*', series(copyAssets, reloadBrowser)); 
}

// Build task
const build = series(
    cleanDist,
    parallel(copyHTML, compileAndBundleCSS, bundleJS, copyAssets)
);

exports.build = build;
exports.cleanDist = cleanDist;

// Default task to build and start the server
exports.default = series(
    build,
    startServer,
    watchFiles
);
