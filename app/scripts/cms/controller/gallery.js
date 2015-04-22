(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsGalleryController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$cmsApiService",
                "$designImageService",
                function ($scope, $routeParams, $location, $q, $cmsApiService, $designImageService) {

                    // functions
                    var splitBy, addPath;
                    // variables
                    var galleryImages, imagesPerRow;

                    imagesPerRow = 6;

                    addPath = function(images) {
                        var i, result = {};

                        for (i=0; i<images.length; i+=1){
                            result[images[i]] = $designImageService.getFullImagePath($scope.imagesPath, images[i]);
                        }

                        return result;
                    };

                    // function to split array on rows by x-elements
                    splitBy = function (arr, x) {
                        var result = [], row = [], i = 0;

                        for (var idx in arr) {
                            if (arr.hasOwnProperty(idx)) {
                                i += 1;
                                row.push(arr[idx]);
                                if (i % x === 0) {
                                    result.push(row);
                                    i = 0;
                                    row = [];
                                }
                            }
                        }
                        if (i !== 0) {
                            result.push(row);
                        }
                        return result;
                    };

                    $scope.selectImage = function (filename) {
                    if (typeof filename !== "undefined" && filename !== "") {
                            $scope.selectedImage = filename;
                            if(!$scope.fullVersion) {
                                var args = {};
                                args[filename] = $scope.redyImages[filename];
                                top.tinymce.activeEditor.windowManager.setParams(args);
                            }
                        }

                    };

                    //-----------------
                    // IMAGE FUNCTIONS
                    //-----------------
                    $scope.reloadImages = function () {
                        // taking media patch for gallery
                        $cmsApiService.galleryPath().$promise.then(
                            function (response) {
                                $scope.imagesPath = response.result || "";
                        });
                        // taking registered images for gallery
                        $cmsApiService.galleryList().$promise.then(
                            function (response) {
                                galleryImages = response.result || [];
                                $scope.splitedImages = splitBy(galleryImages, imagesPerRow);

                                $scope.selectedImage = galleryImages[0] || "undefined";

                                $scope.redyImages = addPath(galleryImages);
                        });
                    };

                    /**
                     * Adds file to gallery
                     *
                     * @param fileElementId
                     */
                    $scope.imageAdd = function (fileElementId) {

                        var file = document.getElementById(fileElementId);
                        if (file !== undefined){
                            var mediaName = file.files[0].name;
                            var postData = new FormData();
                            postData.append("file", file.files[0]);
                            $cmsApiService.galleryAdd({"mediaName": mediaName}, postData)
                                .$promise.then(function () {
                                    $scope.reloadImages();
                            });
                        }
                    };
                    /**
                     * Removes image from gallery (from gallery folder) and sends request to saves
                     *
                     * @param {string} selected - image name
                     */
                    $scope.imageRemove = function (selected) {
                        var mediaName = selected;
                        if (selected !== undefined) {
                            $cmsApiService.galleryRemove({"mediaName": mediaName})
                                .$promise.then(function () {
                                    $scope.selectedImage = undefined;
                                    $scope.reloadImages();
                                });
                        }
                    };

                    $scope.loadMini = function () {
                        if (!$scope.fullVersion){
                            var deletedId = ["header_sidebar", "header_no_sidebar", "theme_container", "code_container"];
                            for (var i = 0; i < deletedId.length; i+= 1){
                                if (document.getElementById(deletedId[i]) !== null) {
                                    document.getElementById(deletedId[i]).remove();
                                }
                            }
                        }
                    };

                    // for mini version of page
                    $scope.fullVersion = true;
                        if (typeof $routeParams["mini"] !== "undefined"){
                            $scope.fullVersion = false;
                        }

                    $scope.reloadImages();
                }
            ]
        );

        return cmsModule;
    });
})(window.define, jQuery);
