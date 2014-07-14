(function (define) {
    "use strict";

    /*
     *  HTML top page header manipulation stuff
     */
    define(["design/init"], function (productModule) {
        productModule
            /*
             *  $productApiService interaction service
             */
            .service("$designApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {

                var modelBaseURL;

                modelBaseURL = REST_SERVER_URI;

                var buildUrl = function (path) {
                    modelBaseURL = REST_SERVER_URI + path;
                    console.log("==> " + modelBaseURL);
                    return modelBaseURL;
                };

                var resources = $resource(modelBaseURL, {}, {
                    "attributesModel": {
                        method: "GET",
                        params: {"params": "@params"},
                        url: modelBaseURL + "/list/:params"
                    }
                });
                return {
                    buildUrl: buildUrl,
                    resources: resources
                };
            }]);

        return productModule;
    });

})(window.define);