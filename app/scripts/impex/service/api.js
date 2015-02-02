(function (define) {
    "use strict";

    /**
     *
     */
    define(["angular", "impex/init"], function (angular, impexModule) {
        impexModule
        /**
         *
         */
            .service("$impexApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
                return $resource(REST_SERVER_URI, {}, {
                    "importBatch": {
                        method: "POST",
                        url: REST_SERVER_URI + "/impex/import",

                        headers: {"Content-Type": undefined },
                        transformRequest: angular.identity
                    },
                    "importModel": {
                        method: "POST",
                        params: { model: "@model" },
                        url: REST_SERVER_URI + "/impex/import/:model",

                        headers: {"Content-Type": undefined },
                        transformRequest: angular.identity
                    },
                    "getModels": {
                        method: "GET",
                        url: REST_SERVER_URI + "/impex/models"
                    }
                });
            }]);

        return impexModule;
    });

})(window.define);