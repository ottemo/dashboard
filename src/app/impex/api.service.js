angular.module("impexModule")

.service("impexApiService", ["$resource", "REST_SERVER_URI", function ($resource, REST_SERVER_URI) {
  return $resource(REST_SERVER_URI, {}, {
      "importBatch": {
          method: "POST",
          url: REST_SERVER_URI + "/impex/import",

          headers: {"Content-Type": undefined },
          transformRequest: angular.identity
      },
      "importModel": {
          method: "POST",
          params: { model: "@model" },
          url: REST_SERVER_URI + "/impex/import/:model",

          headers: {"Content-Type": undefined },
          transformRequest: angular.identity
      },
      "getModels": {
          method: "GET",
          url: REST_SERVER_URI + "/impex/models"
      },
      "importStatus": {
          method: "GET",
          url: REST_SERVER_URI + "/impex/import/status"
      },
      "importTax": {
        method: "POST",
        params: {},
        url: REST_SERVER_URI + "/taxes/csv",
        headers: {"Content-Type": undefined },
        transformRequest: angular.identity
      },
      "importDiscount": {
        method: "POST",
        params: {},
        url: REST_SERVER_URI + "/csv/coupons",
        headers: {"Content-Type": undefined },
        transformRequest: angular.identity
      },
      "magentoOptions": {
          method: "GET",
          url: REST_SERVER_URI + "/impex/magento/options"
      }
  });
}]);
