angular.module("orderModule")

.service("orderApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
    return $resource(REST_SERVER_URI, {}, {
        "orderList": {
            method: "GET",
            url: REST_SERVER_URI + "/orders"
        },
        "getOrder": {
            method: "GET",
            url: REST_SERVER_URI + "/order/:orderID"
        },
        "getAttributes": {
            method: "GET",
            url: REST_SERVER_URI + "/orders/attributes"
        },
        "getCount": {
            method: "GET",
            params: { action: "count"},
            url: REST_SERVER_URI + "/orders"
        },
        "update": {
            method: "PUT",
            url: REST_SERVER_URI + "/order/:orderID"
        },
        "updateOrderStatus": {
            method: "POST",
            url: REST_SERVER_URI + "/orders/setStatus"
        },
        "remove": {
            method: "DELETE",
            url: REST_SERVER_URI + "/order/:orderID"
        },
        "sendConfirmation": {
            method: "GET",
            url: REST_SERVER_URI + "/order/:orderID/emailOrderConfirmation"
        },
        "sendTracking": {
            method: "POST",
            url: REST_SERVER_URI + "/order/:orderID/emailTrackingCode"
        }
    });
}]);
