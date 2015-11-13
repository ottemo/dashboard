angular.module("cmsModule")

.controller('cmsImagesListController', ['$scope', 'cmsImages', function($scope, cmsImages) {
    // Manipulating the images
    $scope.images = [];
    $scope.remove = remove;

    // File upload
    $scope.files;
    $scope.upload = upload;

    activate();

    ///////////////////////////

    function activate() {

        // Retrieve any images
        cmsImages.all().then(function(images) {
            $scope.images = images;
        });
    }

    function upload() {
        cmsImages.add($scope.files).then(function(resp) {
            //TODO: cleanup
            console.log('ctrl done ', resp)

            //TODO: push new records in
        });
    }

    function remove(index) {
        //TODO: CLEANUP
        console.log('would remove');
        var img = $scope.images.splice(index, 1)[0];
        //TODO: implement and test
        // cmsImages.remove(img._id ).then(function(resp){
        //     console.log('rm resp: ', resp);
        // });
    }

}]);

