angular.module('productModule')

.controller('productEditController', [
'$scope', '$routeParams', '$location', '$q', '_', 'productApiService', 'coreImageService', 'dashboardUtilsService',
function ($scope, $routeParams, $location, $q, _, productApiService, coreImageService, dashboardUtilsService) {

    var productId = getProductID();
    var isManagingStock = false;

    $scope.product = getDefaultProduct();
    $scope.clearForm = clearForm;
    $scope.save = save;
    $scope.back = back;

    // Images
    $scope.imageAdd = imageAdd;
    $scope.getImage = coreImageService.getImage;
    $scope.reloadImages = reloadImages;
    $scope.imageRemove = imageRemove;
    $scope.imageDefault = imageDefault;

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

                // Set the global
                isManagingStock = (qtyAttr.length > 0);

                // Add some tabs
                addImageManagerAttribute(attrs);
                if (isManagingStock) {
                    addInventoryTab(attrs);
                }

                // Attach
                $scope.attributes = attrs;
            });

        // Grab product data
        var prodPromise = true;
        if (productId) {
            var params = {'productID': productId};
            prodPromise = productApiService.getProduct(params).$promise
                .then(function (response) {

                    var result = response.result || {};

                    $scope.product = result;
                    $scope.excludeItems = result._id;
                    $scope.selectedImage = result.default_image;

                    if (typeof $scope.product.options === 'undefined') {
                        $scope.product.options = {};
                    }
                });
        }

        // Set the stock flag on the product
        // we pass the product around so this is a way to consolidate
        // variables being passed around.
        $q.all([attrPromise, prodPromise]).then(function(/*resp*/){
            $scope.product.isManagingStock = isManagingStock;
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
            delete $scope.product.isManagingStock;
        }

        if (!id) {
            productApiService.save($scope.product, saveSuccess, saveError);
        } else {
            $scope.product.id = id;
            productApiService.update($scope.product, updateSuccess, updateError);
        }

        return defer.promise;

        //////////////////

        function saveSuccess(response) {
            if (response.error === null) {
                $scope.product._id = response.result._id;
                $scope.productImages = [];
                $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Product was created successfully');
                addImageManagerAttribute();

                // Reset stock management variable
                $scope.product.isManagingStock = isManagingStock;

                defer.resolve($scope.product);
            } else {
                $scope.message = dashboardUtilsService.getMessage(response);
            }
            enableButton();
        }

        function saveError() {
            $scope.message = dashboardUtilsService.getMEssage(null, 'danger', 'Something went wrong');
            enableButton();
            defer.resolve(false);
        }

        function updateSuccess(response) {
            if (response.error === null) {
                var result = response.result || getDefaultProduct();
                $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Product was updated successfully');

                // Reset stock management variable
                $scope.product.isManagingStock = isManagingStock;

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
                    $scope.productImages = response.result || [];
                });
        }
    }

    /**
     * Adds file to product
     *
     * @param fileElementId
     */
    function imageAdd(fileElementId) {
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
    function imageRemove(selected) {
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
    function imageDefault(selected) {
        $scope.product['default_image'] = selected;

    }

    $scope.getDefaultImage = function() {
        return $scope.product['default_image'];
    };

    /**
     * Returns full path of an image
     *
     * @param {string} image    - image name
     * @returns {string}        - full path
     */
    $scope.getImage = function (image) {
        return coreImageService.getImage(image);
    };
}]);
