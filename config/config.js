"use strict";

angular.appConfig = {
  "general.app.foundation_url": "@@apiUrl",
  "general.app.media_path": "@@mediaPath",
  "general.app.item_per_page": @@itemsPerPage
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
