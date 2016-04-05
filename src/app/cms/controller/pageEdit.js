
angular.module("cmsModule")

.controller("cmsPageEditController", [
"$scope",
"$routeParams",
"$location",
"$q",
"cmsApiService",
"dashboardUtilsService",
function (
    $scope,
    $routeParams,
    $location,
    $q,
    cmsApiService,
    dashboardUtilsService
) {

    // Initialize SEO
    $scope.initSeo("page");

    // Retrieve page id from url
    var pageId = $routeParams.id;

    // Redirect to pages list if no page id
    if (!pageId) {
        $location.path("/cms/pages");
    }

    // Get page attributes
    cmsApiService.pageAttributes().$promise.then(
        function (response) {
            $scope.attributes = response.result;
        }
    );

    // Default page values
    function getDefaultPage() {
        return {
            _id: null
        };
    }

    // Init page
    if (pageId === 'new') {
        $scope.page = getDefaultPage();
    } else {
        cmsApiService.pageGet({"pageID": pageId}).$promise.then(
            function (response) {
                // If we pass incorrect page ID
                // we don't have an error from server
                // instead we have empty page here (_id === '')
                if (response.result._id !== '') {
                    $scope.page = response.result;
                // so we redirect to new page page
                } else {
                    $location.path('/cms/pages/new')
                }
            }
        );
    }

    // Action Back
    $scope.back = function () {
        $location.path("/cms/pages");
    };

    // Action Save
    $scope.save = function () {

        // Disable buttons while saving/updating
        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

        var defer = $q.defer();

        // If page._id !== null update existing page
        if ($scope.page._id !== null) {
            var promise = cmsApiService.pageUpdate($scope.page).$promise;

            promise.then(updateSuccess, updateError);
            // Enable buttons in any case
            promise.finally(function() {
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                });

        // else save new page
        } else {
            var promise = cmsApiService.pageAdd($scope.page).$promise;

            promise.then(saveSuccess, saveError);
            // Enable buttons in any case
            promise.finally(function() {
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                });
        }

        return defer.promise;

        function updateSuccess(response) {
            // Update page data
            $scope.page = response.result;
            // Show message
            $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Page was updated successfully');

            defer.resolve(response);
        }

        function updateError(response) {
            $scope.message = dashboardUtilsService.getMessage(response);
            defer.reject(response);
        }

        function saveSuccess(response) {
            // Update page data
            $scope.page = response.result;
            // Show message
            $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Page was created successfully');

            defer.resolve(response);
        }

        function saveError(response) {
            $scope.message = dashboardUtilsService.getMessage(response);
            defer.reject(response);
        }
    };

}]);
