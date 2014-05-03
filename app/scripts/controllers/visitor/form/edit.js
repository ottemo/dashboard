define(['angular'],
  function (angular) {
    'use strict';
    /****************************************************************************/
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                            Visitor form edit ctrl                                  */
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
          //$scope.visitor = CustomerService.query({'id': id});
          var getEmptyVisitorObject;
          getEmptyVisitorObject = function () {
            return {
              'id'               : '',
              'first_name'       : '',
              'last_name'        : '',
              'role'             : '',
              'phone'            : '',
              'email'            : '',
              'shipping_address1': '',
              'shipping_address2': '',
              'city'             : '',
              'state'            : '',
              'zip_code'         : '',
              'image'            : 'images/yeoman.png'
            };
          };
          $scope.visitor = getEmptyVisitorObject();
          $scope.isEdit = false;
          /**
           *
           */
          $scope.addVisitorEvent = function () {
            $rootScope.$broadcast('save.visitor.event', $scope.visitor);
          };

          /**
           *
           */
          $scope.updateVisitorEvent = function () {
            $rootScope.$broadcast('update.visitor.event', $scope.visitor);
          };

          /**
           *
           */
          $scope.$on('visitor.selected.after', function (event, value) {
            $scope.visitor = value;
            $scope.isEdit = true;
          });

          /**
           *
           */
          $scope.$on('add.new.entity', function () {
            $scope.isEdit = true;
            $scope.visitor = getEmptyVisitorObject();
          });

          $scope.isCancelDisabled = function() {
            return true;
          };

          $scope.isSaveDisabled = function() {
            return true;
          };
        }
      ]);
  });