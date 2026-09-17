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

// cmp-common-tabs
$('.cmp-common-tabs').on('click', ' > li > a ', function(e) {
	e.preventDefault();
	var $tabs = $(this).parents('.cmp-common-tabs');
	$tabs.find(' > li').removeClass('on');
	$tabs.find(' > li > a').attr('title','');
	$(this).attr('title','선택됨').parent().addClass('on');
});
var dongConfigInSearch = new DongConfig('dong-config-in-search',"DONG");
var loadConfigInSearch = new DongConfig('load-config-in-search',"LOAD");
var appConfig = new AppConfig('weather-config')

appConfig.updateView();

$(document).ready(function(){	
	
});
(function() {

	weatherUI.popOpen('.pop-open');
	weatherUI.popClose('.pop-close');
	weatherUI.popCloseBanner('.pop-close-banner');
	weatherUI.accordionSecond('.accordionsecond-wrap');
	weatherUI.accordion('.accordion-tit');
	weatherUI.tab('.tab-wrap03', '.tab-cont-wrap03');
	
})();
