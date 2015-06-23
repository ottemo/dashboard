angular.module("productModule")

.directive("guiCustomOptionsManager", ["$designService", function ($designService) {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: $designService.getTemplate("product/gui/custom_options_manager.html"),
        controller: function ($scope) {
            var isInit, initData, modifyData, normalizeJSON, getOptions, getOptionLength, cloneRow;

            isInit = false;

            $scope.types = [
                "field",
                "select",
                "multi_select",
				"radio",
				"checkbox"
            ];

            getOptionLength = function (obj) {
                var result = 0;

                if (typeof obj !== "undefined") {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key) && typeof obj[key].label !== "undefined" && result < obj[key].order) {
                            result = obj[key].order;
                        }
                    }
                }

                return result;
            };

            normalizeJSON = function () {
                var prepareOptions = function (list) {
                    if (typeof list !== "undefined") {
                        for (var opt in list) {
                            if (list.hasOwnProperty(opt) &&
                                (typeof list[opt].label === "undefined" ||
                                    list[opt].label !== opt)) {
                                {
                                    list[opt].label = opt;
                                }
                            }
                        }
                    }
                };
                for (var option in $scope.optionsData) {
                    if ($scope.optionsData.hasOwnProperty(option)) {
                        if (typeof $scope.optionsData[option].label === "undefined" ||
                            $scope.optionsData[option].label !== option) {
                            $scope.optionsData[option].label = option;
                        }
                        var list = $scope.optionsData[option].options;
                        prepareOptions(list);
                    }
                }
            };

            getOptions = function (opt) {
                var options;

                if (typeof $scope.item === "string") {
                    options = JSON.parse(opt.replace(/'/g, "\""));
                } else if (typeof opt === "undefined" || opt === null) {
                    options = {};
                } else {
                    options = opt;
                }

                return options;
            };

            initData = function () {
                if (!isInit) {
                    $scope.optionsData = $scope.item[$scope.attribute.Attribute] = getOptions($scope.item[$scope.attribute.Attribute]);
                    normalizeJSON();
                    isInit = true;
                }
            };

            modifyData = function () {
                var option, list, saveOrderIfGluing;

                saveOrderIfGluing = function (obj1, obj2) {
                    if (typeof obj2 !== "undefined") {
                        obj1.order = obj2.order;
                    }
                };

                for (option in $scope.optionsData) {
                    if ($scope.optionsData.hasOwnProperty(option) && typeof $scope.optionsData[option] !== "undefined") {

                        if (typeof $scope.optionsData[option].options !== "undefined") {
                            list = $scope.optionsData[option].options;
                            cloneRow(list);
                        }

                        if (typeof $scope.optionsData[option].label !== "undefined" &&
                            $scope.optionsData[option].label !== "" &&
                            $scope.optionsData[option].label !== option &&
                            $scope.optionsData[option] !== "") {

                            saveOrderIfGluing($scope.optionsData[option], $scope.optionsData[$scope.optionsData[option].label]);

                            $scope.optionsData[$scope.optionsData[option].label] = $scope.optionsData[option];

                            delete $scope.optionsData[option];
                        }

                    }
                }
            };

            $scope.$watch("item", function () {
                if (typeof $scope.item[$scope.attribute.Attribute] === "undefined") {
                    $scope.optionsData = [];
                    return false;
                }
                if (isInit) {
                    return false;
                }
                initData();
                modifyData();
            }, true);

            cloneRow = function (list) {
                var opt;

                var copy = function (opt) {
                    if (typeof list[list[opt].label] !== "undefined") {
                        list[opt].order = list[list[opt].label].order;
                    }

                    list[list[opt].label] = list[opt];
                    delete list[opt];
                };

                for (opt in list) {
                    if (list.hasOwnProperty(opt) && (typeof list[opt].label === "undefined" || list[opt].label !== opt)) {
                        if (typeof list[opt] !== "undefined" &&
                            typeof list[opt].label !== "undefined" &&
                            list[opt] !== "" &&
                            list[opt].label !== "order") {
                            copy(opt);
                        }
                    }
                }
            };

            $scope.cleanOption = function (label) {
                var optionsFields = ["label", "type", "required", "order"];
                var options = $scope.item.options[label];
                for (var field in options) {
                    if (options.hasOwnProperty(field) && -1 === optionsFields.indexOf(field)) {
						// TODO: for some period need ability switch to Radio and Checkbox without options loss
                        //delete options[field];
                    }
                }
                delete $scope.item.options[""];
            };

            $scope.addRow = function (option) {

                if (typeof $scope.optionsData[option] === "undefined") {
                    return false;
                }
                modifyData();
                if (typeof $scope.optionsData[option].options === "undefined") {
                    $scope.optionsData[option].options = {};
                }

                $scope.optionsData[option].options[""] = {
                    "order": (typeof $scope.optionsData[option].options === "undefined" ? 0 : getOptionLength($scope.optionsData[option].options) + 1)
                };
            };

            $scope.removeOption = function (key) {
                if (typeof key === "undefined") {
                    delete $scope.optionsData[""];

                    return true;
                }

                var option;
                modifyData();

                for (option in $scope.optionsData) {
                    if ($scope.optionsData.hasOwnProperty(option)) {
                        if (option === key) {
                            delete $scope.optionsData[option];
                            return true;
                        }
                    }
                }

                return false;
            };

            $scope.removeRow = function (option, key) {
                if (typeof key === "undefined") {
                    delete $scope.optionsData[option].options[""];

                    return true;
                }

                var row, options;
                modifyData();
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

            };

            $scope.modifyData = function () {
                modifyData();
            };

            $scope.addNewOption = function () {
                modifyData();

                $scope.optionsData[""] = {
                    "type": $scope.types[0],
                    "required": false,
                    "order": (typeof $scope.optionsData === "undefined" ? 0 : getOptionLength($scope.optionsData) + 1)
                };
            };
        }
    };
}])


.filter('getOrdered', function () {
    return function (input) {
        var ordered = {};
        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                ordered[input[key].order] = input[key];
            }
        }

        return ordered;
    };
});
