(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorListController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$dashboardListService",
                "$visitorApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $routeParams, $location, $q, DashboardListService, $visitorApiService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList = new DashboardListService();

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                    }

                    $scope.removeIds = {};

                    /**
                     * Gets list of visitors
                     */
                    var getVisitorsList = function () {
                        $visitorApiService.visitorList($location.search(), {"extra": serviceList.getExtraFields()}).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.visitorsTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    $scope.visitorsTmp.push(result[i]);
                                }
                            }
                        );
                    };

                    /**
                     * Gets list of visitors
                     */
                    $visitorApiService.getCountVisitors($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    $visitorApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            serviceList.init('visitors');
                            $scope.attributes = result;
                            serviceList.setAttributes($scope.attributes);
                            $scope.fields = serviceList.getFields();
                            getVisitorsList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.visitorsTmp === "undefined") {
                            return false;
                        }

                        $scope.visitors = serviceList.getList($scope.visitorsTmp);
                    };

                    $scope.$watch("visitorsTmp", prepareList);
                    $scope.$watch("attributes", prepareList);

                    /**
                     * Handler event when selecting the visitor in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/visitor/" + id);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/visitor/new");
                    };

                    var remove = function (id) {
                        var defer = $q.defer();

                        $visitorApiService.remove({"id": id},
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
                     * Removes visitor by ID
                     *
                     * @param {string} id
                     */
                    $scope.remove = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this visitor");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.visitors.length; i += 1) {
                                        if ($scope.visitors[i].Id === response) {
                                            $scope.visitors.splice(i, 1);
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

        return visitorModule;
    });
})(window.define);
