angular.module("productModule")

.directive("otCustomOptionsManager", [function () {
    return {
        restrict: "E",
        scope: {
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: "/views/product/directive/ot-custom-options-manager.html",

        controller: function ($scope) {
            var isInit = false;

            $scope.types = [
                "field",
                "select",
                "radio",
                "multi_select",
                "date"
            ];

            $scope.updateOptionsKeys = updateOptionsKeys;
            $scope.toJsonKey = toJsonKey;
            $scope.cleanOption = cleanOption;
            $scope.addRow = addRow;
            $scope.removeOption = removeOption;
            $scope.removeRow = removeRow;
            $scope.addNewOption = addNewOption;

            function getMaxOptionOrder(options) {
                var result = 0;

                if (options) {
                    for (var key in options) {
                        if (options.hasOwnProperty(key) && typeof options[key].label !== "undefined" && result < options[key].order) {
                            result = options[key].order;
                        }
                    }
                }

                return result;
            }

            function getOptions(opt) {
                var options;

                if (typeof $scope.item === "string") {
                    options = JSON.parse(opt.replace(/'/g, "\""));
                } else if (typeof opt === "undefined" || opt === null) {
                    options = {};
                } else {
                    options = opt;
                }

                return options;
            }

            function initData() {
                if (!isInit) {
                    $scope.optionsData = $scope.item[$scope.attribute.Attribute] = getOptions($scope.item[$scope.attribute.Attribute]);

                    isInit = true;
                }
            }

            function updateOptionsKeys(options) {
                // If called with empty params - use $scope.optonsData
                options = options || $scope.optionsData;
                
                for (var oldOptionKey in options) {
                    
                    if (options.hasOwnProperty(oldOptionKey) && options[oldOptionKey]) {
                        
                        var option = options[oldOptionKey];
                        var newOptionKey = toJsonKey(option.label);

                        if (option.options) {
                            var subOptions = option.options;

                            // Calls itself recursively to update child options
                            updateOptionsKeys(subOptions);
                        }

                        if (newOptionKey && oldOptionKey !== newOptionKey) {
                            console.log('new key', newOptionKey);
                            options[newOptionKey] = options[oldOptionKey];
                            delete options[oldOptionKey];
                        }
                    }
                }
            }

            function toJsonKey(str) {
                //'$' and '.' are illegal characters in mongoDB
                return _.snakeCase(str).replace('$', 'd').replace('.', 'p');
            }

            $scope.$watch("item", function () {
                if ($scope.item[$scope.attribute.Attribute] === undefined) {
                    $scope.optionsData = [];
                    return false;
                }
                if (isInit) {
                    return false;
                }
                initData();
                updateOptionsKeys();
            }, true);

            function cleanOption(key) {
                var optionsFields = ["label", "type", "required", "order"];
                var options = $scope.item.options[key];
                for (var field in options) {
                    if (options.hasOwnProperty(field) && -1 === optionsFields.indexOf(field)) {
                        // TODO: for some period need ability switch to Radio and Checkbox without options loss
                        //delete options[field];
                    }
                }
                delete $scope.item.options[""];
            }

            function addRow(option) {
                if (typeof $scope.optionsData[option] === "undefined") {
                    return false;
                }

                updateOptionsKeys();

                if (typeof $scope.optionsData[option].options === "undefined") {
                    $scope.optionsData[option].options = {};
                }

                $scope.optionsData[option].options[""] = {
                    "order": (typeof $scope.optionsData[option].options === "undefined" ? 0 : getMaxOptionOrder($scope.optionsData[option].options) + 1)
                };
            }

            function removeOption(key) {
                if (typeof key === "undefined") {
                    delete $scope.optionsData[""];

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
                if (typeof key === "undefined") {
                    delete $scope.optionsData[option].options[""];

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

                $scope.optionsData[""] = {
                    "type": $scope.types[0],
                    "required": false,
                    "order": (typeof $scope.optionsData === "undefined" ? 0 : getMaxOptionOrder($scope.optionsData) + 1)
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
