(function (define) {
    "use strict";

    /**
     *
     */
    define(["seo/init"], function (seoModule) {
        seoModule
        /**
         *
         */
            .service("$seoApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {

                var rewriteBaseURL = REST_SERVER_URI + "/url_rewrite";

                return $resource(rewriteBaseURL, {}, {
                    "add": {
                        method: "POST",
                        url: rewriteBaseURL + "/add"
                    },
                    "remove": {
                        method: "DELETE",
                        params: {"id": "@id"},
                        url: rewriteBaseURL + "/delete/:id"
                    },
                    "get": {
                        method: "GET",
                        params: {"url": "@url"},
                        url: rewriteBaseURL + "/get/:url"
                    },
                    "list": {
                        method: "GET",
                        url: rewriteBaseURL + "/list"
                    },
                    "update": {
                        method: "PUT",
                        params: {"id": "@id"},
                        url: rewriteBaseURL + "/update/:id"
                    }
                });
            }]);

        return seoModule;
    });

})(window.define);