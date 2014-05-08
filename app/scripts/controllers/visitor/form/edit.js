define(['angular'],
  function (angular) {
    'use strict';
    /****************************************************************************/
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                            Visitor form edit ctrl                        */
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /****************************************************************************/
    angular.module('dashboardApp.controllers.VisitorFormEditCtrl', [])
      .controller('VisitorFormEditCtrl', [
        '$scope',
        '$rootScope',
        'CustomerService',
        function ($scope, $rootScope, CustomerService) {
          var addVisitorEvent,
              updateVisitorEvent,
              getEmptyVisitorObject;
          getEmptyVisitorObject = function () {
            return {
             // 'id'     : '',
              'fname'  : '',
              'lname'  : '',
              'role'   : '',
              'email'  : '',
              'address': {
                'street_line1': '',
                'street_line2': '',
                'city'        : '',
                'state'       : '',
                'zip_code'    : '',
                'phone'       : ''
              },
              'image'  : 'images/yeoman.png'
            };
          };
          $scope.visitor = getEmptyVisitorObject();
          $scope.isEdit = false;
          /**
           *
           */
          addVisitorEvent = function () {
            $rootScope.$broadcast('save.visitor.event', $scope.visitor);
          };

          /**
           *
           */
          updateVisitorEvent = function () {
            $rootScope.$broadcast('update.visitor.event', $scope.visitor);
          };

          /**
           *
           */
          $scope.$on('visitor.selected.after', function (event, value) {
            $scope.master = angular.copy(value);
            $scope.visitor = value;
            $scope.isEdit = true;
          });

          /**
           *
           */
          $scope.$on('add.new.entity', function () {
            $scope.master = angular.copy(getEmptyVisitorObject());

            $scope.isEdit = true;
            $scope.visitor = getEmptyVisitorObject();
          });

          /**
           *
           * @returns {boolean}
           */
          $scope.isCancelDisabled = function () {
            return angular.equals($scope.master, $scope.visitor);
          };

          /**
           *
           * @returns {boolean}
           */
          $scope.isSaveDisabled = function () {
            return $scope.visitorForm.$invalid || angular.equals($scope.master, $scope.visitor);
          };

          /**
           *
           */
          $scope.cancel = function () {
            $scope.visitor = angular.copy($scope.master);
          };

          /**
           *
           */
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
              var visitor = CustomerService.query({'id': jsonResponse.id},
                function success(value, responseHeader) {
                  $scope.visitor = visitor;
                  $scope.master = angular.copy($scope.visitor);
                  addVisitorEvent();
                }
              );
            };

            /**
             *
             * @param value {object}
             * @param responseHeaders {function}
             */
            handleSuccessUpdate = function(value, responseHeaders) {
              updateVisitorEvent();
            };
            id = $scope.visitor.id || $scope.visitor._id;

            if (!id) {
              jsonResponse = CustomerService.save($scope.visitor, handleSuccessSave, handleError);
            } else {
              CustomerService.update($scope.visitor, handleSuccessUpdate, handleError);
            }
          }
        }
      ]);
  });