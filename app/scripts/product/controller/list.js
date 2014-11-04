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
                function ($scope, $location, $routeParams, $q, $dashboardListService, $productApiService, $designImageService, COUNT_ITEMS_PER_PAGE) {

                    var splitName;

                    $scope.fields = [
                        {
                            "attribute": "Image",
                            "type": "image",
                            "label": "",
                            "visible": true
                        }
                    ];


                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                    }

                    splitName = function (string) {
                        var parts;
                        var regExp = /\[(.+)\](.+)/i;
                        parts = string.match(regExp);

                        return parts;
                    };

                    $scope.removeIds = {};

                    /**
                     * Gets list of products
                     */
                    var getProductsList = function () {
                        $productApiService.productList(
                            $location.search(),
                            {"extra": $dashboardListService.getExtraFields()}
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
                     * Gets list of products
                     */
                    $productApiService.getCount($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    $productApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $dashboardListService.init('products');

                            $scope.attributes = result;
                            $dashboardListService.setAttributes($scope.attributes);
                            $scope.fields = $scope.fields.concat($dashboardListService.getFields());
                            getProductsList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.productsTmp === "undefined") {
                            return false;
                        }

                        $scope.products = $dashboardListService.getList($scope.productsTmp);
                    };

                    $scope.$watch("productsTmp", prepareList);
                    $scope.$watch("attributes", prepareList);

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

                    var remove = function (id) {
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

                    /**
                     * Removes products which id collected in removeIds
                     *
                     */
                    $scope.remove = function () {
                        var answer, id, i;
                        answer = window.confirm("You really want to remove this product");

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
                                    remove(id).then(callback);
                                }
                            }
                        }
                    };

                    /**
                     * Returns full path to image
                     *
                     * @param {string} path     - the destination path to product folder
                     * @param {string} image    - image name
                     * @returns {string}        - full path to image
                     */
                    $scope.getImage = function (image) {
                        return $designImageService.getFullImagePath("", image);
                    };
                }
            ]
        );

        return productModule;
    });
})(window.define);
