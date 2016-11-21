angular.module('categoryModule')

.controller('categoryEditController', [
    '$scope',
    '$routeParams',
    '$route',
    '$location',
    '$q',
    'categoryApiService',
    'dashboardUtilsService',
    'coreImageService',
    '_',
    function (
        $scope,
        $routeParams,
        $route,
        $location,
        $q,
        categoryApiService,
        dashboardUtilsService,
        coreImageService,
        _
    ) {

        var savedProducts = [];

        // Images
        $scope.getImage = coreImageService.getImage;
        $scope.addImage = addImage;
        $scope.removeImage = removeImage;
        $scope.reloadImages = reloadImages;
        $scope.getDefaultImage = getDefaultImage;
        $scope.setDefaultImage = setDefaultImage;

        activate();

        //////////////////////////////////////////

        function activate() {
            var categoryId = $routeParams.id;

            if (!categoryId) {
                $location.path('/categories');
            } else {
                if (categoryId === 'new') {
                    categoryId = null;
                }
            }

            // Initialize SEO
            if (typeof $scope.initSeo === 'function') {
                $scope.initSeo('category');
            }

            $scope.category = {};

            /**
             * Gets list all attributes of category
             */
            categoryApiService.attributesInfo().$promise.then(function (response) {
                $scope.attributes = response.result || [];
                addImageManagerAttribute($scope.attributes);
                _.remove($scope.attributes, { 'Attribute': 'image' });
            });

            if (null !== categoryId) {
                categoryApiService.getCategory({'categoryID': categoryId}).$promise.then(function (response) {
                    $scope.category = response.result || {};
                    $scope.category.parent = $scope.category['parent_id'];
                    savedProducts = $scope.category.product_ids;
                });
            }

            $scope.$watch('category', function () {
                $scope.reloadImages();
            });
        }

        $scope.back = function () {
            $location.path('/categories');
        };

        $scope.saveProducts = function () {
            var categoryID = $scope.category.id || $scope.category._id;
            if (!categoryID) return;

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

            var deferred = $q.defer();

            if ($scope.images.indexOf($scope.category.image) === -1) {
                $scope.category.image = $scope.images[0] || '';
            }

            // Props that aren't recognized by the server
            delete $scope.category.parent;
            delete $scope.category.path;
            delete $scope.category.products;

            var id = $scope.category.id || $scope.category._id;

            if (!id) {
                if ($scope.category.name !== '') {

                    // Props that aren't recognized by the server
                    delete $scope.category.product_ids;

                    categoryApiService.save($scope.category).$promise
                        .then(saveSuccess, saveError)
                        .then(function(){
                            savedProducts = $scope.category.product_ids;
                        });
                } else {
                    deferred.resolve();
                }
            } else {
                $scope.category.id = id;
                $scope.saveProducts().then(function () {

                    // Props that aren't recognized by the server
                    delete $scope.category.product_ids;

                    categoryApiService.update($scope.category).$promise
                        .then(updateSuccess, updateError)
                        .then(function() {
                            savedProducts = $scope.category.product_ids;
                        });
                });
            }

            return deferred.promise;

            ////////////////

            function saveSuccess(response) {
                if (response.error === null) {
                    $scope.category = response.result;
                    $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Category was created successfully');
                    $scope.category.parent = $scope.category['parent_id'];
                    savedProducts = $scope.category.product_ids;
                    allowSaving();
                } else {
                    allowSaving();
                }
            }

            function saveError() {
                allowSaving();
            }

            function updateSuccess(response) {
                if (response.error === null) {
                    $scope.category = response.result;
                    $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Category was updated successfully');
                    allowSaving();
                } else {
                    allowSaving();
                }
            }

            function updateError() {
                allowSaving();
            }

            // Refactor
            function allowSaving() {
                deferred.resolve();
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            }

        };

        function addImageManagerAttribute(attributes) {
            attributes.unshift({
                Attribute: 'images',
                Collection: 'category',
                Default: '',
                Editors: 'picture_manager',
                Group: 'Pictures',
                IsRequired: false,
                IsStatic: false,
                Label: 'Images',
                Model: 'Category',
                Options: '',
                Type: 'text'
            });
        }

        function reloadImages() {
            var imagesDeferred = $q.defer();

            if ($scope.category !== undefined && $scope.category._id !== undefined) {
                $scope.imagesPath = 'image/Category/' + $scope.category._id + '/';

                categoryApiService.listImages({'categoryID': $scope.category._id}).$promise.then(
                    function(response) {
                        $scope.images = response.result || [];
                        imagesDeferred.resolve($scope.images);
                    },
                    function() {
                        $scope.images = [];
                        imagesDeferred.resolve($scope.images);
                    });
            } else {
                $scope.images = [];
                imagesDeferred.resolve($scope.images);
            }

            return imagesDeferred.promise;
        }

        /**
         * Adds file to product
         *
         * @param fileElementId
         */
        function addImage(fileElementId) {
            var file = document.getElementById(fileElementId);
            var mediaName = file.files[0] ? file.files[0].name : undefined;

            var postData = new FormData();
            postData.append('file', file.files[0]);

            if ($scope.category._id) {
                categoryApiService.addImage({'categoryID': $scope.category._id, 'mediaName': mediaName}, postData)
                    .$promise.then(function () {
                        $scope.reloadImages();
                    });
            }
        }

        /**
         * Removes image from category and sends request to saves
         *
         * @param {string} selectedMediaName - image name
         */
        function removeImage(selectedMediaName) {
            var removeImageDeferred = $q.defer();

            if ($scope.category._id !== undefined && selectedMediaName !== undefined) {
                categoryApiService.removeImage({'categoryID': $scope.category._id, 'mediaName': selectedMediaName}).$promise
                    .then($scope.reloadImages)
                    .then(function(images) {
                        if ($scope.category.image === selectedMediaName) {
                            if (images.length > 0) {
                                $scope.category.image = images[0];
                            } else {
                                $scope.category.image = '';
                            }

                            return $scope.save();
                        }
                    })
                    .then(function() {
                        removeImageDeferred.resolve();
                    });
            } else {
                removeImageDeferred.resolve();
            }

            return removeImageDeferred.promise;
        }

        /**
         * Sets image as image default
         *
         * @param {string} selected - image name
         */
        function setDefaultImage(selected) {
            if (!selected) return;

            $scope.category.image = selected;
            return $scope.save();
        }

        function getDefaultImage() {
            return $scope.category.image;
        }
    }]);