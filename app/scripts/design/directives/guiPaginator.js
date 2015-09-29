/**
 * getClass(page)
 * setPage(page)
 * getPages()
 */

angular.module("designModule")

.directive('guiPaginator', ['$location', '$designService', function ($location, $designService) {
    return {
        restrict: 'E',
        scope: {
            'parent': '=object'
        },
        templateUrl: $designService.getTemplate('design/gui/paginator.html'),
        controller: ["$scope",
            function ($scope) {
                
                var countNeighbors = 2;
                $scope.leftBreak = false;
                $scope.rightBreak = false;

                $scope.isNeighbors = function (page) {
                    return Math.abs($scope.parent.paginator.page - page) <= countNeighbors;
                };

                $scope.hasLeftBreak = function () {
                    return $scope.leftBreak;
                };

                $scope.hasRightBreak = function () {
                    return $scope.rightBreak;
                };


                $scope.$watch("parent.paginator.page", function () {
                    if (typeof $scope.parent.paginator === "undefined") {
                        return true;
                    }

                    var leftBorder = $scope.parent.paginator.page - countNeighbors;
                    var rightBorder = $scope.parent.paginator.page + countNeighbors;

                    if (leftBorder > 2 ) {
                        $scope.leftBreak = true;
                    }

                    if (rightBorder < $scope.parent.paginator.countPages - 1 ) {
                        $scope.rightBreak = true;
                    }

                }, true);
            }
        ]
    };
}]);
