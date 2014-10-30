(function (define) {
    "use strict";

    /**
     *
     */
    define(["dashboard/init"], function (dashboardModule) {
        dashboardModule
        /**
         *  $dashboardApiService interaction service
         */
            .service("$dashboardApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {

                return $resource(REST_SERVER_URI, {},
                    {
                        "getReferrers": {
                            method: "GET",
                            url: REST_SERVER_URI + "/rts/referrers"
                        },
                        "getVisits": {
                            method: "GET",
                            url: REST_SERVER_URI + "/rts/visits"
                        },
                        "getConversions": {
                            method: "GET",
                            url: REST_SERVER_URI + "/rts/conversions"
                        },
                        "getVisitsDetails": {
                            method: "GET",
                            params: {
                                "from": "@from",
                                "to": "@to"
                            },
                            url: REST_SERVER_URI + "/rts/visits/details/:from/:to"
                        },
                        "getSales": {
                            method: "GET",
                            url: REST_SERVER_URI + "/rts/sales"
                        },
                        "getSalesDetails": {
                            method: "GET",
                            params: {
                                "from": "@from",
                                "to": "@to"
                            },
                            url: REST_SERVER_URI + "/rts/sales/details/:from/:to"
                        },
                        "getTopSellers": {
                            method: "GET",
                            url: REST_SERVER_URI + "/rts/top_sellers"
                        }
                    });
            }]);

        return dashboardModule;
    });

})(window.define);