angular.module("visitorModule")

/*
 *  productApiService interaction service
 */

.service("visitorApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
    return $resource(REST_SERVER_URI, {}, {
        "attributesInfo": {
            method: "GET",
            url: REST_SERVER_URI + "/visitors/attributes"
        },
        "addAttribute": {
            method: "POST",
            url: REST_SERVER_URI + "/visitors/attribute"
        },
        "removeAttribute": {
            method: "DELETE",
            url: REST_SERVER_URI + "/visitors/attribute/:attribute"
        },
        "visitorList": {
            method: "GET",
            url: REST_SERVER_URI + "/visitors"
        },
        "save": {
            method: "POST",
            url: REST_SERVER_URI + "/visitor"
        },
        "load": {
            method: "GET",
            url: REST_SERVER_URI + "/visitor/:visitorID" },
        "update": {
            method: "PUT",
            params: { visitorID: "@id" },
            url: REST_SERVER_URI + "/visitor/:visitorID"
        },
        "remove": {
            method: "DELETE",
            url: REST_SERVER_URI + "/visitor/:visitorID"
        },
        "getCountVisitors": {
            method: "GET",
            params: { action: "count" },
            url: REST_SERVER_URI + "/visitors"
        },
        "guestsList": {
            method: "GET",
            url: REST_SERVER_URI + "/visitors/guests"
        },
        "getGuestOrders": {
            method: "GET",
            params: {
                extra: '_id,status,grand_total,notes,created_at,billing_address',
                visitor_id: ''
            },
            url: REST_SERVER_URI + "/orders"
        },

        // Addresses API
        "addressAttributeInfo": {
            method: "GET",
            url: REST_SERVER_URI + "/visitors/addresses/attributes"
        },
        "addresses": {
            method: "GET",
            url: REST_SERVER_URI + "/visitor/:visitorID/addresses"
        },
        "loadAddress": {
            method: "GET",
            url: REST_SERVER_URI + "/visitors/address/:addressID"
        },
        "saveAddress": {
            method: "POST",
            params: { visitorID: "@visitor_id"},
            url: REST_SERVER_URI + "/visitor/:visitorID/address"
        },
        "updateAddress": {
            method: "PUT",
            params: { addressID: "@id" },
            url: REST_SERVER_URI + "/visitors/address/:addressID"
        },
        "getCountAddresses": {
            method: "GET",
            params: { action: "count" },
            url: REST_SERVER_URI + "/visitor/:visitorID/addresses"
        },
        "deleteAddress": {
            method: "DELETE",
            url: REST_SERVER_URI + "/visitors/address/:addressID"
        },
        "sendMail": {
            method: "POST",
            url: REST_SERVER_URI + "/visitors/mail"
        },

        // Reviews API
        "reviewList": {
            method: "GET",
            url: REST_SERVER_URI + "/reviews"
        },
        "getReview": {
            method: "GET",
            url: REST_SERVER_URI + "/review/:reviewID"
        },
        "editReview": {
            method: "PUT",
            params: { reviewID: "@_id" },
            url: REST_SERVER_URI + "/review/:reviewID"
        },
        "getCount": {
            method: "GET",
            params: { action: "count" },
            url: REST_SERVER_URI + "/reviews"
        },
        "deleteReview": {
            method: "DELETE",
            url: REST_SERVER_URI + "/review/:reviewID"
        }
    });
}]);

