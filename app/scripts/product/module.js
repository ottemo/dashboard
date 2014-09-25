(function (define) {
    "use strict";

    /**
     * The module "productModule" is designed to work with products
     *
     * This file it"s start point modules. He includes all dependent files.
     * (For adding this module to App, you should add this file to the require list)
     */
    define([
            "product/service/api",

            "product/directive/guiCustomOptionsManager",

            "product/controller/attributeEdit",
            "product/controller/attributeList",
            "product/controller/list",
            "product/controller/edit"
        ],
        function (productModule) {

            return productModule;
        });

})(window.define);