/**
 * panel - today vshortmid
 *
 * 날씨 > 오늘의 날씨 > 촌단기, 단기, 중기
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
	TodayVshortmid = function(wrapperId) {
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
		base.configureHashParams();
		base.updateData();
		base.addEventHandler();
	};
	TodayVshortmid.prototype = {
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
					base.state.selectedBookmark = Object.assign({}, selectedRecent);
				}
			}
		},
		readConfig: function() {
			var base = this;
			var loadedConfig = store.get(base.key);
			if(loadedConfig) {
				if(loadedConfig.selectedBookmark) {
					base.state.selectedBookmark = Object.assign({}, loadedConfig.selectedBookmark);
				} else if(loadedConfig.bookmarks && loadedConfig.bookmarks.length > 0) {
					base.state.selectedBookmark = Object.assign({}, loadedConfig.bookmarks[0]);
				} else if(!loadedConfig.selectedBookmark) {
					base.state.selectedBookmark = Object.assign({}, KMA);	
				}
				base.config = loadedConfig;
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
			showLoading(base.id, true, "light");
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
			var data = {
				code: code,
				unit: unit,
				ext: "N",
			};
			
			return $.ajax({
				url: prefix + "wnuri-fct/weather/today-vshortmid.do",
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
			weatherUI.scrollSlide('.weather-info-list' , '.swiper-pagination');
			weatherUI.slickChange3('.weather-list');
		},
		error: function() {
			var base = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading(base.id, false);
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
			$wrapper.on('click', '.up-btn[data-role="update"]', function(e) {
				e.preventDefault();
				//base.refresh();
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.TodayVshortmid = TodayVshortmid;
	else window.TodayVshortmid = TodayVshortmid;
})(jQuery, window, document);