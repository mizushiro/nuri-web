/**
 * 세계날씨 /theme/world-weather.do
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	var clockTimer;
	function initClock() {
		var me = this;
		moment.locale('ko',{
				weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
				weekdaysShort: ["일","월","화","수","목","금","토"]
		});
		showCurrentTime();
		clockTimer = window.setInterval(function() {
			showCurrentTime();
		}, 1000);
	}
	function showCurrentTime() {
		var timeZoneOffset = $('#lcoal-time-zone').attr('data-time-zone');
		if(timeZoneOffset) {
			var now  = moment();
			now.locale('ko-KR');
			now = now.utcOffset(timeZoneOffset);
			$('.cmp-world-weather .cityweather-current-date').html(now.format('YYYY-MM-DD(ddd)'));
			$('.cmp-world-weather .cityweather-current-time').html(now.format('[<ul class="clearfix"><li>]hh[</li><li>:</li><li>]mm[</li><li>:</li><li>]ss[</li><li><span>]A[</span></li></ul>]'));
		} else {
			var now = moment();
			now.locale('ko-KR');
			$('.cmp-world-weather .cityweather-current-date').html(now.format('YYYY-MM-DD(ddd) [GMT]Z'));
			$('.cmp-world-weather .cityweather-current-time').html(now.format('[<ul class="clearfix"><li>]hh[</li><li>:</li><li>]mm[</li><li>:</li><li>]ss[</li><li><span>]A[</span></li></ul>]'));				
		}
	};
	
	initClock();
	
	var climateData = JSON.parse($("[data-climate]").first().attr('data-climate'));
	var chartHolder = $('#climate_chart');
	createClimateChart(climateData, "climate_chart", {width: chartHolder.width(), height: chartHolder.height()} );
	$('.chartjs-hidden-iframe').attr('title','내용없음');
	function createClimateChart(data, conatiner, options) {
		// [{ month: "1", meanTemp: "", minTemp: "", maxTemp: "", rainfall: "", raindays: "" }, ... ]
		var chartWidth = options.width;
		var chartHeight = options.height;		
	
		var colorList = ["#006ee1", "#ff0034", "#d0d0d0"];
		var M = 1024*1024;
		var lineCount = 0;
		function setLineProperties(o) {
			o.data = [];
			o.borderWidth = 2;
			//o.pointBackgroundColor = "#fff";
			o.pointBorderColor = colorList[lineCount%4];
			o.pointRadius = 3;
			o.type="line";
			o.fill = false;
			lineCount++;
			return o;
	  	}
		function setBarProperties(o) {
			o.data = [];
			o.borderWidth = 2;
			o.backgroundColor = colorList[lineCount%4];
			o.hoverBackgroundColor = colorList[lineCount%4];
			o.borderColor = colorList[lineCount%4];
			lineCount++;
			return o;
	  	}
	   	var climateDataSet = new Array();
	   
		//climateDataSet.push(setLineProperties({name:'평균기온', label:'평균기온', yAxisID:'A', backgroundColor:colorList[0],borderColor:colorList[0]}));
		climateDataSet.push(setLineProperties({name:'최저기온', label:'최저기온', yAxisID:'A', backgroundColor:colorList[0],borderColor:colorList[0]}));
		climateDataSet.push(setLineProperties({name:'최고기온', label:'최고기온', yAxisID:'A', backgroundColor:colorList[1],borderColor:colorList[1]}));
	   	climateDataSet.push(setBarProperties({name:'강수량', label:'강수량', yAxisID:'B'}));
	   
	   
		$.each(data, function (i, item) {
			// 평균기온
			//climateDataSet[0].data.push(parseFloat(item.meanTemp));
			// 최저기온
			climateDataSet[0].data.push(parseFloat(item.minTemp));
			// 최고기온
			climateDataSet[1].data.push(parseFloat(item.maxTemp));
			// 강수량
			climateDataSet[2].data.push(parseFloat(item.rainfall));
		});

		function createLineData(dataSet) {
			if(dataSet instanceof Array) {
				return {
					labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
					datasets: dataSet	
				};
			} else {
				var ds = new Array();
				ds.push(dataSet);
				return {
					labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
					datasets: ds	
				};	
			}
		}
		function createOptions() {
			return {
				responsive: true,
				maintainAspectRatio: false, 
				scales: {
						xAxes: [{
							display: true,
							type: 'category',
							position: 'bottom',
						gridLines: {
							drawTicks:false,
							display:false,
						},
							ticks: {
								callback: function(value, index, values) {
									return value;
								},
							stepSize:1,								
							min: 1,
							max: 12
							},
						barPercentage: 0.5
						}],
						yAxes:[{
							name: '기온',
							id: 'A',
							display: true,

							position: 'left',
						gridLines: {
							drawTicks:false,
						},
						ticks: {
								callback: function(value){
									return value;	
								},
							padding: 10
							},
						scaleLabel: {
							display: true,
							labelString: "기온(℃)"
						}
					},
					{
							name: '강수량',
							id: 'B',
							display: true,
							
							position: 'right',
						gridLines: {
							drawTicks:false,
							display:false,
						},
						ticks: {
								callback: function(value){
									return value;	
								},
							padding: 5,
							min:0,
							},
						scaleLabel: {
							display: true,
							labelString: "강수량(mm)"
						}
					}]
					},
					legend: {
						display: true,
						onClick: function(e) { e.stopPropagation();}
					},
					tooltips: {
						enabled: true,
						callbacks: {
							title: function(tooltipItems, data) {
							return tooltipItems[0].xLabel;
							},
							label: function(tooltipItem, data) {
								var value = tooltipItem.yLabel;
								/* if(tooltipItem.datasetIndex == 0) {
									return "평균기온: " + value + "℃";
								} else */if(tooltipItem.datasetIndex == 0) {
									return "최저기온: " + value + "℃";
								} else if(tooltipItem.datasetIndex == 1) {
									return "최고기온: " + value + "℃";
								} else if(tooltipItem.datasetIndex == 2) {
									return "강수량: " + value + "mm";
								} else {
								return value;
							}
							}
						},
						style: {
							zIndex: 100
						}
					},
					showTooltips: true, 
					hover: true,
				animation: false
				
			};
		}
		function createChart(id, dataSet, width, height, min, max) {
			var ctx = document.getElementById(id).getContext("2d");
			ctx.canvas.height= height | 100;
			ctx.canvas.width= width | 300;
			var dataArray = createLineData(dataSet);
			return new Chart(ctx, {type: 'bar', data: dataArray, options:createOptions()});	
		}
		var climateChart = createChart(conatiner, climateDataSet, chartWidth, chartHeight);
	}
})(jQuery, window, document);
