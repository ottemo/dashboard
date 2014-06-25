angular.module('productModule', ['ngResource', 'dashboardModule'])
    .controller('productController', function($scope, $loginService) {
        $scope.x = 'productController';
    })
    .service('$productService', function ($resource) {
        var productServiceUrl = 'http://localhost:3000/product/';
        return $resource(productServiceUrl, {}, {
            'getAll': { method: 'GET',    url: productServiceUrl, isArray: true},
            'save':   { method: 'POST',   url: productServiceUrl},
            'update': { method: 'PUT',    params: { id: '@id' }, url: productServiceUrl + ':id' },
            'query':  { method: 'GET',    params: { id: '@id' }, url: productServiceUrl + ':id' },
            'remove': { method: 'DELETE', params: { id: '@id' }, url: productServiceUrl + ':id' }
        });
    })
    .controller('ProductListCtrl', function ($scope, $rootScope, $productService) {
            var getProductIndexById, h;

            getProductIndexById = function (id) {
                var i = $scope.products.length;
                while ((i-=1) >= 0) {
                    if ($scope.products[i].id === id || $scope.products[i]._id === id) {
                        return i;
                    }
                }

                return -1;
            };

            h = 'http://localhost:9000/';
            $scope.products = $productService.getAll({}, function success() {
                    if (!$scope.products.length) {
                        $scope.products = $scope.products.concat([
                            {
                                'name': 'Apple iPhone 5 16GB (White) - Unlocked',
                                'is_visible': false,
                                'sku': 'apple-iphone-5-16-white-u',
                                'mpn': 'B0097CZJEO',
                                'tags': ['iphone', 'apple'],
                                'categories': ['phones'],
                                'short_description': 'This Brand New iphone 5 16GB White phone comes in ' +
                                    'Original box from Apple',
                                'description': 'This Brand New iphone 5 16GB White phone comes in Original ' +
                                    'box from Apple with all Original accessories in the box. This iphone ' +
                                    '5 16GB phone comes Factory Unlocked for any GSM and will work with ' +
                                    'any GSM SIM card in the world.',
                                'media_gallery': [
                                        h + 'images/product/21oN3v5g3kL._AA50_.jpg',
                                        h + 'images/product/31mBvTpQUBL._AA50_.jpg',
                                        h + 'images/product/31QfggQYl2L._AA50_.jpg',
                                        h + 'images/product/31r8au66QML._AA50_.jpg',
                                        h + 'images/product/iphone-5s-white.jpg'
                                ],
                                'image': h + 'images/product/iphone-5s-white-big-image.jpg'
                            },
                            {
                                'name': 'Apple iPhone 5 32GB (White) - Unlocked',
                                'is_visible': false,
                                'sku': 'apple-iphone-5-32-white-u',
                                'mpn': 'B0098CZJEO',
                                'tags': ['iphone', 'apple'],
                                'categories': ['phones'],
                                'short_description': 'This Brand New iphone 5 16GB White phone comes in ' +
                                    'Original box from Apple',
                                'description': 'This Brand New iphone 5 16GB White phone comes in Original ' +
                                    'box from Apple with all Original accessories in the box. This iphone ' +
                                    '5 16GB phone comes Factory Unlocked for any GSM and will work with ' +
                                    'any GSM SIM card in the world.',
                                'media_gallery': [
                                        h + 'images/product/21oN3v5g3kL._AA50_.jpg',
                                        h + 'images/product/31mBvTpQUBL._AA50_.jpg',
                                        h + 'images/product/31QfggQYl2L._AA50_.jpg',
                                        h + 'images/product/31r8au66QML._AA50_.jpg',
                                        h + 'images/product/iphone-5s-white.jpg'
                                ],
                                'image': h + 'images/product/iphone-5s-white-big-image.jpg'
                            },
                            {
                                'name': 'Apple iPhone 5 64GB (White) - Unlocked',
                                'is_visible': false,
                                'sku': 'apple-iphone-5-64-white-u',
                                'mpn': 'B0099CZJEO',
                                'tags': ['iphone', 'apple'],
                                'categories': ['phones'],
                                'short_description': 'This Brand New iphone 5 16GB White phone comes in ' +
                                    'Original box from Apple',
                                'description': 'This Brand New iphone 5 16GB White phone comes in Original ' +
                                    'box from Apple with all Original accessories in the box. This iphone ' +
                                    '5 16GB phone comes Factory Unlocked for any GSM and will work with ' +
                                    'any GSM SIM card in the world.',
                                'media_gallery': [
                                        h + 'images/product/21oN3v5g3kL._AA50_.jpg',
                                        h + 'images/product/31mBvTpQUBL._AA50_.jpg',
                                        h + 'images/product/31QfggQYl2L._AA50_.jpg',
                                        h + 'images/product/31r8au66QML._AA50_.jpg',
                                        h + 'images/product/iphone-5s-white.jpg'
                                ],
                                'image': h + 'images/product/iphone-5s-white-big-image.jpg'
                            },
                            {
                                'name': 'Apple iPhone 5 128GB (White) - Unlocked',
                                'is_visible': false,
                                'sku': 'apple-iphone-5-128-white-u',
                                'mpn': 'B0100CZJEO',
                                'tags': ['iphone', 'apple'],
                                'categories': ['phones'],
                                'short_description': 'This Brand New iphone 5 16GB White phone comes in ' +
                                    'Original box from Apple',
                                'description': 'This Brand New iphone 5 16GB White phone comes in Original ' +
                                    'box from Apple with all Original accessories in the box. This iphone ' +
                                    '5 16GB phone comes Factory Unlocked for any GSM and will work with ' +
                                    'any GSM SIM card in the world.',
                                'media_gallery': [
                                        h + 'images/product/21oN3v5g3kL._AA50_.jpg',
                                        h + 'images/product/31mBvTpQUBL._AA50_.jpg',
                                        h + 'images/product/31QfggQYl2L._AA50_.jpg',
                                        h + 'images/product/31r8au66QML._AA50_.jpg',
                                        h + 'images/product/iphone-5s-white.jpg'
                                ],
                                'image': h + 'images/product/iphone-5s-white-big-image.jpg'
                            },
                            {
                                'name': 'Apple iPhone 5 128GB (White) - Locked',
                                'is_visible': false,
                                'sku': 'apple-iphone-5-128-white-l',
                                'mpn': 'B0101CZJEO',
                                'tags': ['iphone', 'apple'],
                                'categories': ['phones'],
                                'short_description': 'This Brand New iphone 5 16GB White phone comes in ' +
                                    'Original box from Apple',
                                'description': 'This Brand New iphone 5 16GB White phone comes in Original ' +
                                    'box from Apple with all Original accessories in the box. This iphone ' +
                                    '5 16GB phone comes Factory Unlocked for any GSM and will work with ' +
                                    'any GSM SIM card in the world.',
                                'media_gallery': [
                                        h + 'images/product/21oN3v5g3kL._AA50_.jpg',
                                        h + 'images/product/31mBvTpQUBL._AA50_.jpg',
                                        h + 'images/product/31QfggQYl2L._AA50_.jpg',
                                        h + 'images/product/31r8au66QML._AA50_.jpg',
                                        h + 'images/product/iphone-5s-white.jpg'
                                ],
                                'image': h + 'images/product/iphone-5s-white-big-image.jpg'
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
                if (index !== -1) {
                    $scope.products[index] = value;
                }
            });

            $scope.$on('search.for.entity', function () {
                //@todo implement search
                //$scope.products = $productService.getAll()
                //maybe need to create a SearchService
            });

            $scope.showStatus = true;
            $scope.switchStatus = 0;

        }
    )
    .controller('ProductFormEditCtrl', function ($scope, $rootScope, $productService) {
          var getEmptyProductObject, addProductEvent, updateProductEvent,
          h = 'http://localhost:9000/';

          var getEmptyProductObject = function () {
              return {
                  'name': '',
                  //'id'               : '',
                  'is_visible': true,
                  'sku': '',
                  'mpn': '',
                  'tags': [],
                  'categories': [],
                  'short_description': '',
                  'description': '',
                  'image': h + 'images/product/iphone-5s-white-big-image.jpg',
                  'media_gallery': [
                          h + 'images/product/21oN3v5g3kL._AA50_.jpg',
                          h + 'images/product/31mBvTpQUBL._AA50_.jpg',
                          h + 'images/product/31QfggQYl2L._AA50_.jpg',
                          h + 'images/product/31r8au66QML._AA50_.jpg',
                  ]
              };
          };
          $scope.oneAtATime = true;

          $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
          };

          $scope.product = getEmptyProductObject();
          $scope.isEdit = false;

          /**
           *
           */
          addProductEvent = function () {
              $rootScope.$broadcast('save.product.event', $scope.product);
          };

          /**
           *
           */
          updateProductEvent = function () {
              $rootScope.$broadcast('update.product.event', $scope.product);
          };

          /**
           *
           */
          $scope.$on('product.selected.after', function (event, value) {
              $scope.master = angular.copy(value);
              $scope.product = value;
              $scope.isEdit = true;
          });

          /**
           *
           */
          $scope.$on('add.new.entity', function () {
              $scope.master = angular.copy(getEmptyProductObject());

              $scope.isEdit = true;
              $scope.product = getEmptyProductObject();
          });

          /**
           *
           * @returns {boolean}
           */
          $scope.isCancelDisabled = function () {
              return angular.equals($scope.master, $scope.product);
          };

          /**
           *
           * @returns {*|boolean}
           */
          $scope.isSaveDisabled = function () {
              return $scope.productForm.$invalid || angular.equals($scope.master, $scope.product);
          };

          /**
           *
           */
          $scope.cancel = function () {
              $scope.visitor = angular.copy($scope.master);
          };

          $scope.save = function () {
              var id,
                  jsonResponse,
                  handleSuccessSave,
                  handleSuccessUpdate,
                  handleError;
              /**
               *
               * @param httpResponse {object}
               */
              handleError = function (httpResponse) {
                  console.log('something went wrong ' + httpResponse.status);
              };

              /**
               *
               * @param value {object}
               * @param responseHeaders {function}
               */
              handleSuccessSave = function () {
                  var product = $productService.query({'id': jsonResponse.id},
                      function success() {
                          $scope.product = product;
                          $scope.master = angular.copy($scope.product);
                          addProductEvent();
                      }
                  );
              };

              /**
               *
               * @param value {object}
               * @param responseHeaders {function}
               */
              handleSuccessUpdate = function () {
                  $scope.master = angular.copy($scope.product);
                  updateProductEvent();
              };
              id = $scope.product.id || $scope.product._id;

              if (!id) {
                  jsonResponse = $productService.save($scope.product, handleSuccessSave, handleError);
              } else {
                  $scope.product.id = id;
                  $productService.update($scope.product, handleSuccessUpdate, handleError);
              }
          };
    });