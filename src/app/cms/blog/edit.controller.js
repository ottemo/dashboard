angular.module("cmsModule")

    .controller("cmsBlogEditController", [
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
            if (typeof $scope.initSeo === 'function') {
                $scope.initSeo('post');
            }

            // Retrieve blog id from url
            var postId = $routeParams.id;

            // Redirect to blogs list if no blog id
            if (!postId) {
                $location.path("/cms/posts");
            }

            // Default blog values
            function getDefaultBlog() {
                return {
                    _id: null
                };
            }

            var attrPromise = cmsApiService.blogAttributes().$promise;
            var postPromise;
            if (postId === 'new') {
                postPromise = { error: null, result: getDefaultBlog() };
            } else {
                postPromise = cmsApiService.blogGet({"postID": postId}).$promise;
            }

            $q.all([attrPromise, postPromise]).then(function(reponses) {
                var attrResponse = reponses[0];
                var postResponse = reponses[1];
                if (attrResponse.error === null && postResponse.error === null) {
                    $scope.attributes = attrResponse.result;
                    $scope.post = postResponse.result;
                }
            });

            // Action Back
            $scope.back = function () {
                $location.path("/cms/blogs");
            };

            // Action Save
            $scope.save = function () {

                // Disable buttons while saving/updating
                $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

                var defer = $q.defer();

                // If blog._id !== null update existing blog
                if ($scope.post._id !== null) {

                    delete $scope.post.extra;
                    var promise = cmsApiService.blogUpdate($scope.post).$promise;

                    promise.then(updateSuccess, updateError);
                    // Enable buttons in any case
                    promise.finally(function() {
                        $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                        $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                    });

                    // else save new blog
                } else {
                    var promise = cmsApiService.blogAdd($scope.post).$promise;

                    promise.then(saveSuccess, saveError);
                    // Enable buttons in any case
                    promise.finally(function() {
                        $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                        $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                    });
                }

                return defer.promise;

                function updateSuccess(response) {
                    // Update blog data
                    $scope.post = response.result;
                    // Show message
                    $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Blog was updated successfully');

                    defer.resolve(response);
                }

                function updateError(response) {
                    $scope.message = dashboardUtilsService.getMessage(response);
                    defer.reject(response);
                }

                function saveSuccess(response) {
                    // Update blog data
                    $scope.post = response.result;
                    // Show message
                    $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Blog was created successfully');

                    defer.resolve(response);
                }

                function saveError(response) {
                    $scope.message = dashboardUtilsService.getMessage(response);
                    defer.reject(response);
                }
            };

        }]);
