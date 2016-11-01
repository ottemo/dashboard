angular.module('productModule')

    .directive('otProductOptionsManager', [
        '_',
        'productApiService',
        'coreParserService',
        'coreGridService',
        'productConfigurableService',
        function (
            _,
            productApiService,
            coreParserService,
            coreGridService,
            productConfigurableService
        ) {
            return {
                restrict: 'EA',
                scope: {
                    product: '=',
                    productScope: '=',
                    attributes: '='
                },
                templateUrl: '/views/product/directive/ot-product-options-manager.html',
                controller: function($scope) {

                    $scope.optionTypes = [
                        'field',
                        'select',
                        'radio',
                        'multi_select',
                        'date'
                    ];

                    $scope.updateOptionsKeys = updateOptionsKeys;
                    $scope.toJsonKey = toJsonKey;
                    $scope.cleanOption = cleanOption;
                    $scope.addRow = addRow;
                    $scope.removeOption = removeOption;
                    $scope.removeRow = removeRow;
                    $scope.newOption = newOption;

                    $scope.productsGrid = {};
                    $scope.gridViewConfig = {
                        autoload: false,
                        isFiltersOpen: true
                    };
                    $scope.configurable = productConfigurableService.configurable($scope.attributes);

                    activate();

                    //////////////////////////

                    function activate() {
                        $scope.optionsData = $scope.product.options;
                        $scope.isConfigurable = !_.isEmpty($scope.configurable.attributes) &&
                            $scope.product.type === 'configurable';

                        if ($scope.isConfigurable) {
                            //$scope.isProductsUnfolded = false;
                            $scope.configurable.init($scope.optionsData);
                            initProductsGrid();
                        }
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
                        // If called with empty params - use $scope.optionsData
                        options = options || $scope.optionsData;

                        for (var oldOptionKey in options) {

                            if (options.hasOwnProperty(oldOptionKey) && options[oldOptionKey]) {

                                var option = options[oldOptionKey];
                                var newOptionKey = toJsonKey(option.label);

                                if (newOptionKey && (oldOptionKey !== newOptionKey)) {
                                    options[newOptionKey] = options[oldOptionKey];
                                    delete options[oldOptionKey];
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
                        if (options.type !== 'select' && options.type !== 'radio') {
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
                    $scope.canHaveAssociatedProducts = function(optionKey) {
                        return Boolean($scope.configurable.attributes[optionKey]);
                    };

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

                        $scope.productsGrid.on('rowCreated', function(event) {
                            var row = event.row;
                            if (row._selected) {
                                $scope.configurable.saveOptionsCombination(row);
                            } else {
                                $scope.configurable.validateRow(row);
                            }

                            row._link = '/abc';
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
                                $scope.configurable.validateRow(row);
                            });
                        });

                        $scope.productsGrid.load({});
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
