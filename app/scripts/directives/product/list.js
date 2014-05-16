define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.ProductList', [])
  	.directive('productList', function () {
      return {
      	templateUrl: 'views/product/list.html',
      	restrict: 'E',
        controller : function ($scope) {
          /**
           * @todo utilize a constant here
           */
          $scope.$on('change.the.browse.view', function (event, value) {
            $scope.activeView = value;
          });
          $scope.activeView = 'tile';
        }
      };
  	});
});
