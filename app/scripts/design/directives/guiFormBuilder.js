(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule

        /**
         *  Directive used for automatic attributes editor form creation
         *
         */
            .directive("guiFormBuilder", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "item": "=item",
                        "attributes": "=attributes"
                    },
                    templateUrl: $designService.getTemplate("design/gui/formBuilder.html"),
                    controller: function () {

                    }
                };
            }]);

        return designModule;
    });
})(window.define);
