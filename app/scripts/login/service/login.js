angular.module("loginModule")

.service('$loginLoginService', [
    '$resource',
    '$loginApiService',
    '$q',
    '$designService',
    'VISITOR_DEFAULT_AVATAR',
    function ($resource, $loginApiService, $q, $designService, VISITOR_DEFAULT_AVATAR) {

        /** Variables */
        var login, isAdmin, isLoggedIn, deferIsLoggedIn , mapFields, deferLogOut;
        /** Functions */
        var init, getLogin, getLoginId, setLogin, cleanLogin, getLoginProperty,
            getAvatar, getFullName, fIsLoggedIn, getDefaultLogin, logout, fillFields;

        isLoggedIn = null;

        getDefaultLogin = function () {
            return {
                'facebook_id': '',
                'google_id': '',
                'billing_address_id': '',
                'shipping_address_id': '',
                'email': '',
                'fname': '',
                'lname': '',
                'password': '',
                'billing_address': {},
                'shipping_address': {}
            };
        };

        getLoginProperty = function (field) {
            var res, i, f;
            for (res in mapFields) {
                if (mapFields.hasOwnProperty(res)) {
                    for (i = 0; i < mapFields[res].length; i += 1) {
                        f = mapFields[res][i];
                        if (f === field) {
                            return res;
                        }
                    }
                }
            }

            return null;
        };

        mapFields = {
            'facebook_id': ['facebook_id', 'facebookId', 'facebookID'],
            'google_id': ['google_id', 'googleId', 'googleID'],
            'billing_address_id': ['billing_address_id', 'billing_id', 'billingId', 'billingID'],
            'shipping_address_id': ['shipping_address_id', 'shipping_id', 'shippingId', 'shippingID'],
            'email': ['email', 'e-mail', 'Email', 'EMail', 'E-Mail'],
            'fname': ['fname', 'f-name', 'f_name', 'first_name', 'first-name'],
            'lname': ['lname', 'l-name', 'l_name', 'last_name', 'last-name'],
            'billing_address': ['billing_address'],
            'shipping_address': ['shipping_address']
        };

        login = getDefaultLogin();

        init = function (force) {
            deferIsLoggedIn = $q.defer();

            if (null !== isLoggedIn && !force) {
                deferIsLoggedIn.resolve(isLoggedIn);
                return deferIsLoggedIn.promise;
            }

            $loginApiService.info().$promise.then(
                function (response) {
                    if (response.error === null) {
                        isAdmin = response.result['is_admin'] || false;
                        if (isAdmin === true) {
                            isLoggedIn = true;
                            deferIsLoggedIn.resolve(isLoggedIn);
                            setLogin(response.result);
                        } else {
                            isLoggedIn = false;
                            deferIsLoggedIn.resolve(isLoggedIn);
                        }
                    } else {

                        isLoggedIn = false;
                        cleanLogin();
                        deferIsLoggedIn.resolve(isLoggedIn);
                    }
                }
            );

            return deferIsLoggedIn.promise;
        };

        logout = function () {
            deferLogOut = $q.defer();

            $loginApiService.logout().$promise.then(function(res){
                if (res.error === null){
                    isLoggedIn = false;
                    login = getDefaultLogin();
                    deferLogOut.resolve(true);
                } else {
                    deferLogOut.reject();
                }
            })

            return deferLogOut.promise;
        };

        fillFields = function (obj) {
            var field, prop;
            for (field in obj) {
                if (obj.hasOwnProperty(field)) {
                    prop = getLoginProperty(field);
                    if (prop !== null) {
                        login[prop] = obj[field];
                    }
                }
            }
        };

        setLogin = function (obj) {
            fillFields(obj);
            if (obj !== null) {
                login['billing_address_id'] = obj['billing_address'] && obj['billing_address']._id || '';
                login['shipping_address_id'] = obj['shipping_address'] && obj['shipping_address']._id || '';
            }
        };


        getLogin = function () {
            return login;
        };

        cleanLogin = function () {
            login = getDefaultLogin();
        };

        getAvatar = function () {
            var avatar;
            avatar = $designService.getImage(VISITOR_DEFAULT_AVATAR);

            return avatar;
        };

        getFullName = function () {
            if (JSON.stringify(getDefaultLogin()) === JSON.stringify(login)) {
                return false;
            }
            return login.fname + ' ' + login.lname;
        };

        getLoginId = function () {
            return isAdmin;
        };

        fIsLoggedIn = function () {
            return isLoggedIn;
        };

        return {
            init: init,
            cleanLogin: cleanLogin,
            setLogin: setLogin,
            getLogin: getLogin,
            getAvatar: getAvatar,
            getFullName: getFullName,
            getLoginId: getLoginId,
            isLoggedIn: fIsLoggedIn,
            logout: logout
        };
    }
]);
