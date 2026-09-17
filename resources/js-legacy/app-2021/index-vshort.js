/**
 * panel - index vshort
 *
 * 메인 페이지 초단기 
 */
'use strict';
(function($, window, document){
	var KMA = {
		wide: { code: "1100000000", name: "서울특별시"},
		city: { code: "1159000000", name: "동작구"},
		dong: { code: "1159068000", name: "신대방제2동"},
		x: 59,
		y: 125,
		lat: 37.493546,
		lon:126.921654,
		fullName: "서울특별시 동작구 신대방제2동",
		index: 0
	},
	IndexVShort = function(wrapperId, caller) {
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
		base.caller = caller?caller:"default";
		base.id = wrapperId;
		base.state = {
			selectedBookmark: null,
			unit: "km/h"
		};
		base.key = "W_DC";
		base.appConfigKey = "W_AC";
		base.readConfig();
		base.readAppConfig();
		//base.updateData();
		base.addEventHandler();
	};
	IndexVShort.prototype = {
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
			showLoading(base.id, true);
			base.requestRemote().then(
				function(data) {
					base.updateView(data);
					showLoading(base.id, false);
				},
				base.error()
			)	
		},
		getData: function(code, unit) {
			var prefix = this.getPrefix();
			var theme = $("body").hasClass("light-theme")?"Light":"Dark";
			var data = {
				caller: this.caller,
				code: code,
				unit: unit,
				theme: theme,
				ext: "Y",
			};
			
			return $.ajax({
				url: prefix + "wnuri-fct/main/vshort.do",
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
			if(!base.state.selectedBookmark || !base.state.selectedBookmark.dong) {
				base.state.selectedBookmark = Object.assign({}, KMA);
			}
			return base.getData(base.state.selectedBookmark.dong.code, base.state.unit);	
		},
		updateView: function(html) {
			var base = this;
			var $wrapper = $('#' + base.id);
			$wrapper.html(html);
			base.slickSlider = weatherUI.slickChange3('.weather-list.' + base.caller);
			base.slickSlider.on('vmousedown touchstart', function(e) {
				mainSlick.slick("slickSetOption","swipe", false);
				window.setTimeout(function() {
					mainSlick.slick("slickSetOption","swipe", false);
				},2000);
			}).on('afterChange', function() {
				mainSlick.slick("slickSetOption","swipe", false);
			});
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
			$wrapper.on('click', '.update-btn[data-role="update"]', function(e) {
				e.preventDefault();
				//base.refresh();
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.IndexVShort = IndexVShort;
	else window.IndexVShort = IndexVShort;
})(jQuery, window, document);