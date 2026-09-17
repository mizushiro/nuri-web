'use strict';
if(typeof jQuery === 'undefined') {
	alert('jQuery required!');
}

// common
function showLoading(id, show, clazz) {
	var $wrapper = $('#' + id);
	if(!clazz) clazz = "light";
	var loading = '<div class="loading_wrap"><div class="lds-spinner ' + clazz + '"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
	if(show) {
		if($wrapper.has('.loading_wrap').length > 0) {
			$wrapper.find('.loading_wrap').show();
		} else {
			$wrapper.append(loading);
		}	
	} else {
		if($wrapper.has('.loading_wrap').length) {
			$wrapper.find('.loading_wrap').hide();
		}
	}
}

(function($, window, document){
	var GlobalEvent = $({});

	if (typeof exports !== 'undefined') exports.GlobalEvent = GlobalEvent;
	else window.GlobalEvent = GlobalEvent;
})(jQuery, window, document);

GlobalEvent.on('onStateChanged', function(e, sender, group, stateName, stateValue) {
	console.log(sender, group, stateName, stateValue);
	var config = appConfig.config;
	if(!config) return;
	if(!config.state) config.state = {};
	if(!config.state[group]) config.state[group] = {}
	var changed = {};
	changed[stateName] = stateValue;
	Object.assign(config.state[group], changed);
	appConfig.writeConfig();
	console.log(appConfig.config);
});

// link via button event
$('button[data-role="link-to"]').on('click', function(e) {
	var url = $(this).attr('data-link');
	if(!url) return;
	var target = $(this).attr('data-target');
	if(!target) {
		window.location.href = url;
	} else {
		window.open(url, target).focus();	
	}
});
$('button[data-role="popup-to"]').on('click', function(e) {
	var url = $(this).attr('data-link');
	if(!url) return;
	var target = $(this).attr('data-target');
	var width = $(this).attr('data-width');
	var height = $(this).attr('data-height');
	window.open(url,target+"",'width=' + width + 'px, height=' + height + 'px, scrollbars=no').focus();
});
$('[data-role="window-close"]').on('click', function(e) {
	e.preventDefault();
	window.close();
});

var UNIT = { K: "km/h", M: "m/s" }, 
	DISPLAY_MODE_DEFAULT = "default",
	DISPLAY_MODE_MAP = "map",
	LOCATION_MODE_POSITION = "position",
	LOCATION_MODE_FAVORITE = "favorite",
	LOCATION_MODE_NO_LOCATION = "no-location",
	TAB_MODE_WEATHER = "weather",
	TAB_MODE_WHOLE = "whole",
	LANG = {
		ko: { code: "ko", name: { en: "Korean", ko: "한국어"}},
		en: { code: "en", name: { en: "English", ko: "영어"}},
		ja: { code: "ja", name: { en: "Japanese", ko: "일본어"}},
		cn: { code: "cn", name: { en: "Chinese", ko: "중국어"}},
	};

var appConfig = new AppConfig('weather-config')
appConfig.updateView();


(function() {
	weatherUI.popOpen('.pop-open');
	weatherUI.popClose('.pop-close');
	weatherUI.tab('.tab-wrap04', '.tab-cont-wrap04');
	weatherUI.accordionSecond('.accordionsecond-wrap');
	weatherUI.movieChkToggle('.movi-toggle');

})();
