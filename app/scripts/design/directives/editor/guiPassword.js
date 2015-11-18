angular.module("designModule")

.directive("guiPassword", ["$designService", function($designService) {
    return {
        restrict: "EA",
        scope: {
            "item": "=item"
        },
        templateUrl: $designService.getTemplate("design/gui/editor/password.html")
    };
}]);

