(function (define, $) {
    "use strict";

    define(["category/init"], function (categoryModule) {
        categoryModule
            .controller("categoryEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$categoryApiService",
                "$dashboardUtilsService",
                function ($scope, $routeParams, $location, $q, $categoryApiService, $dashboardUtilsService) {
                    var categoryId, rememberProducts, oldProducts, getDefaultCategory;

                    // Initialize SEO
                    if (typeof $scope.initSeo === "function") {
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
                    $categoryApiService.attributesInfo().$promise.then(function (response) {
                        var result = response.result || [];
                        $scope.attributes = result;
                    });

                    if (null !== categoryId) {
                        $categoryApiService.getCategory({"categoryID": categoryId}).$promise.then(function (response) {
                            var result = response.result || {};
                            $scope.category = result;
                            rememberProducts();
                            $scope.category.parent = $scope.category['parent_id'];
                        });
                    }

                    $scope.back = function () {
                        $location.path("/categories");
                    };

                    $scope.saveProducts = function () {
                        var defer, categoryId, addProduct, removeProduct;
                        defer = $q.defer();

                        if (typeof $scope.category !== "undefined") {
                            categoryId = $scope.category.id || $scope.category._id;
                        }


                        addProduct = function () {
                            var _addProduct = function (index) {
                                var addDefer = $q.defer();

                                var prodId = $scope.category.products[index];

                                if (typeof prodId === "object") {
                                    prodId = prodId._id;
                                }

                                if (oldProducts.indexOf(prodId) === -1) {
                                    $categoryApiService.addProduct({
                                        categoryId: categoryId,
                                        productId: prodId
                                    }).$promise.then(function () {
                                            addDefer.resolve(prodId);
                                        }
                                    );
                                }

                                return addDefer.promise;
                            };

                            var callback = function (prodId) {
                                oldProducts.push(prodId);
                            };

                            if ($scope.category.products instanceof Array) {
                                for (var i = 0; i < $scope.category.products.length; i += 1) {
                                    _addProduct(i).then(callback);
                                }
                            }

                            defer.resolve(true);
                        };

                        removeProduct = function (cb) {
                            var i, oldProdId, _remove, callback;

                            var getProductIds = function (products) {
                                var ids = [];

                                for (var i = 0; i < products.length; i += 1) {
                                    if(typeof products[i] === "string"){
                                        ids.push(products[i]);
                                    } else if(typeof products[i] === "object"){
                                        ids.push(products[i]._id);
                                    }
                                }

                                return ids;
                            };

                            callback = function (index) {
                                oldProducts.splice(index, 1);
                            };

                            _remove = function (index) {
                                var removeDefer = $q.defer();

                                oldProdId = oldProducts[index];

                                if (-1 === getProductIds($scope.category.products).indexOf(oldProdId)) {
                                    $categoryApiService.removeProduct({
                                        categoryID: categoryId,
                                        productID: oldProdId
                                    }).$promise.then(function () {
                                            removeDefer.resolve(index);
                                        }
                                    );
                                }

                                return removeDefer.promise;
                            };

                            for (i = 0; i < oldProducts.length; i += 1) {
                                _remove(i).then(callback);
                            }
                            cb();
                        };

                        removeProduct(addProduct);

                        return defer.promise;
                    };

                    /**
                     * Event handler to save the category data.
                     * Creates new category if ID in current category is empty OR updates current category if ID is set
                     */
                    $scope.save = function () {
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

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
                            if (response.error === null) {
                                $scope.category = response.result || getDefaultCategory();
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Category was created successfully');
                                defer.resolve(true);
                            }
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {
                            defer.resolve(false);
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            if (response.error === null) {
                                $scope.category = response.result || getDefaultCategory();
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Product was updated successfully');
                                defer.resolve(true);
                                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                            defer.resolve(false);
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        };

                        delete $scope.category.parent;
                        delete $scope.category.path;

                        if (!id) {
                            if ($scope.category.name !== "") {
                                $categoryApiService.save($scope.category, saveSuccess, saveError);
                            }
                        } else {
                            $scope.category.id = id;
                            $scope.saveProducts().then(function () {
                                delete $scope.category.products;
                                $categoryApiService.update($scope.category, updateSuccess, updateError);
                            });

                        }

                        return defer.promise;
                    };

                    rememberProducts = function () {
                        var i, prod;
                        oldProducts = [];
                        if (typeof $scope.category !== "undefined" &&
                            $scope.category.products instanceof Array &&
                            $scope.category.products.length !== -1) {
                            for (i = 0; i < $scope.category.products.length; i += 1) {
                                prod = $scope.category.products[i];
                                oldProducts.push(prod._id);
                            }
                        }
                    };

                }
            ]
        );

        return categoryModule;
    });
})(window.define, jQuery);
