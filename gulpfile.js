(function () {
    "use strict";

    var gulp = require("gulp"),
        lr = require("tiny-lr"),
        connect = require("connect"),
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
        rimraf = require("rimraf"),
        server = lr(),
        browserSync = require("browser-sync"),
        reload = browserSync.reload;

    //File sources
    var sources = {
        app: require("./bower.json").appPath || "./app",
        js: ["./app/scripts/*.js", "./app/scripts/**/*.js"],
        dist: "./dist",
        port: 9000,
        liveReloadPort: 35729
    };

    // Run JSHint 
    gulp.task("jshint", function () {
        gulp.src(sources.app + "/scripts/**/**/*.js")
            .pipe(jshint())
            .pipe(jshint.reporter(require("jshint-stylish")));
    });

    // Sass task, will run when any SCSS files change & BrowserSync
    // will auto-update browsers
    gulp.task("sass", function () {
        return gulp.src(sources.app + "/styles/sass/**/*.scss")
        .pipe(sass({imagePath: "../../images"}))
        .pipe(autoprefix("last 1 version"))
        .pipe(gulp.dest(sources.dist + "/styles/"))
        .pipe(gulp.dest(sources.app + "/styles/"))
        .pipe(reload({stream:true}));
    });

    // concatentates all js into one file and vendor files into lib
    gulp.task("js", function() {
        gulp.src(sources.js)
        .pipe(concat("main.js"))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(sources.dist + "/scripts/"));
        return gulp.src(sources.app + "/lib/**/*")
        .pipe(gulp.dest(sources.dist + "/lib/"))
        .pipe(reload({stream:true}));
    });

    // minify new images
    gulp.task("imagemin", function () {
        var imgSrc = sources.app + "/images/**/*",
            imgDst = sources.dist + "/images";

        return gulp.src(imgSrc)
            .pipe(changed(imgDst))
            .pipe(imagemin())
            .pipe(gulp.dest(imgDst))
            .pipe(reload({stream:true}));
    });

    // minify new or changed HTML pages
    gulp.task("htmlpage", function () {
        var htmlSrc = sources.app + "/**/*.html",
            htmlDst = sources.dist;

        return gulp.src(htmlSrc)
            .pipe(changed(htmlDst))
            .pipe(minifyHTML({
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true,
                conditionals: true,
                quotes: true,
                empty: true
            }))
            .pipe(gulp.dest(htmlDst));
            // .pipe(reload({stream:true}));
    });

    // CSS concat, auto-prefix and minify
    gulp.task("autoprefixer", ["sass"], function () {
        gulp.src([sources.app + "/styles/*.css"])
            .pipe(concat("main.css"))
            .pipe(autoprefix("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
            .pipe(minifyCSS())
            .pipe(gulp.dest(sources.dist + "/styles/"));
        return gulp.src([sources.app + "/styles/font-awesome/*"])
            .pipe(concat("font-awesome.css"))
            .pipe(autoprefix("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
            .pipe(minifyCSS())
            .pipe(gulp.dest(sources.dist + "/styles/font-awesome/"))
            .pipe(reload({stream:true}));
    });


    gulp.task("requirejs", ["jshint"], function () {
        rjs({
            out: "main.js",
            name: "main",
            preserveLicenseComments: false, // remove all comments
            removeCombined: true,
            baseUrl: sources.app + "/scripts",
            mainConfigFile: sources.app + "/scripts/main.js"
        })
            .pipe(stripDebug())
            .pipe(uglify({mangle: false}))
            .pipe(gulp.dest(sources.dist + "/scripts/"));
    });

    // Protractor tests
    gulp.task("protractorUpdate", protractor.webdriverUpdate);
    gulp.task("protractor", ["protractorUpdate"], function (cb) {
        gulp.src(["tests/e2e/**/*.js"]).pipe(protractor.protractor({
            configFile: "protractor.conf.js"
        })).on("error", function (e) {
            console.log(e);
        }).on("end", cb);
    });

    // Jasmine test
    gulp.task("jasmine", function() {
        gulp.src("spec/**/*.js")
            .pipe(jasmine({verbose:true, includeStackTrace: true}));
    });

    gulp.task("test", ["protractor", "jasmine"], function () {});

    // serve site from dist folder for testing production
    gulp.task("dist-test", function () {
        connect()
            .use(require("connect-livereload")())
            .use(connect.static(sources.dist))                          // jshint ignore:line
            .listen(sources.port);
        server.setMaxListeners(0);

        console.log("Server listening on http://localhost:" + sources.port);
    });

    // Empties folders to start fresh
    gulp.task("clean", function () {
        rimraf.sync(sources.dist + "/*");
    });

    gulp.task("copy", function () {
        gulp.src([
                sources.app + "/*.{ico,png,txt}",
                sources.app + "/.htaccess"
            ]).pipe(gulp.dest(sources.dist));
    });

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

        gulp.watch("*.{html,ico,txt}", "views/**/*.html", ["htmlpage", "copy", "imagemin", browserSync.reload]);
        gulp.watch("styles/**/*.css", "styles/**/*.scss", ["autoprefixer", browserSync.reload]);
        gulp.watch("scripts/**/*.js", ["requirejs", browserSync.reload]);
    });

    gulp.task("build", ["clean", "copy", "htmlpage","autoprefixer", "requirejs", "imagemin"]);

    gulp.task("default",["build"]);
})();
