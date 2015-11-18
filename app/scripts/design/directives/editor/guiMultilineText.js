angular.module("designModule")
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
        templateUrl: $designService.getTemplate("design/gui/editor/multilineText.html")
    };
}]);