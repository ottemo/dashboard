"use strict";

angular.appConfig = {
  "general.app.foundation_url": "http://foundation.kg.dev.ottemo.io",
  "general.app.media_path": "//kg.dev.ottemo.io/media/",
  "themes.list.active": "default",
  "general.app.item_per_page": 15
};

angular.appConfigValue = function (valueName) {
    if (typeof angular.appConfig[valueName] !== "undefined")
      return angular.appConfig[valueName];
    else
      return ""
};