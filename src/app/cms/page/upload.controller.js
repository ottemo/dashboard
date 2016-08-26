angular.module("cmsModule")

    .controller('cmsPageUploadController', ['$scope', 'cmsMedia', '$uibModalInstance', function($scope, cmsMedia, $uibModalInstance){

    // Uploaded files
    $scope.mediaList = [];

    // File upload
    $scope.up = {
        isInProgress: false,
        files: '',
        message: undefined,
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
        $scope.up.message = undefined;

        cmsMedia.add($scope.up.files).then(function(resp) {
            // TODO: If we return just the new files from this endpoint
            // we can change this to just splice the new ones in
            populateMediaList();

            $scope.up.files = '';
            $scope.up.isInProgress = false;
            $scope.up.message = {message: 'Upload complete!'};
        });
    }

    $scope.image = "/images/image-icon.png";

    $scope.progress = 0;
    $scope.files = [];

    $scope.insert = function(){
        $uibModalInstance.close($scope.image);
    };

    $scope.insertImage = function(url,event) {

        $(event.target).closest('.col-xs-6').siblings().children().removeClass('img-border');
        $(event.target).closest('.col-xs-6').children().toggleClass('img-border');
        if($(event.target).closest('.col-xs-6').children().hasClass('img-border')){
            $scope.image = url;
        }
        else {
            $scope.image = "/images/image-icon.png"
        }
    };

}]);
