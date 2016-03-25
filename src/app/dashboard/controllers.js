angular.module("dashboardModule")

.controller("dashboardController", [
    "$scope",
    "$location",
    "dashboardStatisticService",
    "designImageService",
    "dashboardUtilsService",
    "$timeout",
    "moment",
    function(
        $scope,
        $location,
        $statistic,
        designImageService,
        dashboardUtilsService,
        $timeout,
        moment
    ) {

        var pollingRate = 10 * 1000; // 10s
        var visitTimeout;
        var salesTimeout;
        var visitsDetailTimeout;
        var salesDetailTimeout;

        // Stats tables
        $scope.visitStats;
        $scope.salesStats;

        // Graphs
        $scope.visitorGraph;
        $scope.salesGraph;

        // Other Widgets
        $scope.referrers = [];
        $scope.conversions = {};
        $scope.topSellers = {}

        // REFACTOR OUT
        $scope.getProductImage = getProductImage;

        activate();

        ///////////////////////////////////

        function activate() {
            // Referrers
            $statistic.getReferrers().then(function(data) {
                if (angular.isArray(data)) {
                    $scope.referrers = data;
                }
            });

            // Conversions
            $statistic.getConversions().then(function(data) {
                $scope.conversions = data;
            });

            // Best Sellers
            $statistic.getTopSellers().then(function(data) {
                $scope.topSellers = data;
            });

            // Clear polling when we navigate
            $scope.$on('$locationChangeStart', function() {
                $timeout.cancel(visitTimeout);
                $timeout.cancel(salesTimeout);
                $timeout.cancel(visitsDetailTimeout);
                $timeout.cancel(salesDetailTimeout);
            });

            configGraphs();
            startPolling();
        }

        function configGraphs() {
            // Highcharts settings that we can't adjust from ngHighcharts
            Highcharts.setOptions({
                global: {
                    timezoneOffset: 0 //default
                },
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
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        return this.series.name + ' @ ' + moment.utc(this.x).format('ha') + ': ' + this.y;
                    }
                }
            });

            var graphSettings = {
                options: {
                    chart: {
                        events: {
                            load: function() { // add a reflow after load
                                var self = this;
                                setTimeout(function() {
                                    self.reflow();
                                }, 0);
                            }
                        },
                        type: 'line',
                        style: {
                            width: '100%'
                        }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: moment.duration(2, 'hour').asMilliseconds(),
                    tickAmount: 24,
                    labels: {
                        formatter: function() {
                            return moment.utc(this.value).format('ha')
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    minRange: 3,
                    allowDecimals: false,
                    title: {
                        enabled: false
                    },
                    labels: {}
                },
                series: [],
                title: {
                    text: ''
                },
                loading: false,
                size: {
                    height: 260
                }
            }

            // Copy these settings over
            $scope.salesGraph = angular.copy(graphSettings);
            $scope.visitorGraph = angular.copy(graphSettings);

            // Sales is in dollars, so update that label
            $scope.salesGraph.yAxis.labels.format =  '${value}';
        }

        function startPolling() {
            // Visit Stats
            (function tick() {
                $statistic.getVisits().then(function(data) {
                    $scope.visitStats = data;
                    visitTimeout = $timeout(tick, pollingRate);
                });
            })();

            // Sales Stats
            (function tick() {
                $statistic.getSales().then(function(data) {
                    $scope.salesStats = data;
                    salesTimeout = $timeout(tick, pollingRate);
                });
            })();

            // Visit Detail Stats
            (function tick() {
                $statistic.getVisitsDetail().then(function(dataSets) {
                    $scope.visitorGraph.series = dataSets;
                    visitsDetailTimeout = $timeout(tick, pollingRate);
                });
            })();

            // Sales Detail Stats
            (function tick() {
                $statistic.getSalesDetail().then(function(dataSets) {
                    $scope.salesGraph.series = dataSets;
                    salesDetailTimeout = $timeout(tick, pollingRate);
                });
            })();
        }

        //TODO: delete this when images are attached to products
        function getProductImage(image) {
            return designImageService.getImage(image);
        };

    }
]);

