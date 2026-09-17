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
        kmapLayers: [ ],
        kmapOptions: { zoom:12 },
        form: {}
    });
    getLocation(function(lat, lon) {
        updateMapCenter(lat,lon);
        if(player.vmap) {
            player.vmap.addLocation([lon, lat]);
        }
    });
    initPlace();
    function initPlace() {
    	for(var i = 0 ; i < moonEventPlaces.length ; i++) {
    		var place = moonEventPlaces[i];
    		try { place.sido = place.address.split(/ /)[0]; }
    		catch(e) { console.log(e); place.sido = null; }
    	}
        updateSelectedPlace();
        initPlaceList();
        showPlaceLocation(moonEventPlaces);
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
	            if(element == "moon-event-place") {
	                player.vmap.removeObs("sfc");
	                showPlaceLocation(moonEventPlaces);
	            } else {
	                player.vmap.removeSpecialPoint();
	                player.kmapLayerUpdate([ { name:"sfc", options:{ } } ]);
	            }
            }
        });
    }
    function updateSelectedPlace() {
        if(!selectedPlace && moonEventPlaces.length > 0) {
            selectedPlace = moonEventPlaces[0]; 
        }
        
        if(player && player.vmap) {
            if(selectedPlace.latitude != null && selectedPlace.latitude != "null" && parseFloat(selectedPlace.latitude) != 0
                    && selectedPlace.longitude != null && selectedPlace.longitude != "null" && parseFloat(selectedPlace.longitude) != 0) {
                player.vmap.setCenter([selectedPlace.longitude, selectedPlace.latitude])
            }
        }
    }
    
    function initPlaceList() {
        var $wrapper = $('#moon-event-place-list');
        createPlaceList();
        /* 시도별 목록 */
        function createPlaceList() {
            var places = [ moonEventPlaces];
            var placeGroups = [{}];
            var groups = [];
            var selectedGroup = [];
            _.each(places, function(list, idx) {
	            for(var i in list) {
	                var z = list[i];
	                if(!placeGroups[idx][z.sido]) {
	                    placeGroups[idx][z.sido] = [];
	                }
	                placeGroups[idx][z.sido].push(z);
	            }
	        });
            _.each(places, function(list, idx) {
                groups[idx] = _.map(_.keys(placeGroups[idx]).sort(), function(k,i) { return {index: i, name: k, selected: (selectedPlace ? ( selectedPlace.sido == k): i == 0) }; });
                createGroups(idx);
                selectedGroup[idx] = _.find(groups[idx], function(g) { return g.selected; }); 
                createPlaces(idx, selectedGroup[idx].index);
                createEvents(idx);
            });
            function createGroups(index) {
                var $groupWrapper = $wrapper.find('> .sp-moon-event-place-group').eq(index).find('div[data-group="sido"] ul').first();
                var template = '{{#groups}}<li><a href="#" data-group="{{name}}" data-group-index="{{index}}" {{#selected}}class="on"{{/selected}}><span>{{name}}</span></a></li>{{/groups}}';
                var html = Mustache.render(template, { groups: groups[index]});
                $groupWrapper.html(html);
            }
            function updateGroups(index) {
                var $groupWrapper = $wrapper.find(' > .sp-moon-event-place-group').eq(index).find('div[data-group="sido"] ul').first();
                $.each($groupWrapper, function() {
                    if(parseInt($(this).attr('data-group-index')) == selectedGroup[index].index) {
                        if(!$(this).hasClass('on')) $(this).addClass('on');
                    } else {
                        if($(this).hasClass('on')) $(this).removeClass('on');
                    }
                });
            }
            function createPlaces(index, selectedGroupIndex) {
                var selectedPlaces = placeGroups[index][groups[index][selectedGroupIndex].name];
                selectedPlaces = _.sortBy(selectedPlaces, "regName");
                if(selectedPlace) {
                    if(selectedPlaces && selectedPlaces.length > 0) {
	                    for(var i in selectedPlaces) {
	                        var sz = selectedPlaces[i];
	                        sz.selected = sz.name == selectedPlace.regName;
	                    }
	                }
                } else {
                    if(selectedPlaces && selectedPlaces.length > 0) {
                        for(var i in selectedPlaces) {
                            var sz = selectedPlaces[i];
                            sz.selected = i == 0;
                        }
                    }
                }
                var $placeItemsWrapper = $wrapper.find('.sp-moon-event-place-group').eq(index).find('div[data-group="place"] ul').first();
                var template = '{{#items}}<li><a href="#" data-id="{{regId}}" data-url="{{url}}" {{#selected}}class="on"{{/selected}} target="_blank" title="새창열림"><span>{{regName}}</span></a></li>{{/items}}';
                var html = Mustache.render(template, { items: selectedPlaces});
                $placeItemsWrapper.html(html);
            }
            function updatePlaces(index) {
                if(!selectedPlace) return;
                var $placeItemsWrapper = $wrapper.find('.sp-moon-event-place-group').eq(index).find('div[data-group="place"] ul').first();
                $.each($placeItemsWrapper.find('a'), function(i,ele) {
                    if($(this).attr('data-id') == selectedPlace.id) {
                        if(!$(this).hasClass('on')) $(this).addClass('on');
                    } else {
                        if($(this).hasClass('on')) $(this).removeClass('on');
                    }
                });
            }
            
            function createEvents(index) {
                $wrapper.find('.sp-moon-event-place-group').eq(index).find('> h2 > a').on('click', function(e) {
                    e.preventDefault();
                    createDimm().fadeIn(200).on('click', function(e) { closeBox(index); });
                    var $box = $wrapper.find('.sp-moon-event-place-group').eq(index).find('>.sp-moon-event-place-group-cont').first();
                    $box.css({display:"flex"});
                    var $placeItemsWrapper = $wrapper.find('.sp-moon-event-place-group').eq(index).find('div[data-group="place"] ul').first();
                    var $aon = $placeItemsWrapper.find('a.on');
                    if($aon.length > 0 && $placeItemsWrapper.scrollTop() == 0) {
                        var top = $placeItemsWrapper.find('a.on').position().top;
                        $placeItemsWrapper.animate({ scrollTop: top}, 500);
                    }
                });
                $wrapper.find('.sp-moon-event-place-group').eq(index).find('div[data-group="sido"] a').on('click', function(e) {
                    e.preventDefault();
                    var selectedGroupIndex = parseInt($(this).attr('data-group-index'));
                    for(var i in groups[index]) {
                        groups[index][i].selected = selectedGroupIndex == i;
                    }
                    
                    $.each($wrapper.find('.sp-moon-event-place-group').eq(index).find('div[data-group="sido"] a'), function() {
                        var i = parseInt($(this).attr('data-group-index'));
                        if(i == selectedGroupIndex) {
                            if(!$(this).hasClass('on')) { $(this).addClass('on'); }
                        } else {
                            if($(this).hasClass('on')) { $(this).removeClass('on'); }
                        }
                    });
                    
                    window.setTimeout(function() { createPlaces(index, selectedGroupIndex);} , 10);
                });
                $wrapper.find('.sp-moon-event-place-group').eq(index).find('div[data-group="place"]').on('click','a', function(e) {
                    e.preventDefault();
                    var placeId = $(this).attr('data-id');
                    var url = $(this).attr('data-url');
                    var selectedItem = _.find(places[index], function(z) { return z.regId == placeId; });
                    if(selectedItem) {
                        selectedPlace = selectedItem;
                        $.each($wrapper.find('.sp-moon-event-place-group').eq(index).find('div[data-group="place"] a'), function() {
                            var id = $(this).attr('data-id');
                            if(id == selectedPlace.id) {
                                if(!$(this).hasClass('on')) { $(this).addClass('on'); }
                            } else {
                                if($(this).hasClass('on')) { $(this).removeClass('on'); }
                            }
                        });
                        updateSelectedPlace(index);
                    }
                    var w = window.open(url, "MOON_FCT",'width=870, height=900, scrollbars=auto');
            		if(w) w.focus();
                });
            }
        }
    }
    
    function showPlaceLocation(list) {
        if(player && player.vmap && list) {
            player.vmap.removeSpecialPoint();
            for(var i = 0 ; i < list.length ; i++) {
            	player.vmap.addSpecialPoint([list[i].longitude, list[i].latitude], appPrefix + "resources/image/special/ic_marker_sunrise.png", 0.6, { data: list[i], title: list[i].regName });
            }
            
            player.vmap.callbackSpecialPoint(function(e, data) {
            	if(data && data.url) {
            		var w = window.open(data.url, "MOON_FCT",'width=870, height=900, scrollbars=auto');
            		if(w) w.focus();
            	}
            });
        }
    }
    
    function updateMapCenter(lat, lon) {
        if(player.vmap) {
            player.vmap.setCenter([lon, lat]);
            //player.vmap.addLocation([lon, lat]);
        }
    }
})(jQuery, window, document);

