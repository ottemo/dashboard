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
                        $location.path("/orders");
                    };

                    $scope.getDate = function(){
                            var date, month, day;

                            date = new Date($scope.order['created_at']);
                            month = date.getMonth().toString().length < 2 ? '0' + date.getMonth() : date.getMonth();
                            day = date.getDate().toString().length < 2 ? '0' + date.getDate() : date.getDate();

                            return date.getFullYear() + '/' + month + '/' + day;
                    };

                }
            ]
        );

        return orderModule;
    });
})(window.define);
