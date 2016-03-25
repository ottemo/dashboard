angular.module("loginModule")

/**
 *  loginApiService interaction service
 */

.service("loginApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
    return $resource(REST_SERVER_URI, {},
        {
            "login": {
                method: "POST",
                url: REST_SERVER_URI + "/visit/login"
            },
            "logout": {
                method: "GET",
                url: REST_SERVER_URI + "/visit/logout"
            },
            "info": {
                method: "GET",
                url: REST_SERVER_URI + "/visit"
            }
        });
}]);