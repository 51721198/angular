'use strict';

angular.
module('Auth', ['ngResource'])
    .factory('Auth', ["$cookies", function($cookies) {
        var userName = '';
        var user = {};
        var expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 100);

        return {
            setUser: function(aUser, authUUID) {
                user = JSON.parse(aUser);
                userName = user.username;
                //user.password = aUser.password;
                $cookies.put('userName', userName, { 'expires': expireDate });
                $cookies.put('X-Token', authUUID);
            },
            isLoggedIn: function() {
                userName = $cookies.get('userName');
                console.log('cookie: ' + $cookies.get('userName'))
                    //console.log('get from cookie: ' + (user));
                    // return (userName) ? userName : false;
                return userName;
            },
            clearUser: function() {
                userName = '';
                $cookies.remove('userName');
                $cookies.remove('X-Token');
            }
        }
    }])
