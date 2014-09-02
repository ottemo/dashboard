(function (define) {
    "use strict";

    /**
     *
     */
    define([
            "angular",
            "angular-route",
            "angular-resource"
        ],
        function (angular) {
            /**
             *
             */
            angular.module.seoModule = angular.module("seoModule", ["ngRoute", "ngResource"])

                .run(["$loginService", "$rootScope", "$designService", "$dashboardHeaderService", "$route",
                    function ($loginService, $rootScope, $designService) {
                        $designService.setTopPage("seo/index.html");
                    }]
            );

            return angular.module.seoModule;
        });

})(window.define);