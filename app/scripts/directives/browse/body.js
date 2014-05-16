define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.BrowseBody', [])
    .directive('browseBody', function () {
      return {
        templateUrl: 'views/browse/body.html',
        transclude: true,
        restrict: 'E'
      };
    });
});