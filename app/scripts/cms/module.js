(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "cms/service/api",
            "cms/controller/page",
            "cms/controller/block"
        ],
        function (cmsModule) {

            return cmsModule;
        });

})(window.define);