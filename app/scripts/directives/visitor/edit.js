(function (define) {
  'use strict';
  define(['angular'], function (angular) {
    angular.module('dashboardApp.directives.VisitorEdit', [])
      .directive('visitorEdit', function () {
        return {
          templateUrl: 'views/visitor/edit.html',
          restrict: 'E'
        };
      });
  });
})(window.define);