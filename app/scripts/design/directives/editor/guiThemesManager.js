(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiThemesManager", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },
                    templateUrl: $designService.getTemplate("design/gui/editor/themesManager.html"),

                    controller: ["$scope", function ($scope) {
                        var getOptions;
                        $scope.items = [];
                        $scope.activeTheme = $scope.item['themes.list.active'];

                        getOptions = function (opt) {
                            var options;

                            if (typeof $scope.attribute.Options === "string") {
                                options = JSON.parse(opt.replace(/'/g, "\""));
                            } else {
                                options = opt;
                            }

                            return options;
                        };

                        $scope.$watch("attribute", function () {
                            var options;

                            if (typeof $scope.attribute === "undefined") {
                                return false;
                            }

                            options = getOptions($scope.attribute.Options);
                            $scope.themes = options;
                        }, true);
                    }]
                };
            }]);

        return designModule;
    });
})(window.define);