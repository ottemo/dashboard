(function (define) {
  'use strict';
  define(['angular'], function (angular) {


    angular.module('dashboardApp.directives.ProductEdit', [])
      .directive('productEdit', function () {
        return {
          templateUrl: 'views/product/edit.html',
          restrict: 'E'
        };
      });
  });
})(window.define);