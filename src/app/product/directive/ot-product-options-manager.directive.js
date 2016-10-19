angular.module('productModule')

.directive('otProductOptionsManager', ['_', 'productApiService', function (_, productApiService) {
    return {
        restrict: 'E',
        scope: {
            'product': '=',
            'productScope': '='
        },
        templateUrl: '/views/product/directive/ot-product-options-manager.html',

        controller: function ($scope) {
            var vm = this;
            $scope.self = $scope;

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
            $scope.productAttributes = [];

            activate();

            //////////////////////////

            function activate() {
                productApiService.attributesInfo().$promise
                    .then(function(response) {
                        if (response.error === null) {
                            var attributes = response.result || [];
                            $scope.layeredAttributes = _.filter(attributes, function(attribute) {
                                return attribute.IsLayered && isTypeArray(attribute.Type);
                            });
                        }
                    });

                var productOptions = parseOptions($scope.product.options);
                $scope.product.options = productOptions;
                $scope.optionsData = productOptions;
            }

            function isTypeArray(type) {
                return type.indexOf('[]') === 0;
            }

            function getMaxOptionOrder(options) {
                var result = 0;

                if (options) {
                    _.each(options, function(option) {
                       if (option.label !== undefined) {
                           result = Math.max(result, option.order);
                       }
                    });
                }

                return result;
            }

            function parseOptions(opt) {
                var options;

                if (typeof $scope.product === 'string') {
                    options = JSON.parse(opt.replace(/'/g, '\''));
                } else if (typeof opt === 'undefined' || opt === null) {
                    options = {};
                } else {
                    options = opt;
                }

                return options;
            }

            function initData() {

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

                        if (newOptionKey && oldOptionKey !== newOptionKey) {
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
                console.log('remove options');

                if (typeof key === 'undefined') {
                    delete $scope.optionsData[''];

                    return true;
                }

                updateOptionsKeys();

                for (var option in $scope.optionsData) {
                    if ($scope.optionsData.hasOwnProperty(option)) {
                        if (option === key) {
                            delete $scope.optionsData[option];
                            return true;
                        }
                    }
                }

                return false;
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
                updateOptionsKeys();

                $scope.optionsData[''] = {
                    'type': $scope.types[0],
                    'required': false,
                    'order': (getMaxOptionOrder($scope.optionsData) + 1)
                };
            }
            
            vm.canHaveAssociatedProducts = function(optionKey) {
                
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
