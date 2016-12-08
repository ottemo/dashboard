angular.module('productModule')

    .directive('otProductConfigurationsManager', [
        '_',
        'productApiService',
        'coreParserService',
        'coreGridService',
        'productConfigurableService',
        '$uibModal',
        'MEDIA_BASE_PATH',
        function (
            _,
            productApiService,
            coreParserService,
            coreGridService,
            productConfigurableService,
            $uibModal,
            MEDIA_BASE_PATH
        ) {
            return {
                restrict: 'EA',
                scope: {
                    product: '=',
                    productScope: '=',
                    attributes: '='
                },
                templateUrl: '/views/product/directive/ot-product-configurations-manager.html',
                controller: function($scope) {
                    $scope.optionTypes = {
                        'select_text': 'Text boxes',
                        'select_image': 'Swatches',
                        'select': 'Dropdown'
                    };

                    $scope.canInitConfigurations = canInitConfigurations;
                    $scope.setupConfigurations = setupConfigurations;
                    $scope.loadAssociatedProducts = loadAssociatedProducts;

                    $scope.selectImage = selectImage;
                    $scope.getImagePath = getImagePath;

                    $scope.productsGrid = {};
                    $scope.configurable = {};
                    $scope.gridViewConfig = {
                        autoload: false,
                        isFiltersOpen: true,
                        forceSelection: true
                    };

                    activate();

                    ///////////////////////////////////////////////

                    function activate() {
                        var superOptionKeys = getSuperOptionsKeys($scope.product.options);
                        var hasConfigurations = superOptionKeys.length > 0;
                        $scope.hasConfigurations = hasConfigurations;
                        $scope.superOptions = {};

                        if (!hasConfigurations) {
                            var configurationAttributes = productConfigurableService.getConfigurableAttributes($scope.attributes);
                            _.forEach(configurationAttributes, function(attr) {
                                attr.type = 'select_text';
                                attr.controls_image = false;
                            });
                            $scope.configurationAttributes = configurationAttributes;
                            $scope.configurationsSetup = {};
                        } else {
                            _.forEach(superOptionKeys, function(key) {
                                $scope.superOptions[key] = $scope.product.options[key];
                            });
                            loadAssociatedProducts();
                        }
                    }

                    function canInitConfigurations() {
                        if ($scope.configurationsSetup.formCtrl.$invalid) return false;

                        var hasSelectedAttributes = false;
                        _.forEach($scope.configurationAttributes, function(attr) {
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
                        _.forEach(options, function(option, optionKey) {
                            if (option.has_associated_products) {
                                superOptionKeys.push(optionKey);
                            }
                        });

                        return superOptionKeys;
                    }

                    function setupConfigurations(configurationAttributes) {
                        _.forEach(configurationAttributes, function(attr, key) {
                            $scope.product.options[key] = {
                                key: key,
                                label: attr.label,
                                has_associated_products: true,
                                controls_inventory: true,
                                controls_image: attr.controls_image,
                                required: true,
                                type: attr.type,
                                options: {}
                            };
                            $scope.superOptions[key] = $scope.product.options[key];
                        });

                        $scope.hasConfigurations = true;
                        loadAssociatedProducts();
                    }

                    //////////////////////////

                    function selectImage(selection) {
                        $uibModal.open({
                            controller: 'productSelectImageController',
                            templateUrl: "/views/product/select-image.html",
                            size: 'lg',
                            resolve: {
                                product: function() {
                                    return $scope.product;
                                },
                                productScope: function() {
                                    return $scope.productScope;
                                }
                            }
                        }).result.then(
                            function (result) {
                                selection.image_name = result;
                            }
                        );
                    }

                    function getImagePath(mediaName) {
                        if (mediaName) {
                            return MEDIA_BASE_PATH + 'image/Product/' + $scope.product._id + '/' + mediaName;
                        } else return '';
                    }

                    function validateConfigurableOption(options) {
                        _.forEach(options, function(option) {
                            if (option.has_associated_products && !canHaveAssociatedProducts(option.key)) {
                                option.has_associated_products = false;
                            }
                        });
                    }

                    function loadAssociatedProducts() {
                        $scope.configurable = productConfigurableService.configurable($scope.attributes);
                        $scope.configurable.init($scope.superOptions);
                        initProductsGrid();
                    }

                    function hasConfigurableOptions() {
                        return !_.isEmpty($scope.configurable.options);
                    }

                    function getMaxOptionOrder(options) {
                        var result = 0;

                        _.each(options, function(option) {
                            if (option.label !== undefined) {
                                result = Math.max(result, option.order);
                            }
                        });

                        return result;
                    }

                    // Configurable product
                    //////////////////////////////////////////////////////////

                    /**
                     * Initialize associated products grid
                     */
                    function initProductsGrid() {
                        $scope.productsGrid = coreGridService.grid({
                            collection: 'product',
                            columns: $scope.configurable.getGridColumns(),
                            mapping: $scope.configurable.getGridMapping(),
                            multiSelect: true,
                            searchParams: { _selection: 'yes' },
                            selectedIds: $scope.configurable.getProductIdsFromOptions($scope.superOptions),
                            forcedFilters: { type: '!=configurable' }
                        });

                        var skipSelected = false;
                        $scope.productsGrid.on('rowCreated', function(event) {
                            var row = event.row;
                            row._link = 'products/' + row._id;
                            $scope.configurable.validateRow(row, $scope.superOptions, skipSelected);
                        });

                        $scope.productsGrid.on('afterSelect', function(event) {
                            var row = event.row;
                            if (event.selectionState === true) {
                                $scope.configurable.saveOptionsCombination(row);
                                $scope.configurable.addProductIdToOptions(row, $scope.superOptions);
                            } else {
                                $scope.configurable.removeOptionsCombination(row);
                                $scope.configurable.removeProductIdFromOptions(row, $scope.superOptions);
                            }

                            _.forEach(this.rows, function(row) {
                                $scope.configurable.validateRow(row, $scope.superOptions, true);
                            });

                            console.log($scope.configurable);
                        });

                        $scope.productsGrid.load({}).then(function() {
                            skipSelected = true;
                        });
                    }
                }
            };
        }]);
