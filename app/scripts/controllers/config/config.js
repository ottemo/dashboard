define(['angular'],
    function (angular) {
        'use strict';
        /****************************************************************************/
        /*                                                                          */
        /*                                                                          */
        /*                                                                          */
        /*                            Product page                                  */
        /*                                                                          */
        /*                                                                          */
        /*                                                                          */
        /*                                                                          */
        /****************************************************************************/

        angular.module('dashboardApp.controllers.DashboardConfigCtrl', ['ngAnimate'])
            .controller('DashboardConfigCtrl', [
                '$scope',
                function ($scope) {
                    $scope.activeTab = 'facebook';
                    $scope.tabTemplates = {
                        facebook: 'views/config/facebook.html',
                        google: 'views/config/google.html'
                    };
                    $scope.configFormField = {
                        FacebookOauthConfig:
                        {
                            ClientID:       'xxxxxxxxxxxx',
                            ClientSecret:   'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                            RedirectURL:    'http://xxxxx.com/auth/callback/facebook',
                            Scopes: [
                                {email: 'someemail.com'},
                                {email: 'someemail1.com'}
                            ]
                        },
                            GoogleOauthConfig:
                        {
                            ClientID:       '676130063095-m5hnkl8q4bjuij49mo4is6sdocxxxpi.apps.googleusercontent.com',
                            ClientSecret:   'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                            RedirectURL:    'http://xxxxx.com/auth/callback/google',
                            Scopes:
                                [
                                    {link: 'https://www.googleapis.com/auth/userinfo.email'} ,
                                    {link: 'https://www.googleapis.com/auth/userinfo.profile'}
                                ]
                        }
                    };



                    $scope.switchTabTo = function (tabId) {
                        $scope.activeTab = tabId;
                        /* other stuff to do */
                    };

                }
            ]
        );
    });
