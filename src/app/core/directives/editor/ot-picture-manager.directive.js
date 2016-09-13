/**
*  Directive used for automatic attribute editor creation
*/
angular.module('coreModule')

.directive('otPictureManager', ['coreImageService', function (coreImageService) {
    return {
        restrict: 'E',
        templateUrl: '/views/core/directives/editor/ot-picture-manager.html',

        scope: {
            imageHandler: '=imageHandler',
            imagesFiles: '=images',
            imagesPath: '=imagesPath'
        },

        controller: function ($scope) {
            $scope.selectedImage = 0;

            $scope.getImageUrl = getImageUrl;
            $scope.selectImage = selectImage;
            $scope.uploadImage = uploadImage;
            $scope.removeImage = removeImage;
            $scope.isDefaultImage = isDefaultImage;
            $scope.setDefaultImage = setDefaultImage;


            function getImageUrl(file) {
                return file ? coreImageService.getImage($scope.imagesPath + file) : false;
            }

            function selectImage(index) {
                $scope.selectedImage = index;
            }

            function uploadImage() {
                $scope.imageHandler.imageAdd('uploadfile');
            }

            function removeImage() {
                $scope.imageHandler.imageRemove($scope.imagesFiles[$scope.selectedImage]);
                $scope.selectedImage--;
            }

            function setDefaultImage() {
                $scope.imageHandler.imageDefault($scope.imagesFiles[$scope.selectedImage]);
            }

            function isDefaultImage(index) {
                return $scope.imagesFiles[index] == $scope.imageHandler.getDefaultImage();
            }
        }
    };
}]);