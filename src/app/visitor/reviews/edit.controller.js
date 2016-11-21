angular.module("visitorModule")

.controller("reviewsEditController", [
    "$scope",
    "$routeParams",
    "$location",
    "$q",
    "visitorApiService",
    "dashboardUtilsService",
    function (
        $scope,
        $routeParams,
        $location,
        $q,
        visitorApiService,
        dashboardUtilsService
        ) {

        // Retrieve review id from url
        var reviewId = $routeParams.reviewID;

        // Redirect to reviews list if no review id
        if (!reviewId) {
            $location.path("/reviews");
        }

        // Get review attributes
        $scope.attributes = [
            {
                Attribute: "_id",
                Collection:"review",
                Default:"",
                Editors:"not_editable",
                Group:"General",
                IsLayered:false,
                IsPublic:false,
                IsRequired:false,
                IsStatic:true,
                Label:"ID",
                Model:"Review",
                Options:"",
                Type:"id",
                Validators:"",
                Value:""
            },
            {
                Attribute:"approved",
                Collection:"review",
                Default:"",
                Editors:"boolean",
                Group:"General",
                IsLayered:false,
                IsPublic:false,
                IsRequired:true,
                IsStatic:true,
                Label:"Is approved",
                Model:"Review",
                Options:"",
                Type:"bool",
                Validators:"",
                Value:""
            },
            {
                Attribute:"username",
                Collection:"review",
                Default:"",
                Editors:"not_editable",
                Group:"General",
                IsLayered:false,
                IsPublic:false,
                IsRequired:false,
                IsStatic:true,
                Label:"User Name",
                Model:"Review",
                Options:"",
                Type:"text",
                Validators:"",
                Value:""
            },
            {
                Attribute:"rating",
                Collection:"review",
                Default:"",
                Editors:"select",
                Group:"General",
                IsLayered:false,
                IsPublic:false,
                IsRequired:true,
                IsStatic:true,
                Label:"Rating",
                Model:"Review",
                Options:'{"1":"1","2":"2","3":"3","4":"4","5":"5"}',
                Type:"text",
                Validators:"",
                Value:""
            },
            {
                Attribute:"created_at",
                Collection:"review",
                Default:"",
                Editors:"not_editable",
                Group:"General",
                IsLayered:false,
                IsPublic:false,
                IsRequired:false,
                IsStatic:true,
                Label:"Created at",
                Model:"Review",
                Options:"",
                Type:"datetime",
                Validators:"",
                Value:""
            },
            {
                Attribute:"review",
                Collection:"review",
                Default:"",
                Editors:"html",
                Group:"General",
                IsLayered:false,
                IsPublic:false,
                IsRequired:true,
                IsStatic:true,
                Label:"Review",
                Model:"Review",
                Options:"",
                Type:"text",
                Validators:"",
                Value:""
            }
        ];


        visitorApiService.getReview({"reviewID": reviewId}).$promise.then(
            function (response) {
                $scope.review = response.result;
                $scope.review.rating = $scope.review.rating.toString();
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

