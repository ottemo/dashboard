(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule
            .controller("productListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$dashboardListService",
                "$productApiService",
                "$designImageService",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $location, $routeParams, $q, DashboardListService, $productApiService,
                          $designImageService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList, splitName, getProductsList, getAttributeList, getProductCount;

                    serviceList = new DashboardListService();

                    $scope.removeIds = {};
                    $scope.fields = [
                        {
                            "attribute": "Image",
                            "type": "image",
                            "label": "",
                            "visible": true
                        }
                    ];

                    splitName = function (string) {
                        var parts;
                        var regExp = /\[(.+)\](.+)/i;
                        parts = string.match(regExp);

                        return parts;
                    };

                    /**
                     * Gets list of products
                     */
                    getProductsList = function () {
                        $productApiService.productList(
                            $location.search(),
                            {"extra": serviceList.getExtraFields()}
                        ).$promise.then(
                            function (response) {
                                var result, i, parts;
                                $scope.productsTmp = [];

                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    parts = splitName(result[i].Name);
                                    result[i].Name = parts[2];
                                    result[i].sku = parts[1];
                                    $scope.productsTmp.push(result[i]);
                                }
                            }
                        );
                    };

                    /**
                     * Gets count products
                     */
                    getProductCount = function () {
                        $productApiService.getCount($location.search(), {}).$promise.then(function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        });
                    };

                    /**
                     * Gets attribute list
                     */
                    getAttributeList = function () {
                        $productApiService.attributesInfo().$promise.then(function (response) {
                            var result = response.result || [];
                            serviceList.init('products');

                            $scope.attributes = result;
                            serviceList.setAttributes($scope.attributes);
                            $scope.fields = $scope.fields.concat(serviceList.getFields());

                            getProductsList();
                        });
                    };

                    /**
                     * Handler event when selecting the product in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/product/" + id);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/product/new");
                    };

                    /**
                     * Removes products which id collected in removeIds
                     *
                     */
                    $scope.remove = function () {
                        var answer, id, i, _remove;
                        answer = window.confirm("You really want to remove this product?");
                        _remove = function (id) {
                            var defer = $q.defer();

                            $productApiService.remove({"id": id},
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
                                    for (i = 0; i < $scope.products.length; i += 1) {
                                        if ($scope.products[i].Id === response) {
                                            $scope.products.splice(i, 1);
                                        }
                                    }
                                    $scope.message = {
                                        'type': 'success',
                                        'message': 'Product(s) was removed successfully'
                                    };
                                }
                            };
                            for (id in $scope.removeIds) {

                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    _remove(id).then(callback);
                                }
                            }
                        }
                    };

                    /**
                     * Returns full path to image
                     *
                     * @param {string} image    - image name
                     * @returns {string}        - full path to image
                     */
                    $scope.getImage = function (image) {
                        return $designImageService.getFullImagePath("", image);
                    };

                    $scope.$watch(function () {
                        if (typeof $scope.attributes !== "undefined" && typeof $scope.productsTmp !== "undefined") {
                            return true;
                        }

                        return false;
                    }, function (isInitAll) {
                        if(isInitAll) {
                            $scope.products = serviceList.getList($scope.productsTmp);
                        }
                    });

                    $scope.init = (function () {
                        if (JSON.stringify({}) === JSON.stringify($location.search())) {
                            $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                            return;
                        }
                        getProductCount();
                        getAttributeList();
                    })();
                }
            ]
        );

        return productModule;
    });
})(window.define);
