angular.module("coreModule")

    .service("coreConfirmService", [
        '$uibModal',
        function ($uibModal) {

            function openModal(modalData) {
                return $uibModal.open({
                    controller: 'coreConfirmController',
                    resolve: {
                        modalData: function() { return modalData; }
                    },
                    templateUrl: "/views/core/confirm.html",
                    size: 'md'
                });
            }

            return {
                openModal: openModal
            }
        }
    ]);
