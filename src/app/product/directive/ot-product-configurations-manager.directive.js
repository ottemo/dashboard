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
                    $scope.configurationsSetup = {};
                    $scope.gridViewConfig = {
                        autoload: false,
                        isFiltersOpen: true,
                        forceSelection: true
                    };

                    activate();

                    ///////////////////////////////////////////////

                    function activate() {
                        var superOptionKeys = getSuperOptionsKeys($scope.product.options);
                        var superAttributes = productConfigurableService.getSuperAttributes($scope.attributes);

                        _.forEach(superAttributes, function(attr, attrKey) {
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
                        _.forEach(superOptionKeys, function(key) {
                            $scope.superOptions[key] = $scope.product.options[key];
                        });

                        if (hasConfigurations) {
                            loadAssociatedProducts();
                        }
                    }

                    function canInitConfigurations() {
                        if ($scope.configurationsSetup.formCtrl.$invalid) return false;

                        var hasSelectedAttributes = false;
                        _.forEach($scope.superAttributes, function(attr) {
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

                    function setupConfigurations(superAttributes) {
                        $scope.superOptions = {};
                        _.forEach(superAttributes, function(attr, key) {
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

                    function loadAssociatedProducts() {
                        $scope.configurable = productConfigurableService.configurable($scope.attributes);
                        $scope.configurable.init($scope.superOptions);
                        initProductsGrid();
                    }

                    // Configurable product
                    //////////////////////////////////////////////////////////

                    /**
                     * Initialize associated products grid
                     */
                    function initProductsGrid() {
                        var selectedIds = $scope.configurable.getProductIdsFromOptions($scope.superOptions);
                        $scope.productsGrid = coreGridService.grid({
                            collection: 'product',
                            columns: $scope.configurable.getGridColumns(),
                            mapping: $scope.configurable.getGridMapping(),
                            multiSelect: true,
                            searchParams: (selectedIds.length > 0) ? { _selection: 'yes' } : {},
                            selectedIds: selectedIds,
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
                                $scope.configurable.saveProductIdInSuperOptions(row, $scope.superOptions);
                            } else {
                                $scope.configurable.removeOptionsCombination(row);
                                $scope.configurable.removeProductIdFromOptions(row, $scope.superOptions);
                            }

                            _.forEach(this.rows, function(row) {
                                $scope.configurable.validateRow(row, $scope.superOptions, true);
                            });
                        });

                        $scope.productsGrid.load({ getCount: true }).then(function() {
                            skipSelected = true;
                        });
                    }
                }
            };
        }]);
