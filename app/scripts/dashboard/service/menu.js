// TODO:
// * monitor route change:
//   * update visibility toggle for xs, and sm
//   * add "active:true" to matching menu item
//
angular.module("dashboardModule")

  .service("$menuService", [function () {

      return [
        {
          "title": "Dashboard",
          "link": "/",
          "icon": "fa-home"
        }, {
          "title": "Orders",
          "link": "/orders",
          "icon": "fa-list-alt"
        }, {
          "title": "Products",
          "link": null,
          "icon": "fa-tags",
          "items": [{
            "title": "Products",
            "link": "/products",
            "icon": ""
          }, {
            "title": "Attributes",
            "link": "/attributes",
            "icon": ""
          }]
        }, {
          "title": "Categories",
          "link": "/categories",
          "icon": "fa-th-list"
        }, {
          "title": "CMS",
          "link": null,
          "icon": "fa-indent",
          "items": [{
            "title": "Page",
            "link": "/cms/pages",
            "icon": ""
          }, {
          //  "title": "Gallery",
          //  "link": "/cms/gallery",
          //  "icon": ""
          //}, {
            "title": "Block",
            "link": "/cms/blocks",
            "icon": ""
          }]
        }, {
        //  "title": "Import / Export",
        //  "link": "/impex",
        //  "icon": "fa-exchange"
        //}, {
        //  "title": "URL Rewrite",
        //  "link": "/seo",
        //  "icon": "fa-random",
        //}, {
          "title": "Visitors",
          "link": null,
          "icon": "fa-users",
          "items": [{
            "title": "Attributes",
            "link": "/v/attributes",
            "icon": ""
          }, {
            "title": "Email",
            "link": "/emails",
            "icon": ""
          }, {
            "title": "Visitors",
            "link": "/visitors",
            "icon": ""
          }]
        }, {
          "title": "Settings",
          "link": null,
          "icon": "fa-cogs",
          "items": [{
            "title": "General",
            "link": "/settings/general",
            "icon": ""
          }, {
            "title": "Payment",
            "link": "/settings/payment",
            "icon": ""
          }, {
            "title": "Shipping",
            "link": "/settings/shipping",
            "icon": ""
          }, {
            "title": "Themes",
            "link": "/settings/themes",
            "icon": ""
          }]
        }]

  }]);
