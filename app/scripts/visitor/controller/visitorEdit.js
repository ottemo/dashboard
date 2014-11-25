(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$visitorApiService",
                function ($scope, $routeParams, $location, $q, $visitorApiService) {
                    var visitorId, getDefaultVisitor;

                    visitorId = $routeParams.id;

                    if (!visitorId && visitorId !== "new") {
                        $location.path("/visitors");
                    }

                    if (visitorId === "new") {
                        visitorId = null;
                    }

                    getDefaultVisitor = function () {
                        return {};
                    };
                    /**
                     * Visitor by default
                     *
                     * @type {object}
                     */
                    $scope.defaultVisitor = getDefaultVisitor();

                    /**
                     * Current selected visitor
                     *
                     * @type {Object}
                     */
                    $scope.visitor = $scope.defaultVisitor;

                    $scope.addressForm = function () {
                        $location.path("/visitor/" + $scope.visitor._id + "/addresses");
                    };

                    $scope.getFullName = function () {
                        return $scope.visitor['first_name'] + " " + $scope.visitor['last_name'];
                    };

                    /**
                     * Gets list all attributes of visitor
                     */
                    $visitorApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        }
                    );

                    /**
                     * Handler event when selecting the visitor in the list
                     *
                     * @param id
                     */
                    if (null !== visitorId) {
                        $visitorApiService.load({"id": visitorId}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.visitor = result;
                                if ($scope.visitor['shipping_address'] !== null) {
                                    $scope.visitor['shipping_address_id'] = $scope.visitor['shipping_address']._id;
                                }
                                if ($scope.visitor['billing_address'] !== null) {
                                    $scope.visitor['billing_address_id'] = $scope.visitor['billing_address']._id;
                                }
                            }
                        );
                    }

                    $scope.back = function () {
                        $location.path("/visitors");
                    };

                    $scope.getName = function () {
                        return "first_name";
                    };

                    /**
                     * Event handler to save the visitor data.
                     * Creates new visitor if ID in current visitor is empty OR updates current visitor if ID is set
                     */
                    $scope.save = function () { // jshint ignore:line
                        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
                        defer = $q.defer();
                        if (typeof $scope.visitor !== "undefined") {
                            id = $scope.visitor.id || $scope.visitor._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === "") {
                                var result = response.result || getDefaultVisitor();
                                $scope.visitor._id = response.result._id;
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Visitor was created successfully'
                                };
                                defer.resolve(result);
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {
                            defer.resolve(false);
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            if (response.error === "") {
                                var result = response.result || getDefaultVisitor();
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Visitor was updated successfully'
                                };
                                defer.resolve(result);
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                            defer.resolve(false);
                        };

                        delete $scope.visitor['billing_address'];
                        delete $scope.visitor['shipping_address'];

//                        if ($scope.visitor['shipping_address_id'] === "") {
//                            delete $scope.visitor['shipping_address_id'];
//                        }
//
//                        if ($scope.visitor['billing_address_id'] === "") {
//                            delete $scope.visitor['billing_address_id'];
//                        }
                        if (!id) {
                            $visitorApiService.save($scope.visitor, saveSuccess, saveError);
                        } else {
                            $scope.visitor.id = id;

                            $visitorApiService.update($scope.visitor, updateSuccess, updateError);
                        }

                        return defer.promise;
                    };

                }]);
        return visitorModule;
    });
})(window.define);
