angular.module("cmsModule")

.controller("cmsBlockEditController", [
"$scope",
"$routeParams",
"$location",
"$q",
"$cmsApiService",
"$dashboardUtilsService",
function (
    $scope,
    $routeParams,
    $location,
    $q,
    $cmsApiService,
    $dashboardUtilsService
) {

    // Retrieve block id from url
    var blockId = $routeParams.id;

    // Redirect to blocks list if no block id
    if (!blockId) {
        $location.path("/cms/blocks");
    }

    // Get block attributes
    $cmsApiService.blockAttributes().$promise.then(
        function (response) {
            $scope.attributes = response.result;
        }
    );

    // Default block values
    function getDefaultBlock() {
        return {
            _id: null
        };
    }

    // Init block
    if (blockId === 'new') {
        $scope.block = getDefaultBlock();
    } else {
        $cmsApiService.blockGet({"blockID": blockId}).$promise.then(
            function (response) {
                // If we pass incorrect block ID
                // we don't have an error from server
                // instead we have empty block here (_id === '')
                if (response.result._id !== '') {
                    $scope.block = response.result;
                // so we redirect to new block page
                } else {
                    $location.path('/cms/blocks/new')
                }
            }
        );
    }

    // Action Back
    $scope.back = function () {
        $location.path("/cms/blocks");
    };

    // Action Save
    $scope.save = function () {

        // Disable buttons while saving/updating
        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

        var defer = $q.defer();

        // If block._id !== null update existing block
        if ($scope.block._id !== null) {
            var promise = $cmsApiService.blockUpdate($scope.block).$promise;

            promise.then(updateSuccess, updateError);
            // Enable buttons in any case
            promise.finally(function() {
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                });

        // else save new block
        } else {
            var promise = $cmsApiService.blockAdd($scope.block).$promise;

            promise.then(saveSuccess, saveError);
            // Enable buttons in any case
            promise.finally(function() {
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                });
        }

        return defer.promise;

        function updateSuccess(response) {
            // Update block data
            $scope.block = response.result;
            // Show message
            $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Block was updated successfully');

            defer.resolve(response);
        }

        function updateError(response) {
            $scope.message = $dashboardUtilsService.getMessage(response);
            defer.reject(response);
        }

        function saveSuccess(response) {
            // Update block data
            $scope.block = response.result;
            // Show message
            $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Block was created successfully');

            defer.resolve(response);
        }

        function saveError(response) {
            $scope.message = $dashboardUtilsService.getMessage(response);
            defer.reject(response);
        }
    };

}]);
