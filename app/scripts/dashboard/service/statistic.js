angular.module("dashboardModule")
/**
*  $dashboardStatisticService implementation
*/
.service("$dashboardStatisticService", [
"$dashboardApiService",
"$q",
"moment",
function ($api, $q, moment) {

    var _getTz = function() {
        return moment().utcOffset() / 60;
    }

    var getReferrers = function () {
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

    var getVisits = function () {
        var tz = _getTz();

        return $api.getVisits({"tz": tz}).$promise.then(function (response) {

            var defaults = {
                // total: {today: 0, yesterday: 0, week: 0},
                total: {today: moment().milliseconds(), yesterday: 0, week: 0},
                unique: {today: 0, yesterday: 0, week: 0}
            };
            // return defaults
            return response.result || defaults;
        });
    };

    var getSales = function () {
        var tz = _getTz();

        return $api.getSales({"tz": tz}).$promise.then(function (response) {
            var defaults = {
                // sales: {today: 0, yesterday: 0, week: 0},
                sales: {today: moment().milliseconds() * 102, yesterday: 0, week: 0},
                orders: {today: 0, yesterday: 0, week: 0}
            };
            // return defaults
            return response.result || defaults;
        });
    };

    var getVisitsDetail = function () {

        var options = {
            "from": moment().format('YYYY-MM-DD'),
            "to": moment().add(1,'day').format('YYYY-MM-DD'),
            "tz": _getTz()
        }

        return $api.getVisitsDetails(options).$promise.then(function (response) {
            // TODO: sorting should be done on the server
            var result = response.result.sort(function(a,b){
                return (a[0] > b[0]) ? 1 : -1;
            })
            return result
        });
    };

    var getSalesDetail = function () {
        var options = {
            "from": moment().format('YYYY-MM-DD'),
            "to": moment().add(1,'day').format('YYYY-MM-DD'),
            "tz": _getTz()
        }

        return $api.getSalesDetails(options).$promise.then(function (response) {
            // TODO: sorting should be done on the server
            var result = response.result.sort(function(a,b){
                return (a[0] > b[0]) ? 1 : -1;
            })
            return result
        });
    };

    var getConversions = function () {
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

    var getTopSellers = function () {
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

    var getVisitorsOnline = function () {
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