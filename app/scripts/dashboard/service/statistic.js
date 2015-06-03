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
        return $api.getReferrers().$promise.then(function (response) {
            return response.result;
        });
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

    var _processDetailResponse = function(points) {
        // TODO: sorting should be done on the server
        var points = points.sort(function(a,b){
            return (a[0] > b[0]) ? 1 : -1;
        });

        // Split into two sets
        var set1 = points.splice(0,24).map(function(point){
            var pointTime = point[0];
            pointTime = moment.unix(pointTime).add(1,'day').valueOf();

            return [pointTime, point[1]];
        });

        var set2 = points.map(function(point){
            var pointTime = point[0];
            pointTime = moment.unix(pointTime).valueOf();

            return [pointTime, point[1]];
        });

        // z-index insures that today is on top
        var dataSets = [
            {name: 'Today', data: set2, zIndex: 2},
            {name: 'Yesterday', data: set1, zIndex: 1},
        ];

        return dataSets;
    }

    var getVisitsDetail = function () {

        var options = {
            "from": moment().subtract(1,'day').format('YYYY-MM-DD'),
            "to": moment().add(1,'day').format('YYYY-MM-DD'),
            "tz": _getTz()
        };

        return $api.getVisitsDetails(options).$promise.then(function (response) {
            return _processDetailResponse(response.result);
        });
    };

    var getSalesDetail = function () {
        var options = {
            "from": moment().subtract(1,'day').format('YYYY-MM-DD'),
            "to": moment().add(1,'day').format('YYYY-MM-DD'),
            "tz": _getTz()
        };

        return $api.getSalesDetails(options).$promise.then(function (response) {
            return _processDetailResponse(response.result);
        });
    };


    var getConversions = function () {
        var tz = _getTz()

        var getPercents = function (val, total) {
            return Math.round((Math.abs(val/total) * 100) * 100) / 100 || 0;
        };

        return $api.getConversions({"tz": tz}).$promise.then(function (response) {
            var result = response.result || [];
            var conversion = {};

            if (null === response.error) {
                conversion.addedToCart = result["addedToCart"];
                conversion.addedToCartPercent = getPercents(result["addedToCart"], result["totalVisitors"]);

                conversion.purchased = result["purchased"];
                conversion.purchasedPercent = getPercents(result["purchased"], result["totalVisitors"]);

                conversion.reachedCheckout = result["reachedCheckout"];
                conversion.reachedCheckoutPercent = getPercents(result["reachedCheckout"], result["totalVisitors"]);

                conversion.totalVisitors = result["totalVisitors"];
            }

            return conversion;
        });
    };

    var getTopSellers = function () {
        return $api.getTopSellers().$promise.then(function (response) {
            return response.result;
        });
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