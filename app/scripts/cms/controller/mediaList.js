angular.module("cmsModule")

.controller('cmsMediaListController', ['$scope', 'cmsMedia', function($scope, cmsMedia) {

    $scope.media = [];

    // File upload
    $scope.files;
    $scope.upload = upload;

    activate();

    ///////////////////////////

    function activate() {

        // Retrieve any media
        cmsMedia.all().then(function(media) {
            console.log('ctrl cmsMedia@all ', media)
            $scope.media = media;
        });
    }

    function upload() {
        cmsMedia.add($scope.files).then(function(resp) {
            //TODO: cleanup
            console.log('ctrl upload resp: ', resp)

            //TODO: push new records in
        });
    }

}]);

