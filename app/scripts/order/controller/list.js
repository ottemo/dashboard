(function (define) {
    "use strict";

    define(["order/init"], function (orderModule) {
        orderModule
            .controller("orderListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$orderApiService",
                function ($scope, $location, $routeParams, $q, $orderApiService) {
                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "increment_id",
                            "type": "select-link",
                            "label": "Order ID",
                            "visible": true,
                            "notDisable": true,
                            "filter": "text",
                            "filterValue": $routeParams['increment_id']
                        },
                        {
                            "attribute": "description",
                            "type": "text",
                            "label": "Description",
                            "visible": true,
                            "filter": "text",
                            "filterValue": $routeParams['description']
                        },
                        {
                            "attribute": "customer_email",
                            "type": "text",
                            "label": "Customer Email",
                            "visible": true,
                            "filter": "text",
                            "filterValue": $routeParams['customer_email']
                        },
                        {
                            "attribute": "customer_name",
                            "type": "text",
                            "label": "Customer name",
                            "visible": true,
                            "filter": "text",
                            "filterValue": $routeParams['customer_name']
                        },
                        {
                            "attribute": "status",
                            "type": "text",
                            "label": "Status",
                            "visible": true,
                            "filter": "select{pending,canceled,complete}",
                            "filterValue": $routeParams['status']
                        }
                    ];

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0,5");
                    }

                    var getFields = function () {
                        var arr, i;
                        arr = [];

                        for (i = 0; i < $scope.fields.length; i += 1) {
                            arr.push($scope.fields[i].attribute);
                        }
                        return arr.join(",");
                    };

                    $scope.removeIds = {};

                    /**
                     * Gets list of categories
                     */
                    $orderApiService.orderList($location.search(), {"extra": getFields()}).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.orders = [];

                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.orders.push(result[i]);
                            }
                        }
                    );

                    /**
                     * Gets list of products
                     */
                    $orderApiService.getCount($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    /**
                     * Handler event when selecting the order in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/order/" + id);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/order/new");
                    };


                    var remove = function (id) {
                        var defer = $q.defer();

                        $orderApiService.remove({"id": id},
                            function (response) {
                                if (response.result === "ok") {
                                    defer.resolve(id);
                                } else {
                                    defer.resolve(false);
                                }
                            }
                        );

                        return defer.promise;
                    };

                    /**
                     * Removes order by ID
                     *
                     * @param {string} id
                     */
                    $scope.remove = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this order(s)");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.orders.length; i += 1) {
                                        if ($scope.orders[i].Id === response) {
                                            $scope.orders.splice(i, 1);
                                        }
                                    }
                                }
                            };
                            for (id in $scope.removeIds) {
                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    remove(id).then(callback);
                                }
                            }
                        }
                    };

                }
            ]
        );

        return orderModule;
    });
})(window.define);
