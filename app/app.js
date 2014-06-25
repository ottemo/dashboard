(function (define) {
    'use strict';

    define('app',['angular'],

        function (angular) {
            return angular
                    .module('dashboardApp', [
                        'dashboardApp.services.CustomerService',
                        'dashboardApp.services.ProductService',

                        'dashboardApp.controllers.IndexCtrl',
                        'dashboardApp.czontrollers.VisitorListCtrl',
                        'dashboardApp.controllers.VisitorFormEditCtrl',
                        'dashboardApp.controllers.ProductListCtrl',
                        'dashboardApp.controllers.ProductFormEditCtrl',
                        'dashboardApp.controllers.DashboardConfigCtrl',

                        'dashboardApp.directives.Autofill',
                        'dashboardApp.directives.DashboardHeader',
                        'dashboardApp.directives.DashboardFooter',
                        'dashboardApp.directives.FormSelectState',
                        'dashboardApp.directives.BrowseTabHeader',
                        'dashboardApp.directives.BrowseBody',
                        'dashboardApp.directives.BrowseContainer',
                        'dashboardApp.directives.BrowseController',
                        'dashboardApp.directives.EditContainer',
                        'dashboardApp.directives.VisitorEdit',
                        'dashboardApp.directives.ProductEdit',
                        'dashboardApp.directives.VisitorList',
                        'dashboardApp.directives.ProductList',
                        'dashboardApp.directives.DashboardLogin',

                        'ngCookies',
                        'ngResource',
                        'ngSanitize',
                        'ngAnimate',
                        'ngRoute',
                        'ui.bootstrap'
                    ])
                    .config(function ($routeProvider) {
                        $routeProvider
                          .when('/',                  { redirectTo:  '/dashboard/login' })

                          .when('/dashboard/visitor', { templateUrl: 'views/visitor.html'})
                          .when('/dashboard/product', { templateUrl: 'views/product.html'})
                          .when('/dashboard/login',   { templateUrl: 'views/login.html'})
                          .when('/dashboard/help',    { templateUrl: 'views/help.html'})
                          .when('/dashboard/config',  { templateUrl: 'views/config.html'})

                          .otherwise({ redirectTo: '/'});
                    });
        }
    );

})(window.define);