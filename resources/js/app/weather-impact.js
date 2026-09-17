/**
 * panel - /weather/warning/impact
 *
 * 영향예보
 */
'use strict';
(function($, window, document){
	var VER="20201012",
	WeatherImpact = function(wrapperId) {
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
	WeatherImpact.prototype = {
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
			var self = this;
			var pathPrefix = this.getPathPrefix();
			var $wrapper = $('#' + self.id);
			var stn = $wrapper.find('select[name="stn"]').val();
			var data = {
				stn: stn
			};
			
			return $.ajax({
				url: pathPrefix + "wnuri-fct/weather/impact.do",
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
