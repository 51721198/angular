'use strict';

angular.
module('service.user', ['ngResource']).
factory('user', ['$resource',
    function($resource) {
        return $resource('http://172.16.25.17:8080/license/user/showAllUsers', {}, {
            query: {
                method: 'GET',
                // params: {userID: 'userID'},
                isArray: true
            }
        });


    }
]);
