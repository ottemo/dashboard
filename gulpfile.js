var gulp        = require('gulp');
var args        = require('yargs').argv;
var fs          = require('fs');
var minifyHTML  = require('gulp-minify-html');
var stripDebug  = require('gulp-strip-debug');
var uglify      = require('gulp-uglify');
var jshint      = require('gulp-jshint');
var autoprefix  = require('gulp-autoprefixer');
var sass        = require('gulp-sass');
var del         = require('del');
var concat      = require('gulp-concat');
var sourcemaps  = require('gulp-sourcemaps');
var refresh     = require('gulp-livereload');
var replace     = require('gulp-replace-task');
var modRewrite  = require('connect-modrewrite');
var RevAll      = require('gulp-rev-all');
var runSequence = require('run-sequence');
var gutil       = require('gulp-util');
var plumber     = require('gulp-plumber');


var paths = {
    html    : 'app/**/*.html',
    misc    : 'app/*.{txt,htaccess,ico}',
    images  : ['app/themes/**/images/**/*'],
    dist    : 'dist',
    jshint  : 'app/scripts/**/*.js',
    scripts : [
        'app/scripts/config.js',
        'app/scripts/main.js',
        'app/scripts/**/init.js',
        'app/scripts/**/*.js'
    ],
    themes: {
        copy: 'app/themes/lib/**/*',
        scripts: [
            'app/themes/scripts/**/excanvas.js',
            'app/themes/scripts/**/jquery.flot.js',
            'app/themes/scripts/**/*.js'
        ],
        styles: 'app/themes/styles/style.scss',
        dist: 'dist/themes',
        fonts: 'app/themes/styles/fonts/**/*',
        images: 'app/themes/images/**/*',
        base: 'app/themes'
    },
    lib:{
        scripts: [
            'app/lib/jquery*.js',
            'app/lib/angular/angular.min.js',
            'app/lib/angular/*.min.js',
            'app/lib/*.min.js'
        ],
        dist: 'dist/lib'
    },
    watch:{
        html: ["app/**/*.html"],
        css: ["app/**/*.scss"],
        js: ["app/scripts/**/*.js"],
        jsThemes: ["app/themes/**/*.js"],
        lib: ["app/lib/**/*.js"]
    }
};

var handleError = function(err) {
    gutil.log(gutil.colors.red('# Error in ' + err.plugin));
    gutil.log('File: %s:%s', err.fileName, err.lineNumber);
    gutil.log('Error Message: %s', err.message);
    gutil.beep();
}

/**
 * argv variables can be passed in to alter the behavior of tasks
 *
 * --env=(production|*)
 * Applies revision thumbprints, minifies media, uses relavent robots...
 * Forces the api to production
 *
 * --api=(production|staging|localhost)
 * Sets the config.js variables, primarily the api to connect to
 */

var isProduction = (args.env === 'production');
var apiConfig = args.api || 'localhost';

// force env to production if --api is rk-prod or kg-prod
if (apiConfig === 'rk-prod' || apiConfig === 'kg-prod') {
    gutil.log('When API is production api, automatically forcing production settings for uglify and versioning');
    isProduction = true;
}

var host = {
    port   : '9000',
    lrPort : '35729'
};

gulp.task('replace', function () {
    // Read the settings from the right file
    var filename = apiConfig + '.json';
    var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

    // Replace each placeholder with the correct value for the variable.
    return gulp.src('config/main.js')
    .pipe(replace({
        patterns: [ { json: settings } ]
    }))
    .pipe(gulp.dest('app/scripts'));
});

// Empties folders to start fresh
gulp.task('clean', function () {
    return del(['dist']);
});

//  -------------------------------
//  task for compilling angular modules
//  -------------------------------

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(plumber(handleError))
    .pipe(gulp.dest(paths.dist+'/scripts/raw'))
    .pipe(uglify({
        mangle:false
    }))
    .pipe(plumber.stop())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.dist+'/scripts'))
    .pipe(refresh());
    // .pipe(notify({ message: 'Script compilation completed' }))
})

//
// app/lib js task
//
gulp.task('lib.scripts', function () {
    return gulp.src(paths.lib.scripts)
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(paths.lib.dist))
        .pipe(refresh());
        // .pipe(notify({ message: 'Lib compilation completed' }))
});

//
// app/themes copy task
//
gulp.task('themes.copy', function(){

    return gulp.src(paths.themes.copy,{ base: paths.themes.base })
        .pipe(gulp.dest(paths.themes.dist));

});

//
// app/themes js task
//
gulp.task('themes.scripts', function () {

    /**
     * Minify and uglify the custom scripts in folder 'scripts' in each theme
     */
    return gulp.src(paths.themes.scripts,{ base: paths.themes.base })
        .pipe(stripDebug())
        .pipe(plumber(handleError))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(plumber.stop())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.themes.dist+'/scripts'));

});

//
// app/themes css task
//
gulp.task('themes.styles', function () {
    return gulp.src(paths.themes.styles,{ base: paths.themes.base })
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', function (error) {
            console.error(error);
            this.emit('end');
        })
        .pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.themes.dist));
});

//
// app/themes images task
//
gulp.task('themes.images', function () {
    return gulp.src(paths.themes.images,{ base: paths.themes.base })
        .pipe(gulp.dest(paths.themes.dist));
});

//
// app/themes fonts task
//
gulp.task('themes.fonts', function () {
    return gulp.src(paths.themes.fonts,{ base: paths.themes.base })
        .pipe(gulp.dest(paths.themes.dist));
});

//
// app misc task (txt,htaccess,ico)
//
gulp.task('misc', function () {
    return gulp.src(paths.misc)
        .pipe(gulp.dest(paths.dist));
});

//
// Run JSHint
//
gulp.task('jshint', function () {
    return gulp.src(paths.jshint)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

//
// app html task (index, themes views)
//
gulp.task('html', function () {
    return gulp.src(paths.html)
        // .pipe(changed(paths.dist))
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

//
// Start livereload server
//
gulp.task('livereload', function(){
    // init express server
    var path = require('path'),
        express = require('express'),
        app = express();

    var staticFolder = path.join(__dirname, 'dist');

    app.use(modRewrite([
      '!\\. /index.html [L]'
    ]))
    .use(express.static(staticFolder));

    app.listen( host.port, function() {
        console.log('server started: http://localhost:'+host.port);
        return gulp;
    });
})



gulp.task('watch',function(){

    refresh.listen({ basePath: 'dist' });

    gulp.start('livereload');

    gulp.watch(paths.watch.html,     ['html']);
    gulp.watch(paths.watch.css,      ['themes.styles']);
    gulp.watch(paths.watch.js,       ['scripts']);
    gulp.watch(paths.watch.jsThemes, ['themes.scripts']);
    gulp.watch(paths.watch.lib,      ['lib.scripts']);
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


gulp.task('lib', ['lib.scripts']);

gulp.task('themes', ['themes.copy','themes.scripts','themes.styles','themes.fonts','themes.images']);

gulp.task('build', function(){
	runSequence('clean',
                'replace',
                'scripts',
                [ 'html', 'lib', 'themes', 'misc' ],
                'revision');
});

gulp.task('default', ['build'] ,function(){
    gulp.start('watch');
});

gulp.task('serve', ['default']);
