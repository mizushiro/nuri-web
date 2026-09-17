/**
 * 특별기상지원용 AppConfig
 *
 */
'use strict';
(function($, window, document){
	var WnuriMainTabConfig = null;
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
		};
		this.key = "W_AC";
		this.config = Object.assign({}, defaultConfig);
		this.readConfig();
		this.addEventHandler();
	};
	AppConfig.prototype = {
		readConfig: function(forecastTabFirst) {
			var loadedConfig = store.get(this.key);
			if(loadedConfig) {
				this.config = loadedConfig;
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
			
		}
	};
	if (typeof exports !== 'undefined') exports.AppConfig = AppConfig;
	else window.AppConfig = AppConfig;
})(jQuery, window, document);
	