(function (define) {
    "use strict";

    define(["order/init"], function (orderModule) {
        orderModule
            .controller("orderListController", [
                "$scope",
                "$location",
                "$q",
                "$orderApiService",
                function ($scope, $location, $q, $orderApiService) {
                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "Name",
                            "type": "select-link",
                            "label": "Name"
                        },
                        {
                            "attribute": "Desc",
                            "type": "text",
                            "label": "Description"
                        }
                    ];

                    $scope.count = 100;

                    /**
                     * Current selected order
                     *
                     * @type {Object}
                     */
                    $scope.orders = [];
                    $scope.removeIds = {};

                    /**
                     * Gets list of categories
                     */
                    $orderApiService.orderList({}).$promise.then(
                        function (response) {
                            var result, i;
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.orders.push(result[i]);
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
                            for (id in $scope.removeIds) {
                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    remove(id).then(
                                        function (response) {
                                            if (response) {
                                                for (i = 0; i < $scope.orders.length; i += 1) {
                                                    if ($scope.orders[i].Id === response) {
                                                        $scope.orders.splice(i, 1);
                                                    }
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    };

                }]); // jshint ignore:line
        return orderModule;
    });
})(window.define);
