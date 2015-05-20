var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
// var notify = require('gulp-notify');
var refresh = require('gulp-livereload');

var paths = {
    html: 'app/**/*.html',
    misc: 'app/*.{txt,htaccess,ico}',
    images: ['app/themes/**/images/**/*'],
    dist: 'dist',
    jshint: 'app/scripts/**/*.js',
    scripts: [
        'app/scripts/config.js',
        'app/scripts/main.js',
        'app/scripts/**/init.js',
        'app/scripts/**/*.js'
    ],
    themes: {
        copy: 'app/themes/**/lib/**/*',
        scripts: ['app/themes/**/scripts/**/*.js'],
        styles: 'app/themes/**/styles/**/*.css',
        dist: 'dist/themes',
        fonts: 'app/themes/**/styles/fonts/**/*',
        images: 'app/themes/**/images/**/*'
    },
    lib:{
        scripts: [
            'app/lib/angular/angular.min.js',
            'app/lib/angular/*.js',
            'app/lib/jquery*.js',
            // 'tinymce.min.js',
            'app/lib/*.js'
        ],
        copy: ['app/lib/tinymce/**/*'],
        dist: 'dist/lib'
    }
};

var env = process.env.NODE_ENV || 'development';

var host = {
    port: '9000',
    lrPort: '35729'
};

// Empties folders to start fresh
gulp.task('clean', function (cb) {
    del(['dist/*','!dist/media'], cb);
});

//  -------------------------------
//  task for compilling angular modules
//  -------------------------------

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.dist+'/scripts'))
    .pipe(refresh())
    // .pipe(notify({ message: 'Script compilation completed' }))
})

//
// app/lib copy task
//
gulp.task('lib.copy',  function () {
    return gulp.src(paths.lib.copy,{ base: 'app/lib' })
        .pipe(gulp.dest(paths.lib.dist));
});

//
// app/lib js task
//
gulp.task('lib.scripts', function () {
    return gulp.src(paths.lib.scripts)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(paths.lib.dist))
        .pipe(refresh())
        // .pipe(notify({ message: 'Lib compilation completed' }))
});

//
// app/themes copy task
//
gulp.task('themes.copy', function(){

    return gulp.src(paths.themes.copy,{ base: 'app/themes' })
        .pipe(gulp.dest(paths.themes.dist));

});

//
// app/themes js task
//
gulp.task('themes.scripts', function () {

    /**
     * Minify and uglify the custom scripts in folder 'scripts' in each theme
     */
    return gulp.src(paths.themes.scripts)
        .pipe(stripDebug())
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(paths.themes.dist));

});

//
// app/themes css task
//
gulp.task('themes.styles', function () {
    return gulp.src(paths.themes.styles)
        .pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifyCSS({
            processImport: false
        }))
        .pipe(gulp.dest(paths.themes.dist));
});

//
// app/themes images task
//
gulp.task('themes.images', function () {
    return gulp.src(paths.themes.images)
        // .pipe(changed(paths.themeDest))
        // .pipe(imagemin())
        .pipe(gulp.dest(paths.themes.dist));
});

//
// app/themes fonts task
//
gulp.task('themes.fonts', function () {
    return gulp.src(paths.themes.fonts)
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
        .pipe(jshint.reporter(require('jshint-stylish')));
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

    var static_folder = path.join(__dirname, 'dist');

    app.use(express.static(static_folder));
    app.listen( host.port, function() {

        console.log('server started: http://localhost:'+host.port);


        return gulp;
    });
})



gulp.task('watch',function(){

    refresh.listen({ basePath: 'dist' });

    gulp.start('livereload');

    gulp.watch(["app/**/*.html"],['html']);
    gulp.watch(["app/**/*.css"],['themes.styles']);
    gulp.watch(["app/scripts/**/*.js"],['scripts']);
    gulp.watch(["app/lib/**/*.js"],['lib.scripts']);
})

gulp.task('lib', ['lib.copy','lib.scripts']);

gulp.task('themes', ['themes.copy','themes.scripts','themes.styles','themes.fonts','themes.images']);

gulp.task('build', ['scripts', 'html','lib','themes','misc']);

gulp.task('default', ['build'] ,function(){
    gulp.start('watch');
});
