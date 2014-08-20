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
                    var configGroups, configSection, items, itemsOld, attributes;

                    // Functions
                    var init, load, save, getConfigGroups, getConfigSection, getAttributes, getItems;

                    items = {};
                    itemsOld = {};
                    attributes = {};

                    getConfigGroups = function () {
                        return configGroups;
                    };

                    getConfigSection = function (group) {
                        if (typeof group !== "undefined" && typeof configSection[group] !== "undefined") {
                            return configSection[group];

                        } else if (typeof group === "undefined") {
                            return configSection;
                        }
                        return false;
                    };

                    getAttributes = function (path) {
                        if (typeof path !== "undefined" && typeof attributes[path] !== "undefined") {
                            return attributes[path];

                        } else if (typeof path === "undefined") {
                            return attributes;
                        }
                        return false;
                    };

                    getItems = function (path) {
                        if (typeof path !== "undefined" && typeof items[path] !== "undefined") {
                            return items[path];

                        } else if (typeof path === "undefined") {
                            return items;
                        }
                        return false;
                    };

                    init = function () {

                        configSection = {};
                        configGroups = [];

                        $configApiService.getGroups().$promise.then(
                            function (response) {// jshint ignore:line
                                var i, j, parts, group, regExp, isExist, result;
                                isExist = false;
                                result = response.result || [];

                                if (result.length > 0) {
                                    regExp = new RegExp("(\\w+)\\.(\\w+).+", "i");
                                    for (i = 0; i < result.length; i += 1) {
                                        parts = result[i].Path.match(regExp);
                                        group = parts[1];

                                        for (j = 0; j < configGroups.length; j += 1) {
                                            isExist = false;
                                            if (configGroups[j].Name === group) {
                                                isExist = true;
                                            }
                                        }
                                        if (!isExist) {
                                            configGroups.push({
                                                "Name": group,
                                                "Id": group,
                                                "IsStatic": true
                                            });
                                        }

                                        if (typeof configSection[group] === "undefined") {
                                            configSection[group] = [];
                                        }
                                        configSection[group].push({
                                            "Name": result[i].Label,
                                            "Code": parts[2],
                                            "Path": result[i].Path
                                        });
                                    }
                                    console.warn(configSection);
                                }
                            }
                        );
                    };

                    load = function (path, force) {
                        var i;

                        if ((typeof items[path] === "undefined" && !force) || force) {
                            items[path] = {};
                            itemsOld[path] = {};
                        }

                        if ((typeof attributes[path] === "undefined" && !force) || force) {
                            $configApiService.getInfo({"path": path}).$promise.then(
                                function (response) {
                                    attributes[path] = [];
                                    for (i = 0; i < response.result.length; i += 1) {
                                        if (response.result[i].Type !== "group") {
                                            response.result[i].Attribute = response.result[i].Path;
                                            attributes[path].push(response.result[i]);
                                            items[path][response.result[i].Path] = response.result[i].Value;
                                            itemsOld[path][response.result[i].Path] = response.result[i].Value;
                                        }
                                    }
                                }
                            );
                        }
                    };

                    save = function (path) {
                        var field, defer, qtyChangedItems, qtySavedItems;
                        qtyChangedItems = 0;
                        qtySavedItems = 0;
                        defer = $q.defer();

                        for (field in items[path]) {
                            if (items[path].hasOwnProperty(field)) {
                                if (items[path][field] !== itemsOld[path][field]) {
                                    qtyChangedItems += 1;
                                    $configApiService.setPath({
                                        "path": field,
                                        "value": items[path][field]
                                    }).$promise.then(
                                        function (response) {
                                            qtySavedItems += 1;
                                            if (response.error === "") {
                                                itemsOld[path][field] = items[path][field];
                                            }
                                            if (qtyChangedItems === qtySavedItems) {
                                                defer.resolve(true);
                                            }
                                        }
                                    ); // jshint ignore:line
                                }
                            }
                        }
                        return defer.promise;
                    };

                    return {
                        "init": init,
                        "load": load,
                        "save": save,
                        "getItems": getItems,
                        "getAttributes": getAttributes,
                        "getConfigGroups": getConfigGroups,
                        "getConfigSection": getConfigSection
                    };
                }]);

        return configModule;
    });

})(window.define);
