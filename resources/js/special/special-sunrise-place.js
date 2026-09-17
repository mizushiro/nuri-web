'use strict';
(function($, window, document){
    var wsUnit = "m/s",
        appPrefix = (window.appBase ? window.appBase : '/'),
        player
        ;
        
    if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
        wsUnit = appConfig.config.unit.ws;
    }
    player = new ImagePlayer("image-player-wrapper",null, {
        type: "kmap",
        showOptionControl: true,
        showOption: false,
        timeTerm: parseFloat("5"),
        interval: parseFloat("0.5"),
        autoStart: false, 
        zoomLevel: "0",
        zoomX: "0000000",
        zoomY: "0000000",
        zoomEnabled: false,
        singleLineLimit: 0,
        isForecast: true,
        leafletEnabled: false,
        kmapEnabled: true,
        kmapLayers: [ { name:"sfc", options:{ } } ],
        kmapOptions: { zoom:13 },
        form: {}
    });
    getLocation(function(lat, lon) {
        updateMapCenter(lat,lon);
        if(player.vmap) {
            player.vmap.addLocation([lon, lat]);
        }
    });
    
    var sunriseZones = [];
    var sunsetZones = [];
    var $wrapper = $('#sunriset-list');
    var zones = [ sunriseZones, sunsetZones];
    var zoneGroups = [{},{}];
    var groups = [];
    var selectedGroup = [];
    var selectedTabIndex = 0;
    initZone();
    function initZone() {
        for(var i in sunrisetZones) {
            var zone = sunrisetZones[i];
            if(zone.type == 0) {
                sunriseZones.push(zone);
            } else {
                sunsetZones.push(zone);
            }
        }
        updateSelectedZone();
        initZoneList();
        //showZoneLocation(sunrisetZones);
        createMapEvents();
    }
    function createMapEvents() {
        $('.sp-map-toggle a ').on('click', function(e) {
            e.preventDefault();
            if(!$(this).hasClass('on')) {
	            $(this).parent().find('a').removeClass('on');
	            $(this).addClass('on');
	            
	            if(!player || !player.vmap) return;
	            var element = $(this).attr('data-element');
	            if(element == "sunrise") {
	                player.vmap.removeObs("sfc");
	                showZoneLocation(sunriseZones);
	            } else if(element == "sunset") {
	                player.vmap.removeObs("sfc");
	                showZoneLocation(sunsetZones, true);
	            } else {
	                player.vmap.removeSpecialPoint();
	                player.kmapLayerUpdate([ { name:"sfc", options:{ } } ]);
	            }
            }
        });
    }
    function updateSelectedZone() {
        if(!selectedZone && sunrisetZones.length > 0) {
            selectedZone = sunrisetZones[0]; 
        }
        if(!selectedZone) {
            $('.sp-sunriset-zone-info').hide();
            $('.sp-sunriset-zone-name').hide();
            $('#digital-forecast').hide();
            return;
        }
        if(player && player.vmap) {
            if(selectedZone.lat != null && selectedZone.lat != "null" && parseFloat(selectedZone.lat) != 0
                    && selectedZone.lon != null && selectedZone.lon != "null" && parseFloat(selectedZone.lon) != 0) {
                player.vmap.setCenter([selectedZone.lon, selectedZone.lat])
            }
        }
        var $zoneInfoWrapper = $('.sp-sunriset-zone-info');
        $zoneInfoWrapper.removeClass('sp-sp-sunriset-zone-info-none')
        $zoneInfoWrapper.find('h3').html('<span>' + selectedZone.name + '</span><address>' + selectedZone.sido + ' ' + selectedZone.gugun + ' ' +  selectedZone.dong + '</address>');
        $.each($zoneInfoWrapper.find('td[data-item="sunrise"]'), function(idx, ele) {
            if(selectedZone.sunrise && selectedZone.sunrise.length > idx) {
                $(this).html(selectedZone.sunrise[idx]);
            }
        });
        $.each($zoneInfoWrapper.find('td[data-item="sunset"]'), function(idx, ele) {
            if(selectedZone.sunset && selectedZone.sunset.length > idx) {
                $(this).html(selectedZone.sunset[idx]);
            }
        });
        if(selectedZone.dongCode && selectedZone.dongCode.length == 10) {
            $('.sp-sunriset-zone-name').show();
            $('#zone-address').html(selectedZone.sido + ' ' + selectedZone.gugun + ' ' +  selectedZone.dong);
            $('#digital-forecast').show();
            updateDigitalForecast(selectedZone.dongCode);
        } else {
            $('.sp-sunriset-zone-name').hide();
            $('#zone-address').html(selectedZone.sido + ' ' + selectedZone.gugun + ' ' +  selectedZone.dong);
            $('#digital-forecast').hide();
        }
    }
    /* 시도별 목록 */
    function createZoneList() {
        _.each(zones, function(list, idx) {
            for(var i in list) {
                var z = list[i];
                if(!zoneGroups[idx][z.sido]) {
                    zoneGroups[idx][z.sido] = [];
                }
                zoneGroups[idx][z.sido].push(z);
            }
        });
        _.each(zones, function(list, idx) {
            groups[idx] = _.map(_.keys(zoneGroups[idx]).sort(), function(k,i) { return {index: i, name: k, selected: (selectedZone ? ( selectedZone.sido == k): i == 0) }; });
            createGroups(idx);
            selectedGroup[idx] = _.find(groups[idx], function(g) { return g.selected; }); 
            createZones(idx, selectedGroup[idx].index);
            createEvents(idx);
        });
    }
    
    function createGroups(index) {
        var $groupWrapper = $wrapper.find(' > .sp-sunriset-zone-group').eq(index).find('div[data-group="sido"] ul').first();
        var template = '{{#groups}}<li><a href="#" data-group="{{name}}" data-group-index="{{index}}" {{#selected}}class="on"{{/selected}}><span>{{name}}</span></a></li>{{/groups}}';
        var html = Mustache.render(template, { groups: groups[index]});
        $groupWrapper.html(html);
    }
    function updateGroups(index) {
        var $groupWrapper = $wrapper.find(' > .sp-sunriset-zone-group').eq(index).find('div[data-group="sido"] ul').first();
        $.each($groupWrapper, function() {
            if(parseInt($(this).attr('data-group-index')) == selectedGroup[index].index) {
                if(!$(this).hasClass('on')) $(this).addClass('on');
            } else {
                if($(this).hasClass('on')) $(this).removeClass('on');
            }
        });
    }
    function createZones(index, selectedGroupIndex) {
        var selectedZones = zoneGroups[index][groups[index][selectedGroupIndex].name];
        selectedZones = _.sortBy(selectedZones, "name");
        if(selectedZone) {
            if(selectedZones && selectedZones.length > 0) {
                for(var i in selectedZones) {
                    var sz = selectedZones[i];
                    sz.selected = sz.name == selectedZone.name;
                }
            }
        } else {
            if(selectedZones && selectedZones.length > 0) {
                for(var i in selectedZones) {
                    var sz = selectedZones[i];
                    sz.selected = i == 0;
                }
            }
        }
        var $zoneItemsWrapper = $wrapper.find('.sp-sunriset-zone-group').eq(index).find('div[data-group="zone"] ul').first();
        var template = '{{#items}}<li><a href="#" data-id="{{id}}" {{#selected}}class="on"{{/selected}}><span>{{name}}</span></a></li>{{/items}}';
        var html = Mustache.render(template, { items: selectedZones});
        $zoneItemsWrapper.html(html);
    }
    function updateZones(index) {
        if(!selectedZone) return;
        var $zoneItemsWrapper = $wrapper.find('.sp-sunriset-zone-group').eq(index).find('div[data-group="zone"] ul').first();
        $.each($zoneItemsWrapper.find('a'), function(i,ele) {
            if($(this).attr('data-id') == selectedZone.id) {
                if(!$(this).hasClass('on')) $(this).addClass('on');
            } else {
                if($(this).hasClass('on')) $(this).removeClass('on');
            }
        });
    }
    function closeBox(index) {
        createDimm().fadeOut(200, function() {
            $(this).remove();
        });
        $wrapper.find('.sp-sunriset-zone-group').eq(index).find('>.sp-sunriset-zone-group-cont').first().fadeOut(200, function() { $(this).css({display:"none"}); });
    }
    
    function createEvents(index) {
        $wrapper.find('.sp-sunriset-zone-group-cont-close').on('click', function(e) {
            e.preventDefault();
            closeBox(index); 
        });
        $wrapper.find('.sp-sunriset-zone-group').eq(index).find('> h2 > a').on('click', function(e) {
            e.preventDefault();
            createDimm().fadeIn(200).on('click', function(e) { closeBox(index); });
            var $box = $wrapper.find('.sp-sunriset-zone-group').eq(index).find('>.sp-sunriset-zone-group-cont').first();
            $box.css({display:"flex"});
            var $zoneItemsWrapper = $wrapper.find('.sp-sunriset-zone-group').eq(index).find('div[data-group="zone"] ul').first();
            var $aon = $zoneItemsWrapper.find('a.on');
            if($aon.length > 0 && $zoneItemsWrapper.scrollTop() == 0) {
                var top = $zoneItemsWrapper.find('a.on').position().top;
                $zoneItemsWrapper.animate({ scrollTop: top}, 500);
            }
        });
        $wrapper.find('.sp-sunriset-zone-group').eq(index).find('div[data-group="sido"] a').on('click', function(e) {
            e.preventDefault();
            var selectedGroupIndex = parseInt($(this).attr('data-group-index'));
            for(var i in groups[index]) {
                groups[index][i].selected = selectedGroupIndex == i;
            }
            
            $.each($wrapper.find('.sp-sunriset-zone-group').eq(index).find('div[data-group="sido"] a'), function() {
                var i = parseInt($(this).attr('data-group-index'));
                if(i == selectedGroupIndex) {
                    if(!$(this).hasClass('on')) { $(this).addClass('on'); }
                } else {
                    if($(this).hasClass('on')) { $(this).removeClass('on'); }
                }
            });
            
            window.setTimeout(function() { createZones(index, selectedGroupIndex);} , 10);
        });
        $wrapper.find('.sp-sunriset-zone-group').eq(index).find('div[data-group="zone"]').on('click','a', function(e) {
            e.preventDefault();
            var zoneId = $(this).attr('data-id');
            var selectedItem = _.find(zones[index], function(z) { return z.id == zoneId; });
            if(selectedItem) {
                selectedZone = selectedItem;
                $.each($wrapper.find('.sp-sunriset-zone-group').eq(index).find('div[data-group="zone"] a'), function() {
                    var id = $(this).attr('data-id');
                    if(id == selectedZone.id) {
                        if(!$(this).hasClass('on')) { $(this).addClass('on'); }
                    } else {
                        if($(this).hasClass('on')) { $(this).removeClass('on'); }
                    }
                });
                updateSelectedZone(index);
            } else {
                alert("명소를 선택할 수 없습니다.");
            }
            closeBox(index);
        });
    }
    
    function initZoneList() {
        createZoneList();
    }
    
    function showZoneLocation(list, sunset) {
        if(player && player.vmap && list) {
            player.vmap.removeSpecialPoint();
            for(var i = 0 ; i < list.length ; i++) {
                if(sunset) {
                    player.vmap.addSpecialPoint([list[i].lon, list[i].lat], appPrefix + "resources/image/special/ic_marker_sunset.png", 0.6, {data: list[i], title: list[i].name});
                } else {
                    player.vmap.addSpecialPoint([list[i].lon, list[i].lat], appPrefix + "resources/image/special/ic_marker_sunrise.png", 0.6, {data: list[i], title: list[i].name});
                }
            }
            player.vmap.callbackSpecialPoint(function(e, data) {
            	if(!data) return;
            	selectedZone = data;
            	updateSelectedZone();
            	$wrapper.find('.sp-sunriset-zone-group').eq(data.type).find('a[data-group="' + data.sido + '"]').first().trigger('click');
    		});
        }
    }
    function showSelectedZoneLocation() {
        if(player.vmap && selectedZone) {
            player.vmap.removeSpecialPoint();
            player.vmap.addSpecialPoint([selectedZone.lon, selectedZone.lat], appPrefix + "resources/image/special/ic_marker_school.png", 0.6);
        }
    }
    
    function updateMapCenter(lat, lon) {
        if(player.vmap) {
            player.vmap.setCenter([lon, lat]);
            //player.vmap.addLocation([lon, lat]);
        }
    }
    function requestDigitalForecast(code, wsUnit, interval) {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/main/digital-forecast.do",
            data: {code: code, unit: wsUnit, hr1: interval == 1 ? 'Y' : 'N'},
            dataType: "html"
        });
    }
    function updateDigitalForecast(dongCode, interval) {
        showLoading('digital-forecast', true);
        requestDigitalForecast(dongCode, wsUnit, interval).then(
            function(html) {
                showLoading('digital-forecast', false);
                var isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
                var isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
                var $dfWrapper = $('#digital-forecast');
                $dfWrapper.html(html);
                if(isModeChart) {
                    $dfWrapper.find('> .cmp-dfs-slider').addClass('mode-chart');
                    $.each($dfWrapper.find('.view-options a'), function(i,ele) {
                        var $opt = $(this);
                        if($opt.attr('data-value') == 'mode-chart') {
                            if(!$opt.hasClass('on')) $opt.addClass('on');
                        } else {
                            $opt.removeClass('on');
                        }
                    });     
                    $('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
                    $('.cmp-dfs-slider a.sym-btn[data-view="mode-chart"]').addClass('on');
                } else if(isModeTable) {
                    $dfWrapper.find('> .cmp-dfs-slider').addClass('mode-table');
                    $.each($dfWrapper.find('.view-options a'), function(i,ele) {
                        var $opt = $(this);
                        if($opt.attr('data-value') == 'mode-table') {
                            if(!$opt.hasClass('on')) $opt.addClass('on');
                        } else {
                            $opt.removeClass('on');
                        }
                    });
                    $('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
                    $('.cmp-dfs-slider a.sym-btn[data-view="mode-table"]').addClass('on');
                }
                $dfWrapper.find('a.tab-btn[data-interval-hours]').on('click', function(e) {
        	    	e.preventDefault();
        	    	var data = $(this).data();
        	    	$(this).parent().find('a.tab-btn').each(function(ele) {
        	    		$(ele).removeClass('on');
        	    	});
        	    	$(this).addClass('on');
        	    	if(selectedZone) {
        	    		if(selectedZone && selectedZone.dongCode && selectedZone.dongCode.length == 10) {
            	            updateDigitalForecast(selectedZone.dongCode, parseInt(data.intervalHours));
            	        }        	    		
        	    	}
        	    	
        	    });
        		updateTimelineOptionStatus(interval);
        		
                window.setTimeout(function () {
                    createDfsSlider();
                }, 0);
            },
            function(err) {
                console.log(err);
                showLoading('digital-forecast', false);
            }
        );  
    }
    
    function updateTimelineOptionStatus(timelineMode) {
    	if(timelineMode == 1) {
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').removeClass('on');
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').eq(1).addClass('on');
    	} else {
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').removeClass('on');
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').eq(0).addClass('on');
    	}
    	
    }
})(jQuery, window, document);

