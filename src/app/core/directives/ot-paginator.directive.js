/**
 * getClass(page)
 * setPage(page)
 * getPages()
 */
angular.module('coreModule')

.directive('otPaginator', ['$location', function($location) {
    return {
        restrict: 'E',
        scope: {
            'parent': '=object'
        },
        templateUrl: '/views/core/directives/paginator.html',
        controller: ['$scope', function($scope) {

            var countNeighbors = 4;
            $scope.leftBreak = false;
            $scope.rightBreak = false;

            $scope.isNeighbors = function(page) {
                return Math.abs($scope.parent.paginator.page - page) <= countNeighbors;
            };

            $scope.$watch('parent.paginator.page', function() {
                if (typeof $scope.parent.paginator === 'undefined') {
                    return true;
                }

                var leftBorder = $scope.parent.paginator.page - countNeighbors;
                var rightBorder = $scope.parent.paginator.page + countNeighbors;

                if (leftBorder > 2) {
                    $scope.leftBreak = true;
                }

                if (rightBorder < $scope.parent.paginator.countPages - 1) {
                    $scope.rightBreak = true;
                }

            }, true);
        }]
    };
}]);

