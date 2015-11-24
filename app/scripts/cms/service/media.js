angular.module('cmsModule')

.factory('cmsMedia', ['$http', 'REST_SERVER_URI',
    function($http, REST_SERVER_URI) {

        var baseUri = REST_SERVER_URI + '/cms/media'

        return {
            all: all,
            add: add
        };

        /////////////////////////

        var _fileUploadConfig = {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        };

        function all() {
            return $http.get(baseUri)
                .then(function(response) {
                    return (response.error == null) ? response.data.result : [];
                });
        }

        function add(files) {
            var data = _filesToFormData(files);

            return $http.post(baseUri, data, _fileUploadConfig)
                .then(function(resp) {
                    //TODO: CLEANUP
                    console.log('service @add ',resp);

                    //TODO: clean the response data
                    return resp;
                });
        }

        function _filesToFormData(files) {
            var fd = new FormData();
            angular.forEach(files, function(file) {
                fd.append('file', file);
            });

            return fd;
        }
    }
]);

