angular.module("designModule")
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

            var init;

            init = function () {
                if (typeof $scope.attribute === "undefined" ||
                    typeof $scope.item === "undefined") {
                    return false;
                }

                if (typeof $scope.item[$scope.attribute.Attribute] === "boolean") {
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
                } else {
                    $scope.options = [
                        {
                            Desc: "",
                            Extra: null,
                            Id: "false",
                            Image: "",
                            Name: "false"
                        },
                        {
                            Desc: "",
                            Extra: null,
                            Id: "true",
                            Image: "",
                            Name: "true"
                        }
                    ];
                }
            };

            $scope.$watch("item", init);
            $scope.$watch("attribute", init);
        }
    };
}]);