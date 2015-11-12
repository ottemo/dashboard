angular.module("cmsModule")

.controller('cmsImagesListController', ['$scope', 'cmsImages', function ($scope, cmsImages) {
    $scope.images = [];

    activate();

    ///////////////////////////

    function activate() {
        cmsImages.all().then(function(images) {
            $scope.images = images;
        });
    }
}]);
