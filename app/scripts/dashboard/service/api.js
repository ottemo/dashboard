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

                var RTS_URI = REST_SERVER_URI + "/rts/";
                return $resource(REST_SERVER_URI, {},
                    {
                        "getReferrers": {
                            method: "GET",
                            url: RTS_URI + "referrers"
                        },
                        "getVisits": {
                            method: "GET",
                            url: RTS_URI + "visits"
                        },
                        "getConversions": {
                            method: "GET",
                            url: RTS_URI + "conversions"
                        },
                        "getVisitsDetails": {
                            method: "GET",
                            params: {
                                "from": "@from",
                                "to": "@to"
                            },
                            url: RTS_URI + "visits/details/:from/:to"
                        },
                        "getSales": {
                            method: "GET",
                            url: RTS_URI + "sales"
                        },
                        "getSalesDetails": {
                            method: "GET",
                            params: {
                                "from": "@from",
                                "to": "@to"
                            },
                            url: RTS_URI + "sales/details/:from/:to"
                        },
                        "getTopSellers": {
                            method: "GET",
                            url: RTS_URI + "top_sellers"
                        },
                        "getVisitorsOnline": {
                            method: "GET",
                            url: RTS_URI + "visitors/realtime"
                        }
                    });
            }]);

        return dashboardModule;
    });

})(window.define);