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

                var categoryBaseURL = REST_SERVER_URI + "/category";

                return $resource(categoryBaseURL, {}, {
                    "attributesInfo": {
                        method: "GET",
                        url: categoryBaseURL + "/attribute/list"
                    },
                    "getCategroy": {
                        method: "GET",
                        params: { id: "@id" },
                        url: categoryBaseURL + "/get/:id"
                    },
                    "categoryList": {
                        method: "GET",
                        url: categoryBaseURL + "/list"
                    },
                    "save": {
                        method: "POST",
                        url: categoryBaseURL + "/create"
                    },
                    "delete": {
                        method: "DELETE",
                        params: { id: "@id" },
                        url: categoryBaseURL + "/delete/:id"
                    },
                    "update": {
                        method: "PUT",
                        params: { id: "@id" },
                        url: categoryBaseURL + "/update/:id"
                    },

                    // Products
                    "addProduct": {
                        method: "GET",
                        params: {
                            categoryId: "@categoryId",
                            productId: "@productId"
                        },
                        url: categoryBaseURL + "/product/add/:categoryId/:productId"
                    },
                    "removeProduct": {
                        method: "GET",
                        params: {
                            categoryId: "@categoryId",
                            productId: "@productId"
                        },
                        url: categoryBaseURL + "/product/remove/:categoryId/:productId"
                    },
                    "getProducts": {
                        method: "GET",
                        params: {id: "@id"},
                        url: categoryBaseURL + "/product/:id"
                    }
                });
            }]);

        return productModule;
    });

})(window.define);