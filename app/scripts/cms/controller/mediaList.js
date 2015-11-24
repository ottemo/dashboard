angular.module("cmsModule")

.controller('cmsMediaListController', ['$scope', 'cmsMedia', function($scope, cmsMedia) {

    $scope.media = [];
    $scope.remove = remove;

    // File upload
    $scope.files;
    $scope.upload = upload;

    activate();

    ///////////////////////////

    function activate() {

        // Retrieve any media
        cmsMedia.all().then(function(media) {
            $scope.media = media;
        });
    }

    function upload() {
        cmsMedia.add($scope.files).then(function(resp) {
            //TODO: cleanup
            console.log('ctrl done ', resp)

            //TODO: push new records in
        });
    }

    function remove(index) {
        //TODO: CLEANUP
        console.log('would remove');
        var medium = $scope.media.splice(index, 1)[0];

        //TODO: implement and test
        // cmsMedia.remove(medium._id ).then(function(resp){
        //     console.log('rm resp: ', resp);
        // });
    }

}]);

