(function (define) {
    "use strict";

    /**
     *
     */
    define(["config/init"], function (configModule) {
        configModule
        /**
         *
         *
         */
            .service("$configApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
                return $resource(REST_SERVER_URI, {}, {
                    "getGroups": {
                        method: "GET",
                        url: REST_SERVER_URI + "/config/groups"
                    },
                    "getPath": {
                        method: "GET",
                        params: {"path": "@path"},
                        url: REST_SERVER_URI + "/config/value/:path"
                    },
                    "getInfo": {
                        method: "GET",
                        params: {"path": "@path"},
                        url: REST_SERVER_URI + "/config/item/:path"
                    },
                    "getList": {
                        method: "GET",
                        url: REST_SERVER_URI + "/config/values"
                    },
                    "setPath": {
                        method: "PUT",
                        params: {"path": "@path"},
                        url: REST_SERVER_URI + "/config/value/:path"
                    }
                });
            }]);

        return configModule;
    });

})(window.define);
