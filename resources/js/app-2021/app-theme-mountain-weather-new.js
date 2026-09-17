/**
 * 산악기상정보 /theme/mountain-weather-new.do
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
        window.location.reload();
    });
    var version = "1.0",
        wsUnit = "m/s",
        appPrefix = window.appBase ? window.appBase : '/',
        ptrEnabled = true;
        
    if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
        wsUnit = appConfig.config.unit.ws;
    }
    
    /* 화면 모드 셋팅 */
    var displayMode = (appConfig && appConfig.config && appConfig.config.displayMode) ? appConfig.config.displayMode : DISPLAY_MODE_DEFAULT;
    if(displayMode != DISPLAY_MODE_MAP) {
        displayMode = DISPLAY_MODE_DEFAULT;
    }
    var mainState = null;
    if(appConfig.config && appConfig.config.state && appConfig.config.state.main) {
    	mainState = appConfig.config.state.main;
    } else {
    	mainState = {
			mobileWgisMapClosed: false,
			timelineMode: 'mode-default',
			timelineInterval: 3,
		};
    	if(!appConfig.config) appConfig.config = {};
    	if(!appConfig.config.state) appConfig.config.state = {};
    	appConfig.config.state.main = mainState;
    }

    //해시 파라미터 읽기.
    //형식 : #tab=vmap/subtab=1/lat=36.7/lon=126.2/zoom=7

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
    /* 날씨 시계열 */
    init();
    
    function init() {
        updateMountainsForecast(mtId);
    }

    function updateTimelineOptionStatus(timelineMode) {
    	if(timelineMode == 1) {
    		$('.cmp-dfs-slider .cmp-common-heading .tab-btn').removeClass('on');
    		$('.cmp-dfs-slider .cmp-common-heading .tab-btn').eq(1).addClass('on');
    	} else {
    		$('.cmp-dfs-slider .cmp-common-heading .tab-btn').removeClass('on');
    		$('.cmp-dfs-slider .cmp-common-heading .tab-btn').eq(0).addClass('on');
    	}
    	
    }
    function updateChartOptionStatus(timelineMode) {
    	$('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(timelineMode);
    	$('.cmp-dfs-slider a.sym-btn[data-view]').each(function() {
    		if($(this).attr('data-view') == timelineMode) {
    			$(this).addClass('on').attr('title','선택됨');
    		} else {
    			$(this).removeClass('on').attr('title','');
    		}
    	});
    	
    	$('.cmp-dfs-slider .view-options a.sym-btn[data-option]').each(function() {
    		if($(this).attr('data-value') == timelineMode) {
    			$(this).addClass('on').attr('title','선택됨');
    		} else {
    			$(this).removeClass('on').attr('title','');
    		}
    	});
    }
    
    function updateMountainsForecast(mtId) {
		var interval = mainState.timelineInterval;
        requestMountainsForecast(mtId, interval, wsUnit).then(
            function(html) {
                showLoading('mountain-forecast', false);
                var $dfWrapper = $('#mountain-forecast');
                $dfWrapper.html(html);
                var isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
                var isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
				updateChartOptionStatus(mainState.timelineMode);
        		updateTimelineOptionStatus(mainState.timelineInterval);
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
                showLoading('mountain-forecast', false);
            }
        );   
    }
    
    function requestMountainsForecast(mountainId, interval, wsUnit) {
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/theme/mountains-forecast.do",
			method: "get",
			data: { mtId: mountainId, hr1: interval != 1 ? 'N' : 'Y', unit: wsUnit },
			dataType: "html"
		});
		}
    
    function createDfsSlider() {
        var isHr1Fct = $('.cmp-dfs-slider').first().hasClass('hr1-fct');
        var dfsSlider = null;
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
        var sliderWidth = $slider.width();
        prepareSlider();
        
        dfsSlider = new IScroll('.dfs-tab-body .dfs-slider', { eventPassthrough:true, scrollX: true, scrollY: false, mouseWheel: false, scrollbars: 'custom', resizePolling : 40, probeType : 3, interactiveScrollbars: true});
        
        updateChart();
        $('.dfs-tab-body .dfs-slider').on("keydown", function(e) {
        	if(e.keyCode == 37) {
        		dfsSlider.scrollBy(sliderWidth/2,0,500,IScroll.utils.ease.quadratic);
        	} else if(e.keyCode == 39){
        		dfsSlider.scrollBy(-sliderWidth/2,0,500,IScroll.utils.ease.quadratic);
        	}
        });
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
//                if(slidePoints.length - 1 == selectedTabIndex) {
//                    if(!$('.cmp-dfs-slider .item-lbl').hasClass('off')) {
//                        $('.cmp-dfs-slider .item-lbl').addClass('off');
//                    }
//                    if(!$('.cmp-dfs-slider .item-lbl-graph').hasClass('off')) {
//                        $('.cmp-dfs-slider .item-lbl-graph').addClass('off');
//                    }
//                    if(!$('.cmp-dfs-slider .item-lbl-midterm').hasClass('on')) {
//                        $('.cmp-dfs-slider .item-lbl-midterm').addClass('on');
//                    }
//                } else {
//                    $('.cmp-dfs-slider .item-lbl').removeClass('off');
//                    $('.cmp-dfs-slider .item-lbl-graph').removeClass('off'); 
//                    $('.cmp-dfs-slider .item-lbl-midterm').removeClass('on');
//                }
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
                $('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on').removeAttr('title');
                $('.cmp-dfs-slider a.sym-btn[data-view="' + optionValue + '"]').addClass('on').attr('title','선택됨');
            }
            $('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']').removeClass('on');
        });
        $('.cmp-dfs-slider').on('click', 'a.sym-btn[data-view]', function(e) {
            e.preventDefault();
            $(this).parent().find('a.sym-btn[data-view]').removeClass('on').removeAttr('title');
            $(this).addClass('on').attr('title','선택됨');
            
            var mode = $(this).attr('data-view');
            $('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(mode);
            window.setTimeout(function() {
                prepareSlider();
                dfsSlider.refresh();
                updateChart();
                $('.dfs-tab-head > li > a').first().trigger('click');
                }, 0);
            $('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"]').removeClass('on').removeAttr('title');
            $('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"][data-value="' + mode + '"]').addClass('on').attr('title','선택됨');
        });
        $('.cmp-dfs-slider').on('click', 'a.tab-btn[data-interval-hours]', function(e) {
        	e.preventDefault();
        	var data = $(this).data();
        	var interval = parseInt(data.intervalHours);
        	
        	$(this).parent().find('a.tab-btn').removeClass('on');
        	$(this).addClass('on');
        	mainState.timelineInterval = interval;
        	updateMountainsForecast(mtId);
        });
        /*
            오늘 내일 모레 10일 이후 탭과 스크롤 연동.
        */
        $('.cmp-dfs-slider .dfs-tab .dfs-tab-head').on('click', 'a', function(e) {
            e.preventDefault();
            $(this).parents('.dfs-tab-head').find('a.on').removeClass('on').removeAttr('title');
            $(this).addClass('on').attr('title','선택됨');
            var date = $(this).attr('data-date');
            var $slider = $('.cmp-dfs-slider .dfs-slider').first();
            var scrollLeft = 0;
            $slider.find('.daily').each(function(idx, ele) {
                if(date == $(ele).attr('data-date')) return false;
                scrollLeft +=  Math.ceil($(ele).width());
            });
            var isMidTerm = false; //$(this).parent().index() == $(this).parent().parent().find('li').last().index(); 
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
                $(this).addClass('on');
                $('.cmp-dfs-updated a.close-box').first().trigger('focus');
            } else if($(this).hasClass('close-box')) {
                $('.cmp-dfs-updated a.open-box').removeClass('on').trigger('focus')
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
                slidePoints.push(scrollWidth);
                scrollWidth += (isHr1Fct ? 57 : 78);
                $slideWrap.css('width', scrollWidth + 'px');
            } else {
                $slides.each(function(idx, ele) {
                    var slideWidth = Math.ceil($(ele).width());
                    slidePoints.push(scrollWidth);
                    scrollWidth += slideWidth;
                });
                $slideWrap.css('width', scrollWidth + 'px');
            }
            sliderWidth = $slider.width();
//          console.log("isModeTable", isModeTable, "slidePoints", slidePoints, "scrollWidth", scrollWidth);
        }
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
        }
        function selectTab(tabIndex) {
            $('.cmp-dfs-slider > .dfs-tab > .dfs-tab-head-wrap > .dfs-tab-head > li > a.on').removeClass('on').trigger('blur').removeAttr('title');
            var $a = $('.cmp-dfs-slider .dfs-tab .dfs-tab-head li').eq(tabIndex).find('a').addClass('on').attr('title','선택됨');
            //window.setTimeout(function(){$a.trigger('focus');}, 0);
        }
        function updateChart() {
            /* 기온 차트 */
            tchartWidth = 0;
            $.each($slides, function(idx,ele) {
                tchartWidth += $(ele).width();
            });

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
                if(wsUnit == "km/h") {
                	for(var i = 0 ; i < wsList.length; i++) {
                		wsList[i] = wsList[i] * 3.6;
                	}
                }
                for(var i = 0 ; i < wsList.length; i++) {
                	if(wsList[i] < 0) {
                		wsList[i] = null;
                		wdList[i] = "empty";
                	} else {
                		if(maxWs < wsList[i]) maxWs = wsList[i];
                        if(minWs > wsList[i]) minWs = wsList[i];
                	}
                    windList.push({x:i, y: wsList[i], arrow: wdList[i] + '_b'});
                }
                if(wsUnit == "km/h") {
	                minWs -= (maxWs - minWs) * 0.5; 
	                maxWs += (maxWs - minWs) * 0.5;
                } else {
                	minWs -= (maxWs - minWs) * 0.4; 
	                maxWs += (maxWs - minWs) * 0.4;
                }
                var windChart = createChart('my-windchart', [
                            {data: windList, name:'1',
                                dataLabels: {
                                    formatter: function() {
                                        return this.point.y < 0 ? '<span class="wdic empty_b sm" />' : '<span class="wdic ' + this.point.arrow + ' sm" />';
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
                        xAxis: { lineColor: 'rgba(0,0,0,0)', lineWidth: 2 },
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
            	if(tempList[i] < -50) {
            		tempList[i] = null;
                	continue;
                }
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
    
    
    function initMap() {
		var options = {
				lat: 37.493546, 
				lon: 126.921654, 
				zoom: 8.7,
				minZoom: 3,
				maxZoom: 16,
				whitemap: true,
				fullscreen: false,
				scaleLine: true,
			};
		var vmap = new kmap({
			target: "kmap",
			scaleLine: options.scaleLine,
			fullScreen: options.fullScreen,
			zoom: options.zoom,
			minZoom: options.minZoom,
			maxZoom: options.maxZoom,
			wsUnit: "m/s",
			center: [options.lon, options.lat],
			mapLayers: [
				{title: "거리지도", layer: "New_baroemap", visible: !options.whitemap},
				{title: "백지도", layer: "WhiteMap", visible: options.whitemap}
			],
			workspace: "kma_2023"
		});
		function onLoad(vmap) {
			getLocation(function(lat, lon, err) {
				if(!mtId) vmap.setCenter([lon, lat]);
				vmap.addLocation([lon, lat]);
			});
		}
		var markers = [];
		var selectedMarker = null;
		var stationPop = null;
		function createMarker(vmap) {
			var PROJ = "EPSG:980201";
			
			for(var group in stationGroups) {
				var stations = stationGroups[group];
				stations.forEach(function(s) {
					var marker = new ol.Feature({
						geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(s.longitude), parseFloat(s.latitude)],PROJ))
					});
					marker.userInfo = s;
					markers.push(marker);
					var vectorSource = new ol.source.Vector({
						visible: true,
						features: [marker]
					});
					var markerVectorLayer = new ol.layer.Vector({
						source: vectorSource,
						style: new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5,1],
								src: `${window.appBase}/resources/image/theme/icon_mountain.png`,
								scale: 0.4,
							})
						})
					});
					markerVectorLayer.setZIndex(1001);
					vmap._map.addLayer(markerVectorLayer);
					
					if(s.id == mtId) {
						selectedMarker = marker;
					}
				});
			}
			
			stationPop = new ol.Overlay({
				element: document.getElementById("station-popup")
			})
			vmap._map.addOverlay(stationPop);
			
			$(stationPop.getElement()).on('click', 'a.station-pop-close', function(e) { e.preventDefault(); $(this).parent().hide(); });
			
			vmap._map.on('click', function(e) {
				var feature = vmap._map.forEachFeatureAtPixel(e.pixel, function(feature) {
					return feature;
				});
				if(feature && feature.userInfo) {
					var coordinates = feature.getGeometry().getCoordinates();
					stationPop.setPosition(coordinates);
					showStationPopup(feature.userInfo);
					updateMenu(feature.userInfo);
					updateData(feature.userInfo);
					updateMarker(feature.userInfo);
					
					if(history.pushState) {
						var historyPath = location.pathname + "?mtId=" + feature.userInfo.id;
						history.pushState(feature.userInfo, null, historyPath);
					}
				} else {
					stationPop.getElement().style.display = "none";
				}
			});
			vmap._map.on('pointermove', function(e) {
				var hit = vmap._map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
					return true;
				});
				if(hit) {
					this.getTargetElement().style.cursor = 'pointer';
				} else {
					this.getTargetElement().style.cursor = '';
				}
			});
			if(selectedMarker) {
				var coordinates = selectedMarker.getGeometry().getCoordinates();
				stationPop.setPosition(coordinates);
				vmap.setCenter([parseFloat(selectedMarker.userInfo.longitude), parseFloat(selectedMarker.userInfo.latitude)]);
				vmap.setZoom(9);
			}
			if(selectedMarker) showStationPopup(selectedMarker.userInfo);
		}
		function showStationPopup(userInfo) {
			$('#station-popup-content').html(`<h3>${userInfo.name}</h3>`);
			$('#station-popup').show();
		}
		function updateMenu(station) {
			if(!station) return;
			$('.kmap-menu').find('>li').removeClass('on');
			$('.kmap-menu').find('>li>ul>li').removeClass('on');
			$('.kmap-menu').find('>li>ul>li>a').each(function(e) {
				var data = $(this).data();
				if(data.id == station.id) {
					if(station.id == '11H003P1') { // 2025-03-18 소백산 경북으로 default 처리
						if(data.groupname == '경상남북도') {
							$(this).parent().addClass('on');
						}
					}
					else if(station.id == '11H036P0') { // 2025-03-18 희양산 경북으로 default 처리
						if(data.groupname == '경상남북도') {
							$(this).parent().addClass('on');
						}
					}
					else {
						$(this).parent().addClass('on');
					}					
				}
			});
		}
		function updateData(station) {
			mtId = station.id;
			updateMountainsForecast(mtId); 
			$('.mt-hd-name').html(station.name); 
			var grpNm = station.groupName;
			if(!grpNm) grpNm = station.groupname;
			$('html > head > title').text(station.name + ' > ' + grpNm + ' > 산악날씨'); 		
		}
		function updateMarker(station) {
			for(var i in markers) {
				var marker = markers[i];
				if(marker.userInfo.id == station.id) {
					selectedMarker = marker;
					break;
				}
			}
			var coordinates = selectedMarker.getGeometry().getCoordinates();
			stationPop.setPosition(coordinates);
			var modLon = parseFloat(selectedMarker.userInfo.longitude);
			if(isMobileEnv()) {
				modLon = parseFloat(selectedMarker.userInfo.longitude) - 0.15;
			}			
			vmap.setCenter([modLon, parseFloat(selectedMarker.userInfo.latitude)]);
			showStationPopup(selectedMarker.userInfo);
		}
		function initMenu(vmap) {
			$('.kmap-menu').on('click', '>li>a', function(e) {
				e.preventDefault();
				if($(this).parent().hasClass('on')) {
					$(this).parent().removeClass('on');					
				} else {
					$(this).parent().parent().find('>li').removeClass('on');
					$(this).parent().parent().find('>li>ul>li').removeClass('on');
					$(this).parent().addClass('on');
				}
			});
			
			$('.kmap-menu').on('click', '>li>ul>li>a', function(e) {
				e.preventDefault();
				$(this).parent().parent().find('li').removeClass('on');
				$(this).parent().addClass('on');
				var data = $(this).data();
				if(history.pushState) {
					var historyPath = location.pathname + "?mtId=" + data.id;
					history.pushState(data, null, historyPath);
				}
				updateData(data);
				updateMarker(data);
			});
			$(window).on('popstate', function (e) {
				if(history.state) {
					var data = history.state;
					updateMenu(data);
					updateData(data);
					updateMarker(data);
				}
			});
		}
		
		function getLocation(callback) {
			var defaultLat = 37.493546,
				defaultLon = 126.921654;
			var errorCallback = function(error) {
				if (console) console.log(error);
				switch (error.code) {
					case 1: // error.PERMISSION_DENIED:
					case 2: // error.POSITION_UNAVAILABLE:
					case 3: // error.TIMEOUT:
					case 4: // error.UNKNOWN_ERROR:
						break;
				}
				callback(defaultLat, defaultLon, true);
			}
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					if (position.coords.latitude && position.coords.longitude) {
						callback(position.coords.latitude, position.coords.longitude);
					} else {
						callback(defaultLat, defaultLon);
					}
				}, errorCallback);
			} else {
				alert("위치를 지원하지 않는 브라우저입니다.");
				callback(defaultLat, defaultLon);
			}
		}		
    
		function setInteraction(vmap) {
			var dragPanInteraction = new ol.interaction.DragPan({
				condition: function(event) {
					if(ol.events.condition.mouseOnly(event)) {
						return true;
					} else if(ol.events.condition.touchOnly(event)) {
						if(event.touches) {
							if(event.touches.length > 1) {
								return true;
							}
						} else if(this.getPointerCount() > 1){
							return true;
						}
					}
					return false;
				}
			});
			var dragPan;
			var mouseWheelZoom;
			vmap._map.getInteractions().forEach(function(ia) {
				if(ia instanceof ol.interaction.DragPan) {
					dragPan = ia;
				}
				if(ia instanceof ol.interaction.MouseWheelZoom) {
					mouseWheelZoom = ia;
				}
			});
			if(dragPan) {
				vmap._map.removeInteraction(dragPan);
			}
			if(mouseWheelZoom) {
				vmap._map.removeInteraction(mouseWheelZoom);
			}
			
			vmap._map.addInteraction(dragPanInteraction);
		}
		onLoad(vmap);
		initMenu(vmap);		
		createMarker(vmap);
		setInteraction(vmap);
		if(isMobileEnv()) {
			$('.kmap-guide').show();
		} else {
			$('.kmap-guide').remove();
		}
	}	
	
	
	initMap();
})(jQuery, window, document);
