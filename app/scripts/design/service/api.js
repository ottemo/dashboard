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

                return $resource(modelBaseURL, {}, {
                    "attributesModel": {
                        method: "GET",
                        params: {model: "@model"},
                        url: modelBaseURL + "/:model/list"
                    }
                });
            }]);

        return productModule;
    });

})(window.define);