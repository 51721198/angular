'use strict';

angular.
module('urlconfig', ['ngResource'])
    .factory('urlconfig', ["$cookies", function($cookies) {
        var uri = getUri();
        var serverapi = uri.protocal + '://' + uri.host + ':' + uri.port + uri.path;
        var userpre = '/user';
        var licensepre = '/licenseController';
        var hospitalpre = '/hospitalController';

        function getUri() {
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', 'config.JSON', false);
            xhttp.send();
            return JSON.parse(xhttp.responseText);
        };

        //user
        var getUserByPage = serverapi + userpre + '/getUserByPage';
        var modifyUser = serverapi + userpre + '/modifyUser';
        var userlogin = serverapi + userpre + '/login';

        //license
        var showallcodes = serverapi + licensepre + '/showallcodesByPage';
        var uselicense = serverapi + licensepre + '/uselicense';


        //hospital
        var showallhospital = serverapi + hospitalpre + '/showHospitalByPage';

        return {
            getUrl: function(suffix) {
                return serverapi + suffix;
            }
        };

    }])
