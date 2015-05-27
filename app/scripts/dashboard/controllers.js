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
"moment",
function ($scope, $location, $statistic, $designImageService, $dashboardUtilsService, $timeout, moment) {

    /*
    Static Data Points
     */

    // TOP REFERRERS
    $statistic.getReferrers().then(function (data) {
        // $scope.referrers = $dashboardUtilsService.sortObjectsArrayByField(data, 'count', 'int', "DESC");
    });

    // Website Conversions
    $statistic.getConversions().then(function (data) {
        $scope.conversions = data;
    });

    // TOP SELLERS
    $statistic.getTopSellers().then(function (data) {
        // $scope.topSellers = $dashboardUtilsService.sortObjectsArrayByField(data, 'count', 'int', "DESC");
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

    // Highcharts settings that we can't adjust from ngHighcharts
    Highcharts.setOptions({
      chart: {
          spacingLeft: 15,
          spacingRight: 0,
          backgroundColor: 'rgba(0,0,0,0)'
      },

      yAxis: {
        labels: {
          style: {
              color: '#98978B'
          }
        }
      },
      colors: [
        '#325D88',
        '#DFD7CA'
      ],
      legend: { enabled: false }
    });

    var graphSettings = {
        options: {
            chart: { type: 'line'}
        },
        xAxis: {
            type: 'datetime',
            minTickInterval: moment.duration(1, 'hour').asMilliseconds(),
            labels: {
                formatter: function () {
                    return moment.utc(this.value).format('ha');
                }
            }
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: { enabled: false },
        },
        series: [],
        title: { text: '' },

        loading: false,
        size: { height: 260 }
    }

    function formatTimeSeries(payload) {
        return payload.map(function(point){
            var pointTime = point[0];
            pointTime = moment.unix(pointTime).valueOf();

            return [pointTime, point[1]];
        });
    }

    $scope.salesGraph = angular.copy(graphSettings);
    $scope.visitorGraph = angular.copy(graphSettings);

    $scope.salesGraph.yAxis.labels = {format : '${value}'};
    $statistic.getSalesDetail().then(function(data){
        var formattedData = formatTimeSeries(data);
        $scope.salesGraph.series = [{data: formattedData, name: 'Total Sales'}];
    });

    $statistic.getVisitsDetail().then(function(data){
        var formattedData = formatTimeSeries(data);
        $scope.visitorGraph.series = [{data: formattedData, name: 'Total Visitors'}];
    });

}]);
