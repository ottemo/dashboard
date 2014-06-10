(function (define) {
    'use strict';
    define(['angular'],
        function (angular) {
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
                            while ((i-=1) >= 1) {
                                if ($scope.visitors[i].id === id || $scope.visitors[i]._id === id) {
                                    return i;
                                }
                            }

                            return -1;
                        };

                        $scope.visitors = CustomerService.getAll({}, function () {
                            if (!$scope.visitors.length) {
                                $scope.visitors = $scope.visitors.concat([
                                    {
                                        //'id'     : '',
                                        'fname': 'Chuck',
                                        'lname': 'Norris',
                                        'role': 'admin',
                                        'email': 'chuck@norris.com',
                                        'address': {
                                            'street_line1': '9303, City 13',
                                            'street_line2': '',
                                            'city': 'Hill Valley',
                                            'state': 'CA',
                                            'zip_code': '12345',
                                            'phone': '123-123-1234'
                                        },
                                        'image': 'images/visitor/Chuck-norris-002.jpg'
                                    },
                                    {
                                        //'id'     : '',
                                        'fname': 'Jane',
                                        'lname': 'Doe',
                                        'role': 'visitor',
                                        'email': 'you@yourmailaddress.com',
                                        'address': {
                                            'street_line1': '1234, Anywhere',
                                            'street_line2': '',
                                            'city': 'New York',
                                            'state': 'NY',
                                            'zip_code': '12345',
                                            'phone': '555-555-5555'
                                        },
                                        'image': 'images/visitor/hayworth.jpg'
                                    }
                                ]);
                            }
                        });

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
                            if (index !== -1) {
                                $scope.visitors[index] = value;
                            }
                        });

                        $scope.$on('search.for.entity', function () {

                            //$scope.visitors = CustomerService.getAll()
                            //maybe need to create a SearchService
                        });
                    }
                ]);
        });
})(window.define);