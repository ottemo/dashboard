(function (define) {
    "use strict";

    /*
     *  HTML top page header manipulation stuff
     */
    define(["design/init"], function (designModule) {

        designModule
            /*
             *  $designImageService implementation
             */
            .service("$designImageService", [
                "$designService",
                "MEDIA_BASE_PATH",
                "PRODUCT_DEFAULT_IMG",
                function ($designService, MEDIA_BASE_PATH, PRODUCT_DEFAULT_IMG) {
                    var getFullImagePath;

                    getFullImagePath = function (path, filename) {
                        var src, imgRegExp;
                        imgRegExp = new RegExp(".gif|png|jpg|jpeg|ico$", "i");

                        if (typeof path === "undefined" || typeof filename === "undefined" || filename === "" || !imgRegExp.test(filename)) {
                            src = $designService.getImage(PRODUCT_DEFAULT_IMG);
                        } else {
                            src = MEDIA_BASE_PATH + path + filename;
                        }


                        return src;
                    };

                    return {
                        getFullImagePath: getFullImagePath
                    };
                }
            ]
        );


        return designModule;
    });

})(window.define);