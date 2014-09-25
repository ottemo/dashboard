(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiBoolean", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    templateUrl: $designService.getTemplate("design/gui/editor/select.html"),

                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },

                    controller: function ($scope) {

                        $scope.$watch("item", function () {
                            $scope.options = [
                                {
                                    Desc: "",
                                    Extra: null,
                                    Id: false,
                                    Image: "",
                                    Name: "false"
                                },
                                {
                                    Desc: "",
                                    Extra: null,
                                    Id: true,
                                    Image: "",
                                    Name: "true"
                                }
                            ];
                        });

                    }
                };
            }]);

        return designModule;
    });
})(window.define);