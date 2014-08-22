(function () {
    "use strict";

    var gulp = require("gulp"),
        connect = require("connect"),
        lr = require("tiny-lr"),
        server = lr(),
        minifyHTML = require("gulp-minify-html"),
        concat = require("gulp-concat"),
        stripDebug = require("gulp-strip-debug"),
        uglify = require("gulp-uglify"),
        jshint = require("gulp-jshint"),
        changed = require("gulp-changed"),
        imagemin = require("gulp-imagemin"),
        autoprefix = require("gulp-autoprefixer"),
        sass = require("gulp-sass"),
        rjs = require("gulp-requirejs"),
        minifyCSS = require("gulp-minify-css"),
        protractor = require("gulp-protractor"),
        jasmine = require("gulp-jasmine"),
        sourcemaps = require("gulp-sourcemaps"),
        del = require("del"),
        browserSync = require("browser-sync"),
        reload = browserSync.reload;

    // host information
    var host = {
        port: 9000,
        liveReloadPort: 35729
    };

    var paths = {
        app: require("./bower.json").appPath || "app",
        dist: "dist",
        js: ["app/scripts/*.js", "app/scripts/**/*.js"],
        vendor: "app/lib/**/*.js",
        sass: "app/styles/sass/**/*.scss",
        css: "app/styles/*.css",
        images: "app/images/**/*",
        html: "app/**/*.html",
        misc: "app/*.{txt,htaccess,ico}"

    };

    // Empties folders to start fresh
    gulp.task("clean", function (cb) {
        del(["dist"], cb);
    });

    // concatentates all js into one file and vendor files into lib
    gulp.task("js", ["clean"], function() {
        return gulp.src(paths.js)
            .pipe(sourcemaps.init())
                .pipe(uglify({mangle: false}))
                .pipe(concat("all.min.js"))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.dist + "/scripts"));
    });

    // copy vendor js 
    gulp.task("vendor", ["clean"], function() {
        return gulp.src(paths.vendor)
            .pipe(gulp.dest(paths.dist + "/lib"));
    });

    // copy misc assets
    gulp.task("misc", ["clean"], function() {
        return gulp.src(paths.misc)
            .pipe(gulp.dest(paths.dist));
    });

    // Run JSHint 
    gulp.task("jshint", function () {
        gulp.src(paths.js)
            .pipe(jshint())
            .pipe(jshint.reporter(require("jshint-stylish")));
    });

    gulp.task("requirejs", ["clean", "jshint"], function () {
        rjs({
            out: "main.js",
            name: "main",
            preserveLicenseComments: false, // remove all comments
            removeCombined: true,
            baseUrl: paths.app + "/scripts",
            mainConfigFile: "app/scripts/main.js"
        })
            .pipe(stripDebug())
            .pipe(uglify({mangle: false}))
            .pipe(gulp.dest(paths.dist + "/scripts/"));
    });

    // Sass task, will run when any SCSS files change & BrowserSync
    // will auto-update browsers
    gulp.task("sass", function () {
        return gulp.src(paths.sass)
        .pipe(sass({imagePath: "../../images"}))
        .pipe(autoprefix("last 1 version"))
        .pipe(gulp.dest(paths.dist + "/styles"))
        .pipe(gulp.dest(paths.app + "/styles"));
    });

    // minify new images
    gulp.task("imagemin", ["clean"], function () {
        return gulp.src(paths.images)
            .pipe(changed(paths.dist + "/images"))
            // .pipe(imagemin())
            .pipe(gulp.dest(paths.dist + "/images"));
    });

    // minify new or changed HTML pages
    gulp.task("html", ["clean"], function () {
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
            // .pipe(reload({stream:true}));
    });

    // CSS concat, auto-prefix and minify
    gulp.task("autoprefixer", ["clean", "sass"], function () {
        gulp.src(paths.css)
            .pipe(concat("main.css"))
            .pipe(autoprefix("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
            .pipe(minifyCSS())
            .pipe(gulp.dest(paths.dist + "/styles"));
        return gulp.src(paths.app + "/styles/font-awesome/*")
            .pipe(concat("font-awesome.css"))
            .pipe(autoprefix("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
            .pipe(minifyCSS())
            .pipe(gulp.dest(paths.dist + "/styles/font-awesome/"));
            // .pipe(reload({stream:true}));
    });


    // Protractor tests
    // gulp.task("protractorUpdate", protractor.webdriverUpdate);
    // gulp.task("protractor", ["protractorUpdate"], function (cb) {
    //     gulp.src(["tests/e2e/**/*.js"]).pipe(protractor.protractor({
    //         configFile: "protractor.conf.js"
    //     })).on("error", function (e) {
    //         console.log(e);
    //     }).on("end", cb);
    // });

    // Jasmine test
    // gulp.task("jasmine", function() {
    //     gulp.src("spec/**/*.js")
    //         .pipe(jasmine({verbose:true, includeStackTrace: true}));
    // });

    // gulp.task("test", ["protractor", "jasmine"], function () {});

    // serve site from dist folder for testing production
    // gulp.task("dist-test", function () {
    //     connect()
    //         .use(require("connect-livereload")())
    //         .use(connect.static(sources.dist))                          // jshint ignore:line
    //         .listen(sources.port);
    //     server.setMaxListeners(0);
    //
    //     console.log("Server listening on http://localhost:" + sources.port);
    // });


    // watch files for changes and reload
    gulp.task("browser-sync", function() {
        browserSync({
            server: {
                baseDir: "./dist"
            },
            port: 9000
        });

    });

    gulp.task("serve", ["browser-sync"], function() {

        gulp.watch("*.{html,ico,txt}", "views/**/*.html", ["html", "misc", "imagemin", browserSync.reload]);
        gulp.watch("styles/**/*.css", "styles/**/*.scss", ["autoprefixer", browserSync.reload]);
        gulp.watch("scripts/**/*.js", ["requirejs", "vendor", browserSync.reload]);
    });

    gulp.task("build", ["requirejs", "vendor", "misc", "html", "autoprefixer", "imagemin"]);

    gulp.task("default",["build"]);
})();
