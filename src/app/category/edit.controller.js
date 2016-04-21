angular.module("categoryModule")

.controller("categoryEditController", [
"$scope",
"$routeParams",
"$location",
"$q",
"categoryApiService",
"dashboardUtilsService",
"_",
function ($scope, $routeParams, $location, $q, categoryApiService, dashboardUtilsService, _) {

    var savedProducts = []

    // Initialize SEO
    if (typeof $scope.initSeo === "function") {
        $scope.initSeo("category");
    }

    var categoryId = $routeParams.id;

    if (!categoryId && categoryId !== "new") {
        $location.path("/categories");
    }

    if (categoryId === "new") {
        categoryId = null;
    }

    function getDefaultCategory() {
        return {
            name: "",
            "parent_id": "",
            "products": []
        };
    };

    $scope.category = {};

    /**
     * Gets list all attributes of category
     */
    categoryApiService.attributesInfo().$promise.then(function (response) {
        var result = response.result || [];
        $scope.attributes = result;
    });

    if (null !== categoryId) {
        categoryApiService.getCategory({"categoryID": categoryId}).$promise.then(function (response) {
            var result = response.result || {};
            $scope.category = result;
            $scope.category.parent = $scope.category['parent_id'];
            savedProducts = $scope.category.product_ids;
        });
    }

    $scope.back = function () {
        $location.path("/categories");
    };

    $scope.saveProducts = function () {
        var categoryID = $scope.category.id || $scope.category._id;
        var newProductList = $scope.category.product_ids;

        var toRemove = _.difference(savedProducts, newProductList);
        var toAdd = _.difference(newProductList, savedProducts);

        var promises = _.map(toRemove, removePid);
        promises = promises.concat( _.map(toAdd, addPid) );

        return $q.all(promises);

        /////////////////

        function removePid(productID){
            var params = {
                categoryID: categoryID,
                productID: productID,
            };
            return categoryApiService.removeProduct(params).$promise;
        }

        function addPid(productID){
            var params = {
                categoryID: categoryID,
                productID: productID,
            };
            return categoryApiService.addProduct(params).$promise;
        }
    };

    /**
     * Event handler to save the category data.
     * Creates new category if ID in current category is empty OR updates current category if ID is set
     */
    $scope.save = function () {
        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

        var defer = $q.defer();
        var id = $scope.category.id || $scope.category._id;

        // Props that aren't recognized by the server
        delete $scope.category.parent;
        delete $scope.category.path;
        delete $scope.category.products;

        if (!id) {
            if ($scope.category.name !== '') {

                // Props that aren't recognized by the server
                delete $scope.category.product_ids;

                categoryApiService.save($scope.category).$promise
                    .then(saveSuccess, saveError)
                    .then(function(){
                        savedProducts = $scope.category.product_ids;
                    });
            }
        } else {
            $scope.category.id = id;
            $scope.saveProducts().then(function () {

                // Props that aren't recognized by the server
                delete $scope.category.product_ids;

                categoryApiService.update($scope.category).$promise
                    .then(updateSuccess, updateError)
                    .then(function(){
                        savedProducts = $scope.category.product_ids;
                    });
            });
        }

        return defer.promise;

        ////////////////

        function saveSuccess(response) {
            if (response.error === null) {
                $scope.category = response.result || getDefaultCategory();
                $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Category was created successfully');
                defer.resolve(true);
            }

            allowSaving();
        };

        function saveError() {
            defer.resolve(false);
            allowSaving();
        };

        function updateSuccess(response) {
            if (response.error === null) {
                $scope.category = response.result || getDefaultCategory();
                $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Product was updated successfully');
                defer.resolve(true);

                allowSaving();
            }
        };

        function updateError() {
            defer.resolve(false);
            allowSaving();
        };

        // Refactor
        function allowSaving() {
            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
        }

    };

}]);