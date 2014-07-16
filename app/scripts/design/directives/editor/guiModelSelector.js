(function (define) {
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

        getParams = function (model, item) {
            var params;
            params = {}
            switch (model) {
                case "VisitorAddress":
                    params = {
                        "params": item._id,
                        "uri_1": "visitor",
                        "uri_2": "address"
                    }
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
            .directive("guiModelSelector", ["$designService", "$designApiService", function ($designService, $designApiService) {
                return {
                    restrict: "E",
                    templateUrl: $designService.getTemplate("design/gui/editor/modelSelector.html"),

                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },

                    controller: function ($scope) {

                        $scope.$watch("item", function () {
                            parseOptions($scope.attribute.Options);
                            var params = getParams(options.model, $scope.item);

                            if(params.hasOwnProperty("params") && typeof params.params === "undefined"){
                                return true;
                            }

                            $designApiService.attributesModel(params).$promise.then(
                                function (response) {
                                    var result = response.result || [];
                                    $scope.options = result;
                                });
                        });

                    }
                };
            }]);

        return designModule;
    });
})(window.define);