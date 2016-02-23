# Contributing to Ottemo

## Table of Contents
[Styleguides](#styleguides)
* [Git Commit Messages](#git-commit-messages)
* [File Naming & Hierarchy](#file-naming-&-hierarchy)
* [JavaScript](#javascript-&-angularjs)
* [HTML](#html)

Git Workflow

## Styleguides

### Git Commit Messages
`[#1920837] Move address form into directive for re-usability`

* Prefix with the ticket id in square braces
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less



### File Naming & Hierarchy
* `kebab-case.html` or `kebab-case.type.js` all files

* template, css, and controller should have similar names
  * pdp/view.html
  * pdp/view.scss
  * pdp/view.controller.js -> PdpViewController



### JavaScript & AngularJS

1. [File Contents](#file-contents)
2. [Modules](#modules)
3. [Controllers](#controllers)
    * names should be `UppserCamelCase`
    * names should have the suffix `Controller`
    * use the `controllerAs` syntax
    * capture the variable for this in `vm`
    * put bindable members up top
    * use an `activate` method to house any initialization logic

#### File Contents
Each file should contain one "thing"; module definition, controller, service, etc

#### Modules
A module declaration should use the setter syntax
```js
// good: setter syntax to declare module
angular.module('app', []);

// good: getter syntax to recall module
angular.module('app')
.controller('SomeController', SomeController);
```

#### Controllers
1. Controller names should be `UpperCamelCase`

1. Controller names should be suffixed with `Controller` ie. `CustomerController` or `CheckoutController`

1. Prefer the `controllerAs` syntax, this promotes the use of _dotted_ objects
    * if the controller is the view model controller try to name it `vm` for consistency
    * if the controller is embedded then consider naming it something else

    Declaring the controller in the config:
    ```js
    // recommended
    angular.module('app')
    .config(function($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'Avengers',
                controllerAs: 'vm'
            })
    });
    ```

    Declaring the controller in the html:
    ```html
    <!-- bad -->
    <div ng-controller="CustomerController">{{ name }}</div>

    <!-- good -->
    <div ng-controller="CustomerController as customer">{{ customer.name }}</div>
    ```

1. Capture the variable for `this` with `vm` in the controller code as well, for consistency
    ```js
    // good
    function CustomerController() {
        var vm = this;
        vm.name = {};
    }
    ```

1. Put the bindable members up top
    *  If the function is a 1 liner consider keeping it right up top, as long as readability is not affected.

    ```js
    /* bad */
    function SessionsController() {
        var vm = this;

        vm.gotoSession = function() {
          /* ... */
        };
        vm.refresh = function() {
          /* ... */
        };
        vm.search = function() {
          /* ... */
        };
        vm.sessions = [];
        vm.title = 'Sessions';
    }

    /* good */
    function SessionsController() {
        var vm = this;

        vm.gotoSession = gotoSession;
        vm.refresh = refresh;
        vm.search = search;
        vm.sessions = [];
        vm.title = 'Sessions';

        ////////////

        function gotoSession() {
          /* ... */
        }
        function refresh() {
          /* ... */
        }
        function search() {
          /* ... */
        }
    }
    ```

1. Use an `activate()` method to house any initialization logic
    ```js
    function AvengersController(avengersService, logger) {
        var vm = this;
        vm.avengers = [];
        vm.getAvengers = getAvengers;
        vm.title = 'Avengers';

        activate();

        ////////////////////

        function activate() {
            return getAvengers().then(function() {
                logger.info('Activated Avengers View');
            });
        }

        function getAvengers() {
            return avengersService.getAvengers().then(function(data) {
                vm.avengers = data;
                return vm.avengers;
            });
        }
    }
    ```

### HTML

