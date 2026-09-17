/**
 * panel - /weather/warning/fog
 *
 * 안개정보
 */
'use strict';
(function($, window, document){
	var VER="20191205-1",
	WeatherFogInfo = function(wrapperId) {
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
		self.config = {};
		self.updateData();
		self.addEventHandler();
	};
	WeatherFogInfo.prototype = {
		refresh: function() {
			var self = this;
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
			var pathPrefix = this.getPathPrefix();
			var data = {
				
			};
			
			return $.ajax({
				url: pathPrefix + "wnuri-fct/weather/fog-info.do",
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
			$wrapper.html(html);
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.WeatherFogInfo = WeatherFogInfo;
	else window.WeatherFogInfo = WeatherFogInfo;
})(jQuery, window, document);