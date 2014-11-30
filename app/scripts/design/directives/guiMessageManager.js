(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        designModule.directive("guiMessageManager", ["$designService", "$timeout", function ($designService, $timeout) {
            return {
                restrict: "E",
                scope: {
                    "obj": "=item"
                },
                templateUrl: $designService.getTemplate("design/gui/guiMessageManager.html"),
                link: function ($scope) {
                    var timeout;
                    $scope.isShow = false;
                    $scope.$watch("obj", function () {

                        if (typeof $scope.obj !== "undefined") {

                            $scope.msg = $scope.obj.message;
                            $scope.type = $scope.obj.type || "success";
                            $scope.isShow = true;
                            timeout = $scope.obj.timeout;

                            if(timeout > 0) {
                                $timeout(function () {
                                    $scope.close();
                                }, 2000);
                            }
                        }

                    });

                    $scope.close = function () {
                        $scope.isShow = false;
                        $scope.msg = false;
                    };

                }
            };
        }]);

        return designModule;
    });
})(window.define);
