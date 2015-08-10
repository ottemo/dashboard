angular.module("designModule")
/**
*  Directive used for automatic attribute editor creation
*/
.directive("guiHtml", ["$designService", function ($designService) {
    return {
        restrict: "E",
        scope: {
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: $designService.getTemplate("design/gui/editor/html.html")
    };
}]);