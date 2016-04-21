angular.module('reportsModule')

.controller('reportsCustomerActivityController', [
    '$scope', 'timezoneService', 'reportsService', '$location',
    function($scope, timezoneService, reportsService, $location) {
        $scope.report = {};
        $scope.timeframe = {
            frame: 'last 7 days',
            options: [
                'today',
                'last 7 days',
                'month to date',
                'year to date',
                'all time',
            ],
            set: setTimeframe,
        };
        $scope.sort = $location.search().sort || '';

        activate();

        ////////////////////

        function activate(){
            fetchReport($scope.timeframe.frame);
        }

        function setTimeframe(frame) {
            $scope.timeframe.frame = frame;
            fetchReport(frame);
        }

        function fetchReport(frame) {
            timezoneService.makeDateRange(frame)
                .then(function(options) {
                    options.sort = $scope.sort;
                    return reportsService.customerActivity(options);
                })
                .then(function(report){
                    $scope.report = report;
                });
        }
    }
]);

