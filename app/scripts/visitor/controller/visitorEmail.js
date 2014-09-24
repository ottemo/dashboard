(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorEmailController", [
                "$scope",
                "$location",
                "$visitorApiService",
                function ($scope, $location, $visitorApiService) {
                    var getDefaultEmail;

                    getDefaultEmail = function () {
                        return {
                            "visitor_ids": [],
                            "subject": "",
                            "content": ""
                        };
                    };

                    /**
                     * Current selected visitor
                     *
                     * @type {Object}
                     */
                    $scope.email = getDefaultEmail();

                    $scope.addressForm = function () {
                        $location.path("/visitor/" + $scope.visitor._id + "/addresses");
                    };

                    $scope.getFullName = function () {
                        return $scope.visitor.first_name + " " + $scope.visitor.last_name;// jshint ignore:line
                    };

                    /**
                     * Gets list all attributes of visitor
                     */
//                    $visitorApiService.attributesInfo().$promise.then(
//                        function (response) {
//                            var result = response.result || [];
//                            $scope.attributes = result;
//                        }
//                    );

                    $scope.attributes = [
                        {
                            "Attribute": "visitor_ids",
                            "Editors": "visitor_selector",
                            "Label": "Visitors"
                        },
                        {
                            "Attribute": "subject",
                            "Editors": "text",
                            "Label": "Subject"
                        },
                        {
                            "Attribute": "content",
                            "Editors": "html",
                            "Label": "Content"
                        }
                    ];

                    /**
                     * Event handler to save the visitor data.
                     * Creates new visitor if ID in current visitor is empty OR updates current visitor if ID is set
                     */
                    $scope.send = function () {
                        console.log($scope.email);
//                        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
//                        defer = $q.defer();
//                        if (typeof $scope.visitor !== "undefined") {
//                            id = $scope.visitor.id || $scope.visitor._id;
//                        }
//
//                        /**
//                         *
//                         * @param response
//                         */
//                        saveSuccess = function (response) {
//                            if (response.error === "") {
//                                var result = response.result || getDefaultVisitor();
//                                $scope.message = {
//                                    'type': 'success',
//                                    'message': 'Visitor was created successfully'
//                                };
//                                defer.resolve(result);
//                            }
//                        };
//
//                        /**
//                         *
//                         * @param response
//                         */
//                        saveError = function () {
//                            defer.resolve(false);
//                        };
//
//                        /**
//                         *
//                         * @param response
//                         */
//                        updateSuccess = function (response) {
//                            if (response.error === "") {
//                                var result = response.result || getDefaultVisitor();
//                                $scope.message = {
//                                    'type': 'success',
//                                    'message': 'Visitor was updated successfully'
//                                };
//                                defer.resolve(result);
//                            }
//                        };
//
//                        /**
//                         *
//                         * @param response
//                         */
//                        updateError = function () {
//                            defer.resolve(false);
//                        };
//
//                        /**
//                         * @todo: review this approach with 'delete'
//                         */
//                        delete $scope.visitor.billing_address;                                              // jshint ignore:line
//                        delete $scope.visitor.shipping_address;                                             // jshint ignore:line
//
//                        if (!id) {
                            $visitorApiService.sendMail($scope.email);
//                        } else {
//                            $scope.visitor.id = id;
//                            if ($scope.visitor.shipping_address_id === "") {                                // jshint ignore:line
//                                delete $scope.visitor.shipping_address_id;                                  // jshint ignore:line
//                            }
//                            if ($scope.visitor.billing_address_id === "") {                                 // jshint ignore:line
//                                delete $scope.visitor.billing_address_id;                                   // jshint ignore:line
//                            }
//                            $visitorApiService.update($scope.visitor, updateSuccess, updateError);
//                        }
//
//                        return defer.promise;
                    };

                }]);
        return visitorModule;
    });
})(window.define);
