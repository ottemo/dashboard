(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule
            .controller("productEditController", ["$scope", "$productApiService", "$designImageService", function ($scope, $productApiService, $designImageService) {

                /**
                 * Product by default
                 *
                 * @type {object}
                 */
                $scope.defaultProduct = {};
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
                 * Current selected product
                 *
                 * @type {Object}
                 */
                $scope.product = $scope.defaultProduct;

                /**
                 * List of products
                 */
                $scope.products = [];

                /**
                 * Gets list all attributes of product
                 */
                $productApiService.attributesInfo().$promise.then(
                    function (response) {
                        var result = response.result || [];
                        $scope.attributes = result;
                    });

                /**
                 * Gets list of products
                 */
                $productApiService.productList().$promise.then(
                    function (response) {
                        var result, i;
                        result = response.result || [];
                        for (i = 0; i < result.length; i += 1) {
                            $scope.products.push(result[i]);
                        }
                    });

                /**
                 * Handler event when selecting the product in the list
                 *
                 * @param id
                 */
                $scope.select = function (id) {
                    $productApiService.getProduct({"id": id}).$promise.then(
                        function (response) {
                            var result = response.result || {};
                            $scope.product = result;
                            $scope.selectedImage = result.default_image;
                        });
                };

                /**
                 * Clears the form to create a new product
                 */
                $scope.clearForm = function () {
                    $scope.product = $scope.defaultProduct;
                };

                /**
                 * Removes product by ID
                 *
                 * @param {string} id
                 */
                $scope.delete = function (id) {
                    var i, answer;
                    answer = window.confirm("You really want to remove this product");
                    if (answer) {
                        $productApiService.delete({"id": id}, function (response) {
                            if (response.result === "ok") {
                                for (i = 0; i < $scope.products.length; i += 1) {
                                    if ($scope.products[i]._id === id) {
                                        $scope.products.splice(i, 1);
                                        $scope.product = $scope.defaultProduct;
                                    }
                                }
                            }
                        });
                    }
                };

                /**
                 * Event handler to save the product data.
                 * Creates new product if ID in current product is empty OR updates current product if ID is set
                 */
                $scope.save = function () {
                    var id, saveSuccess, saveError, updateSuccess, updateError;
                    if (typeof $scope.product !== "undefined") {
                        id = $scope.product.id || $scope.product._id;
                    }

                    /**
                     *
                     * @param response
                     */
                    saveSuccess = function (response) {
                        if (response.error === "") {
                            $scope.products.push(response.result);
                        }
                    };

                    /**
                     *
                     * @param response
                     */
                    saveError = function () {
                    };

                    /**
                     *
                     * @param response
                     */
                    updateSuccess = function (response) {
                        var i, field;
                        if (response.error === "") {
                            for (i = 0; i < $scope.products.length; i += 1) {
                                if ($scope.products[i]._id === response.result._id) {
                                    for(field in response.result){
                                        $scope.products[i][field] = response.result[field];
                                    }
                                }
                            }
                        }
                    }
                    ;

                    /**
                     *
                     * @param response
                     */
                    updateError = function () {
                    };
                    if (!id) {
                        $productApiService.save($scope.product, saveSuccess, saveError);
                    } else {
                        $scope.product.id = id;
                        $productApiService.update($scope.product, updateSuccess, updateError);
                    }
                };


                //-----------------
                // IMAGE FUNCTIONS
                //-----------------

                $scope.reloadImages = function () {
                    if ($scope.product !== undefined && $scope.product._id !== undefined) {
                        // taking media patch for new product
                        $productApiService.getImagePath({"productId": $scope.product._id}).$promise.then(
                            function (response) {
                                $scope.imagesPatch = response.result || "";
                            });

                        // taking registered images for product
                        $productApiService.listImages({"productId": $scope.product._id}).$promise.then(
                            function (response) {
                                $scope.productImages = response.result || [];
                            });
                    }
                };

                $scope.$watch("product", function () {
                    $scope.reloadImages();
                });

                /**
                 * Adds file to product
                 *
                 * @param fileElementId
                 */
                $scope.imageAdd = function (fileElementId) {
                    var file = document.getElementById(fileElementId);

                    var pid = $scope.product._id, mediaName = file.files[0].name;

                    var postData = new FormData();
                    postData.append("file", file.files[0]);

                    if (pid !== undefined) {
                        $productApiService.addImage({"productId": pid, "mediaName": mediaName}, postData)
                            .$promise.then(function (response) {
                                $scope.reloadImages();
                            });
                    }
                };

                /**
                 * Removes image from product (from product folder) and sends request to saves
                 *
                 * @param {string} selected - image name
                 */
                $scope.imageRemove = function (selected) {
                    var pid = $scope.product._id, mediaName = selected;

                    if (pid !== undefined && selected !== undefined) {
                        $productApiService.removeImage({"productId": pid, "mediaName": mediaName})
                            .$promise.then(function (response) {
                                $scope.selectedImage = undefined;
                                $scope.reloadImages();
                                $scope.product.default_image = "";
                                for (var i = 0; i < $scope.products.length; i += 1) {
                                    if ($scope.products[i]._id === $scope.product._id) {
                                        $scope.products[i].default_image = $scope.product.default_image;
                                    }
                                }
                                $scope.save();
                            });
                    }
                };

                /**
                 * Sets image as image default
                 *
                 * @param {string} selected - image name
                 */
                $scope.imageDefault = function (selected) {
                    $scope.product.default_image = selected;
                    for (var i = 0; i < $scope.products.length; i += 1) {
                        if ($scope.products[i]._id === $scope.product._id) {
                            $scope.products[i].default_image = $scope.product.default_image;
                            $scope.save();
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
                $scope.getImage = function (path, image) {
                    return $designImageService.getFullImagePath(path, image);
                };
            }
            ])

        return productModule;
    });
})(window.define);