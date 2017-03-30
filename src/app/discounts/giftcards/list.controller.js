angular.module('discountsModule')

.controller('giftcardsListController', [
    '$scope',
    'giftcardsService',
    function ($scope, giftcardsService) {

        giftcardsService.giftcardList().$promise.then(function (giftcards) {
            $scope.giftcards = giftcards.result;
        });

        giftcardsService.giftcardTotal().$promise.then(function (giftcards) {
            $scope.total = giftcards.result;
        });

    }
]);
