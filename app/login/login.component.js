'use strict';

// Register `userDetail` component, along with its associated controller and template
angular.
module('login', ['ngRoute', 'ui.bootstrap']).
component('login', {
    templateUrl: 'login/login.template.html',
    controller: ['$routeParams', '$http', '$q', '$location', 'Auth', '$route', 'urlconfig',
        function loginController($routeParams, $http, $q, $location, Auth, $route, urlconfig) {
            var self = this;

            var username = '';
            var password = '';
            var person = {};
            var defer = $q.defer();
            self.username = username;
            self.password = password;

            //模版HTML页面调用的函数前必须添加self.
            self.showActive = function(vm) {
                //alert("sd");
            };

            //刷新页面
            function reloadRoute() {
                $route.reload();
            }

            self.userlogin = function() {
                person.username = $('#login-username').val();
                person.password = $('#login-password').val();
                //console.log(person);

                var url = urlconfig.getUrl('/user/login');
                console.log(url);
                // $http.post(url, JSON.stringify(person))
                $http({
                        method: "POST",
                        url: url,
                        headers: {
                            "Content-Type": "application/json",
                            //"Access-Control-Allow-Credentials": "true",   //login页面最好不加这些,因为不需要验权限
                            //"Access-Control-Allow-Origin": "http://172.16.25.18:8000",
                            //"Access-Control-Allow-Origin": "http://localhost:8000",
                        },
                        data: JSON.stringify(person)
                    })
                    .success(function(data, status, headers, config) {
                        defer.resolve(data);
                        defer.promise.then(function(data) {
                            console.log(data);
                            if (data.resultcode >= 0 && data.resultcode != null) {
                                console.log(JSON.stringify(person));
                                console.log('!!!!!!!!!!!!!!!!!!!resultobject' + data.resultobject)
                                Auth.setUser(JSON.stringify(person), data.resultobject);

                                $location.path('/users');
                                reloadRoute(); //如果不刷新页面,导航栏用户名会为空!!!
                                var curl = $location.absUrl();
                                console.log(curl);
                            } else {
                                alert("用户名或密码错误!")
                                $location.path('/login');
                                reloadRoute(); //如果不刷新页面,用户输入正确用户名密码也无法登陆
                                var curl = $location.absUrl();
                                console.log(curl);
                            }

                        }); //返回的数据可以在这里进行处理
                    });
            }

        }
    ]
});
