define(['angular'],
  function (angular) {
    'use strict';
    /****************************************************************************/
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                            Product form edit ctrl                                  */
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /****************************************************************************/
    angular.module('dashboardApp.controllers.ProductFormEditCtrl', [])
      .controller('ProductFormEditCtrl', [
        '$scope',
        '$rootScope',
        'ProductService',
        function ($scope, $rootScope, ProductService) {
          //$scope.product = ProductService.query({'id': id});
          var getEmptyProductObject;
          getEmptyProductObject = function () {
            return {
              'name'             : '',
              'id'               : '',
              'visible'          : '',
              'sku'              : '',
              'mpn'              : '',
              'tags'             : [],
              'categories'       : [],
              'short_description': '',
              'long_description' : '',
              'media_gallery'    : [],
              'img'              : ''
          };
        };
        $scope.product = getEmptyProductObject();
      }
    ]);
  });