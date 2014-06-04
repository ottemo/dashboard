/*jshint unused: vars */
require.config({
    paths: {
        'angular-scenario': '../bower_components/angular-scenario/angular-scenario',
        'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
        'angular-route': '../bower_components/angular-route/angular-route',
        'angular-resource': '../bower_components/angular-resource/angular-resource',
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        'angular-cookies': '../bower_components/angular-cookies/angular-cookies',
        angular: '../bower_components/angular/angular',
        'sass-bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',
        jquery: '../bower_components/jquery/jquery',
        'angular-animate': '../bower_components/angular-animate/angular-animate'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-route': [
            'angular'
        ],
        'angular-cookies': [
            'angular'
        ],
        'angular-sanitize': [
            'angular'
        ],
        'angular-resource': [
            'angular'
        ],
        'angular-animate': [
            'angular'
        ],
        'angular-mocks': {
            deps: [
                'angular'
            ],
            exports: 'angular.mock'
        }
    },
    priority: [
        'angular'
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
    'angular',
    'app',
    'angular-route',
    'angular-cookies',
    'angular-sanitize',
    'angular-animate',
    'angular-resource'
], function (angular, app) {
    'use strict';
    /* jshint ignore:start */
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    /* jshint ignore:end */
    angular.element().ready(function () {
        angular.resumeBootstrap([app.name]);
    });
});