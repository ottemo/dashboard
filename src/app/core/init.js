angular.module('coreModule',['textAngular'])

.constant('MEDIA_BASE_PATH', angular.appConfigValue('general.app.media_path'))
.constant('PRODUCT_DEFAULT_IMG', 'placeholder.png')

// non-angularized libs
.constant('moment', window.moment)
.constant('_', window._)

.config(function ($provide) {

    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$uibModal', function (taRegisterTool, taOptions, $uibModal) {
        taRegisterTool('uploadImage', {
            buttontext: 'Upload Image',
            tooltiptext: 'Upload image',
            iconclass: "fa fa-image",
            action: function (deferred,restoreSelection) {
                $uibModal.open({
                    controller: 'cmsPageUploadController',
                    templateUrl: "/views/cms/page/upload.html",
                    size: 'lg'
                }).result.then(
                    function (result) {
                        restoreSelection();
                        document.execCommand('insertImage', true, result);
                        deferred.resolve();
                    },
                    function () {
                        deferred.resolve();
                    }
                );
                return false;
            }
        });
        taOptions.toolbar[3].push('uploadImage');
        return taOptions;
    }]);
});




