/**
 * 지점별 상세관측 자료(매분)
 */
'use strict';
(function($, window, document){
	var VER="0.1", 
	SfcAwsWeather = function(wrapperId) {
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
		self.appConfigKey = "W_AC";
		self.updateData();
		self.updateCities();
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
	SfcAwsWeather.prototype = {
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
					showLoading(self.id, false);
				},
				self.error()
			)	
		},
		updateCities: function(sidoCode) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var $sidoSelect = $wrapper.find('select[name="sido"]');
			if(!sidoCode) {
				sidoCode = $sidoSelect.val();
			}
			self.getCity(sidoCode + '00000000').then(
				function(data) {
					var $citySelect = $wrapper.find('select[name="city"]');
					if(data) {
						$citySelect.html('<option value="">전체</option>');
						for(var i = 0 ; i < data.length ; i++) {
							var city = data[i];
							$citySelect.append('<option value="' + city.code.substring(0,5) + '">' + city.name + '</option>');	
						}
					}
				}
			);
		},
		getCity: function(wideCode) {
			var self = this;
			var prefix = self.getPrefix();
			var data = {
				type: 'CITY',
				wideCode: wideCode
			};
			
			return $.ajax({
				url: prefix + "rest/zone/dong.do",
				data: data,
				dataType: "json"
			});
		},
		getData: function(dtm) {
			var self = this;
			var prefix = self.getPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find('form')[0]);
			data.unit = unit;
			data.dtm = dtm;
			
			return $.ajax({
				url: prefix + "wnuri-fct/weather/sfc-aws-weather.do",
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
			$wrapper.find('div[data-role="data-holder"]').html(html);
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading(self.id, false);
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			$wrapper.on('change', 'select[name="sido"]', function(e) {
				// 접근성(의도하지 않은 동작) 
				//self.updateData();
				self.updateCities(this.value);
			});
			$wrapper.on('click', 'button[data-role="select-type"]', function(e) {
				self.updateData();
			});
			$wrapper.on('change', 'select[name="city"]', function(e) {
				// 접근성(의도하지 않은 동작) 
				//self.updateData();
			});
			$wrapper.on('click', 'button[data-role="select-reg"]', function(e) {
				self.updateData();
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.SfcAwsWeather = SfcAwsWeather;
	else window.SfcAwsWeather = SfcAwsWeather;
})(jQuery, window, document);