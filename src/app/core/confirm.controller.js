angular.module('coreModule')

    .controller('coreConfirmController', [
        '$scope',
        'coreConfirmService',
        '$uibModalInstance',
        function(
            $scope,
            coreConfirmService,
            $uibModalInstance
        ) {

            $scope.modalMessage = coreConfirmService.getModalMessage();

            $scope.confirm = function () {
                $scope.confirmResp = true;
                $uibModalInstance.close($scope.confirmResp);
            };

        }]);
