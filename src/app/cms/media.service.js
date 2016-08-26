angular.module("cmsModule")

.factory("cmsMedia", ["$http", "REST_SERVER_URI",
    function($http, REST_SERVER_URI) {

        var baseUri = REST_SERVER_URI + "/cms/media";

        // https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
        // the browser will adjust the content-type to "multipart/form-data" and set the
        // proper boundary parameter
        var _fileUploadConfig = {
            transformRequest: angular.identity,
            headers: { "Content-Type": undefined }
        };

        return {
            all: all,
            add: add
        };

        /////////////////////////


        function all() {
            return $http.get(baseUri)
                .then(function(response) {
                    return (response.data.error == null) ? response.data.result : [];
                });
        }

        function add(files) {
            var data = _filesToFormData(files);

            return $http.post(baseUri, data, _fileUploadConfig).then(function(resp) {
                return resp;
            });
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
        function _filesToFormData(files) {
            var fd = new FormData();
            angular.forEach(files, function(file) {
                // use the filename as the name
                fd.append(file.name, file);
            });

            return fd;
        }
    }
]);

