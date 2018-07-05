'use strict';

angular.
module('license', ['service', 'service.user', 'datatables', 'datatables.bootstrap', 'datatables.buttons', 'ui.bootstrap', 'ui.bootstrap.tpls'])
    .component('license', {
        templateUrl: 'license/license.template.html',

        //三个DT derective的引入次序必须在$q之前而且有先后顺序,否则会报错
        //数组前几个元素为provider                                                           //再次声明,上下两行的对应关系一定要严格执行,先后次序也不能错
        controller: ['DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$q', '$scope', '$compile', '$http', '$sce', 'urlconfig', '$cookies',
            function licenseController(DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $q, $scope, $compile, $http, $sce, urlconfig, $cookies) {
                //定义变量
                var self = this;
                var dtInstance = {};
                var message = '';
                var defer = $q.defer();
                var license = {};
                self.license = license;

                //把变量注册到当前作用域
                self.dtInstance = dtInstance;

                // self.dtOptions = DTOptionsBuilder.fromFnPromise(function(){

                //   //dtColumnDefs的定义必须在最前面,否则会报错
                // self.dtColumnDefs = [
                // DTColumnDefBuilder.newColumnDef(0),
                //   DTColumnDefBuilder.newColumnDef(1).notVisible(),
                //   DTColumnDefBuilder.newColumnDef(2).notSortable()
                // ];

                //resource方式向rest请求数据
                //   var defer = $q.defer();
                //   user.query().$promise.then(function(result){
                //     defer.resolve(result);
                //   });
                //   return defer.promise;
                // }).withPaginationType('full_numbers').withDisplayLength(10).withOption('rowCallback', rowCallback);

                //ajax向后台请求分页数据
                self.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        // url: 'http://172.16.25.17:8080/license/licenseController/showallcodesByPage',
                        url: urlconfig.getUrl('/license/showallcodesByPage'),
                        type: 'POST',
                        headers: {
                            //"Content-Type": "application/json",       //加了此行会毁掉datatable的请求格式,导致出错
                            //"Access-Control-Allow-Credentials": "true",  //加在这里没用,要用$httpprovider才行
                            //"Access-Control-Allow-Origin": "http://localhost:8000",  //加了没有用,不能手动指定 
                            "X-Token": $cookies.get('X-Token')
                        }
                    })
                    .withDataProp('data') //此处的data对应后台返回请求中的消息字段名,后台叫data这里就是data,后台叫user此处就必须为user
                    //.withOption('processing', true)
                    .withOption('serverSide', true)
                    .withOption('responsive', true)
                    .withOption('createdRow', createdRow) //回调函数,请求再次编译所有js文件
                    //.withDOM('frtip')
                    .withPaginationType('full_numbers')
                    .withOption('autoWidth', false)
                    .withOption('rowCallback', rowCallback) //回调函数,
                    .withBootstrap()
                    .withButtons([
                        'print',
                        //'columnsToggle',       //列显示开关
                        {
                            text: 'Some button',
                            key: '1',
                            // action: function(e, dt, node, config) {
                            //     alert('Button activated');
                            // }
                            action: function() {
                                $scope.open();
                            }
                        }
                    ]);


                //定列名
                self.dtColumns = [
                    DTColumnBuilder.newColumn('serialNumberId').withTitle('serialNumberId').withOption('sWidth', '10%'),
                    DTColumnBuilder.newColumn('sourceNumber').withTitle('sourceNumber').withOption('sWidth', '30%'),
                    DTColumnBuilder.newColumn('createDate').withTitle('createDate').withOption('sWidth', '15%'),
                    DTColumnBuilder.newColumn('expiredDate').withTitle('expiredDate').withOption('sWidth', '15%'),
                    //DTColumnBuilder.newColumn('encryptedNumber').withTitle('encryptedNumber').withOption('sWidth', '20%'),
                    //DTColumnBuilder.newColumn('hospitalNumber').withTitle('hospitalNumber'),
                    DTColumnBuilder.newColumn('licenseState').withTitle('licenseState').withOption('sWidth', '%15'),
                    //DTColumnBuilder.newColumn('keyId').withTitle('keyId'),
                    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml).withOption('sWidth', '%15')
                ];

                var showdata = '';
                self.edit = function(license) {
                    //console.log("jdisajidsao");
                    //self.license = license;

                    //alert("edit: " + person.username);
                    //self.message = 'You are trying to edit the row: ' + JSON.stringify(person); //错误搞法
                    self.message = license;
                    self.showdata = license;
                    //console.log(self.message.sourceNumber);
                    //console.log(message.username);
                };

                //模版里面调用click函数必须在函数前加self.
                self.download = function(adata) {
                    console.log(adata);
                    // var url = 'http://172.16.25.17:8080/license/licenseController/uselicense/' + adata;
                    var url = urlconfig.getUrl('/license/uselicense/') + adata;
                    $http({
                        url: url,
                        method: 'GET',
                        responseType: 'arraybuffer',
                        cache: false,
                    }).success(function(data) {
                        var zip = new Blob([data], { type: 'application/zip;charset = utf-8' });
                        saveAs(zip); //FileSaver不需要注入就可以使用
                    });

                    //alert("can here");
                    //console.log("updatePerson");
                    // var url = 'http://172.16.25.17:8080/license/user/modifyUser';
                    // Edit some data and call server to make changes...
                    // Then reload the data so that DT is refreshed
                    // $http.post(url, JSON.stringify(person)).success(function(data, status, headers, config) {
                    //     defer.resolve(data); //返回的数据可以在这里进行处理
                    //     //self.dtInstance.rerender();
                    //     self.dtInstance.reloadData();
                    // });
                }

                function createdRow(row, data, dataIndex) {
                    //关键方法,把angular生成的DOM中的事件绑定到
                    //已经存在的HTML的DOM中,无此方法则controller中插入的DOM中的事件均无法触发
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                }

                self.deleteRow = function(person) {
                    alert("delete: " + person.username);
                    self.person = person;
                    self.message = 'You are trying to remove the row: ' + JSON.stringify(person);
                    // Delete some data and call server to make changes...
                    // Then reload the data so that DT is refreshed
                    self.dtInstance.reloadData(); //调用该方法之后,datatable会重新向后台发起ajax请求
                };

                function actionsHtml(data, type, full, meta) {
                    self.license[data.serialNumberId] = data; //把返回的所有数据装进一个数组,数组索引为数据的userID字段
                    // console.log("this row: " + persons[data.userID].username);
                    //controller中插入的DOM元素,必须被再次编译一次,否则其中的事件无法被触发
                    //利用ng-repeate指令则无需再次编译
                    //$ctrl.persons[' + data.userID + '] 取出数组中指定索引处的单条数据
                    return '<button class="btn btn-default" data-toggle="modal" data-target="#myModal" ng-click="$ctrl.edit($ctrl.license[' + data.serialNumberId + '])"><span class="glyphicon glyphicon-tasks" aria-hidden="true"></span> view </button>&nbsp;' +
                        //return '<button class="btn btn-warning" data-toggle="modal" data-target="#myModal" > use </button>&nbsp;' +
                        '<button class="btn btn-danger" ng-click="$ctrl.deleteRow($ctrl.license[' + license.serialNumberId + '])" )"=""><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> delete</button>';
                    //假如HTML语句是在controller里面加入的,那么可以直接调用本地方法(无self.前缀)
                };

                function someClickHandler(info) {
                    self.message = info.userID + ' - ' + info.username;
                };

                function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
                    $('td', nRow).unbind('click');

                    $('td', nRow).bind('click', function() {
                        $scope.$apply(function() {
                            someClickHandler(aData); //调上面的someClickHandler方法
                        });
                    });
                    return nRow;
                };

                $scope.open = function(size) {
                    //     var modalInstance = $modal.open({
                    //         templateUrl: 'license/myModalContent.html',
                    //         controller: function($scope) {
                    //             $scope.name = 'bottom';
                    //         },
                    //         size: size,
                    //         resolve: {
                    //             items: function() {
                    //                 return $scope.items;
                    //             }
                    //         }
                    //     });

                    //     modalInstance.result.then(function(selectedItem) {
                    //         $scope.selected = selectedItem;
                    //     }, function() {
                    //         console.log('Modal dismissed at: ' + new Date());
                    //     });
                    // };
                }
            }
        ]
    });
