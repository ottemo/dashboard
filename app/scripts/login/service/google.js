(function (define) {
    'use strict';

    define(['angular'], function () {

            var init, clientId, requestData, login, loginCallback, userData, avatar, getAvatar;
            userData = {'access_token': ''};

            clientId = '1074763412644-qq25glj3tb87bq7bk5m8793da11ddheh.apps.googleusercontent.com';

            avatar = 'https://plus.google.com/s2/photos/profile/##googleId##?sz=150';

            requestData = {
                'clientid': clientId,
                'cookiepolicy': 'single_host_origin',
                'callback': 'loginCallback',
                'approvalprompt': 'force',
                'redirecturi': 'postmessage',
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
            };

            /**
             *
             */
            init = function () {
                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = 'https://apis.google.com/js/client.js?onload=onLoadCallback';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            };

            login = function () {
                gapi.auth.signIn(requestData); //jshint ignore:line
            };

            loginCallback = function (response) {
                if (response.status.signed_in) {        // jshint ignore:line
                    userData = {
                        access_token: response.access_token     // jshint ignore:line
                    };
                } else {
                    userData = {'access_token': ''};
                }
                return userData;
            };

            getAvatar = function (userId) {
                var url, regexp;
                regexp = /##googleId##/;
                url = avatar.replace(regexp, userId);
                return url;
            };

            return{
                clientId: clientId,
                requestData: requestData,
                userData: userData,
                login: login,
                loginCallback: loginCallback,
                getAvatar: getAvatar,
                init: init
            };

        }
    )
    ;
})(window.define);
