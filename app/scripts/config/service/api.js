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

                var configBaseURL = REST_SERVER_URI + "/config";

                return $resource(configBaseURL, {}, {
                    "getGroups": {
                        method: "GET",
                        url: configBaseURL + "/groups"
                    },
                    "getPath": {
                        method: "GET",
                        params: {"path": "@path"},
                        url: configBaseURL + "/get/:path"
                    },
                    "getInfo": {
                        method: "GET",
                        params: {"path": "@path"},
                        url: configBaseURL + "/info/:path"
                    },
                    "getList": {
                        method: "GET",
                        url: configBaseURL + "/list"
                    },
                    "setPath": {
                        method: "POST",
                        params: {"path": "@path"},
                        url: configBaseURL + "/set/:path"
                    }
                });
            }]);

        return configModule;
    });

})(window.define);