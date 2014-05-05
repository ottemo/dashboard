define(['angular'],
  function (angular) {
    'use strict';
    /****************************************************************************/
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                            Visitor list controller                       */
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /*                                                                          */
    /****************************************************************************/

    angular.module('dashboardApp.controllers.VisitorListCtrl', [])
      .controller('VisitorListCtrl', [
        '$scope',
        '$rootScope',
        'CustomerService',
        function ($scope, $rootScope, CustomerService) {
          var getVisitorIndexById;
          /**
           *
           * @param id {string}
           *
           * @returns {*}
           */
          getVisitorIndexById = function (id) {
            var i = $scope.visitors.length;
            while (i--) {
              if ($scope.visitors[i].id == id) {
                return i;
              }
            }

            return -1;
          };

          //$scope.visitors = CustomerService.getAll()
          $scope.visitors = [
            {
              'id'               : 0,
              'first_name'       : 'Chuck',
              'last_name'        : 'Norris',
              'role'             : 'admin',
              'phone'            : '123-123-1234',
              'email'            : 'chuck@norris.com',
              'shipping_address1': '9303, City 13',
              'shipping_address2': '',
              'city'             : 'Hill Valley',
              'state'            : 'CA',
              'zip_code'         : '12345',
              'image'            : 'images/customer/Chuck-norris-002.jpg'
            },
            {
              'id'               : 1,
              'first_name'       : 'Jane',
              'last_name'        : 'Doe',
              'role'             : 'customer',
              'phone'            : '555-555-5555',
              'email'            : 'you@yourmailaddress.com',
              'shipping_address1': '1234, Anywhere',
              'shipping_address2': '',
              'city'             : 'Hill Valley',
              'state'            : 'NY',
              'zip_code'         : '99999',
              'image'            : 'images/customer/hayworth.jpg'
            }
          ];

          $scope.selectedVisitor = {};

          $scope.selectVisitor = function (index) {
            $scope.selectedVisitor = $scope.visitors[index];
            $rootScope.$broadcast('visitor.selected.after', $scope.selectedVisitor);
          };

          $scope.$on('save.visitor.event', function (event, value) {
            $scope.visitors.push(value);
          });

          $scope.$on('update.visitor.event', function (event, value) {
            var index;
            index = getVisitorIndexById(value.id);
            if (index != -1) {
              $scope.visitors[i] = value;
            }
          });

          $scope.$on('search.for.entity', function (event, value) {
            //@todo implement search
            //$scope.visitors = CustomerService.getAll()
            //maybe need to create a SearchService
          });
        }
      ]);
  });
