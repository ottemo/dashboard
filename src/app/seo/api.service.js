angular.module("seoModule")

.service("seoApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
    return $resource(REST_SERVER_URI, {}, {
        "add": {
            method: "POST",
            url: REST_SERVER_URI + "/seo/item"
        },
        "remove": {
            method: "DELETE",
            url: REST_SERVER_URI + "/seo/item/:itemID"
        },
		//  Dashboard don't use get SEO by URL anymore
        //"get": {
        //    method: "GET",
        //    params: { url: "@url"},
        //    url: REST_SERVER_URI + "/seo/url&url=:url"
        //},
		"canonical": {
			method: "GET",
			params: { id: "@id"},
			url: REST_SERVER_URI + "/seo/canonical/:id"
		},
        "list": {
            method: "GET",
            params: {
                extra: '_id,title,url,type'
            },
            url: REST_SERVER_URI + "/seo/items"
        },
        "update": {
            method: "PUT",
            url: REST_SERVER_URI + "/seo/item/:itemID"
        }
    });
}]);
