(function (define) {
    "use strict";

    define(["category/init"], function (categoryModule) {
        categoryModule
            .controller("categoryEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$categoryApiService",
                function ($scope, $routeParams, $location, $q, $categoryApiService) {
                    var categoryId, rememberProducts, oldProducts, getDefaultCategory;

                    // Initialize SEO
                    if(typeof $scope.initSeo === "function"){
                        $scope.initSeo("category");
                    }

                    categoryId = $routeParams.id;

                    if (!categoryId && categoryId !== "new") {
                        $location.path("/categories");
                    }

                    if (categoryId === "new") {
                        categoryId = null;
                    }

                    oldProducts = [];

                    getDefaultCategory = function () {
                        return {
                            name: "",
                            "parent_id": "",
                            "products": []
                        };
                    };

                    /**
                     * Current selected category
                     *
                     * @type {Object}
                     */
                    $scope.category = {};

                    /**
                     * Gets list all attributes of category
                     */
                    $categoryApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        }
                    );

                    $categoryApiService.getCategory({"id": categoryId}).$promise.then(
                        function (response) {
                            var result = response.result || {};
                            $scope.category = result;
                            $scope.category.parent = $scope.category['parent_id'];
                        }
                    );

                    $scope.back = function () {
                        $location.path("/categories");
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

                        removeProduct = function () {
                            var j, i, oldProdId, isRemoved, prodId;

                            for (i = 0; i < oldProducts.length; i += 1) {
                                oldProdId = oldProducts[i];
                                isRemoved = true;
                                for (j = 0; j < $scope.category.products.length; j += 1) {
                                    prodId = $scope.category.products[i];
                                    if (typeof prodId === "object" && oldProdId === prodId._id) {
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
                        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
                        defer = $q.defer();

                        if (typeof $scope.category !== "undefined") {
                            id = $scope.category.id || $scope.category._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === "") {
                                $scope.category = response.result || getDefaultCategory();
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Category was created successfully'
                                };
                                defer.resolve(true);
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {
                            defer.resolve(false);
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            if (response.error === "") {
                                $scope.category = response.result || getDefaultCategory();
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Product was updated successfully'
                                };
                                defer.resolve(true);
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                            defer.resolve(false);
                        };

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

                        return defer.promise;
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

                }
            ]
        );

        return categoryModule;
    });
})(window.define);
