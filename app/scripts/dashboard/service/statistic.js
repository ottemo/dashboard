angular.module("dashboardModule")
/**
*  $dashboardStatisticService implementation
*/
.service("$dashboardStatisticService", [
"$dashboardApiService",
"$q",
function ($api, $q) {

    var getVisitorsOnline, getTopSellers, getReferrers, getVisits, getSales, getVisitsDetail, getSalesDetail, getConversions;

    getReferrers = function () {
        var defer;
        defer = $q.defer();

        $api.getReferrers().$promise.then(function (response) {
            var result, url, referrers;

            result = response.result || [];
            referrers = [];

            if (null === response.error) {
                for (url in result) {
                    if (result.hasOwnProperty(url)) {
                        referrers.push({
                            "url": url,
                            "count": result[url]
                        });
                    }
                }
                referrers = referrers.sort(function (a, b) {
                    return a.count < b.count;
                });
                defer.resolve(referrers);
            } else {
                defer.resolve(referrers);
            }
        });

        return defer.promise;
    };

    getVisits = function () {
        var defer, today, tz;
        defer = $q.defer();
        today = new Date();
        tz = -today.getTimezoneOffset()/60;

        $api.getVisits({"tz": tz}).$promise.then(function (response) {
            var result, visits;

            result = response.result || [];
            visits = {
                "today": 0,
                "yesterday": 0,
                "ratio": 0,
                "higher": true,
                "lower": false
            };

            if (null === response.error) {
                visits = {
                    "today": result.visitsToday,
                    "yesterday": result.visitsYesterday,
                    "ratio": Math.round((Math.abs(result.ratio) * 100) * 100) / 100,
                    "higher": result.ratio >= 0,
                    "lower": result.ratio < 0
                };

                defer.resolve(visits);
            } else {
                defer.resolve(visits);
            }
        });

        return defer.promise;
    };

    getSales = function () {
        var defer, today, tz;
        defer = $q.defer();
        today = new Date();
        tz = -today.getTimezoneOffset()/60;

        $api.getSales({"tz": tz}).$promise.then(function (response) {
            var result, sales;

            result = response.result || [];
            sales = {
                "today": 0,
                "yesterday": 0,
                "ratio": 0,
                "higher": true,
                "lower": false
            };

            if (null === response.error) {
                sales = {
                    "today": result.today,
                    'yesterday': result.yesterday,
                    "ratio": Math.round((Math.abs(result.ratio) * 100) * 100) / 100,
                    "higher": result.ratio >= 0,
                    "lower": result.ratio < 0
                };

                defer.resolve(sales);
            } else {
                defer.resolve(sales);
            }
        });

        return defer.promise;
    };

    getVisitsDetail = function (from, to, tz) {
        var defer;
        defer = $q.defer();

        $api.getVisitsDetails({
            "from": from,
            "to": to,
            "tz": tz
        }).$promise.then(function (response) {
                var result, timestamp, dataChart;

                result = response.result || [];
                dataChart = [];

                if (null === response.error) {
                    for (timestamp in result) {
                        if (result.hasOwnProperty(timestamp)) {
                            dataChart.push([timestamp * 1000, result[timestamp]]);
                        }
                    }

                    defer.resolve(dataChart);
                } else {
                    defer.resolve(dataChart);
                }
            });

        return defer.promise;
    };

    getSalesDetail = function (from, to, tz) {
        var defer;
        defer = $q.defer();

        $api.getSalesDetails({
            "from": from,
            "to": to,
            "tz": tz
        }).$promise.then(function (response) {
                var result, timestamp, dataChart;

                result = response.result || [];
                dataChart = [];

                if (null === response.error) {
                    for (timestamp in result) {
                        if (result.hasOwnProperty(timestamp)) {
                            dataChart.push([timestamp * 1000, result[timestamp]]);
                        }
                    }

                    defer.resolve(dataChart);
                } else {
                    defer.resolve(dataChart);
                }
            });

        return defer.promise;
    };

    getConversions = function () {
        var defer, getPercents, today, tz;
        defer = $q.defer();
        today = new Date();
        tz = -today.getTimezoneOffset()/60;

        getPercents = function (val, total) {
            return Math.round((Math.abs(val/total) * 100) * 100) / 100 || 0;
        };

        $api.getConversions({"tz": tz}).$promise.then(function (response) {
            var result, conversion;

            result = response.result || [];
            conversion = {};

            if (null === response.error) {
                conversion.addedToCart = result["addedToCart"];
                conversion.addedToCartPercent = getPercents(result["addedToCart"], result["totalVisitors"]);

                conversion.purchased = result["purchased"];
                conversion.purchasedPercent = getPercents(result["purchased"], result["totalVisitors"]);

                conversion.reachedCheckout = result["reachedCheckout"];
                conversion.reachedCheckoutPercent = getPercents(result["reachedCheckout"], result["totalVisitors"]);

                conversion.totalVisitors = result["totalVisitors"];
            }

            defer.resolve(conversion);
        });

        return defer.promise;
    };

    getTopSellers = function () {
        var defer;
        defer = $q.defer();

        $api.getTopSellers().$promise.then(function (response) {
            var result, topSellers;

            result = response.result || [];
            topSellers = [];

            if (null === response.error) {
                for (var productId in result) {
                    if (result.hasOwnProperty(productId)) {
                        topSellers.push({
                            "id": productId,
                            "name": result[productId]["Name"],
                            "image": result[productId]["Image"],
                            "count": result[productId]["Count"]
                        });
                    }
                }
                topSellers = topSellers.sort(function (a, b) {
                    return (a.count < b.count);
                });
                defer.resolve(topSellers);
            } else {
                defer.resolve(topSellers);
            }
        });

        return defer.promise;
    };

    getVisitorsOnline = function () {
        var defer;
        defer = $q.defer();

        $api.getVisitorsOnline().$promise.then(function (response) {
            var result, visitorsDetail;

            result = response.result || [];
            visitorsDetail = {};

            if (null === response.error) {

                visitorsDetail["direct"] = result.Direct;
                visitorsDetail["directRatio"] = (Math.abs(result.DirectRatio) * 100).toFixed(2);
                visitorsDetail["online"] = result.Online;
                visitorsDetail["onlineRatio"] = (Math.abs(result.OnlineRatio) * 100).toFixed(2);
                visitorsDetail["search"] = result.Search;
                visitorsDetail["searchRatio"] = (Math.abs(result.SearchRatio) * 100).toFixed(2);
                visitorsDetail["site"] = result.Site;
                visitorsDetail["siteRatio"] = (Math.abs(result.SiteRatio) * 100).toFixed(2);

                defer.resolve(visitorsDetail);
            } else {
                defer.resolve(visitorsDetail);
            }
        });

        return defer.promise;
    };
    return {
        getReferrers: getReferrers,
        getVisits: getVisits,
        getVisitsDetail: getVisitsDetail,
        getConversions: getConversions,
        getSales: getSales,
        getSalesDetail: getSalesDetail,
        getTopSellers: getTopSellers,
        getVisitorsOnline: getVisitorsOnline
    };
}]);