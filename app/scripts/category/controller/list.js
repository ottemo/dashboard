(function (define) {
    "use strict";

    define(["category/init"], function (categoryModule) {
        categoryModule
            .controller("categoryListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$categoryApiService",
                function ($scope, $location, $routeParams, $q, $categoryApiService) {

                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "Name",
                            "type": "select-link",
                            "label": "Name",
                            "visible": true,
                            "notDisable": true,
                            "filter": "text",
                            "filterValue": $routeParams.name
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
                    $categoryApiService.categoryList($location.search(), {}).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.categories = [];
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.categories.push(result[i]);
                            }
                        }
                    );

                    /**
                     * Gets count of categories
                     */
//                    $categoryApiService.getCount($location.search(), {}).$promise.then(
//                        function (response) {
//                            if (response.error === "") {
//                                $scope.count = response.result;
//                            } else {
//                                $scope.count = 0;
//                            }
//                        }
//                    );
                    $scope.count = 3;
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
                            for (id in $scope.removeIds) {
                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    remove(id).then(
                                        function (response) {
                                            if (response) {
                                                for (i = 0; i < $scope.categories.length; i += 1) {
                                                    if ($scope.categories[i].Id === response) {
                                                        $scope.categories.splice(i, 1);
                                                    }
                                                }
                                            }
                                        }
                                    );
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
