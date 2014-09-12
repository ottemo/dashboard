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
                        var isInit, normalizeJSON, getOptions;

                        isInit = false;

                        $scope.priceTypes = [
                            "fixed",
                            "percent"
                        ];
                        $scope.types = [
                            "field",
                            "select",
                            "multi_select"
                        ];

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

                        $scope.$watch("optionsData",
                            function () {
                                var option, list;
if(typeof $scope.item[$scope.attribute.Attribute] === "undefined"){
    return false;
}
                                if (!isInit) {
                                    $scope.optionsData = $scope.item[$scope.attribute.Attribute] = getOptions($scope.item[$scope.attribute.Attribute]);
                                    normalizeJSON();
                                    isInit = true;
                                }

                                for (option in $scope.optionsData) {
                                    if ($scope.optionsData.hasOwnProperty(option)) {

                                        if (typeof $scope.optionsData[option] !== "undefined" &&
                                            typeof $scope.optionsData[option].options !== "undefined") {
                                            list = $scope.optionsData[option].options;
                                            cloneRow(list);
                                        }

                                        if (typeof $scope.optionsData[option].label === "undefined" || $scope.optionsData[option].label !== option) {

                                            if (typeof $scope.optionsData[option] !== "undefined" &&
                                                typeof $scope.optionsData[option].label !== "undefined" &&
                                                $scope.optionsData[option].label !== "" &&
                                                $scope.optionsData[option] !== "") {
                                                list = $scope.optionsData[option].options;

                                                cloneRow(list);

                                                $scope.optionsData[$scope.optionsData[option].label] = $scope.optionsData[option];
                                                delete $scope.optionsData[option];
                                            }

                                        }
                                    }
                                }
                            },
                            true
                        );


                        var cloneRow = function (list) {
                            var opt;

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
                        };

                        $scope.addRow = function (option) {

                            if (typeof $scope.optionsData[option] === "undefined") {
                                return false;
                            }
                            if (typeof $scope.optionsData[option].options === "undefined") {
                                $scope.optionsData[option].options = {};
                            }

                            $scope.optionsData[option].options[""] = {
                                "order": (typeof $scope.optionsData[option].options === "undefined" ? 0 : $scope.optionsData[option].options.length + 1)
                            };
                        };


                        $scope.removeOption = function (key) {
                            if (typeof key === "undefined") {
                                delete $scope.optionsData[""];

                                return true;
                            }

                            var option;

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

                        $scope.addNewOption = function () {
                            $scope.optionsData[""] = {};
                        };
                    }
                };
            }]
        );

        return productModule;
    });

})(window.define);
