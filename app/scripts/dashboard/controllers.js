angular.module("dashboardModule")
/*
*  HTML top page header manipulator (direct service mapping)
*/
.controller("dashboardHeaderController", ["$scope", "$dashboardHeaderService", function ($scope, $dashboardHeaderService) {
    $scope.it = $dashboardHeaderService;
    $scope.leftMenu = $dashboardHeaderService.getMenuLeft();
    $scope.rightMenu = $dashboardHeaderService.getMenuRight();
}])

.controller("dashboardSidebarController", ["$scope", "$dashboardSidebarService", function ($scope, $dashboardSidebarService) {
    $scope.it = $dashboardSidebarService;
    $scope.items = $dashboardSidebarService.getItems();
}])

.controller("dashboardController", [
'$scope',
'$dashboardStatisticService',
'$timeout',
function ($scope, $stats, $timeout) {

    var pollTime = 1000 * 60;
    var isPollingEnabled = false;


    // Sales Table
    (function poll(){
        $stats.getSales().then(function(salesData){
            console.log('sales ping', salesData);
            $scope.salesTable = salesData;
            if (isPollingEnabled) {
                $timeout(poll, pollTime);
            };
        })
    })();

    // Visits Table
    (function poll(){
        $stats.getVisits().then(function(visitsData){
            console.log('visit ping', visitsData);
            $scope.visitsTable = visitsData;
            if (isPollingEnabled) {
                $timeout(poll, pollTime);
            };
        })
    })();

    //
}]);
