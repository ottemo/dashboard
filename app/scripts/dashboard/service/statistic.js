(function (define) {
    "use strict";

    /**
     *
     */
    define([
            "dashboard/init"
        ],
        function (dashboardModule) {

            dashboardModule
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

                                if ("" === response.error) {
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
                            var defer;
                            defer = $q.defer();

                            $api.getVisits().$promise.then(function (response) {
                                var result, visits;

                                result = response.result || [];
                                visits = {
                                    "visitsToday": 0,
                                    "ratio": 0,
                                    "higher": true,
                                    "lower": false
                                };

                                if ("" === response.error) {
                                    visits = {
                                        "visitsToday": result.visitsToday,
                                        "ratio": (Math.abs(result.ratio) * 100),
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
                            var defer;
                            defer = $q.defer();

                            $api.getSales().$promise.then(function (response) {
                                var result, sales;

                                result = response.result || [];
                                sales = {
                                    "salesToday": 0,
                                    "ratio": 0,
                                    "higher": true,
                                    "lower": false
                                };

                                if ("" === response.error) {
                                    sales = {
                                        "salesToday": result.today,
                                        "ratio": (Math.abs(result.ratio) * 100),
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

                        getVisitsDetail = function (from, to) {
                            var defer;
                            defer = $q.defer();

                            $api.getVisitsDetails({
                                "from": from,
                                "to": to
                            }).$promise.then(function (response) {
                                    var result, timestamp, dataChart;

                                    result = response.result || [];
                                    dataChart = [];

                                    if ("" === response.error) {
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

                        getSalesDetail = function (from, to) {
                            var defer;
                            defer = $q.defer();

                            $api.getSalesDetails({
                                "from": from,
                                "to": to
                            }).$promise.then(function (response) {
                                    var result, timestamp, dataChart;

                                    result = response.result || [];
                                    dataChart = [];

                                    if ("" === response.error) {
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
                            var defer, getPercents;
                            defer = $q.defer();

                            getPercents = function (val, total) {
                                return (val / total) * 100 || 0;
                            };

                            $api.getConversions().$promise.then(function (response) {
                                var result, conversion;

                                result = response.result || [];
                                conversion = {};

                                if ("" === response.error) {
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

                                if ("" === response.error) {
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

                                if ("" === response.error) {

                                    visitorsDetail["direct"] = result.Direct;
                                    visitorsDetail["directRatio"] = (Math.abs(result.DirectRatio) * 100);
                                    visitorsDetail["online"] = result.Online;
                                    visitorsDetail["onlineRatio"] = (Math.abs(result.OnlineRatio) * 100);
                                    visitorsDetail["search"] = result.Search;
                                    visitorsDetail["searchRatio"] = (Math.abs(result.SearchRatio) * 100);
                                    visitorsDetail["site"] = result.Site;
                                    visitorsDetail["siteRatio"] = (Math.abs(result.SiteRatio) * 100);

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
                    }
                ]
            );

            return dashboardModule;
        });

})(window.define);