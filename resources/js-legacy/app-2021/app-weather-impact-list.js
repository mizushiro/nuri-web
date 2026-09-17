/**
 *  날씨 - 기상특보 - 영향예보 통보문(url: /weather/warning/impact-list)
 */
'use strict';
(function($, window, document){
	var vmap = null;
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		window.location.reload();
	});
	
	$('[data-form-role="submit"]').on('click', function(e) {
		e.preventDefault();
		var $f = $('#' + $(this).attr('data-form-id')).trigger('submit');
	});
	
	$('#select-date').datepicker();
	
	// reportId (폭염 예 : C202008131130, 한파 예 : H202008131130)
	function updateImpact(stn, reportId) {
		if(!stn || !reportId) return;
		var url ="/wnuri-fct2021/weather/impact.do";
		var data = {
			stn: stn,
			reportId: reportId
		};
		$.ajax({
			url: (window.appBase ? window.appBase : "/" ) + url,
			data: data,
			dataType: "html"
		}).then(function(html) {
			$('#impact-holder').html(html);
			
			try {
				var chartHolder = $('#impact-holder').find('#climate_chart');
				createClimateChart(JSON.parse($('#climate_chart').attr('data-data')), "climate_chart", {width: chartHolder.width(), height: chartHolder.height()} );
			} catch(e) {
				console.log(e);
			}
			
			changeTabNo();
			
			var stn = $('#impact-holder').find('select[name="stn"]').val();
			if(stn) $('#impact-holder').find("#moveMid").attr("href","/w/weather/forecast/mid-term.do?stnId1=" + stn);
		});	
		
	}
	function changeTabNo() {
		var url = window.location.href;
		var hash = url.substring(url.indexOf('#'));
		if(hash.startsWith('#tab')) {
			var tabNo = hash.split('=')[1];
			if(tabNo >= 1 && tabNo <= 7) {
				ifs_tab_btn(tabNo);
			}
		}
	}
	function createClimateChart(data, conatiner, options) {
		var chartWidth = options.width;
		var chartHeight = options.height;

		var colorList = [ "#006ee1", "#ff0034", "#d0d0d0" ];
		var M = 1024 * 1024;
		var lineCount = 0;
		function setLineProperties(o) {
			o.data = [];
			o.borderWidth = 2;
			// o.pointBackgroundColor = "#fff";
			o.pointBorderColor = colorList[lineCount % 4];
			o.pointRadius = 3;
			o.type = "line";
			o.fill = false;
			lineCount++;
			return o;
		}
		function setBarProperties(o) {
			o.data = [];
			o.borderWidth = 2;
			o.backgroundColor = colorList[lineCount % 4];
			o.hoverBackgroundColor = colorList[lineCount % 4];
			o.borderColor = colorList[lineCount % 4];
			lineCount++;
			return o;
		}
		var dataSet = new Array();
		dataSet.push(setLineProperties({
			name : '최저기온',
			label : '최저기온',
			yAxisID : 'A',
			backgroundColor : colorList[0],
			borderColor : colorList[0]
		}));
		dataSet.push(setLineProperties({
			name : '최고기온',
			label : '최고기온',
			yAxisID : 'A',
			backgroundColor : colorList[1],
			borderColor : colorList[1]
		}));
		var labels = new Array();
		var min = 99999;
		var max = -99999;
		$.each(data, function(i, item) {
			var tmn = parseFloat(item.tmn);
			var tmx = parseFloat(item.tmx);
			if(tmn < min) min = tmn;
			if(tmx < min) min = tmx;
			if(tmx > max) max = tmx;
			if(tmn > max) max = tmn;
			
			// 최저기온
			dataSet[0].data.push(tmn);
			// 최고기온
			dataSet[1].data.push(tmx);
			labels.push(item.date + item.weekDay);
		});

		function createLineData(dataSet, labels) {
			if (dataSet instanceof Array) {
				return {
					labels : labels,
					datasets : dataSet
				};
			} else {
				var ds = new Array();
				ds.push(dataSet);
				return {
					labels : labels,
					datasets : ds
				};
			}
		}
		function createOptions() {
			return {
				responsive : true,
				maintainAspectRatio : false,
				scales : {
					xAxes : [ {
						display : true,
						type : 'category',
						position : 'bottom',
						gridLines : {
							drawTicks : false,
							display : false,
							zeroLineColor: 'rgba(0,0,0,0)',
							zeroLineWidth: 0,
							drawBorder: false,
						},
						ticks : {
							callback : function(value, index, values) {
								return value;
							},
						},
					} ],
					yAxes : [ {
						name : '기온',
						id : 'A',
						display : true,
						position : 'left',
						gridLines : {
							drawTicks : true,
							tickMarkLength: 26,
							display : true,
							zeroLineColor: 'rgba(0,0,0,0)',
							zeroLineWidth: 0,
							drawBorder: false,
						},
						ticks : {
							callback : function(value) {
								return value;
							},
							padding : 30,
							max: max + 5,
							min: min - 5,
						}
					} ]
				},
				legend : {
					display : true,
					onClick : function(e) {
						e.stopPropagation();
					}
				},
				tooltips : {
					enabled : false,
					callbacks : {
						title : function(tooltipItems, data) {
							return tooltipItems[0].xLabel;
						},
						label : function(tooltipItem, data) {
							var value = tooltipItem.yLabel;
							if (tooltipItem.datasetIndex == 0) {
								return "최저기온: " + value + "℃";
							} else if (tooltipItem.datasetIndex == 1) {
								return "최고기온: " + value + "℃";
							} else {
								return value;
							}
						}
					}
				},
				showTooltips : true,
				hover : {
					animationDuration: 0,
				},
				animation : {
					onComplete: function() {
						var chartInstance = this.chart,
							ctx = chartInstance.ctx;
						ctx.font = Chart.helpers.fontString(
							13, 
							Chart.defaults.global.defaultFontStyle,
							Chart.defaults.global.defaultFontFamily
						);
						ctx.textAlign = "center";
						ctx.textBaseline = "bottom";
						
						$.each(this.data.datasets, function(i, dataset) {
							var meta = chartInstance.controller.getDatasetMeta(i);
							$.each(meta.data, function(index, item) {
								var data = dataset.data[index];
								ctx.fillStyle = colorList[i % 3];
								ctx.fillText(data + "℃", item._model.x, item._model.y - 4);
							});
						});
					}
				}
			};
		}
		function createChart(id, dataSet, labels, width, height, min, max) {
			var ctx = document.getElementById(id).getContext("2d");
			ctx.canvas.height = height | 100;
			ctx.canvas.width = width | 300;
			var dataArray = createLineData(dataSet, labels);
			return new Chart(ctx, {
				type : 'line',
				data : dataArray,
				options : createOptions()
			});
		}
		var climateChart = createChart(conatiner, dataSet, labels, chartWidth, chartHeight);
	}
	updateImpact($('#select-area').val(), $('#select-list').val());
})(jQuery, window, document);
