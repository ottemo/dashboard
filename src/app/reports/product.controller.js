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

        $scope.yAxis;
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
                        text: 'Gross Sales',
                    },
                    labels: {
                        format: '${value}',
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
            $scope.chartConfig.series = _.map($scope.report.aggregate_items, toChartData);

            function toChartData(product) {
                return {
                    // sku, units_sold
                    name: product.name,
                    data: [{
                        y: $scope.yAxis == 'Gross Sales' ? product.gross_sales : product.units_sold,
                        gross_sales: product.gross_sales,
                        units_sold: product.units_sold,
                        sku: product.sku,
                    }],
                };
            }
        }

        $scope.sortByGrossSales = function() {
            $scope.chartConfig.yAxis.title.text = 'Gross Sales';
            $scope.chartConfig.yAxis.labels.format = '${value}';

            //this should be request to foundation
            $scope.report.aggregate_items = _.sortBy($scope.report.aggregate_items, 'gross_sales').reverse();

            $scope.yAxis = 'Gross Sales';
            updateChart()
        };

        $scope.sortByUnitsSold = function() {
            $scope.chartConfig.yAxis.title.text = 'Units Sold';
            $scope.chartConfig.yAxis.labels.format = '{value}';

            //this should be request to foundation
            $scope.report.aggregate_items = _.sortBy($scope.report.aggregate_items, 'units_sold').reverse();

            $scope.yAxis = 'Units Sold';
            updateChart()
        };
    }
]);

