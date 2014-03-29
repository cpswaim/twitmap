/*jshint unused: vars */
define(['angular']/*deps*/, function (angular, MainCtrl)/*invoke*/ {
  'use strict';

  return angular.module('twitmap', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  });
});
