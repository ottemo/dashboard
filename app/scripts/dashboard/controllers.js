angular.module("dashboardModule")


.controller("dashboardHeaderController", ["$scope","$loginLoginService","$dashboardSidebarService",  function ($scope,$loginLoginService,$dashboardSidebarService) {
$scope.it = {

        getUsername: function () {
            return $loginLoginService.getFullName() || "root";
        },

        getAvatar: function () {
            return $loginLoginService.getAvatar();
        },
    }
    $scope.rightMenu = $dashboardSidebarService.getMenuItems();
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
    $scope.x = "dashboardController";
    $scope.visitorsChartData = [];
    $scope.visitsPeriod = 'week';
    $scope.salesChartData = [];
    $scope.salesPeriod = 'week';

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
    $statistic.getVisitorsOnline().then(function (data) {
        $scope.visitorsOnline = data;
    });

    $scope.initVisitorsChart = function () {
        if (!$scope.visitorsCharts) {
            $scope.visitorsCharts = $.plot(
                $('#visitors-chart #visitors-container'), [
                    {
                        data: $scope.visitorsChartData,
                        label: "Page View",
                        lines: {
                            fill: true
                        }
                    }
                ],
                {
                    series: {
                        lines: {
                            show: true,
                            fill: false
                        },
                        points: {
                            show: true,
                            lineWidth: 2,
                            fill: true,
                            fillColor: "#ffffff",
                            symbol: "circle",
                            radius: 5
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
                    tooltip: true,
                    tooltipOpts: {
                        defaultTheme: false
                    },
                    xaxis: {
                        mode:   "time",
                        tickLength: 5,
                        timezone: "browser" // "browser" for local to the client or timezone for timezone-js
                    }
                }
            );
        }
    };

    // VISITORS CHART
    // BY DEFAULT LAST 7 DAYS
    (function () {
        var from, to, today, dd, mm, yyyy, month,  tz;

        today = new Date();
        today.setDate(today.getDate() + 1);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        to = yyyy + "-" + mm + "-" + dd;

        today.setDate(today.getDate() - 7);
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
                $('#sales-chart #sales-container'), [
                    {
                        data: $scope.salesChartData,
                        label: "Page View",
                        lines: {
                            fill: true
                        }
                    }
                ],
                {
                    series: {
                        lines: {
                            show: true,
                            fill: false
                        },
                        points: {
                            show: true,
                            lineWidth: 2,
                            fill: true,
                            fillColor: "#ffffff",
                            symbol: "circle",
                            radius: 5
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
                    tooltip: true,
                    tooltipOpts: {
                        defaultTheme: false
                    },
                    xaxis: {
                        mode:   "time",
                        tickLength: 5,
                        timezone: "browser" // "browser" for local to the client or timezone for timezone-js
                    }
                }
            );
        }
    };

    // SALES CHART
    // BY DEFAULT LAST 7 DAYS
    (function () {
        var from, to, today, dd, mm, yyyy, month, tz;

        today = new Date();
        today.setDate(today.getDate() + 1);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        to = yyyy + "-" + mm + "-" + dd;

        today.setDate(today.getDate() - 7);
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

    $scope.updateVisitsChart = function (period) {
        var from, to, today, delta, dd, mm, month, yyyy, tz;

        var getDeltaValueForPeriod = function (period) {
            var delta = {};

            switch (period) {
                case "today":
                    $scope.visitsPeriod = 'today';
                    delta["to"] = 1;
                    delta["from"] = 1;
                    break;
                case "yesterday":
                    $scope.visitsPeriod = 'yesterday';
                    delta["to"] = 0;
                    delta["from"] = 1;
                    break;
                case "week":
                    $scope.visitsPeriod = 'week';
                    delta["to"] = 1;
                    delta["from"] = 7;
                    break;
                case "month":
                    $scope.visitsPeriod = 'month';
                    delta["to"] = 1;
                    delta["from"] = 31;
                    break;
                default:
                    $scope.visitsPeriod = 'week';
                    delta["to"] = 1;
                    delta["from"] = 7;
            }

            return delta;
        };

        delta = getDeltaValueForPeriod(period);

        today = new Date();
        today.setDate(today.getDate() + delta["to"]);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        to = yyyy + "-" + mm + "-" + dd;

        today.setDate(today.getDate() - delta["from"]);
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
    };

    $scope.updateSalesChart = function (period) {
        var from, to, today, delta, dd, mm, month, yyyy, tz;

        var getDeltaValueForPeriod = function (period) {
            var delta = {};

            switch (period) {
                case "today":
                    $scope.salesPeriod = 'today';
                    delta["to"] = 1;
                    delta["from"] = 1;
                    break;
                case "yesterday":
                    $scope.salesPeriod = 'yesterday';
                    delta["to"] = 0;
                    delta["from"] = 1;
                    break;
                case "week":
                    $scope.salesPeriod = 'week';
                    delta["to"] = 1;
                    delta["from"] = 7;
                    break;
                case "month":
                    $scope.salesPeriod = 'month';
                    delta["to"] = 1;
                    delta["from"] = 31;
                    break;
                default:
                    $scope.salesPeriod = 'week';
                    delta["to"] = 1;
                    delta["from"] = 7;
            }

            return delta;
        };

        delta = getDeltaValueForPeriod(period);

        today = new Date();
        today.setDate(today.getDate() + delta["to"]);
        dd = today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate();
        month = today.getMonth() + 1; //January is 0!
        mm = month.toString().length < 2 ? '0' + month : month;
        yyyy = today.getFullYear();
        to = yyyy + "-" + mm + "-" + dd;

        today.setDate(today.getDate() - delta["from"]);
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
    };

    $scope.getProductImage = function (image) {
        return $designImageService.getFullImagePath("", image);
    };

}]);
