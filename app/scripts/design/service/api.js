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

                return $resource(REST_SERVER_URI, {}, {
                    "attributesModel": {
                        method: "GET",
                        params: {
                            "uri_1": "@uri_1",
                            "uri_2": "@uri_2",
                            "uri_3": "@uri_3",
                            "params": "@params"
                        },
                        url: REST_SERVER_URI + "/:uri_1/:uri_2/:uri_3/list/:params"
                    }
                });
            }]);

        return productModule;
    });

})(window.define);