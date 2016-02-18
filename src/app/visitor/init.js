
angular.module("visitorModule", ["ngRoute", "ngResource", "designModule"])

.constant("VISITOR_LIST_URL", "/visitors")
.constant("VISITOR_DETAIL_URL", "/visitor/:id")
.constant("VISITOR_ADDRESSES_URL", "/visitor/:visitorId/addresses")
.constant("VISITOR_ADDRESSES_DETAIL_URL", "/visitor/:visitorId/address/:id")
.constant("VISITOR_ATTRIBUTES_URL", "/v/attributes")
.constant("VISITOR_ATTRIBUTE_DETAIL_URL", "/v/attribute/:attr")
.constant("VISITOR_EMAILS", "/emails")

/**
 *  Basic routing configuration
 */
.config([
    "$routeProvider",
    "VISITOR_LIST_URL",
    "VISITOR_DETAIL_URL",
    "VISITOR_ADDRESSES_URL",
    "VISITOR_ADDRESSES_DETAIL_URL",
    "VISITOR_ATTRIBUTES_URL",
    "VISITOR_ATTRIBUTE_DETAIL_URL",
    "VISITOR_EMAILS",
    function ($routeProvider, VISITOR_LIST_URL, VISITOR_DETAIL_URL, VISITOR_ADDRESSES_URL, VISITOR_ADDRESSES_DETAIL_URL,
              VISITOR_ATTRIBUTES_URL, VISITOR_ATTRIBUTE_DETAIL_URL,VISITOR_EMAILS) {
        $routeProvider
            .when(VISITOR_LIST_URL, {
                templateUrl: "/views/visitor/list.html",
                controller: "visitorListController"
            })
            .when(VISITOR_DETAIL_URL, {
                templateUrl: "/views/visitor/edit.html",
                controller: "visitorEditController"
            })
            .when(VISITOR_ADDRESSES_URL, {
                templateUrl: "/views/visitor/address/list.html",
                controller: "visitorAddressListController"
            })
            .when(VISITOR_ADDRESSES_DETAIL_URL, {
                templateUrl: "/views/visitor/address/edit.html",
                controller: "visitorAddressEditController"
            })
            .when(VISITOR_ATTRIBUTES_URL, {
                templateUrl: "/views/visitor/attribute/list.html",
                controller: "visitorAttributeListController"
            })
            .when(VISITOR_ATTRIBUTE_DETAIL_URL, {
                templateUrl: "/views/visitor/attribute/edit.html",
                controller: "visitorAttributeEditController"
            })
            .when(VISITOR_EMAILS, {
                templateUrl: "/views/visitor/send-email.html",
                controller: "visitorEmailController"
            });
    }]
);
