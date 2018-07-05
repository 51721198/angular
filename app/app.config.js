'use strict';

angular.
module('licenseApp')
    .config(['$locationProvider', '$routeProvider', '$httpProvider',
        function config($locationProvider, $routeProvider, $httpProvider) {
            $locationProvider.hashPrefix('!');
            // $httpProvider.defaults.withCredentials = true; //允许向请求中添加cookie,但是添加后报通配符错误
            //$httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = 'http: //evil.com';

            $routeProvider.
            when('/users', {
                    template: '<user-list></user-list>'
                }).when('/users/:userID', {
                    template: '<user-detail></user-detail>'
                }).when('/login', {
                    template: '<login></login>'
                }).when('/license', {
                    template: '<license></license>'
                }).when('/hospital', {
                    template: '<hospital></hospital>'
                }).when('/createlicense', {
                    template: '<createlicense></createlicense>'
                })
                //.otherwise('/users');
        }
    ]).run(['$rootScope', '$location', 'Auth', '$http', '$cookies',
        function($rootScope, $location, Auth, $http, $cookies) {
            // $http.defaults.headers.post['X-token'] = $cookies.xtoken;

            $rootScope.$on('$routeChangeStart', function(event) {
                if (!Auth.isLoggedIn()) {
                    console.log('DENY');
                    // event.preventDefault();
                    $location.path('/login');
                } else {
                    console.log('ALLOW');
                    // $location.path('/users');
                }
            });
        }
    ]);
