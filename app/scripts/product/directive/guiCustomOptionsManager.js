(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {

        productModule

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
                        var normilizeJSON, getOptions;
                        $scope.priceTypes = ["fixed", "percent"];
                        $scope.types = ["field", "select", "multi_select"];
//                        $scope.optionsData = {
//                            "Color": {
//                                "label": "Color",
//                                "type": "select",
//                                "required": true,
//                                "order": 10,
//                                "sku_delim": ".",
//                                "options": {
//                                    "Blue": {
//                                        "label": "Blue",
//                                        "price": 10.0,
//                                        "price_type": "%",
//                                        "sku": "x1",
//                                        "order": 1
//                                    },
//                                    "Red": {
//                                        "label": "Red",
//                                        "sku": "RED"
//                                    },
//                                    "Black": {
//                                        "label": "Black"
//                                    }
//                                }
//                            },
//                            "Size": {
//                                "label": "Size",
//                                "type": "multi_select",
//                                "options": {
//                                    "XXL": {
//                                    },
//                                    "XL": {
//                                    },
//                                    "X": {
//                                        "label": "X",
//                                        "price": 25
//                                    }
//                                }
//                            },
//                            "Some": {
//                                "price": 10.0,
//                                "sku": "CUST",
//                                "type": "field"
//                            }
//                        };

                        $scope.optionsData = {};

                        normilizeJSON = function () {
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
                            } else if (typeof opt === "undefined") {
                                options = {};
                            } else {
                                options = opt;
                            }

                            return options;
                        };


                        $scope.$watch("optionsData",
                            function () {
                                var prepareOptions, option, list;
                                prepareOptions = function (list) {
                                    var opt;
                                    if (typeof list !== "undefined") {
                                        for (opt in list) {
                                            if (list.hasOwnProperty(opt) && (typeof list[opt].label === "undefined" || list[opt].label !== opt)) {
                                                {
                                                    if (typeof list[opt] !== "undefined" &&
                                                        typeof list[opt].label !== "undefined" &&
                                                        list[opt] !== "") {
                                                        list[list[opt].label] = list[opt];
                                                        delete list[opt];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    console.log(1)
                                };

                                for (option in $scope.optionsData) {


                                    if ($scope.optionsData.hasOwnProperty(option)) {

                                        if (typeof $scope.optionsData[option] !== "undefined" &&
                                            typeof $scope.optionsData[option].options !== "undefined") {
                                            list = $scope.optionsData[option].options;
                                            prepareOptions(list);
                                        }

                                    }

                                    if ($scope.optionsData.hasOwnProperty(option) && (typeof $scope.optionsData[option].label === "undefined" || $scope.optionsData[option].label !== option)) {

                                        if (typeof $scope.optionsData[option] !== "undefined" &&
                                            typeof $scope.optionsData[option].label !== "undefined" &&
                                            $scope.optionsData[option].label !== "" &&
                                            $scope.optionsData[option] !== "") {
                                            list = $scope.optionsData[option].options;
                                            prepareOptions(list);
                                            console.log(2)
                                            $scope.optionsData[$scope.optionsData[option].label] = $scope.optionsData[option];
                                            delete $scope.optionsData[option];
                                        }

                                    }
                                }
                            }, true
                        );

                        $scope.addOption = function (opt) {
                            if (typeof $scope.optionsData[opt].options === "undefined") {
                                $scope.optionsData[opt].options = {};
                            }
                            $scope.optionsData[opt].options[""] = {};
                        };

                        $scope.addNewOption = function () {
                            $scope.optionsData[""] = {};
                        };

                        $scope.$watch("item", function () {
                            if (typeof $scope.item === "undefined") {
                                return false;
                            }
                            $scope.optionsData = getOptions($scope.item[$scope.attribute.Attribute]);
                            normilizeJSON();
                        }, true);
                    }
                };
            }]
        );

        return productModule;
    });

})(window.define);
