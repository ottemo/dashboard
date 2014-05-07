define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.services.CustomerService', ['ngResource'])
	.service('CustomerService', ['$resource', function CustomerService($resource) {
      var customerServiceUrl = 'http://localhost:3000/visitor/';
      return $resource(customerServiceUrl, {}, {
          'getAll':  { method: 'GET',    url: customerServiceUrl},
          'save':    { method: 'POST',   url: customerServiceUrl},
          'update':  { method: 'PUT',    params: { key: "@id" }, url: customerServiceUrl + "(:id)" },
          'query':   { method: 'GET',    params: { key: "@id" }, url: customerServiceUrl + "(:id)" },
          'remove':  { method: 'DELETE', params: { key: "@id" }, url: customerServiceUrl + "(:id)" }
      });
	}]);
});
