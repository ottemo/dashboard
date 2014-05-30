(function (define) {
  'use strict';
  define(['angular'], function (angular) {

    angular.module('dashboardApp.controllers.IndexCtrl', [])
      .controller('IndexCtrl', function ($scope) {
        $scope.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];
      });
  });
})(window.define);