'use strict';
  $('#digital-forecast').on('click','a.pop10-toggle-btn', function(e) {
		  e.preventDefault();
		  if($selectedTab.length > 0) {
		  	var $vf = $('#digital-forecast').find('.vshort-forecast');
		  	$vf.addClass('on');
		  	updateVshortForecast($selectedTab.attr('data-dong-code'), lat, lon);
		  }
	  });
	$('#digital-forecast').on('click','a.cmp-vshort-forecast-close', function(e) {
		  e.preventDefault();
		  var $vf = $('#digital-forecast').find('.vshort-forecast');
		  $vf.removeClass('on');
	  });
  function updateVshortForecast(dongCode, lat, lon) {
		showLoading('vshort-forecast', true, 'light under-pos');
		$.ajax({
			url: appPrefix + 'wnuri-fct2021/main/vshort-forecast.do',
			data: { code: dongCode, unit: wsUnit },
			type: 'get',
			dataType: 'html'
		}).then(
			function(html) {
				$('#vshort-forecast').html(html);
				buildRain10Chart(dongCode, lat, lon);
			},
			function(err) {
				console.log(err);
				showLoading('vshort-forecast', false);
			}
		);
	}
	function buildRain10Chart(dongCode, lat, lon) {
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
			lat: lat,
			lon: lon,
			x: "",
			y: "",
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
	function checkSliderScrollbars() {
		if($('.dfs-daily-slider .iScrollIndicator').is(":hidden")) {
 			$('.dfs-daily-slider .iScrollHorizontalScrollbar').css('opacity', 0);
 			$('.dfs-daily-slider').addClass('no-scrollbars');
 		} else {
 			$('.dfs-daily-slider .iScrollHorizontalScrollbar').css('opacity', 1);
 			$('.dfs-daily-slider').removeClass('no-scrollbars');
 		}
	}
	function createDfsSlider() {
		var isHr1Fct = $('.cmp-dfs-slider').first().hasClass('hr1-fct');
		var dfsSlider = null;
		var dailySlider = null;
		var isMovingToTab = false;
		var obj = '.dfs-tab-body .dfs-slider';
		var $slider = $(obj);
		var $slideWrap = $slider.find('.slide-wrap');
		var scrollWidth = 0;
		var slidePoints = null;
		var tchartWidth = 0;
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
						if(lastTabIndex == 0 || isModeTable) {
							$dailyHeads.eq(lastTabIndex).css({ 'margin-left': 'auto'});							
						} else {
							$dailyHeads.eq(lastTabIndex).css({ 'margin-left': '23px'});
						}
					}
				}
				lastTabIndex = selectedTabIndex;
				if(sliderWidth + scrollX < scrollWidth) {
					selectTab(lastTabIndex);
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
					$('.dfs-daily-slide-wrap > .dfs-daily-slide').first().trigger('click');
					}, 0);
				$('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
				$('.cmp-dfs-slider a.sym-btn[data-view="' + optionValue + '"]').addClass('on');
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
				$('.dfs-daily-slide-wrap > .dfs-daily-slide').first().trigger('click');
				}, 0);
			$('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"]').removeClass('on');
			$('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"][data-value="' + mode + '"]').addClass('on');
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
						if(dailySlider) {
							dailySlider.refresh();
							checkSliderScrollbars();
						}
					},0);
					isMobileSize = false;
				}
			} else {
				if(width <= 1100) {
					window.setTimeout(function() {
						prepareSlider();
						if(dfsSlider) dfsSlider.refresh();
						if(dailySlider) {
							dailySlider.refresh();
							checkSliderScrollbars();
						}
					},0);
					isMobileSize = true;
				}
			}
		});
		
		initDailySlider();

		function initDailySlider() {
			dailySlider = new IScroll('.dfs-daily-slider', { 
				eventPassthrough:false, 
				scrollX: true, 
				scrollY: false, 
				mouseWheel: false, 
				scrollbars: 'custom', 
				probeType : 3, 
				interactiveScrollbars: true,
				click:true,
			});
			$('.cmp-dfs-slider').on('click', '.dfs-daily-slide', function(e) {
				e.preventDefault();
				$(this).parent().find('.dfs-daily-slide').each(function(i,obj) {
					$(obj).find('.dfs-daily-slide-box').removeClass('active').removeAttr('title');
				});
				$(this).find('.dfs-daily-slide-box').addClass('active').attr('title', '선택됨');
				var dailyData = $(this).data();
				if(dailyData.midtermForecast) return;
				if($(this).parents('.hr03-fct').length == 0) {
        			if($(this).next().data().midtermForecast) return;
        		}
				var date = dailyData.date;
				var $slider = $('.cmp-dfs-slider .dfs-slider').first();
				var scrollLeft = 0;
				$slider.find('.daily').each(function(idx, ele) {
					var dd = $(ele).data();
					if(date == dd.date) return false;
					scrollLeft +=  Math.ceil($(ele).width());
				});
				
				if(isHr1Fct) scrollLeft -= 47;
				isMovingToTab = true;
				if(dfsSlider) dfsSlider.scrollTo( -scrollLeft, 0, 500, IScroll.utils.ease.quadratic);
				window.setTimeout(function() { isMovingToTab = false;}, 500);
			 });
			 
			checkSliderScrollbars();
		}
		checkSliderScrollbars();
		$(window).on('resize', function(){ 
			checkSliderScrollbars();
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
				scrollWidth += 78;
				$slideWrap.css('width', scrollWidth + 'px');
			} else {
				$slides.each(function(idx, ele) {
					var slideWidth = Math.ceil($(ele).width());
					slidePoints.push(scrollWidth);
					scrollWidth += slideWidth;
				});
				slidePoints.push(scrollWidth);
				$slideWrap.css('width', scrollWidth + 'px');
			}
			sliderWidth = $slider.width();
//			console.log("isModeTable", isModeTable, "slidePoints", slidePoints, "scrollWidth", scrollWidth);
		}
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
		}
		function selectTab(tabIndex) {
			$('.dfs-daily-slide-wrap .dfs-daily-slide').each(function(i) {
				if(i == tabIndex) {
					$(this).find('.dfs-daily-slide-box').addClass('active').attr('title','선택됨');
				} else {
					$(this).find('.dfs-daily-slide-box').removeClass('active').removeAttr('title');
				}
			});
			if(!$('.dfs-daily-slider').hasClass('no-scrollbars') && dailySlider) {
				var sliderWidth = $('.dfs-daily-slider').width();
				var sliderContentWidth = $('.dfs-daily-slide-wrap').width();
				var scrollLeft = tabIndex *  $('.dfs-daily-slide-wrap > .dfs-daily-slide').first().width();
				if(sliderContentWidth - scrollLeft >= sliderWidth) {
					dailySlider.scrollTo( -scrollLeft, 0, 500, IScroll.utils.ease.quadratic);	
				}
			}
		}
		function updateChart() {
			/* 기온 차트 */
			tchartWidth = slidePoints[slidePoints.length - 1];
			
			var $tchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .tchart').css({ width: tchartWidth + 'px'});
			var tchartId = "my-tchart";
			var $tchart = $('<div>').attr('id', tchartId).css({ width: '100%', height: '100%'}).appendTo($tchartWrap);
			var tempList = JSON.parse($tchartWrap.attr('data-data'));
			var tchart = createTChart(tchartId, tempList[0]);
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
					if(wsList[i] < 0) {
						wsList[i] = null;
						wdList[i] = "empty";
					} else {
						if(maxWs < wsList[i]) maxWs = wsList[i];
						if(minWs > wsList[i]) minWs = wsList[i];
					}
					windList.push({x:i, y: wsList[i], arrow: wdList[i] + '_b'});
				}
				minWs -= (maxWs - minWs) * 0.4; 
				maxWs += (maxWs - minWs) * 0.4;
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
									y: 26
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
		                maxValue = maxValue + (delta * 0.7);
		                minValue = minValue - (delta * 0.7);
		            } else {
		                maxValue = maxValue + (maxValue * 0.7);
		                minValue = minValue - (minValue * 0.7);
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
