/*jshint node: true */

var args = require('yargs').argv;
var colors = require('chalk');
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
 */
gulp.task('default', ['help']);
gulp.task('help', function() {
    logHead('Options');
    logBody([
        '--env=[prod|staging|local]',
        '    Controls applying revision thumbprints, minifying media, choosing robots.txt',
        '    `prod` forces the api to production',
        '    Defaults to local',
        '',
        '--config=[demo-prod|demo-staging|kg-prod|kg-staging|mp-prod|mp-staging|rk-prod|rk-staging|local]',
        '    Sets which config file to use. `/config/*.json`',
        '    Settings include; useStrict, apiUrl, fbAppId, googleClientId, googleAnalyticsId',
        '    Defaults to `kg-staging`',
    ], 1);

    logHead('Example Usage');
    logBody('Make a production build',1);
    logBody('`gulp build --env=prod --config=kg-prod`', 2, 'cyan');
    logBody('');
    logBody('Start a development server',1);
    logBody('`gulp serve`', 2, 'cyan');
    logBody('');
    logBody('Start a development server using a local api server',1);
    logBody('`gulp serve --config=local`', 2, 'cyan');

    return $.taskListing.withFilters(null, 'default')();
});


//////////////////////////////

gulp.task('readArgs', function readArgs(cb) {
    // Read the args, and set defaults
    config.env = args.env || 'local';
    config.configFile = args.config || 'kg-staging';

    // The `env` arg drives whether or not this is production
    config.isEnvProduction = (config.env === 'prod');
    config.isEnvStaging = (config.env === 'staging');
    config.isEnvLocal = (config.env === 'local');

    logHead('Argument Feedback');
    if (config.isEnvProduction) {
        if (config.configFile.indexOf('-prod') === -1) {
            // making this blank causes @readConfig to bomb out, which is maybe good
            logBody('--config argument must end in `-prod` when --env=prod', 1, 'red');
            config.configFile = '';
        }
    }

    logBody([
        '--env=' + config.env,
        '--config=' + config.configFile,
        '',
    ], 1, 'cyan');

    // Assign the application settings from the config folder
    // this read is sync
    config.settings = readConfig(config.configFile);

    cb();
});

/**
 * Read the settings from the right file
 */
function readConfig(configFile) {
    return JSON.parse(fs.readFileSync('./config/' + configFile + '.json', 'utf8'));
}

/**
 * Build the app
 * This is typically used when getting ready to deploy the app
 * `gulp build --env=prod`
 */
gulp.task('build', function build(cb) {
    runSequence('clean', 'readArgs', 'config', 'compile', 'revision', cb);
});

/**
 * Build and start a server
 * This is typically used for local development work
 * `gulp serve` or `gulp serve --config=local`
 */
gulp.task('serve', ['build'], function serve() {
    gulp.start('serve_watch');
});

/**
 * Vet the code
 */
gulp.task('vet', function vet() {
    return gulp.src(config.scripts.app)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

/**
 * Remove all build / temp files
 */
gulp.task('clean', function clean(done) {
    del([config.build], done);
});

/**
 * Replace the config placeholders with the correct value for the variable
 * from the config files in /config. Then move the file to a tmp folder
 *
 * `gulp build --config=(prod|staging|local)`
 */
gulp.task('config', function() {
    var replacePattern = {
        patterns: [{
            json: config.settings
        }]
    };

    return gulp.src('config/config.js')
        .pipe($.replaceTask(replacePattern))
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
    'compile_fonts',
    'compile_emails',
]);

/**
 * Compile all javascript
 */
gulp.task('compile_scripts', ['compile_scripts_app', 'compile_scripts_lib']);

gulp.task('compile_scripts_app', function compile_scripts_app() {

    // REFACTOR: This makes dev/staging/production different... :-1:
    // uglify + concat breaks sourcemaps so don't use it unless we are on production
    // https://github.com/terinjokes/gulp-uglify/issues/105
    if (config.isEnvProduction || config.isEnvStaging) {
        return gulp.src(config.scripts.app)
            .pipe($.plumber(handleError))
            .pipe($.uglify(config.uglifySettings))
            .pipe($.plumber.stop())
            .pipe($.concat('main.js'))
            .pipe(gulp.dest(config.build + 'scripts'));
    } else {
        return gulp.src(config.scripts.app)
            .pipe($.concat('main.js'))
            .pipe(gulp.dest(config.build + 'scripts'));
    }
});

gulp.task('compile_scripts_lib', function compile_scripts_lib() {
    return gulp.src(config.scripts.lib)
        .pipe($.concat('lib.js'))
        .pipe(gulp.dest(config.build + 'scripts'));
});

/**
 * Compile all of the html files
 */
gulp.task('compile_html', ['compile_html_root', 'compile_html_nonroot']);

gulp.task('compile_html_root', function() {
    // var replacePattern = {
    //     patterns: [{
    //         json: config.settings
    //     }]
    // };

    return gulp.src(config.html.root)
        // .pipe($.replaceTask(replacePattern))
        .pipe($.changed(config.build))
        .pipe(gulp.dest(config.build));
});

gulp.task('compile_html_nonroot', function compile_html_nonroot() {
    return gulp.src(config.html.nonRoot)
        .pipe($.changed(config.build + 'views/'))
        .pipe(gulp.dest(config.build + 'views/'));
});

/**
 * Compile the robots.txt file
 * --env=(prod|*)
 */
gulp.task('compile_robots', function compile_robots() {
    var robotPath = config.isEnvProduction ? config.robots.prod : config.robots.default;
    return gulp.src(robotPath)
        .pipe($.rename('robots.txt'))
        .pipe(gulp.dest(config.build));
});

/**
 * Compile oddball files
 */
gulp.task('compile_misc', function compile_misc() {
    return gulp.src(config.misc)
        .pipe(gulp.dest(config.build));
});

/**
 * Compile styles
 * SASS -> CSS -> app.min.css
 */
gulp.task('compile_styles', function compile_styles() {

    // REFACTOR: autoprefixer seems to not play well with sass + sourcemaps
    return gulp.src(config.styles.root)
        .pipe($.sourcemaps.init())
        .pipe($.plumber(handleError))
        .pipe($.sass(config.sassSettings))
        .pipe($.rename({
            suffix: '.min'
        }))
        // .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe($.plumber.stop())
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest(config.build + 'styles/'));
});

/**
 * Move and minify images / mixed-media
 */
gulp.task('compile_media', function compile_media() {

    var mediaBuild = config.build + 'images/';
    var isMinifyActive = config.isEnvProduction || config.isEnvStaging;

    return gulp.src(config.media)
        .pipe($.changed(mediaBuild))
        .pipe($.if(isMinifyActive, $.imagemin()))
        .pipe(gulp.dest(mediaBuild));
});

/**
 * Move fonts
 */
gulp.task('compile_fonts', function compile_fonts() {
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts/'));
});

/**
 * Inline css for emails
 */
gulp.task('compile_emails', function compile_emails() {
    return gulp.src(config.email)
        .pipe($.inlineCss())
        .pipe($.rename({
            suffix: '.inline'
        }))
        .pipe(gulp.dest('./src/email'));
});

/**
 * Watch files for changes and compile
 */
gulp.task('serve_watch', function serve_watch() {
    gulp.start('serve_server');

    // App
    gulp.watch(config.html.root,    ['compile_html_root']);
    gulp.watch(config.html.nonRoot, ['compile_html_nonroot']);
    gulp.watch(config.styles.all,   ['compile_styles']);
    gulp.watch(config.scripts.lib,  ['compile_scripts_lib']);
    gulp.watch(config.scripts.ie,   ['compile_scripts_ie']);
    gulp.watch(config.scripts.app,  ['compile_scripts_app']);

    // Emails
    gulp.watch(config.email, ['compile_emails']);
});

/**
 * Starts a server in the build directory
 */
gulp.task('serve_server', function serve_server() {
    var express = require('express');
    var path = require('path');
    var app = express();
    var staticFolder = path.join(__dirname, config.build);

    app.use(modRewrite(['!\\. /index.html [L]']))
        .use(express.static(staticFolder));

    app.listen(config.node.port, function() {
        logHead('Server Started');
        logBody([
            'Storefront: http://localhost:' + config.node.port,
            'Foundation: ' + config.settings['apiUrl'],
            '',
        ]);
        return gulp;
    });
});

/**
 * Thumbprint js, css for prod and staging
 * --env=(prod|*)
 */
gulp.task('revision', function revision() {
    if (config.isEnvProduction || config.isEnvStaging) {
        var revAll = new $.revAll({
            dontUpdateReference: ['.html'],
            dontRenameFile: ['.html']
        });

        return gulp.src(config.build + '**/*.{js,css,html}')
            .pipe(revAll.revision())
            .pipe(gulp.dest(config.build));
    }
});

////////////////////////////////

function handleError(err) {
    logHead('Error');
    logBody('Plugin: ' + err.plugin);
    if (err.fileName) {
        logBody('File: ' + err.fileName + ':' + err.lineNumber);
    }
    logBody('Message: ' + err.message);

    $.util.beep();
}

function logHead(msg) {
    var bar = '------------------------------';
    console.log('');
    console.log(colors.gray(msg));
    console.log(bar);
}

function logBody(msgs, prefixCount, strColor) {
    if (typeof prefixCount === 'undefined') {
        prefixCount = 1;
    }
    var prefix = repeat('    ', prefixCount);
    msgs = (typeof msgs === 'string') ? [msgs] : msgs;

    msgs.forEach(function(msg) {
        if (strColor) {
            msg = colors.styles[strColor].open + msg + colors.styles[strColor].close;
        }
        console.log(prefix + msg);
    });
}

function repeat(str, num) {
    var resp = '';
    if (num) {
        for (var i = 0; i < num; i++) {
            resp += str;
        }
    }
    return resp;
}
