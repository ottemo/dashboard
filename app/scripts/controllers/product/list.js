define(['angular'],
  function (angular) {
    'use strict';
    /****************************************************************************/
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                            Product page                                  */
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
        function ($scope, $rootScope, ProductService) {
          var getProductIndexById, h;
          /**
           *
           * @param id {string}
           *
           * @returns {*}
           */
          getProductIndexById = function (id) {
            var i = $scope.products.length;
            while (i--) {
              if ($scope.products[i].id == id || $scope.products[i]._id == id) {
                return i;
              }
            }

            return -1;
          };

          h = 'http://localhost:9000/';
          $scope.products = ProductService.getAll({}, function success() {
            if (!$scope.products.length) {
              $scope.products = $scope.products.concat([
                {
                  'name'             : 'Apple iPhone 5 16GB (White) - Unlocked',
                  'is_visible'       : false,
                  'sku'              : 'apple-iphone-5-16-white-u',
                  'mpn'              : 'B0097CZJEO',
                  'tags'             : ['iphone', 'apple'],
                  'categories'       : ['phones'],
                  'short_description': 'This Brand New iphone 5 16GB White phone comes in Original box from Apple',
                  'description'      : 'This Brand New iphone 5 16GB White phone comes in Original box from Apple with all Original accessories in the box. This iphone 5 16GB phone comes Factory Unlocked for any GSM and will work with any GSM SIM card in the world.',
                  'media_gallery'    : [h + 'images/product/21oN3v5g3kL._AA50_.jpg', h + 'images/product/31mBvTpQUBL._AA50_.jpg', h + 'images/product/31QfggQYl2L._AA50_.jpg', h + 'images/product/31r8au66QML._AA50_.jpg', h + 'images/product/iphone-5s-white.jpg'],
                  'image'              : h + 'images/product/iphone-5s-white-big-image.jpg'
                },
                {
                  'name'             : 'Apple iPhone 5 32GB (White) - Unlocked',
                  'is_visible'       : false,
                  'sku'              : 'apple-iphone-5-32-white-u',
                  'mpn'              : 'B0098CZJEO',
                  'tags'             : ['iphone', 'apple'],
                  'categories'       : ['phones'],
                  'short_description': 'This Brand New iphone 5 16GB White phone comes in Original box from Apple',
                  'description'      : 'This Brand New iphone 5 16GB White phone comes in Original box from Apple with all Original accessories in the box. This iphone 5 16GB phone comes Factory Unlocked for any GSM and will work with any GSM SIM card in the world.',
                  'media_gallery'    : [h + 'images/product/21oN3v5g3kL._AA50_.jpg', h + 'images/product/31mBvTpQUBL._AA50_.jpg', h + 'images/product/31QfggQYl2L._AA50_.jpg', h + 'images/product/31r8au66QML._AA50_.jpg', h + 'images/product/iphone-5s-white.jpg'],
                  'image'              : h + 'images/product/iphone-5s-white-big-image.jpg'
                },
                {
                  'name'             : 'Apple iPhone 5 64GB (White) - Unlocked',
                  'is_visible'       : false,
                  'sku'              : 'apple-iphone-5-64-white-u',
                  'mpn'              : 'B0099CZJEO',
                  'tags'             : ['iphone', 'apple'],
                  'categories'       : ['phones'],
                  'short_description': 'This Brand New iphone 5 16GB White phone comes in Original box from Apple',
                  'description'      : 'This Brand New iphone 5 16GB White phone comes in Original box from Apple with all Original accessories in the box. This iphone 5 16GB phone comes Factory Unlocked for any GSM and will work with any GSM SIM card in the world.',
                  'media_gallery'    : [h + 'images/product/21oN3v5g3kL._AA50_.jpg', h + 'images/product/31mBvTpQUBL._AA50_.jpg', h + 'images/product/31QfggQYl2L._AA50_.jpg', h + 'images/product/31r8au66QML._AA50_.jpg', h + 'images/product/iphone-5s-white.jpg'],
                  'image'              : h + 'images/product/iphone-5s-white-big-image.jpg'
                },
                {
                  'name'             : 'Apple iPhone 5 128GB (White) - Unlocked',
                  'is_visible'       : false,
                  'sku'              : 'apple-iphone-5-128-white-u',
                  'mpn'              : 'B0100CZJEO',
                  'tags'             : ['iphone', 'apple'],
                  'categories'       : ['phones'],
                  'short_description': 'This Brand New iphone 5 16GB White phone comes in Original box from Apple',
                  'description'      : 'This Brand New iphone 5 16GB White phone comes in Original box from Apple with all Original accessories in the box. This iphone 5 16GB phone comes Factory Unlocked for any GSM and will work with any GSM SIM card in the world.',
                  'media_gallery'    : [ h + 'images/product/21oN3v5g3kL._AA50_.jpg', h + 'images/product/31mBvTpQUBL._AA50_.jpg', h + 'images/product/31QfggQYl2L._AA50_.jpg', h + 'images/product/31r8au66QML._AA50_.jpg', h + 'images/product/iphone-5s-white.jpg'],
                  'image'              : h + 'images/product/iphone-5s-white-big-image.jpg'
                },
                {
                  'name'             : 'Apple iPhone 5 128GB (White) - Locked',
                  'is_visible'       : false,
                  'sku'              : 'apple-iphone-5-128-white-l',
                  'mpn'              : 'B0101CZJEO',
                  'tags'             : ['iphone', 'apple'],
                  'categories'       : ['phones'],
                  'short_description': 'This Brand New iphone 5 16GB White phone comes in Original box from Apple',
                  'description'      : 'This Brand New iphone 5 16GB White phone comes in Original box from Apple with all Original accessories in the box. This iphone 5 16GB phone comes Factory Unlocked for any GSM and will work with any GSM SIM card in the world.',
                  'media_gallery'    : [h + 'images/product/21oN3v5g3kL._AA50_.jpg', h + 'images/product/31mBvTpQUBL._AA50_.jpg', h + 'images/product/31QfggQYl2L._AA50_.jpg', h + 'images/product/31r8au66QML._AA50_.jpg', h + 'images/product/iphone-5s-white.jpg'],
                  'image'              : h + 'images/product/iphone-5s-white-big-image.jpg'
                }
              ]);
            }
          }, function error() {
              console.log('something went wrong');
            }
          );

          $scope.selectedProduct = {};

          $scope.selectProduct = function (index) {
            $scope.selectedProduct = $scope.products[index];
            $rootScope.$broadcast('product.selected.after', $scope.selectedProduct);
          };

          $scope.$on('save.product.event', function (event, value) {
            $scope.products.push(value);
          });

          $scope.$on('update.product.event', function (event, value) {
            var index;
            index = getProductIndexById(value.id);
            if (index != -1) {
              $scope.products[index] = value;
            }
          });

          $scope.$on('search.for.entity', function (event, value) {
            //@todo implement search
            //$scope.products = ProductService.getAll()
            //maybe need to create a SearchService
          });
        }
      ]
    );
  });
