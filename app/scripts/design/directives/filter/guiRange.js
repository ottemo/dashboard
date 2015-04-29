angular.module("designModule")
/**
*  Directive used for automatic attribute editor creation
*/
.directive("guiFilterRange", ["$designService", function ($designService) {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: $designService.getTemplate("design/gui/filter/range.html"),

        controller: ["$scope", function ($scope) {

            $scope.hightInvalid = false;
            $scope.lowInvalid = false;
            $scope.low = "";
            $scope.hight = "";
            var regExpNumber = /^\s*[0-9]*\s*$/;
            var isInit = false;

            var checkOnValid = function () {

                if (!regExpNumber.test($scope.low)) {
                    $scope.lowInvalid = true;
                } else {
                    $scope.lowInvalid = false;
                }

                if (!regExpNumber.test($scope.hight)) {
                    $scope.hightInvalid = true;
                } else {
                    $scope.hightInvalid = false;
                }
            };

            $scope.submit = function () {

                checkOnValid();

                if (!$scope.lowInvalid && !$scope.hightInvalid) {
                    $scope.low = $scope.low.trim();
                    $scope.hight = $scope.hight.trim();
                    if ("" === $scope.low && "" === $scope.hight) {
                        $scope.item[$scope.attribute.Attribute] = "";
                        $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute];
                    } else {
                        $scope.item[$scope.attribute.Attribute] = ($scope.low || "") + ".." + ($scope.hight || "");
                        $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute];
                    }

                }
            };

            $scope.$watch("item", function () {
                if (typeof $scope.item === "undefined") {
                    return false;
                }
                if (isInit || typeof $scope.item[$scope.attribute.Attribute] === "undefined") {
                    return false;
                }

                var value = $scope.item[$scope.attribute.Attribute];
                var regExp = new RegExp("(\\d*)\\.\\.(\\d*)$", "i");
                var values = value.match(regExp);
                if (null !== values) {
                    $scope.low = values[1];
                    $scope.hight = values[2];
                    isInit = true;
                }

                $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute];

            }, true);
        }]
    };
}]);