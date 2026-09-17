/**
 * AppConfig
 *
 * 웹의 전역 설정
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

	var UNIT = {
		K: "km/h",
		M: "m/s"
	};
	
	var LANG = {
		ko: { code: "ko", name: { en: "Korean", ko: "한국어"}},
		en: { code: "en", name: { en: "English", ko: "영어"}},
		ja: { code: "ja", name: { en: "Japanese", ko: "일본어"}},
		cn: { code: "cn", name: { en: "Chinese", ko: "중국어"}},
	};
	
	var PANELS = {
		main: [
			{ id: "map", name: "지도(강수)" , tab: 1},
			{ id: "weather", name: "예보", tab: 2 },
//			{ id: "knowledge", name: "지식", tab: 3 },
		]
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
				ws: UNIT.K,
			},
			//lang: LANG.ko.code,
			panelOrder: {
				main: WnuriMainTabConfig.forecastTabFirst?[ PANELS.main[1], PANELS.main[0] ]:[ PANELS.main[0], PANELS.main[1] ]
			}
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
				if(this.config.panelOrder.main.length != 2) {
					this.config.panelOrder.main = WnuriMainTabConfig.forecastTabFirst?[ PANELS.main[1], PANELS.main[0] ]:[ PANELS.main[0], PANELS.main[1] ];
					this.writeConfig();
				} else {
					var updated = false;
					for(var i in this.config.panelOrder.main) {
						if(this.config.panelOrder.main[i].tab == 2 && this.config.panelOrder.main[i].name != "예보") {
							this.config.panelOrder.main[i].name = "예보";
							updated = true;
						}
					}
					this.writeConfig();
				}
			}
		},
		writeConfig: function(sync) {
			store.set(this.key, this.config);
			if(sync) {
				// post message to parent
				window.parent.postMessage({
					action: "config-save",
					unit: this.config.unit,
					panelOrder: this.config.panelOrder,
				}, '*');	
			}
		},
		parseConfig: function() {
			var base = this;
			var $wrapper = $('#' + base.id);
			base.config.unit.ws = $wrapper.find("select[name='weather-config-unit-ws']")[0].value;
			//base.config.lang = $wrapper.find("select[name='weather-config-lang']")[0].value;
			var mainOrder = []; 
			$.each($wrapper.find("select[name='weather-config-panelOrder-main']"), function(index, item) {
				mainOrder.push(PANELS.main[this.selectedIndex]);
			})
			base.config.panelOrder.main = mainOrder;
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
			
	//		$.each($wrapper.find("select[name='weather-config-lang']>option"), function(index, item) {
	//			if(item.value == base.config.lang) {
	//				$(this).attr('selected', 'selected');
	//			} else {
	//				$(this).removeAttr('selected');
	//			}
	//		});
			$.each($wrapper.find("select[name='weather-config-panelOrder-main']"), function(index, item) {
				var template = '{{#panels}}<option value="{{id}}" {{#selected}}selected="selected"{{/selected}}>{{name}}</option>{{/panels}}';
				var html =  Mustache.render(template, {
					panels: PANELS.main,
					selected: function() {
						return this.id == base.config.panelOrder.main[index].id;
					}
				});
				$(item).html(html);
			});
		},
		addEventHandler: function() {
			var base = this;
			// save, cancel
			var $wrapper = $('#' + base.id);
			$wrapper.find('button[data-role="save"]').on('click', function(e) {
				base.parseConfig();
				base.writeConfig(true);
				base.closeConfig();
				base.onAppConfigUpdated();
				e.preventDefault();
			});
			$wrapper.find('button[data-role="cancel"]').on('click', function(e) {
				base.closeConfig();
				e.preventDefault();
			});
			
			// panelOrder
			
			$.each($wrapper.find("select[name='weather-config-panelOrder-main']"), function(index, item) {
				$(item).on('change', function(e) {
					var indexes = [];
					var newIndex = this.selectedIndex;
					indexes.push(newIndex);
					$.each($wrapper.find("select[name='weather-config-panelOrder-main']"), function(iindex, iitem) {
						if(index != iindex) {
							var currentSelectedIndex = iitem.selectedIndex;
							var wi = 0;
							while(wi++ < 10) {
								var included = false;
								for(var i = 0 ; i < indexes.length ; i++) {
									if(currentSelectedIndex == indexes[i]) {
										included = true;
										break;
									}
								}
								if(included) {
									currentSelectedIndex = (++currentSelectedIndex)%2;
								} else {
									indexes.push(currentSelectedIndex);
									break;
								}
							}
							iitem.selectedIndex = currentSelectedIndex;
						}
					});
				});
			});
		}
	};
	if (typeof exports !== 'undefined') exports.AppConfig = AppConfig;
	else window.AppConfig = AppConfig;
})(jQuery, window, document);
	