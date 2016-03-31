angular.module('reportingModule')

.controller('reportingProductController', [
    '$scope',
    'reportingService',
    function($scope, reportingService) {
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
        
        function setTimeframe(frame) {
            $scope.timeframe.frame = frame;
            $scope.timeframe.isOpen = false;
            
            var dateRange = getDatesForFrame(frame);
            getReport(dateRange);
        }
        
        function getDatesForFrame(frame) {
            // Default to today
            var startDate = '2016-03-01';
            var endDate = '2016-04-01';
            
            switch (frame) {
                case 'today':
                    // startDate = '';
                    break;
                case 'yesterday':
                    // startDate = '';
                    // endDate = ''
                    break;
                case 'last 7 days':
                    // startDate = '';
                    break;
                case 'last 30 days':
                    // startDate = '';
                    break;
            } 
            
            return {startDate: startDate, endDate: endDate}; 
        }
        
        function toggle() {
            $scope.timeframe.isOpen = !$scope.timeframe.isOpen;
        }
        
        function getReport(dates) {
            reportingService.product(dates.startDate, dates.endDate)
                .then(function(report) {
                    $scope.report = report;
                });
        }
        
        
    }
]);
