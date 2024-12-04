import gulp from 'gulp';
import clean from 'gulp-clean';
import uglify from 'gulp-uglify';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import browserSyncLib from 'browser-sync';
import source from 'vinyl-source-stream';
import browserify from 'browserify';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';

const { src, dest, series, parallel, watch } = gulp;
const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);



function scripts() {
    return browserify({
        entries: './main.js', // Entry point for the bundle
        transform: [
            babelify.configure({
                presets: ['@babel/preset-env'], // Transpile modern JavaScript
            }),
        ],
        debug: true, // Enable inline source maps
    })
        .bundle() // Bundle dependencies
        .on('error', (err) => {
            console.error('Browserify Error:', err.message); // Log errors
            this.emit('end');
        })
        .pipe(source('bundle.js')) // Convert Browserify output to Vinyl stream
        .pipe(buffer()) // Convert to a buffered Vinyl file for Gulp plugins
        .pipe(sourcemaps.init({ loadMaps: true })) // Load inline source maps from Browserify
        .pipe(uglify()) // Minify JavaScript
        .pipe(sourcemaps.write('./')) // Write source maps
        .pipe(dest('./dist/js')); // Save to dist/js
}
// Clean the `dist` folder
function cleanDist() {
    return src(['./dist/**/*', '!./dist/assets', '!./dist/assets/**', '!./dist/js', '!./dist/css', '!./dist/js/bundle.js'],{ allowEmpty: true }).pipe(clean({ force: true }));
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
    watch('./*.js', series( reloadBrowser));
    watch('./assets/**/*', series(copyAssets, reloadBrowser)); 
}



// Build task
const build = series(
    cleanDist,
    parallel(copyHTML, compileAndBundleCSS, scripts,  copyAssets)
);

// Default task to build and start the server
const _default = series(build, startServer, watchFiles);
export default _default;

// Export individual tasks
export { build, cleanDist, deploy, scripts };


