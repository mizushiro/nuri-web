/**
 * panel - weather summary
 *
 * 날씨 > 단기예보 예보 요약
 */
'use strict';
(function($, window, document){
	var KMA = {
		wide: { code: "1100000000", name: "서울특별시"},
		city: { code: "1159000000", name: "동작구"},
		dong: { code: "1159068000", name: "신대방제2동", x: 59, y: 125, lat: 37.493546, lon:126.921654},
		fullName: "서울특별시 동작구 신대방제2동",
		index: 0
	},
	WeatherSummary = function(wrapperId) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		var base = this;
		base.id = wrapperId;
		base.state = {
			selectedBookmark: null,
			unit: null
		};
		base.key = "W_DC";
		base.appConfigKey = "W_AC";
		base.readConfig();
		base.readAppConfig();
		base.updateData();
		base.addEventHandler();
	};
	WeatherSummary.prototype = {
		readConfig: function() {
			var base = this;
			var loadedConfig = store.get(base.key);
			if(loadedConfig) {
				if(loadedConfig.selectedBookmark) {
					base.state.selectedBookmark = Object.assign({}, loadedConfig.selectedBookmark);
				} else if(loadedConfig.bookmarks && loadedConfig.bookmarks.length > 0) {
					base.state.selectedBookmark = Object.assign({}, loadedConfig.bookmarks[0]);
				}
			} else {
				base.state.selectedBookmark = Object.assign({}, KMA);
			}
		},
		readAppConfig: function() {
			var base = this;
			var loadedAppConfig = store.get(base.appConfigKey);
			if(loadedAppConfig) {
				base.state.unit = loadedAppConfig.unit.ws;
			} else {
				base.state.unit = "km/h";
			}
		},
		refresh: function(bookmark) {
			var base = this;
			if(bookmark && bookmark.dong) {
				base.state.selectedBookmark = Object.assign({}, bookmark);
			} else {
				base.readConfig();
			}
			base.readAppConfig();
			base.updateData();
		},
		updateData: function() {
			var base = this;
			base.requestRemote().then(
				function(data) {
					base.updateView(data)
				},
				base.error()
			)	
		},
		getData: function(code, unit) {
			var prefix = this.getPrefix();
			var data = {
				code: code,
				unit: unit,
			};
			
			return $.ajax({
				url: prefix + "wnuri-fct/weather/summary.do",
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
			var base = this;
			return base.getData(base.state.selectedBookmark.dong.code, base.state.unit);	
		},
		updateView: function(html) {
			var base = this;
			var $wrapper = $('#' + base.id);
			$wrapper.html(html);
		},
		error: function() {
			var base = this;
			return function(request, status) {
				if(console) console.log(request, status);
			};
		},
		addEventHandler: function() {
			var base = this;
			// save, cancel
			var $wrapper = $('#' + base.id);
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.WeatherSummary = WeatherSummary;
	else window.WeatherSummary = WeatherSummary;
})(jQuery, window, document);