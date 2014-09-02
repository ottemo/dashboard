(function (define) {
    "use strict";

    /**
     * The module "seoModule" is designed to work with seos
     *
     * This file it"s start point modules. He includes all dependent files.
     * (For adding this module to App, you should add this file to the require list)
     */
    define([
            "seo/service/api",
            "seo/service/seo",
            "seo/controller/seoEdit"
        ],
        function (seoModule) {

            return seoModule;
        });

})(window.define);