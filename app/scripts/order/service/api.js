(function (define) {
    "use strict";

    /**
     *
     */
    define(["order/init"], function (orderModule) {
        orderModule
        /**
         *
         */
            .service("$orderApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
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
                        params: { orderID: "@id" },
                        url: REST_SERVER_URI + "/order/:orderID"
                    },
                    "remove": {
                        method: "DELETE",
                        params: { orderID: "@id" },
                        url: REST_SERVER_URI + "/delete/:orderID"
                    }
                });
            }]);

        return orderModule;
    });

})(window.define);