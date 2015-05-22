"use strict";

angular.appConfig = {
  "general.app.foundation_url": "https://api.blitz.ottemo.io",
  "general.app.media_path": "//blitz.ottemo.io/media/",
  "themes.list.active": "default",
  "general.app.item_per_page": 15
};

angular.appConfigValue = function (valueName) {
    if (typeof angular.appConfig[valueName] !== "undefined")
      return angular.appConfig[valueName];
    else
      return ""
};