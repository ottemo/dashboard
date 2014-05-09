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
          var getEmptyProductObject, addProductEvent, updateProductEvent;
          getEmptyProductObject = function () {
            return {
              'name'             : '',
              //'id'               : '',
              'is_visible'       : '',
              'sku'              : '',
              'mpn'              : '',
              'tags'             : [],
              'categories'       : [],
              'short_description': '',
              'description'      : '',
              'media_gallery'    : [],
              'img'              : ''
            };
          };
          $scope.product = getEmptyProductObject();
          $scope.isEdit = false;

          /**
           *
           */
          addProductEvent = function() {
            $rootScope.$broadcast('save.product.event', $scope.product);
          };

          /**
           *
           */
          updateProductEvent = function() {
            $rootScope.$broadcast('update.product.event', $scope.product);
          };

          /**
           *
           */
          $scope.$on('product.selected.after', function(event, value) {
            $scope.master = angular.copy(value);
            $scope.product = value;
            $scope.isEdit = true;
          });

          /**
           *
           */
          $scope.$on('add.new.entity', function() {
            $scope.master = angular.copy(getEmptyProductObject());

            $scope.isEdit = true;
            $scope.product = getEmptyProductObject();
          });

          /**
           *
           * @returns {boolean}
           */
          $scope.isCancelDisabled = function() {
            return angular.equals($scope.master, $scope.product);
          };

          /**
           *
           * @returns {*|boolean}
           */
          $scope.isSaveDisabled = function() {
            return $scope.productForm.$invalid || angular.equals($scope.master, $scope.product);
          };

          $scope.save = function() {
            var id,
                jsonResponse,
                handleSuccessSave,
                handleSuccessUpdate,
                handleError;
            /**
             *
             * @param httpResponse {object}
             */
            handleError = function(httpResponse) {
              console.log('something went wrong ' + httpResponse.status)
            };

            /**
             *
             * @param value {object}
             * @param responseHeaders {function}
             */
            handleSuccessSave = function(value, responseHeaders) {
              var product = ProductService.query({'id': jsonResponse.id},
                function success(value, responseHeader) {
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
            handleSuccessUpdate = function(value, responseHeaders) {
              updateProductEvent();
            };
            id = $scope.product.id || $scope.product._id;

            if (!id) {
              jsonResponse = ProductService.save($scope.product, handleSuccessSave, handleError);
            } else {
              $scope.product.id = id;
              ProductService.update($scope.product, handleSuccessUpdate, handleError);
            }
          }

        }
      ]);
  });