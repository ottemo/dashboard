(function (define) {
    "use strict";

    /**
     *
     */
    define(["login/init"], function (productModule) {
        productModule
            /**
             *  $loginApiService interaction service
             */
            .service("$loginApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {

                return $resource(REST_SERVER_URI, {},
                    {
                        "loginPost": {
                            method: "POST",
                            url: REST_SERVER_URI + "/visitor/login"
                        },
                        "loginGET": {
                            method: "GET",
                            url: REST_SERVER_URI + "/visitor/login"
                        },
                        "logout": {
                            method: "GET",
                            url: REST_SERVER_URI + "/app/logout"
                        },
                        "info": {
                            method: "GET",
                            url: REST_SERVER_URI + "/visitor/info"
                        }
                    });
            }]);

        return productModule;
    });

})(window.define);