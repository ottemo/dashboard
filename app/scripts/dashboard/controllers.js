angular.module("dashboardModule")

.controller("dashboardMenuController", ["$scope", "$menuService", "$loginLoginService", function ($scope, $menuService, $loginLoginService) {
    $scope.avatar = $loginLoginService.getAvatar();
    $scope.userName = $loginLoginService.getFullName() || "root";
    $scope.items = $menuService;
}])

.controller("dashboardController", [
"$scope",
"$location",
"$dashboardStatisticService",
"$designImageService",
"$dashboardUtilsService",
"$timeout",
function ($scope, $location, $statistic, $designImageService, $dashboardUtilsService, $timeout) {

    /*
    Static Data Points
     */

    // TOP REFERRERS
    $statistic.getReferrers().then(function (data) {
        $scope.referrers = $dashboardUtilsService.sortObjectsArrayByField(data, 'count', 'int', "DESC");
    });

    // Website Conversions
    $statistic.getConversions().then(function (data) {
        $scope.conversions = data;
    });

    // TOP SELLERS
    $statistic.getTopSellers().then(function (data) {
        $scope.topSellers = $dashboardUtilsService.sortObjectsArrayByField(data, 'count', 'int', "DESC");
    });


    /*
    Live Data Points
     */
    var pollingRate = 10 * 1000; // ms

    // Visit Stats
    (function tick(){
        $statistic.getVisits().then(function (data) {
            $scope.visitStats = data;
            $timeout(tick, pollingRate);
        });
    })();

    // Sales Stats
    (function tick(){
        $statistic.getSales().then(function (data) {
            $scope.salesStats = data;
            $timeout(tick, pollingRate);
        });
    })();


}]);
