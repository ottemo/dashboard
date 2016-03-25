angular.module("subscriptionsModule")

.service("subscriptionsApiService", [
    "$resource", "REST_SERVER_URI",
    function($resource, REST_SERVER_URI) {
        return $resource(REST_SERVER_URI, {}, {
            "list": {
                method: "GET",
                url: REST_SERVER_URI + "/subscriptions"
            },
            "one": {
                method: "GET",
                url: REST_SERVER_URI + "/subscriptions/:id"
            },
            "getCount": {
                method: "GET",
                params: {
                    action: "count"
                },
                url: REST_SERVER_URI + "/subscriptions"
            },
            "update": {
                method: "PUT",
                params: {
                    id: '@id'
                },
                url: REST_SERVER_URI + "/subscriptions/:id"
            }
        });
    }
]);

