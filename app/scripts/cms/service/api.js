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

                var cmsBaseURL = REST_SERVER_URI + "/cms";

                return $resource(cmsBaseURL, {}, {
                    // Products
                    "blockAdd": {
                        method: "POST",
                        url: cmsBaseURL + "/block/add"
                    },
                    "blockAttributes": {
                        method: "GET",
                        url: cmsBaseURL + "/block/attributes"
                    },
                    "blockCount": {
                        method: "POST",
                        url: cmsBaseURL + "/block/count"
                    },
                    "blockRemove": {
                        method: "DELETE",
                        params: {id: "@id"},
                        url: cmsBaseURL + "/block/delete/:id"
                    },
                    "blockGet": {
                        method: "GET",
                        params: {id: "@id"},
                        url: cmsBaseURL + "/block/get/:id"
                    },
                    "blockListG": {
                        method: "GET",
                        url: cmsBaseURL + "/block/list"
                    },
                    "blockListP": {
                        method: "POST",
                        url: cmsBaseURL + "/block/list"
                    },
                    "blockUpdate": {
                        method: "PUT",
                        params: {id: "@id"},
                        url: cmsBaseURL + "/block/update/:id"
                    },
                    "getCountB": {
                        method: "GET",
                        url: cmsBaseURL + "/block/count"
                    },
                    "pageAdd": {
                        method: "POST",
                        url: cmsBaseURL + "/page/add"
                    },
                    "pageAttributes": {
                        method: "GET",
                        url: cmsBaseURL + "/page/attributes"
                    },
                    "pageCount": {
                        method: "POST",
                        url: cmsBaseURL + "/page/count"
                    },
                    "pageRemove": {
                        method: "DELETE",
                        params: {id: "@id"},
                        url: cmsBaseURL + "/page/delete/:id"
                    },
                    "pageGet": {
                        method: "GET",
                        params: {id: "@id"},
                        url: cmsBaseURL + "/page/get/:id"
                    },
                    "pageListG": {
                        method: "GET",
                        url: cmsBaseURL + "/page/list"
                    },
                    "pageListP": {
                        method: "POST",
                        url: cmsBaseURL + "/page/list"
                    },
                    "getCountP": {
                        method: "GET",
                        url: cmsBaseURL + "/page/count"
                    },
                    "pageUpdate": {
                        method: "PUT",
                        params: {id: "@id"},
                        url: cmsBaseURL + "/page/update/:id"
                    }
                });
            }]);

        return cmsModule;
    });

})(window.define);