/**
 * 특별기상지원 - 야외 근로자 맞춤형 날씨정보
 *
 * 날씨누리 홈페이지 (url: /)
 */
'use strict';
(function($, window, document){
    var    version = "1.0",
        bookmarkDropdown = null,
        bookmarkSelectedLat = 37.493546, 
        bookmarkSelectedLon = 126.921654,
        bookmarkSelectedDong = "서울특별시 동작구 신대방제2동",
        bookmarkSelectedDongCode = "1159068000",
        wsUnit = "m/s",
        appPrefix = (window.appBase ? window.appBase : '/'),
        indexLocalSearchbox = null,
        popLocalSearchbox = null,
        myPointSlider = null,
        vmap = null,
        kmapOverlay = null,
        hashParam = null,
        $contentBody = $('#content-body'),
        ptrEnabled = true,
        typhoonInfo = null,
        mainConfig = typeof MainConfig != "undefined" ? MainConfig : {};

    var dfsSlider = null;
    if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
        wsUnit = appConfig.config.unit.ws;
    }
    /*
        해시 파라미터 읽기.
        형식 : #tab=vmap/subtab=1/lat=36.7/lon=126.2/zoom=7
    */
    if(window.location.hash) {
        try {
            var route = window.location.hash.substr(1);
            var routes = route.split('/');
            hashParam = {};
            for(var i in routes) {
                var kv = routes[i].split('=');
                if(kv[1]) hashParam[kv[0]] = kv[1];
            }
        }catch(e) {
            if(window.console) console.log(e);
            hashParam = null;
        }
    }
    /* 화면 모드 셋팅 */
    var displayMode = (appConfig && appConfig.config && appConfig.config.displayMode) ? appConfig.config.displayMode : DISPLAY_MODE_DEFAULT;
    if(displayMode != DISPLAY_MODE_MAP) {
        displayMode = DISPLAY_MODE_DEFAULT;
    }
    
    var tabMode = (appConfig && appConfig.config && appConfig.config.tabMode) ? appConfig.config.tabMode : TAB_MODE_WEATHER;
    if(tabMode != TAB_MODE_WHOLE) {
    	tabMode = TAB_MODE_WEATHER;
    }

    var wthema = (appConfig && appConfig.config && appConfig.config.wthema) ? appConfig.config.wthema : '';

    /* 마크업 조정 */
    prepareMarkup();
    if(displayMode == DISPLAY_MODE_MAP) {
        $('body').addClass("mode-map")
        initMapMode();
    } else {
        initDefaultMode();
    }
    
    function prepareMarkup() {
        if(displayMode == DISPLAY_MODE_MAP) {
            // 맵 모드일 경우 전국, 영상 탭 등 삭제
            $('.cont-wrap').find('[data-active-mode="default"]').remove();
        } else {
            var mobile = isMobileEnv();
            var windowWidth = $(window).width();
            if(windowWidth < 1100) {
                $('.cont-wrap').find('[data-active-env="desktop"]').empty();
                $('.cont-wrap').find('[data-active-env="mobile"]').html($('#kmap-holder').html());    
            } else {
                $('.cont-wrap').find('[data-active-env="mobile"]').empty();
                $('.cont-wrap').find('[data-active-env="desktop"]').html($('#kmap-holder').html());
            }
            // 기본 모드일 경우 맵 모드용 북마크 삭제
            $('.cont-wrap').find('[data-active-mode="map"]').remove();
        }
        $contentBody.removeClass('cmp-main-tabs-prepare').addClass('cmp-main-tabs-ready');
        if(wthema) $('body').addClass(wthema);
    }
    function initDefaultMode() {
        createMainTab();
        createMyPointSlider();
        createLocalWeather();
        createIconInfo();
        //createRadarSat();
        createSearchBox();
        createMapInterface();
        createCurrentWarning();
        createBookmarks();
        createCurrentWeather();
        createTyphoonInfo();
        createEqkWarning();
        createDefaultModeEvent();
        createGlobalEvent();
        $('.cmp-major-ext-link').show();
        if(tabMode == TAB_MODE_WHOLE) {
        	$('.cmp-main-tabs .tab-item').removeClass('on');
        	$('.cmp-main-tabs .tab-item').eq(1).addClass('on');
        }
    }
    function initMapMode() {
        createMainTab();
        createMyPointSlider();
        createSearchBox();
        createMapFrame();
        createCurrentWarning();
        createBookmarks();
        createEqkWarning();
        createMapModeEvent();
        createGlobalEvent();
        $('.cmp-major-ext-link').hide();
        $('.sns-list').hide();
    }
    
    function createTyphoonInfo() {
		if(!window.typhoonEnabled) return;
  		var $tabs = $('.cmp-main-tabs');
  		var $newTab = $('<div class="tab-item">');
  		$newTab.append('<h2 class="tab-head typh"><a href="#">태풍</a></h2>')
  			.append('<div class="tab-content" id="index-typhoon-info"></div>')
  			.appendTo($tabs);
  		typhoonInfo = new TyphoonInfo("index-typhoon-info");
  		typhoonInfo.updateData();
  	}
    function createIconInfo() {
        $('#open_icon_info').on('click', function(e) {
            e.preventDefault();
            ptrEnabled = false;
            var src = this.href;
            $('<div>').html('<button class="btn-fullimage-close" title="강수 아이콘 구분 안내 닫기"></button>').css({
                background: 'rgba(0,0,0,.7) url('+src+') no-repeat center',
                backgroundSize: 'contain',
                width:'100%', height:'100%',
                position:'fixed',
                zIndex:'10000',
                top:'0', left:'0',
                cursor: 'zoom-out',
            }).click(function(){
                $(this).remove();
                ptrEnabled = true;
            }).appendTo('body');
        });
    }
    function createPTR(){
        var ptr = PullToRefresh.init({
            mainElement: '.cont-wrap',
            triggerElement: '.container',
            distThreshold: 80,
            distMax: 100,
            distReload: 70,
            distIgnore: 20,
            instructionsPullToRefresh: '당겨서 날씨를 새로고칩니다.',
            instructionsReleaseToRefresh: '놓으면 새로고칩니다.',
            instructionsRefreshing: '새로고칩니다.',
            refreshTimeout: 300,
            shouldPullToRefresh: function() {
                return !this.triggerElement.scrollTop // !window.scrollY 
                        && ptrEnabled 
                        && !$('#today-warning').hasClass('on')
                        && $('.cmp-main-tabs .tab-item').eq(0).hasClass('on');
            },
            onRefresh: function() {
                window.setTimeout(function() {
                    if(bookmarkDropdown) {
                        var bookmark = bookmarkDropdown.config.selectedBookmark;
                        if(bookmark) {
                            updateCurrentWeather(bookmark);
                            updateDigitalForecast(bookmark);
							updateImpactForecast(bookmark);
                        }
                    }
                },10);
            }
        });
    }
    
    function createMainTab() {
        $('.cmp-main-tabs').on('click', '.tab-item .tab-head a', function(e) {
            var isNoTabContent = $(this).hasClass('no-tab-content');
            if(!isNoTabContent) {
                e.preventDefault();
                $(this).parents('.cmp-main-tabs').find('.tab-item').removeClass('on');
                $(this).parents('.tab-item').addClass('on');
                window.setTimeout(function() {
                	if(dfsSlider) dfsSlider.refresh();
                },10);
            } else {
                $(this).blur();
            }
            
            if($(this).parent().hasClass('home')) {
                $('.sns-list').slick('setPosition'); 
            }
        });
    }
    function createMyPointSlider() {
        myPointSlider = new MyPointSlider('my-point-slider');
    }
    function createRadarSat() {
        $('.cmp-common-tabs a[data-role="radar-image"]').on('click', function(e) {
            e.preventDefault();
            var index = $(this).parent().index();
            $('#radar-image .image-item').removeClass('on').eq(index).addClass('on');
        });
        
        requestCurrentImages().then(function(data) {
            //console.log('requestCurrentImages', data);
            if(data.length == 2) {
                if(data[0].url) $('<img>').attr('src', appPrefix + data[0].url).attr('alt', data[0].alt).appendTo($('#radar-image .image-item').eq(0));
                if(data[1].url) $('<img>').attr('src', appPrefix + data[1].url).attr('alt', data[1].alt).appendTo($('#radar-image .image-item').eq(1));
            }
        }, function(err){
            console.log(err);
        });
        
    }
    function createLocalWeather() {
        requestLocalWeather('current', '0', wsUnit).then(
            function(html) {
                $('#local-weather').html(html);
            },
            function(err) {
                console.log(err);
            }
        );
        requestWeatherCmt().then(
            function(html) {
                $('#weather-cmt').html(html);
            },
            function(err){
                console.log(err);
            }
        );
        addEvents();
        function addEvents() {
            $('.cmp-common-tabs a[data-role="local-weather"]').on('click', function(e) {
                e.preventDefault();
                var type = $(this).attr('data-type');
                requestLocalWeather(type, '0', wsUnit).then(
                    function(html) {
                        $('#local-weather').html(html);
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            });
            $('#local-weather').on('click', '>.cmp-local-weather > div > h3 > a', function(e) {
                e.preventDefault();
                var $localWeather = $(this).parents('.cmp-local-weather');
                $localWeather.find('> .map-data-wrap').removeClass('on');
                $localWeather.find('> .map-data-wrap > h3 > a').attr('title','');
                $(this).attr('title','선택됨');
                $(this).parents('.map-data-wrap').addClass('on');
            });
            $('#local-weather').on('click', '[data-dong-code]', function(e) {
				var dongCode = $(this).attr('data-dong-code');
				$.ajax({
	                url: appPrefix + '/rest/zone/dongInfo.do',
	                data: { dong: dongCode },
	                type: 'get',
	                dataType: 'json'
	            }).then(function(result) {
	                var wide = result.wide;
	                var city = result.city;
	                var dong = result.dong;
	                
	                if(!wide) return;
	                var x = wide.x, 
	                    y = wide.y, 
	                    lat = wide.lat, 
	                    lon = wide.lon;
	                if(!city) {
	                    city = { code: dongCode.substring(0,5) + "00000", name:"" };
	                } else {
	                    x = city.x;
	                    y = city.y;
	                    lat = city.lat;
	                    lon = city.lon;
	                }
	                if(!dong) {
	                    dong = { code: city.code, name: "", x: x, y: y, lat: lat, lon: lon };
	                } else {
	                    x = dong.x;
	                    y = dong.y;
	                    lat = dong.lat;
	                    lon = dong.lon;
	                }
	                var fullName = "";
	                if(wide) fullName += wide.name;
	                if(city) fullName += city.name ? (" " + city.name) : "";
	                if(dong) fullName += dong.name ? (" " + dong.name) : ""; 
	                var bookmark = {
	                        wide: wide,
	                        city: city,
	                        dong: dong,
	                        x: x, 
	                        y: y,
	                        lat: lat,
	                        lon: lon,
	                        fullName: fullName
	                    };
	                $('.cmp-main-tabs > .tab-item > .tab-head.home > a').first().trigger('click');
	                GlobalEvent.trigger($.Event("onAreaShow"), [bookmark, this, true]);
	            });
			});
        }
    }
    function createSearchBox() {
        indexLocalSearchbox = new DongSearchbox('index-local-search');
        var $popLocalSearch = $('.modal-layer.pop-local-search');
        $popLocalSearch.find('.modal-layer-close').on('click', function(e) {
            e.preventDefault();
            $popLocalSearch.removeClass('on');
        });
        $('a[data-role="pop-local-search"]').on('click', function(e) {
            e.preventDefault();
            if(!$popLocalSearch.hasClass('on')) $popLocalSearch.addClass('on');
            window.setTimeout( function() {
                $popLocalSearch.find('input').first().trigger('focus');
            },0);
        });
        
        $popLocalSearch.on('click', '.cmp-local-search-input > .pop-open', function(e) {
        	e.preventDefault();
        	$popLocalSearch.removeClass('on');
        });
        popLocalSearchbox = new DongSearchbox('pop-local-search');
    }
    function createCurrentWarning() {
        var todayWarning = new TodayWarning('today-warning');
    }
    function createBookmarks() {
        bookmarkDropdown = displayMode == DISPLAY_MODE_DEFAULT ? new BookmarkDropdown('index-bookmarks') : new BookmarkDropdown('index-map-bookmarks');
    }
    function createCurrentWeather() {
        // get code from bookmark
        readBookmarkSelectedInfo();
    }
    function createPopMyPointsEvent() {
        $('.cmp-pop-my-points .sym-close').click(function(e) {
            e.preventDefault();
            var $comp = $(this).parents('.cmp-pop-my-points');
            $comp.css({ marginTop: -$comp.height() + 'px' })
                .bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ $(this).addClass('closed'); });
        });
    }
    function createEqkWarning() {
        var eqkWarning = new EqkWarning('eqk-warning');
    }
    function createMapModeEvent() {
        $contentBody.on('click', 'a[target="_blank"]', function(e) {
            e.preventDefault();
            openExternalPop(this.href);
        });
        $('#show-search-box-btn').on('click', function(e) {
            e.preventDefault();
            var $schWrap = $contentBody.find('.point-sch-wrap').first();
            if(!$contentBody.find('.tab-item').eq(0).hasClass('on')) {
                $contentBody.find('.tab-item').eq(0).find('> .tab-head > a').trigger('click');
                if(!$schWrap.hasClass('point-sch-wrap-enable')) {
                    $schWrap.addClass('point-sch-wrap-enable');
                }
            } else {
                if($schWrap.hasClass('point-sch-wrap-enable')) {
                    $schWrap.removeClass('point-sch-wrap-enable');
                } else {
                    $schWrap.addClass('point-sch-wrap-enable');
                }
            }
        });
    }
    function moveMapInterface(to) {
        if(to == "mobile") {
            $('.cont-wrap').find('[data-active-env="desktop"]').empty();
            $('.cont-wrap').find('[data-active-env="mobile"]').html($('#kmap-holder').html());
            createMapInterface();
        } else if(to == "desktop"){
            $('.cont-wrap').find('[data-active-env="mobile"]').empty();
            $('.cont-wrap').find('[data-active-env="desktop"]').html($('#kmap-holder').html());
            createMapInterface();
        }
    }
    function openWgis() {
        readBookmarkSelectedInfo();
        var location = bookmarkSelectedLon + "," + bookmarkSelectedLat;
        var wgisBase = window.wgisBaseUrl ? window.wgisBaseUrl : 'https://www.weather.go.kr/wgis-nuri';
        if(wgisBase.substring(0,1) == "/") wgisBase = "https://www.weather.go.kr/wgis-nuri";
        var newSrc = wgisBase + '/html/map.html?location=' + location;
        openExternalPop(newSrc);
    }
    function createDefaultModeEvent() {
        var prevWindowWidth = $(window).width();
        $(window).resize(function(e) {
            // 사이즈 체크 하여 1100 을 지날때 페이지 리로드.
            var currentWindowWidth = $(window).width();
            if(currentWindowWidth <= 1100 && prevWindowWidth > 1100) {
                prevWindowWidth = currentWindowWidth;
                moveMapInterface('mobile');
            } else if(currentWindowWidth > 1100 && prevWindowWidth <= 1100) {
                prevWindowWidth = currentWindowWidth;
                moveMapInterface('desktop');
            }
        });
        $('.open-wgis').on('click', function(e) {
            e.preventDefault();
            openWgis();
            
        });
        $contentBody.on('click', 'a[target="_blank"]', function(e) {
            e.preventDefault();
            openExternalPop(this.href);
        });
        /*$contentBody.on('click', '.cmp-cur-weather-air a[data-air-type]', function(e) {
            e.preventDefault();
            var airType = $(this).attr('data-air-type');
            $('.cmp-air-legend .shadow-box').each(function(idx,ele) {
                var $box = $(ele);
                if(airType == $box.attr('data-air-type')) {
                    if(!$box.hasClass('on')) {
                        $box.addClass('on');
                    }
                } else {
                    $box.removeClass('on');
                }
            });
        });*/
        /*$contentBody.on('click', '.cmp-air-legend .close-box', function(e) {
            e.preventDefault();
            $('.cmp-air-legend .shadow-box').removeClass('on');
        });*/
        $contentBody.on('click','.cmp-cmn-para.odam-updated .updated-at', function(e) {
            e.preventDefault();
            if(bookmarkDropdown) {
                var bookmark = bookmarkDropdown.config.selectedBookmark;
                if(bookmark) {
                    updateCurrentWeather(bookmark);
                    updateDigitalForecast(bookmark);
					updateImpactForecast(bookmark);
                }
            }
        });
        $('.iconguide-wrap').on('click', 'a[target="_blank"]', function(e) {
            e.preventDefault();
            openExternalPop(this.href);
        });

        $contentBody.on('click','a[data-map-mode-action="close"]', function(e) {
            e.preventDefault();
            var shouldOpen = $(this).hasClass('on');
            if(shouldOpen) {
                $(this).removeClass('on').find('span').text('날씨지도 닫기');
                $(this).parent().next().slideDown();
            } else {
                $(this).addClass('on').find('span').text('날씨지도 펼치기');
                $(this).parent().next().slideUp();
            }
        });
        $contentBody.on('click','a.pop10-toggle-btn', function(e) {
            e.preventDefault();
            var $vf = $contentBody.find('.vshort-forecast');
            if(bookmarkDropdown) {
                var bookmark = bookmarkDropdown.config.selectedBookmark;
                if(bookmark && bookmark.dong && bookmark.dong.code) {
                    var dongCode = bookmark.dong.code;  
                    if(!$vf.hasClass('on')) {
                        $vf.addClass('on');
                    }
                    updateVshortForecast(bookmark);
                }
            };
        });
        $contentBody.on('click','a.cmp-vshort-forecast-close', function(e) {
            e.preventDefault();
            var $vf = $contentBody.find('.vshort-forecast');
            $vf.removeClass('on');
        });
    }
    function updateCurrentWeather(bookmark) {
        showLoading('current-weather', true);
        requestCurrentWeather(bookmark.dong.code, wsUnit).then(
            function(html) {
                showLoading('current-weather', false);
                $('#current-weather').html(html);
            },
            function(err) {
                showLoading('current-weather', false);
                console.log(err);
            }
        );
        /*showLoading('current-aws', true);
        requestCurrentAws(bookmark.dong.code, wsUnit).then(
            function(html) {
                showLoading('current-aws', false);
                $('#current-aws').html(html);
            },
            function(err) {
                showLoading('current-aws', false);
                console.log(err);
            }
        );*/
    }
    function updateDigitalForecast(bookmark) {
        showLoading('digital-forecast', true);
        requestDigitalForecast(bookmark.dong.code, wsUnit).then(
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

	function updateImpactForecast(bookmark) {  
        showLoading('ifs-holder', true);
        requestIfs(bookmark.dong.code, wsUnit).then(
            function(html) {            	
                $('#ifs-holder').html(html);
                $('.more').css('display','none');
            },
            function(err) {
                console.log(err);
                showLoading('ifs-holder', false);
            }
        );
    }

    function updateVshortForecast(bookmark) {
        showLoading('vshort-forecast', true, 'light under-pos');
        $.ajax({
            url: appPrefix + 'wnuri-fct2021/main/vshort-forecast.do',
            data: { code: bookmark.dong.code, unit: wsUnit, hr1: 'Y' },
            type: 'get',
            dataType: 'html'
        }).then(
            function(html) {
                $('#vshort-forecast').html(html);
                buildRain10Chart(bookmark);
            },
            function(err) {
                console.log(err);
                showLoading('vshort-forecast', false);
            }
        );
    }
    function buildRain10Chart(bookmark) {
        function buildChart(data) {
            var vshortDates = [];
            var $vf = $('#vshort-forecast');
            $.each($vf.find('.vsitem'), function(i, ele) {
                var date = $(this).attr('data-date');
                var time = $(this).attr('data-time');
                if(!date) return;
                vshortDates.push(moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').add(-1,'hour'));
            });
            var rangeStart = vshortDates[0].clone();
            rangeStart.set('minute', 0);
            rangeStart.set('second', 0);
            var rangeEnd = vshortDates[vshortDates.length - 1].clone();
            rangeEnd.add(1, 'hour');
            rangeEnd.set('minute', 0);
            rangeEnd.set('second', 0);
            console.log(rangeStart.format('YYYY-MM-DD HH:mm:ss'));
            console.log(rangeEnd.format('YYYY-MM-DD HH:mm:ss'));
            var hourlyMax = {};
            var values = _.filter(data, function(d) {
               var dt = moment(d[0], 'YYYY[.]MM[.]DD[.]HH[:]mm');
               return dt.isAfter(rangeStart, 'minute') && ( dt.isBefore(rangeEnd, 'minute') || dt.isSame(rangeEnd, 'minute'));
            });
            values = _.map(values, function(v) {
               var dt = moment(v[0], 'YYYY[.]MM[.]DD[.]HH[:]mm');
               dt.clone().add(-1,'minute');
               return { dt:dt.clone().add(-1,'minute').format('YYYY[-]MM[-]DD HH[:00:00]'), x:dt.toDate(), y:v[2] }
            });
            var yMax = 0.0;
            _.forEach(values, function(v,i) {
               var max = hourlyMax[v.dt];
               if(!max) {
                   max = { v: 0, i: i };
                   hourlyMax[v.dt] = max;
               }
               if(max.v < v.y) {
                   max = { v: v.y, i: i};
                   hourlyMax[v.dt] = max;
               }
            });
            _.forEach(values, function(v, i) {
               var max = hourlyMax[v.dt];
               if(max && max.i == i) {
                   v.max = true;
               }
            });
             
            var hourlySum = {};
            _.forEach(values, function(d) {
               var y = hourlySum[d.dt];
               if(!y) y = 0;
               y += d.y;
               hourlySum[d.dt] = y;
            });
            
            var hourlyValues = _.map(_.keys(hourlySum).sort(), function(k, i) {
                var v = hourlySum[k];
                if(v > yMax) yMax = v;
                return { x: moment(k).toDate(), dt: k,  y: v }; 
            });
            // build
            var rain10Series = [{
                    data: hourlyValues, 
                    name:'한시간 강수',
                    type: 'column',
                    showInLegend: false,
                    animation: false,
                    marker : { enabled: false},
                    yAxis: 0,
                    xAxis: 0,
                    groupPadding: 0,
                    pointPadding: 0,
                    tooltip: { enabled: true }
                },
                {
                    data: values, 
                    name:'10분 강수',
                    type: 'areaspline',
                    showInLegend: false,
                    animation: false,
                    marker : { enabled: true, radius:2 },
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get('rgba')]
                        ]
                    },
                    yAxis: 0,
                    xAxis: 1,
                }
            ];
            var yTicks = new Array();
            if (yMax <= 4) {
                yTicks = [0, 2.5, 5];
            } else if (yMax <= 8) {
                yTicks = [0, 5, 10];
            } else if (yMax <= 16) {
                yTicks = [0, 10, 20];
            } else if (yMax <= 24) {
                yTicks = [0, 15, 30];
            } else if (yMax <= 40) {
                yTicks = [0, 25, 50];
            } else if (yMax <= 80) {
                yTicks = [0, 50, 100];
            } else if (yMax <= 160) {
                yTicks = [0, 100, 200];
            } else if (yMax <= 240) {
                yTicks = [0, 150, 300];
            } else {
                yTicks = [0, 250, 500];
            }
            var minPadding1 = 0; 
            var maxPadding1 = 0;
            var minPadding2 = 1.0 / (rain10Series[1].data.length * 2.0); 
            var maxPadding2 = minPadding2;
            console.log(rain10Series);
            var rain10Chart = creteRain10Chart(rain10Series, { 
                chart: { 
                    margin: [10, 0, 5, 43]
                },
                xAxis: [
                    { lineColor: '#39B1E8', lineWidth: 1, padding:10, tickColor: "rgba(0,0,0,0)", labels: { enabled: false }, title: { enabled: false }, minPadding: minPadding1, maxPadding: maxPadding1, margin: 0}, 
                    { lineColor: '#39B1E8', lineWidth: 1, padding:10, tickColor: "rgba(0,0,0,0)", labels: { enabled: false }, title: { enabled: false }, minPadding: minPadding2, maxPadding: maxPadding2, margin: 0},
                ],
                yAxis: [
                    { offset:0, max: yTicks[2], min:yTicks[0], tickPosition: yTicks, tickInterval: yTicks[1] - yTicks[0], tickWidth: 1, lineWidth: 1, labels:{ enabled: true }, title: { enabled: false }  }
                ]
            });
            
            function creteRain10Chart(series, options) {
                var id = 'my-rain10chart';
                var $rain10ChartWrap = $vf.find('.rain10-chart').first();
                $('<div>').attr('id', id).css({ width: '100%', height: '84px'}).appendTo($rain10ChartWrap.empty());
                
                var minPadding = 1.0 / (series[0].data.length * 2.0); 
                var maxPadding = minPadding;
                var minValue = 999;
                var maxValue = -999;
                for(var j = 0 ; j < series.length ; j++) {
                    var valList = series[j].data;
                    for(var i = 0 ; i < valList.length ; i++) {
                        var val = valList[i];
                        if(typeof val.y != 'undefined') {
                            if(val.y > maxValue) maxValue = val.y;
                            if(val.y < minValue) minValue = val.y;
                        } else {
                            if(val > maxValue) maxValue = val;
                            if(val < minValue) minValue = val;
                        }    
                    }
                }
                var lineColor = "#009AE0", fontColor = "#000000";
                var chartOptions = {
                    plotOptions: {
                        series: { 
                            pointStart: 1, 
                            fillColor:'#009AE1', 
                        },
                        column: {
                            color: 'rgba(0,0,0,0)',
                            enableMouseTracking: false
                        },
                        areaspline: {
                            color: lineColor,
                            dataLabels: {
                                enabled: true, 
                                style: { fontSize: '13px', fontWeight: 'normal', color: fontColor, textOutline: false },
                                formatter: function () {
                                   if(this.point.max) {
                                       return this.y > 0 ? this.y + '' : '';
                                   } else{
                                       return '';
                                   }
                                },
                                crop: false,
                                overflow: 'none',
                                y: 0
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: series,
                    chart: { backgroundColor: "rgba(0,0,0,0)", style: { fontFamily: "'ns', sans-serif" } },
                    title: { text: null },
                    credits: { enabled:false},
                };
                if(options) _.merge(chartOptions, options);
                var chart = Highcharts.chart(id, chartOptions);
                return chart;
            }
        }
        var tm = moment().utc().add(-20, 'minute').format("YYYYMMDDHHmm");
        var data = {
            tm: tm,
            lat: "",
            lon: "",
            x: bookmark.dong.x,
            y: bookmark.dong.y,
            disp: "V",
            type: "BLND"
        };
        var url = "https://vapi.kma.go.kr/capi/url/vs_prcp_blnd_pt_txt1.php";
        showLoading('vshort-forecast', true, 'light under-pos');
        $.ajax({
            url: url,
            data: data,
            dataType: "json"
        }).then(function(result) {
            showLoading('vshort-forecast', false);
            if(result.resultCode == "0") {
                buildChart(result.data.resultList);
            } else {
                alert("초단기 10분강수 조회 중 오류가 발생하였습니다.");
            }
        }, function(err) {
            console.log(err);
            showLoading('vshort-forecast', false);
            alert("초단기 10분강수 조회 중 오류가 발생하였습니다.");
        });
    }
    /* 날씨지도 iframe */
    function createMapFrame() {
        $('.cmp-major-ext-link').hide();
        var fullHeight = $(document).height();
        var minMapHeight = isMobileEnv() ? 500 : 1000;
        var menuHeight = isMobileEnv() ? 160 : 65;
        var footerHeight = isMobileEnv() ? 0 : 140;
        if(fullHeight < minMapHeight) fullHeight = minMapHeight;
        fullHeight -= footerHeight;
        $('.mode-map .cont-wrap').css('min-height', fullHeight + 'px');
        $('.mode-map .cmp-wgis-fullmap').css('min-height', fullHeight + 'px');
        $('.mode-map .cmp-wgis-fullmap iframe').css('min-height', (fullHeight - menuHeight) + 'px');
        window.setTimeout(function(){
            updateMapFrame();
        },20);
    }
    function updateMapFrame() {
        readBookmarkSelectedInfo();
        var location = bookmarkSelectedLon + "," + bookmarkSelectedLat;
        var wgisBase = window.wgisBaseUrl ? window.wgisBaseUrl : 'https://www.weather.go.kr/wgis-nuri';
        if(wgisBase.substring(0,1) == "/") wgisBase = "https://www.weather.go.kr/wgis-nuri";
        var newSrc = wgisBase + '/html/map.html?location=' + location + '&mode=m';
        var currentSrc = $('.mode-map .cmp-wgis-fullmap iframe').attr('src');
        if(currentSrc != newSrc) {
            $('.mode-map .cmp-wgis-fullmap iframe').attr('src',newSrc);
        }
    }
    /*
        GIS 연동 인터페이스 생성 
    */
    function createMapInterface() {
        try{
            createLegend("map");
            KMAP_createMap("map", {
                whitemap: false,
                zoom: isMobileEnv() ? 9 : 9,
                minZoom: 5,
                wsUnit: wsUnit,
                fullScreen: false,
                scaleLine: true,
                onLoad: function(map) {
                    vmap = map;
                    kmapOverlay = new KmapOvr(vmap, "ko");
                    vmap.setCenter([bookmarkSelectedLon, bookmarkSelectedLat]);
                    vmap.addLocation([bookmarkSelectedLon, bookmarkSelectedLat]);
                }
            });    
        }catch(e) {
            console.log(e);
        }
        var layerToggles = {
            "toggle-radar-fct": toggleRaderLayer,
            "toggle-wrn": toggleWrnLayer,
            "toggle-sfc": toggleAllSfcLayer,
            "toggle-yesterday-temp": toggleYesterdayTempLayer,
            "toggle-yesterday-rain": toggleYesterdayRainLayer,
            "toggle-current-obs-wtemp": toggleCurrentObsWtempLayer,
            "toggle-current-obs-rain": toggleCurrentObsRainLayer,
            "toggle-current-obs-wind": toggleCurrentObsWindLayer,
            "toggle-current-now-wtemp": toggleCurrentNowWtempLayer,
            "toggle-current-now-windrain": toggleCurrentNowWindrainLayer,
            "toggle-daily-forecast": toggleDailyForecastLayer
        };
        function onKmapOverlayClick(e, dt) {
            if(!dt || !dt.dongCode) return;
            $.ajax({
                url: appPrefix + '/rest/zone/dongInfo.do',
                data: { dong: dt.dongCode },
                type: 'get',
                dataType: 'json'
            }).then(function(result) {
                var dongCode = dt.dongCode;
                var wide = result.wide;
                var city = result.city;
                var dong = result.dong;
                
                if(!wide) return;
                var x = wide.x, 
                    y = wide.y, 
                    lat = wide.lat, 
                    lon = wide.lon;
                if(!city) {
                    city = { code: dongCode.substring(0,5) + "00000", name:"" };
                } else {
                    x = city.x;
                    y = city.y;
                    lat = city.lat;
                    lon = city.lon;
                }
                if(!dong) {
                    dong = { code: city.code, name: "", x: x, y: y, lat: lat, lon: lon };
                } else {
                    x = dong.x;
                    y = dong.y;
                    lat = dong.lat;
                    lon = dong.lon;
                }
                var fullName = "";
                if(wide) fullName += wide.name;
                if(city) fullName += city.name ? (" " + city.name) : "";
                if(dong) fullName += dong.name ? (" " + dong.name) : ""; 
                var bookmark = {
                        wide: wide,
                        city: city,
                        dong: dong,
                        x: x, 
                        y: y,
                        lat: lat,
                        lon: lon,
                        fullName: fullName
                    };
                GlobalEvent.trigger($.Event("onAreaShow"), [bookmark, this, true]);
            });
        }
        function toggleRaderLayer(show) {
            if(!vmap) return;
            if(!show) {
                KMAP_removeLayer(vmap, [ { name: "vshrt_rain", options:{ timelineEnabled: true} } ]);
            } else {
                KMAP_addLayer(vmap, [ { name: "vshrt_rain" , options:{ timelineEnabled: true} } ]);
                $('.map-layer-iconguide').removeClass('on');
                $('.cmp-vismap').removeClass('show-iconguide');
            }
        }
        function toggleWrnLayer(show) {
            if(!vmap) return;
            if(!show) {
                vmap.setWrn(null);
                KMAP_getLegend(vmap).setLegend("wrn", false);
            } else {
                $.ajax({ url: getWgisBaseUrl() + '/wrn?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setWrn(data);
                    // 범례 생성
                    var l = data.reduce(function(l, v) {
                        if(l.indexOf(v.wrn) < 0) l.push(v.wrn);
                        return l;
                    }, []);
                    KMAP_getLegend(vmap).setLegend("wrn", true, l);
                });
                $('.map-layer-iconguide').removeClass('on');
                $('.cmp-vismap').removeClass('show-iconguide');
            }
        }
        
        function toggleYesterdayTempLayer(show) {
            if(!vmap) return;
            if(!show) {
                
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/yesterday-weather.do', dataType: 'json'}).then(function(result) {
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDD').format('YYYY-MM-DDTHH:mm:ss');
                    var list = _.map(data, function(d) {
                        return { 
                            type: "YES_TA", 
                            tmn: d.taMin ? (d.taMin + '<small>℃</small>') : '',
                            tmx: d.taMax ? (d.taMax + '<small>℃</small>') : '',
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date,
                            dongCode: d.dongCode, 
                        };
                    });
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDD').format('MM[.]DD[.](dd)'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        function toggleYesterdayRainLayer(show) {
            if(!vmap) return;
            if(!show) {
                 
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/yesterday-weather.do', dataType: 'json'}).then(function(result) {
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDD').format('YYYY-MM-DDTHH:mm:ss');
                    var list = _.map(data, function(d) {
                        return { 
                            type: "YES_RN", 
                            rnDay: (d.rnDay?(d.rnDay+'mm'):''), 
                            sdNew:(d.sdNew?(d.sdNew+'cm'):''), 
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date, 
                            dongCode: d.dongCode,
                        };
                    });
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDD').format('MM[.]DD[.](dd)'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        function toggleCurrentObsWtempLayer(show) {
            if(!vmap) return;
            toggleSeaSfcLayer(show);
            if(!show) {
                
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/current-weather-obs.do', dataType: 'json'}).then(function(result) {
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss');
                    var list = _.map(data, function(d) {
                        return { 
                            type: "OBS_TA", 
                            wwIconSrc: appPrefix + ('/resources/icon/NY@64/Light/NB' + d.icon+ '.png'), 
                            ta: d.ta ? (d.ta + "<small>℃</small>") : '', 
                            wwKo: d.wwKo, 
                            wwEn: d.ww, 
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date,
                            dongCode: d.dongCode, 
                        };
                    });
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDDHHmm').format('MM[.]DD[.](dd) HH[:]mm [갱신]'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        function toggleCurrentObsRainLayer(show) {
            if(!vmap) return;
            toggleSeaSfcLayer(show);
            if(!show) {
                
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/current-weather-obs.do', dataType: 'json'}).then(function(result) {
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss');
                    var list = _.map(data, function(d) {
                        return { 
                            type: "OBS_RN", 
                            rnHr1: d.rnHr1 ? (d.rnHr1 + '<small>mm</small') : '', 
                            sdDay: d.sdDay ? (d.sdDay + '<small>cm</small') : '', 
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date,
                            dongCode: d.dongCode,
                         };
                    });
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDDHHmm').format('MM[.]DD[.](dd) HH[:]mm [갱신]'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        function toggleCurrentObsWindLayer(show) {
            if(!vmap) return;
            toggleSeaSfcLayer(show);
            if(!show) {
                
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/current-weather-obs.do', dataType: 'json'}).then(function(result) {
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss');
                    var list = _.map(data, function(d) {
                        var wsText = wsUnit == "m/s" ? d.ws : d.wsKmh;
                        wsText = wsText ? wsText + "<small>" + wsUnit + "</small>" : "";
                        return { 
                            type: "OBS_VC", 
                            wdIconSrc: appPrefix + ('/resources/icon/WD2/' + d.wd+ '.png'), 
                            wd: d.wdKo, 
                            ws: wsText, 
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date,
                            dongCode: d.dongCode, 
                        };
                    });
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDDHHmm').format('MM[.]DD[.](dd) HH[:]mm [갱신]'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        function toggleCurrentNowWtempLayer(show) {
            if(!vmap) return;
            if(!show) {
                
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/current-weather-now.do', dataType: 'json'}).then(function(result) {
                    //console.log(result);
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss');
                    var list = _.map(data, function(d) {
                        return { 
                            type: "NOW_TA", 
                            wwIconSrc: d.wwIcon ? (appPrefix + ('/resources/icon/DY@64/' + ( wthema == 'wthema-a' ? 'A/' : ( wthema == 'wthema-b' ? 'B/' : ''))+ 'Light/' + d.wwIcon + '.png')) : "", 
                            ta: d.temp ? (d.temp + "<small>℃</small>") : '', 
                            wwKo: d.ww, 
                            wwEn: d.wwEn, 
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date,
                            dongCode: d.dongCode,
                        };
                    });
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDDHHmm').format('MM[.]DD[.](dd) [현재]'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        
        function toggleCurrentNowWindrainLayer(show) {
            if(!vmap) return;
            if(!show) {
                
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/current-weather-now.do', dataType: 'json'}).then(function(result) {
                    //console.log(result);
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss');
                    var list = _.map(data, function(d) {
                        var wsText = wsUnit == "m/s" ? d.ws : d.wsKmh;
                        wsText = wsText ? wsText + "<small>" + wsUnit + "</small>" : "";
                        return { 
                            type: "NOW_RN", 
                            rnHr1: (d.rnHr1 == '-' ? '' : (d.rnHr1 + "mm")) , 
                            wdIconSrc: (d.wdEn ? (appPrefix + ('/resources/icon/WD2/' + d.wdEn+ '.png')) : ''), 
                            wd: d.wdEn, 
                            wdKo: d.wdKo, 
                            ws: wsText,
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date,
                            dongCode: d.dongCode,
                         };
                    });
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDDHHmm').format('MM[.]DD[.](dd) [현재]'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        
        function buildDailyForecastTab(result, targetWrapper, numEf) {
            if(!targetWrapper || targetWrapper.length == 0) {
                console.log("no targetWrapper : " + targetWrapper , result);
                return;
            }
            if(!result || !result.data || result.data.length == 0) {
                console.log("no data", result);
                return;
            }
            var tmFc = moment(result.tm, 'YYYYMMDDHHmm');
            if(result.isAmStart) {
                tmFc.set('hour', 1);
            } else {
                tmFc.set('hour', 13);
            }
            
            var template = '{{#tabs}}<a href="#" {{#selected}}class="on"{{/selected}} data-role="toggle-daily-forecast" data-ef="{{numEf}}"><span>{{date}}</span><span>{{ampm}}</span></a>{{/tabs}}';
            var tabs = [];
            _.each(result.data[0].forecast, function(fct,i) {
                tabs.push({ selected: fct.numEf == numEf,  numEf: fct.numEf, date: tmFc.format('D(dd)'), ampm: tmFc.format('A')});
                tmFc.add(12, 'hours');
            });
            var html = Mustache.render(template, {tabs: tabs});
            $(targetWrapper).html(html);
        }
        function toggleDailyForecastLayer(show, numEf, eventSrc) {
            if(!vmap) return;
            if(!show) {
                
            } else {
                $.ajax({ url: appPrefix + '/renew2021/rest/main/daily-forecast.do', dataType: 'json'}).then(function(result) {
                    //console.log(result);
                    if(!result || !result.data) { 
                        console.log("no data");
                        return;
                    }
                    var data = result.data;
                    var date = moment(result.tm,'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss');
                    var targetWrapper = typeof numEf == "undefined" ? $(eventSrc).next() : $(eventSrc).parent();
                    if(!numEf) numEf = 0; 
                    else numEf = parseInt(numEf);
                    buildDailyForecastTab(result, targetWrapper, numEf);
                    var isAmStart = result.isAmStart;
                    numEf = parseInt(numEf);
                    var types = [ "FCT_AM", "FCT_PM"];
                    var list = _.map(data, function(d) {
                        if(!d.forecast || d.forecast.length == 0) {
                            // console.log("no forecast", d); 
                            return {
                                type: (isAmStart ? types[numEf%2] : types[(numEf+1)%2]),
                                stnKo: d.stnKo, 
                                stnEn: d.stnEn, 
                                stnId: d.stnId, 
                                date: date, 
                                dongCode: d.dongCode
                            };
                        }
                        var fct = _.find(d.forecast, function(f) {
                            return parseInt(f.numEf) == numEf; 
                        });
                        if(!fct) {
                            // console.log("Can not find " + numEf + " foreast", d,d.forecast);
                            return {
                                type: (isAmStart ? types[numEf%2] : types[(numEf+1)%2]),
                                stnKo: d.stnKo, 
                                stnEn: d.stnEn, 
                                stnId: d.stnId, 
                                date: date, 
                                dongCode: d.dongCode
                            };
                        }
                        
                        return { 
                            type: (isAmStart ? types[numEf%2] : types[(numEf+1)%2]), 
                            wwIconSrc: fct.wfCode ? (appPrefix + ('/resources/icon/NY@64/Light/' + fct.wfCode + '.png')) : "", 
                            ta: (fct.ta ? (fct.ta + "<small>℃</small>") : ""), 
                            wwKo: fct.wf, 
                            wwEn: fct.wf, 
                            stnKo: d.stnKo, 
                            stnEn: d.stnEn, 
                            stnId: d.stnId, 
                            date: date, 
                            dongCode: d.dongCode,
                         };
                    });
                    
                    $('.map-layer-tm p').html(moment(result.tm,'YYYYMMDDHHmm').format('MM[.]DD[.](dd) HH[:]mm [발표]'));
                    $('.map-layer-tm').addClass('on');
                    $('.map-layer-iconguide').addClass('on');
                    $('.cmp-vismap').addClass('show-iconguide');
                    kmapOverlay.open(list, onKmapOverlayClick);
                });
            }
        }
        
        function toggleSeaSfcLayer(show) {
            if(!vmap) return;
            if(!show) {
                vmap.removeObs('lhaws');
                vmap.removeObs('buoy');
                vmap.removeObs('seaBuoy');
            } else {
                // 등표 
                $.ajax({ url: getWgisBaseUrl() + '/aws/lhaws?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setObs(data, {
                        type: 'lhaws',
                        visible: true, 
                        callback: function(info) {
//                            console.log("click ==> ", info);
                        }
                    });
                });
                // 부이 
                $.ajax({ url: getWgisBaseUrl() + '/aws/buoy?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setObs(data, {
                        type: 'buoy', 
                        visible: true,
                        callback: function(info) {
//                            console.log("click ==> ", info);
                        }
                    });
                });
                // 파고부이 
                $.ajax({ url: getWgisBaseUrl() + '/aws/seaBuoy?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setObs(data, {
                        type: 'seaBuoy',
                        visible: true, 
                        callback: function(info) {
//                            console.log("click ==> ", info);
                        }
                    });
                });
            }
        }
        function toggleAllSfcLayer(show) {
            if(!vmap) return;
            if(!show) {
                // 지상
                vmap.removeObs('sfc');
                //vmap.removeObs('air');
                vmap.removeObs('lhaws');
                vmap.removeObs('buoy');
                vmap.removeObs('seaBuoy');
            } else {
                // 지상
                var awsUrl = [getWgisBaseUrl() + "/aws/sfc?date=", getWgisBaseUrl() + "/aws/aws?date="];
                var result = null;
                var count = 0;
                var visible = true;
                awsUrl.forEach(function(url) {
                    $.ajax({ url: url, dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                        if(result != null) {
                            result = result.concat(data);
                        } else {
                            result = data;
                        }
                        count++;
                        if(count === awsUrl.length) {
                            //if (self.isVisible(type)) {
                                vmap.setObs(result, {
                                    type: 'sfc', 
                                    visible: visible,  
                                    callback: function(info) {
//                                        console.log("click ==> ", info);
                                    }
                                });
                            //}
                        }
                    });
                });
                // 공항
                /*$.ajax({ url: getWgisBaseUrl() + '/aws/air?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setObs(data, {
                        type: 'air', 
                        visible: true,
                        callback: function(info) {
                            console.log("click ==> ", info);
                        }
                    });
                });*/
                // 등표 
                $.ajax({ url: getWgisBaseUrl() + '/aws/lhaws?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setObs(data, {
                        type: 'lhaws',
                        visible: true, 
                        callback: function(info) {
//                            console.log("click ==> ", info);
                        }
                    });
                });
                // 부이 
                $.ajax({ url: getWgisBaseUrl() + '/aws/buoy?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setObs(data, {
                        type: 'buoy', 
                        visible: true,
                        callback: function(info) {
//                            console.log("click ==> ", info);
                        }
                    });
                });
                // 파고부이 
                $.ajax({ url: getWgisBaseUrl() + '/aws/seaBuoy?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
                    vmap.setObs(data, {
                        type: 'seaBuoy',
                        visible: true, 
                        callback: function(info) {
//                            console.log("click ==> ", info);
                        }
                    });
                });
            }
        }
        weatherUI.popOpen('.map-layer-iconguide a');
        $('.map-layer-iconguide').on('click', 'a', function(e) {
            e.preventDefault();
        });
        $('.map-layer-toggles').on('click', 'a', function(e) {
            var role = $(this).attr('data-role');
            e.preventDefault();
            var $parent = $(this).parent();
            if($parent.hasClass('map-layer-toggles-tab')) {
                $parent.parent().find('> a').removeClass('on');
                $parent.parent().find('> div > a').removeClass('on');
                var $next = $(this).next().find('> a');
                if($next.length > 0) {
                    $next.removeClass('on');
                    $next.eq(0).addClass('on');
                    role = $next.eq(0).attr('data-role');
                }
            } else {
                $parent.find('> a').removeClass('on');
                $parent.find('> div > a').removeClass('on');
            }
            var ef = $(this).attr('data-ef');
            $(this).addClass('on');
            if(kmapOverlay) kmapOverlay.close();
            $('.map-layer-tm p').html('');
            $('.map-layer-tm').removeClass('on');
            $('.map-layer-iconguide').removeClass('on');
            //$('.cmp-vismap').removeClass('show-iconguide');
            for(var key in layerToggles) {
                var toggle = layerToggles[key];
                if(key == role) {
                    toggle(true, ef, this);
                } else {
                    toggle(false, ef, this);
                }
            }
        });
        $('.map-layer-buttons').on('click', 'a', function(e) {
            var role = $(this).attr('data-role');
            e.preventDefault();
            if(role == "open-wgis") {
                openWgis();
            }
        });
        
        switch(mainConfig.wgisTabIndex) {
	        case 0:
	        	$('.map-layer-toggles').find('a[data-role="toggle-radar-fct"]').addClass('on');
	        	toggleRaderLayer(true);
	        	break;
	        case 1:
	        	$('.map-layer-toggles').find('a[data-role="toggle-wrn"]').addClass('on');
	        	toggleWrnLayer(true);
	        	break;
	        case 2:
	        	$('.map-layer-toggles').find('a[data-role="toggle-yesterday"]').addClass('on');
	        	$('.map-layer-toggles').find('a[data-role="toggle-yesterday-temp"]').addClass('on');
	        	toggleYesterdayTempLayer(true);
	        	break;
	        case 3:
	        	$('.map-layer-toggles').find('a[data-role="toggle-current-obs"]').addClass('on');
	        	$('.map-layer-toggles').find('a[data-role="toggle-current-obs-wtemp"]').addClass('on');
	        	toggleCurrentObsWtempLayer(true);
	        	break;
	        case 4:
	        	$('.map-layer-toggles').find('a[data-role="toggle-current-now"]').addClass('on');
	        	$('.map-layer-toggles').find('a[data-role="toggle-current-now-wtemp"]').addClass('on');
	        	toggleCurrentNowWtempLayer(true);
	        	break;
	        case 5:
	        	$('.map-layer-toggles').find('a[data-role="toggle-daily-forecast"]').addClass('on');
	        	toggleDailyForecastLayer(true);
	        	break;
	        default:
	        	$('.map-layer-toggles').find('a[data-role="toggle-current-obs"]').addClass('on');
        		$('.map-layer-toggles').find('a[data-role="toggle-current-obs-wtemp"]').addClass('on');
	        	toggleCurrentObsWtempLayer(true);
        		break;
        }
    }
    function updateMapCenter(bookmark) {
        if(displayMode == DISPLAY_MODE_DEFAULT) {
            if(vmap && bookmark && bookmark.dong) {
                vmap.setCenter([bookmark.dong.lon, bookmark.dong.lat]);
                vmap.removeLocation();
                vmap.addLocation([bookmark.dong.lon, bookmark.dong.lat]);
            }
        } else {
            if(bookmark && bookmark.dong) {
                updateMapFrame();
            }
        }
        
    }
    function createDfsSlider() {
        var isHr1Fct = $('.cmp-dfs-slider').first().hasClass('hr1-fct');
        var isMovingToTab = false;
        var obj = '.dfs-tab-body .dfs-slider';
        var $slider = $(obj);
        var $slideWrap = $slider.find('.slide-wrap');
        var scrollWidth = 0;
        var slidePoints = null;
        var tchartWidth = 0;
        var midtchartWidth = 0;
        var midtchartLeft = 0;
        var tchartItemCount = 0;
        var isModeChart = false;
        var isModeTable = false;
        var $slides = $slider.find('.slide');
        var $dailyHeads = $slider.find('.slide:not(.day-ten) .daily-head');
        
        var slideLength = $slides.length;
        var lastTabIndex = 0;
        
        prepareSlider();
        
        dfsSlider = new IScroll('.dfs-tab-body .dfs-slider', { eventPassthrough:true, scrollX: true, scrollY: false, mouseWheel: false, scrollbars: 'custom', resizePolling : 40, probeType : 3, interactiveScrollbars: true});
        
        updateChart();
        
        dfsSlider.on('scroll', function(){
            if(isMovingToTab) return;
            var scrollX = -this.x;
            var selectedTabIndex = 0;
            for(var i = 0 ; i < slidePoints.length ; i++) {
                var p1 = slidePoints[i] - (i > 0 ? (isHr1Fct ? 55 : 30) : 0);
                var p2 = (i+1 >= slidePoints.length) ? 99999999 : (slidePoints[i+1] - (isHr1Fct ? 55 : 30));
                if(p1 <= scrollX && scrollX < p2) {
                    selectedTabIndex = i;
                    break;
                }
            }
            if(isHr1Fct) {
                if(selectedTabIndex < $dailyHeads.length && scrollX >= 0) {
                    var selectedSlideLeft = slidePoints[selectedTabIndex];
                    var slideWidth = slidePoints[selectedTabIndex+1] - selectedSlideLeft;
                    var marginLeft = scrollX - selectedSlideLeft;
                    if(marginLeft < slideWidth - $dailyHeads.eq(selectedTabIndex).width() - 70) {
                        $dailyHeads.eq(selectedTabIndex).css({ 'margin-left': (selectedTabIndex == 0 ? marginLeft : marginLeft+55)+ 'px'});
                    }
                } else if(scrollX < 0) {
                    $dailyHeads.eq(0).css({ 'margin-left': 'auto'});
                }
            }
            if(lastTabIndex != selectedTabIndex) {
                if(isHr1Fct) {
                    if(lastTabIndex < $dailyHeads.length) {
                        $dailyHeads.eq(lastTabIndex).css({ 'margin-left': 'auto'});
                    }
                }
                lastTabIndex = selectedTabIndex;
                selectTab(lastTabIndex);
                if(slidePoints.length - 1 == selectedTabIndex) {
                    if(!$('.cmp-dfs-slider .item-lbl').hasClass('off')) {
                        $('.cmp-dfs-slider .item-lbl').addClass('off');
                    }
                    if(!$('.cmp-dfs-slider .item-lbl-graph').hasClass('off')) {
                        $('.cmp-dfs-slider .item-lbl-graph').addClass('off');
                    }
                    if(!$('.cmp-dfs-slider .item-lbl-midterm').hasClass('on')) {
                        $('.cmp-dfs-slider .item-lbl-midterm').addClass('on');
                    }
                } else {
                    $('.cmp-dfs-slider .item-lbl').removeClass('off');
                    $('.cmp-dfs-slider .item-lbl-graph').removeClass('off'); 
                    $('.cmp-dfs-slider .item-lbl-midterm').removeClass('on');
                }
            }
        });
        /* 
            보기 옵션 열기 
        */
        $('.cmp-dfs-slider a[data-layer]').click(function(e) {
            e.preventDefault();
            var dataLayer = $(this).attr('data-layer');
            var $panel = $('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']');
            if(!$panel.hasClass('on')) $panel.addClass('on')
            $panel.find('.big-close').unbind('click').bind('click', function(e) {
                e.preventDefault();
                $panel.removeClass('on');
            });
        });
        /*
            예보 보기 옵션 레이어 이벤트.
        */
        $('.cmp-dfs-slider').on('click', '.view-options a.sym-btn[data-option]', function(e) {
            e.preventDefault();
            var dataLayer = 'view-options';
            $(this).parent().parent().find('a.sym-btn').removeClass('on');
            $(this).addClass('on');
            var optionType = $(this).attr('data-option');
            var optionValue = $(this).attr('data-value');
            if(optionType == 'series') {
                $('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(optionValue);
                window.setTimeout(function() {
                    prepareSlider();
                    dfsSlider.refresh();
                    updateChart();
                    $('.dfs-tab-head > li > a').first().trigger('click');
                    }, 0);
                $('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
                $('.cmp-dfs-slider a.sym-btn[data-view="' + optionValue + '"]').addClass('on');
            }
            $('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']').removeClass('on');
        });
        $('.cmp-dfs-slider').on('click', 'a.sym-btn[data-view]', function(e) {
            e.preventDefault();
            $(this).parent().find('a.sym-btn[data-view]').removeClass('on');
            $(this).addClass('on');
            
            var mode = $(this).attr('data-view');
            $('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(mode);
            window.setTimeout(function() {
                prepareSlider();
                dfsSlider.refresh();
                updateChart();
                $('.dfs-tab-head > li > a').first().trigger('click');
                }, 0);
            $('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"]').removeClass('on');
            $('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"][data-value="' + mode + '"]').addClass('on');
        });
        /*
            오늘 내일 모레 10일 이후 탭과 스크롤 연동.
        */
        $('.cmp-dfs-slider .dfs-tab .dfs-tab-head').on('click', 'a', function(e) {
            e.preventDefault();
            $(this).parents('.dfs-tab-head').find('a.on').removeClass('on');
            $(this).addClass('on');
            var date = $(this).attr('data-date');
            var $slider = $('.cmp-dfs-slider .dfs-slider').first();
            var scrollLeft = 0;
            $slider.find('.daily').each(function(idx, ele) {
                if(date == $(ele).attr('data-date')) return false;
                scrollLeft +=  Math.ceil($(ele).width());
            });
            var isMidTerm = $(this).parent().index() == $(this).parent().parent().find('li').last().index(); 
            if(isMidTerm && !isModeTable) scrollLeft += 25; //78;
            if(isHr1Fct) scrollLeft -= 47;
            isMovingToTab = true;
            if(dfsSlider) dfsSlider.scrollTo( -scrollLeft, 0, 500, IScroll.utils.ease.quadratic);
            window.setTimeout(function() { isMovingToTab = false;}, 500);
            
            if(isMidTerm) {
                if(!$('.cmp-dfs-slider .item-lbl').hasClass('off')) {
                    $('.cmp-dfs-slider .item-lbl').addClass('off');
                }
                if(!$('.cmp-dfs-slider .item-lbl-graph').hasClass('off')) {
                    $('.cmp-dfs-slider .item-lbl-graph').addClass('off');
                }
                if(!$('.cmp-dfs-slider .item-lbl-midterm').hasClass('on')) {
                    $('.cmp-dfs-slider .item-lbl-midterm').addClass('on');
                }
            } else {
                $('.cmp-dfs-slider .item-lbl').removeClass('off');
                $('.cmp-dfs-slider .item-lbl-graph').removeClass('off');
                $('.cmp-dfs-slider .item-lbl-midterm').removeClass('on'); 
            }
        });
        $('.cmp-dfs-updated a').on('click', function(e) {
            e.preventDefault();
            if($(this).hasClass('open-box')) {
                $(this).toggleClass('on');
            } else if($(this).hasClass('close-box')) {
                $('.cmp-dfs-updated a.open-box').toggleClass('on');
            }
        });
        // 윈도우 사이즈 변경에 따라 슬라이더 갱신.
        var isMobileSize = $(window).width() <= 1100;
        $(window).resize(function(e) {
            var width = $(window).width();
            if(isMobileSize) {
                if(width > 1100) {
                    window.setTimeout(function() {
                        prepareSlider();
                        if(dfsSlider) dfsSlider.refresh();
                    },0);
                    isMobileSize = false;
                }
            } else {
                if(width <= 1100) {
                    window.setTimeout(function() {
                        prepareSlider();
                        if(dfsSlider) dfsSlider.refresh();
                    },0);
                    isMobileSize = true;
                }
            }
        });
        
        /*
            슬라이더 준비.
        */
        function prepareSlider() {
            isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
            isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
            scrollWidth = 0;
            slidePoints = [];
            tchartItemCount = 0;
            
            if(!isModeTable) {
                $slides.each(function(idx, ele) {
                    var slideWidth = 0;
                    $(ele).find('.item').each(function(idx2, ele2) {
                        var w = Math.ceil($(ele2).width());
                        slideWidth += w;
                        if(idx < slideLength-1) tchartItemCount++;
                    });
                    $(ele).css('width', slideWidth + 'px');
                    slidePoints.push(scrollWidth);
                    scrollWidth += slideWidth;
                });
                
                scrollWidth += 78;
                $slideWrap.css('width', scrollWidth + 'px');
            } else {
                $slides.each(function(idx, ele) {
                    var slideWidth = Math.ceil($(ele).width());
                    slidePoints.push(scrollWidth);
                    scrollWidth += slideWidth;
                });
                $slideWrap.css('width', scrollWidth + 'px');
            }
//            console.log("isModeTable", isModeTable, "slidePoints", slidePoints, "scrollWidth", scrollWidth);
        }
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
        }
        function selectTab(tabIndex) {
            $('.cmp-dfs-slider > .dfs-tab > .dfs-tab-head-wrap > .dfs-tab-head > li > a.on').removeClass('on').trigger('blur');
            var $a = $('.cmp-dfs-slider .dfs-tab .dfs-tab-head li').eq(tabIndex).find('a').addClass('on');
            //window.setTimeout(function(){$a.trigger('focus');}, 0);
        }
        function updateChart() {
            /* 기온 차트 */
            tchartWidth = slidePoints[slidePoints.length - 1];
            
            var $tchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .tchart').css({ width: tchartWidth + 'px'});
            var tchartId = "my-tchart";
            var $tchart = $('<div>').attr('id', tchartId).css({ width: '100%', height: '100%'}).appendTo($tchartWrap);
            var tempList = JSON.parse($tchartWrap.attr('data-data'));
            var tchart = createTChart(tchartId, tempList[0]);
            /* 중기 최저/최고 기온 차트 */
            midtchartWidth = scrollWidth - ((isModeTable) ? 0 : 100) - slidePoints[slidePoints.length - 1];
            midtchartLeft = tchartWidth + ((isModeTable) ? 0 : (isHr1Fct ? 63 : 90) );
            var $midtchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .midtchart').css({ left: midtchartLeft + 'px',width: midtchartWidth + 'px'});
            var midtchartId = "my-midtchart";
            var $midtchart = $('<div>').attr('id', midtchartId).css({ width: '100%', height: '100%'}).appendTo($midtchartWrap);
            var midchartSeries = JSON.parse($midtchartWrap.attr('data-data'));
            var tmnList = midchartSeries[0], tmxList = midchartSeries[1];
            var midtchart = createChart2(midtchartId, tmnList, tmxList);
            /* 차트 모드 */
            if(isModeChart) {
                var chartWidth = tchartWidth;
                /* 강수확률 */
                var $ptychartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .ptychart').css({ width: chartWidth + 'px'});
                $('<div>').attr('id', 'my-ptychart').css({ width: '100%', height: '100%'}).appendTo($ptychartWrap);
                var ptychartSeries = JSON.parse($ptychartWrap.attr('data-data'));
                var ptyList = ptychartSeries[0];
                
                var ptyChart = createChart('my-ptychart', [{data: ptyList, name:'', dataLabel: {overflow:'allow', formatter: function () { return this.y >= 0 ? (this.y + '%') : '';}}}], { 
                    chart: { 
                        type: 'column',
                        paddingTop: 20, 
                        paddingBottom: 20, 
                    }, 
                    plotOptions: {
                        series: {
                            showInLegend:false,
                            animation: false,
                        }
                    }, 
                    xAxis: { lineColor: '#39B1E8', lineWidth: 2, minPadding: 0, maxPadding: 0,},
                    yAxis: { max: 130, min: 0 }
                });
                
                /* 강수량 */
                var $rainchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .rainchart').css({ width: chartWidth + 'px'});
                $('<div>').attr('id', 'my-rainchart').css({ width: '100%', height: '100%'}).appendTo($rainchartWrap);
                var rainchartSeries = JSON.parse($rainchartWrap.attr('data-data'));
                var rainList = rainchartSeries[0];
                var maxRain = 0;
                for(var i = 0 ; i < rainList.length ; i++) {
                    if(maxRain < rainList[i]) {
                        maxRain = rainList[i];
                    }
                }
                if(maxRain < 20) maxRain = 20;
                maxRain *= 1.3;
                var rainChartSeries = [{
                        data: rainList, 
                        name:'강수', 
                        dataLabels: {
                            overflow: 'allow',
                            useHTML: true,
                            formatter: function () {
                                var label = '<span class="chart-label">';
                                var f = this.y;
                                if(!isHr1Fct) {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 5.0) label += "1~4";
                                    else if(f >= 5.0 && f < 10.0) label += "5~9";
                                    else if(f >= 10.0 && f < 20.0) label += "10~19";
                                    else if(f >= 20.0 && f < 40.0) label += "20~39";
                                    else if(f >= 40.0 && f < 70.0) label += "40~69";
                                    else label += "70~";  
                                } else {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 30.0) label += Math.round(f) + "";
                                    else if(f >= 30.0 && f < 50.0) label += "30~50";
                                    else label += "50~";  
                                }
                                label += '</span>';
                                return label; 
                            }
                        }
                    }];
                var rainChart = createChart('my-rainchart', rainChartSeries, { 
                    chart: { 
                        type: 'column',
                        paddingTop: 20, 
                        paddingBottom: 20, 
                    }, 
                    plotOptions: {
                        series: {
                            showInLegend:false,
                            animation: false,
                        }
                    },
                    xAxis: { lineColor: '#39B1E8', lineWidth: 2, minPadding: 0, maxPadding: 0 },
                    yAxis: { max: maxRain, min: 0, tickInterval:0.1 }
                });
                
                /* 적설량 */
                var $snowchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .snowchart').css({ width: chartWidth + 'px'});
                $('<div>').attr('id', 'my-snowchart').css({ width: '100%', height: '100%'}).appendTo($snowchartWrap);
                var snowchartSeries = JSON.parse($snowchartWrap.attr('data-data'));
                var snowList = snowchartSeries[0];
                var maxSnow = 0;
                for(var i = 0 ; i < snowList.length ; i++) {
                    if(maxSnow < snowList[i]) {
                        maxSnow = snowList[i];
                    }
                }
                if(maxSnow < 10) maxSnow = 10;
                maxSnow *= 1.3;
                var snowChartSeries = [{
                        data: snowList, 
                        name:'적설', 
                        dataLabels: {
                            overflow: 'allow',
                            useHTML: true,
                            formatter: function () {
                                var label = '<span class="chart-label">';
                                var f = this.y;
                                if(!isHr1Fct) {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 5.0) label += "1~4";
                                    else if(f >= 5.0 && f < 10.0) label += "5~9";
                                    else if(f >= 10.0 && f < 20.0) label += "10~19";
                                    else label += "20~";
                                } else {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 5.0) label += f.toFixed(1) + "";
                                    else label += "5~";  
                                }
                                label += '</span>';
                                return label; 
                            }
                        }
                    }];
                var snowChart = createChart('my-snowchart', snowChartSeries, { 
                    chart: { 
                        type: 'column',
                        paddingTop: 20, 
                        paddingBottom: 20, 
                    }, 
                    plotOptions: {
                        series: {
                            showInLegend:false,
                            animation: false,
                        }
                    },
                    xAxis: { lineColor: '#39B1E8', lineWidth: 2, minPadding: 0, maxPadding: 0 },
                    yAxis: { max: maxSnow, min: 0, tickInterval:0.1 }
                });
                
                /* 풍향 풍속 */
                var $windchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .windchart').css({ width: chartWidth + 'px'});
                $('<div>').attr('id', 'my-windchart').css({ width: '100%', height: '100%'}).appendTo($windchartWrap);
                var windchartSeries = JSON.parse($windchartWrap.attr('data-data'));
                var windList = [];
                var wsList = windchartSeries[0];
                var wdList = windchartSeries[1];
                var maxWs = 0;
                var minWs = 99999999;
                for(var i = 0 ; i < wsList.length; i++) {
                    if(maxWs < wsList[i]) {
                        maxWs = wsList[i];
                    }
                    if(minWs > wsList[i]) {
                        minWs = wsList[i];
                    }
                    windList.push({x:i, y: wsList[i], arrow: wdList[i] + '_b'});
                }
                minWs -= (maxWs - minWs) * 0.4; 
                maxWs += (maxWs - minWs) * 0.4;
                var windChart = createChart('my-windchart', [
                            {data: windList, name:'1',
                                dataLabels: {
                                    formatter: function() {
                                        return '<span class="wdic ' + this.point.arrow + ' sm" />';
                                    },
                                    overflow: 'allow',
                                    enabled: true,
                                    useHTML: true,
                                    inside: true
                                }
                            },
                            {data: windList, name:'dummy',
                                dataLabels: {
                                    formatter: function () { return this.y; },
                                    overflow: 'allow',
                                    enabled: true,
                                    y: 24
                                },    
                            }
                        ], { 
                        chart: { 
                            type: 'spline',
                            paddingTop: 20, 
                            paddingBottom: 20, 
                        },
                        plotOptions: {
                            series: {
                                showInLegend:false,
                                animation: false,
                            }
                        },
                        xAxis: { lineColor: '#39B1E8', lineWidth: 2 },
                        yAxis: { min: minWs, max: maxWs, tickInterval:0.01}
                    });
                /* 습도 */
                var $hmchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .hmchart').css({ width: chartWidth + 'px'});
                $('<div>').attr('id', 'my-hmchart').css({ width: '100%', height: '100%'}).appendTo($hmchartWrap);
                var hmchartSeries = JSON.parse($hmchartWrap.attr('data-data'));
                var hmList = hmchartSeries[0];
                var hmChart = createChart('my-hmchart', [{data: hmList, name:'', dataLabels: { overflow:'allow'}}], { 
                        chart: { 
                            type: 'areaspline',
                            paddingTop: 20, 
                            paddingBottom: 20, 
                            marginBottom: 2,
                        }, 
                        plotOptions: {
                            series: {
                                showInLegend:false,
                                animation: false,
                                marker : { enabled: true },
                                fillColor: {
                                    linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                                    stops: [
                                        [0, Highcharts.getOptions().colors[0]],
                                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                    ]
                                },
                            }
                        },
                        xAxis: { lineColor: '#39B1E8', lineWidth: 1},
                        yAxis: { max: 130, min:0 }
                    });
            }
        }
        /**
            차트
            series : array of array or..
            options : chart options
        */
        function createChart(id, series, options) {
            if(!series || series.length < 1) return;
            
            var minPadding = 1.0 / (series[0].data.length * 2.0); 
            var maxPadding = minPadding;
            var minValue = 999;
            var maxValue = -999;
            for(var j = 0 ; j < series.length ; j++) {
                var valList = series[j].data;
                for(var i = 0 ; i < valList.length ; i++) {
                    var val = valList[i];
                    if(typeof val.y != 'undefined') {
                        if(val.y > maxValue) maxValue = val.y;
                        if(val.y < minValue) minValue = val.y;
                    } else {
                        if(val > maxValue) maxValue = val;
                        if(val < minValue) minValue = val;
                    }    
                }
            }
            var lineColor = "#009AE0", fontColor = "#000000";
            var chartOptions = {
                plotOptions: {
                    series: { 
                        pointStart: 1, 
                        fillColor:'#009AE1' 
                    },
                    line: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '℃'; }
                        },    
                        enableMouseTracking: false,
                    },
                    spline: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '℃'; }
                        },    
                        enableMouseTracking: false,
                    },
                    area: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '%'; },
                            verticalAlign: 'bottom',
                        },    
                        enableMouseTracking: false,
                        marker: { enabled: false }
                    },
                    bar: {
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '%'; },
                            verticalAlign: 'bottom',
                        },    
                        enableMouseTracking: false
                    },
                    column: {
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y >= 0 ? this.y + '%' : ''; },
                            inside: false,
                        },    
                        enableMouseTracking: false
                    },
                    areaspline: {
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y >= 0 ? this.y + '%' : ''; },
                            inside: false,
                        },    
                        enableMouseTracking: false
                    }
                },
                series: series,
                yAxis: {
                    min: minValue-1, max: maxValue+1,
                    tickInterval: 0.1,
                    gridLineColor: "rgba(0,0,0,0)",
                    labels:{ enabled: false },
                    title: { enabled: false },
                },
                xAxis: {
                    lineColor: "rgba(0,0,0,0)",
                    tickColor: "rgba(0,0,0,0)",
                    labels: { enabled: false },
                    title: { enabled: false },
                    minPadding: minPadding,
                    maxPadding: maxPadding,
                    margin: 0, padding: 0,
                },
                chart: { backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
                title: { text: null },
                credits: { enabled:false},
            };
            if(options) _.merge(chartOptions, options);
            //console.log(chartOptions, options);
            var chart = Highcharts.chart(id, chartOptions);    
            return chart;        
        }
        
        function createTChart(id, tempList) {
            var minPadding = 1.0 / (tempList.length * 2.0); 
            var maxPadding = minPadding;
            var minValue = 999;
            var maxValue = -999;
            for(var i = 0 ; i < tempList.length ; i++) {
                var tempValue = tempList[i];
                if(tempValue > maxValue) maxValue = tempValue;
                if(tempValue < minValue) minValue = tempValue;
            }
            var lineColor = "#009AE0", fontColor = "#000000"; 
            var chart = Highcharts.chart(id, {
                plotOptions: {
                    series: {
                        pointStart: 1
                    },
                    spline: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '℃'; }
                        },    
                        enableMouseTracking: false
                    }
                },
                series: [{ name: '', data: tempList, showInLegend: false, animation:false }],
                yAxis: {
                    min: minValue-1, max: maxValue+1,
                    tickInterval: 0.1,
                    gridLineColor: "rgba(0,0,0,0)",
                    labels:{ enabled: false },
                    title: { enabled: false },
                },
                xAxis: {
                    lineColor: "rgba(0,0,0,0)",
                    tickColor: "rgba(0,0,0,0)",
                    labels: { enabled: false },
                    title: { enabled: false },
                    minPadding: minPadding,
                    maxPadding: maxPadding,
                    margin: 0, padding: 0,
                },
                chart: { type:'spline', backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
                title: { text: null },
                credits: { enabled:false },
            });    
            return chart;        
        }
        function createChart2(id, tmnList, tmxList) {
            var minPadding = 1.0 / (tmnList.length * 2.0); 
            var maxPadding = minPadding;
            var minValue = 999;
            var maxValue = -999;
            for(var i = 0 ; i < tmnList.length ; i++) {
                var tempValue = tmnList[i];
                if(tempValue > maxValue) maxValue = tempValue;
                if(tempValue < minValue) minValue = tempValue;
            }
            for(var i = 0 ; i < tmxList.length ; i++) {
                var tempValue = tmxList[i];
                if(tempValue > maxValue) maxValue = tempValue;
                if(tempValue < minValue) minValue = tempValue;
            }
            var delta = maxValue - minValue;
            if(delta != 0) {
                maxValue = maxValue + (delta * 0.39);
                minValue = minValue - (delta * 0.5);
            } else {
                maxValue = maxValue + (maxValue * 0.39);
                minValue = minValue - (minValue * 0.5);
            }
            var lineColor = "#009AE0", fontColor = "#000000"; 
            var chart = Highcharts.chart(id, {
                plotOptions: {
                    series: {
                        pointStart: 1
                    },
                    spline: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '℃'; }
                        },    
                        enableMouseTracking: false
                    }
                },
                series: [
                        { name: '', data: tmnList, marker: { symbol:'circle' }, showInLegend: false, animation:false, dataLabels: { overflow: 'allow', y: 25 } },
                        { name: '', data: tmxList, marker: { symbol:'circle' }, showInLegend: false, animation:false,}
                ],
                yAxis: {
                    min: minValue, max: maxValue,
                    tickInterval: 0.1,
                    gridLineColor: "rgba(0,0,0,0)",
                    labels:{ enabled: false },
                    title: { enabled: false },
                },
                xAxis: {
                    lineColor: "rgba(0,0,0,0)",
                    tickColor: "rgba(0,0,0,0)",
                    labels: { enabled: false },
                    title: { enabled: false },
                    minPadding: minPadding,
                    maxPadding: maxPadding,
                    margin: 0, padding: 0,
                },
                chart: { type:'spline', backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
                title: { text: null },
                credits: { enabled:false },
            });    
            return chart;        
        }
    }
    function createGlobalEvent() {
        var isMapMode = displayMode == DISPLAY_MODE_MAP;
        GlobalEvent.on('onAppConfigUpdated', function(e) {
            window.location.reload();
        });
        GlobalEvent.on('onAreaBookmarkDeleted', function(e, bookmarkIndex, bookmark, sender) {
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
        });
        GlobalEvent.on('onAreaBookmarkAdded', function(e, bookmarkIndex, bookmark, sender) {
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
        });
        GlobalEvent.on('onAddAreaBookmark', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            if(!isMapMode) updateCurrentWeather(bookmark);
            if(!isMapMode) updateDigitalForecast(bookmark);
			if(!isMapMode) updateImpactForecast(bookmark);
        });
        GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            if(!isMapMode) updateCurrentWeather(bookmark);
            if(!isMapMode) updateDigitalForecast(bookmark);
			if(!isMapMode) updateImpactForecast(bookmark);
        });
        
        GlobalEvent.on('onSaveAreaBookmark', function(e) {
            bookmarkDropdown.refresh();
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated();
        });
        
        GlobalEvent.on('onAreaBookmarkSelected', function(e, bookmarkIndex, bookmark, sender) {
            if(!bookmark || !bookmark.dong) return;
            if(!bookmark.dong.lat || !bookmark.dong.lon){
                var latlon = convertDfsGrid('toLL', bookmark.dong.x, bookmark.dong.y)
                if(latlon['lat'] && latlon['lng']) {
                    bookmark.dong.lat = latlon['lat'];
                    bookmark.dong.lon = latlon['lng'];
                }
            }
                
            if(sender.id != bookmarkDropdown.id) {
                bookmarkDropdown.refreshSelected(bookmark);
            } 
            
            if(myPointSlider && sender.id != myPointSlider.id) {
                myPointSlider.refreshSelected(bookmark);
            }
            if(!isMapMode) updateCurrentWeather(bookmark);
            if(!isMapMode) updateDigitalForecast(bookmark);
			if(!isMapMode) updateImpactForecast(bookmark);
            if(bookmark.dong.lat && bookmark.dong.lon){
                updateMapCenter(bookmark);
            }
        });
        
        GlobalEvent.on('onAreaShow', function(e, bookmark, sender, disableUpdateMapCenter) {
            if(!bookmark.dong.lat || !bookmark.dong.lon){
                var latlon = convertDfsGrid('toLL', bookmark.dong.x, bookmark.dong.y)
                if(latlon['lat'] && latlon['lng']) {
                    bookmark.dong.lat = latlon['lat'];
                    bookmark.dong.lon = latlon['lng'];
                }
            }
            if(sender && sender.id == 'pop-local-search') {
                $('.pop-local-search').removeClass('on');
            }
            if(myPointSlider && sender.id != myPointSlider.id) {
                 myPointSlider.refreshSelected(bookmark);
            }
            if(bookmarkDropdown) bookmarkDropdown.refreshSelected(bookmark);
            if(!isMapMode) updateCurrentWeather(bookmark);
            if(!isMapMode) updateDigitalForecast(bookmark);
			if(!isMapMode) updateImpactForecast(bookmark);
            if(bookmark.dong.lat && bookmark.dong.lon){
                if(!disableUpdateMapCenter) updateMapCenter(bookmark);
            }
        });
        
        $(document).click(function(e){
            var canCloseLocalSearchItems = $(e.target).parents('.cmp-local-search').length == 0
                && $(e.target).parents('.cmp-local-search-items').length == 0
                && $(e.target).attr('data-role') != 'log-delete'; 
            if(canCloseLocalSearchItems) {
                $('.cmp-local-search-items').removeClass('on').removeClass('opened');
            }
            
            var canCloseTodayWarning = $(e.target).parents('.cmp-main-wrn.accordion-wrap').length == 0;
            if(canCloseTodayWarning) {
                $('.cmp-main-wrn .box-con-on.accordion-tit.on').trigger('click');
            }
            
            var canCloseHelpTooltip = $(e.target).parents('.cmp-help-tooltip').length == 0 && $(e.target).attr('data-role')!="toggle-help";
            if(canCloseHelpTooltip) $('.cmp-help-tooltip').removeClass('on');
        });
    }    
    
    function readBookmarkSelectedInfo() {
        var lat = 37.493546;
        var lon = 126.921654;
        var favoriteFound = false;
        if(bookmarkDropdown.config 
                && ((bookmarkDropdown.config.bookmarks && bookmarkDropdown.config.bookmarks.length > 0) 
                        || bookmarkDropdown.config.selectedBookmark)) {
            if(bookmarkDropdown.config.selectedBookmark) {
                var bm = bookmarkDropdown.config.selectedBookmark;
                if(bm.dong && bm.dong.lat && bm.dong.lon && bm.dong.lat != "null" && bm.dong.lon != "null") {
                    lat = bm.dong.lat;
                    lon = bm.dong.lon;
                    bookmarkSelectedDong = bm.fullName;
                    bookmarkSelectedDongCode = bm.dong.code;
                    favoriteFound = true;
                } else {
                    if(bm.dong) {
                        var latlon = convertDfsGrid("toLL", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
                        if(latlon['lat'] && latlon['lng']) {
                            lat = latlon['lat'];
                            lon = latlon['lng'];
                            bookmarkSelectedDong = bm.fullName;
                            favoriteFound = true;
                        }
                        bookmarkSelectedDongCode = bm.dong.code;
                    }
                }
                
            } else {
                var bm = bookmarkDropdown.config.bookmarks[0];
                if(bm.dong && bm.dong.lat && bm.dong.lon && bm.dong.lat != "null" && bm.dong.lon != "null") {
                    lat = bm.dong.lat;
                    lon = bm.dong.lon;
                    bookmarkSelectedDong = bm.fullName;
                    bookmarkSelectedDongCode = bm.dong.code;
                    favoriteFound = true;
                } else {
                    if(bm.dong) {
                        var latlon = convertDfsGrid("toLL", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
                        if(latlon['lat'] && latlon['lng']) {
                            lat = latlon['lat'];
                            lon = latlon['lng'];
                            bookmarkSelectedDong = bm.fullName;
                            bookmarkSelectedDongCode = bm.dong.code;
                            favoriteFound = true;
                        }
                    }
                }
            }
        }
        bookmarkSelectedLat = lat;
        bookmarkSelectedLon = lon;
        return favoriteFound;
    }
    function requestCurrentImages() {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "renew2021/rest/main/current-images.do",
            data: {},
            dataType: "json"
        });
    }
    function requestWeatherCmt() {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/weather/weather-cmt-main.do",
            data: {},
            dataType: "html"
        });
    }
    function requestLocalWeather(type, ele, wsUnit) {
        return $.ajax({
            url: appPrefix+ "weather/local/" + type + "-frame.do",
            data: {ele: ele, wsUnit: wsUnit},
            dataType: "html"
        });
    }
    /*function requestCurrentAws(code, wsUnit) {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/main/current-aws.do",
            data: {code: code, unit: wsUnit},
            dataType: "html"
        });
    }*/
    function requestCurrentWeather(code, wsUnit) {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/main/current-weather.do",
            data: {code: code, unit: wsUnit, aws: 'N'},
            dataType: "html"
        });
    }
    function requestDigitalForecast(code, wsUnit) {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/special/digital-forecast.do",
            data: {code: code, unit: wsUnit, hr1: 'Y'},
            dataType: "html"
        });
    }
    function requestIfs(code, wsUnit) {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/special/ifs.do",
            data: {code: code, unit: wsUnit},
            dataType: "html"
        });
    }
    
    /*function requestNearAirStation(lat, lon) {
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "rest/zone/find/air-station.do",
            data: {lat: lat, lon: lon},
            dataType: "json"
        });
    }*/
    function openExternalPop(url) {
        if(!url) return;
        
        if(url.substring(0,1) == "/") {
            url = window.location.origin + url;
        }
        
        window.open(url);
    }        
    /**
        code: "toXY"
            lat, lng to x, y
        code: "toLL" 
            x, y to lat, lng 
        return { lat, lng, x, y }
    */
    function convertDfsGrid(code,v1,v2) {
        //
        // LCC DFS 좌표변환을 위한 기초 자료
        //
        var RE = 6371.00877; // 지구 반경(km)
        var GRID = 5.0;      // 격자 간격(km)
        var SLAT1 = 30.0;    // 투영 위도1(degree)
        var SLAT2 = 60.0;    // 투영 위도2(degree)
        var OLON = 126.0;    // 기준점 경도(degree)
        var OLAT = 38.0;     // 기준점 위도(degree)
        var XO = 43;         // 기준점 X좌표(GRID)
        var YO = 136;        // 기1준점 Y좌표(GRID)
    
        var DEGRAD = Math.PI / 180.0;
        var RADDEG = 180.0 / Math.PI;
    
        var re = RE / GRID;
        var slat1 = SLAT1 * DEGRAD;
        var slat2 = SLAT2 * DEGRAD;
        var olon  = OLON  * DEGRAD;
        var olat  = OLAT  * DEGRAD;
    
        var sn = Math.tan( Math.PI*0.25 + slat2*0.5 ) / Math.tan( Math.PI*0.25 + slat1*0.5 );
        sn = Math.log( Math.cos(slat1) / Math.cos(slat2) ) / Math.log(sn);
        var sf = Math.tan( Math.PI*0.25 + slat1*0.5 );
        sf = Math.pow(sf,sn) * Math.cos(slat1) / sn;
        var ro = Math.tan( Math.PI*0.25 + olat*0.5 );
        ro = re * sf / Math.pow(ro,sn);
        var rs = {};
        if (code == "toXY") {
            rs['lat'] = v1;
            rs['lng'] = v2;
            var ra = Math.tan( Math.PI*0.25 + (v1)*DEGRAD*0.5 );
            ra = re * sf / Math.pow(ra,sn);
            var theta = v2 * DEGRAD - olon;
            if (theta >  Math.PI) theta -= 2.0 * Math.PI;
            if (theta < -Math.PI) theta += 2.0 * Math.PI;
            theta *= sn;
            rs['x'] = Math.floor( ra*Math.sin(theta) + XO + 0.5 );
            rs['y'] = Math.floor( ro - ra*Math.cos(theta) + YO + 0.5 );
        } else {
            rs['x'] = v1;
            rs['y'] = v2;
            var xn = v1 - XO;
            var yn = ro - v2 + YO;
            ra = Math.sqrt( xn*xn+yn*yn );
            if (sn < 0.0) -ra;
            var alat = Math.pow( (re*sf/ra),(1.0/sn) );
            alat = 2.0*Math.atan(alat) - Math.PI*0.5;
    
            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            } else {
                if (Math.abs(yn) <= 0.0) {
                    theta = Math.PI*0.5;
                    if( xn < 0.0 ) -theta;
                } else theta = Math.atan2(xn,yn);
            }
            var alon = theta/sn + olon;
            rs['lat'] = alat*RADDEG;
            rs['lng'] = alon*RADDEG;
        }
        return rs;
    }
})(jQuery, window, document);
