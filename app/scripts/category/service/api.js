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

/*
models.T_AttributeInfo{
    Model:      "Category",
        Collection: "Category",
        Attribute:  "_id",
        Type:       "id",
        IsRequired: false,
        IsStatic:   true,
        Label:      "ID",
        Group:      "General",
        Editors:    "not_editable",
        Options:    "",
        Default:    "",
},
models.T_AttributeInfo{
    Model:      "Category",
        Collection: "Category",
        Attribute:  "name",
        Type:       "text",
        IsRequired: true,
        IsStatic:   true,
        Label:      "Name",
        Group:      "General",
        Editors:    "line_text",
        Options:    "",
        Default:    "",
},
models.T_AttributeInfo{
    Model:      "Category",
        Collection: "Category",
        Attribute:  "parent",
        Type:       "id",
        IsRequired: false,
        IsStatic:   true,
        Label:      "Parent",
        Group:      "General",
        Editors:    "model_selector",
        Options:    "model: category",
        Default:    "",
},
models.T_AttributeInfo{
    Model:      "Category",
        Collection: "Category",
        Attribute:  "products",
        Type:       "id",
        IsRequired: false,
        IsStatic:   true,
        Label:      "Products",
        Group:      "General",
        Editors:    "array_model_selector",
        Options:    "model: product",
        Default:    "",
},
*/