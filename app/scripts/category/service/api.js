(function (define) {
    "use strict";

    /*
     *  HTML top page header manipulation stuff
     */
    define(["category/init"], function (productModule) {
        productModule
            /*
             *  $productApiService interaction service
             */
            .service("$categoryApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
                return $resource(REST_SERVER_URI, {}, {
                    "attributesInfo": {
                        method: "GET",
                        url: REST_SERVER_URI + "/categories/attributes"
                    },
                    "getCategory": {
                        method: "GET",
                        url: REST_SERVER_URI + "/category/:categoryID"
                    },
                    "categoryList": {
                        method: "GET",
                        url: REST_SERVER_URI + "/categories"
                    },
                    "getCount": {
                        method: "GET",
                        params: { action: "count" },
                        url: REST_SERVER_URI + "/categories"
                    },
                    "save": {
                        method: "POST",
                        url: REST_SERVER_URI + "/category"
                    },
                    "remove": {
                        method: "DELETE",
                        params: { categoryID: "@id" },
                        url: REST_SERVER_URI + "/category/:categoryID"
                    },
                    "update": {
                        method: "PUT",
                        params: { categoryID: "@id" },
                        url: REST_SERVER_URI + "/category/:categoryID"
                    },

                    // Products
                    "addProduct": {
                        method: "POST",
                        params: {
                            categoryID: "@categoryId",
                            productID: "@productId"
                        },
                        url: REST_SERVER_URI + "/category/:categoryID/product/:productID"
                    },
                    "removeProduct": {
                        method: "DELETE",
                        params: {
                            categoryID: "@categoryId",
                            productID: "@productId"
                        },
                        url: REST_SERVER_URI + "/category/:categoryID/product/:productID"
                    },
                    "getProducts": {
                        method: "GET",
                        url: REST_SERVER_URI + "/category/:categoryID/products"
                    }
                });
            }]);

        return productModule;
    });

})(window.define);