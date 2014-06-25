(function (define) {
    'use strict';

    define(['dashboard/init'], function (dashboardModule) {

        dashboardModule
            /*
             *  HTML top page header manipulator (direct service mapping)
             */
            .controller('pageHeaderController', ['$scope', '$pageHeaderService', function ($scope, $pageHeaderService) {
                $scope.it = $pageHeaderService;
                $scope.leftMenu= $pageHeaderService.getMenuLeft();
                $scope.rightMenu = $pageHeaderService.getMenuRight();
            }])

            /*
             *  HTML top page controller manipulator (direct service mapping)
             */
            .controller('pageController', ['$scope', '$pageService', function ($scope, $pageService) {
                $scope.it = $pageService;
            }])

            .controller('dashboardController', ['$scope', '$loginService', function($scope, $loginService) {
                $scope.x = 'dashboardController';
            }])

            .controller('headerController', ['$scope', '$loginService', function($scope, $loginService) {
                $scope.x = 'headerController';
                $scope.logout = $loginService.logout;
            }])

            .controller('footerController', ['$scope', function($scope) {
                $scope.x = 'footerController';
            }])

            .controller('browseTabController1', ['$scope', '$location', function ($scope, $location) {
                $scope.menuitems = [
                  {
                    title: 'Visitors',
                    class: 'fa fa-users fa-3x',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '/dashboard/visitor'
                    },
                    submenu: [
                      {
                        title: ' Sub-sub-Menu Item 1',
                        class: '',
                        content: '',
                        linktype: {
                          externalink: 'false',
                          href: '#'
                        }
                      },
                      {
                        title: 'Sub-sub-Menu Item 2',
                        class: '',
                        content: '',
                        linktype: {
                          externalink: 'false',
                          href: '#'
                        }


                      }
                    ]

                  },
                  {
                    title: 'Products',
                    class: 'fa fa-cubes fa-3x',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '/product'
                    },
                    submenu: [
                      {
                        title: ' Sub-Menu Item 1',
                        class: '',
                        content: '',
                        linktype: {
                          externalink: 'false',
                          href: '#'
                        }
                      },
                      {
                        title: ' Sub-Menu Item 2',
                        class: '',
                        content: '',
                        linktype: {
                          externalink: 'false',
                          href: '#'
                        },
                        submenu: [
                          {
                            title: ' Sub-sub-Menu Item 1',
                            class: '',
                            content: '',
                            linktype: {
                              externalink: 'false',
                              href: '#'
                            }
                          },
                          {
                            title: 'Sub-sub-Menu Item 2',
                            class: '',
                            content: '',
                            linktype: {
                              externalink: 'false',
                              href: '#'
                            }


                          }
                        ]
                      }
                    ]
                  },
                  {
                    title: 'Settings',
                    class: 'fa fa-cog fa-3x',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '/config'
                    }
                  },
                  {
                    title: 'Help',
                    class: 'fa fa-search-plus fa-3x',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '/help'
                    }
                  }
                ];

                $scope.getClass = function (path) {
                  if ($location.path().substr(0, path.length) === path) {
                    return 'active';
                  } else {
                    return '';
                  }
                };
            }])

            .controller('browseTabController2', ['$rootScope', '$scope', function ($rootScope, $scope) {
                var switchView, addNewEntity, searchEntity;
                /**
                 * dispatches 'change.the.browse.view' event
                 *
                 */
                switchView = function (view) {
                    if ($scope.activeView === view) {
                        return;
                    }
                    if (view === 'list' || view === 'tile') {
                        $scope.activeView = view;
                    } else {
                        $scope.activeView = $scope.activeView === 'list' ? 'tile' : 'list';
                    }
                    $rootScope.$broadcast('change.the.browse.view', $scope.activeView);
                };

                /**
                 *  dispatches 'add.new.entity' event
                 *
                 */
                addNewEntity = function () {
                    $rootScope.$broadcast('add.new.entity', {});
                };

                /**
                 * dispatches 'search.for.entity' event
                 *
                 * @param query {string}
                 */
                searchEntity = function (query) {
                    $rootScope.$broadcast('search.for.entity', query);
                };

                $scope.addNewEntity = addNewEntity;
                $scope.switchView = switchView;
                $scope.searchEntity = searchEntity;
            }]);

        return dashboardModule;
    });
})(window.define);