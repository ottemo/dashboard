define(['angular'],
  function (angular) {
  'use strict';
  /****************************************************************************/
  /*                                                                          */
  /*                                                                          */
  /*                                                                          */
  /*                            Visitor page                                  */
  /*                                                                          */
  /*                                                                          */
  /*                                                                          */
  /*                                                                          */
  /****************************************************************************/

  angular.module('dashboardApp.controllers.ProductListCtrl', [])
    .controller('ProductListCtrl', [
      '$scope',
      '$rootScope',
      'ProductService',
      function($scope, $rootScope, ProductService) {
      //$scope.visitors = ProductService.getAll()
        $scope.products = [{name: 'Apple'}, {name: 'Windows'}];
        $scope.selectedProduct = {};

        $scope.selectProduct = function(index) {
          $scope.selectedProduct = $scope.products[index];
          $rootScope.$broadcast('product.selected.after', $scope.selectedProduct);
        }
    }]
  );
});
