define(['app', 'datamaps', '$', '../socket'], function (app, Datamap, $, Socket) {
  'use strict';

  app.directive('twitmap', function(){
    return {
      restrict: 'E',
      scope: true,
      link: function (scope, element, attrs) {
        var mapEl = element[0],
          world_map = null,
          padding = {left:15, right:15, top:0, bottom:0},
          ratio = 2.2,
          targetWidth = 700,
          width = Math.floor(mapEl.clientWidth - (padding.left + padding.right) || targetWidth),
          height = Math.floor(width/ratio),
          svg = null;

          world_map = new Datamap({
          element: mapEl,
          scope: 'world',
            bubbles:[],
            geography_config: {
              highlightOnHover: false,
              popupOnHover: false,
              borderColor: '#222'
             },
          bubble_config: {
              borderWidth: 0,
              borderColor: '#000',
              popupOnHover: true,
              popupTemplate: function(geo, data){
                return '<div class="hoverinfo"><'+data.page_title+'> <span class="lang">('+data.lid+')</span></div>';
              },
              fillOpacity: 0.75,
              animate: true,
              highlightOnHover: true,
              highlightBorderColor: '#667FAF',
              highlightFillColor: '#667FAF',
              highlightBorderWidth: 1,
              highlightFillOpacity: 0.85
          },
          fills: {
              defaultFill: '#eb1767',
              'add': '#306596',
              'subtract': '#cc4731'
          },
          svgOptions:{
            'viewBox': '0 0 '+width+' '+height,
            'preserveAspectRatio': 'xMidYMid',
            'width':width,
            'height':height,
            'style':'background:#DDD; border: 1px solid #000'
          },
          setProjection: function(element, options){
            var projection = d3.geo.equirectangular()
              .scale(100*(width/targetWidth))
              .translate([width / 2, height / 2])
              .precision(.1);

            var path = d3.geo.path()
                .projection(projection);

            return {path:path, projection:projection};
          }
         });

        svg = world_map.svg;

          var addBubbles = function(bubbles) {
            var self = this;
            if (!bubbles.length) {
                bubbles = [];
            }

            var projection = this.projection;
            var options = this.options.bubble_config;

            var bubbleContainer = this.svg.append('g').attr('class', 'bubbles');
            bubbleContainer
                .selectAll('circle.bubble')
                .data(bubbles)
                .enter()
                .append('svg:circle')
                .on('mouseover', function(datum) {
                    var hoverover = $(mapEl).find('.hoverover');
                    var eventData = {
                        data: datum
                    };

                    hoverover.css({position:'absolute'})
                    .html(options.popupTemplate( eventData )).show();

                    hoverover.data('width', $(mapEl).find('.hoverover').width());

                    if (options.highlightOnHover) {
                        d3.select(this)
                        .style('fill', options.highlightFillColor)
                        .style('stroke', options.highlightBorderColor)
                        .style('stroke-width', options.highlightBorderWidth)
                        .style('fill-opacity', options.highlightFillOpacity);
                    }
                    $(mapEl).trigger($.Event("bubble-mouseover"), eventData);
                })
                .on('mousemove', function() {
                    //self.updateHoverOverPosition(this);
                })
                .on('mouseout', function(datum) {
                    $(mapEl).find('.hoverover').hide();
                    var eventData = {
                        data: datum
                    };

                    $(mapEl).trigger($.Event("bubble-mouseout"), eventData);

                    if (options.highlightOnHover) {
                      var el = d3.select(this);
                        el.style('fill', el.attr('data-fill'))
                          .style('stroke', options.borderColor)
                          .style('stroke-width', options.borderWidth)
                          .style('fill-opacity', options.fillOpacity);
                    }
                })
                .on('touchstart', function(datum) {
                    $(mapEl).trigger($.Event("bubble-touchstart"), {data: datum});
                })
                .on('click', function(datum) {
                    $(mapEl).trigger($.Event("bubble-click"), {data: datum});
                })
                .attr('cx', function(datum) {
                    return projection([datum.longitude, datum.latitude])[0];
                })
                .attr('cy', function(datum, index) {
                    return projection([datum.longitude, datum.latitude])[1];
                })
                .style('fill', function(datum) {
                    var fillColor = "#111";
                    d3.select(this).attr('data-fill', fillColor);
                    return fillColor;
                })
                .style('stroke', function(datum) {
                    return options.borderColor; //self.getFillColor(datum);
                })
                .attr('class', 'bubble')
                .style('stroke-width', options.borderWidth)
                .attr('fill-opacity', options.fillOpacity)
                .attr('r', 0)
                .transition()
                .duration(400)
                .attr('r', function(datum) {
                    return datum.radius;
                })
                .each(function(d){
                    var x = projection([d.longitude, d.latitude])[0];
                    var y = projection([d.longitude, d.latitude])[1];
                    var div = $('<div />').css({
                                                position:'absolute',
                                                'top': y + 10,
                                                'left': x + 10
                                                })
                                        .addClass('popup-box')
                                        .animate({opacity: 0}, 4000, null, function() {
                                            this.remove();
                                        });

                    div.html(d.page_title + ' <span class="lang">(' + d.lid + ')</span>');
                    $(mapEl).append(div);
                });
              };

            world_map.addBubbles = addBubbles;
            var socket = new Socket('ws://wikimon.hatnote.com:9000', 'en', world_map)
            socket.connect();

        function resize() {
          var targetWidth = mapEl.clientWidth - (padding.left + padding.right);
          svg.attr("width", targetWidth);
          svg.attr("height", Math.floor(targetWidth / ratio));
          //path.scale(100*(width/targetWidth));
        };
        d3.select(window).on('resize', resize);
        resize()
      }
    };
  });

});
