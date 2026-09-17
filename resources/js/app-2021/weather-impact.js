/**
 * panel - /weather/warning/impact
 *
 * 영향예보
 */
'use strict';
(function($, window, document){
	var VER="20201012",
	WeatherImpact = function(wrapperId, opts) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		var self = this;
		self.id = wrapperId;
		self.state = {};
		self.config =  Object.assign({}, opts || {});
		if(self.config.type != "location" || self.config.dongCode){
			self.updateData();
		}
		self.addEventHandler();
	};
	WeatherImpact.prototype = {
		refresh: function(dongCode) {
			var self = this;
			if(dongCode) {
				self.config.dongCode = dongCode;
			}
			self.updateData();
		},
		updateData: function() {
			var self = this;
			self.requestRemote()
			.then(
				function(data) {
					self.updateView(data)
				},
				self.error()
			)	
		},
		getData: function() {
			var self = this;
			var pathPrefix = this.getPathPrefix();
			var $wrapper = $('#' + self.id);
			var stn = $wrapper.find('select[name="stn"]').val();
			var data = {
				stn: stn,
				dongCode: self.config.dongCode
			};
			var url = "wnuri-fct2021/weather/impact.do";
			if(self.config.type == "location") {
				url ="wnuri-fct2021/weather/ifs.do";
				data.code = self.config.dongCode;
				data.caller = "impact";
			}
			return $.ajax({
				url: pathPrefix + url,
				data: data,
				dataType: "html"
			});

		},
		getPathPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		requestRemote: function(code, unit) {
			var self = this;
			return self.getData(code, unit);	
		},
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			//$wrapper.html(html);
			$wrapper.find('.ifs_cont').html(html);
			
			// display midterm temp graph
			try {
				self.showMidtermGraph(JSON.parse($wrapper.find('#climate_chart').attr('data-data')));
			} catch(e) {
				//console.log(e);
			}
			
			self.changeTabNo();
			
			var stn = $wrapper.find('select[name="stn"]').val();
			if(typeof stn_id != 'undefined') $wrapper.find("#moveMid").attr("href","/w/weather/forecast/mid-term.do?stnId1=" + stn_id);
		},
		showMidtermGraph: function(data) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var chartHolder = $wrapper.find('#climate_chart');
			createClimateChart(data, "climate_chart", {width: chartHolder.width(), height: chartHolder.height()} );
		},
		changeTabNo: function(html) {
			var url = window.location.href;
			var hash = url.substring(url.indexOf('#'));
			if(hash.startsWith('#tab')) {
				var tabNo = hash.split('=')[1];
				if(tabNo >= 1 && tabNo <= 7) {
					ifs_tab_btn(tabNo);
				}
			}
		},
		getColdwaveExists: function() {
			var pathPrefix = this.getPathPrefix();
			var data = {
				
			};
			
			return $.ajax({
				url: pathPrefix + "wnuri-fct/rest/weather/coldwave-exists.do",
				data: data,
				dataType: "json"
			});
		},
		getHeatwaveExists: function() {
			var pathPrefix = this.getPathPrefix();
			var data = {
				
			};
			
			return $.ajax({
				url: pathPrefix + "wnuri-fct/rest/weather/heatwave-exists.do",
				data: data,
				dataType: "json"
			});
		},
		error: function() {
			var self = this;
			return function(request, status, error) {
				// console.log("code:" + request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				if(console) console.log(request, status);
				showLoading(self.id, false);
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			
			$wrapper.find('button[data-role="data-select"]').on('click', function(e) {
				self.updateData();
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.WeatherImpact = WeatherImpact;
	else window.WeatherImpact = WeatherImpact;
})(jQuery, window, document);

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