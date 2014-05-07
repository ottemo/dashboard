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
          var c = CustomerService.query({'id': 1});
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
          $scope.isCancelDisabled = function() {
            return angular.equals($scope.master, $scope.visitor);
          };

          /**
           *
           * @returns {boolean}
           */
          $scope.isSaveDisabled = function() {
            return $scope.visitorForm.$invalid || angular.equals($scope.master, $scope.visitor);
          };

          /**
           *
           */
          $scope.cancel = function() {
            $scope.visitor = angular.copy($scope.master);
          };

          /**
           *
           */
          $scope.save = function() {
            CustomerService.save($scope.visitor);
          }
        }
      ]);
  });