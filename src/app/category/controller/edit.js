angular.module("categoryModule")

.controller("categoryEditController", [
"$scope",
"$routeParams",
"$location",
"$q",
"$categoryApiService",
"$dashboardUtilsService",
function ($scope, $routeParams, $location, $q, $categoryApiService, $dashboardUtilsService) {
    var categoryId, rememberProducts, oldProducts, getDefaultCategory;
    // Initialize SEO
    if (typeof $scope.initSeo === "function") {
        $scope.initSeo("category");
    }

    categoryId = $routeParams.id;

    if (!categoryId && categoryId !== "new") {
        $location.path("/categories");
    }

    if (categoryId === "new") {
        categoryId = null;
    }

    oldProducts = [];

    getDefaultCategory = function () {
        return {
            name: "",
            "parent_id": "",
            "products": []
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
    $categoryApiService.attributesInfo().$promise.then(function (response) {
        var result = response.result || [];
        $scope.attributes = result;
    });

    if (null !== categoryId) {
        $categoryApiService.getCategory({"categoryID": categoryId}).$promise.then(function (response) {
            var result = response.result || {};
            $scope.category = result;
            $scope.category.parent = $scope.category['parent_id'];
            $scope.category.products = $scope.category.product_ids;
        });
    }

    $scope.back = function () {
        $location.path("/categories");
    };

    $scope.saveProducts = function () {
        var promises = [];

        var categoryId = $scope.category.id || $scope.category._id;
        var _prev = $scope.category.product_ids;
        var _new = $scope.category.products;

        var old_unselected_products = _.difference(_prev,_new);
        var new_selected_products = _.difference(_new,_prev);

        if (old_unselected_products.length){
            _.each(old_unselected_products, function(productID){
                promises.push($categoryApiService.removeProduct({
                    categoryID: categoryId,
                    productID: productID
                }))
            })
        }

        if (new_selected_products.length){
            _.each(new_selected_products, function(productID){
                promises.push($categoryApiService.addProduct({
                    categoryId: categoryId,
                    productId: productID
                }))
            })
        }

        return $q.all(promises);
    };

    /**
     * Event handler to save the category data.
     * Creates new category if ID in current category is empty OR updates current category if ID is set
     */
    $scope.save = function () {
        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
        defer = $q.defer();

        if (typeof $scope.category !== "undefined") {
            id = $scope.category.id || $scope.category._id;
        }

        /**
         *
         * @param response
         */
        saveSuccess = function (response) {
            if (response.error === null) {
                $scope.category = response.result || getDefaultCategory();
                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Category was created successfully');
                defer.resolve(true);
            }
            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
        };

        /**
         *
         * @param response
         */
        saveError = function () {
            defer.resolve(false);
            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
        };

        /**
         *
         * @param response
         */
        updateSuccess = function (response) {
            if (response.error === null) {
                $scope.category = response.result || getDefaultCategory();
                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Product was updated successfully');
                defer.resolve(true);
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            }
        };

        /**
         *
         * @param response
         */
        updateError = function () {
            defer.resolve(false);
            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
        };

        delete $scope.category.parent;
        delete $scope.category.path;

        if (!id) {
            if ($scope.category.name !== "") {
                $categoryApiService.save($scope.category, saveSuccess, saveError);
            }
        } else {
            $scope.category.id = id;
            $scope.saveProducts().then(function () {
                $categoryApiService.update($scope.category, updateSuccess, updateError);
            });

        }

        return defer.promise;
    };

}]);