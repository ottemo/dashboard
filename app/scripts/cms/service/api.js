angular.module("cmsModule")
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
            params: { action: "count" },
            url: REST_SERVER_URI + "/cms/blocks"
        },
        "blockRemove": {
            method: "DELETE",
            url: REST_SERVER_URI + "/cms/block/:blockID"
        },
        "blockGet": {
            method: "GET",
            url: REST_SERVER_URI + "/cms/block/:blockID"
        },
        "blockList": {
            method: "GET",
            url: REST_SERVER_URI + "/cms/blocks"
        },
        "blockUpdate": {
            method: "PUT",
            params: { blockID: "@id" },
            url: REST_SERVER_URI + "/cms/block/:blockID"
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
            params: { action: "count" },
            url: REST_SERVER_URI + "/cms/pages"
        },
        "pageRemove": {
            method: "DELETE",
            url: REST_SERVER_URI + "/cms/page/:pageID"
        },
        "pageGet": {
            method: "GET",
            url: REST_SERVER_URI + "/cms/page/:pageID"
        },
        "pageList": {
            method: "GET",
            url: REST_SERVER_URI + "/cms/pages"
        },
        "pageUpdate": {
            method: "PUT",
            params: { pageID: "@id" },
            url: REST_SERVER_URI + "/cms/page/:pageID"
        },

        "galleryList": {
            method: "GET",
            url: REST_SERVER_URI + "/cms/gallery/images"
        },
        "galleryPath": {
            method: "GET",
            url: REST_SERVER_URI + "/cms/gallery/path"
        },
        "galleryGet": {
            method: "GET",
            url: REST_SERVER_URI + "/cms/gallery/image/:mediaName"
        },
        "galleryAdd": {
            method: "POST",
            url: REST_SERVER_URI + "/cms/gallery/image/:mediaName",
            headers: {"Content-Type": undefined },
            transformRequest: angular.identity // jshint ignore:line
        },
        "galleryRemove": {
            method: "DELETE",
            url: REST_SERVER_URI + "/cms/gallery/image/:mediaName"
        }
    });
}]);
