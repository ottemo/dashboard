angular.module('productModule')

    .directive('otProductOptionsManager', ['_', function (_) {
            return {
                restrict: 'E',
                scope: {
                    'attribute': '=editorScope',
                    'product': '=',
                    'productScope': '='
                },
                templateUrl: '/views/product/directive/ot-product-options-manager.html',

                controller: function ($scope) {
                    var isInit = false;

                    $scope.types = [
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
                    $scope.addNewOption = addNewOption;

                    activate();

                    //////////////////////////

                    function activate() {
                        if ($scope.product.options == null) {
                            $scope.product.options = {};
                        }

                        $scope.optionsData = {};
                        _.forEach($scope.product.options, function(option) {
                            if (!option.has_associated_products) {
                                $scope.optionsData[option.key] = option;
                            }
                        });
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
                        options = options || $scope.optionsData;

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
                        var options = $scope.optionsData[key];

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

                    function addNewOption() {
                        if ($scope.optionsData['']) return;

                        $scope.optionsData[''] = {
                            'type': $scope.types[0],
                            'required': false,
                            'order': (getMaxOptionOrder($scope.optionsData) + 1)
                        };
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
