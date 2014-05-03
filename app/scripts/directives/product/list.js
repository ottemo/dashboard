define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.ProductList', [])
  	.directive('productList', function () {
      return {
      	templateUrl: 'views/product/list.html',
      	restrict: 'E'
      };
  	});
});
