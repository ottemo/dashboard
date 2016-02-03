angular.module("designModule")
/**
*  Directive used for automatic attributes editor form creation
*
*/
.directive("guiFormBuilder", ["$designService", function ($designService) {
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