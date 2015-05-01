
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
                templateUrl: angular.getTheme("visitor/list.html"),
                controller: "visitorListController"
            })
            .when(VISITOR_DETAIL_URL, {
                templateUrl: angular.getTheme("visitor/edit.html"),
                controller: "visitorEditController"
            })
            .when(VISITOR_ADDRESSES_URL, {
                templateUrl: angular.getTheme("visitor/address/list.html"),
                controller: "visitorAddressListController"
            })
            .when(VISITOR_ADDRESSES_DETAIL_URL, {
                templateUrl: angular.getTheme("visitor/address/edit.html"),
                controller: "visitorAddressEditController"
            })
            .when(VISITOR_ATTRIBUTES_URL, {
                templateUrl: angular.getTheme("visitor/attribute/list.html"),
                controller: "visitorAttributeListController"
            })
            .when(VISITOR_ATTRIBUTE_DETAIL_URL, {
                templateUrl: angular.getTheme("visitor/attribute/edit.html"),
                controller: "visitorAttributeEditController"
            })
            .when(VISITOR_EMAILS, {
                templateUrl: angular.getTheme("visitor/send-email.html"),
                controller: "visitorEmailController"
            });
    }]
)

.run([
    "$designService", 
    "$route", 
    "$dashboardSidebarService", 
    "VISITOR_LIST_URL",
    "VISITOR_ATTRIBUTES_URL",
    "VISITOR_EMAILS",

    function ($designService, $route, $dashboardSidebarService, VISITOR_LIST_URL, VISITOR_ATTRIBUTES_URL, VISITOR_EMAILS) {

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/visitors", "Visitors", null, "fa fa-users", 10);
        $dashboardSidebarService.addItem("/visitors/list", "Visitors", VISITOR_LIST_URL, "", 3);
        $dashboardSidebarService.addItem("/visitors/attributes", "Attributes", VISITOR_ATTRIBUTES_URL, "", 2);
        $dashboardSidebarService.addItem("/visitors/email", "Email", VISITOR_EMAILS, "", 1);
    }
]);