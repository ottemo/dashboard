(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiPrice", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },
                    templateUrl: $designService.getTemplate("design/gui/editor/text.html"),

                    controller: ["$scope", function ($scope) {

                        var priceRegExp = new RegExp("^\\d*\\.*\\d{0,2}$", "");

                        $scope.$watch("item", function (newVal, oldVal) {

                            if(typeof newVal[$scope.attribute.Attribute] === "undefined") {
                                newVal[$scope.attribute.Attribute] = "";
                            } else if (!priceRegExp.test(newVal[$scope.attribute.Attribute])) {
                                newVal[$scope.attribute.Attribute] = oldVal[$scope.attribute.Attribute];
                            }

                        }, true);
                    }]
                };
            }]);

        return designModule;
    });
})(window.define);