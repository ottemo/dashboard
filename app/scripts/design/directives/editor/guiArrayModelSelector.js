(function (define, $) {
    "use strict";

    define(["design/init"], function (designModule) {
        var options, parseOptions, getParams;
        options = {};

        /**
         * Transforms the options string into object
         * Example:
         *      in input - "model: Product; param_1: value_1"
         *      in output: {
         *          model: Product,
         *          param_1: value_1
         *      }
         *
         * @param {string} optionsStr
         * @returns {object}
         */
        parseOptions = function (optionsStr) {
            var i, optionsPairs, parts;
            optionsPairs = optionsStr.split(/[,;]+/i) || [];
            for (i = 0; i < optionsPairs.length; i += 1) {
                parts = optionsPairs[i].split(/[:=]+/i);
                options[parts[0].trim()] = parts[1].trim();
            }
            return options;
        };

        /**
         * Gets the parameters depending on the model
         *
         * @param {string} model
         * @param {object} item
         * @returns {object}
         */
        getParams = function (model, item) {
            var params;
            params = {};
            switch (model) {
                case "VisitorAddress":
                    params = {
                        "params": item._id,
                        "uri_1": "visitor",
                        "uri_2": "address"
                    };
                    break;
                default:
                    params = {
                        "uri_1": model
                    };
            }
            return params;
        };

        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiArrayModelSelector", [
                "$designService",
                "$designApiService",
                "$designImageService",
                function ($designService, $designApiService, $designImageService) {
                    return {
                        restrict: "E",
                        templateUrl: $designService.getTemplate("design/gui/editor/arrayModelSelector.html"),

                        scope: {
                            "attribute": "=editorScope",
                            "item": "=item"
                        },

                        controller: function ($scope) {
                            $scope.selection = [];
                            $scope.selected = [];

                            $scope.toggleSelection = function (id, name) {// jshint ignore:line
                                var parentScope, names, idx, isExist;
                                parentScope = $scope.item[$scope.attribute.Attribute];

                                if (typeof parentScope !== "undefined") {
                                    isExist = false;
                                    for (var i = 0; i < parentScope.length; i += 1) {
                                        if (typeof parentScope[i] === "object" && parentScope[i]._id === id) {
                                            isExist = true;
                                            idx = i;
                                        } else if (parentScope[i] === id) {
                                            isExist = true;
                                            idx = i;
                                        }
                                    }
                                } else {
                                    parentScope = [];
                                }

                                if (typeof $scope.selected !== "undefined") {
                                    names = $scope.selected.indexOf(name);
                                } else {
                                    $scope.selected = [];
                                }

                                if (isExist) {
                                    parentScope.splice(idx, 1);
                                } else {
                                    parentScope.push(id);
                                }

                                if (names > -1) {
                                    $scope.selected.splice(names, 1);
                                } else {
                                    $scope.selected.push(name);
                                }
                            };

                            /**
                             * Gets count items
                             *
                             * @returns {number}
                             */
                            $scope.getCountItems = function () {
                                var len = 0;
                                if (typeof $scope.item !== "undefined" &&
                                    typeof $scope.item[$scope.attribute.Attribute] !== "undefined" &&
                                    $scope.item[$scope.attribute.Attribute].length) {
                                    len = $scope.item[$scope.attribute.Attribute].length;
                                }
                                return len;
                            };

                            $scope.show = function (id) {
                                $("#" + id).modal("show");
                            };

                            $scope.hide = function (id) {
                                $("#" + id).modal("hide");
                            };

                            $scope.$watch("item", function () {
                                $scope.selection = [];
                                $scope.selected = [];

                                if (typeof $scope.item !== "undefined" && $scope.item._id) {

                                    for (var i = 0; i < $scope.item[$scope.attribute.Attribute].length; i += 1) {
                                        if (typeof $scope.item[$scope.attribute.Attribute] === "object") {

                                            $scope.selection.push($scope.item[$scope.attribute.Attribute][i]._id);
                                            $scope.selected.push($scope.item[$scope.attribute.Attribute][i].name);

                                        }
                                    }

                                }

                                parseOptions($scope.attribute.Options);

                                $designApiService.attributesModel(getParams(options.model, $scope.item)).$promise.then(
                                    function (response) {
                                        var result = response.result || [];
                                        $scope.items = result;
                                    });
                            });

                            /**
                             * Returns full path to image
                             *
                             * @param {string} path     - the destination path to product folder
                             * @param {string} image    - image name
                             * @returns {string}        - full path to image
                             */
                            $scope.getImage = function (image) {
                                return $designImageService.getFullImagePath("", image);
                            };

                        }
                    };
                }]);

        return designModule;
    });
})(window.define, jQuery);