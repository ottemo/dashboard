angular.module('categoryModule')

.controller('categoryEditController', [
    '$scope',
    '$routeParams',
    '$location',
    '$q',
    '$categoryApiService',
    '$dashboardUtilsService',
    '_',
    function($scope, $routeParams, $location, $q, $categoryApiService, $dashboardUtilsService, _) {
        var categoryId, rememberProducts, oldProducts, getDefaultCategory;

        // Initialize SEO
        if (typeof $scope.initSeo === 'function') {
            $scope.initSeo('category');
        }

        categoryId = $routeParams.id;

        if (!categoryId && categoryId !== 'new') {
            $location.path('/categories');
        }

        if (categoryId === 'new') {
            categoryId = null;
        }

        oldProducts = [];

        getDefaultCategory = function() {
            return {
                name: '',
                'parent_id': '',
                'products': []
            };
        };

        /**
         * Current selected category
         *
         * @type {Object}
         */
        $scope.category = {};

        /**
         * Gets list all attributes of category
         */
        $categoryApiService.attributesInfo().$promise.then(function(response) {
            var result = response.result || [];
            $scope.attributes = result;
        });

        if (null !== categoryId) {
            $categoryApiService.getCategory({
                'categoryID': categoryId
            }).$promise.then(function(response) {
                var result = response.result || {};
                $scope.category = result;
                $scope.category.parent = $scope.category['parent_id'];

                // .products is the 'touched' list, .product_ids is the 'last-saved' list
                $scope.category.products = $scope.category.product_ids;
            });
        }

        $scope.back = function() {
            $location.path('/categories');
        };

        /**
         * Event handler to save the category data.
         * Creates new category if ID in current category is empty OR updates current category if ID is set
         */
        $scope.save = function() {
            $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

            var id, defer, saveSuccess, saveError, updateSuccess, updateError;
            defer = $q.defer();

            if (typeof $scope.category !== 'undefined') {
                id = $scope.category.id || $scope.category._id;
            }

            saveSuccess = function(response) {
                if (response.error === null) {
                    $scope.category = response.result || getDefaultCategory();
                    $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Category was created successfully');
                    defer.resolve(true);
                }
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            };

            saveError = function() {
                defer.resolve(false);
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            };

            updateSuccess = function(response) {
                if (response.error === null) {
                    $scope.category = response.result || getDefaultCategory();
                    $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Product was updated successfully');
                    defer.resolve(true);
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                }
            };

            updateError = function() {
                defer.resolve(false);
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            };

            delete $scope.category.parent;
            delete $scope.category.path;

            if (!id) {
                if ($scope.category.name !== '') {
                    $scope.category.product_ids = $scope.category.products;
                    delete $scope.category.products;

                    $categoryApiService.save($scope.category).$promise
                        .then(saveSuccess, saveError)
                        .then(function(){
                            // update the current pid list
                            $scope.category.products = $scope.category.product_ids;
                        });
                }
            } else {
                // update needed for apiService
                $scope.category.id = $scope.category._id;

                $scope.category.product_ids = $scope.category.products;
                delete $scope.category.products;

                $categoryApiService.update($scope.category).$promise
                    .then(updateSuccess, updateError)
                    .then(function(){
                        // update the current pid list
                        $scope.category.products = $scope.category.product_ids;
                    });

            }

            return defer.promise;
        };

    }
]);

