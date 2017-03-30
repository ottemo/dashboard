angular.module('discountsModule')

.controller('giftcardsEditController', [
    '$scope',
    'giftcardsService',
    '$routeParams',
    '$location',
    'coreConfirmService',
    'moment',
    'timezoneService',
    '$route',
    '$q',
    function($scope, giftcardsService, $routeParams, $location, coreConfirmService, moment, timezoneService, $route, $q) {

        var giftcardID = $routeParams.id;
        $scope.isEditPage = !!giftcardID;
        $scope.isCodeValidated = false;
        $scope.isCodeValid = false;
        $scope.giftcartCancelled = false;

        activate();

        //////////////////////////////////

        function activate() {
            if ($scope.isEditPage) {
                giftcardsService.giftcardGet({"giftcardID": giftcardID})
                    .$promise.then(function(response) {
                        $scope.giftcard = response.result;

                        if($scope.giftcard.status === 'cancelled'){
                            $scope.giftcartCancelled = true;
                        }

                        timezoneService.get().then(function(tz){
                            $scope.delivery_date_local = moment($scope.giftcard.delivery_date).utcOffset(tz).format('YYYY-MM-DD HH:mm');
                        });

                        $scope.getStatuses();
                        $scope.getHistory();
                    });
            } else {
                $scope.giftcard = {};
            }
        }

        $scope.save = function() {
            timezoneService.get().then(function(tz){
                $scope.giftcard.delivery_date = moment($scope.delivery_date_local + tz, 'YYYY-MM-DD HH:mm Z').toISOString();

                if ($scope.isEditPage) {
                    var cancelConfirmDeferred = $q.defer();
                    if ($scope.giftcard.status === 'cancelled') {
                        coreConfirmService.openModal({ message: 'Do you really want to cancel this gift card?' }).result
                            .then(function() {
                                cancelConfirmDeferred.resolve();
                            });
                    } else {
                        cancelConfirmDeferred.resolve();
                    }

                    cancelConfirmDeferred.promise.then(function() {
                        giftcardsService.giftcardUpdate($scope.giftcard).$promise
                            .then(function() {
                                $route.reload();
                            });
                    });

                } else {
                    giftcardsService.giftcardAdd($scope.giftcard)
                        .$promise.then(function(giftcard) {
                            $location.path('/giftcards/' + giftcard.result._id);
                        });
                }
            });
        };

        $scope.onCodeChange = function() {
            $scope.isCodeValidated = false;
        };

        $scope.validateCode = function() {
            giftcardsService.giftcardCheckCode({giftcode: $scope.giftcard.code})
                .$promise.then(function(response) {
                    $scope.isCodeValidated = true;
                    $scope.isCodeValid = response.result;
                });
        };

        $scope.generateCode = function() {
            giftcardsService.giftcardGenerateCode()
                .$promise.then(function(response) {
                    $scope.isCodeValidated = false;
                    $scope.giftcard.code = response.result;
                });
        };

        $scope.closeMessage = function() {
            $scope.isCodeValidated = false;
        };

        $scope.getHistory = function() {
            giftcardsService.giftcardHistory({"giftcardID": giftcardID})
                .$promise.then(function(giftcard) {
                    $scope.giftcardHistory = giftcard.result;
                });
        };

        // get available and disabled statuses
        $scope.getStatuses = function(){
            $scope.statuses = [
                {
                    value: 'new',
                    label: 'New',
                    isDisabled: true
                },
                {
                    value: 'applied',
                    label: 'Applied',
                    isDisabled: true
                },
                {
                    value: 'used',
                    label: 'Used',
                    isDisabled: true
                },
                {
                    value: 'negative',
                    label: 'Negative',
                    isDisabled: true
                },
                {
                    value: 'refilled',
                    label: 'Refilled',
                    isDisabled: true
                },
                {
                    value: 'delivered',
                    label: 'Delivered',
                    isDisabled: true
                },
                {
                    value: 'cancelled',
                    label: 'Cancelled',
                    isDisabled: false
                }
            ];

            // make an available status if it is active
            angular.forEach($scope.statuses, function(status) {
                if(status.value === $scope.giftcard.status) {
                    status.isDisabled = false;
                }
            });
        }
    }
]);

