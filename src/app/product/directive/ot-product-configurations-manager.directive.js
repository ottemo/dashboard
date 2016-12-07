angular.module('productModule')

    .directive('otProductOptionsManager2', [
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
                templateUrl: '/views/product/directive/ot-product-options-manager2.html',
                controller: function($scope) {

                    $scope.optionTypes = [
                        'field',
                        'select',
                        'select_text',
                        'select_image',
                        'radio',
                        'multi_select',
                        'date'
                    ];

                    $scope.updateOptionsKeys = updateOptionsKeys;
                    $scope.changedOptionsLabels = changedOptionsLabels;
                    $scope.toJsonKey = toJsonKey;
                    $scope.cleanOption = cleanOption;
                    $scope.addRow = addRow;
                    $scope.removeOption = removeOption;
                    $scope.removeRow = removeRow;
                    $scope.newOption = newOption;

                    $scope.canHaveAssociatedProducts = canHaveAssociatedProducts;
                    $scope.reloadAssociatedProducts = reloadAssociatedProducts;
                    $scope.hasConfigurableOptions = hasConfigurableOptions;
                    $scope.adjustOptionFields = adjustOptionFields;

                    $scope.selectImage = selectImage;
                    $scope.getImagePath = getImagePath;

                    $scope.productsGrid = {};
                    $scope.gridViewConfig = {
                        autoload: false,
                        isFiltersOpen: true,
                        forceSelection: true
                    };
                    $scope.configurable = productConfigurableService.configurable($scope.attributes);

                    activate();

                    //////////////////////////

                    function activate() {
                        $scope.optionsData = $scope.product.options || {};
                        $scope.product.options =  $scope.optionsData;
                        $scope.isConfigurable = !_.isEmpty($scope.configurable.attributes) &&
                            $scope.product.type === 'configurable';

                        if ($scope.isConfigurable) {
                            reloadAssociatedProducts();
                        }
                    }

                    function adjustOptionFields(option) {
                        var notSelectOptionTypes = ['field', 'multi_select', 'date'];

                        if (notSelectOptionTypes.indexOf(option.type) !== -1) {
                            option.has_associated_products = false;
                        }

                        if (option.has_associated_products) {
                            option.required = true;
                            option.controls_inventory = true;
                        }

                        reloadAssociatedProducts();
                    }

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

                    function changedOptionsLabels(options, resetAssociatedProducts) {
                        updateOptionsKeys(options);
                        if ($scope.isConfigurable && resetAssociatedProducts) {
                            validateConfigurableOption(options);
                            reloadAssociatedProducts();
                        }
                    }

                    function validateConfigurableOption(options) {
                        _.forEach(options, function(option) {
                            if (option.has_associated_products && !canHaveAssociatedProducts(option.key)) {
                                option.has_associated_products = false;
                            }
                        });
                    }

                    function reloadAssociatedProducts() {
                        $scope.configurable = productConfigurableService.configurable($scope.attributes);
                        $scope.configurable.init($scope.optionsData);
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

                    /**
                     * Makes new snake cased keys from labels for all options and their child options
                     * So that options.<key> = option
                     * Where <key> is snake cased option.label
                     *
                     * Called recursively over options
                     *
                     * @param options
                     */
                    function updateOptionsKeys(options) {
                        for (var oldOptionKey in options) {

                            if (options.hasOwnProperty(oldOptionKey) && options[oldOptionKey]) {

                                var option = options[oldOptionKey];
                                var newOptionKey = toJsonKey(option.label);

                                if (newOptionKey && (oldOptionKey !== newOptionKey)) {
                                    options[newOptionKey] = options[oldOptionKey];
                                    delete options[oldOptionKey];
                                    options[newOptionKey].key = newOptionKey;
                                }

                                if (option.options) {
                                    var subOptions = option.options;

                                    // Calls itself recursively to update child options keys
                                    updateOptionsKeys(subOptions);
                                }
                            }
                        }
                    }

                    function toJsonKey(str) {
                        //'$' and '.' are illegal characters in mongoDB
                        return _.snakeCase(str).replace('$', 'd').replace('.', 'p');
                    }

                    function cleanOption(key) {
                        var optionsFields = ['label', 'type', 'required', 'order'];
                        var options = $scope.product.options[key];

                        // Disable inventory for unsupported option types
                        if (options.type === 'field' || options.type === 'multi_select' || options.type === 'date') {
                            options.controls_inventory = false;
                        }

                        for (var field in options) {
                            if (options.hasOwnProperty(field) && -1 === optionsFields.indexOf(field)) {
                                // TODO: for some period need ability switch to Radio and Checkbox without options loss
                                //delete options[field];
                            }
                        }
                        delete $scope.product.options[''];
                    }

                    function addRow(option) {
                        if (typeof $scope.optionsData[option] === 'undefined') {
                            return false;
                        }

                        updateOptionsKeys();

                        if (typeof $scope.optionsData[option].options === 'undefined') {
                            $scope.optionsData[option].options = {};
                        }

                        $scope.optionsData[option].options[''] = {
                            'order': (getMaxOptionOrder($scope.optionsData[option].options) + 1)
                        };
                    }

                    function removeOption(key) {
                        if (key === undefined) {
                            key = '';
                        }

                        delete $scope.optionsData[key];

                        updateOptionsKeys();
                        reloadAssociatedProducts();
                    }

                    function removeRow(option, key) {
                        if (typeof key === 'undefined') {
                            delete $scope.optionsData[option].options[''];

                            return true;
                        }

                        var row, options;
                        updateOptionsKeys();
                        options = $scope.optionsData[option].options;

                        for (row in options) {
                            if (options.hasOwnProperty(row)) {
                                if (row === key) {
                                    delete options[row];
                                    return true;
                                }
                            }
                        }

                        return false;
                    }

                    function newOption() {
                        if ($scope.optionsData['']) return;

                        $scope.optionsData[''] = {
                            'type': $scope.optionTypes[0],
                            'required': false,
                            'order': (getMaxOptionOrder($scope.optionsData) + 1)
                        };
                    }

                    // Configurable product
                    //////////////////////////////////////////////////////////

                    /**
                     * Check if product option can be configurable option
                     */
                    function canHaveAssociatedProducts(optionKey) {
                        return Boolean($scope.configurable.attributes[optionKey]);
                    }

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
                            selectedIds: $scope.configurable.getProductIdsFromOptions($scope.optionsData),
                            forcedFilters: { type: '!=configurable' }
                        });

                        var skipSelected = false;
                        $scope.productsGrid.on('rowCreated', function(event) {
                            var row = event.row;
                            row._link = 'products/' + row._id;
                            $scope.configurable.validateRow(row, $scope.optionsData, skipSelected);
                        });

                        $scope.productsGrid.on('afterSelect', function(event) {
                            var row = event.row;
                            if (event.selectionState === true) {
                                $scope.configurable.saveOptionsCombination(row);
                                $scope.configurable.addProductIdToOptions(row, $scope.optionsData);
                            } else {
                                $scope.configurable.removeOptionsCombination(row);
                                $scope.configurable.removeProductIdFromOptions(row, $scope.optionsData);
                            }

                            _.forEach(this.rows, function(row) {
                                $scope.configurable.validateRow(row, $scope.optionsData, true);
                            });
                        });

                        $scope.productsGrid.load({}).then(function() {
                            skipSelected = true;
                        });
                    }
                }
            };
        }])


        .filter('toArray', function() {
            return function(input) {
                return _.map(input, function(item, key) {
                    item.key = key;
                    return item;
                });
            }
        })

        .filter('getOrdered', function() {
            return function(input) {
                return _.sortBy(input, 'order');
            }
        });
