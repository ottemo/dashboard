(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "product/controllers"
        ],
        function (productModule) {

            return productModule;
        });

})(window.define);
