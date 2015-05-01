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
        templateUrl: $designService.getTemplate("design/gui/editor/html.html"),

        controller: ["$scope", function ($scope) {
            $scope.type = 'html';

            $scope.switchView = function (id, type) {
                var parent;
                if ('source' === type) {
                    document.getElementById(id).style.display = 'block';
                    parent = document.getElementById(id).parentNode;
                    parent.getElementsByTagName("div")[0].style.display = 'none';

                } else {
                    if ($scope.tinyInstance) {
                        $scope.tinyInstance.setContent(document.getElementById(id).value);
                    }
                    document.getElementById(id).style.display = 'none';
                    parent = document.getElementById(id).parentNode;
                    parent.getElementsByTagName("div")[0].style.display = 'block';
                }
                $scope.type = type;
            };

            $scope.isSource = function () {
                return 'source' === $scope.type;
            };

            $scope.isHtml = function () {
                return 'html' === $scope.type;
            };
        }]
    };
}]);