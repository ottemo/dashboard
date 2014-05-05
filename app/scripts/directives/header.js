define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.DashboardHeader', [])
  	.directive('dashboardHeader', function () {
      return {
        templateUrl: 'views/header/header.html',
      	restrict: 'E'
      };
  	});
});
