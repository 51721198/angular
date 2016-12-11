'use strict';

// Register `userDetail` component, along with its associated controller and template
angular.
module('nav', ['ngRoute', 'ui.bootstrap']).
component('nav', {
    templateUrl: 'navbar/nav.template.html',
    controller: ['$routeParams', '$location', '$rootScope', '$route', '$scope', 'Auth',

        function navController($routeParams, $location, $rootScope, $route, $scope, Auth) {
            var self = this;

            // function showhide() {
            //     console.log("show2: " + show);
            //     console.log(absUrl == '/login');
            //     if (absUrl == '/login') {
            //         self.show = false;

            //     }
            // };
            // showhide();
            // var paths = ['/login'];

            // $rootScope.$on('$locationChangeSuccess', function() {
            //     var $$route = $route.current.$$route;

            //     $scope.contentVisbility = $$route && paths.indexOf($$route.originalPath) < 0;
            //     console.log($scope.contentVisbility);
            // })

            // $(".btn-group > .btn").click(function() {
            //     $(this).addClass("active").siblings().removeClass("active");
            // })

            //var selected = '';
            self.selectMe = function() {
                var selectTab = 'users';
                selectTab = $location.path().replace('/', '');
                return selectTab;
            }

            self.dislogin = function() {
                Auth.clearUser();
            }

            var currentUser = '';
            self.currentUser = currentUser;

            function reloadRoute() {
                $route.reload();
            }

            self.getUser = function() {
                self.currentUser = Auth.isLoggedIn();
                return self.currentUser;
            };

            var currentPath = '';
            //模版HTML页面调用的函数前必须添加self.
            self.showActive = function(location) {
                //alert("sd");
                self.currentPath = $location.path().replace('/', '');
                return location == $location.path();
            };
        }
    ]
});
