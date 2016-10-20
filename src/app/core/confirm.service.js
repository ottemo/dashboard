angular.module("coreModule")

.service("coreConfirmService", [
    '$uibModal',
    function(
        $uibModal
    ) {
        var modalMessage;

        function openModal(text){
            modalMessage = text;
            return $uibModal.open({
                controller: 'coreConfirmController',
                templateUrl: "/views/core/confirm.html",
                size: 'md'
            }).result;
        }

        function getModalMessage() {
            return modalMessage;
        }

        return {
            openModal: openModal,
            getModalMessage: getModalMessage
        }
    }
]);
