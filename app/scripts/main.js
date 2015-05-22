"use strict";

angular.appConfig = {
  "general.app.foundation_url": "http://foundation.richkids.dev.ottemo.io",
  "general.app.media_path": "//richkids.com/media/",
  "general.app.item_per_page": 15
};

angular.appConfigValue = function (valueName) {
    if (typeof angular.appConfig[valueName] !== "undefined")
      return angular.appConfig[valueName];
    else
      return ""
};
