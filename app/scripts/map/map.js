define(['app'], function (app) {
  'use strict';

  app.controller('mapCtrl', function ($scope) {
    $scope.title = "twitmap";  
  });

  app.directive('twitmap', function(){
    return {
      restrict: 'E',
      scope: true,
      template: '{{title}}',
      controller: 'mapCtrl'
    };
  })
});
