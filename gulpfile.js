var gulp        = require('gulp');
var args        = require('yargs').argv;
var fs          = require('fs');
var minifyHTML  = require('gulp-minify-html');
var uglify      = require('gulp-uglify');
var jshint      = require('gulp-jshint');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var autoprefix  = require('gulp-autoprefixer');
var sass        = require('gulp-sass');
var del         = require('del');
var concat      = require('gulp-concat');
var refresh     = require('gulp-livereload');
var modRewrite  = require('connect-modrewrite');
var RevAll      = require('gulp-rev-all');
var runSequence = require('run-sequence');
var replace     = require('gulp-replace-task');
var sourcemaps  = require('gulp-sourcemaps');
var rename      = require('gulp-rename');
var gulpIf      = require('gulp-if');
var gutil       = require('gulp-util');
var plumber     = require('gulp-plumber');


var paths = {
    dist: 'dist',
    jshint: [
        'app/scripts/**/*.js',
        'app/themes/**/*.js'
    ],
    html: 'app/**/*.html',
    misc: 'app/*.{htaccess,ico,xml,txt}',
    scripts: [
        'app/scripts/config.js',
        'app/scripts/main.js',
        'app/scripts/**/init.js',
        'app/scripts/**/*.js'
    ],
    theme: {
        dist: 'dist/themes',
        styles: 'app/themes/styles/style.scss',
        // images, videos, fonts
        media: 'app/themes/**/*.{png,gif,jpg,jpeg,ico,svg,mp4,ogv,webm,pdf,eot,ttf,woff,woff2}',
        scripts: [
            'app/themes/lib/**/*.js',
            'app/themes/**/*.js'
        ]
    },
    lib: {
        dist: 'dist/lib',
        scripts: [
            'app/lib/jquery.min.js',
            'app/lib/angular.min.js',
            'app/lib/*.min.js' // NOTE: no folder glob, or it would clobber .ie
        ],
        ie: 'app/lib/ie/*.min.js'
    }
};

var handleError = function(err) {
    gutil.log(gutil.colors.red('# Error in ' + err.plugin));
    gutil.log('File: %s:%s', err.fileName, err.lineNumber);
    gutil.log('Error Message: %s', err.message);
    gutil.beep();
}

var host = {
    port: '9000',
    lrPort: '35729'
};

/**
 * argv variables can be passed in to alter the behavior of tasks
 *
 * --env=(production|*)
 * Applies revision thumbprints, minifies media, uses relavent robots...
 * Forces the api to production
 *
 * --api=(localhost|kg-staging|kg-prod|rk-staging|rk-prod|ub-staging|ub-prod)
 * Sets the config.js variables, primarily the api to connect to
 */

var isProduction = (args.env === 'production');
var apiConfig = args.api || 'kg-staging';

// force apiConfig to production if --env=production
if (isProduction) {
    if (apiConfig.indexOf('-prod') == -1) {
        gutil.log('When env is production the api will be automatically forced to production');
        //TODO: PREVENT THE BUILD?

        if (apiConfig.indexOf('-') !== -1) {
            apiConfig = apiConfig.substring(0,2) + '-prod';
        } else {
            apiConfig = '';
        }
    }
}

gulp.task('replace', function () {
    // Read the settings from the right file
    var filename = apiConfig + '.json';
    var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

    // Replace each placeholder with the correct value for the variable.
    return gulp.src('config/config.js')
        .pipe(replace({
            patterns: [{
                json: settings
            }]
        }))
        .pipe(gulp.dest('app/scripts'));
});

// Empties folders to start fresh
gulp.task('clean', function () {
    return del(['dist','app/scripts/config.js']);
});

gulp.task('jshint', function () {
    return gulp.src(paths.jshint)
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe(changed(paths.dist))
        .pipe(minifyHTML({
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeCommentsFromCDATA: true,
            removeOptionalTags: true,
            conditionals: true,
            quotes: true,
            empty: true
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('robots', function () {
    // var robotPath;
    // if ( isProduction ) {
    //     robotPath = 'app/robots.prod.txt';
    // } else {
    //     robotPath = 'app/robots.dev.txt';
    // }
    // gulp.src(robotPath)
    //     .pipe(rename('robots.txt'))
    //     .pipe(gulp.dest(paths.dist));

    return gulp.src(paths.misc)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(plumber(handleError))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(plumber.stop())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.dist + '/scripts'))
        .pipe(refresh());
});

gulp.task('theme.styles', function () {
    return gulp.src(paths.theme.styles)
        .pipe(sourcemaps.init())
        .pipe(plumber(handleError))
        .pipe(sass.sync({
            outputStyle: 'compressed',
            precision: 8,
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(plumber.stop())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.theme.dist + '/styles'))
        .pipe(refresh());
});

gulp.task('theme.scripts', function () {
    return gulp.src(paths.theme.scripts)
        .pipe(sourcemaps.init())
        .pipe(plumber(handleError))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(plumber.stop())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.theme.dist))
        .pipe(refresh());
});

gulp.task('theme.media', function () {
    return gulp.src(paths.theme.media)
        .pipe(changed(paths.theme.dist))
        .pipe(gulpIf(isProduction, imagemin()))
        .pipe(gulp.dest(paths.theme.dist));
});

gulp.task('lib.scripts', function () {
    return gulp.src(paths.lib.scripts)
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest(paths.lib.dist));
});

// IE libs can stick together, but need to be separate from other libs
gulp.task('lib.ie', function() {
    return gulp.src(paths.lib.ie)
        .pipe(concat('ie-libs.js'))
        .pipe(gulp.dest(paths.lib.dist));
});


gulp.task('watch',function(){
    refresh.listen({ basePath: paths.dist });

    gulp.start('livereload');

    gulp.watch(["app/**/*.html"],['html']);
    gulp.watch(["app/**/*.scss","app/**/*.css"],['theme.styles']);
    gulp.watch(["app/scripts/**/*.js"],['scripts']);
    gulp.watch(["app/themes/**/*.js"],['theme.scripts']);
});

gulp.task('livereload', function(){
    var path = require('path');
    var express = require('express');
    var app = express();
    var staticFolder = path.join(__dirname, 'dist');

    app.use(modRewrite([
        '!\\. /index.html [L]'
    ]))
        .use(express.static(staticFolder));

    app.listen( host.port, function() {
        console.log('server started: http://localhost:' + host.port);
        return gulp;
    });
});

gulp.task('revision', function(){
    if(isProduction) {
        var revAll = new RevAll({
            dontUpdateReference: [/^((?!.js|.css).)*$/g],
            dontRenameFile: [/^((?!.js|.css).)*$/g]
        });

        gulp.src('dist/**')
            .pipe(revAll.revision())
            .pipe(gulp.dest('dist'));
    }
});


gulp.task('lib', ['lib.ie', 'lib.scripts']);
gulp.task('theme', [
    'theme.styles',
    'theme.scripts',
    'theme.media'
]);

// build task for populating the /dist folder
gulp.task('build', function(){
    runSequence('clean',
                'replace',
                [ 'html', 'robots', 'scripts', 'theme', 'lib' ],
                'revision');
});

// For development
gulp.task('serve', ['default']);
gulp.task('default', ['build'], function(){
    gulp.start('watch');
});
