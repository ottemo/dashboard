(function (define) {
    "use strict";

    /*
     *  HTML top page header manipulation stuff
     */
    define(["visitor/init"], function (productModule) {
        productModule
            /*
             *  $productApiService interaction service
             */
            .service("$visitorApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {

                var visitorBaseURL = REST_SERVER_URI + "/visitor";

                return $resource(visitorBaseURL, {}, {
                    "attributesInfo": {
                        method: "GET",
                        url: visitorBaseURL + "/attribute/list"
                    },
                    "visitorList": {
                        method: "GET",
                        url: visitorBaseURL + "/list"
                    },
                    "save": {
                        method: "POST",
                        url: visitorBaseURL + "/create"
                    },
                    "load": {
                        method: "GET",
                        params: { id: "@id" },
                        url: visitorBaseURL + "/load/:id" },
                    "update": {
                        method: "PUT",
                        params: { id: "@id" },
                        url: visitorBaseURL + "/update/:id"
                    },
                    "remove": {
                        method: "DELETE",
                        params: { id: "@id" },
                        url: visitorBaseURL + "/delete/:id"
                    },

                    // Addresses API
                    "addressAttributeInfo": {
                        method: "GET",
                        url: visitorBaseURL + "/address/attribute/list"
                    },
                    "addressesList": {
                        method: "GET",
                        params: {visitorId: "@visitorId"},
                        url: visitorBaseURL + "/address/list/:visitorId"
                    },
                    "loadAddress": {
                        method: "GET",
                        params: {id: "@id"},
                        url: visitorBaseURL + "/address/load/:id"
                    },
                    "saveAddress": {
                        method: "POST",
                        url: visitorBaseURL + "/address/create"
                    },
                    "updateAddress": {
                        method: "PUT",
                        params: { id: "@id" },
                        url: visitorBaseURL + "/address/update/:id"
                    },
                    "deleteAddress": {
                        method: "DELETE",
                        params: { id: "@id" },
                        url: visitorBaseURL + "/address/delete/:id"
                    }
                });
            }]);

        return productModule;
    });

})(window.define);