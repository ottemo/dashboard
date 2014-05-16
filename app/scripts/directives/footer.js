define(['angular'], function(angular) {
  'use strict';

  angular.module('dashboardApp.directives.DashboardFooter', [])
    .directive('dashboardFooter', function () {
      return {
        templateUrl: '../../views/footer/footer.html',
        restrict: 'E'
      };
    });
});
