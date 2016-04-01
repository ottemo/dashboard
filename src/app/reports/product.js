angular.module('reportsModule')

.controller('reportsProductController', [
    '$scope',
    'reportsService',
    'moment',
    function($scope, reportsService, moment) {
        $scope.report = {};
        $scope.timeframe = {
            frame: 'today',
            options: [
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
            var frame = $scope.timeframe.frame;
            var dateRange = getDatesForFrame(frame);
            getReport(dateRange);
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

            var dateRange = getDatesForFrame(frame);
            getReport(dateRange);
        }

        // Mapping date terms to js Date objects
        function getDatesForFrame(frame) {

            // Default to today
            var startDate = moment().startOf('day');
            var endDate = moment().endOf('day');

            switch (frame) {
                case 'today':
                    break;
                case 'yesterday':
                    startDate = moment().subtract(1, 'day').startOf('day');
                    endDate = moment().subtract(1, 'day').endOf('day');
                    break;
                case 'last 7 days':
                    startDate = moment().subtract(7, 'days').startOf('day');
                    break;
                case 'last 30 days':
                    startDate = moment().subtract(30, 'days').startOf('day');
                    break;
            }

            return {
                startDate: startDate,
                endDate: endDate
            };
        }

        // Open/Close the timeframe dropdown
        function toggle() {
            $scope.timeframe.isOpen = !$scope.timeframe.isOpen;
        }

        /**
         * Fetchs a report and updates the scoped var
         * @param  {startDate: Date, endDate: Date}
         */
        function getReport(dates) {
            reportsService.product(dates.startDate, dates.endDate)
                .then(function(report) {
                    $scope.report = report;
                });
        }

    }
]);

