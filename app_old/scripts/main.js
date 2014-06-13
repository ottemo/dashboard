window.name = 'NG_DEFER_BOOTSTRAP!'; // http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap

require.config({
    'paths': {
        'angular':           '../lib/angular/angular.min',

        'angular-scenario':  '../lib/angular/angular-scenario.min',
        'angular-sanitize':  '../lib/angular/angular-sanitize.min',
        'angular-route':     '../lib/angular/angular-route.min',
        'angular-resource':  '../lib/angular/angular-resource.min',
        'angular-cookies':   '../lib/angular/angular-cookies.min',
        'angular-mocks':     '../lib/angular/angular-mocks',

        'angular-animate':   '../lib/angular/angular-animate.min',
        'angular-bootstrap': '../lib/angular/ui-bootstrap-tpls.min',

        'jquery':            '../lib/jquery.min',

        //'bootstrap-sass':    '../lib/bootstrap-sass/bootstrap.min',
    },
    'shim': {
        'angular':           {exports: 'angular'},

        'angular-route':     ['angular'],
        'angular-cookies':   ['angular'],
        'angular-sanitize':  ['angular'],
        'angular-resource':  ['angular'],
        'angular-animate':   ['angular'],
        
        'angular-mocks':     { deps: ['angular'], exports: 'angular.mock'},
        'angular-bootstrap': { deps: ['angular'], exports: 'ui-bootstrap'},
    },
    'priority': ['angular']
});

require(['dashboard',
         'angular',
         'angular-route',
         'angular-cookies',
         'angular-sanitize',
         'angular-animate',
         'angular-resource',
         'angular-bootstrap'
        ],
        function (dashboard, angular, ngRoutes, ngCookies, ngSanitize, ngAnimate, ngResource, ngBootstrap) {
            'use strict';

            angular.element(document).ready(function() { angular.resumeBootstrap([dashboard.name]); });
        }
);
