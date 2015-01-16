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

                var impexBaseURL = REST_SERVER_URI + "/impex";

                return $resource(impexBaseURL, {}, {
                    "importBatch": {
                        method: "POST",
                        url: impexBaseURL + "/import",

                        headers: {"Content-Type": undefined },
                        transformRequest: angular.identity
                    },
                    "importModel": {
                        method: "POST",
                        params: { model: "@model" },
                        url: impexBaseURL + "/import/:model",

                        headers: {"Content-Type": undefined },
                        transformRequest: angular.identity
                    },
                    "getModels": {
                        method: "GET",
                        url: impexBaseURL + "/models"
                    }
                });
            }]);

        return impexModule;
    });

})(window.define);