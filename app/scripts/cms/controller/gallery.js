angular.module("cmsModule")

.controller("cmsGalleryController", [
"$scope",
"$routeParams",
"$location",
"$q",
"$cmsApiService",
"$designImageService",
function ($scope, $routeParams, $location, $q, $cmsApiService, $designImageService) {

    // variables
    var galleryImages, imagesBasePath;

    $scope.selectImage = function (filePath) {
        if (typeof filePath !== "undefined" && filePath !== "") {
            $scope.selectedImage = filePath;
        }
    };

    //-----------------
    // IMAGE FUNCTIONS
    //-----------------
    $scope.reloadImages = function () {
        // taking media patch for gallery
        $cmsApiService.galleryPath().$promise.then(
            function (response) {
                imagesBasePath = response.result || "";
        });
        // taking registered images for gallery
        $cmsApiService.galleryList().$promise.then(
            function (response) {
                galleryImages = response.result || [];
                $scope.imgPaths = [];

                // set paths to all images and default image value
                for (var i=0; i<galleryImages.length; i+=1){
                    $scope.imgPaths[[i]] = $designImageService.getFullImagePath(imagesBasePath, galleryImages[i]);
                }

                $scope.selectedImage = $scope.imgPaths[0] || "undefined";
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
        var mediaName = selected.split(imagesBasePath)[1];
        if (selected !== undefined) {
            $cmsApiService.galleryRemove({"mediaName": mediaName})
                .$promise.then(function () {
                    $scope.selectedImage = $scope.imgPaths[0];
                    $scope.reloadImages();
                });
        }
    };

    $scope.reloadImages();
}]);
