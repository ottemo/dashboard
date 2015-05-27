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

    //TODO: delete this when images are attached to products
    $scope.getProductImage = function (image) {
        return $designImageService.getFullImagePath("", image);
    };

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
        $scope.topSellers = data;
    });


    /*
    Live Data Points
     */
    var pollingRate = 10 * 1000; // 10s


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
      plotOptions: {
          series: {
            marker: {
                enabled: false
            }
          }
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
      legend: { enabled: false },
      tooltip: {
          formatter: function() {
              return this.series.name + ' @ ' + moment(this.x).format('ha') + ': ' + this.y;
          }
      }
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

    // Copy these settings over
    $scope.salesGraph = angular.copy(graphSettings);
    $scope.visitorGraph = angular.copy(graphSettings);

    // Sales is in dollars, so update that label
    $scope.salesGraph.yAxis.labels = {format : '${value}'};

    // TODO: Poll for data, commented out for now until we are sure we are reporting on
    // good data, maybe we want to only poll for today too...

    // (function tick(){
        $statistic.getSalesDetail().then(function(dataSets){
            $scope.salesGraph.series = dataSets;
            // $timeout(tick, pollingRate);
        });
    // })();

    // (function tick(){
        $statistic.getVisitsDetail().then(function(dataSets){
            $scope.visitorGraph.series = dataSets;
            // $timeout(tick, pollingRate);
        });
    // })();

}]);
