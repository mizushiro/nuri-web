/**
 * 파고부이 지점별 자료
 */
'use strict';
(function($, window, document){
	var VER="0.1", 
	SeaBuoyCosmos = function(wrapperId) {
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
	SeaBuoyCosmos.prototype = {
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
			showLoading(self.id, true, "light");
			self.getData()
			.then(
				function(html) {
					self.updateView(html);
					showLoading(self.id, false, "light");
				},
				self.error()
			)	
		},
		moveTm: function(dtm) {
			var self = this;
			showLoading(self.id, true, "light");
			self.getData(parseInt(dtm))
			.then(
				function(html) {
					self.updateView(html);
					showLoading(self.id, false, "light");
				},
				self.error()
			)	
		},
		getData: function(dtm) {
			var self = this;
			var prefix = self.getPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find('form')[0]);
			data.unit = unit;
			if(dtm === 0) {
				data.tm = "";
			} 
			data.dtm = dtm;
			
			return $.ajax({
				url: prefix + "wnuri-sfct/current/buoy-cosmos.do",
				data: data,
				dataType: "html"
			});
		},
		getPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var $holder = $wrapper.find('div[data-role="data-holder"]');
			$holder.html(html);
			var tm = $wrapper.find('p[data-role="tm"]').attr('data-tm');
			$wrapper.find('input[name="tm"]').val(moment(tm,'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
			
			if($holder.find("[data-stn]").first().attr('data-stn') != '0') {
				$('.buoy-chart-wrapper').show();
				var data = JSON.parse($holder.find("[data-json]").first().attr('data-json'));
				self.updateBuoyCosmosChart(data);
			} else {
				$('.buoy-chart-wrapper').hide();
			}
		},
		updateBuoyCosmosChart: function(rows) {
			var self = this;
			console.log(rows);
			var waterTempData =  _. map(rows, function(item) { 
				var dt = moment(item.data_tm,'YYYYMMDDHH').toDate();  
				return { x: dt.getTime(), y: parseFloat(item.tw), date: dt }; 
			});
			var maxWaveData =  _. map(rows, function(item) { 
				var dt = moment(item.data_tm,'YYYYMMDDHH').toDate();  
				return { x: dt.getTime(), y: parseFloat(item.wh_max), date: dt }; 
			});
			var sigWaveData =  _. map(rows, function(item) { 
				var dt = moment(item.data_tm,'YYYYMMDDHH').toDate();  
				return { x: dt.getTime(), y: parseFloat(item.wh_sig), date: dt }; 
			});
			var avgWaveData =  _. map(rows, function(item) { 
				var dt = moment(item.data_tm,'YYYYMMDDHH').toDate();  
				return { x: dt.getTime(), y: parseFloat(item.wh_avg), date: dt }; 
			});
			var wpData =  _. map(rows, function(item) { 
				var dt = moment(item.data_tm,'YYYYMMDDHH').toDate();  
				return { x: dt.getTime(), y: parseFloat(item.wp), date: dt }; 
			});
			self.tempChart = self.createTempChart('temp-chart', waterTempData);
			self.waveChart = self.createWaveChart('wave-chart', maxWaveData, sigWaveData, wpData);
		},
		createTempChart: function(chartId, waterTempData) {
			console.log('createTempChart', waterTempData);
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
		createWaveChart: function(chartId, maxWaveData, sigWaveData, wpData) {
			console.log('createWaveChart', maxWaveData, sigWaveData, wpData);
			var minValue = 9999;
			var maxValue = -9999;
			for(var i = 0 ; i < maxWaveData.length ; i++) {
				var val = maxWaveData[i].y;
				if(val > maxValue) maxValue = val;
				if(val < minValue) minValue = val;
			}
			for(var i = 0 ; i < sigWaveData.length ; i++) {
				var val = sigWaveData[i].y;
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
						data: sigWaveData,
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
				showLoading(self.id, false, "light");
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			$wrapper.on('change', 'select[name="stn"]', function(e) {
				//self.updateData();
			});
			$wrapper.on('click', 'button[data-role="select-stn"]', function(e) {
				self.updateData();
			});

			$wrapper.on('click', 'button[data-role="move"]', function(e) {
				var dtm = $(this).attr('data-hours');
				self.moveTm(dtm);
			});
			$wrapper.on('keypress', 'input[name="tm"]', function(e) {
				if (e.keyCode == 13) {
					self.updateData();
		        }
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.SeaBuoyCosmos = SeaBuoyCosmos;
	else window.SeaBuoyCosmos = SeaBuoyCosmos;
})(jQuery, window, document);