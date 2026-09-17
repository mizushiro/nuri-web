/**
 * 북한날씨 육상예보 /theme/nk-weather/land.do
 */
'use strict';
(function($, window, document){
	var version = "1.0",
		wsUnit = "m/s",
		appPrefix = window.appBase ? window.appBase : '/',
		ptrEnabled = true;
		
	if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
		wsUnit = appConfig.config.unit.ws;
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
	/* events */
	$('#default-form').on('submit', function(e) {
		var f = this;
		var intervalData = $('.tab-btn-wrap a.on').first().data();
		if(intervalData && intervalData.timelineInterval == 1) {
			f.hr01.value = 'Y';			
		} else {
			f.hr01.value = 'N';
		}
		return true;
	});
	$('.tab-btn-wrap .tab-btn').on('click', function(e) {
		e.preventDefault();
		$(this).parent().find('a').removeClass('on');
		$(this).addClass('on');
		var f = $('#default-form')[0];
		var intervalData = $(this).data();
		if(intervalData && intervalData.timelineInterval == 1) {
			f.hr01.value = 'Y';			
		} else {
			f.hr01.value = 'N';
		}
		f.submit();
	});
	/* 날씨 시계열 */
	createDfsSlider();
	
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
                if(false && isHr1Fct) {
                    if(lastTabIndex < $dailyHeads.length) {
                        $dailyHeads.eq(lastTabIndex).css({ 'margin-left': 'auto'});
                    }
                }
                lastTabIndex = selectedTabIndex;
                selectTab(lastTabIndex);
                if(false && slidePoints.length - 1 == selectedTabIndex) {
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
			
			if(false && isMidTerm) {
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
})(jQuery, window, document);
