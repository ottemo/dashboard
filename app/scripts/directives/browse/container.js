define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.BrowseContainer', [])
    .directive('browseContainer', function () {
      return {
        templateUrl: 'views/browse/container.html',
        transclude: true,
        restrict: 'E'
      };
    });
});
