(function (define) {
    "use strict";

    /**
     * The module "productModule" is designed to work with products
     *
     * This file it's start point modules. He includes all dependent files.
     * (For adding this module to App, you should add this file to the require list)
     */
    define([
            "product/service/api",
            "product/controller/productAttribute",
            "product/controller/productEdit"
        ],
        function (productModule) {

            return productModule;
        });

})(window.define);