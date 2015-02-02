(function (define) {
    "use strict";

    /*
     *  HTML top page header manipulation stuff
     */
    define(["visitor/init"], function (visitorModule) {
        visitorModule
            /*
             *  $productApiService interaction service
             */
            .service("$visitorApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
                return $resource(REST_SERVER_URI, {}, {
                    "attributesInfo": {
                        method: "GET",
                        url: REST_SERVER_URI + "/visitors/attributes"
                    },
                    "addAttribute": {
                        method: "POST",
                        url: REST_SERVER_URI + "/visitors/attribute"
                    },
                    "removeAttribute": {
                        method: "DELETE",
                        params: { attribute: "@attribute" },
                        url: REST_SERVER_URI + "/visitors/attribute/:attribute"
                    },
                    "visitorList": {
                        method: "GET",
                        url: REST_SERVER_URI + "/visitors"
                    },
                    "save": {
                        method: "POST",
                        url: REST_SERVER_URI + "/visitor"
                    },
                    "load": {
                        method: "GET",
                        params: { visitorID: "@id" },
                        url: REST_SERVER_URI + "/visitor/:visitorID" },
                    "update": {
                        method: "PUT",
                        params: { visitorID: "@id" },
                        url: REST_SERVER_URI + "/visitor/:visitorID"
                    },
                    "remove": {
                        method: "DELETE",
                        params: { visitorID: "@id" },
                        url: REST_SERVER_URI + "/visitor/:visitorID"
                    },
                    "getCountVisitors": {
                        method: "GET",
                        url: REST_SERVER_URI + "/visitors?action=count"
                    },

                    // Addresses API
                    "addressAttributeInfo": {
                        method: "GET",
                        url: REST_SERVER_URI + "/visitors/addresses/attributes"
                    },
                    "addresses": {
                        method: "GET",
                        params: {visitorID: "@visitorId"},
                        url: REST_SERVER_URI + "/visitor/:visitorID/addresses"
                    },
                    "loadAddress": {
                        method: "GET",
                        params: {addressID: "@id"},
                        url: REST_SERVER_URI + "/visitors/address/:addressID"
                    },
                    "saveAddress": {
                        method: "POST",
                        params: {visitorID: "@visitorId"},
                        url: REST_SERVER_URI + "/visitor/:visitorID/address"
                    },
                    "updateAddress": {
                        method: "PUT",
                        params: { addressID: "@id" },
                        url: REST_SERVER_URI + "/visitors/address/:addressID"
                    },
                    "getCountAddresses": {
                        method: "GET",
                        params: {visitorID: "@visitorId"},
                        url: REST_SERVER_URI + "/visitor/:visitorID/addresses?action=count"
                    },
                    "deleteAddress": {
                        method: "DELETE",
                        params: { id: "@id" },
                        url: REST_SERVER_URI + "/visitors/address/:addressID"
                    },
                    "sendMail": {
                        method: "POST",
                        url: REST_SERVER_URI + "/visitors/mail"
                    }
                });
            }]);

        return visitorModule;
    });

})(window.define);
