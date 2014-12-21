(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
            /**
             *  Directive used for automatic attribute editor creation
             */
            .directive("guiMultilineText", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },
                    templateUrl: $designService.getTemplate("design/gui/editor/multilineText.html"),

                    controller: ["$scope", function() {

                    }]
                };
            }]);

        return designModule;
    });
})(window.define);