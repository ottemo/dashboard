angular.module("dashboardModule")
  /*
   *  $pageSidebarService implementation
   */
  .service("$menuService", [function () {

      return [
        {
          "path": "/dashboard",
          "title": "Dashboard",
          "link": "/",
          "icon": "fa fa-home"
        }, {
          "path": "/order",
          "title": "Orders",
          "link": "/orders",
          "icon": "fa fa-list-alt"
        }, {
          "path": "/product",
          "title": "Products",
          "link": null,
          "icon": "fa fa-tags",
          "items": [{
            "path": "/product/products",
            "title": "Products",
            "link": "/products",
            "icon": ""
          }, {
            "path": "/product/attributes",
            "title": "Attributes",
            "link": "/attributes",
            "icon": ""
          }]
        }, {
          "path": "/categories",
          "title": "Categories",
          "link": "/categories",
          "icon": "fa fa-th-list"
        }, {
          "path": "/cms",
          "title": "CMS",
          "link": null,
          "icon": "fa fa-indent",
          "items": [{
            "path": "/cms/pages",
            "title": "Page",
            "link": "/cms/pages",
            "icon": ""
          }, {
            "path": "/cms/gallery",
            "title": "Gallery",
            "link": "/cms/gallery",
            "icon": ""
          }, {
            "path": "/cms/blocks",
            "title": "Block",
            "link": "/cms/blocks",
            "icon": ""
          }]
        }, {
          "path": "/impex",
          "title": "Import / Export",
          "link": "/impex",
          "icon": "fa fa-exchange"
        }, {
          "path": "/seo",
          "title": "URL Rewrite",
          "link": "/seo",
          "icon": "fa fa-random"
        }, {
          "path": "/visitors",
          "title": "Visitors",
          "link": null,
          "icon": "fa fa-users",
          "items": [{
            "path": "/visitors/attributes",
            "title": "Attributes",
            "link": "/v/attributes",
            "icon": ""
          }, {
            "path": "/visitors/email",
            "title": "Email",
            "link": "/emails",
            "icon": ""
          }, {
            "path": "/visitors/list",
            "title": "Visitors",
            "link": "/visitors",
            "icon": ""
          }]
        }, {
          "path": "/settings",
          "title": "Settings",
          "link": null,
          "icon": "fa fa-cogs",
          "items": [{
            "path": "/settings/general",
            "title": "General",
            "link": "/settings/general",
            "icon": ""
          }, {
            "path": "/settings/payment",
            "title": "Payment",
            "link": "/settings/payment",
            "icon": ""
          }, {
            "path": "/settings/shipping",
            "title": "Shipping",
            "link": "/settings/shipping",
            "icon": ""
          }, {
            "path": "/settings/themes",
            "title": "Themes",
            "link": "/settings/themes",
            "icon": ""
          }]
        }]

  }]);
