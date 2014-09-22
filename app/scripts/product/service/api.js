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

                var productBaseURL = REST_SERVER_URI + "/product";

                return $resource(productBaseURL, {}, {
                    "attributesInfo": {
                        method: "GET",
                        url: productBaseURL + "/attribute/list"
                    },
                    "deleteAttribute": {
                        method: "DELETE",
                        params: { attribute: "@attribute" },
                        url: productBaseURL + "/attribute/remove/:attribute"
                    },
                    "addAttribute": {
                        method: "POST",
                        url: productBaseURL + "/attribute/add"
                    },
                    "productList": {
                        method: "POST",
                        url: productBaseURL + "/list"
                    },
                    "getProduct": {
                        method: "GET",
                        params: { id: "@id" },
                        url: productBaseURL + "/get/:id"
                    },
                    "getCount": {
                        method: "GET",
                        url: productBaseURL + "/count"
                    },
                    "update": {
                        method: "PUT",
                        params: { id: "@id" },
                        url: productBaseURL + "/update/:id"
                    },
                    "save": {
                        method: "POST",
                        url: productBaseURL + "/create"
                    },
                    "remove": {
                        method: "DELETE",
                        params: { id: "@id" },
                        url: productBaseURL + "/delete/:id"
                    },
                    "getImage": {
                        method: "GET",
                        params: { productId: "@productId", mediaName: "@mediaName" },
                        url: productBaseURL + "/media/get/:productId/image/:mediaName"
                    },
                    "getImagePath": {
                        method: "GET",
                        params: { productId: "@productId" },
                        url: productBaseURL + "/media/path/:productId/image"
                    },
                    "listImages": {
                        method: "GET",
                        params: { productId: "@productId" },
                        url: productBaseURL + "/media/list/:productId/image"
                    },
                    "removeImage": {
                        method: "DELETE",
                        params: { productId: "@productId", mediaName: "@mediaName" },
                        url: productBaseURL + "/media/remove/:productId/image/:mediaName"
                    },
                    "addImage": { // http://stackoverflow.com/questions/13963022/angularjs-how-to-implement-a-simple-file-upload-with-multipart-form
                        method: "POST",
                        params: { productId: "@productId", mediaName: "@mediaName" },
                        url: productBaseURL + "/media/add/:productId/image/:mediaName",

                        headers: {"Content-Type": undefined },
                        transformRequest: angular.identity // jshint ignore:line
                    }
                });
            }]);

        return productModule;
    });

})(window.define);