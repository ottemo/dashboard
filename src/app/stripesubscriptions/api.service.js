angular.module("stripeSubscriptionsModule")

.service("stripeSubscriptionsApiService", [
    "$resource", "REST_SERVER_URI",
    function($resource, REST_SERVER_URI) {
        return $resource(REST_SERVER_URI, {}, {
            "list": {
                method: "GET",
                url: REST_SERVER_URI + "/stripe/subscriptions"
            },
            "getItem": {
                method: "GET",
                url: REST_SERVER_URI + "/stripe/subscription/:id"
            },
            "getCount": {
                method: "GET",
                params: {
                    action: "count"
                },
                url: REST_SERVER_URI + "/stripe/subscriptions"
            },
            "update": {
                method: "PUT",
                params: {
                    id: '@id'
                },
                url: REST_SERVER_URI + "/stripe/subscription/:id"
            }
        });
    }
]);

