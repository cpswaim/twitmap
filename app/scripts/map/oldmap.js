
        var mapEl = element[0],
          padding = {left:15, right:15, top:0, bottom:0},
          ratio = 2.2,
          targetWidth = 700,
          width = mapEl.clientWidth - 30 || targetWidth,
          height = width/ratio;

        var projection = d3.geo.equirectangular()
            .scale(100*(width/targetWidth))
            .translate([width / 2, height / 2])
            .precision(.1);

        var path = d3.geo.path()
            .projection(projection);

        var graticule = d3.geo.graticule();

        var svg = d3.select(mapEl).append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', '0 0 '+width+' '+height)
            .attr('preserveAspectRatio', 'xMidYMid');

        svg.append('path')
            .datum(graticule)
            .attr('class', 'graticule')
            .attr('d', path);

        d3.json('../data/world-50m.json', function(error, world) {
          svg.insert('path', '.graticule')
              .datum(topojson.feature(world, world.objects.land))
              .attr('class', 'land')
              .attr('fill', '#eb1767')
              .attr('d', path);

          svg.insert('path', '.graticule')
              .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
              .attr('class', 'boundary')
              .attr('fill', '#eb1767')
              .attr('stroke', '#ddd')
              .attr('d', path);
        });

        function resize() {
          var targetWidth = mapEl.clientWidth;
          svg.attr("width", targetWidth);
          svg.attr("height", targetWidth / aspect);
          path.scale(100*(width/targetWidth));
        };
        d3.select(window).on('resize', resize);