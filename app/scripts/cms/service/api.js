(function (define) {
    "use strict";

    /**
     *
     */
    define(["cms/init"], function (cmsModule) {
        cmsModule
        /**
         *
         */
            .service("$cmsApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
                return $resource(REST_SERVER_URI, {}, {
                    // Products
                    "blockAdd": {
                        method: "POST",
                        url: REST_SERVER_URI + "/cms/block"
                    },
                    "blockAttributes": {
                        method: "GET",
                        url: REST_SERVER_URI + "/cms/blocks/attributes"
                    },
                    "blockCount": {
                        method: "GET",
                        url: REST_SERVER_URI + "/cms/blocks?action=count"
                    },
                    "blockRemove": {
                        method: "DELETE",
                        params: {blockID: "@id"},
                        url: REST_SERVER_URI + "/cms/block/:blockID"
                    },
                    "blockGet": {
                        method: "GET",
                        params: {blockID: "@id"},
                        url: REST_SERVER_URI + "/cms/block/:blockID"
                    },
                    "blockList": {
                        method: "GET",
                        url: REST_SERVER_URI + "/cms/blocks"
                    },
                    "blockUpdate": {
                        method: "PUT",
                        params: {blockID: "@id"},
                        url: REST_SERVER_URI + "/cms/block/:blockID"
                    },
                    "getCountB": {
                        method: "GET",
                        url: REST_SERVER_URI + "/cms/blocks?action=count"
                    },
                    "pageAdd": {
                        method: "POST",
                        url: REST_SERVER_URI + "/cms/page"
                    },
                    "pageAttributes": {
                        method: "GET",
                        url: REST_SERVER_URI + "/cms/pages/attributes"
                    },
                    "pageCount": {
                        method: "GET",
                        url: REST_SERVER_URI + "/cms/pages?action=count"
                    },
                    "pageRemove": {
                        method: "DELETE",
                        params: {pageID: "@id"},
                        url: REST_SERVER_URI + "/cms/page/:pageID"
                    },
                    "pageGet": {
                        method: "GET",
                        params: {pageID: "@id"},
                        url: REST_SERVER_URI + "/cms/page/:pageID"
                    },
                    "pageList": {
                        method: "GET",
                        params: {pageID: "@id"},
                        url: REST_SERVER_URI + "/cms/page/:pageID"
                    },
                    "getCountP": {
                        method: "GET",
                        url: REST_SERVER_URI + "/cms/pages?action=count"
                    },
                    "pageUpdate": {
                        method: "PUT",
                        params: {pageID: "@id"},
                        url: REST_SERVER_URI + "/cms/page/:pageID"
                    }
                });
            }]);

        return cmsModule;
    });

})(window.define);