(function (define) {
    "use strict";

    define(["category/init"], function (categoryModule) {
        categoryModule
            .controller("categoryEditController", [
                "$scope",
                "$categoryApiService",
                function ($scope, $categoryApiService) {
                    var rememberProducts, oldProducts, getDefaultCategory;
                    oldProducts = [];

                    getDefaultCategory = function () {
                        return {
                            name: "",
                            "parent_id": "",
                            "products": []
                        };
                    };

                    $scope.page = 0;
                    $scope.count = 100;

                    /**
                     * Type of list
                     *
                     * @type {string}
                     */
                    $scope.activeView = "list";

                    /**
                     * Current selected category
                     *
                     * @type {Object}
                     */
                    $scope.category = {};
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
                    $categoryApiService.categoryList({limit: [$scope.page, $scope.count].join(",")}).$promise.then(
                        function (response) {
                            var result, i;
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.categories.push(result[i]);
                            }
                        });

                    /**
                     * Clears the form to create a new category
                     */
                    $scope.clearForm = function () {
                        $scope.category = {
                            "name": "",
                            "parent_id": "",
                            "products": []
                        };
                    };

                    $scope.clearForm();

                    /**
                     * Changes type of list
                     *
                     * @param type
                     */
                    $scope.switchListView = function (type) {
                        $scope.activeView = type;
                    };

                    /**
                     * Handler event when selecting the category in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $categoryApiService.getCategory({"id": id}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.category = result;
                                $scope.category.parent = $scope.category.parent_id;  // jshint ignore:line
                            });
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
                            $categoryApiService.remove({"id": id}, function (response) {
                                if (response.result === "ok") {
                                    for (i = 0; i < $scope.categories.length; i += 1) {
                                        if ($scope.categories[i].Id === id) {
                                            $scope.categories.splice(i, 1);
                                            $scope.category = getDefaultCategory();
                                        }
                                    }
                                }
                            });
                        }
                    };

                    $scope.saveProducts = function () {
                        var id, addProduct, removeProduct;

                        if (typeof $scope.category !== "undefined") {
                            id = $scope.category.id || $scope.category._id;
                        }

                        addProduct = function () {
                            for (var i = 0; i < $scope.category.products.length; i += 1) {
                                var prodId = $scope.category.products[i];
                                if (typeof prodId === "object") {
                                    prodId = prodId._id;
                                }
                                if (oldProducts.indexOf(prodId) === -1) {
                                    $categoryApiService.addProduct({
                                        categoryId: id,
                                        productId: prodId
                                    }).$promise.then();
                                }
                            }
                        };

                        removeProduct = function () { // jshint ignore:line
                            for (var i = 0; i < oldProducts.length; i += 1) {
                                var oldProdId = oldProducts[i];
                                var isRemoved = true;
                                for (var j = 0; j < $scope.category.products.length; j += 1) {
                                    var prodId = $scope.category.products[i];
                                    if (typeof prodId === "object") {
                                        prodId = prodId._id;
                                    }
                                    if (oldProdId === prodId) {
                                        isRemoved = false;
                                        break;
                                    }
                                }
                                if (isRemoved) {
                                    $categoryApiService.removeProduct({
                                        categoryId: id,
                                        productId: oldProdId
                                    }).$promise.then();
                                }
                            }
                        };

                        addProduct();
                        removeProduct();
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
                                $scope.categories.push({
                                    "Id": response.result._id,
                                    "Name": response.result.name
                                });
                                $scope.clearForm();
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {};

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            var i;
                            if (response.error === "") {
                                for (i = 0; i < $scope.categories.length; i += 1) {
                                    if ($scope.categories[i].Id === response.result._id) {
                                        $scope.categories[i] = {
                                            "Id": response.result._id,
                                            "Name": response.result.name
                                        };
                                        $scope.category.products = response.result.products;
                                    }
                                }
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {};

                        delete $scope.category.parent;
                        delete $scope.category.path;

                        if (!id) {
                            if ($scope.category.name !== "") {
                                $categoryApiService.save($scope.category, saveSuccess, saveError);
                            }
                        } else {
                            $scope.category.id = id;
                            $scope.saveProducts();
                            delete $scope.category.products;
                            $categoryApiService.update($scope.category, updateSuccess, updateError);
                        }
                    };

                    rememberProducts = function () {
                        var i, prod;
                        oldProducts = [];
                        if (typeof $scope.category !== "undefined" &&
                            typeof $scope.category.products !== "undefined" &&
                            $scope.category.products.length !== -1) {
                            for (i = 0; i < $scope.category.products.length; i += 1) {
                                prod = $scope.category.products[i];
                                oldProducts.push(prod._id);
                            }
                        }
                    };

                    $scope.$watch("category", rememberProducts);
                }]); // jshint ignore:line
        return categoryModule;
    });
})(window.define);
