dashboard
=========

Administration and Dashboards for Ottemo

##install

Install `generator-angular-require`:

    	$ npm install -g generator-angular-require
    	
Run `yo angular-require`, optionally passing an app name:

		$ yo angular-require [app-name]

##usage
`grunt build` must be run before anything else due to dependency population in the RequireJS config and the like (this will be fixed in a future version).

Run `grunt` for building:

		$ grunt
		
and `grunt serve` for preview:

		$ grunt serve

when you creating angular components use builtin generators, which are listed below:

### App
Sets up a new AngularJS-RequireJS app, generating all the boilerplate you need to get started. The app generator also optionally installs Twitter Bootstrap and additional AngularJS modules, such as angular-resource (installed by default). All files created will be in the RequireJS/AMD format, and therefore all will be within "define" blocks.

Example:
```bash
yo angular-require
```

### Route
Generates a controller and view, and configures a route in `app/scripts/app.js` connecting them.

Example:
```bash
yo angular-require:route myroute
```

Produces `app/scripts/controllers/myroute.js`:
```javascript
define(['angular'], function (angular) {
  'use strict';
  angular.module('myApp.controllers.myrouteCtrl', [])
    .controller('myrouteCtrl', function ($scope) {
      // ...
    });
});
```

Produces `app/views/myroute.html`:
```html
<p>This is the myroute view</p>
```

### Controller
Generates a controller in `app/scripts/controllers`.

Example:
```bash
yo angular-require:controller user
```

Produces `app/scripts/controllers/user.js`:
```javascript
define(['angular'], function (angular) {
  'use strict';
  angular.module('myApp.controllers.userCtrl', [])
    .controller('userCtrl', function ($scope) {
      // ...
    });
});
```
### Directive
Generates a directive in `app/scripts/directives`.

Example:
```bash
yo angular-require:directive myDirective
```

Produces `app/scripts/directives/myDirective.js`:
```javascript
define(['angular'], function (angular) {
  'use strict';
  angular.module('myApp.directives.myDirective', [])
    .directive('myDirective', function () {
      return {
        template: '<div></div>',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
          element.text('this is the myDirective directive');
        }
      };
    });
  });
```

### Filter
Generates a filter in `app/scripts/filters`.

Example:
```bash
yo angular-require:filter myFilter
```

Produces `app/scripts/filters/myFilter.js`:
```javascript
define(['angular'], function (angular) {
  'use strict';
  angular.module('myApp.filters.myFilter', [])
    .filter('myFilter', function () {
      return function (input) {
        return 'myFilter filter:' + input;
      };
    });
});
```

### View
Generates an HTML view file in `app/views`.

Example:
```bash
yo angular-require:view user
```

Produces `app/views/user.html`:
```html
<p>This is the user view</p>
```

### Service
Generates an AngularJS service.

Example:
```bash
yo angular-require:service myService
```

Produces `app/scripts/services/myService.js`:
```javascript
define(['angular'], function (angular) {
  'use strict';
  angular.module('myApp.services.myService', [])
    .service('myService', function () {
      // ...
    });
});
```

You can also do `yo angular:factory`, `yo angular:provider`, `yo angular:value`, and `yo angular:constant` for other types of services.

### Decorator
Generates an AngularJS service decorator.

Example:
```bash
yo angular-require:decorator serviceName
```

Produces `app/scripts/decorators/serviceNameDecorator.js`:
```javascript
define(['angular'], function (angular) {
  'use strict';
  angular.module('myApp.decorators.serviceName', [])
    .config(function ($provide) {
      $provide.decorator('serviceName', function ($delegate) {
        // ...
        return $delegate;
      });
    });
});
```
		