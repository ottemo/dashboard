angular.module('productModule')

    .controller('productSelectImageController', [
        '$scope',
        '$uibModalInstance',
        'product',
        'productScope',
        'MEDIA_BASE_PATH',
        function(
            $scope,
            $uibModalInstance,
            product,
            productScope,
            MEDIA_BASE_PATH
        ){

        activate();

        ///////////////////////////

        function activate() {
            $scope.selectedMediaIndex;
            $scope.productScope = productScope;
        }

        $scope.getImagePath = function(mediaName) {
            return MEDIA_BASE_PATH + 'image/Product/' + product._id + '/' + mediaName;
        };

        $scope.selectImage = function(index) {
            $scope.selectedMediaIndex = index;
        };

        $scope.apply = function() {
            $uibModalInstance.close($scope.productScope.images[$scope.selectedMediaIndex]);
        }
    }]);
