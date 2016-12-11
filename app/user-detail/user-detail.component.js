'use strict';

// Register `userDetail` component, along with its associated controller and template
angular.
  module('userDetail', ['ngRoute','service.user']).
  component('userDetail', {
    templateUrl: 'user-detail/user-detail.template.html',
    controller: ['$routeParams', 'user',
      function userDetailController($routeParams, user) {
        var self = this;
      self.user = user.query().$promise.then(function(data){
          //实现从返回的数组当中查找一个
        angular.forEach(data,function(item){ 
            if (item.userID == $routeParams.userID) {
                self.user =  item;
            }
        });

        // self.setImage(user.images[0]);

      });

        // self.setImage = function setImage(imageUrl) {
        //   self.mainImageUrl = imageUrl;
        // };
      }
    ]
  });
