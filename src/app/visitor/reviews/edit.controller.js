angular.module("visitorModule")

.controller("reviewsEditController", [
    "$scope",
    "$routeParams",
    "$location",
    "$q",
    "visitorApiService",
    "productApiService",
    "dashboardUtilsService",
    function (
        $scope,
        $routeParams,
        $location,
        $q,
        visitorApiService,
        productApiService,
        dashboardUtilsService
        ) {

        // Retrieve review id from url
        var reviewId = $routeParams.reviewID;

        // Redirect to reviews list if no review id
        if (!reviewId) {
            $location.path("/reviews");
        }


        visitorApiService.getReview({"reviewID": reviewId}).$promise.then(
            function (response) {
                if (response.error === null) {
                    $scope.review = response.result;
                    $scope.review.rating = $scope.review.rating.toString();

                    productApiService.getProduct({"productID": $scope.review.product_id}).$promise.then(
                        function(response) {
                            if (response.error === null) {
                                $scope.productName = response.result.name;
                            }
                        }
                    )
                } else {
                    $scope.message = dashboardUtilsService.getMessage(response);
                }
            }
        );

        // Action Back
        $scope.back = function () {
            $location.path("/reviews");
        };

        // Action Save
        $scope.save = function () {

            // Disable buttons while saving/updating
            $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

            var defer = $q.defer();

            // If review._id !== null update existing review
            if ($scope.review._id !== null) {
                $scope.review.rating = parseInt($scope.review.rating);
                var promise = visitorApiService.editReview($scope.review).$promise;

                promise.then(updateSuccess, updateError);
                // Enable buttons in any case
                promise.finally(function() {
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                });
            }

            return defer.promise;

            function updateSuccess(response) {
                // Update review data
                $scope.review = response.result;
                $scope.review.rating = $scope.review.rating.toString();

                // Show message
                $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Review was updated successfully');

                defer.resolve(response);
            }

            function updateError(response) {
                $scope.message = dashboardUtilsService.getMessage(response);
                defer.reject(response);
            }
        };

    }]);

