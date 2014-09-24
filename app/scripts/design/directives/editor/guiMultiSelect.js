(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiMultiSelect", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    templateUrl: $designService.getTemplate("design/gui/editor/multi-select.html"),

                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },

                    controller: function ($scope) {
                        var isInit = false;
                        $scope.options = [];

                        $scope.$watch("item", function () {
                            if (isInit) {
                                return false;
                            }
                            var getOptions, options, field;

                            $scope.options = [];

                            getOptions = function (opt) {
                                var options;

                                if (typeof $scope.attribute.Options === "string") {
                                    options = JSON.parse(opt.replace(/'/g, "\""));
                                } else {
                                    options = opt;
                                }

                                return options;
                            };

                            options = getOptions($scope.attribute.Options);

                            for (field in options) {
                                if (options.hasOwnProperty(field)) {
                                    $scope.options.push({
                                        Desc: "",
                                        Extra: null,
                                        Id: field,
                                        Image: "",
                                        Name: options[field]
                                    });
                                }
                            }
                            if (typeof $scope.item[$scope.attribute.Attribute] === "string") {
                                $scope.item[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].split(",");
                            }
                            isInit = true;
                        });

                    }
                };
            }]);

        return designModule;
    });
})(window.define);