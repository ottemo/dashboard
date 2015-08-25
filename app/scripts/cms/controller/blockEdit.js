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
            _id: null,
            identifier: '',
            content: '',
            created_at: '',
            updated_at: ''
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
                // instead we have empty block here
                // so we redirect to new block page
                if (response.result._id !== '') {
                    $scope.block = response.result;
                } else {
                    $location.path('/cms/block/new')
                }
            }
        );
    }

    // Action Back
    $scope.back = function () {
        $location.path("/cms/blocks");
    };

    // Action Save
    // If block._id === null then add new block, else update existing block
    $scope.save = function () {

        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

        var defer = $q.defer();

        if ($scope.block._id !== null) {
            $cmsApiService.blockUpdate($scope.block).$promise
                .then(updateSuccess, updateError);
        } else {
            $cmsApiService.blockAdd($scope.block, saveSuccess, saveError).$promise
                .then(saveSuccess, saveError);
        }

        return defer.promise;

        function updateSuccess(response) {
            $scope.block = response.result;
            $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Block was updated successfully');
            $('[ng-click="save()"]').removeClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
            defer.resolve(response);
        }

        function updateError(response) {
            $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Update error');
            defer.reject(response);
        }

        function saveSuccess(response) {
            defer.resolve(response);
            $location.path('/cms/block/' + response.result._id);
        }

        function saveError(response) {
            defer.reject(response);
            $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Save error');
        }

    };

}]);
