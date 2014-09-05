(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule
            .controller("productEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$productApiService",
                "$designImageService",
                function ($scope, $routeParams, $location, $productApiService, $designImageService) {

                    var productId, getDefaultProduct, addImageManagerAttribute;

                    productId = $routeParams.id;

                    if (!productId && productId !== "new") {
                        $location.path("/products");
                    }

                    if (productId === "new") {
                        productId = null;
                    }

                    // Initialize SEO
                    if (typeof $scope.initSeo === "function") {
                        $scope.initSeo("product");
                    }

                    addImageManagerAttribute = function() {
                        $scope.attributes.unshift({
                            Attribute: "default_image",
                            Collection: "product",
                            Default: "",
                            Editors: "picture_manager",
                            Group: "Pictures",
                            IsRequired: false,
                            IsStatic: false,
                            Label: "Image",
                            Model: "Product",
                            Options: "",
                            Type: "text"
                        })
                    };

                    getDefaultProduct = function () {
                        return {
                            "_id": undefined,
                            "sku": "",
                            "name": "",
                            "short_description": "",
                            "default_image": "",
                            "price": "",
                            "weight": "",
                            "size": ""
                        };
                    };

                    /**
                     * Current selected product
                     *
                     * @type {Object}
                     */
                    $scope.product = getDefaultProduct();

                    /**
                     * Gets list all attributes of product
                     */
                    $productApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        });

                    /**
                     * Gets list all attributes of product
                     */
                    if (null !== productId) {
                        $productApiService.getProduct({"id": productId}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.product = result;
                                $scope.selectedImage = result.default_image; // jshint ignore:line

                                addImageManagerAttribute();
                            }
                        );
                    }
                    /**
                     * Clears the form to create a new product
                     */
                    $scope.clearForm = function () {
                        $scope.product = getDefaultProduct();
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
                                $scope.product._id = response.result._id;
                                $scope.productImages = [];
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Product was created successfuly'
                                };
                                addImageManagerAttribute();
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {
                            $scope.message = {
                                'type': 'danger',
                                'message': 'Something went wrong'
                            };
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            if (response.error === "") {
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Product was updated successfuly'
                                };
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                            $scope.message = {
                                'type': 'danger',
                                'message': 'Something went wrong'
                            };
                        };

                        if (!id) {
                            $productApiService.save($scope.product, saveSuccess, saveError);
                        } else {
                            $scope.product.id = id;
                            $productApiService.update($scope.product, updateSuccess, updateError);
                        }
                    };

                    $scope.back = function () {
                        $location.path("/products");
                    };

                    //-----------------
                    // IMAGE FUNCTIONS
                    //-----------------

                    $scope.reloadImages = function () {
                        if ($scope.product !== undefined && $scope.product._id !== undefined) {
                            // taking media patch for new product
                            $productApiService.getImagePath({"productId": $scope.product._id}).$promise.then(
                                function (response) {
                                    $scope.imagesPath = response.result || "";
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
                                .$promise.then(function () {
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
                                .$promise.then(function () {
                                    $scope.selectedImage = undefined;
                                    $scope.reloadImages();
                                    $scope.product.default_image = "";  // jshint ignore:line
                                    for (var i = 0; i < $scope.products.length; i += 1) {
                                        if ($scope.products[i].Id === $scope.product._id) {
                                            $scope.products[i].Image = $scope.product.default_image;  // jshint ignore:line
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
                        $scope.product.default_image = selected;  // jshint ignore:line
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
            ]);

        return productModule;
    });
})(window.define);
