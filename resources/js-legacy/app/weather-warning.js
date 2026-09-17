/**
 * panel - today-warning
 *
 * 오늘의 날씨 특보(기상특보/예비특보)
 */
'use strict';
(function($, window, document){
	var VER="20191205-1",
	WeatherWarning = function(wrapperId, viewType) {
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
		self.viewType = viewType?viewType:"";
		self.state = {};
		self.config = {};
		self.updateData();
		self.addEventHandler();
	};
	WeatherWarning.prototype = {
		refresh: function() {
			var self = this;
			self.updateData();
		},
		updateData: function() {
			var self = this;
			if(!self.viewType != "main") showLoading(self.id, true, "light");
			self.requestRemote()
			.then(
				function(data) {
					self.updateView(data);
					if(!self.viewType != "main")showLoading(self.id, false);
				},
				self.error()
			)	
		},
		getData: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var data = {
				
			};
			var url = "";
			if(self.viewType == "main") {
				url = pathPrefix + "wnuri-fct/main/warning.do"
			} else {
				url = pathPrefix + "wnuri-fct/weather/warning.do"
			}
			return $.ajax({
				url: url,
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
			
			if(self.viewType == "main" && html.indexOf("NO_WARNING") < 0) {
				//$('.maintab').find('button').removeClass('on');
				//$('.maintab').prepend('<div class="tab-btn05"><button class="on" type="button" data-main="5">특보</button></div>');
				//weatherUI.mainTab('.maintab', '.maintab-wrap');
				//var $wrapper = $('<div class="tab-cont05 on" data-main="5" id="index-weather-warning"></div>');
				//$wrapper.html(html);
				//$('.maintab-wrap').slick('slickAdd',$wrapper, 0, true);
				//weatherUI.tab('.tab-wrap01', '.tab-cont-wrap01');
				//weatherUI.scrollY('.scroll-js3');
				//weatherUI.scrollY('.scroll-js4');
				GlobalEvent.trigger($.Event("onMainWarningLoaded"), [this]);
			} else {
				var $wrapper = $('#' + self.id);
				$wrapper.html(html);
				
				weatherUI.scrollY('.scroll-js');
				weatherUI.scrollY('.scroll-js2');
				weatherUI.scrollY('.scroll-js3');
				weatherUI.scrollY('.scroll-js4');
				weatherUI.scrollY('.scroll-js5');
				weatherUI.scrollY('.scroll-js6');
				
				weatherUI.tab('.weather-cmt-tab','.weather-cmt-content','.scroll-js5');
			}
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
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.WeatherWarning = WeatherWarning;
	else window.WeatherWarning = WeatherWarning;
})(jQuery, window, document);