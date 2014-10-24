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

                        var getReferrers, getVisits, getVisitsDetail, getConversions;

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
                                        "higher": result.ratio > 0,
                                        "lower": result.ratio < 0
                                    };

                                    defer.resolve(visits);
                                } else {
                                    defer.resolve(visits);
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

                        getConversions = function () {
                            var defer, getPercents;
                            defer = $q.defer();

                            getPercents = function (val, total){
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

                        return {
                            getReferrers: getReferrers,
                            getVisits: getVisits,
                            getVisitsDetail: getVisitsDetail,
                            getConversions: getConversions
                        };
                    }
                ]
            );

            return dashboardModule;
        });

})(window.define);