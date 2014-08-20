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
                        $scope.options = [];
                        $scope.$watch("item", function () {
                            var options, field;
                            options = JSON.parse($scope.attribute.Options.replace(/'/g, "\""));
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
                        });

                    }
                };
            }]);

        return designModule;
    });
})(window.define);