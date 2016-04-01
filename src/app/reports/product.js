angular.module('reportsModule')

.controller('reportsProductController', [
    '$scope',
    'reportsService',
    'timezoneService',
    'moment',
    function($scope, reportsService, timezoneService, moment) {
        $scope.report = {};
        $scope.timeframe = {
            frame: 'today',
            options: [          // Support is bound to what timezone.js can parse
                'today',
                'yesterday',
                'last 7 days',
                'last 30 days',
            ],
            isOpen: false,
            set: setTimeframe,
            toggle: toggle,
        }

        activate();

        /////////////////////////////////

        function activate() {
            // Get a report on page load
            fetchReport($scope.timeframe.frame);
        }

        /**
         * Updates the current timeframe
         * Closes the dropdown
         * Fetches the report
         *
         * @param {string}
         */
        function setTimeframe(frame) {
            $scope.timeframe.frame = frame;
            $scope.timeframe.isOpen = false;

            fetchReport(frame);
        }

        // Open/Close the timeframe dropdown
        function toggle() {
            $scope.timeframe.isOpen = !$scope.timeframe.isOpen;
        }

        // Fetch a report for a timeframe string, and make sure
        // to modify the dates for the store tz
        function fetchReport(frame) {

            timezoneService.makeDateRange(frame)
                .then(function(dateRange){
                    return reportsService.product(dateRange);
                })
                .then(function(report) {
                    $scope.report = report;
                });
        }

    }
]);

