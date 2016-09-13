angular.module("cmsModule")

    .controller('cmsMediaListController', [
        '$scope',
        'cmsMedia',
        "$location",
        "$q",
        "cmsApiService",
        function($scope, cmsMedia, $location, $q, cmsApiService) {

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
                return cmsMedia.all().then(function(mediaList) {
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

            $scope.selectImage = function(index) {
                if($scope.selectedMediaIndex === index){
                    $scope.selectedMediaIndex = undefined;
                }else{
                    $scope.selectedMediaIndex = index;
                }


            };

            /**
             * Disable button "delete image" if no image is selected
             *
             */
            $scope.selectedImage = function(){
                if($(".media-list .panel").hasClass("img-border")){
                    return false;
                }else {
                    return true;
                }
            }

            /**
             * Removes image by Name
             *
             */
            $scope.removeImage = function () {
                if ($scope.selectedMediaIndex !== undefined) {
                    var answer = window.confirm("You really want to remove this image?");
                    if(answer){
                        cmsApiService.imageRemove({"mediaName": $scope.mediaList[$scope.selectedMediaIndex].name}).$promise
                            .then(populateMediaList)
                            .then(function() {
                                $scope.up.message = {message: 'The image was removed!'};
                            });
                    }
                }
            };

        }]);
