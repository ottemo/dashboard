angular.module("dashboardModule")


.config(["$httpProvider", function ($httpProvider) {

    var interceptor = ["$q", "$cacheFactory", "$timeout", "$rootScope", "$log", "LoadingBar", 
      function ($q, $cacheFactory, $timeout, $rootScope, $log, LoadingBar) {

      /**
       * The total number of requests made
       */
      var reqsTotal = 0;

      /**
       * The number of requests completed (either successfully or not)
       */
      var reqsCompleted = 0;

      /**
       * The amount of time spent fetching before showing the loading bar
       */
      var latencyThreshold = LoadingBar.latencyThreshold;

      /**
       * $timeout handle for latencyThreshold
       */
      var startTimeout;


      /**
       * calls LoadingBar.complete() which removes the
       * loading bar from the DOM.
       */
      function setComplete() {
        $timeout.cancel(startTimeout);
        LoadingBar.complete();
        reqsCompleted = 0;
        reqsTotal = 0;
      }

      /**
       * Determine if the response has already been cached
       * @param  {Object}  config the config option from the request
       * @return {Boolean} retrns true if cached, otherwise false
       */
      function isCached(config) {
        var cache;
        var defaultCache = $cacheFactory.get("$http");
        var defaults = $httpProvider.defaults;

        // Choose the proper cache source. Borrowed from angular: $http service
        if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === "GET" || config.method === "JSONP")) {
            cache = angular.isObject(config.cache) ? config.cache
              : angular.isObject(defaults.cache) ? defaults.cache
              : defaultCache;
        }

        var cached = cache !== undefined ?
          cache.get(config.url) !== undefined : false;

        if (config.cached !== undefined && cached !== config.cached) {
          return config.cached;
        }
        config.cached = cached;
        return cached;
      }


      return {
        "request": function(config) {
          // Check to make sure this request hasn"t already been cached and that
          // the requester didn"t explicitly ask us to ignore this request:
          if (!config.ignoreLoadingBar && !isCached(config)) {
            $rootScope.$broadcast("LoadingBar:loading", {url: config.url});
            if (reqsTotal === 0) {
              startTimeout = $timeout(function() {
                LoadingBar.start();
              }, latencyThreshold);
            }
            reqsTotal++;
            LoadingBar.set(reqsCompleted / reqsTotal);
          }
          return config;
        },

        "response": function(response) {
          if (!response || !response.config) {
            $log.error("Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50");
            return response;
          }

          if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
            reqsCompleted++;
            $rootScope.$broadcast("LoadingBar:loaded", {url: response.config.url, result: response});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              LoadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return response;
        },

        "responseError": function(rejection) {
          if (!rejection || !rejection.config) {
            $log.error("Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50");
            return $q.reject(rejection);
          }

          if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
            reqsCompleted++;
            $rootScope.$broadcast("LoadingBar:loaded", {url: rejection.config.url, result: rejection});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              LoadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return $q.reject(rejection);
        }
      };

    }];

    $httpProvider.interceptors.push(interceptor);

}]);
