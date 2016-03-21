angular.module("configModule")
/**
*
*/
.service("$configService", [
    "$configApiService",
    "$q",
    function ($configApiService, $q) {

        // Variables
        var isInit, configGroups, configTabs, items, itemsOld, isLoaded;

        // Functions
        var init, load, save, getConfigTabs, getItems, addTab, addGroup, checkOnDups;

        items = {};
        itemsOld = {};
        isLoaded = {};

        getConfigTabs = function (group) {
            if (typeof group !== "undefined" && typeof configTabs[group] !== "undefined") {
                return configTabs[group];
            } else if (typeof group === "undefined") {
                return configTabs;
            }

            return [];
        };

        getItems = function (path) {
            if (typeof path !== "undefined" && typeof items[path] !== "undefined") {
                return items[path];

            } else if (typeof path === "undefined") {
                return items;
            }
            return false;
        };

        addGroup = function (attr) {
            var groupCode, isExist;

            isExist = function (group) {
                var i;
                for (i = 0; i < configGroups.length; i += 1) {
                    if (configGroups[i].Id === group) {
                        return true;
                    }
                }

                return false;
            };

            groupCode = attr.Path.substr(0, (-1 === attr.Path.indexOf(".") ? attr.Path.length : attr.Path.indexOf(".")));

            if (!isExist(groupCode) && (-1 === attr.Path.indexOf("."))) {
                configGroups.push({
                    "Id": groupCode,
                    "Name": attr.Label
                });

            }
        };

        addTab = function (attr) {
            var groupCode, regExp, parts;
            regExp = new RegExp("(\\w+)\\.(\\w+).*", "i");

            groupCode = attr.Path.substr(0, (-1 === attr.Path.indexOf(".") ? attr.Path.length : attr.Path.indexOf(".")));
            if (typeof configTabs[groupCode] === "undefined") {
                configTabs[groupCode] = [];
            }

            if (-1 !== attr.Path.indexOf(".") && attr.Type === "group") {
                parts = attr.Path.match(regExp);
                if (typeof parts[2] !== "undefined") {
                    attr.Group = parts[2];
                    configTabs[groupCode].push(attr);
                }
            }
        };

        init = function () {
            if (isInit) {
                return isInit.promise;
            }
            isInit = $q.defer();
            configTabs = {};
            configGroups = [];

            $configApiService.getGroups().$promise.then(
                function (response) {
                    var result, attr;
                    result = response.result || [];
                    for (var i = 0; i < result.length; i += 1) {
                        attr = result[i];
                        addGroup(attr);
                        addTab(attr);
                    }
                    isInit.resolve(true);

                }
            );

            return isInit.promise;
        };

        checkOnDups = function (group, path, force) {
            if (force && configTabs[group]) {
                for (var pos = 0; pos < configTabs[group].length; pos += 1) {
                    if (path === configTabs[group][pos].Path) {
                        configTabs[group].splice(pos, 1);
                        return pos;
                    }
                }
            }
        };

        load = function (path, force) {
            var i, pos, regExp, parts, group, defer;
            defer = $q.defer();
            regExp = new RegExp("(\\w+)\\.(\\w+).*", "i");

            if ((typeof items[path] === "undefined" && !force) || force) {
                items[path] = {};
                itemsOld[path] = {};
            }

            if ((typeof isLoaded[path] === "undefined" && !force) || force) {
                $configApiService.getInfo({"path": path}).$promise.then(
                    function (response) {

                        var addAttributeInTab = function (attr) {
                            pos = checkOnDups(group, attr.Path, true);

                            if (configTabs[group]){
                                if (pos) {
                                    configTabs[group].splice(pos, 0, attr);
                                } else {
                                    configTabs[group].push(attr);
                                }
                            }

                        };

                        //TODO: We are messing up the sort here
                        for (i = 0; i < response.result.length; i += 1) {
                            if (response.result[i].Type !== "group") {

                                parts = response.result[i].Path.match(regExp);
                                group = parts[1];

                                response.result[i].Attribute = response.result[i].Path;
                                response.result[i].Group = parts[2];
                                response.result[i].Editors = response.result[i].Editor;
                                delete response.result[i].Editor;

                                addAttributeInTab(response.result[i]);

                                // TODO: Specifically here
                                items[path][response.result[i].Path] = response.result[i].Value;
                                itemsOld[path][response.result[i].Path] = response.result[i].Value;
                            }
                        }

                        isLoaded[path] = true;
                        defer.resolve(true);
                    }
                );
            } else {
                isLoaded[path] = true;
                defer.resolve(true);
            }

            return defer.promise;
        };

        save = function (path) {
            var field, defer, qtyChangedItems, qtySavedItems;
            qtyChangedItems = 0;
            qtySavedItems = 0;
            defer = $q.defer();

            var _save = function (field) {
                var defer = $q.defer();

                $configApiService.setPath({
                    "path": field,
                    "value": items[path][field]
                }).$promise.then(function (response) {
                        qtySavedItems += 1;
                        if (response.error === null) {
                            itemsOld[path][field] = items[path][field];
                        }
                        defer.resolve(response);
                    }
                ); // jshint ignore:line

                return defer.promise;
            };
            var callback = function () {
                if (qtyChangedItems === qtySavedItems) {
                    defer.resolve(true);
                }
            };
            for (field in items[path]) {
                if (items[path].hasOwnProperty(field) && items[path][field] !== itemsOld[path][field]) {
                    qtyChangedItems += 1;
                    _save(field).then(callback);

                }
            }
            return defer.promise;
        };

        return {
            "init": init,
            "load": load,
            "save": save,
            "getItems": getItems,
            "getConfigTabs": getConfigTabs
        };
    }]);
