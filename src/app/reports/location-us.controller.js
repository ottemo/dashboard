angular.module('reportsModule')

.controller('reportsLocationUSController', [
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
                    return reportsService.locationUS(options);
                })
                .then(function(report){
                    $scope.report = report;
                });
        }
    }
]);

