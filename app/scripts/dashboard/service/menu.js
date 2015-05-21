angular.module("dashboardModule")

  .service("$menuService", [function () {

      return [
        {
          "title": "Dashboard",
          "link": "/",
          "icon": "fa fa-home"
        }, {
          "title": "Orders",
          "link": "/orders",
          "icon": "fa fa-list-alt"
        }, {
          "title": "Products",
          "link": null,
          "icon": "fa fa-tags",
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
          "icon": "fa fa-th-list"
        }, {
          "title": "CMS",
          "link": null,
          "icon": "fa fa-indent",
          "items": [{
            "title": "Page",
            "link": "/cms/pages",
            "icon": ""
          }, {
            "title": "Gallery",
            "link": "/cms/gallery",
            "icon": "",
            "disabled": true
          }, {
            "title": "Block",
            "link": "/cms/blocks",
            "icon": ""
          }]
        }, {
          "title": "Import / Export",
          "link": "/impex",
          "icon": "fa fa-exchange",
          "disabled": true
        }, {
          "title": "URL Rewrite",
          "link": "/seo",
          "icon": "fa fa-random",
          "disabled": true
        }, {
          "title": "Visitors",
          "link": null,
          "icon": "fa fa-users",
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
          "icon": "fa fa-cogs",
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
