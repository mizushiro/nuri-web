/**
 * AppConfig
 *
 * 웹의 전역 설정
 */
'use strict';
(function($, window, document){
	var WnuriMainTabConfig = null;
	var defaultMainState = {
			mobileWgisMapClosed: false,
			timelineMode: 'mode-default',
			timelineInterval: 3,
		};
	if(typeof getWnuriMainTabConfig === "function") {
		WnuriMainTabConfig = getWnuriMainTabConfig();
	}
	
	if(WnuriMainTabConfig == null) {
		WnuriMainTabConfig = {
			forecastTabFirst: true
		};
	}
	
	var AppConfig = function(wrapperId) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		this.id = wrapperId;
		
		var defaultConfig = {
			unit: {
				ws: UNIT.M,
			},
			displayMode: DISPLAY_MODE_DEFAULT,
			locationMode: LOCATION_MODE_POSITION,
			tabMode: TAB_MODE_WEATHER,
			wthema: 'wthema-a',
			state: {
				main: Object.assign({}, defaultMainState),
			}
		};
		this.key = "W_AC";
		this.config = Object.assign({}, defaultConfig);
		this.readConfig();
		this.addEventHandler();
	
		if(this.config.wthema) $('body').addClass(this.config.wthema);
	};
	AppConfig.prototype = {
		readConfig: function(forecastTabFirst) {
			var loadedConfig = store.get(this.key);
			if(loadedConfig) {
				this.config = loadedConfig;
				if(!this.config.wthema) {
					this.config.wthema = 'wthema-a';
				}
			}
		},
		writeConfig: function() {
			store.set(this.key, this.config);
		},
		parseConfig: function() {
			var base = this;
			var $wrapper = $('#' + base.id);
			base.config.unit.ws = $wrapper.find("select[name='weather-config-unit-ws']")[0].value;
			base.config.displayMode = $wrapper.find("select[name='display-mode']")[0].value;
			base.config.locationMode = $wrapper.find("select[name='location-mode']")[0].value;
			base.config.tabMode = $wrapper.find("select[name='tab-mode']")[0].value;
			base.config.wthema = $wrapper.find("select[name='wthema']")[0].value;
			if(!base.config.state) {
				base.config.state = {
					main: Object.assign({}, defaultMainState),
				}
			}
			if(!base.config.state.main) {
				base.config.state.main = Object.assign({}, defaultMainState)
			}
			base.config.state.main.timelineInterval = parseInt($wrapper.find("select[name='timeline-interval']")[0].value);
		},
		closeConfig: function() {
			$('.pop-close').trigger("click");
		},
		onAppConfigUpdated: function() {
			GlobalEvent.trigger($.Event("onAppConfigUpdated"));
		},
		updateView: function() {
			var base = this;
			var $wrapper = $('#' + base.id);
			$.each($wrapper.find("select[name='weather-config-unit-ws']>option"), function(index, item) {
				if(item.value == base.config.unit.ws) {
					$(this).attr('selected', 'selected');
				} else {
					$(this).removeAttr('selected');
				}
			});
			
			$.each($wrapper.find("select[name='display-mode']>option"), function(index, item) {
				if(item.value == base.config.displayMode) {
					$(this).attr('selected', 'selected');
				} else {
					$(this).removeAttr('selected');
				}
			});
			$.each($wrapper.find("select[name='location-mode']>option"), function(index, item) {
				if(item.value == base.config.locationMode) {
					$(this).attr('selected', 'selected');
				} else {
					$(this).removeAttr('selected');
				}
			});
			$.each($wrapper.find("select[name='tab-mode']>option"), function(index, item) {
				if(item.value == base.config.tabMode) {
					$(this).attr('selected', 'selected');
				} else {
					$(this).removeAttr('selected');
				}
			});
			$.each($wrapper.find("select[name='wthema']>option"), function(index, item) {
				if(item.value == base.config.wthema) {
					$(this).attr('selected', 'selected');
				} else {
					$(this).removeAttr('selected');
				}
			});
			if(!base.config.wthema) {
				base.config.wthema = 'wthema-a';
			}
			if(!base.config.state) {
				base.config.state = {
					main: Object.assign({}, defaultMainState),
				}
			}
			if(!base.config.state.main) {
				base.config.state.main = Object.assign({}, defaultMainState)
			}
			$.each($wrapper.find("select[name='timeline-interval']>option"), function(index, item) {
				if(parseInt(item.value) == base.config.state.main.timelineInterval) {
					$(this).attr('selected', 'selected');
				} else {
					$(this).removeAttr('selected');
				}
			});
			$wrapper.find('div[data-role="wthema-wrapper"]').first().removeClass().addClass(base.config.wthema);
		},
		addEventHandler: function() {
			var base = this;
			// save, cancel
			var $wrapper = $('#' + base.id);
			$wrapper.find('button[data-role="save"]').on('click', function(e) {
				base.parseConfig();
				base.writeConfig();
				base.closeConfig();
				base.onAppConfigUpdated();
				e.preventDefault();
			});
			$wrapper.find('button[data-role="cancel"]').on('click', function(e) {
				base.closeConfig();
				e.preventDefault();
			});
			
			$wrapper.find("select[name='wthema']").on('change', function(e) {
				$wrapper.find('div[data-role="wthema-wrapper"]').first().removeClass().addClass(this.value);
			});
			
			$wrapper.find("a.label-help").on('click', function(e) {
				e.preventDefault();
				$(this).next().next().toggleClass('on');
				$(this).next().next().find('a.close-box').focus();
			});
			$wrapper.find('a.close-box').on('click', function(e) {
				e.preventDefault();
				$(this).parents('.cmp-help-tooltip').removeClass('on').prev().prev().focus();
			});
		}
	};
	if (typeof exports !== 'undefined') exports.AppConfig = AppConfig;
	else window.AppConfig = AppConfig;
})(jQuery, window, document);
	