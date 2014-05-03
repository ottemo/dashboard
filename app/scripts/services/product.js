define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.services.ProductService', ['ngResource'])
    .service('ProductService', ['$resource', function ProductService($resource) {
      var productServiceUrl = 'http://localhost:3000/api/v1/products/';
      return $resource(productServiceUrl, {}, {
        'getAll':  { method: 'GET',    url: productServiceUrl},
        'save':    { method: 'POST',   url: productServiceUrl},
        'update':  { method: 'PUT',    params: { key: "@id" }, url: productServiceUrl + "(:id)" },
        'query':   { method: 'GET',    params: { key: "@id" }, url: productServiceUrl + "(:id)" },
        'remove':  { method: 'DELETE', params: { key: "@id" }, url: productServiceUrl + "(:id)" }
      });
    }]);
});

