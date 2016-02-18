var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var modRewrite = require('connect-modrewrite');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')({
    lazy: true
});

/**
 * yargs variables can be passed in to alter the behavior of tasks
 *
 * --env=(prod|staging|local)
 * Applies revision thumbprints, minifies media, uses relavent robots...
 * Forces the api to production
 *
 * --api=(local|kg-staging|kg-prod|rk-staging|rk-prod|ub-staging|ub-prod)
 * Sets the config.js variables, primarily the api to connect to
 */

activate();

//////////////////////////////

function activate() {
    // Read the args, and set defaults
    config.env = args.env || 'local';
    config.api = args.api || 'kg-staging';

    // The `env` arg drives whether or not this is production
    config.isEnvProduction = (config.env === 'prod');
    config.isEnvStaging = (config.env === 'staging');
    config.isEnvLocal = (config.env === 'local');

    if (config.isEnvProduction) {
        if (config.api.indexOf('-prod') === -1) {
            log('You must select a production api when setting env to production');
            config.api = ''; // making this blank causes @readConfig to bomb out, which is maybe good
            //TODO: PREVENT THE BUILD?
        }
    }

    // Assign the application settings from the config folder
    config.appSettings = readConfig(config.api);

    giveArgumentFeedback();
}

/**
 * Log some feedback related to the args we just processed
 */
function giveArgumentFeedback() {
    var bar = '+-----------------------------------+';
    log(bar);
    log('Environment Settings');
    log('env = ' + config.env);
    log('api = ' + config.api);
    log(bar);
}

/**
 * Read the settings from the right file
 */
function readConfig(api) {
    return JSON.parse(fs.readFileSync('./config/' + api + '.json', 'utf8'));
}

/**
 * List the tasks available
 */
gulp.task('help', $.taskListing.withFilters(null, 'default'));
gulp.task('default', ['help']);

/**
 * Build the app
 * This is typically used when getting ready to deploy the app
 * `gulp build --env=prod`
 */
gulp.task('build', function() {
    runSequence('clean', 'config', 'compile', 'revision');
});

/**
 * Build and start a server
 * This is typically used for local development work
 * `gulp serve` or `gulp serve --api=local`
 */
gulp.task('serve', ['build'], function() {
    gulp.start('serve_watch');
});

/**
 * Vet the code
 */
gulp.task('vet', function() {
    return gulp.src(config.scripts.app)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

/**
 * Remove all build / temp files
 */
gulp.task('clean', function(done) {
    del([config.build], done);
});

/**
 * Replace the config placeholders with the correct value for the variable
 * from the config files in /config. Then move the file to a tmp folder
 *
 * `gulp build --api=(prod|staging|local)`
 */
gulp.task('config', function() {
    return gulp.src('config/config.js')
        .pipe($.replaceTask({
            patterns: [{
                json: config.appSettings
            }]
        }))
        .pipe(gulp.dest(config.temp));
});

/**
 * Run all compiling tasks
 */
gulp.task('compile', [
    'compile_html',
    'compile_misc',
    'compile_robots',
    'compile_scripts',
    'compile_styles',
    'compile_media',
    'compile_fonts'
]);

/**
 * Compile all javascript
 */
gulp.task('compile_scripts', ['compile_scripts_app', 'compile_scripts_lib']);

gulp.task('compile_scripts_app', function() {

    // REFACTOR: This makes dev/staging/production different... :-1:
    // uglify + concat breaks sourcemaps so don't use it unless we are on production
    // https://github.com/terinjokes/gulp-uglify/issues/105
    if (config.isEnvProduction) {
        return gulp.src(config.scripts.app)
            .pipe($.plumber(handleError))
            .pipe($.uglify(config.uglifySettings))
            .pipe($.plumber.stop())
            .pipe($.concat('main.js'))
            .pipe(gulp.dest(config.build + 'scripts'));
    } else {
        return gulp.src(config.scripts.app)
            .pipe($.concat('main.js'))
            .pipe(gulp.dest(config.build + 'scripts'))
            .pipe($.livereload());
    }
});

gulp.task('compile_scripts_lib', function() {
    return gulp.src(config.scripts.lib)
        .pipe($.concat('lib.js'))
        .pipe(gulp.dest(config.build + 'scripts'));
});

/**
 * Compile all of the html files
 */
gulp.task('compile_html', ['compile_html_root', 'compile_html_nonroot']);

gulp.task('compile_html_root', function() {
    return gulp.src(config.html.root)
        .pipe($.changed(config.build))
        .pipe(gulp.dest(config.build));
});

gulp.task('compile_html_nonroot', function() {
    return gulp.src(['!' + config.html.root, config.html.all])
        .pipe($.changed(config.build + 'views/'))
        .pipe(gulp.dest(config.build + 'views/'));
});

/**
 * Compile the robots.txt file
 * --env=(prod|*)
 */
gulp.task('compile_robots', function() {
    var robotPath = config.isEnvProduction ? config.robots.prod : config.robots.default;
    return gulp.src(robotPath)
        .pipe($.rename('robots.txt'))
        .pipe(gulp.dest(config.build));
});

/**
 * Compile oddball files
 */
gulp.task('compile_misc', function() {
    return gulp.src(config.misc)
        .pipe(gulp.dest(config.build));
});

/**
 * Compile styles
 * SASS -> CSS -> app.min.css
 */
gulp.task('compile_styles', function() {

    // REFACTOR: autoprefixer seems to not play well with sass + sourcemaps
    return gulp.src(config.styles.root)
        .pipe($.sourcemaps.init())
        .pipe($.plumber(handleError))
        .pipe($.sass.sync(config.sassSettings))
        .pipe($.rename({
            suffix: '.min'
        }))
        // .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe($.plumber.stop())
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest(config.build + 'styles/'))
        .pipe($.livereload());
});

/**
 * Move and minify images / mixed-media
 */
gulp.task('compile_media', function() {

    var mediaBuild = config.build + 'images/';

    return gulp.src(config.media)
        .pipe($.changed(mediaBuild))
        .pipe($.if(config.isEnvProduction, $.imagemin()))
        .pipe(gulp.dest(mediaBuild));
});

/**
 * Move fonts
 */
gulp.task('compile_fonts', function() {
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts/'));
});

/**
 * Watch files for changes and compile
 */
gulp.task('serve_watch', function() {
    $.livereload.listen({
        basePath: config.build
    });

    gulp.start('serve_server');

    gulp.watch(config.html.all, ['compile_html']);
    gulp.watch(config.styles.all, ['compile_styles']);
    gulp.watch(config.scripts.lib, ['compile_scripts_lib']);
    gulp.watch(config.scripts.ie, ['compile_scripts_ie']);
    gulp.watch(config.scripts.app, ['compile_scripts_app']);
});

/**
 * Starts a server in the build directory
 */
gulp.task('serve_server', function() {
    var express = require('express');
    var path = require('path');
    var app = express();
    var staticFolder = path.join(__dirname, config.build);

    app.use(modRewrite(['!\\. /index.html [L]']))
        .use(express.static(staticFolder));

    app.listen(config.node.port, function() {
        var bar = '+-----------------------------------+';
        log(bar);
        log('Server Started');
        log('Dashboard:  http://localhost:' + config.node.port);
        log('Foundation: ' + config.appSettings['apiUrl']);
        log(bar);
        return gulp;
    });
});

/**
 * Thumbprint js, css
 * Only fires for production
 * --env=(prod|*)
 */
gulp.task('revision', function() {
    if (config.isEnvProduction) {
        var revAll = new $.revAll({
            dontUpdateReference: [/^((?!.js|.css).)*$/g],
            dontRenameFile: [/^((?!.js|.css).)*$/g]
        });

        return gulp.src(config.build + '**')
            .pipe(revAll.revision())
            .pipe(gulp.dest(config.build));
    }
});

////////////////////////////////

function handleError(err) {
    log('# Error in ' + err.plugin);
    if (err.fileName) {
        log('File: '+ err.fileName +':'+ err.lineNumber);
    }
    log('Error Message: ' + err.message);
    $.util.beep();
}

function log(msg) {
    $.util.log($.util.colors.magenta(msg));
}
