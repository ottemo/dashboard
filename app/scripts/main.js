"use strict";

angular.appConfig = {
  "general.app.foundation_url": "http://api.kg.dev.ottemo.io",
  "general.app.media_path": "media/",
  "general.app.item_per_page": 15
};

angular.appConfigValue = function (valueName) {
    if (typeof angular.appConfig[valueName] !== "undefined")
        {
            return angular.appConfig[valueName];
        }
    else
        {
            return "";
        }
};
