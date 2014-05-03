define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.ProductEdit', [])
  	.directive('productEdit', function() {
      return {
      	templateUrl: 'views/product/edit.html',
      	restrict: 'E'
      };
  	});
});
