angular.module("cmsModule")

.controller('cmsImagesListController', ['$scope', 'cmsImages', function($scope, cmsImages) {
    $scope.images = [];
    $scope.files;
    $scope.upload = upload;

    activate();

    ///////////////////////////

    function activate() {
        cmsImages.all().then(function(images) {
            $scope.images = images;
        });
    }

    function upload() {
        cmsImages.add($scope.files).then(function(resp) {
            console.log('ctrl done ', resp)
        });
    }

}]);

