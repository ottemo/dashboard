define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.EditContainer', [])
    .directive('editContainer', function () {
      return {
        templateUrl: 'views/edit/container.html',
        transclude: true,
        restrict: 'E'
      };
    });
});
