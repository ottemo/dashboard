angular.module('coreModule',[])

.constant('MEDIA_BASE_PATH', angular.appConfigValue('general.app.media_path'))
.constant('PRODUCT_DEFAULT_IMG', 'placeholder.png')

// non-angularized libs
.constant('moment', window.moment)
.constant('_', window._);
