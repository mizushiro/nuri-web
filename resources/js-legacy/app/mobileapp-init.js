'use strict';
if(typeof jQuery === 'undefined') {
	alert('jQuery required!');
}

// common
function showLoading(id, show, clazz) {
	var $wrapper = $('#' + id);
	if(!clazz) clazz = "";
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

var dongConfigInSearch = new DongConfig('dong-config-in-search',"DONG");
var loadConfigInSearch = new DongConfig('load-config-in-search',"LOAD");
var dongConfigInUserConfig = new DongConfig('dong-config-in-user-settings', "DONG");
var loadConfigInUserConfig = new DongConfig('load-config-in-user-settings', "LOAD");
var appConfig = new AppConfig('weather-config')
//var seaConfig = new SeaConfig('sea-config');
var myAreaList = new MyAreaList('my-area-list');
appConfig.updateView();

GlobalEvent.on('onAddAreaBookmark', function(e, bookmark, sender) {
	myAreaList.reloadMyAreas();
	if(sender != dongConfigInSearch) {
		dongConfigInSearch.reloadMyAreas();
	}
	if(sender != loadConfigInSearch) {
		loadConfigInSearch.reloadMyAreas();
	}
});
GlobalEvent.on('onRemoveAreaBookmark', function(e, bookmark) {
	myAreaList.reloadMyAreas();
});
GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
	myAreaList.reloadMyRecents();
});
GlobalEvent.on('onAddAreaBookmarkOnlyMemory', function(e, bookmark, sender) {
	myAreaList.addBookmarkOnlyMemory(bookmark);
});
GlobalEvent.on('onSaveAreaBookmark', function(e, sender) {
	dongConfigInSearch.reloadMyAreas();
	loadConfigInSearch.reloadMyAreas();
});
$(document).ready(function(){	
	weatherUI.resizeWin();
	weatherUI.headerFix();
	swipeInit();
	$('#page-print-button').on('click', function() {
		window.print();
	});
//	if(window.mobilecheck() || $(window).width() < 1100) {
//		$('.recom-cont-btn').trigger('click');
//	}
});
(function() {
	
	weatherUI.popOpen('.pop-open');
	weatherUI.popClose('.pop-close');
	weatherUI.popCloseBanner('.pop-close-banner');
	weatherUI.menuOpen('.mobile-menu' , 'header .close');
	weatherUI.accordionSecond('.accordionsecond-wrap');
	weatherUI.accordion('.accordion-tit');
	weatherUI.recomSlide('.recom-cont-wrap');
	weatherUI.mainChkToggle('.main-toggle');
	weatherUI.movieChkToggle('.movi-toggle');
	weatherUI.groupChkToggle('.group-toggle');
	//weatherUI.mainTab('.maintab', '.maintab-wrap');
	weatherUI.tab('.tab-wrap01', '.tab-cont-wrap01');
	weatherUI.tab('.tab-wrap02', '.tab-cont-wrap02');
	weatherUI.tab('.tab-wrap03', '.tab-cont-wrap03');
	weatherUI.tab('.tab-wrap04', '.tab-cont-wrap04');
	weatherUI.tab('.tab-wrap05', '.tab-cont-wrap05');
	weatherUI.tab('.tab-wrap06', '.tab-cont-wrap06');
	weatherUI.tab('.tab-wrap07', '.tab-cont-wrap07');
	weatherUI.mapTab('.map-tab-js');
	//weatherUI.scrollSlide('.weather-info-list' , '.swiper-pagination');
	weatherUI.selectOption('.selectoption')
	weatherUI.scrollY('.scroll-js');
	weatherUI.scrollY('.scroll-js2');
	weatherUI.scrollY('.scroll-js3');
	weatherUI.scrollY('.scroll-js4');
	weatherUI.scrollY('.scroll-js5');
	weatherUI.scrollY('.scroll-js6');
	weatherUI.scrollY('.scroll-js7');
	weatherUI.scrollY('.rolling-js');
	weatherUI.scrollY('.rolling-js2');
	weatherUI.scrollY('.rolling-js3');
	weatherUI.scrollY('.rolling-js4');
	weatherUI.scrollY('.rolling-js5');
	weatherUI.scrollY('.rolling-js6');
	weatherUI.scrollCheck('[class*="scroll-js"]');
	weatherUI.scrollCheck('[class*="rolling-js"]');
	
	
	// 모바일 메뉴 뒤로가기 처리
	//<button class="util-item3 mobile-menu " data-pop-name="open-menu-pop" aria-label="메뉴"></button>
	
	function hideMobileMenu(){
    	if(!$('body').hasClass("hidd")) return;
    	$('.pw-dimmed').fadeOut(300)
		$('body').removeClass("hidd");
		setTimeout(function(){
			weatherUI.dimdOff();
		},300)
		$('header').stop().animate({'right':-100 + "%"}).fadeOut(100).removeClass('on');
    }

	if (window.history && window.history.pushState) {
	    $('button.mobile-menu').on('click', function (e) {
	        window.history.pushState('forward', null, '#menu');
	    });
	    
	    $(window).on('popstate', function () {
	    	if("#menu" == window.location.hash) {
	    		hideMobileMenu();
	    	}
	    });
	}	
	
})();
