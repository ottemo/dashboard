angular.module("coreModule")

.service("coreConfirmService", [
    '$uibModal',
    function(
        $uibModal
    ) {
        var modalMessage, getModalMessage, openModal;

        openModal = function(text){
            modalMessage = text;
            return $uibModal.open({
                controller: 'coreConfirmController',
                templateUrl: "/views/core/confirm.html",
                size: 'md'
            }).result;
        }

        getModalMessage = function() {
            return modalMessage;
        }

        return {
            openModal: openModal,
            getModalMessage: getModalMessage
        }
    }
]);
