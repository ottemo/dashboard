(function (define) {
    "use strict";

    /**
     *
     */
    define(["config/init"], function (configModule) {
        configModule
        /**
         *
         *
         */
            .service("$configService", [
                "$configApiService",
                "$q",
                function ($configApiService, $q) {

                    // Variables
                    var configList, configGroups;

                    // Functions
                    var getGroups, getConfigs, loadGroups;


                    getConfigs = function () {
                        return configList;
                    };

                    return {
                        "getConfigs": getConfigs,
                    };
                }]);

        return configModule;
    });

})(window.define);