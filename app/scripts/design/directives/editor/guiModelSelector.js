(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
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
                        var getParams;

                        getParams = function (model) {
                            var params;
                            params = {}
                            switch (model) {
                                case "VisitorAddress":
                                    params = {
                                        "visitorId": $scope.item._id
                                    }
                                    break;
                                default:
                                    params = {};
                            }
                            return params;
                        }

                        $scope.$watch("item", function () {
                            var options, parseOptions;
                            options = {};

                            parseOptions = function () {
                                var i, optionsPairs, parts;
                                optionsPairs = $scope.attribute.Options.split(/[,;]+/i) || [];
                                for (i = 0; i < optionsPairs.length; i += 1) {
                                    parts = optionsPairs[i].split(/[:=]+/i);
                                    options[parts[0].trim()] = parts[1].trim();
                                }
                                return options;
                            };

                            parseOptions();

                            $designApiService.buildUrl("/visitor/address");
                            $designApiService.resources.attributesModel(getParams(options.model)).$promise.then(
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