(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule

        /**
         *  Directive used for automatic attributes editor form creation
         *
         */
            .directive("guiFormBuilder", ["$designService", "$compile", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "parent": "=object",
                        "item": "=item",
                        "attributes": "=attributes"
                    },
                    templateUrl: $designService.getTemplate("design/gui/formBuilder.html"),
                    controller: ["$scope",
                        function () {
                        }
                    ]
                };
            }]);
        return designModule;
    });
})(window.define);
