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

                var orderBaseURL = REST_SERVER_URI + "/order";

                return $resource(orderBaseURL, {}, {
                    "orderList": {
                        method: "POST",
                        url: orderBaseURL + "/list"
                    },
                    "getOrder": {
                        method: "GET",
                        params: { "id": "@id" },
                        url: orderBaseURL + "/get/:id"
                    },
                    "getAttributes": {
                        method: "GET",
                        url: orderBaseURL + "/attributes"
                    },
                    "getCount": {
                        method: "GET",
                        url: orderBaseURL + "/count"
                    },
                    "update": {
                        method: "PUT",
                        params: { "id": "@id" },
                        url: orderBaseURL + "/update/:id"
                    },
                    "remove": {
                        method: "DELETE",
                        params: { "id": "@id" },
                        url: orderBaseURL + "/delete/:id"
                    }
                });
            }]);

        return orderModule;
    });

})(window.define);