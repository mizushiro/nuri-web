/**
 * 해상기상부이(API)
 */
'use strict';
(function($, window, document){
	var VER="0.1", 
	SeaBuoy = function(wrapperId) {
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
		self.state = {
				data: { type: 't99', reg: '100'}
		};
		self.appConfigKey = "W_AC";
		self.readConfig();
		self.updateData();
		self.addEventHandler();
	};
	var serializeObject = function(frm) {
		var result = {};
		var extend = function(i, element) {
			var node = result[element.name];
			if ("undefined" !== typeof node && node !== null) {
				if($.isArray(node)) {
					node.push(element.value);
				} else {
					result[element.name] = [node, element.value];
				}
			} else {
				result[element.name] = element.value;
			}
		}
		$.each($(frm).serializeArray(), extend);
		return result;
	}
	SeaBuoy.prototype = {
		readConfig: function() {
			var self = this;
			var loadedAppConfig = store.get(self.appConfigKey);
			if(loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
		},
		refresh: function(bookmark) {
			var self = this;
			self.readConfig();
			self.updateData();
		},
		updateData: function() {
			var self = this;
			showLoading("sea-buoy-data-holder", true, "light");

			self.getBuoy()
				.then(
					function(data) {
						self.updateBuoyList(data);
					},
					self.error()
				);
		},
		updateDataInputTm: function(tm, stn, ocean) {
			var self = this;
			showLoading("sea-buoy-data-holder", true, "light");

			self.getBuoyTm(tm, stn, ocean)
				.then(
					function(data) {
						self.updateBuoyList(data);
					},
					self.error()
				);
		},
		moveTm: function(dtm) {
			var self = this;
			self.getData(parseInt(dtm))
			.then(
				function(data) {
					self.updateBuoyList(data);
					self.updateView(data);
				},
				self.error()
			)	
		},
		getData: function(dtm) {
			var self = this;
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find('form')[0]);
			data.unit = unit;
			if(dtm === 0) {
				data.tm = "";
			} 
			data.dtm = dtm;
			
			return self.requestBuoyData(data);
		},
		getBuoy: function() {
			var self = this;
			var data={};
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			data.unit = unit;
			return self.requestBuoyData(data);
		},
		getBuoyTm: function(tm, stn, ocean) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find('form')[0]);
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			data.tm = tm;
			data.stn = stn;
			data.unit = unit;
			data.ocean = ocean;
			return self.requestBuoyData(data);
		},
		requestBuoyData: function(data) {
			var self = this;
			var prefix = self.getPrefix();
			return $.ajax({
				url: prefix + "observation/sea/buoy-obs-data.do",
				data: data,
				dataType: "json"
			});
		},
		getPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		updateView: function(data) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var tm = data.tm;
			$wrapper.find('input[name="tm"]').val(moment(tm,'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
		},
		updateBuoyList: function(data) {
			var self = this;
			var $wrapper = $('#' + self.id);
			self.appConfigKey = "W_AC";
			var loadedAppConfig = store.get(self.appConfigKey);
			if (loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
			// TEMP: for debugging
			if(data.isSuccess) {
				if (data.stn == 0) {
					var template = '<p class="ann-txt" data-role="tm" data-tm="' + data.tm + '">' + data.resultTm + '</p>' + $('#buoy-all-template').html();
					var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws : "km/h";
					var tableHtml = Mustache.render(template, { unit: unit });

					var $table = $(tableHtml);
					var rows = data.data;
					var bodyHtml = "";
					for (var i = 0; i < rows.length; i++) {
						var rowHtml = "<tr>";
						var cols = rows[i];
						if (cols.length == 15) {
							rowHtml += '<td rowspan=' + rows.length + '>' + cols[0].replace('일', '일<br/>').replace('시', '시<br/>') + '</td>\n';
							for (var k = 1; k < cols.length; k++) {
								rowHtml += '<td>' + cols[k] + '</td>\n';
							}
						} else {
							for (var k = 0; k < cols.length; k++) {
								rowHtml += '<td>' + cols[k] + '</td>\n';
							}
						}
						rowHtml += "</tr>";
						bodyHtml += rowHtml;
					}
					$table.find('tbody').html(bodyHtml);
					$('#sea-buoy-data-holder').html($table);
					var tm = $('#sea-buoy-data-holder').find('p[data-role="tm"]').attr('data-tm');
					$('input[name="tm"]').val(moment(tm, 'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
					$wrapper.find('.buoy-chart-wrapper').hide();
					$wrapper.find('.buoy-chart-wrapper .buoy-chart').empty();
				} else {
					var template = '<p class="ann-txt" data-role="tm" data-tm="' + data.tm + '">' + data.resultTm + '</p>' + $('#buoy-stn-template').html();
					var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws : "km/h";
					var tableHtml = Mustache.render(template, { unit: unit });
					var $table = $(tableHtml);
					var rows = data.data;
					var bodyHtml = "";
					for (var i = 0; i < rows.length; i++) {
						var rowHtml = "<tr>";
						var cols = rows[i];
						for (var k = 0; k < cols.length; k++) {
							rowHtml += '<td rowspan="1">' + cols[k] + '</td>\n';
						}
						rowHtml += "</tr>";
						bodyHtml += rowHtml;
					}
					$table.find('tbody').html(bodyHtml);

					$('#sea-buoy-data-holder').html($table);
					var tm = $('#sea-buoy-data-holder').find('p[data-role="tm"]').attr('data-tm');
					$('input[name="tm"]').val(moment(tm, 'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
					$wrapper.find('.buoy-chart-wrapper').show();
					self.updateBuoyChart(data);
				}
			}
			else {
				var bodyHtml = "";
				bodyHtml += "<div class='box-summary normal-box'>";
				bodyHtml += "<div class='text-box guide-box'>";
				bodyHtml += "<ul class='txt'>";
				bodyHtml += "<li>해양기상관측 자료제공이 원활하지 않습니다.<br>이용에 불편을 드려 죄송합니다.</li>";
				bodyHtml += "<li><a href='/w/observation/sea/buoy.do' class='cmp-blue-btn' target='_blank' title='새창열림'>";
				bodyHtml += "부이 관측자료 제공<br>임시페이지 바로가기</a></li>";
				bodyHtml += "</ul></div></div>";
				$('#sea-buoy-data-holder').html(bodyHtml);
			}
			
			
		},
		updateBuoyChart: function(data) {
			var self = this;
			var rows = data.data;
			var tm = data.tm;
			var airTempData =  _. map(rows, function(item) { 
					var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
					return { x: dt.getTime(), y: parseFloat(item[6]), date: dt }; 
				});
			var waterTempData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[7]), date: dt }; 
			});
			var paData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[4]), date: dt }; 
			});
			var hmData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[5]), date: dt }; 
			});
			var windData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[2]), date: dt, wd: item[1] }; 
			});
			var gustData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[3]), date: dt }; 
			});
			var maxWaveData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[8]), date: dt }; 
			});
			var waveData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[9]), date: dt }; 
			});
			var wpData =  _. map(rows, function(item) { 
				var dt = moment(tm.substring(0,8) + item[0],'YYYY.MM.DD[일]HH[시]mm[분]').toDate();  
				return { x: dt.getTime(), y: parseFloat(item[11]), date: dt }; 
			});
			self.tempChart = self.createTempChart('temp-chart', airTempData, waterTempData);
			self.paHmChart = self.createPaHmChart('pa-hm-chart', paData, hmData);
			self.windChart = self.createWindChart('wind-chart', windData, gustData);
			self.waveChart = self.createWaveChart('wave-chart', maxWaveData, waveData, wpData);
		},
		createTempChart: function(chartId, airTempData, waterTempData) {
			var chart = Highcharts.chart(chartId, {
				title: '',
				chart: { type: 'spline', backgroundColor: "rgba(0,0,0,0)", style: { fontFamily: "'ns', sans-serif" } },
				credits: { enabled:false },
				plotOptions: {
					series: {
						pointStart: 1
					},
					spline: { 
						dataLabels: {
							enabled: true, 
							style: { fontSize: '12px', fontWeight: 'normal', },
							formatter: function () { return this.y; }
						},	
						enableMouseTracking: true
					}
				},
				series: [
				{
					name: '기온',
					dataLabels: {
						style: { color: '#C80000', },
						enabled: true,
					},
					color: '#C80000',
					data: airTempData,
					marker:{fillColor:'#C80000',radius:4, lineWidth: 1,lineColor:'#C80000', symbol: 'circle', enabled:false},
				},
				{
					name: '수온',
					dataLabels: {
						style: { color: '#006CFF', },
						enabled: true,
					},	
					color: '#006CFF',
					data: waterTempData,			   
					marker: {fillColor:'#006CFF',radius:4, lineWidth: 1,lineColor:'#006CFF', symbol: 'square', enabled:false},
				},],
				yAxis: {
					title: { text: '온도(℃)' },
					labels: { formatter: function () { return this.value + '℃'; } }
				},
				xAxis: {
					type: 'datetime',
					tickInterval: 1000 * 60 * 60,
					labels: { formatter: function () { return moment(this.value).format('D[일]H[시]'); } }
				},
			});
			return chart;
		},
		createPaHmChart: function(chartId, paData, hmData) {
			var minValue = 9999;
			var maxValue = -9999;
			for(var i = 0 ; i < paData.length ; i++) {
				var paValue = paData[i].y;
				if(paValue > maxValue) maxValue = paValue;
				if(paValue < minValue) minValue = paValue;
			}
			var yMin = Math.floor(minValue/10)*10 - 10;
			var yMax = Math.floor(maxValue/10)*10 + 10;
			var chart = Highcharts.chart(chartId, {
				title: '',
				chart: { type: 'spline', backgroundColor: "rgba(0,0,0,0)", style: { fontFamily: "'ns', sans-serif" } },
				credits: { enabled:false },
				plotOptions: {
					series: {
						pointStart: 1
					},
					spline: { 
						dataLabels: {
							enabled: true, 
							style: { fontSize: '12px', fontWeight: 'normal', },
						},	
						enableMouseTracking: true
					}
				},
				series: [
				{
					name: '기압',
					dataLabels: {
						style: { color: '#FF00FF', },
						enabled: true,
						formatter: function () { return this.y; },
					},
					color: '#FF00FF',
					data: paData,
					marker:{fillColor:'#FF00FF',radius:4, lineWidth: 1,lineColor:'#FF00FF', symbol: 'circle', enabled:false},
				},
				{
					name: '습도',
					dataLabels: {
						style: { color: '#FF8000', },
						enabled: true,
						formatter: function () { return this.y; },
					},	
					color: '#FF8000',
					data: hmData,			   
					marker: {fillColor:'#FF8000',radius:4, lineWidth: 1,lineColor:'#FF8000', symbol: 'square', enabled:false},
					yAxis: 1,
				},],
				yAxis: [{
						title: { text: '기압(hPa)' },
						labels: { formatter: function () { return this.value + 'hPa'; } },
						min: yMin, max: yMax,
						startOnTick: false,
					}, {
						title: { text: '습도(%)' },
						labels: { formatter: function () { return this.value + '%'; } },
						opposite: true,
						min: 0, max: 100,
					},
				],
				xAxis: {
					type: 'datetime',
					tickInterval: 1000 * 60 * 60,
					labels: { formatter: function () { return moment(this.value).format('D[일]H[시]'); } }
				},
			});
			return chart;
		},
		createWindChart: function(chartId, windData, gustData) {
			var chart = Highcharts.chart(chartId, {
				title: '',
				chart: { type: 'spline', backgroundColor: "rgba(0,0,0,0)", style: { fontFamily: "'ns', sans-serif" } },
				credits: { enabled:false },
				plotOptions: {
					series: {
						pointStart: 1
					},
					spline: { 
						dataLabels: {
							enabled: true, 
							style: { fontSize: '12px', fontWeight: 'normal', },
						},	
						enableMouseTracking: true
					}
				},
				series: [
				{
					name: '풍속',
					dataLabels: {
						style: { color: '#006400', },
						enabled: true,
						formatter: function () { return this.y; },
					},
					color: '#006400',
					data: windData,
					marker:{fillColor:'#006400',radius:4, lineWidth: 1,lineColor:'#006400', symbol: 'circle', enabled:false},
					xAxis:1
				},
				{
					name: '순간풍속',
					dataLabels: {
						style: { color: '#FF0000', },
						enabled: true,
						formatter: function () { return this.y; },
					},	
					color: '#FF0000',
					data: gustData,			   
					marker: {fillColor:'#FF0000',radius:4, lineWidth: 1,lineColor:'#FF0000', symbol: 'square', enabled:false}
				},],
				yAxis: [
					{
						title: { text: '풍속(m/s)' },
						labels: { formatter: function () { return this.value + 'm/s'; } },
					},
				],
				xAxis: [
					{
						type: 'datetime',
						tickInterval: 1000 * 60 * 60,
						labels: { formatter: function () { return moment(this.value).format('D[일]H[시]'); } }
					},{
						type: 'datetime',
						tickInterval: 1000 * 60 * 30,
						labels: { 
							formatter: function () { 
								try {
									var val = this.value;
									var valIndex = _.findIndex(this.chart.series[0].xData, function(o){ return o == val; });
									var dt = windData[valIndex];
									return dt.wd;
								}catch(e) {
									return '';
								}
							} 
						},
						opposite: true,
					}
				],
			});
			return chart;
		},
		createWaveChart: function(chartId, maxWaveData, waveData, wpData) {
			var minValue = 9999;
			var maxValue = -9999;
			for(var i = 0 ; i < maxWaveData.length ; i++) {
				var val = maxWaveData[i].y;
				if(val > maxValue) maxValue = val;
				if(val < minValue) minValue = val;
			}
			for(var i = 0 ; i < waveData.length ; i++) {
				var val = waveData[i].y;
				if(val > maxValue) maxValue = val;
				if(val < minValue) minValue = val;
			}
			var yMax = 10;
			var yMin = 0;
			if(maxValue >= 10) {
				yMax = maxValue + 1;
			} else if(maxValue >= 5) {
				yMax = 10;
			} else if(maxValue >= 3) {
				yMax = 7;
			} else {
				yMax = 5;
			}
			
			var minValue2 = 9999;
			var maxValue2 = -9999;
			for(var i = 0 ; i < wpData.length ; i++) {
				var val = wpData[i].y;
				if(val > maxValue2) maxValue2 = val;
				if(val < minValue2) minValue2 = val;
			}
			var yMax2 = 15;
			var yMin2 = 0;
			yMax2 = Math.floor(maxValue2 + 2);
			var chart = Highcharts.chart(chartId, {
				title: '',
				chart: { type: 'spline', backgroundColor: "rgba(0,0,0,0)", style: { fontFamily: "'ns', sans-serif" } },
				credits: { enabled:false },
				plotOptions: {
					series: {
						pointStart: 1
					},
					spline: { 
						dataLabels: {
							enabled: true, 
							style: { fontSize: '12px', fontWeight: 'normal', },
						},	
						enableMouseTracking: true
					}
				},
				series: [
					{
						name: '최대파고',
						dataLabels: {
							style: { color: '#000080', },
							enabled: true,
							formatter: function () { return this.y; },
						},
						color: '#000080',
						data: maxWaveData,
						marker:{fillColor:'#000080',radius:4, lineWidth: 1,lineColor:'#000080', symbol: 'circle', enabled:false},
					},
					{
						name: '유의파고',
						dataLabels: {
							style: { color: '#008FFF', },
							enabled: true,
							formatter: function () { return this.y; },
						},
						color: '#008FFF',
						data: waveData,
						marker:{fillColor:'#008FFF',radius:4, lineWidth: 1,lineColor:'#008FFF', symbol: 'circle', enabled:false},
					},
					{
						name: '파주기',
						dataLabels: {
							style: { color: '#BA71FF', },
							enabled: true,
							formatter: function () { return this.y; },
						},	
						color: '#BA71FF',
						data: wpData,			   
						marker: {fillColor:'#BA71FF',radius:4, lineWidth: 1,lineColor:'#BA71FF', symbol: 'square', enabled:false},
						yAxis:1
					},
				],
				yAxis: [
					{
						title: { text: '파고(m)' },
						labels: { formatter: function () { return this.value + 'm'; } },
						min:yMin, max:yMax,
						startOnTick: false,
					},
					{
						title: { text: '파주기(sec)' },
						labels: { formatter: function () { return this.value + 'sec'; } },
						opposite: true,
						min:yMin2, max:yMax2,
					},
				],
				xAxis: {
					type: 'datetime',
					tickInterval: 1000 * 60 * 60,
					labels: { formatter: function () { return moment(this.value).format('D[일]H[시]'); } }
				},
			});
			return chart;
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading("sea-buoy-map", false, "light");
				showLoading("sea-buoy-data-holder", false, "light");
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			$wrapper.on('change', 'select[name="stn"]', function(e) {
				//self.updateData();
			});
			$wrapper.on('click', 'button[data-role="select-ocean"]', function(e) {
				var wrapper = document.querySelector('#stn-select');
				var stnSelectBase = document.querySelector('#data-stn-base');
				var stnSelect = stnSelectBase.cloneNode(true);

				stnSelect.name = 'stn';
				stnSelect.id = 'data-stn';
				stnSelect.classList.remove('hidden');
				stnSelect.querySelectorAll('option').forEach((el) => {
					if (el.value != '0' && el.dataset.ocean != $('select[name="ocean"]').val()) {
						stnSelect.removeChild(el);
					}
				})
				wrapper.innerHTML = '';
				wrapper.appendChild(stnSelect);
			});
			$wrapper.on('click', 'button[data-role="select-stn"], button[data-role="select-ocean"]', function(e) {
				var tm = $('input[name="tm"]').val();
				var stn = $('select[name="stn"]').val();
				var ocean = $('select[name="ocean"]').val();
				self.updateDataInputTm(tm, stn, ocean);
			});
			$wrapper.on('change', 'select[name="type"]', function(e) {
				//self.updateData();
			});
			$wrapper.on('click', 'button[data-role="select-type"]', function(e) {
				self.updateData();
			});

			$wrapper.on('click', 'button[data-role="move"]', function(e) {
				var dtm = $(this).attr('data-minutes');
				self.moveTm(dtm);
			});
			$wrapper.on('keypress', 'input[name="tm"]', function(e) {
				if (e.keyCode == 13) {
					self.updateData();
				}
			});
		}
	};

	if (typeof exports !== 'undefined') exports.SeaBuoy = SeaBuoy;
	else window.SeaBuoy = SeaBuoy;
})(jQuery, window, document);
