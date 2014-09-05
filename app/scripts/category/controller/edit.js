(function (define) {
    "use strict";

    define(["category/init"], function (categoryModule) {
        categoryModule
            .controller("categoryEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$categoryApiService",
                function ($scope, $routeParams, $location, $categoryApiService) {
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
                            $scope.category.parent = $scope.category.parent_id;  // jshint ignore:line
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
                                window.alert("Product was added");
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
                            if (response.error === "") {
                                window.alert("Product was updated");
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
