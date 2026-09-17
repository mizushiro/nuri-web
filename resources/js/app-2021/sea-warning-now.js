/**
 * 오늘의 바다 바다특보 
 */
'use strict';
(function($, window, document){
	var DEFAULT_AREA = {
			top: {code: "12A20000", name: "서해중부"},
			mid: {code: "12A20100", name: "서해중부 앞바다"},
			btm: {code: "12A20100", name: "서해중부앞바다"},
		},
	SeaWarningNow = function(wrapperId, viewType) {
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
		self.state = {
				area: DEFAULT_AREA
		};
		self.appConfigKey = "W_AC";
		
		self.key = "W_SC";
		self.config = {
			bookmarks: [],
			recent: []
		};
		self.readConfig();
		if(self.config.bookmarks && self.config.bookmarks.length > 0){
			self.state.area = self.config.bookmarks[0];
		} else {
			self.state.area = Object.assign({}, DEFAULT_AREA);
		}
		self.updateData();
		self.addEventHandler();
	};
	SeaWarningNow.prototype = {
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
			//showLoading(self.id, true, "light");
			self.requestRemote(self.state.area)
			.then(
				function(data) {
					self.updateView(data);
			//		showLoading(self.id, false, "light");
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
			var url;
			if(self.viewType == "ocean-warning") {
				url = prefix + "wnuri-sfct/warning/warning-now.do"
			} else {
				url = prefix + "wnuri-sfct/today/warning-now.do";
			}
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
		requestRemote: function(area) {
			var self = this;
			return self.getData(area);	
		},
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			$wrapper.html(html);
			weatherUI.accordion('.accordion-tit');
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				//showLoading(self.id, false, "light");
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.SeaWarningNow = SeaWarningNow;
	else window.SeaWarningNow = SeaWarningNow;
})(jQuery, window, document);