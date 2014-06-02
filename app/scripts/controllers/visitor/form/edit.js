(function (define) {
    'use strict';
    define(['angular'],
        function (angular) {
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
                                'fname': '',
                                'lname': '',
                                'role': '',
                                'email': '',
                                'address': {
                                    'street_line1': '',
                                    'street_line2': '',
                                    'city': '',
                                    'state': '',
                                    'zip_code': '',
                                    'phone': ''
                                },
                                'image': 'images/yeoman.png'
                            };
                        };

            $scope.visitor = getEmptyVisitorObject();
            $scope.formFields = {
              sections: [
                {
                  sectionTitle: 'Name',
                  sectionClass: '',
                  sectionFields: [
                    {name: 'fname', type: 'text', label: 'first name', required: 'true', class: 'middle-size'},
                    {name: 'lname', type: 'text', label: 'last name', required: 'true', class: 'middle-size' },
                    {name: 'role', type: 'text', label: 'role (optional)', required: '', class: 'middle-size'}
                  ]
                },
                {
                  sectionTitle: 'Contact Information',
                  sectionClass: '',
                  sectionFields: [
                    {name: 'address.phone', type: 'text', label: 'phone', required: '', class: 'middle-size'},
                    {name: 'email', type: 'email', label: 'email', required: 'true', class: 'middle-size' }
                  ]
                },
                {
                  sectionTitle: 'Shipping Address',
                  sectionClass: 'VisitorSecondaryInfoInputsBottom',
                  sectionFields: [
                    {name: 'address.street_line1', type: 'text', label: 'address line 1', required: '', class: 'biggest-size'},
                    {name: 'address.street_line2', type: 'text', label: 'address line 2 (optional)', required: '', class: 'biggest-size' },
                    {name: 'address.city', type: 'text', label: 'city', required: '', class: 'small-size'},
                    {name: 'address.zip_code', type: 'text', label: 'Zip code', required: '', class: 'small-size' }
                  ]
                }
              ]
            };
            $scope.oneAtATime = true;
            $scope.status = {
              isFirstOpen: true,
              isFirstDisabled: false
            };


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

                            handleSuccessSave = function () {
                                var visitor = CustomerService.query({'id': jsonResponse.id},
                                    function success() {
                                        $scope.visitor = visitor;
                                        $scope.master = angular.copy($scope.visitor);
                                        addVisitorEvent();
                                    }
                                );
                            };

                            handleSuccessUpdate = function () {
                                $scope.master = angular.copy($scope.visitor);
                                updateVisitorEvent();
                            };
                            id = $scope.visitor.id || $scope.visitor._id;

                            if (!id) {
                                jsonResponse = CustomerService.save($scope.visitor, handleSuccessSave, handleError);
                            } else {
                                $scope.visitor.id = id;
                                CustomerService.update($scope.visitor, handleSuccessUpdate, handleError);
                            }
                        };
                    }
                ]);
        });
})(window.define);
