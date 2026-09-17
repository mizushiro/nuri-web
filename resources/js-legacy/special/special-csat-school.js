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
        kmapOptions: { zoom:15 },
        form: {}
    });
    getLocation(function(lat, lon) {
        updateMapCenter(lat,lon);
        if(player.vmap) {
            player.vmap.addLocation([lon, lat]);
        }
    });
    initSchool();
    function initSchool() {
        updateSelectedSchool();
        initSchoolSearch();
        initSchoolList();
        showSchoolLocation(schools);
        addMarkerEvent();
    }
    function updateSelectedSchool(opts) {
    	if(!opts) opts = { preventMapMove: false };
        if(!selectedSchool && searchResult && searchResult.length > 0) {
            selectedSchool = searchResult[0]; 
        }
        if(!selectedSchool) {
            $('.sp-sat-school-name').hide();
            $('#digital-forecast').hide();
           return;
        }
        if(player && player.vmap && !opts.preventMapMove) {
            if(selectedSchool.lat != null && selectedSchool.lat != "null" && parseFloat(selectedSchool.lat) != 0
                    && selectedSchool.lon != null && selectedSchool.lon != "null" && parseFloat(selectedSchool.lon) != 0) {
                player.vmap.setCenter([selectedSchool.lon, selectedSchool.lat]);
                player.vmap.setZoom(16);
            }
        }
        var $schoolInfoWrapper = $('.sp-sat-school-info');
        $schoolInfoWrapper.removeClass('sp-sat-school-info-none')
        $schoolInfoWrapper.find('h3').html(selectedSchool.name);
        $schoolInfoWrapper.find('table > tbody > tr:nth-child(1) td:first-of-type').html(selectedSchool.address);
        $schoolInfoWrapper.find('table > tbody > tr:nth-child(2) td:first-of-type').html(selectedSchool.contact);
        
        if(selectedSchool.dongCode && selectedSchool.dongCode.length == 10) {
            $('.sp-sat-school-name').show();
            $('#schoo-name').html(selectedSchool.name + "-" + selectedSchool.address);
            $('#digital-forecast').show();
            updateDigitalForecast(selectedSchool.dongCode);
        } else {
            $('.sp-sat-school-name').hide();
            $('#schoo-name').html(selectedSchool.name + "-" + selectedSchool.address);
            $('#digital-forecast').hide();
        }
    }
    function initSchoolSearch() {
        var searchTimer = null;
        var $wrapper = $('#school-search');
        $(document).click(function(e) {
            if(!$(e.target).hasClass('cmp-school-search') 
                    && $(e.target).parents('.cmp-school-search').length == 0) {
                hideSearchResult();
            }
        });
        $wrapper.on('click', '.cmp-school-search-input a.sch', function(e) {
            e.preventDefault();
            startSearch();
        });
        $wrapper.on('keyup', '.cmp-school-search-input', function(e) {
            if(e.keyCode == 13){
                startSearch();
            } else {
                startSearch(500);
            }
        });
        $wrapper.on('focus', '.cmp-school-search-input', function(e) {
            if(searchResult && searchResult.length > 0) showSearchResult();
        });
        $wrapper.on('click', '.cmp-school-search-items a', function(e) {
            e.preventDefault();
            var selectedResultId = parseInt($(this).attr('data-id'));
            var selectedItem = _.find(searchResult, function(r) {
                return r.id == selectedResultId;
            });
            if(selectedItem) {
                if(selectedItem.dongCode.length != 10 
                    || selectedItem.dongCode.lat == null || selectedItem.dongCode.lat == "null"
                    || selectedItem.dongCode.lon == null || selectedItem.dongCode.lon == "null" ) {
                }
                selectedSchool = selectedItem;
                updateSelectedSchool();
                hideSearchResult();
            }
        });
        $wrapper.on('click', '.cmp-school-search-items-close', function(e) {
            e.preventDefault();
            hideSearchResult();
        });
        createSearchResult();
        updateSelectedSchool();
        
        function hideSearchResult() {
            var $resultWrapper = $wrapper.find('.cmp-school-search-items').first();
            $resultWrapper.removeClass('on').removeClass('opened');
            $wrapper.find('.cmp-school-search-items-wrapper').hide();
            //$wrapper.find('input[type="text"]').first().val('');
        }
        function showSearchResult() {
            $wrapper.find('.cmp-school-search-items-wrapper').show();
            var $resultWrapper = $wrapper.find('.cmp-school-search-items').first();
            $resultWrapper.addClass('on').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                if($(this).hasClass('on')) $(this).addClass('opened'); 
            })
        }
        function startSearch(delay) {
            if(!delay) delay = 0;
            if(searchTimer) window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(function() {
                var keyword = $wrapper.find('input[type="text"]').first().val();
                if(keyword) {
                    searchResult = _.filter(schools, function(s) {
                        return s.name.indexOf(keyword) > -1;
                    });
                    createSearchResult();
                }
            }, delay);
        }
        function createSearchResult() {
            var $resultWrapper = $wrapper.find('.cmp-school-search-items').first();
            var $result = $resultWrapper.find('>ul').first();
            if($result.length == 0) {
                $result = $('<ul>').appendTo($resultWrapper);
            }
            var template = '{{#result}}';
            template += '<li><a href="#" data-id="{{id}}"><span>{{name}}</span><em>{{address}}</em></a></li>';
            template += '{{/result}}';
            var html = Mustache.render(template, { result: searchResult });
            $result.find('>li').remove();
            $result.html(html);
            if(searchResult && searchResult.length > 0) {
                $wrapper.find('.cmp-school-search-items-wrapper').show();
                $resultWrapper.addClass('on').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                    if($(this).hasClass('on')) $(this).addClass('opened'); 
                });
            } else {
                $resultWrapper.removeClass('on').removeClass('opened');
                $wrapper.find('.cmp-school-search-items-wrapper').hide();
            }
            //showSchoolLocation(searchResult);
        }
        
    }
    function initSchoolList() {
        var $wrapper = $('#school-list');
        createSatSchoolList();
        /* 시도별 목록 */
        function createSatSchoolList() {
            // 시도별로 그룹핑
            var schoolGroups = {};
            for(var i in schools) {
                var s = schools[i];
                if(!schoolGroups[s.sido]) {
                    schoolGroups[s.sido] = [];
                }
                schoolGroups[s.sido].push(s);
            }
            var groups = _.map(_.keys(schoolGroups).sort(), function(k,i) { return {index: i, name: k, selected: (selectedSchool ? ( selectedSchool.sido == k): (i == 0)) }; });
            createGroups();
            var selectedGroup = _.find(groups, function(g) { return g.selected; }); 
            createSchools(selectedGroup.index);
            function createGroups() {
                var $groupWrapper = $wrapper.find('.sp-sat-school-group div[data-group="sido"] ul').first();
                var template = '{{#groups}}<li><a href="#" data-group="{{name}}" data-group-index="{{index}}" {{#selected}}class="on"{{/selected}}><span>{{name}}</span></a></li>{{/groups}}';
                var html = Mustache.render(template, { groups: groups});
                $groupWrapper.html(html);
            }
            function updateGroups() {
                var $groupWrapper = $wrapper.find('.sp-sat-school-group div[data-group="sido"] ul').first();
                $.each($groupWrapper, function() {
                    if(parseInt($(this).attr('data-group-index')) == selectedGroup.index) {
                        if(!$(this).hasClass('on')) $(this).addClass('on');
                    } else {
                        if($(this).hasClass('on')) $(this).removeClass('on');
                    }
                });
            }
            function createSchools(selectedGroupIndex) {
                var selectedSchools = schoolGroups[groups[selectedGroupIndex].name];
                selectedSchools = _.sortBy(selectedSchools, "name");
                if(selectedSchool) {
                    for(var i in selectedSchools) {
	                    var ss = selectedSchools[i];
	                    ss.selected = ss.name == selectedSchool.name;
	                }
                } else {
                    if(selectedSchools && selectedSchools.length > 0) {
                        for(var i in selectedSchools) {
	                        var ss = selectedSchools[i];
	                        ss.selected = i == 0;
	                    }
                    }
                }
                var $schoolItemsWrapper = $wrapper.find('.sp-sat-school-group div[data-group="school"] ul').first();
                var template = '{{#items}}<li><a href="#" data-id="{{id}}" {{#selected}}class="on"{{/selected}}><span>{{name}}</span></a></li>{{/items}}';
                var html = Mustache.render(template, { items: selectedSchools});
                $schoolItemsWrapper.html(html);
            }
            function updateSchools() {
                if(!selectedSchool) return;
                var $schoolItemsWrapper = $wrapper.find('.sp-sat-school-group div[data-group="school"] ul').first();
                $.each($schoolItemsWrapper.find('a'), function(i,ele) {
                    if($(this).attr('data-id') == selectedSchool.id) {
                        if(!$(this).hasClass('on')) $(this).addClass('on');
                    } else {
                        if($(this).hasClass('on')) $(this).removeClass('on');
                    }
                });
            }
            function closeBox() {
                createDimm().fadeOut(200, function() {
                    $(this).remove();
                });
                $wrapper.find('.sp-sat-school-group').fadeOut(200, function() { $(this).css({display:"none"}); });
            }
            
            function createEvents() {
                $wrapper.find('> h2 > a').on('click', function(e) {
                    createDimm().fadeIn(200).on('click', function(e) { closeBox(); });
                    var $box = $wrapper.find('.sp-sat-school-group').first();
                    $box.css({display:"flex"});
                    var $schoolItemsWrapper = $wrapper.find('.sp-sat-school-group div[data-group="school"] ul').first();
                    var $aon = $schoolItemsWrapper.find('a.on');
                    if($aon.length > 0 && $schoolItemsWrapper.scrollTop() == 0) {
                        var top = $schoolItemsWrapper.find('a.on').position().top;
                        $schoolItemsWrapper.animate({ scrollTop: top}, 500);	
                    }
                });
                $wrapper.find('.sp-sat-school-group div[data-group="sido"] a').on('click', function(e) {
                    e.preventDefault();
                    var selectedGroupIndex = parseInt($(this).attr('data-group-index'));
                    for(var i in groups) {
                        groups[i].selected = selectedGroupIndex == i;
                    }
                    
                    $.each($wrapper.find('.sp-sat-school-group div[data-group="sido"] a'), function() {
                        var i = parseInt($(this).attr('data-group-index'));
                        if(i == selectedGroupIndex) {
                            if(!$(this).hasClass('on')) { $(this).addClass('on'); }
                        } else {
                            if($(this).hasClass('on')) { $(this).removeClass('on'); }
                        }
                    });
                    
                    window.setTimeout(function() { createSchools(selectedGroupIndex);} , 10);
                });
                $wrapper.find('.sp-sat-school-group div[data-group="school"]').on('click','a', function(e) {
                    e.preventDefault();
                    var schoolId = $(this).attr('data-id');
                    var selectedItem = _.find(schools, function(s) { return s.id == schoolId; });
                    if(selectedItem) {
                        selectedSchool = selectedItem;
                        $.each($wrapper.find('.sp-sat-school-group div[data-group="school"] a'), function() {
                            var id = $(this).attr('data-id');
                            if(id == selectedSchool.id) {
                                if(!$(this).hasClass('on')) { $(this).addClass('on'); }
                            } else {
                                if($(this).hasClass('on')) { $(this).removeClass('on'); }
                            }
                        });
                        updateSelectedSchool();
                    } else {
                        alert("시험장를 선택할 수 없습니다.");
                    }
                    closeBox();
                });
            }
            createEvents();
        }
    }
    
    function showSchoolLocation(list) {
        if(player && player.vmap && list) {
            player.vmap.removeSpecialPoint();
            for(var i = 0 ; i < list.length ; i++) {
                player.vmap.addSpecialPoint([list[i].lon, list[i].lat], appPrefix + "resources/image/special/ic_marker_school.png", 0.7, {data: list[i], title: list[i].name });
            }
        }
    }
    function addMarkerEvent() {
    	if(player && player.vmap) {
    		player.vmap.callbackSpecialPoint(function(e, data) {
    			selectedSchool = data;
                updateSelectedSchool({ preventMapMove: true });
    		});
        }
    }
    function showSelectSchoolLocation() {
        if(player.vmap && selectedSchool) {
            player.vmap.removeSpecialPoint();
            player.vmap.addSpecialPoint([selectedSchool.lon, selectedSchool.lat], appPrefix + "resources/image/special/ic_marker_school.png", 0.7, {data: selectedSchool, title: selectedSchool.name });
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
        	    	if(selectedSchool && selectedSchool.dongCode && selectedSchool.dongCode.length == 10) {
	    	            updateDigitalForecast(selectedSchool.dongCode, parseInt(data.intervalHours));
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
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').removeClass('on').attr('title','');
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').eq(1).addClass('on').attr('title','선택됨');
    	} else {
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').removeClass('on').attr('title','');
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').eq(0).addClass('on').attr('title','선택됨');
    	}
    	
    }
})(jQuery, window, document);

