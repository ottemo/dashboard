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
                return $resource(REST_SERVER_URI, {}, {
                    "add": {
                        method: "POST",
                        url: REST_SERVER_URI + "/add"
                    },
                    "remove": {
                        method: "DELETE",
                        params: {itemID: "@id"},
                        url: REST_SERVER_URI + "/seo/item/:itemID"
                    },
                    "get": {
                        method: "GET",
                        params: {url: "@url"},
                        url: REST_SERVER_URI + "/seo/url/:url"
                    },
                    "list": {
                        method: "GET",
                        url: REST_SERVER_URI + "/seo/items"
                    },
                    "update": {
                        method: "PUT",
                        params: {itemID: '@id'},
                        url: REST_SERVER_URI + "/seo/item/:itemID"
                    }
                });
            }]);

        return seoModule;
    });

})(window.define);