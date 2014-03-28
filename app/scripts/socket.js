
define(['./reconnecting-websocket.min'], function(){

    var socket = function(ws_url, lid, world_map) {
        this.connect = function() {
            var loading = true;
            // Terminate previous connection, if any
            if (this.connection)
              this.connection.close();

            if ('WebSocket' in window) {
                var connection = new ReconnectingWebSocket(ws_url);
                this.connection = connection;
                connection.onopen = function() {
                    window.console && console.log('Connection open to ' + lid);
                    //$('#' + lid + '-status').html('(connected)');
                };

                connection.onclose = function() {
                    window.console && console.log('Connection closed to ' + lid);
                    //$('#' + lid + '-status').html('(closed)');
                };

                connection.onerror = function(error) {
                    //$('#' + lid + '-status').html('Error');
                    window.console && console.log('Connection Error to ' + lid + ': ' + error);
                };

                connection.onmessage = function(resp) {
                    var data;
                    if (loading) {
                        //$('#loading').remove();
                    }
                    try {
                        data = JSON.parse(resp.data);
                    } catch (e) {
                        window.console && console.log(resp);
                        return;
                    }
                    var fill_key;
                    if (data.is_anon && data.ns === 'Main') {
                        if (data.change_size > 0) {
                            fill_key = 'add';
                        } else {
                            fill_key = 'subtract';
                        }
                        req_url = 'http://freegeoip.net/json/' + data.user;
                        if (data.geo_ip) {
                            fgi_resp = data.geo_ip;
                            world_map.options.bubbles = world_map.options.bubbles.slice(-20);
                            loc_str = fgi_resp.country_name;
                            if (fgi_resp.region_name) {
                                loc_str = fgi_resp.region_name + ', ' + loc_str;
                            }
                            if (fgi_resp.city) {
                                loc_str = fgi_resp.city + ' (' + loc_str + ')';
                            }
                            // log_rc_str = 'Someone in <span class="loc">' + loc_str + '</span> edited "<a href="' + data.url + '" target="_blank">' + data.page_title + '</a>" <span class="lang">(' + lid + ')</span>';
                            // log_rc(log_rc_str, RC_LOG_SIZE);
                            //console.log('An editor in ' + loc_str + ' edited "' + data.page_title + '"')
                            $('.bubbles')
                                .animate({opacity: 0,
                                    radius: 10},
                                    40000,
                                    null,
                                    function(){
                                        this.remove();
                                    });
                            world_map
                                .addBubbles([{radius: 4,
                                    latitude: fgi_resp.latitude,
                                    longitude: fgi_resp.longitude,
                                    page_title: data.page_title,
                                    fillKey: fill_key,
                                    lid: lid
                                }]);
                            // country_hl = highlight_country(fgi_resp.country_name);

                            // if (!country_hl[0][0]) {
                            //     country_hl = highlight_country(country_name_map[fgi_resp.country_name]);
                            //     if (!country_hl[0][0] && window.console) {
                            //         console.log('Could not highlight country: ' + fgi_resp.country_name);
                            //     }
                            // }
                        } else {
                            window.console && console.log('no geodata available for', data['url']);
                        }
                    }
                };
            }
        };
        this.close = function() {
            if (this.connection) {
                this.connection.close();
            }
        };
    };

    return socket;
})