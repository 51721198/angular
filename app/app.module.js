'use strict';

angular.module('licenseApp', [
    'ngRoute',
    'ngCookies',
    'service',
    'service.user',
    'hospital',
    'Auth',
    'userDetail',
    'userList',
    'datatables',
    'createlicense',
    'nav',
    'login',
    'urlconfig',
    'license'
]).controller('MainCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location) {

    $scope.$watch(Auth.isLoggedIn, function(value, oldValue) {
        // if (!value && oldValue) {
        //     alert('here1');
        //     console.log("Disconnect");
        //     $location.path('/login');
        // }

        if (value) {
            console.log("Connect");
            // $location.path('/users');     //刷新跳转,一刷新就跳到users页
            //Do something when the user is connected
        } else {
            console.log("Disconnect");
            $location.path('/login');
        }
    })
}], true);
