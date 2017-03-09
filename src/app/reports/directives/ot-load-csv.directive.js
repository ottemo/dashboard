angular.module('reportsModule')

    .directive('otLoadCsv', [function() {
        return {
            restrict: 'E',
            scope: {
                type: '@',
                report: '=',
            },
            templateUrl: '/views/reports/directives/ot-load-csv.html',
            link: function(scope) {
                scope.downloadCSV = downloadCSV;

                function downloadCSV() {
                    var filename = scope.type + '.csv';
                    var csv = convertObjectsToCSV(scope.report);

                    if (csv == null) return;

                    csv = 'data:text/csv;charset=utf-8,' + csv;
                    csv = encodeURI(csv);

                    var link = document.createElement('a');
                    link.setAttribute('href', csv);

                    var userAgent = navigator.userAgent.toLowerCase();
                    if ( userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1 )  { // if Safari browser
                        link.target="_blank";
                    } else {
                        link.setAttribute('download', filename);
                    }

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                function convertObjectsToCSV(args) {
                    if (!args.aggregate_items || !args.aggregate_items.length) {
                        return null;
                    }

                    var data = args.aggregate_items.slice();
                    var columnDelimiter = ',',
                        lineDelimiter = '\n',
                        keys = [];

                    switch (scope.type) {
                        case 'product':
                            keys = ["name", "sku", "units_sold", "gross_sales"];
                            var totals = {
                                name: 'Totals',
                                sku: '',
                                units_sold: args.total_items + " items in " + args.total_orders + " orders",
                                gross_sales: args.total_sales
                            };
                            data.push(totals);
                            break;

                        case 'paymentMethod':
                        case 'shippingMethod':
                        case 'locationUS':
                        case 'locationCountry':
                            keys = ["name", "total_sales", "total_orders", "avg_sales"];
                            break;

                        case 'customerActivity':
                            keys = ["email", "name", "total_sales", "total_orders", "avg_sales", "earliest_purchase", "latest_purchase"];
                            break;

                        case 'giftcard':
                            keys = ["code", "amount", "name", "date"];
                            break;

                        default:
                            keys = Object.keys(data[0]);
                    }

                    var result = keys.join(columnDelimiter) + lineDelimiter;

                    data.forEach(function(item) {
                        for (var i = 0; i < keys.length; i++) {
                            if (i > 0) {
                                result += columnDelimiter;
                            }

                            result += '"' + item[keys[i]] + '"';
                        }

                        result += lineDelimiter;
                    });

                    return result;
                }
            }
        };
    }]);
