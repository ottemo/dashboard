(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .service("$galleryService", [
                "$q",
                "$cmsApiService",
                function ($q, $cmsApiService) {

                    // Variables
                    var list, path;
                    // Functions
                    var init, getList, getPath, getImage, uploadImage, deleteImage;

                    list = [];
                    path = "";

                    init = function () {
                        $cmsApiService.galleryList().$promise.then(
                            function (response) {
                                list = response.result || [];
                            });
                    };

                    getList = function() {
                        return list;
                    };

                    getPath = function () {
                        var defer = $q.defer();

                        $cmsApiService.galleryPath().$promise.then(
                            function (response) {
                                path = response.result || "";
                                defer.resolve(path);
                            });

                        return defer.promise;
                    };

                    getImage = function(mediaName) {
                        var defer = $q.defer();
                        $cmsApiService.galleryGet({"mediaName": mediaName}).$promise.then(
                            function (response) {
                                var result = response.result || null;
                                defer.resolve(result);
                            });

                        return defer.promise;
                    };

                    uploadImage = function (fileElementId) {
                        var defer = $q.defer();
                        var file = document.getElementById(fileElementId);
                        var mediaName = file.files[0].name;
                        var postData = new FormData();
                        postData.append("file", file.files[0]);

                        $cmsApiService.galleryAdd({"mediaName": mediaName}, postData).$promise.then(
                            function (response) {
                                var result = response.result || null;
                                defer.resolve(result);
                            });

                        return defer.promise;
                    };

                    deleteImage = function(mediaName) {
                        var defer = $q.defer();
                        $cmsApiService.galleryRemove({"mediaName": mediaName}).$promise.then(
                            function (response) {
                                var result = response.result || null;
                                defer.resolve(result);
                            });

                        return defer.promise;
                    };



                    return {
                        "init": init,
                        "getList": getList,
                        "getPath": getPath,
                        "getImage": getImage,
                        "uploadImage": uploadImage,
                        "deleteImage": deleteImage
                    };
                }

            ]
        );

        return cmsModule;
    });
})(window.define, jQuery);
