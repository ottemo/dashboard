angular.module('dashboardModule')

.service('dashboardStatisticService', [
    'dashboardApiService',
    '$q',
    'moment',
    '_',
    function(
        $api,
        $q,
        moment,
        _
    ) {

        var service = {
            getReferrers: getReferrers,
            getVisits: getVisits,
            getVisitsDetail: getVisitsDetail,
            getConversions: getConversions,
            getSales: getSales,
            getSalesDetail: getSalesDetail,
            getTopSellers: getTopSellers,
            getVisitorsOnline: getVisitorsOnline,
        };

        return service;

        //////////////////////////////

        function getReferrers() {
            return $api.getReferrers().$promise.then(function(response) {
                return response.result;
            });
        }

        function getVisits() {

            return $api.getVisits().$promise.then(function(response) {

                var defaults = {
                    total:  { today: 0, yesterday: 0, week: 0 },
                    unique: { today: 0, yesterday: 0, week: 0 },
                };

                return response.result || defaults;
            });
        }

        function getSales() {

            return $api.getSales().$promise
                .then(function(response) {
                    var defaults = {
                        sales:  { today: 0, yesterday: 0, week: 0, monthToDate: 0},
                        orders: { today: 0, yesterday: 0, week: 0, monthToDate: 0},
                    };

                    return response.result || defaults;
                })
                .then(function(result){
                    // Add in average cart size
                    result.salesAvg = {
                        today:          getAverageOrderSize('today'),
                        yesterday:      getAverageOrderSize('yesterday'),
                        week:           getAverageOrderSize('week'),
                        monthToDate:    getAverageOrderSize('monthToDate'),
                    };

                    return result;

                    //////

                    function getAverageOrderSize(param) {
                        if (!result.orders[param]) {
                            return 0;
                        }
                        return (result.sales[param] / result.orders[param]).toFixed(2);
                    }
                });
        }

        function _processDetailResponse(points) {

            // Split into two sets
            var set1 = points.splice(0, 24).map(function(point) {
                var pointTime = point[0];
                pointTime = moment.unix(pointTime).add(1, 'day').valueOf();

                return [pointTime, point[1]];
            });

            var set2 = points.map(function(point) {
                var pointTime = point[0];
                pointTime = moment.unix(pointTime).valueOf();

                return [pointTime, point[1]];
            });

            // z-index insures that today is on top
            var dataSets = [{
                name: 'Today',
                data: set2,
                zIndex: 2
            }, {
                name: 'Yesterday',
                data: set1,
                zIndex: 1
            }, ];

            return dataSets;
        }

        function getVisitsDetail() {

            var options = {
                'from': moment().subtract(1, 'day').format('YYYY-MM-DD'),
                'to': moment().add(1, 'day').format('YYYY-MM-DD')
            };

            return $api.getVisitsDetails(options).$promise.then(function(response) {
                return _processDetailResponse(response.result);
            });
        }

        function getSalesDetail() {
            var options = {
                'from': moment().subtract(1, 'day').format('YYYY-MM-DD'),
                'to': moment().add(1, 'day').format('YYYY-MM-DD')
            };

            return $api.getSalesDetails(options).$promise.then(function(response) {
                return _processDetailResponse(response.result);
            });
        }

        function getConversions() {

            var getPercents = function(val, total) {
                return Math.round((Math.abs(val / total) * 100) * 100) / 100 || 0;
            };

            return $api.getConversions().$promise.then(function(response) {
                var result = response.result || [];
                var conversion = {};

                if (null === response.error) {
                    conversion.addedToCart = result.addedToCart;
                    conversion.addedToCartPercent = getPercents(result.addedToCart, result.totalVisitors);

                    conversion.purchased = result.purchased;
                    conversion.purchasedPercent = getPercents(result.purchased, result.totalVisitors);

                    conversion.reachedCheckout = result.visitCheckout;
                    conversion.reachedCheckoutPercent = getPercents(result.visitCheckout, result.totalVisitors);

                    conversion.setPayment = result.setPayment;
                    conversion.setPaymentPercent = getPercents(result.setPayment, result.totalVisitors);

                    conversion.totalVisitors = result.totalVisitors;
                }

                return conversion;
            });
        }

        function getTopSellers() {
            return $api.getTopSellers().$promise.then(function(response) {
                return response.result;
            });
        }

        function getVisitorsOnline() {
            var defer;
            defer = $q.defer();

            $api.getVisitorsOnline().$promise.then(function(response) {
                var result, visitorsDetail;

                result = response.result || [];
                visitorsDetail = {};

                if (null === response.error) {

                    visitorsDetail.direct = result.Direct;
                    visitorsDetail.directRatio = (Math.abs(result.DirectRatio) * 100).toFixed(2);
                    visitorsDetail.online = result.Online;
                    visitorsDetail.onlineRatio = (Math.abs(result.OnlineRatio) * 100).toFixed(2);
                    visitorsDetail.search = result.Search;
                    visitorsDetail.searchRatio = (Math.abs(result.SearchRatio) * 100).toFixed(2);
                    visitorsDetail.site = result.Site;
                    visitorsDetail.siteRatio = (Math.abs(result.SiteRatio) * 100).toFixed(2);

                    defer.resolve(visitorsDetail);
                } else {
                    defer.resolve(visitorsDetail);
                }
            });

            return defer.promise;
        }
    }
]);

