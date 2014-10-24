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
                function ($scope, $location, $routeParams, $q, $dashboardListService, $categoryApiService, COUNT_ITEMS_PER_PAGE) {

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                    }

                    $scope.removeIds = {};

                    /**
                     * Gets list of categories
                     */
                    var getCategoriesList = function(){
                        $categoryApiService.categoryList($location.search(), {"extra": $dashboardListService.getExtraFields()}).$promise.then(
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
                    $categoryApiService.getCount($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    $categoryApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $dashboardListService.init('categories');
                            $scope.attributes = result;
                            $dashboardListService.setAttributes($scope.attributes);
                            $scope.fields = $dashboardListService.getFields();
                            getCategoriesList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.categoriesTmp === "undefined") {
                            return false;
                        }

                        $scope.categories = $dashboardListService.getList($scope.categoriesTmp);
                    };

                    $scope.$watch("categoriesTmp", prepareList);
                    $scope.$watch("attributes", prepareList);

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

                    var remove = function (id) {
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

                    /**
                     * Removes category by ID
                     *
                     * @param {string} id
                     */
                    $scope.remove = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this category");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.categories.length; i += 1) {
                                        if ($scope.categories[i].Id === response) {
                                            $scope.categories.splice(i, 1);
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
        ); // jshint ignore:line

        return categoryModule;
    });
})(window.define);
