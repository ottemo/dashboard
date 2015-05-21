"use strict";

window.name = "NG_DEFER_BOOTSTRAP!"; // http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap

angular.appConfig = {
  "general.app.foundation_url": "http://foundation.richkids.dev.ottemo.io",
  "general.app.media_path": "//kg.dev.ottemo.io/media/",
  "themes.list.active": "default",
  "general.app.item_per_page": 15
};

angular.appConfigValue = function (valueName) {
    if (typeof angular.appConfig[valueName] !== "undefined") {
        return angular.appConfig[valueName];
    }
    return "";
};

angular.element(document).ready(function () {
        var modules = Object.keys( angular.module );

        angular.isExistFile = function () {
            return false;
        };
        angular.resumeBootstrap( modules );
    });
