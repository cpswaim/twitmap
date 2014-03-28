/*jshint unused: vars */
require.config({
  paths: {
    angular: '../../bower_components/angular/angular',
    angularRoute: '../../bower_components/angular-route/angular-route',
    text: '../../bower_components/requirejs-text/text',
    d3: '../../bower_components/d3/d3.min',
    topojson : '//cdnjs.cloudflare.com/ajax/libs/topojson/1.1.0/topojson.min',
    'd3.geo.projection': "http://d3js.org/d3.geo.projection.v0.min",
    datamaps:'lib/datamaps.world',
    '$':'../../bower_components/jQuery/dist/jquery.min'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angularRoute': ['angular'],
    'angularCookies': ['angular'],
    'angularSanitize': ['angular'],
    'angularResource': ['angular'],
    'angularMocks': {
      deps:['angular'],
      'exports':'angular.mock'
    },
    'topojson':{
        deps:['d3']
    },
    'd3.geo.projection':{
        deps:['d3']
    },
    'datamaps' : {'exports' : 'Datamap', deps:['d3', 'topojson']},
    '$':{'exports':'jQuery'}
  },
  priority: [
    'angular'
  ]
});

require([
  'angular',
  'app',
  'd3',
  'angularRoute',
  'map/map'
], function(angular, app, d3) {
  'use strict';

  window.d3 = d3;

  angular.element().ready(function() {
    angular.bootstrap(document, [app.name]);
  });
});