angular.module("designModule")

.directive("guiFilterRange", ["$designService", function($designService) {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: $designService.getTemplate("design/gui/filter/range.html"),

        controller: ["$scope", function($scope) {

            $scope.highInvalid = false;
            $scope.lowInvalid = false;
            $scope.low = "";
            $scope.high = "";
            var regExpNumber = /^\s*[0-9]*\s*$/;
            var isInit = false;

            var checkOnValid = function() {

                if (!regExpNumber.test($scope.low)) {
                    $scope.lowInvalid = true;
                } else {
                    $scope.lowInvalid = false;
                }

                if (!regExpNumber.test($scope.high)) {
                    $scope.highInvalid = true;
                } else {
                    $scope.highInvalid = false;
                }
            };

            $scope.submit = function() {
                var targetAttribute = $scope.attribute.Attribute;
                checkOnValid();

                if (!$scope.lowInvalid && !$scope.highInvalid) {
                    var newFilterValue = '';
                    $scope.low = $scope.low.trim();
                    $scope.high = $scope.high.trim();

                    if ($scope.low || $scope.high) {
                        newFilterValue = $scope.low + ".." + $scope.high;
                    }

                    $scope.item[targetAttribute] = newFilterValue
                    $scope.parent.newFilters[targetAttribute] = $scope.item[targetAttribute];
                }
            };

            $scope.$watch("item", function() {
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
                    $scope.high = values[2];
                    isInit = true;
                }

                $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute];

            }, true);
        }]
    };
}]);

