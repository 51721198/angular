'use strict';

angular.
module('createlicense', ['service', 'service.user', 'ui.bootstrap', 'ui.bootstrap.tpls'])
    .component('createlicense', {
        templateUrl: 'license/createlicense.template.html',
        //三个DT derective的引入次序必须在$q之前而且有先后顺序,否则会报错
        //数组前几个元素为provider                                                           //再次声明,上下两行的对应关系一定要严格执行,先后次序也不能错
        controller: ['$q', '$scope', '$compile', '$http', '$sce', 'urlconfig', '$route','$location','$cookies','$httpParamSerializer','$httpParamSerializerJQLike',
            function licenseController($q, $scope, $compile, $http, $sce, urlconfig, $route,$location,$cookies,$httpParamSerializer,$httpParamSerializerJQLike) {

                var self = this;
                var defer = $q.defer();

                var hospitals = [];
                self.hospitals = hospitals;

                self.showHospital = function() {
                    $http({
                        method: "GET",
                        url: urlconfig.getUrl('/hospitalController/showhospital'),

                    }).success(function(data, status, headers, config) {
                        defer.resolve(data);
                        defer.promise.then(function(data) {
                            self.hospitals = data.resultobject;
                        })
                    })
                };
                self.showHospital();

                // var license = {
                //     hosNumber: '',
                //     date: '',
                //     encryptcode: '',
                //     rsaKey: '',
                //     sourceCode: '',
                // };

                var license = {};
                self.license = license;

                self.date = Date.now();

                self.status = {
                    startopened: false
                };

                self.open1 = function() {
                    self.status.startopened = true;
                }

                self.dateOptions = {
                    minDate: new Date(), //最小日期
                    //maxDate: new Date(), //最大日期
                };

                self.startDate = function() {
                    alert("asda");
                    self.dateOptions.minDate = new Date;
                }

                //用第二个defer去接结果,否则会跟上面那个请求的结果混在一起
                var defer2 = $q.defer();
                self.createCode = function() {

                    var day = license.date.getDate();
                    var year = license.date.getFullYear();
                    var month = license.date.getMonth() + 1;
                    var duedate = year + '-' + month + '-' + day;
                    self.duedate = duedate;
                    console.log(duedate);
                    $http({
                        method: "GET",
                        url: urlconfig.getUrl('/licenseController/createcode?hosnumber=' + license.hosNumber + '&duedate=' + duedate),
                    }).success(function(data, status, headers, config) {
                        defer2.resolve(data);
                        defer2.promise.then(function(data) {
                            license.sourceCode = data.resultobject.sourceCode;
                            license.keyId = data.resultobject.rsaKey;
                            license.encryptcode = data.resultobject.encryptcode;
                        })
                    })
                }


                self.reloadRoute = function() {
                    $route.reload();
                }

                self.saveCode = function() {
                    license.sourceNumber = license.sourceCode;
                    license.encryptedNumber = license.encryptcode
                    license.hospitalNumber = license.hosNumber
                    license.expiredDate = self.duedate
                    var defer3 = $q.defer();
                    console.log(self.license);
                    console.log('保存地址:'+urlconfig.getUrl('/licenseController/savecode'));
                    console.log(urlconfig.getUrl(''));
                    console.log('发送内容:' + $httpParamSerializer(self.license))
                    $http({
                        method: "POST",
                        headers:{
                            "X-Token": $cookies.get('X-Token'),
                            // "Content-Type": "application/json"
                            "Content-Type":"application/x-www-form-urlencoded"
                        },
                        url: urlconfig.getUrl('/licenseController/savecode'),
                        //如果使用application/x-www-form-urlencoded的方式,则必须把json对象格式化成urlencode对象
                        //注意,如果此处使用x-www-form-urlencoded,后端就不能用@ResponseBody绑参数,不然后端会报错
                        data: $httpParamSerializer(self.license)
                    }).success(function(data, status, headers, config) {
                        defer3.resolve(data);
                        defer3.promise.then(function(data) {
                            alert(data.resultdesc);
                            console.log(data);
                            if (data.resultcode == 1)  $location.path('/license');
                        })
                    })
                }

            }
        ]
    })
