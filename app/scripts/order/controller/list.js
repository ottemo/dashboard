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
                    var getOrdersList, serviceList, getOrderCount, getAttributeList;
                    serviceList = new DashboardListService();

                    $scope.idsSelectedRows = {};

                    /**
                     * Gets list of categories
                     */
                    getOrdersList = function () {
                        $orderApiService.orderList($location.search(), {"extra": serviceList.getExtraFields()}).$promise.then(
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
                    getOrderCount = function() {
                        $orderApiService.getCount($location.search(), {}).$promise.then(
                            function (response) {
                                if (response.error === "") {
                                    $scope.count = response.result;
                                } else {
                                    $scope.count = 0;
                                }
                            }
                        );
                    };

                    getAttributeList = function() {
                        $orderApiService.getAttributes().$promise.then(
                            function (response) {
                                var result = response.result || [];
                                serviceList.init('orders');
                                $scope.attributes = result;
                                serviceList.setAttributes($scope.attributes);
                                $scope.fields = serviceList.getFields();
                                getOrdersList();
                            }
                        );
                    };

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

                    var hasSelectedRows = function () {
                        var result = false;
                        for (var _id in $scope.idsSelectedRows) {
                            if ($scope.idsSelectedRows.hasOwnProperty(_id) && $scope.idsSelectedRows[_id]) {
                                result = true;
                            }
                        }
                        return result;
                    };

                    /**
                     * Removes order by ID
                     *
                     */
                    $scope.remove = function () {
                        if (!hasSelectedRows()) {
                            return true;
                        }

                        var i, answer, _remove;
                        answer = window.confirm("You really want to remove this order(s)?");
                        _remove = function (id) {
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
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.orders.length; i += 1) {
                                        if ($scope.orders[i].ID === response) {
                                            $scope.orders.splice(i, 1);
                                        }
                                    }
                                }
                            };
                            for (var id in $scope.idsSelectedRows) {
                                if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
                                    _remove(id).then(callback);
                                }
                            }
                        }
                    };

                    $scope.$watch(function () {
                        if (typeof $scope.attributes !== "undefined" && typeof $scope.ordersTmp !== "undefined") {
                            return true;
                        }

                        return false;
                    }, function (isInitAll) {
                        if(isInitAll) {
                            $scope.orders = serviceList.getList($scope.ordersTmp);
                        }
                    });

                    $scope.init = (function () {
                        if (JSON.stringify({}) === JSON.stringify($location.search())) {
                            $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                            return;
                        }
                        getOrderCount();
                        getAttributeList();
                    })();
                }
            ]
        );

        return orderModule;
    });
})(window.define);