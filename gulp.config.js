module.exports = function() {

    var src = './src/';
    var app = src + 'app/';
    var temp = './tmp/';

    var config = {

        /************** Paths ****************/
        build: 'dist/',
        fonts: app + '_fonts/**/*.{otf,svg,eot,ttf,woff,woff2}',
        html: {
            all: app + '**/*.html',
            root: app + '*.html'
        },
        media: [
            // Ignore media, declaring the _images folder directly moves all of its contents
            // without the container folder getting in the way
            '!' + app + '_fonts/*',
            app + '_images/**/*.{png,gif,jpg,jpeg,ico,svg,mp4,ogv,webm,pdf}',
            app + '**/*.{png,gif,jpg,jpeg,ico,svg,mp4,ogv,webm,pdf}',
        ],
        misc: app + '*.{htaccess,ico,xml}',
        robots: {
            default: app + 'robots.txt',
            prod: app + 'robots.txt'
        },
        styles: {
            root: app + 'app.scss',
            all: [
                app + '**/*.scss',
                app + '**/*.css'
            ]
        },
        scripts: {
            app: [
                '!' + app + '_lib/**/*',    // don't grab libs
                temp + 'config.js',         // this is a built file
                app + '_scripts/*.js',
                app + '**/init.js',
                app + '**/*.js'
            ],
            lib: [
                // We only grab libs that are minified
                // so feel free to include non-minified reference files
                app + '_lib/jquery.min.js',
                app + '_lib/angular.min.js',
                app + '_lib/**/*.min.js'
            ]
        },
        temp: temp,

        /************** Settings ****************/
        node: {
            port: '9000',
            lrPort: '35729' // not used?
        },
        sassSettings: {
            // outputStyle: 'compressed',
            // precision: 8,
        },
        uglifySettings: {
            mangle: false
        }
    };

    return config;
};

