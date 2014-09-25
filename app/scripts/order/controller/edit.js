(function (define) {
    "use strict";

    define(["order/init"], function (orderModule) {
        orderModule
            .controller("orderEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$orderApiService",
                function ($scope, $routeParams, $location, $q, $orderApiService) {
                    var orderId, getDefaultOrder;

                    orderId = $routeParams.id;

                    if (!orderId && orderId !== "new") {
                        $location.path("/orders");
                    }

                    if (orderId === "new") {
                        orderId = null;
                    }

                    getDefaultOrder = function () {
                        return {
                            "id": "",
                            "url": "",
                            "identifier": "",
                            "title": "",
                            "content": "",
                            "meta_keywords": "",
                            "meta_description": "",
                            "created_at": "",
                            "updated_at": ""
                        };
                    };

                    $scope.count = 100;

                    /**
                     * Current selected order
                     *
                     * @type {Object}
                     */
                    $scope.order = getDefaultOrder();


                    /**
                     * Gets list all attributes of order
                     */
                    $orderApiService.getAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        }
                    );

                    if (null !== orderId) {
                        $orderApiService.getOrder({"id": orderId}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.order = result;
                            }
                        );
                    }

                    $scope.back = function () {
                        $location.path("/orders");
                    };

                    /**
                     * Event handler to save the order data.
                     * Creates new order if ID in current order is empty OR updates current order if ID is set
                     */
                    $scope.save = function () {
                        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
                        defer = $q.defer();
                        if (typeof $scope.order !== "undefined") {
                            id = $scope.order.id || $scope.order._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === "") {
                                var result = response.result || getDefaultOrder();
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Order was created successfully'
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
                                var result = response.result || getDefaultOrder();
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Order was updated successfully'
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


                        if (!id) {
                            $orderApiService.orderAdd($scope.order, saveSuccess, saveError);
                        } else {
                            $scope.order.id = id;
                            $orderApiService.orderUpdate($scope.order, updateSuccess, updateError);
                        }

                        return defer.promise;
                    };

                    $scope.getDate = function(){
                            var date, month, day;

                            date = new Date($scope.order.created_at);
                            month = date.getMonth().toString().length < 2 ? '0' + date.getMonth() : date.getMonth();
                            day = date.getDay().toString().length < 2 ? '0' + date.getDay() : date.getDay();

                            return date.getFullYear() + '/' + month + '/' + day;
                    };

                }]); // jshint ignore:line
        return orderModule;
    });
})(window.define);
