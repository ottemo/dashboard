(function (define) {
    "use strict";

    /**
     *
     */
    define(["seo/init"], function (seoModule) {
        seoModule
        /**
         *
         */
            .service("$seoService", [
                "$resource",
                "$seoApiService",
                "$q",
                function ($resource, $seoApiService, $q) {

                    var list;
                    var init, find, save, update, remove;

                    list = [];

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
                                return list[i];
                            }
                        }

                        return null;
                    };

                    update = function (obj) {
                        var defer = $q.defer();
                        $seoApiService.update({"id": obj._id}, obj).$promise.then(
                            function (response) {
                                var i;

                                for (i = 0; i < list.length; i += 1) {
                                    if (list[i]._id === response.result._id) {
                                        list[i] = response.result;
                                        defer.resolve(list[i]);
                                    }
                                }
                            }
                        );
                        return defer.promise;
                    };

                    save = function (obj) {
                        var defer = $q.defer();
                        $seoApiService.add(obj).$promise.then(
                            function (response) {
                                if (response.error === "") {
                                    var result = response.result || null;
                                    list.push(result);

                                    defer.resolve(result);
                                }
                            }
                        );
                        return defer.promise;
                    };

                    remove = function (obj) {
                        var defer = $q.defer();
                        $seoApiService.remove({"id": obj._id}, obj).$promise.then(
                            function (response) {
                                if (response.error === "") {
                                    var result = response.result || null;
                                    list.push(result);

                                    defer.resolve(result);
                                }
                            }
                        );
                        return defer.promise;
                    };

                    return {
                        "init": init,
                        "find": find,
                        "update": update,
                        "save": save,
                        "remove": remove
                    };
                }
            ]
        );

        return seoModule;
    });

})(window.define);