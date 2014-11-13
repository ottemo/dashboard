(function (define) {
    "use strict";

    define(["order/init"], function (orderModule) {
        orderModule
            .controller("orderListController", [
                "$rootScope",
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$dashboardListService",
                "$orderApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($rootScope, $scope, $location, $routeParams, $q, DashboardListService, $orderApiService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList = new DashboardListService();

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                    }

                    $scope.removeIds = {};

                    /**
                     * Gets list of categories
                     */
                    var getOrdersList = function () {
                        $orderApiService.orderList($location.search(), {"extra": $rootScope.$list.getExtraFields()}).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.ordersTmp = [];

                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    $scope.ordersTmp.push(result[i]);
                                }
                            }
                        );
                    };

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

                    $orderApiService.getAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            serviceList.init('orders');
                            $scope.attributes = result;
                            $rootScope.$list.setAttributes($scope.attributes);
                            $scope.fields = $rootScope.$list.getFields();
                            getOrdersList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.ordersTmp === "undefined") {
                            return false;
                        }

                        $scope.orders = $rootScope.$list.getList($scope.ordersTmp);
                    };

                    $scope.$watch("ordersTmp", prepareList);
                    $scope.$watch("attributes", prepareList);


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
