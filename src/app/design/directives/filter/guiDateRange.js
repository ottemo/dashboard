angular.module("designModule")

.directive("guiFilterDateRange", ["$designService", function($designService) {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: $designService.getTemplate("design/gui/filter/dateRange.html"),

        controller: ["$scope", function($scope) {
            $scope.highInvalid = false;
            $scope.lowInvalid = false;
            $scope.low;
            $scope.high;
            var isInit = false;

            $scope.submit = function() {
                var targetAttribute = $scope.attribute.Attribute;
                var newFilterValue = '';

                $scope._low = $scope.low ? Math.round($scope.low / 1000) : '';
                $scope._high = $scope.high ? Math.round($scope.high / 1000) : '';

                if ($scope._low || $scope._high) {
                    newFilterValue = $scope._low + ".." + $scope._high;
                }

                $scope.item[targetAttribute] = newFilterValue;
                $scope.parent.newFilters[targetAttribute] = $scope.item[targetAttribute];
            }

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
                    $scope.low = new Date(values[1] * 1000);
                    $scope.high = new Date(values[2] * 1000);
                    isInit = true;
                }

                $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute];

            }, true);

        }]
    }
}]);

