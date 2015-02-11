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
                            url: REST_SERVER_URI + "/rts/conversion"
                        },
                        "getVisitsDetails": {
                            method: "GET",
                            params: {
                                "from": "@from",
                                "to": "@to"
                            },
                            url: REST_SERVER_URI + "/rts/visits/detail/:from/:to"
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
                            url: REST_SERVER_URI + "/rts/sales/detail/:from/:to"
                        },
                        "getTopSellers": {
                            method: "GET",
                            url: REST_SERVER_URI + "/rts/bestsellers"
                        },
                        "getVisitorsOnline": {
                            method: "GET",
                            url: REST_SERVER_URI + "/rts/visits/realtime"
                        }
                    });
            }]);

        return dashboardModule;
    });

})(window.define);