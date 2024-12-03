// const { src, dest, watch, series, parallel } = require('gulp');
// const sass = require('gulp-sass')(require('sass'));
// const clean = require('gulp-clean');
// const uglify = require('gulp-uglify');
// const htmlmin = require('gulp-htmlmin');
// const concat = require('gulp-concat');
// const cleanCSS = require('gulp-clean-css');
// const browserSync = require('browser-sync').create();
// const gulp = require('gulp');
// const ghPages = require('gulp-gh-pages');



// gulp.task('build', (done) => {
//     console.log('Building project...');
//     done(); 
//   });

//   gulp.task('deploy', () => {
//     return gulp
//       .src('./dist/**/*', { encoding: false }) 
//       .pipe(ghPages());
//   });



// // Clean the `dist` folder
// function cleanDist() {
//     return src('./dist', { allowEmpty: true }).pipe(clean());
// }

// // Copy and minify HTML files
// function copyHTML() {
//     return src('./*.html')
//         .pipe(htmlmin({ collapseWhitespace: true }))
//         .pipe(dest('./dist'));
// }

// // Compile SCSS into CSS, bundle, and minify
// function compileAndBundleCSS() {
//     return src('./*.scss') 
//         .pipe(sass().on('error', sass.logError)) 
//         .pipe(concat('styles.min.css')) 
//         .pipe(cleanCSS()) 
//         .pipe(dest('./dist/css')) 
//         .pipe(browserSync.stream()); 
// }



// gulp.task('scripts', () => {
//     return gulp
//       .src('./src/js/**/*.js') // Adjust the path to your JavaScript files
//       .pipe(concat('bundle.js')) // Combine files into 'bundle.js'
//       .pipe(uglify()) // Minify the combined file (optional)
//       .pipe(gulp.dest('./dist/js')); // Output directory
//   });
  

// // Copy static assets (e.g., images)
// async function copyAssets() {
//     return src('./assets/**/*', { encoding: false })
//         .pipe(dest('./dist/assets'))
//         .on('error', (err) => console.error('Error in copyAssets task:', err));
// }

// // Start a local server
// function startServer(cb) {
//     browserSync.init({
//         server: {
//             baseDir: './dist', 
//         },
//         port: 3000, 
//     });
//     cb();
// }

// // Reload the browser
// function reloadBrowser(cb) {
//     browserSync.reload();
//     cb();
// }

// // Watch for file changes
// function watchFiles() {
//     watch('./*.html', series(copyHTML, reloadBrowser)); 
//     watch('./*.scss', compileAndBundleCSS); 
//     watch(['./*.js', '!gulpfile.js'], bundleJS, reloadBrowser); 
//     watch('./assets/**/*', series(copyAssets, reloadBrowser)); 
// }

// // Build task
// const build = series(
//     cleanDist,
//     parallel(copyHTML, compileAndBundleCSS, bundleJS, copyAssets)
// );

// exports.build = build;
// exports.cleanDist = cleanDist;

// // Default task to build and start the server
// exports.default = series(
//     build,
//     startServer,
//     watchFiles
// );

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
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('./dist/css'))
        .pipe(browserSync.stream());
}

// Bundle and minify JavaScript files
function bundleJS() {
    return src('./*.js',) // Adjust the path to your JavaScript files
        .pipe(concat('bundle.js')) // Combine files into 'bundle.js'
        .pipe(uglify()) // Minify the combined file
        .pipe(dest('./dist/js')); // Output directory
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
    watch('./*.html', series(copyHTML, reloadBrowser)); // Watch HTML files
    watch('./*.scss', compileAndBundleCSS); // Watch SCSS files
    watch('./*.js', series(bundleJS, reloadBrowser)); // Watch JS files
    watch('./assets/**/*', series(copyAssets, reloadBrowser)); // Watch assets
}

// Build task
const build = series(
    cleanDist,
    parallel(copyHTML, compileAndBundleCSS, bundleJS, copyAssets)
);

// Default task to build and start the server
exports.default = series(build, startServer, watchFiles);

// Export individual tasks
exports.build = build;
exports.cleanDist = cleanDist;
exports.deploy = deploy;
