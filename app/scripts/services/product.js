define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.services.ProductService', ['ngResource'])
    .service('ProductService', ['$resource', function ProductService($resource) {
      var productServiceUrl = 'http://localhost:3000/product/';
      return $resource(productServiceUrl, {}, {
        'getAll':  { method: 'GET',    url: productServiceUrl, isArray: true},
        'save':    { method: 'POST',   url: productServiceUrl},
        'update':  { method: 'PUT',    params: { id: "@id" }, url: productServiceUrl + ":id" },
        'query':   { method: 'GET',    params: { id: "@id" }, url: productServiceUrl + ":id" },
        'remove':  { method: 'DELETE', params: { id: "@id" }, url: productServiceUrl + ":id" }
      });
    }]);
});

