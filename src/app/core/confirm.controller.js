angular.module('coreModule')

    .controller('coreConfirmController', [
        '$scope',
        'coreConfirmService',
        '$uibModalInstance',
        'modalData',
        function(
            $scope,
            coreConfirmService,
            $uibModalInstance,
            modalData
        ) {
            var defaultModalData = {
                heading: '',
                message: '',
                cancel: 'Cancel',
                confirm: 'Confirm'
            };
            $scope.modalData = $.extend({}, defaultModalData, modalData);

            $scope.confirm = function () {
                $uibModalInstance.close(true);
            };

        }]);
