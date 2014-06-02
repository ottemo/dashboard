(function (define) {
  'use strict';
  define(['angular'], function (angular) {

    angular.module('dashboardApp.directives.BrowseTabHeader', [])
      .directive('browseTabHeader', function () {
        return {
          scope: true,
          templateUrl: 'views/browse/tab/header.html',
          controller: function ($scope, $location) {
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
                  href: '/dashboard/product'
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
                  href: '/dashboard/config'
                }
              },
              {
                title: 'Help',
                class: 'fa fa-search-plus fa-3x',
                content: '',
                linktype: {
                  externalink: 'false',
                  href: '/dashboard/help'
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
          },
          restrict: 'E'
        };
      });
  });
})(window.define);