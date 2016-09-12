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
    console.log('pageUploadCtrl');

    ///////////////////////////

    function activate() {
        populateMediaList();
    }

    // Retrieve any media
    function populateMediaList() {
        cmsMedia.all().then(function(mediaList) {
            $scope.mediaList = mediaList;
            console.log(mediaList);
        });
    }

    function upload() {
        console.log('upload');
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

    $scope.progress = 0;
    $scope.files = [];

    $scope.insert = function(url){
        if($scope.selectedMediaIndex !== undefined){
            $uibModalInstance.close($scope.mediaList[$scope.selectedMediaIndex].url);
        }
        if(url){
            console.log(url);
            $uibModalInstance.close(url);
        }
    };

    $scope.selectImage = function(index) {
        if($scope.selectedMediaIndex === index){
            $scope.selectedMediaIndex = undefined;
        }else{
            $scope.selectedMediaIndex = index;
        }
    };

    $scope.selectedImage = function(){
        if($(".media-list .panel").hasClass("img-border")){
            return false;
        }else {
            return true;
        }
    }

    $scope.insertImg = function() {
        var url = $scope.externalImageUrl;
        if (url && url !== ''){
            $scope.insert(url);
        }
    };

}]);
