/**
 * panel - weather/today-warning
 *
 * 오늘의 날씨 특보(기상특보/예비특보)
 */
'use strict';
(function($, window, document){
	var VER="20191205-1",
	KMA = {
		wide: { code: "1100000000", name: "서울특별시"},
		city: { code: "1159000000", name: "동작구"},
		dong: { code: "1159068000", name: "신대방제2동", x: 59, y: 125, lat: 37.493546, lon:126.921654},
		x: 59,
		y: 125,
		lat: 37.493546,
		lon:126.921654,
		fullName: "서울특별시 동작구 신대방제2동",
		index: 0
	},
	TodayWarning = function(wrapperId) {
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
		self.key = "W_DC";
		self.state = {};
		self.config = {};
		self.readConfig();
		self.updateData();
		self.addEventHandler();
	};
	TodayWarning.prototype = {
		refresh: function() {
			var self = this;
			self.updateData();
		},
		readConfig: function() {
			var loadedConfig = store.get(this.key);
			if(loadedConfig) {
				this.config = loadedConfig;
			}
		},
		getSelectedDongCode: function() {
			var self = this;
			self.readConfig();
			var selectedCode = KMA.dong.code;
			if(!self.config) {
				selectedCode = KMA.dong.code;
			} else if(self.config.selectedBookmark == null && (self.config.bookmarks == null || self.config.bookmarks.length == 0)) {
				selectedCode = KMA.dong.code;
			} else {
				if(self.config.selectedBookmark && self.config.selectedBookmark.dong && self.config.selectedBookmark.dong.code) {
					selectedCode = self.config.selectedBookmark.dong.code;
				} else if(self.config.bookmarks && self.config.bookmarks.length > 0 && self.config.bookmarks[0].dong && self.config.bookmarks[0].dong.code){
					selectedCode = self.config.bookmarks[0].dong.code;
				} else {
					selectedCode = KMA.dong.code;
				}
			}
			return selectedCode
		},
		refreshWarning: function(bookmark) {
			var self = this;
			//showLoading(self.id, true, "light");
			var dongCode = (bookmark?bookmark.dong.code:self.getSelectedDongCode());
			self.requestRemote(dongCode)
				.then(
					function(data) {
						self.updateView(data);
						showLoading(self.id, false);
					},
					self.error()
				);
		},
		updateData: function() {
			var self = this;
			//showLoading(self.id, true, "light");
			var dongCode = self.getSelectedDongCode();
			self.requestRemote(dongCode)
				.then(
					function(data) {
						self.updateView(data);
						showLoading(self.id, false);
					},
					self.error()
				);
			
			self.getColdwaveExists()
				.then(
					function(data) {
						if(data.coldwaveExists) { 
							$('.coldwave-btn-wrap').show();
						}
					},
					self.error()
				);
		},
		getData: function(code, unit) {
			var pathPrefix = this.getPathPrefix();
			var data = {
				code: code,
				unit: unit
			};
			return $.ajax({
				url: pathPrefix + "wnuri-fct/weather/today-warning.do",
				data: data,
				dataType: "html"
			});
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
			weatherUI.accordion('#' + self.id + ' .accordion-tit');
			weatherUI.tab('#' + self.id + ' .tab-wrap01', '#' + self.id + ' .tab-cont-wrap01');
			
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
			
			$wrapper.on('click','.accordion-tit', function(){
				var _this = this;
				if(typeof mainSlick != "undefined" && mainSlick != null) {
					window.setTimeout(function() {
						var height = mainSlick.find('.slick-list.draggable').height() + 10;
						var warnHeight = $wrapper.find('.accordion-con').height();
						if($(_this).hasClass('on')) {
							mainSlick.find('.slick-list.draggable').first().css({'height': (height + warnHeight) + 'px'});
						} else {
							mainSlick.find('.slick-list.draggable').first().css({'height': (height - warnHeight) + 'px'});	
						}
						
					},350);
				}
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.TodayWarning = TodayWarning;
	else window.TodayWarning = TodayWarning;
})(jQuery, window, document);