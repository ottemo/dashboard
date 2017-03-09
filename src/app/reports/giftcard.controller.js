angular.module('reportsModule')

.controller('reportsGiftcardController', [
    '$scope',
    'timezoneService',
    'reportsService',
    '$location',
    'moment',
    function(
        $scope,
        timezoneService,
        reportsService,
        $location,
        moment
    ) {
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
                    return reportsService.giftcard(options);
                })
                .then(function(report){
                    // get timezone from config in admin and transform date in readable format
                    timezoneService.get().then(function(tz){
                        angular.forEach(report.aggregate_items, function(value) {
                            value.date = moment(value.date).utcOffset(tz).format('YYYY-MM-DD HH:mm');
                        });
                        $scope.report = report;
                    });

                });
        }
    }
]);

