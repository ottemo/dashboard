define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.VisitorEdit', [])
  	.directive('visitorEdit', function () {
      return {
      	templateUrl: 'views/visitor/edit.html',
      	restrict: 'E'
      };
  	});
});
