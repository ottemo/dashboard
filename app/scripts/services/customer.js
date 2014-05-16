define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.services.CustomerService', ['ngResource'])
	.service('CustomerService', ['$resource', function CustomerService($resource) {
      var customerServiceUrl = 'http://localhost:3000/visitor/';
      return $resource(customerServiceUrl, {}, {
          'getAll':  { method: 'GET',    url: customerServiceUrl, isArray:true},
          'save':    { method: 'POST',   url: customerServiceUrl},
          'update':  { method: 'PUT',    params: { id: '@id' }, url: customerServiceUrl + ':id' },
          'query':   { method: 'GET',    params: { id: '@id' }, url: customerServiceUrl + ':id' },
          'remove':  { method: 'DELETE', params: { id: '@id' }, url: customerServiceUrl + ':id' }
      });
	}]);
});
