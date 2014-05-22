/*jshint unused: vars */
define(['angular',
  'services/customer',
  'services/product',
  'controllers/index',
  'controllers/visitor/form/edit',
  'controllers/product/form/edit',
  'controllers/visitor/list',
  'controllers/product/list',
  'controllers/config/config',
  'directives/header',
  'directives/footer',
  'directives/visitor/list',
  'directives/visitor/edit',
  'directives/product/list',
  'directives/product/edit',
  'directives/form/select/state',
  'directives/browse/body',
  'directives/browse/controller',
  'directives/browse/container',
  'directives/edit/container',
  'directives/browse/body',
  'directives/browse/tab/header',
 'directives/dashboardlogin']/*deps*/, function (angular, IndexCtrl) {
  'use strict';

  return angular.module('dashboardApp', [
    'dashboardApp.services.CustomerService',
    'dashboardApp.services.ProductService',
    'dashboardApp.controllers.IndexCtrl',
    'dashboardApp.controllers.VisitorListCtrl',
    'dashboardApp.controllers.VisitorFormEditCtrl',
    'dashboardApp.controllers.ProductListCtrl',
    'dashboardApp.controllers.ProductFormEditCtrl',
    'dashboardApp.controllers.DashboardConfigCtrl',
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
/*angJSDeps*/
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngRoute'

  ])
    .config(function ($routeProvider) {
          $routeProvider
              .when('/', {
                  redirectTo: '/dashboard/login'
              })
              .when('/dashboard/visitor', {
                  templateUrl: 'views/visitor.html'
              })
              .when('/dashboard/product', {
                  templateUrl: 'views/product.html'
              })
              .when('/dashboard/login', {
                  templateUrl: 'views/login.html'
              })
              .when('/dashboard/help', {
                  templateUrl: 'views/help.html'
              })
              .when('/dashboard/config', {
                  templateUrl: 'views/config.html'
              })
              .otherwise({
                  redirectTo: '/'
              });
      });
});
