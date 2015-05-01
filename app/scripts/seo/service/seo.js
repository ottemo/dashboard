angular.module("seoModule")

.service("$seoService", [
        "$resource",
        "$seoApiService",
        "$q",
        "$dashboardUtilsService",
        function ($resource, $seoApiService, $q, $dashboardUtilsService) {

            // Variables
            var list, oldValue, seoFields;
            // Functions
            var init, find, save, update, remove, isModified, getDefaultSeo, getSeoFields, getByUrl;

            list = [];
            seoFields = ["url", "title", "meta_keywords", "meta_description"];

            getDefaultSeo = function () {
                return {
                    "url": "",
                    "title": "",
                    "meta_keywords": "",
                    "meta_description": ""
                };
            };

            init = function () {
                $seoApiService.list().$promise.then(
                    function (response) {
                        list = response.result || [];
                    }
                );
            };


            find = function (type, rewrite) {
                var i;

                for (i = 0; i < list.length; i += 1) {
                    if (list[i].type === type && list[i].rewrite === rewrite) {
                        if(typeof oldValue === "undefined") {
                            oldValue = $dashboardUtilsService.clone(list[i]);
                        }

                        return list[i];
                    }
                }

                return null;
            };

            getByUrl = function (url) {
                var defer = $q.defer();

                $seoApiService.get({"url": url}).$promise.then(
                    function (response) {
                        defer.resolve(response);
                    }
                );

                return defer.promise;
            };

            update = function (obj) {
                var defer = $q.defer();
                if (!isModified(obj)) {
                    defer.resolve(obj);
                } else {
                    $seoApiService.update({"itemID": obj._id}, obj).$promise.then(
                        function (response) {
                            var i;

                            for (i = 0; i < list.length; i += 1) {
                                if (list[i]._id === response.result._id) {
                                    list[i] = response.result;
                                    oldValue = $dashboardUtilsService.clone(list[i]);

                                    defer.resolve(list[i]);
                                }
                            }
                        }
                    );
                }

                return defer.promise;
            };

            save = function (obj) {
                var defer = $q.defer();

                if (!isModified(obj)) {
                    defer.resolve(obj);
                } else {
                    $seoApiService.add(obj).$promise.then(
                        function (response) {
                            if (response.error === null) {
                                var result = response.result || null;
                                list.push(result);
                                oldValue = $dashboardUtilsService.clone(result);
                                defer.resolve(result);
                            }
                        }
                    );
                }

                return defer.promise;
            };

            remove = function (obj) {
                var defer = $q.defer();
                $seoApiService.remove({"itemID": obj._id}, obj).$promise.then(
                    function (response) {
                        if (response.error === null) {
                            var result = response.result || null;
                            list.push(result);
                            oldValue = undefined;
                            defer.resolve(result);
                        }
                    }
                );
                return defer.promise;
            };

            isModified = function (newValue) {

                if (typeof newValue === "undefined") {
                    return false;
                }

                var result = JSON.stringify(newValue) !== JSON.stringify(oldValue);

                function compare() {
                    var defObj, i;
                    defObj = getDefaultSeo();
                    for (i = 0; i < seoFields.length; i += 1) {
                        if (defObj[seoFields[i]] !== newValue[seoFields[i]]) {
                            return true;
                        }
                    }

                    return false;
                }

                if (null === oldValue || typeof oldValue === "undefined") {
                    result = compare();
                }

                return result;
            };

            getSeoFields = function () {
                return seoFields;
            };

            return {
                "init": init,
                "find": find,
                "update": update,
                "save": save,
                "remove": remove,
                "get": getByUrl,
                "getDefaultSeo": getDefaultSeo,
                "getSeoFields": getSeoFields
            };
        }
    ]
);
