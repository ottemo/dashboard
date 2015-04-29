"use strict";

window.name = "NG_DEFER_BOOTSTRAP!"; // http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap

// require.config({
//     "baseUrl": "scripts",
//     "paths": {
//         "config": "config",
//         "angular": "../lib/angular/angular.min",
//         "tinymce": "../lib/tinymce/tinymce.min",

//         "angular-scenario": "../lib/angular/angular-scenario.min",
//         "angular-sanitize": "../lib/angular/angular-sanitize.min",
//         "angular-route": "../lib/angular/angular-route.min",
//         "angular-resource": "../lib/angular/angular-resource.min",
//         "angular-cookies": "../lib/angular/angular-cookies.min",
//         "angular-mocks": "../lib/angular/angular-mocks",

//         "angular-animate": "../lib/angular/angular-animate.min",
//         "angular-bootstrap": "../lib/angular/ui-bootstrap-tpls.min"
//     },
//     "shim": {
//         "config": {exports: "config"},
//         "angular": {deps: ["config"], exports: "angular"},
//         "tinymce": {
//             exports: 'tinymce'
//         },

//         "angular-route": ["angular"],
//         "angular-cookies": ["angular"],
//         "angular-sanitize": ["angular"],
//         "angular-resource": ["angular"],
//         "angular-animate": ["angular"],

//         "angular-mocks": { deps: ["angular"], exports: "angular.mock"},
//         "angular-bootstrap": { deps: ["angular"], exports: "uiBootstrap"}
//     },
//     "priority": ["angular"]
// });


// require(['angular'], function (angular) {
//     if (typeof require.iniConfig === "undefined") {
//         require.iniConfig = {};
//     }
    angular.appConfig = {
      "general.app.foundation_url": "http://foundation.kg.dev.ottemo.io",
      "general.app.media_path": "//kg.dev.ottemo.io/media/",
      "themes.list.active": "default",
      "general.app.item_per_page": 15
    };
    angular.appConfigValue = function (valueName) {
        if (typeof angular.appConfig[valueName] !== "undefined") {
            return angular.appConfig[valueName];
        } 
        return "";
    };
    
    angular.element(document).ready(function () {
            var modules = Object.keys( angular.module );

            angular.isExistFile = function () {
                return false;
            };
            angular.resumeBootstrap( modules );
        });

// });

// require([
//         "angular",
//         "angular-bootstrap",

//         "design/module",
//         "dashboard/module",
//         "config/module",

//         "product/module",
//         "category/module",
//         "visitor/module",
//         "login/module",
//         "cms/module",
//         "seo/module",
//         "order/module",
//         "impex/module"
//     ],
//     function (angular) {
//         angular.element(document).ready(function () {
//             var modules = Object.keys( angular.module );

//             angular.isExistFile = function () {
//                 return false;
//             };
//             angular.resumeBootstrap( modules );
//         });
//     }
// );
