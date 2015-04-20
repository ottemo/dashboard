(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "cms/service/api",
            "cms/service/gallery",
            "cms/controller/pageList",
            "cms/controller/pageEdit",
            "cms/controller/blockList",
            "cms/controller/blockEdit"
        ],
        function (cmsModule) {

            return cmsModule;
        });

})(window.define);
