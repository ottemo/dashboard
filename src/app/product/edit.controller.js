angular.module('productModule')

.controller('productEditController', [
    '$scope',
    '$routeParams',
    '$location',
    '$q',
    '_',
    'productApiService',
    'coreImageService',
    'dashboardUtilsService',
    function (
        $scope,
        $routeParams,
        $location,
        $q,
        _,
        productApiService,
        coreImageService,
        dashboardUtilsService
    ) {

    $scope.addImage = addImage;
    $scope.getImage = coreImageService.getImage;
    $scope.reloadImages = reloadImages;
    $scope.removeImage = removeImage;
    $scope.setDefaultImage = setDefaultImage;
    $scope.getDefaultImage = getDefaultImage;
    $scope.product = getDefaultProduct();
    $scope.clearForm = clearForm;
    $scope.save = save;
    $scope.back = back;

    activate();

    ///////////////////////////////

    function activate() {
        // Initialize SEO
        if (typeof $scope.initSeo === 'function') {
            $scope.initSeo('product');
        }

        // Grab product attributes
        var attrPromise = productApiService.attributesInfo().$promise
            .then(function (response) {
                var attrs = response.result || [];

                // Remove some fields
                _.remove(attrs, {Attribute: 'default_image'});
                var qtyAttr = _.remove(attrs, {Attribute: 'qty'});
                var salePriceAttr = _.remove(attrs, { Attribute: 'sale_prices' });

                // Set the global
                $scope.isManagingStock = (qtyAttr.length > 0);

                // Add some tabs
                addImageManagerAttribute(attrs);
                if ($scope.isManagingStock) {
                    addInventoryTab(attrs);
                }

                var isSalePricesEnabled = (salePriceAttr.length > 0);
                if (isSalePricesEnabled) {
                    addSalePriceTab(attrs);
                }

                return attrs;
            });

        // Grab product data
        var productId = getProductID();
        if (productId) {
            var params = {'productID': productId};
            var prodPromise = productApiService.getProduct(params).$promise
                .then(function (response) {
                    return response.result || {};
                });
        }

        var promises = (productId) ? [attrPromise, prodPromise] : [attrPromise];
        $q.all(promises).then(function(response){
            var attrs = response[0];
            var product = response[1];

            $scope.attributes = attrs;

            if (product) {
                $scope.product = product;

                $scope.excludeItems = product._id;
                $scope.selectedImage = product.default_image;

                if (product.options === 'undefined') {
                    $scope.product.options = {};
                }

                if (product.type === 'configurable') {
                    addProductConfigurationsTab($scope.attributes);
                }
            }
        });

        // NOTE: not sure why this is here
        $scope.$watch('product', function () {
            $scope.reloadImages();
        });
    }

    function getProductID() {
        var productId = $routeParams.id;

        if (!productId) {
            $location.path('/products');
        } else if (productId === 'new') {
            productId = null;
        }

        return productId;
    }

    function addImageManagerAttribute(attributes) {
        attributes.unshift({
            Attribute: 'default_image',
            Collection: 'product',
            Default: '',
            Editors: 'picture_manager',
            Group: 'Pictures',
            IsRequired: false,
            IsStatic: false,
            Label: 'Image',
            Model: 'Product',
            Options: '',
            Type: 'text'
        });
    }

    function addSalePriceTab(attributes) {
        attributes.unshift({
            Attribute: 'sale_prices',
            Collection: 'product',
            Default: '',
            Editors: 'sale_prices',
            Group: 'SalePrice',
            IsRequired: false,
            IsStatic: false,
            Label: 'Sale Price',
            Model: 'Product',
            Options: '',
            Type: 'text'
        });
    }

    function addInventoryTab(attributes) {
        _.remove(attributes, {Attribute: 'inventory'});
        attributes.push({
            Attribute: 'inventory_manager',
            Collection: 'product',
            Default: '',
            Editors: 'inventory_manager',
            Group: 'Inventory',
            IsRequired: false,
            IsStatic: false,
            Label: 'Inventory',
            Model: 'Product',
            Options: '',
            Type: 'text'
        });
    }

    function getDefaultProduct() {
        return {
            '_id': undefined,
            'sku': '',
            'name': '',
            'short_description': '',
            'default_image': '',
            'price': '',
            'weight': ''
        };
    }

    function addProductConfigurationsTab(attributes) {
        attributes.push({
            Attribute: 'product_configurations',
            Collection: 'product',
            Default: '',
            Editors: 'product_configurations',
            Group: 'Configurations',
            IsRequired: false,
            IsStatic: false,
            Label: 'Product Configurations',
            Model: 'Product',
            Options: '',
            Type: 'text'
        });
    }

    /**
     * Clears the form to create a new product
     */
    function clearForm() {
        $scope.product = getDefaultProduct();
    }

    /**
     * Event handler to save the product data.
     * Creates new product if ID in current product is empty OR updates current product if ID is set
     */
    function save() {
        $('[ng-click="save()"]').addClass('disabled')
            .append('<i class="fa fa-spin fa-spinner"><i>')
            .siblings('.btn')
            .addClass('disabled');

        var id;
        var defer = $q.defer();

        if (typeof $scope.product !== 'undefined') {
            id = $scope.product.id || $scope.product._id;

            // Don't send images as product attribute
            delete $scope.product.images;
        }

        if ($scope.product.type === 'configurable') {
            setConfigurableAttributesFromOptions($scope.product);
        }

        if (!id) {
            productApiService.save($scope.product, saveSuccess, saveError);
        } else {
            $scope.product.id = id;
            if ($scope.images && $scope.images.indexOf($scope.product['default_image']) == -1) {
                $scope.product['default_image'] = $scope.images[0] || '';
            }

            productApiService.update($scope.product, updateSuccess, updateError);
        }

        return defer.promise;

        //////////////////

        function saveSuccess(response) {
            if (response.error === null) {
                $scope.product._id = response.result._id;
                $scope.images = [];
                $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Product was created successfully');

                if ($scope.product.type === 'configurable') {
                    addProductConfigurationsTab($scope.attributes);
                }

                defer.resolve($scope.product);
            } else {
                $scope.message = dashboardUtilsService.getMessage(response);
            }
            enableButton();
        }

        function saveError() {
            $scope.message = dashboardUtilsService.getMessage(null, 'danger', 'Something went wrong');
            enableButton();
            defer.resolve(false);
        }

        function updateSuccess(response) {
            if (response.error === null) {
                var result = response.result || getDefaultProduct();
                $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Product was updated successfully');

                defer.resolve(result);
            } else {
                $scope.message = dashboardUtilsService.getMessage(response);
            }
            enableButton();
        }

        function updateError() {
            saveError();
        }

        function enableButton() {
            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
        }
    }

    function back() {
        $location.path('/products');
    }

    // Synchronize configurable options and attributes
    function setConfigurableAttributesFromOptions(product) {
        var productOptions = product.options;
        _.forEach(productOptions, function(option) {
            if (option.has_associated_products && product[option.key] !== undefined && option.options) {
                var selections = Object.keys(option.options);
                product[option.key] = selections;
            }
        })
    }

    //-----------------
    // IMAGE FUNCTIONS
    //-----------------

    function reloadImages() {
        if ($scope.product !== undefined && $scope.product._id !== undefined) {
            // taking media patch for new product
            productApiService.getImagePath({'productID': $scope.product._id}).$promise.then(
                function (response) {
                    $scope.imagesPath = response.result || '';
                });

            // taking registered images for product
            productApiService.listImages({'productID': $scope.product._id}).$promise.then(
                function (response) {
                    $scope.images = response.result || [];
                });
        }
    }

    /**
     * Adds file to product
     *
     * @param fileElementId
     */
    function addImage(fileElementId) {
        var file = document.getElementById(fileElementId);
        var pid = $scope.product._id;

        var mediaName = file.files[0] ? file.files[0].name : undefined;

        if (pid === undefined || mediaName === undefined) return;

        var postData = new FormData();
        postData.append('file', file.files[0]);

        if (pid !== undefined) {
            productApiService.addImage({'productID': pid, 'mediaName': mediaName}, postData)
                .$promise.then(function () {
                    $scope.reloadImages();
                });
        }
    }

    /**
     * Removes image from product (from product folder) and sends request to saves
     *
     * @param {string} selected - image name
     */
    function removeImage(selected) {
        var pid = $scope.product._id, mediaName = selected;

        if (pid !== undefined && selected !== undefined) {
            productApiService.removeImage({'productID': pid, 'mediaName': mediaName})
                .$promise.then(function () {
                    $scope.selectedImage = undefined;
                    $scope.reloadImages();
                    $scope.product['default_image'] = '';


                    $scope.save();
                });
        }
    }

    /**
     * Sets image as image default
     *
     * @param {string} selected - image name
     */
    function setDefaultImage(selected) {
        $scope.product['default_image'] = selected;

    }

    function getDefaultImage() {
        return $scope.product['default_image'];
    }
}]);
