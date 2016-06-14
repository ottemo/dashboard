angular.module('reportsModule')

.controller('reportsProductController', [
    '$scope',
    'reportsService',
    'timezoneService',
    'moment',
    '_',
    function($scope, reportsService, timezoneService, moment, _) {
        $scope.report = {};
        $scope.timeframe = {
            frame: 'last 30 days',
            options: [ // Support is bound to what timezone.js can parse
                'today',
                'yesterday',
                'last 7 days',
                'last 30 days',
            ],
            set: setTimeframe,
        };

        var yAxisConfig = {
            'gross_sales': {
                title: 'Gross Sales',
                format: '${value}'
            },
            'units_sold': {
                title: 'Units Sold',
                format: '{value}'
            },
        };

        $scope.sortedBy = 'units_sold';
        $scope.sortBy = sortBy;
        $scope.chartConfig = getChartConfig();

        activate();

        /////////////////////////////////

        function activate() {
            // Get a report on page load
            fetchReport($scope.timeframe.frame);
        }

        /**
         * Updates the current timeframe
         * Closes the dropdown
         * Fetches the report
         *
         * @param {string}
         */
        function setTimeframe(frame) {
            $scope.timeframe.frame = frame;
            fetchReport(frame);
        }

        // Fetch a report for a timeframe string, and make sure
        // to modify the dates for the store tz
        function fetchReport(frame) {

            timezoneService.makeDateRange(frame)
                .then(function(dateRange) {
                    return reportsService.product(dateRange);
                })
                .then(function(report) {
                    $scope.report = report;
                    updateChart();
                });
        }

        function getChartConfig() {
            // We have to touch some globals to get this to display the way we want
            // there are some tweaks in main.js as well
            Highcharts.setOptions({
                colors: ['#5da9dd'],
                tooltip: {
                    formatter: function() {
                        return [
                            this.series.name , '<br/>',
                            this.point.sku , ': <b>' , this.point.units_sold , ' units @ $' ,  this.point.gross_sales , '</b>',
                        ].join('');
                    }
                },

                // Removes the dead space to the sides of the column-group
                plotOptions: {
                    series: {
                        groupPadding: 0
                    },
                },
            });

            return {
                options: {
                    chart: {
                        type: 'column'
                    }
                },
                title: {
                    text: '',
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: yAxisConfig[$scope.sortedBy].title,
                    },
                    labels: {
                        format: yAxisConfig[$scope.sortedBy].format,
                    },
                },
                xAxis: {
                    title: {
                        text: 'Products by SKU'
                    },
                    labels: {
                        enabled: false,
                    },
                    minorTickLength: 0,
                    tickLength: 0,
                },
                tooltip: {
                    headerFormat: ''
                },
                plotOptions: {
                    series: {
                        groupPadding: 0
                    }
                },
                series: [],
            };
        }

        function updateChart() {
            $scope.chartConfig.yAxis.title.text = yAxisConfig[$scope.sortedBy].title;
            $scope.chartConfig.yAxis.labels.format = yAxisConfig[$scope.sortedBy].format;
            $scope.report.aggregate_items = _.sortByOrder($scope.report.aggregate_items, $scope.sortedBy, 'desc');
            $scope.chartConfig.series = _.map($scope.report.aggregate_items, toChartData);


            function toChartData(product) {
                return {
                    // sku, units_sold, gross_sales
                    name: product.name,
                    data: [{
                        y: product[$scope.sortedBy],
                        gross_sales: product.gross_sales,
                        units_sold: product.units_sold,
                        sku: product.sku,
                    }],
                };
            }
        }

        function sortBy(field) {
            $scope.sortedBy = field;
            updateChart();
        }
    }
]);

