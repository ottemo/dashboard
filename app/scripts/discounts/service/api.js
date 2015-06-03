angular.module("discountsModule")

/**
 * code
 * name
 * until
 * since
 * amount
 * percent
 * times
 */
.service("$discountsService", [
    "$resource",
    "REST_SERVER_URI",
    function ($resource, REST_SERVER_URI) {
        return $resource(REST_SERVER_URI + '/coupons/:id');
    }
]);