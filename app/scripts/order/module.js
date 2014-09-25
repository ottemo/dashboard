(function (define) {
    "use strict";

    define([
            "order/service/api",
            "order/controller/list",
            "order/controller/edit"
        ],
        function (orderModule) {

            return orderModule;
        });

})(window.define);