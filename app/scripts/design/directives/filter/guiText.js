(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiFilterText", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "parent": "=object",
                        "attribute": "=editorScope",
                        "item": "=item"
                    },
                    templateUrl: $designService.getTemplate("design/gui/filter/text.html"),

                    controller: ["$scope",
                        function ($scope) {
                            var isInit = false;

                            $scope.submit = function () {
                                $scope.parent.newFilters[$scope.attribute.Attribute.toLowerCase()] = $scope.item[$scope.attribute.Attribute].split(" ");
                                $scope.item[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(" ", ",");

                                isInit = false;
                            };

                            $scope.$watch("item", function () {
                                if (typeof $scope.item === "undefined") {
                                    return false;
                                }
                                if (isInit || typeof $scope.item[$scope.attribute.Attribute] === "undefined") {
                                    return false;
                                }

                                $scope.item[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(/~/g, "").replace(/,/g, " ");
                                $scope.parent.newFilters[$scope.attribute.Attribute.toLowerCase()] = $scope.item[$scope.attribute.Attribute].split(" ");
                                isInit = true;

                            }, true);
                        }
                    ]
                };
            }]);

        return designModule;
    });
})(window.define);