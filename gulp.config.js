/*jshint node:true */

module.exports = function() {

    var src = './src/';
    var app = src + 'app/';
    var email = src +'email/';

    var temp = './tmp/';

    var config = {
        // Reserved and written to in gulpfile.js
        env: '',
        settings: '',

        /************** Paths ****************/
        build: 'dist/',

        // App
        fonts: app + '_fonts/**/*.{otf,svg,eot,ttf,woff,woff2}',
        html: {
            root: app + '*.html',
            nonRoot: [
                app + '**/*.html',
                '!' + email + '**/*',
                '!' + app + '*.html',
            ],
        },
        media: [
            // Ignore media, declaring the _images folder directly moves all of its contents
            // without the container folder getting in the way
            app + '_images/**/*.{png,gif,jpg,jpeg,ico,svg,mp4,ogv,webm,pdf}',
            app + '**/*.{png,gif,jpg,jpeg,ico,svg,mp4,ogv,webm,pdf}',
            '!' + app + '_fonts/*',
        ],
        misc: [
            app + '*.{htaccess,ico,xml}',
            app + 'humans.txt'
        ],
        robots: {
            default: app + 'robots.txt',
            prod: app + 'robots.txt',
        },
        styles: {
            root: app + 'app.scss',
            all: [
                app + '**/*.scss',
                app + '**/*.css',
            ],
        },
        scripts: {
            app: [
                temp + 'config.js', // this is a built file
                app + '**/init.js',
                app + '**/*.js',
                '!' + app + '_lib/**/*', // don't clobber lib
            ],
            lib: [
                app + '_lib/jquery.min.js',
                app + '_lib/angular.min.js',
                app + '_lib/**/*.min.js',
            ],
        },

        // Emails
        email: [
            // ignore built files
            email + '*.html',
            '!' + email + '*.inline.html',
        ],

        // Temp
        temp: temp,

        /************** Settings ****************/
        node: {
            port: '9000',
            lrPort: '35729', // not used?
        },
        sassSettings: {
            // outputStyle: 'compressed',
            // precision: 8,
        },
        uglifySettings: {
            mangle: false,
        },
    };

    return config;
};

