(function (define) {
    "use strict";

    /**
     *  The module "productModule" is designed to work with products
     */
    define(["product/init"], function (productModule) {
        productModule
        /**
         *  $productApiService contains objects to interact with REST-server
         *  Objects:
         *      attributesInfo()                    - gets attributes list
         *      deleteAttribute(attribute)          - deletes attributes by name
         *      addAttribute()                      - creates new attribute
         *      productList()                       - gets product list
         *      getProduct(id)                      - gets product by ID
         *      update(id)                          - updates product by ID
         *      save()                              - saves product
         *      delete(id)                          - deletes product by ID
         *      getImage(productId, mediaName)      -
         *      getImagePath(productId)             - gets imagePath for product by productId
         *      listImages(productId)               - gets images list for product by productId
         *      removeImage(productId, mediaName)   - deletes image in product by fileName
         *      addImage(productId, mediaName)      - adds image in product
         */
            .service("$productApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
                return $resource(REST_SERVER_URI, {}, {
                    "attributesInfo": {
                        method: "GET",
                        url: REST_SERVER_URI + "/product/attributes"
                    },
                    "deleteAttribute": {
                        method: "DELETE",
                        params: { attribute: "@attribute" },
                        url: REST_SERVER_URI + "/products/attribute/:attribute"
                    },
                    "addAttribute": {
                        method: "POST",
                        url: REST_SERVER_URI + "/products/attribute"
                    },
                    "updateAttribute": {
                        method: "PUT",
                        params: { attribute: "@attribute" },
                        url: REST_SERVER_URI + "/products/attribute/:attribute"
                    },
                    "productList": {
                        method: "GET",
                        url: REST_SERVER_URI + "/products"
                    },
                    "getProduct": {
                        method: "GET",
                        params: { productID: "@id" },
                        url: REST_SERVER_URI + "/product/:productID"
                    },
                    "getCount": {
                        method: "GET",
                        url: REST_SERVER_URI + "/products?action=count"
                    },
                    "update": {
                        method: "PUT",
                        params: { productID: "@id" },
                        url: REST_SERVER_URI + "/product/:productID"
                    },
                    "save": {
                        method: "POST",
                        url: REST_SERVER_URI + "/product"
                    },
                    "remove": {
                        method: "DELETE",
                        params: { productID: "@id" },
                        url: REST_SERVER_URI + "/product/:productID"
                    },
                    "getImage": {
                        method: "GET",
                        params: { productID: "@productId", mediaName: "@mediaName" },
                        url: REST_SERVER_URI + "/product/:productID/media/image/:mediaName"
                    },
                    "getImagePath": {
                        method: "GET",
                        params: { productID: "@productId" },
                        url: REST_SERVER_URI + "/product/:productID/mediapath/image"
                    },
                    "listImages": {
                        method: "GET",
                        params: { productID: "@productId" },
                        url: REST_SERVER_URI + "/product/:productID/media/image"
                    },
                    "removeImage": {
                        method: "DELETE",
                        params: { productID: "@productId", mediaName: "@mediaName" },
                        url: REST_SERVER_URI + "/product/:productID/media/image/:mediaName"
                    },
                    "addImage": { // http://stackoverflow.com/questions/13963022/angularjs-how-to-implement-a-simple-file-upload-with-multipart-form
                        method: "POST",
                        params: { productID: "@productId", mediaName: "@mediaName" },
                        url: REST_SERVER_URI + "/product/:productID/media/image/:mediaName",

                        headers: {"Content-Type": undefined },
                        transformRequest: angular.identity // jshint ignore:line
                    }
                });
            }]);

        return productModule;
    });

})(window.define);