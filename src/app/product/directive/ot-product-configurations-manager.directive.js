angular.module('productModule')

    .directive('otProductConfigurationsManager', [
        '_',
        'productApiService',
        'coreParserService',
        'productConfigurableService',
        '$uibModal',
        'MEDIA_BASE_PATH',
        function (_,
            productApiService,
            coreParserService,
            productConfigurableService,
            $uibModal,
            MEDIA_BASE_PATH) {
            return {
                restrict: 'EA',
                scope: {
                    product: '=',
                    productScope: '=',
                    attributes: '='
                },
                templateUrl: '/views/product/directive/ot-product-configurations-manager.html',
                controller: function ($scope) {

                    // Possible types of options for displaying on frontend
                    $scope.optionTypes = {
                        'select_text': 'Text boxes',
                        'select_image': 'Swatches',
                        'select': 'Dropdown'
                    };

                    $scope.isValidAttributesSettings = isValidAttributesSettings;
                    $scope.applySuperAttributesSettings = applySuperAttributesSettings;

                    $scope.selectImage = selectImage;
                    $scope.getImagePath = getImagePath;

                    $scope.configurationsSetup = {};
                    //$scope.configurationsGrid = {};

                    activate();

                    ///////////////////////////////////////////////

                    function activate() {
                        // Super options of product - options with `has_associated_products` = true
                        var superOptionKeys = getSuperOptionsKeys($scope.product.options);
                        // All possible super attributes - with Array type, except `related_pid` attribute
                        var superAttributes = productConfigurableService.getSuperAttributes($scope.attributes);

                        // Initialize settings for super attributes
                        _.forEach(superAttributes, function (attr, attrKey) {
                            if (superOptionKeys.indexOf(attrKey) !== -1) {
                                var superOption = $scope.product.options[attrKey];
                                attr.type = superOption.type;
                                attr.controls_image = superOption.controls_image;
                                attr.sort = superOption.order;
                                attr.selected = true;
                            } else {
                                attr.type = 'select_text';
                                attr.controls_image = false;
                                attr.sort = 0;
                                attr.selected = false;
                            }
                        });

                        var hasConfigurations = superOptionKeys.length > 0;
                        $scope.superAttributes = superAttributes;
                        $scope.hasConfigurations = hasConfigurations;

                        $scope.superOptions = {};
                        _.forEach(superOptionKeys, function (key) {
                            $scope.superOptions[key] = $scope.product.options[key];
                        });

                        if (hasConfigurations) {
                            loadAssociatedProducts();
                        }
                    }

                    /**
                     * Validates settings of super attributes
                     */
                    function isValidAttributesSettings() {
                        if ($scope.attributesSettingsCtrl.$invalid) return false;

                        var hasSelectedAttributes = false;
                        _.forEach($scope.superAttributes, function (attr) {
                            if (attr.selected) {
                                hasSelectedAttributes = true;
                                return false;
                            }
                        });

                        return hasSelectedAttributes;
                    }

                    /**
                     *  Returns keys of options that are used for product configurations
                     */
                    function getSuperOptionsKeys(options) {
                        var superOptionKeys = [];
                        _.forEach(options, function (option, optionKey) {
                            if (option.has_associated_products) {
                                superOptionKeys.push(optionKey);
                            }
                        });

                        return superOptionKeys;
                    }

                    /**
                     * Applies super attributes settings and reloads associated products grid
                     */
                    function applySuperAttributesSettings(superAttributes) {
                        $scope.superOptions = {};

                        _.forEach(superAttributes, function (attr, key) {
                            if (!attr.selected) {
                                if ($scope.product.options[key] !== undefined) {
                                    delete $scope.product.options[key];
                                }
                            } else {
                                if ($scope.product.options[key] === undefined) {
                                    $scope.product.options[key] = {
                                        key: key,
                                        label: attr.label,
                                        has_associated_products: true,
                                        controls_inventory: true,
                                        controls_image: attr.controls_image,
                                        required: true,
                                        type: attr.type,
                                        options: {},
                                        order: 0
                                    };
                                } else {
                                    var productOption = $scope.product.options[key];
                                    productOption.label = attr.label;
                                    productOption.type = attr.type;
                                    productOption.order = attr.sort;
                                    productOption.controls_image = attr.controls_image;
                                }

                                $scope.superOptions[key] = $scope.product.options[key];
                            }
                        });

                        $scope.hasConfigurations = true;
                        loadAssociatedProducts();
                    }

                    /**
                     * Opens modal for image selection
                     */
                    function selectImage(selection) {
                        $uibModal.open({
                            controller: 'productSelectImageController',
                            templateUrl: "/views/product/select-image.html",
                            size: 'lg',
                            resolve: {
                                product: function () {
                                    return $scope.product;
                                },
                                productScope: function () {
                                    return $scope.productScope;
                                }
                            }
                        }).result.then(
                            function (result) {
                                selection.image_name = result;
                            }
                        );
                    }

                    /**
                     * Return image path from product ID and media name
                     */
                    function getImagePath(mediaName) {
                        if (mediaName) {
                            return MEDIA_BASE_PATH + 'image/Product/' + $scope.product._id + '/' + mediaName;
                        } else return '';
                    }

                    function loadAssociatedProducts() {
                        var configurable = productConfigurableService.configurable(
                            $scope.attributes,
                            $scope.product,
                            $scope.superOptions
                        );

                        configurable.getConfigurationsGrid().then(function (grid) {
                            $scope.configurationsGrid = grid;
                        });
                    }
                }
            };
        }]);
