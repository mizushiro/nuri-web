/**
 * 해구별 예측정보 
 */
'use strict';
(function($, window, document){
	var DEFAULT_UNIT_WS = "km/h",
	MarineZoneForecast = function(wrapperId) {
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
		
		self.forecastType = $('#' + wrapperId).attr("data-forecast-type");
		self.state = {
				
		};
		self.appConfigKey = "W_AC";
		self.config = {
			bookmarks: [],
			recent: []
		};
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
	};
	MarineZoneForecast.prototype = {
		readConfig: function() {
			var self = this;
			var loadedAppConfig = store.get(self.appConfigKey);
			if(loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
		},
		refresh: function() {
			var self = this;
			self.readConfig();
			
			self.refreshData();
		},
		updateData: function() {
			var self = this;
			showLoading(self.id, true, "light");
			self.requestRemote()
			.then(
				function(data) {
					self.updateView(data);
					showLoading(self.id, false, "light");
				},
				function(e) {
					alert("데이터가 존재하지 않습니다.");
				}
			)	
		},
		refreshData: function(dtm) {
			var self = this;
			showLoading(self.id, true, "light");
			self.reloadData(dtm)
			.then(
				function(data) {
					self.updateView(data);
					showLoading(self.id, false, "light");
				},
				function(e) {
					alert("데이터가 존재하지 않습니다.");
				}
			)	
		},
		reloadData: function(dtm) {
			var self = this;
			var prefix = self.getPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:DEFAULT_UNIT_WS;
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find("form")[0]);
			data.unit = unit;
			data.t = self.forecastType;
			if(dtm == 0) {
				data.tm = "";
			} else {
				data.dtm = dtm;
			}
			var url = prefix + "wnuri-sfct/forecast/marine-zone.do";
			return $.ajax({
				url: url,
				data: data,
				dataType: "html"
			});
		},
		initData: function() {
			var self = this;
			var prefix = self.getPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:DEFAULT_UNIT_WS;
			var data = {
				unit: unit,
				t : self.forecastType
			};
			var url = prefix + "wnuri-sfct/forecast/marine-zone.do";
			return $.ajax({
				url: url,
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
		requestRemote: function() {
			var self = this;
			return self.initData();	
		},
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			$wrapper.html(html);
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
			
			$wrapper.on('change', 'select[name="s"]', function(e) {
				//self.refreshData();
			});
			$wrapper.on('click', 'button[data-role="data-select"]', function(e) {
				self.refreshData();
			});
			$wrapper.on('click', 'button[data-role="type-select"]', function(e) {
				var f = $wrapper.find("form")[0];
				window.location.href= window.location.pathname + "?t=" + f.t.value;
			});
			$wrapper.on('click', 'button[data-role="move"]', function(e) {
				var dtm = parseInt($(this).attr('data-hours'));
				self.refreshData(dtm);
			});
			
		},
	};
	
	if (typeof exports !== 'undefined') exports.MarineZoneForecast = MarineZoneForecast;
	else window.MarineZoneForecast = MarineZoneForecast;
})(jQuery, window, document);