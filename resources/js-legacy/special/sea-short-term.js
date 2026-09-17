/**
 * 설연휴 기상지원 바다예보 - 단기예보
 */
'use strict';
(function($, window, document){
	var DEFAULT_AREA = {
			top: {code: "12A20000", name: "서해중부"},
			mid: {code: "12A20100", name: "서해중부 앞바다"},
			btm: {code: "12A20100", name: "서해중부앞바다"},
		},
	SeaShortTerm = function(wrapperId, titleId) {
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
		self.titleId = titleId;
		self.config = { bookmarks: [], recent: [] };
		self.state = { area: Object.assign({}, DEFAULT_AREA) };
		self.appConfigKey = "W_AC";
		self.key = "W_SC";
		self.readConfig();
		if(!self.configureHashParams()) {
			if(self.config.selectedBookmark) {
				self.state.area = Object.assign({}, self.config.selectedBookmark);
			} else {
				if(self.config.bookmarks && self.config.bookmarks.length > 0){
					self.state.area = Object.assign({}, self.config.bookmarks[0]);
				} else {
					self.state.area = Object.assign({}, DEFAULT_AREA);
				}	
			}	
		}
		
		self.updateData();
		self.addEventHandler();
	};
	SeaShortTerm.prototype = {
		configureHashParams: function() {
			var base = this;
			var url = window.location.href;
			var hash = url.substring(url.indexOf('#'));

			if(hash == '#last-recent') {
				// 마지막 검색을 선택된 북마크로
				if(base.config && base.config.recent && base.config.recent.length > 0) {
					var selectedRecent = base.config.selectedRecent;
					if(!selectedRecent) {
						selectedRecent = base.config.recent[0];
					}
					base.state.area = Object.assign({}, selectedRecent);
					return true;
				}
			}
			return false;
		},
		readConfig: function() {
			var self = this;
			var loadedConfig = store.get(self.key);
			if(loadedConfig) {
				self.config = loadedConfig;
			}
			var loadedAppConfig = store.get(self.appConfigKey);
			if(loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
		},
		refresh: function(bookmark) {
			var self = this;
			self.readConfig();
			if(bookmark && bookmark.top && bookmark.mid && bookmark.btm) {
				self.state.area = Object.assign({}, bookmark);
			}
			self.updateData();
		},
		updateData: function() {
			var self = this;
			showLoading(self.id, true, "light");
			self.requestRemote(self.state.area)
			.then(
				function(data) {
					self.updateView(data);
					showLoading(self.id, false, "light");
				},
				self.error()
			)
		},
		getData: function(area) {
			var self = this;
			var prefix = self.getPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var data = {
				topArea: area.top.code,
				midArea: area.mid.code,
				btmArea: area.btm.code,
				unit: unit
			};
			
			return $.ajax({
				url: prefix + "wnuri-sfct/special/sea-short-term.do",
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
		requestRemote: function(area) {
			var self = this;
			return self.getData(area);	
		},
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			$wrapper.html(html);
			// title 
			var title = $wrapper.find('div[data-role="title-holder"]').html();
			$("#" + self.titleId).html(title);
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
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.SeaShortTerm = SeaShortTerm;
	else window.SeaShortTerm = SeaShortTerm;
})(jQuery, window, document);