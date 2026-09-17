/**
 * 2020 메인 페이지
 *
 */
'use strict';
(function($, window, document){
	$('.cmp-main-tabs .tab-item .tab-head').on('click', 'a', function(e) {
		e.preventDefault();
		$(this).parents('.cmp-main-tabs').find('.tab-item').removeClass('on');
		$(this).parents('.tab-item').addClass('on');
	});

	// 전체 지도 모드에서는 스킵
	if($('body').hasClass("mode-map")) {
		return;
	}

	var dfsSlider = null;
	var isMovingToTab = false;
	var prefix = window.appBase ? window.appBase : '/';
	var obj = '.dfs-tab-body .slider';
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
	var slideLength = $slides.length;
	var lastTabIndex = 0;
	
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
			
			scrollWidth += 55;
			$slideWrap.css('width', scrollWidth + 'px');
		} else {
			$slides.each(function(idx, ele) {
				var slideWidth = 0;
				var isLastSlide = idx == slideLength-1;
				if(!isLastSlide) {
					slideWidth += $(ele).width();
				}
				$(ele).find('.item').each(function(idx2, ele2) {
					if(isLastSlide) {
						var w = Math.ceil($(ele2).width());
						slideWidth += w;
					}
					if(idx < slideLength-1) tchartItemCount++;
				});
				
				slidePoints.push(scrollWidth);
				scrollWidth += slideWidth;
			});
			$slideWrap.css('width', scrollWidth + 'px');
		}
		console.log("isModeTable", isModeTable, "slidePoints", slidePoints, "scrollWidth", scrollWidth);
	}
	prepareSlider();
	dfsSlider = new IScroll('.dfs-tab-body .slider', { scrollX: true, scrollY: false, mouseWheel: false, scrollbars: false, resizePolling : 40, probeType : 3, interactiveScrollbars: true});
	
	updateChart();
	
	dfsSlider.on('scroll', function(){
		//console.log(this.x, this.pointX, this.maxScrollX, this.distX, this.directionX, this.isAnimating, this.moved, this.scrollerWidth);
		if(isMovingToTab) return;
		var scrollX = Math.abs(this.x);
		var selectedTabIndex = 0;
		for(var i = 0 ; i < slidePoints.length ; i++) {
			var p1 = slidePoints[i];
			var p2 = (i+1 >= slidePoints.length) ? 99999999 : slidePoints[i+1];
			if(p1 <= scrollX && scrollX < p2) {
				selectedTabIndex = i;
				break;
			}
		}
		if(lastTabIndex != selectedTabIndex) {
			lastTabIndex = selectedTabIndex;
			selectTab(lastTabIndex);
		}
	});
	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
	}
	function selectTab(tabIndex) {
		$('.cmp-dfs-slider .dfs-tab .dfs-tab-head li').find('a').removeClass('on');
		var $a = $('.cmp-dfs-slider .dfs-tab .dfs-tab-head li').eq(tabIndex).find('a').addClass('on');
		//window.setTimeout(function(){$a.trigger('focus');}, 0);
	}
	function updateChart() {
		/* 기온 차트 */
		tchartWidth = slidePoints[slidePoints.length - 1];
		
		var $tchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .tchart').css({ width: tchartWidth + 'px'});
		var tchartId = "my-tchart";
		var $tchart = $('<div>').attr('id', tchartId).css({ width: '100%', height: '100%'}).appendTo($tchartWrap);
		var tempList = [];
		for(var i = 0 ; i < tchartItemCount; i++) {
			tempList.push(getRandomInt(-10, 12));
		}
		var tchart = createTChart(tchartId, tempList);
		/* 중기 최저/최고 기온 차트 */
		midtchartWidth = scrollWidth - ((isModeTable) ? 0 : 55) - slidePoints[slidePoints.length - 1];
		midtchartLeft = tchartWidth + ((isModeTable) ? 0 : 55);
		var $midtchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .midtchart').css({ left: midtchartLeft + 'px',width: midtchartWidth + 'px'});
		var midtchartId = "my-midtchart";
		var $midtchart = $('<div>').attr('id', midtchartId).css({ width: '100%', height: '100%'}).appendTo($midtchartWrap);
		var tmnList = [], tmxList = [];
		for(var i = 0 ; i < 7; i++) {
			tmnList.push(getRandomInt(-10, 5));
			tmxList.push(getRandomInt(10, 19));
		}
		var midtchart = createChart2(midtchartId, tmnList, tmxList);
		/* 차트 모드 */
		if(isModeChart) {
			var chartWidth = tchartWidth;
			/* 강수확률 */
			var $ptychartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .ptychart').css({ width: chartWidth + 'px'});
			$('<div>').attr('id', 'my-ptychart').css({ width: '100%', height: '100%'}).appendTo($ptychartWrap);
			var ptyList = [];
			for(var i = 0 ; i < tchartItemCount; i++) {
				ptyList.push(getRandomInt(0, 100));
			}
			var ptyChart = createChart('my-ptychart', [{data: ptyList, name:'', dataLabel: {overflow:'allow'}}], { 
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
				xAxis: { lineColor: '#39B1E8', lineWidth: 1, minPadding: 0, maxPadding: 0,},
				yAxis: { max: 130 }
			});
			/* 강수량 */
			var $rainchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .rainchart').css({ width: chartWidth + 'px'});
			$('<div>').attr('id', 'my-rainchart').css({ width: '100%', height: '100%'}).appendTo($rainchartWrap);
			var rainList = [];
			for(var i = 0 ; i < tchartItemCount; i++) {
				rainList.push(getRandomInt(0, 50));
			}
			var rainList2 = [];
			for(var i = 0 ; i < tchartItemCount; i++) {
				rainList2.push(getRandomInt(0, 30));
			}
			var rainChart = createChart('my-rainchart', [
					{data: rainList, name:'강수', dataLabels: {overflow: 'allow', formatter: function () { return this.y; }}}, 
					{data: rainList2, name:'적설', color: '#888', dataLabels: {overflow: 'allow', formatter: function () { return this.y; }}, marker: { fillColor: '#888'}}
				], { 
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
				xAxis: { lineColor: '#39B1E8', lineWidth: 1, minPadding: 0, maxPadding: 0 },
				yAxis: { max: 50*1.3 }
			});
			
			/* 풍향 풍속 */
			var $windchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .windchart').css({ width: chartWidth + 'px'});
			$('<div>').attr('id', 'my-windchart').css({ width: '100%', height: '100%'}).appendTo($windchartWrap);
			var windList = [];
			for(var i = 0 ; i < tchartItemCount; i++) {
				windList.push({x:i, y: getRandomInt(0,15), arrow: 'E_b'});
			}
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
					            y: 30
							},	
						}
					], { 
					chart: { 
						type: 'line',
						paddingTop: 20, 
						paddingBottom: 20, 
					},
					plotOptions: {
						series: {
							showInLegend:false,
							animation: false,
						}
					},
					xAxis: { lineColor: '#39B1E8', lineWidth: 1 },
					yAxis: { min: -10, max: 30 }
					
						 
				});
			/* 습도 */
			var $hmchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .hmchart').css({ width: chartWidth + 'px'});
			$('<div>').attr('id', 'my-hmchart').css({ width: '100%', height: '100%'}).appendTo($hmchartWrap);
			var hmList = [];
			for(var i = 0 ; i < tchartItemCount; i++) {
				hmList.push(getRandomInt(40, 100));
			}
			var hmChart = createChart('my-hmchart', [{data: hmList, name:'', dataLabels: { overflow:'allow'}}], { 
					chart: { 
						type: 'column',
						paddingTop: 20, 
						paddingBottom: 20, 
						marginBottom: 2,
					}, 
					plotOptions: {
						series: {
							showInLegend:false,
							animation: false,
						}
					}, 
					xAxis: { lineColor: '#39B1E8', lineWidth: 1, minPadding: 0, maxPadding: 0},
					yAxis: { max: 130 }
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
						formatter: function () { return this.y + '%'; },
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
			credits: { enabled:true },
		};
		if(options) _.merge(chartOptions, options);
		console.log(chartOptions, options);
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
			  line: { 
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
			chart: { backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
			title: { text: null },
			credits: { enabled:true },
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
		var lineColor = "#009AE0", fontColor = "#000000"; 
		var chart = Highcharts.chart(id, {
			plotOptions: {
			  series: {
				pointStart: 1
			  },
			  line: { 
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
					{ name: '', data: tmnList, showInLegend: false, animation:false },
					{ name: '', data: tmxList, showInLegend: false, animation:false }
			],
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
			credits: { enabled:true },
		});	
		return chart;		
	}

	$('.cmp-dfs-slider .dfs-tab .dfs-tab-head').on('click', 'a', function(e) {
		e.preventDefault();
		$(this).parents('.dfs-tab-head').find('a.on').removeClass('on');
		$(this).addClass('on');
		var date = $(this).attr('data-date');
		var $slider = $('.cmp-dfs-slider .slider').first();
		var scrollLeft = 0;
		$slider.find('.daily').each(function(idx, ele) {
			if(date == $(ele).attr('data-date')) {
				return false;
			}
			scrollLeft +=  Math.ceil($(ele).width());
		});
		isMovingToTab = true;
		if(dfsSlider) dfsSlider.scrollTo( -scrollLeft, 0, 500, IScroll.utils.ease.quadratic);
		window.setTimeout(function() { isMovingToTab = false;}, 500);
	});

	$('.cmp-pop-my-points .sym-close').click(function(e) {
		e.preventDefault();
		var $comp = $(this).parents('.cmp-pop-my-points');
		$comp.css({ marginTop: -$comp.height() + 'px' })
			.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ $(this).addClass('closed'); });
	});
	
	
	$('.sym-btn,.cmp-main-wrn .box-con-on, .cmp-fct-summary .more a').click(function(e) {
		e.preventDefault();
	});
	$('.cmp-dfs-slider a[data-layer]').click(function(e) {
		var dataLayer = $(this).attr('data-layer');

		var $panel = $('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']');
		if(!$panel.hasClass('on')) $panel.addClass('on')
		$panel.find('.big-close').unbind('click').bind('click', function(e) {
			e.preventDefault();
			$panel.removeClass('on');
		});
	});
	$('.cmp-dfs-slider').on('click', '.view-options a.sym-btn[data-option]', function(e) {
		$(this).parent().parent().find('a.sym-btn').removeClass('on');
		$(this).addClass('on');
		var optionType = $(this).attr('data-option');
		var optionValue = $(this).attr('data-value');
		if(optionType == 'series') {
			$('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(optionValue);
			window.setTimeout(function() {
				prepareSlider();
				dfsSlider = new IScroll('.dfs-tab-body .slider', { scrollX: true, scrollY: false, mouseWheel: false, scrollbars: false, resizePolling : 40, probeType : 3, interactiveScrollbars: true});
				updateChart();
				}, 100);
		} else {
		
		}
	});
})(jQuery, window, document);