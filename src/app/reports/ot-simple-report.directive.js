angular.module('reportsModule')

.directive('otSimpleReport', [function() {
    return {
        restrict: 'E',
        scope: {
            'report': '=',
            'frame': '=',
        },
        templateUrl: '/views/reports/ot-simple-report.html',
        controller: function($scope) {
            $scope.percentWidth = percentWidth;

            ///////////////////

            function percentWidth(item) {
                return 100 * (item.total_sales / $scope.report.total_sales) + '%';
            }
        }
    };
}]);

