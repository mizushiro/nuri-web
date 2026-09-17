/**
 * panel - index map
 *
 * 메인 페이지 기상실황, 강수, 특보현황, 구름, 파고 
 */
'use strict';
(function($, window, document){
	var DEFAULT_URL={
		rain: "/resources/image/test02.png",
		warn: "/resources/image/test03.png",
		cloud: "/resources/image/test04.png",
		wave: "/resources/image/test05.png"
	},
	IndexMap = function(wrapperId) {
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
		self.$wrapper = $('#' + self.id);
		self.stateKey = "stateIndexMap";
		self.state = {};
		self.config = {};
		if(self.readState()) {
			self.updateView(self.state.data);
		}
		self.updateData();
		self.addEventHandler();
	};
	IndexMap.prototype = {
		refresh: function() {
			var self = this;
		},
		saveState: function() {
			var self = this;
			store.set(self.stateKey, self.state);
		},
		readState: function() {
			var self = this;
			var savedState = store.get(self.stateKey);
			if(savedState) {
				self.state = savedState;
				return true;
			} else {
				return false;
			}
		},
		updateData: function() {
			var self = this;
			self.requestRemote()
			.then(
				function(data) {
					self.updateView(data)
				},
				self.error()
			);
		},
		getMap: function() {
			var baseUrl = this.getBase();
			var data = {
			};
			
			return $.ajax({
				url: baseUrl + "rest/main/map.do",
				data: data,
				dataType: "json"
			});
		},
		getBase: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		requestRemote: function() {
			var self = this;
			return self.getMap();	
		},
		updateView: function(data) {
			var self = this;
			var template = '<img src="{{url}}" alt="{{description}}"/>';
			for(var i in data) {
				var item = data[i];
				item.url = self.getBase() + item.path;
				var html =  Mustache.render(template, item);
				self.$wrapper.find('div[data-role="' + item.type.toLowerCase() + '-map"]').html(html);
			}
			self.state.data = data;
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
			var $wrapper = self.$wrapper;
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.IndexMap = IndexMap;
	else window.IndexMap = IndexMap;
})(jQuery, window, document);