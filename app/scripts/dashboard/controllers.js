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
"$scope",
"$location",
"$dashboardStatisticService",
"$designImageService",
"$dashboardUtilsService",
function ($scope, $location, $statistic, $designImageService, $dashboardUtilsService) {
    $scope.visitorsChartData = [];
    $scope.salesChartData = [];

    var renderVisitsChart = function (data) {
        if ($scope.visitorsCharts) {
            $scope.visitorsCharts.setData([data]);
            $scope.visitorsCharts.setupGrid();
            $scope.visitorsCharts.draw();
        }
    };

    var renderSalesChart = function (data) {
        if ($scope.salesCharts) {
            $scope.salesCharts.setData([data]);
            $scope.salesCharts.setupGrid();
            $scope.salesCharts.draw();
        }
    };

    // TOP REFERRERS
    $statistic.getReferrers().then(function (data) {
        $scope.referrers = $dashboardUtilsService.sortObjectsArrayByField(data, 'count', 'int', "DESC");
    });

    // VISITS TODAY
    $statistic.getVisits().then(function (data) {
        $scope.visits = data;
    });

    // SALES TODAY
    $statistic.getSales().then(function (data) {
        $scope.sales = data;
    });

    // Website Conversions
    $statistic.getConversions().then(function (data) {
        $scope.conversions = data;
    });

    // TOP SELLERS
    $statistic.getTopSellers().then(function (data) {
        $scope.topSellers = $dashboardUtilsService.sortObjectsArrayByField(data, 'count', 'int', "DESC");
    });

    // VISITORS ONLINE
    // $statistic.getVisitorsOnline().then(function (data) {
    //     $scope.visitorsOnline = data;
    // });

    var plotSettings = {
        series: {
            lines: {
                show: true,
                fill: false
            },
            shadowSize: 0
        },
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#f9f9f9",
            borderWidth: 1,
            borderColor: "#eeeeee"
        },
        colors: ["#65CEA7", "#424F63"],
        xaxis: {
            mode: "time",
            timeformat: "%I%p"
            // tickLength: 5,
            // timezone: "browser" // "browser" for local to the client or timezone for timezone-js
        },
        yaxis: {
            min: 0
        }
    }

    $scope.initVisitorsChart = function () {
        if (!$scope.visitorsCharts) {
            $scope.visitorsCharts = $.plot(
                $('#visitors-chart #visitors-container'),
                [{'label': 'visits', data: $scope.visitorsChartData}],
                plotSettings
            );
        }
    };

    // VISITORS CHART
    (function () {
        var from, to, today, dd, mm, yyyy, month,  tz;

        today = new Date();
        today.setDate(today.getDate() + 1);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        to = yyyy + "-" + mm + "-" + dd;

        today.setDate(today.getDate() - 1);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        from = yyyy + "-" + mm + "-" + dd;
        tz = -today.getTimezoneOffset()/60;

        $statistic.getVisitsDetail(from, to, tz).then(
            function (data) {
                renderVisitsChart(data);
                $scope.visitorsChartData = data;
            }
        );
    })();

    $scope.initSalesChart = function () {
        if (!$scope.salesCharts) {
            $scope.salesCharts = $.plot(
                $('#sales-chart #sales-container'),
                [{'label': 'sales', data: $scope.salesChartData}],
                plotSettings
            );
        }
    };

    // SALES CHART
    (function () {
        var from, to, today, dd, mm, yyyy, month, tz;

        today = new Date();
        today.setDate(today.getDate() + 1);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        to = yyyy + "-" + mm + "-" + dd;

        today.setDate(today.getDate() - 1);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        from = yyyy + "-" + mm + "-" + dd;
        tz = -today.getTimezoneOffset()/60;

        $statistic.getSalesDetail(from, to, tz).then(
            function (data) {
                renderSalesChart(data);
                $scope.salesChartData = data;
            }
        );
    })();

    $scope.getProductImage = function (image) {
        return $designImageService.getFullImagePath("", image);
    };

}]);
