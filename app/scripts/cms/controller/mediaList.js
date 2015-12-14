angular.module("cmsModule")

.controller('cmsMediaListController', ['$scope', 'cmsMedia', function($scope, cmsMedia) {

    // Uploaded files
    $scope.mediaList = [];

    // File upload
    $scope.up = {
        isInProgress: false,
        files: '',
        upload: upload
    };

    activate();

    ///////////////////////////

    function activate() {
        populateMediaList();
    }

    // Retrieve any media
    function populateMediaList() {
        cmsMedia.all().then(function(mediaList) {
            $scope.mediaList = mediaList;
        });
    }

    function upload() {
        $scope.up.isInProgress = true;
        cmsMedia.add($scope.up.files).then(function(resp) {
            // TODO: If we return just the new files from this endpoint
            // we can change this to just splice the new ones in
            populateMediaList();
            $scope.up.files = '';
            $scope.up.isInProgress = false;
        });
    }

}]);

