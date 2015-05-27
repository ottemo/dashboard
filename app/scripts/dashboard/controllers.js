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

    // UTC messes us up because we are realtime
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

    function formatPayload(payload) {
        return payload.map(function(point){
            var pointTime = point[0];
            pointTime = moment.unix(pointTime).valueOf();

            // return [pointTime, point[1]]
            return [pointTime,  Math.floor(Math.random() * 500 + 500) ];
        });
    }

    var yesterday = [
        [1432684800,0],
        [1432688400,0],
        [1432692000,0],
        [1432695600,0],
        [1432699200,0],
        [1432702800,0],
        [1432706400,0],
        [1432710000,0],
        [1432713600,0],
        [1432717200,0],
        [1432720800,0],
        [1432724400,0],
        [1432728000,0],
        [1432731600,0],
        [1432735200,0],
        [1432738800,0],
        [1432742400,1],
        [1432746000,0],
        [1432749600,0],
        [1432753200,0],
        [1432756800,0],
        [1432760400,0],
        [1432764000,0],
        [1432767600,0],
    ];

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

    $scope.salesGraph = angular.copy(graphSettings);
    $scope.visitorGraph = angular.copy(graphSettings);

    $scope.salesGraph.yAxis.labels = {format : '${value}'};
    $scope.salesGraph.series = [{data: formatPayload(yesterday), name: 'Total Sales'}];
    $scope.visitorGraph.series = [{data: formatPayload(yesterday), name: 'Total Visitors'}];

}]);
