(function (define) {
    "use strict";

    /**
     *
     */
    define([
            "visitor/service/api",
            "visitor/controller/visitorList",
            "visitor/controller/visitorEdit",
            "visitor/controller/visitorEmail",
            "visitor/controller/addressList",
            "visitor/controller/addressEdit",
            "visitor/controller/attributeList",
            "visitor/controller/attributeEdit"
        ],
        function (visitorModule) {

            return visitorModule;
        });

})(window.define);