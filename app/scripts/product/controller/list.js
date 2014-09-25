(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule
            .controller("productListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$productApiService",
                "$designImageService",
                "COUNT_ITEMS_PER_PAGE",
                "$q",
                function ($scope, $location, $routeParams, $productApiService, $designImageService, COUNT_ITEMS_PER_PAGE, $q) {

                    var splitName;

                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "Image",
                            "type": "image",
                            "label": "",
                            "visible": true
                        },
                        {
                            "attribute": "Name",
                            "type": "select-link",
                            "label": "Name",
                            "visible": true,
                            "notDisable": true,
                            "filter": "text",
                            "filterValue": $routeParams.name
                        },
                        {
                            "attribute": "price",
                            "type": "price",
                            "label": "Price",
                            "visible": true,
                            "filter": "range",
                            "filterValue": $routeParams['price']
                        },
                        {
                            "attribute": "sku",
                            "type": "string",
                            "label": "Sku",
                            "visible": true,
                            "filter": "text",
                            "filterValue": $routeParams.sku
                        }
                    ];

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0,"+COUNT_ITEMS_PER_PAGE);
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
                    $productApiService.productList(
                        $location.search(),
                        {"extra": "price"}
                    ).$promise.then(
                        function (response) {
                            var result, i, parts;
                            $scope.products = [];

                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                parts = splitName(result[i].Name);
                                result[i].Name = parts[2];
                                result[i].sku = parts[1];
                                $scope.products.push(result[i]);
                            }
                        }
                    );

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
                                        'message': 'Product(s) was removed successfuly'
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
