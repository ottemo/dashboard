(function (define) {
    "use strict";

    define(["category/init"], function (categoryModule) {
        categoryModule
            .controller("categoryListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$dashboardListService",
                "$categoryApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $location, $routeParams, $q, DashboardListService, $categoryApiService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList, getCategoriesList, getCategoryCount, getAttributeList;

                    // Initialize SEO
                    if (typeof $scope.initSeo === "function") {
                        $scope.initSeo("category");
                    }

                    serviceList = new DashboardListService();

                    $scope.idsSelectedRows = {};

                    /**
                     * Gets list of categories
                     */
                    getCategoriesList = function () {
                        $categoryApiService.categoryList($location.search(), {"extra": serviceList.getExtraFields()}).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.categoriesTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    $scope.categoriesTmp.push(result[i]);
                                }
                            }
                        );
                    };

                    /**
                     * Gets count of categories
                     */
                    getCategoryCount = function () {
                        $categoryApiService.getCount($location.search(), {}).$promise.then(
                            function (response) {
                                if (response.error === null) {
                                    $scope.count = response.result;
                                } else {
                                    $scope.count = 0;
                                }
                            }
                        );
                    };

                    getAttributeList = function () {
                        $categoryApiService.attributesInfo().$promise.then(
                            function (response) {
                                var result = response.result || [];
                                serviceList.init('categories');
                                $scope.attributes = result;
                                serviceList.setAttributes($scope.attributes);
                                $scope.fields = serviceList.getFields();
                                getCategoriesList();
                            }
                        );
                    };

                    /**
                     * Handler event when selecting the category in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/category/" + id);

                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/category/new");
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
                     * Removes category by ID
                     *
                     */
                    $scope.remove = function () {
                        if (!hasSelectedRows()) {
                            return true;
                        }

                        var i, answer, _remove;
                        answer = window.confirm("Please confirm you want to remove this category.");
                        _remove = function (id) {
                            var defer = $q.defer();

                            $categoryApiService.remove({"id": id},
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
                                    for (i = 0; i < $scope.categories.length; i += 1) {
                                        if ($scope.categories[i].ID === response) {
                                            $scope.categories.splice(i, 1);
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
                        if (typeof $scope.attributes !== "undefined" && typeof $scope.categoriesTmp !== "undefined") {
                            return true;
                        }

                        return false;
                    }, function (isInitAll) {
                        if (isInitAll) {
                            $scope.categories = serviceList.getList($scope.categoriesTmp);
                        }
                    });

                    $scope.init = (function () {
                        if (JSON.stringify({}) === JSON.stringify($location.search())) {
                            $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                            return;
                        }
                        getCategoryCount();
                        getAttributeList();
                    })();
                }
            ]
        );

        return categoryModule;
    });
})(window.define);
