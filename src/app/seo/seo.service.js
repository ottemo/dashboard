angular.module("seoModule")

.service("seoService", [
        "$resource",
        "seoApiService",
        "$q",
        "dashboardUtilsService",
        function ($resource, seoApiService, $q, dashboardUtilsService) {

            var oldValue;

            var list = [];
            var seoFields = ["url", "title", "meta_keywords", "meta_description"];

            function getDefaultSeo() {
                return {
                    "url": "",
                    "title": "",
                    "meta_keywords": "",
                    "meta_description": ""
                };
            }

            function init() {
                var params = {
                    extra: 'url,title,meta_keywords,meta_description,rewrite,type'
                };

                return seoApiService.listSeo(params).$promise.then(
                    function (response) {
                        list = response.result || [];
                        angular.forEach(list, function(seoItem) {
                            seoItem._id = seoItem.ID;
                            angular.forEach(seoItem.Extra, function(seoField, key) {
                                seoItem[key] = seoField;
                            });
                        });
                    }
                );
            }

            function find(type, rewrite) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].type === type &&
                        list[i].rewrite === rewrite) {

                        if (oldValue === undefined) {
                            oldValue = dashboardUtilsService.clone(list[i]);
                        }

                        return list[i];
                    }
                }

                return null;
            }

            function canonical(id) {
                return seoApiService.canonical({"id": id}).$promise;
            }

            function update(seoItem) {
                var deferred = $q.defer();

                if (!isModified(seoItem)) {
                    deferred.resolve(seoItem);
                } else {
                    seoApiService.update({"itemID": seoItem._id}, seoItem).$promise.then(
                        function (response) {
                            for (var i = 0; i < list.length; i++) {
                                if (list[i]._id === response.result._id) {
                                    list[i] = response.result;
                                    oldValue = dashboardUtilsService.clone(list[i]);

                                    deferred.resolve(list[i]);
                                }
                            }
                        }
                    );
                }

                return deferred.promise;
            }

            function save(seoItem) {
                var defer = $q.defer();

                if (!isModified(seoItem)) {
                    defer.resolve(seoItem);
                } else {
                    seoApiService.add(seoItem).$promise.then(
                        function (response) {
                            if (response.error === null) {
                                var result = response.result || null;
                                list.push(result);
                                oldValue = dashboardUtilsService.clone(result);
                                defer.resolve(result);
                            }
                        }
                    );
                }

                return defer.promise;
            }

            function remove(obj) {
                var defer = $q.defer();
                seoApiService.remove({"itemID": obj._id}, obj).$promise.then(
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
            }

            function isModified(newValue) {

                if (newValue === undefined) {
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
            }

            function getSeoFields() {
                return seoFields;
            }

            return {
                "init": init,
                "find": find,
                "update": update,
                "save": save,
                "remove": remove,
                "canonical": canonical,
                "getDefaultSeo": getDefaultSeo,
                "getSeoFields": getSeoFields
            };
        }
    ]
);
