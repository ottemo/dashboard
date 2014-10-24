(function (define, $) {
    "use strict";

    define(["dashboard/init"], function (dashboardModule) {

        dashboardModule
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
                function ($scope, $location, $statistic) {
                    $scope.x = "dashboardController";
                    $scope.visitorsChartData = [];
                    $scope.visitsPeriod = 'week';

                    var renderVisitsChart = function (data) {
                        if ($scope.visitorsCharts) {
                            $scope.visitorsCharts.setData([data]);
                            $scope.visitorsCharts.setupGrid();
                            $scope.visitorsCharts.draw();
                        }
                    };


                    // TOP REFERRERS
                    $statistic.getReferrers().then(
                        function (data) {
                            $scope.referrers = data;
                        }
                    );

                    // VISITS TODAY
                    $statistic.getVisits().then(
                        function (data) {
                            $scope.visits = data;
                        }
                    );

                    // Website Conversions
                    $statistic.getConversions().then(
                        function (data) {
                            $scope.conversions = data;
                        }
                    );

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
                                        mode: "time"
                                    },
                                    yaxes: [
                                        {
                                            /* First y axis */
                                        },
                                        {
                                            /* Second y axis */
                                            position: "right" /* left or right */
                                        }
                                    ]
                                }
                            );
                        }
                    };

                    // VISITORS CHART
                    // BY DEFAULT LAST 7 DAYS
                    (function () {
                        var from, to, today, dd, mm, yyyy;

                        today = new Date();
                        today.setDate(today.getDate() + 1);
                        dd = today.getDate();
                        mm = today.getMonth() + 1; //January is 0!
                        yyyy = today.getFullYear();
                        to = yyyy + "-" + mm + "-" + dd;

                        today.setDate(today.getDate() - 7);
                        dd = today.getDate();
                        mm = today.getMonth() + 1; //January is 0!
                        yyyy = today.getFullYear();
                        from = yyyy + "-" + mm + "-" + dd;

                        $statistic.getVisitsDetail(from, to).then(
                            function (data) {
                                renderVisitsChart(data);
                                $scope.visitorsChartData = data;
                            }
                        );
                    })();

                    $scope.updateVisitsChart = function (period) {
                        var from, to, today, delta, dd, mm, month, yyyy;

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

                        $statistic.getVisitsDetail(from, to).then(
                            function (data) {
                                renderVisitsChart(data);
                                $scope.visitorsChartData = data;
                            }
                        );
                    };

                }
            ]);

        return dashboardModule;
    });
})(window.define, jQuery);
