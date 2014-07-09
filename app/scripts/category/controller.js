(function (define) {
    "use strict";

    define(["category/init"], function (categoryModule) {
        var prepareCategory;

        prepareCategory = function (category) {
            var result;
            result = category;
            result.id = category._id;
            result.title = category.name;
            result.shortDescription = category.name;
            return result;
        };

        categoryModule
            .controller("categoryEditController", ["$scope", "$categoryApiService", function ($scope, $categoryApiService) {

                /**
                 * Categroy by default
                 *
                 * @type {object}
                 */
                $scope.defaultCategory = {};
                /**
                 * Type of list
                 *
                 * @type {string}
                 */
                $scope.activeView = "list";

                /**
                 * Changes type of list
                 *
                 * @param type
                 */
                $scope.switchListView = function (type) {
                    $scope.activeView = type;
                };

                /**
                 * Current selected category
                 *
                 * @type {Object}
                 */
                $scope.category = $scope.defaultCategory;
                $scope.categories = [];

                /**
                 * Gets list all attributes of category
                 */
                $categoryApiService.attributesInfo().$promise.then(
                    function (response) {
                        var result = response.result || [];
                        $scope.attributes = result;
                    });

                /**
                 * Gets list of categories
                 */
                $categoryApiService.categoryList().$promise.then(
                    function (response) {
                        var result, i;
                        result = response.result || [];
                        for (i = 0; i < result.length; i += 1) {
                            $scope.categories.push(prepareCategory(result[i]));
                        }
                    });

                /**
                 * Handler event when selecting the category in the list
                 *
                 * @param id
                 */
                $scope.select = function (id) {
                    $categoryApiService.getCategroy({"id": id}).$promise.then(
                        function (response) {
                            var result = response.result || {};
                            $scope.category = result;
                        });
                };

                /**
                 * Clears the form to create a new category
                 */
                $scope.clearForm = function () {
                    $scope.category = $scope.defaultCategory;
                };

                /**
                 * Removes category by ID
                 *
                 * @param {string} id
                 */
                $scope.delete = function (id) {
                    var i, answer;
                    answer = window.confirm("You really want to remove this category");
                    if (answer) {
                        $categoryApiService.delete({"id": id}, function (response) {
                            if (response.result === "ok") {
                                for (i = 0; i < $scope.categories.length; i += 1) {
                                    if ($scope.categories[i]._id === id) {
                                        $scope.categories.splice(i, 1);
                                        $scope.category = $scope.defaultCategory;
                                    }
                                }
                            }
                        });
                    }
                };

                /**
                 * Event handler to save the category data.
                 * Creates new category if ID in current category is empty OR updates current category if ID is set
                 */
                $scope.save = function () {
                    var id, saveSuccess, saveError, updateSuccess, updateError;
                    if (typeof $scope.category !== "undefined") {
                        id = $scope.category.id || $scope.category._id;
                    }

                    /**
                     *
                     * @param response
                     */
                    saveSuccess = function (response) {
                        if (response.error === "") {
                            $scope.categories.push(prepareCategory(response.result));
                        }
                    };

                    /**
                     *
                     * @param response
                     */
                    saveError = function (response) {
                    };

                    /**
                     *
                     * @param response
                     */
                    updateSuccess = function (response) {
                        var i;
                        if (response.error === "") {
                            for (i = 0; i < $scope.categories.length; i += 1) {
                                if ($scope.categories[i]._id === response.result._id) {
                                    $scope.categories[i] = prepareCategory(response.result);
                                }
                            }
                        }
                    };

                    /**
                     *
                     * @param response
                     */
                    updateError = function (response) {
                    };

                    if (!id) {
                        $categoryApiService.save($scope.category, saveSuccess, saveError);
                    } else {
                        $scope.category.id = id;
                        $categoryApiService.update($scope.category, updateSuccess, updateError);
                    }
                };




            }]);
        return categoryModule;
    });
})(window.define);