angular.module("productModule")

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
            url: REST_SERVER_URI + "/products/attributes"
        },
        "deleteAttribute": {
            method: "DELETE",
            url: REST_SERVER_URI + "/products/attribute/:attribute"
        },
        "addAttribute": {
            method: "POST",
            url: REST_SERVER_URI + "/products/attribute"
        },
        "updateAttribute": {
            method: "PUT",
            url: REST_SERVER_URI + "/products/attribute/:attribute"
        },
        "productList": {
            method: "GET",
            url: REST_SERVER_URI + "/products"
        },
        "getProduct": {
            method: "GET",
            url: REST_SERVER_URI + "/product/:productID"
        },
        "getCount": {
            method: "GET",
            params: { action: "count" },
            url: REST_SERVER_URI + "/products"
        },
        "getStock": {
            method: "GET",
            url: REST_SERVER_URI + "/stock/:productID"
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
            url: REST_SERVER_URI + "/product/:productID"
        },
        "getImage": {
            method: "GET",
            url: REST_SERVER_URI + "/product/:productID/media/image/:mediaName"
        },
        "getImagePath": {
            method: "GET",
            url: REST_SERVER_URI + "/product/:productID/mediapath/image"
        },
        "listImages": {
            method: "GET",
            url: REST_SERVER_URI + "/product/:productID/media/image"
        },
        "removeImage": {
            method: "DELETE",
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
