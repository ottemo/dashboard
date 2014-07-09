(function (define) {
    "use strict";

    /*
     *  HTML top page header manipulation stuff
     */
    define(["category/init"], function (productModule) {
        productModule
            /*
             *  $productApiService interaction service
             */
            .service("$categoryApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {

                var categoryBaseURL = REST_SERVER_URI + "/category";

                return $resource(categoryBaseURL, {}, {
                    "attributesInfo": { method: "GET", url: categoryBaseURL + "/attribute/list" },
                    "categoryList": { method: "GET", url: categoryBaseURL + "/category" }
                });
            }]);

        return productModule;
    });

})(window.define);