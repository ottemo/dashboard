(function (define) {
    "use strict";

    /**
     * The module "productModule" is designed to work with products
     *
     * This file it"s start point modules. He includes all dependent files.
     * (For adding this module to App, you should add this file to the require list)
     */
    define([
            "config/service/api",
            "config/service/config",
            "config/controller/configEdit"
        ],
        function (configModule) {

            return configModule;
        });

})(window.define);