(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        designModule.directive("guiMessageManager", ["$designService", function ($designService) {
            return {
                restrict: "E",
                scope: {
                    "obj": "=item"
                },
                templateUrl: $designService.getTemplate("design/gui/guiMessageManager.html"),
                controller: function ($scope) {

                    $scope.$watch("obj", function () {

                        if (typeof $scope.obj !== "undefined") {

                            $scope.msg = $scope.obj.message;
                            $scope.type = $scope.obj.type || "success";
                        }

                    });

                    $scope.close = function () {
                        $scope.msg = "";
                    };

                }
            };
        }]);

        return designModule;
    });
})(window.define);
