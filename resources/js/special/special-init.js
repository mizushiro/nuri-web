'use strict';
if(typeof jQuery === 'undefined') {
	alert('jQuery required!');
}
/** global event */
(function($, window, document){
	var GlobalEvent = $({});
	
	if (typeof exports !== 'undefined') exports.GlobalEvent = GlobalEvent;
	else window.GlobalEvent = GlobalEvent;
})(jQuery, window, document);

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
function createDimm() {
	var $dim = $('.pw-dimmed'); 
	if($dim.length == 0) {
		$dim = $('<div class="pw-dimmed" aria-hidden="true"></div>').appendTo($('body'));	
	}
	return $dim;
}
function removeDimm() {
	$(".pw-dimmed").remove();
}
function registerLayerPopup() {
	var popOpenBtn = $('.pop-open');
	popOpenBtn.on('click',function(e){
		e.preventDefault();
		var popData = $(this).attr("data-pop-name");
		var $pops = $('[class*="modal-pop"][data-pop=' + popData + ']');
		$pops.fadeIn().addClass('popcont-open').each(function(){
			
			if($(this).find('.roll-wrap').height() <= $(this).find('.buoy-table-con').height()){
				$(this).find('.iScrollLoneScrollbar').hide();
			};
		}).find('.slick-wrapper').slick('setPosition');
		$('body').addClass("hidd");
		createDimm();
		$('.pw-dimmed').fadeIn(500);
		var srcEle = this;
		$pops.find('button.pop-close').first().focus().on('click', function() {
			srcEle.focus();
		});
		$('.pw-dimmed').on('click',function(){
			$('.popcont-open').fadeOut(300).removeClass('.popcont-open');
			$('.pw-dimmed').fadeOut(300);
			$('body').removeClass("hidd");
			setTimeout(function(){
				removeDimm();
			});
		})
	});
	var popCloseBtn = $('.pop-close');
	popCloseBtn.on('click',function(e){
		e.preventDefault();
		$(this).parent().hide();
		$('body').removeClass("hidd");
		$('.pw-dimmed').fadeOut(300)
		setTimeout(function(){
			removeDimm();
		});	
	})
}
function checkObj(obj){
		return $(obj).length == 0 ? false : true;
}
function accordion(obj){
	
	if(!checkObj(obj)){
		return;
	}

	var accordionBtn = null;
	
	function init(obj){
		accordionBtn = $(obj);
		accordionBtn.each(function(){
			if($(this).hasClass('on')){
				$(this).attr("title","펼쳐짐");
			}else{
				$(this).attr("title","접힘");
			}
		});
	};

	function event(){
		accordionBtn.unbind('click');
		accordionBtn.on('click',function(e){
			var _this = $(this);
			if(!_this.hasClass('on')){
				_this.parents('.accordion-wrap').find('.accordion-tit').removeClass('on').next('.accordion-con').stop(true).slideUp(100);
				_this.addClass('on').next('.accordion-con').stop(true).slideDown(100);
				_this.attr("title","펼쳐짐").parent().addClass('on');
			}else{
				_this.removeClass('on').next('.accordion-con').stop(true).slideUp(100);
				_this.attr("title","접힘").parent().removeClass('on');;
			};
			
		});
	};

	init(obj);
	event();
}

function accordionSecond(obj){
		
	if(!checkObj(obj)){
		return;
	}

	var accordionwrap = null;
	var accordionBtn = null;
	var accordioncon = null;
	
	function init(obj){
		accordionwrap = $(obj);
		accordionBtn = accordionwrap.find('.accordionsecond-tit');
		accordioncon = accordionwrap.find('.accordionsecond-con');
		accordionBtn.each(function(){
			if($(this).hasClass('on')){
				$(this).attr("title","펼쳐짐");
			}else{
				$(this).attr("title","접힘");
			}
		});
	};
	

	function event(){
		function resetevent(){
			accordioncon.slideUp(100)
			accordionBtn.removeClass('on').attr("title",'접힘');
		}
		$(document).click(function(e){ //문서 body를 클릭했을때
		 	if($(e.target).hasClass('accordionsecond-tit')){
				if($(e.target).parents('.acco-on').length <= 1){
					$(e.target).closest('.accordionsecond-wrap').find('.accordionsecond-tit.on').not(e.target).removeClass('on').attr("title",'접힘').parent().removeClass('acco-on').find(accordioncon).slideUp(100);
				};
				return false;
			} else if(!$(e.target).parents('.acco-on').length < 1){
				if(!$(e.target.parentElement).hasClass('link') 
						&& !$(e.target).hasClass('link')
						&& !$(e.target.parentElement).hasClass('open-link') 
						&& !$(e.target).hasClass('open-link')) {
					return false;
				}
			} else {
				resetevent();
			}
		});
		accordionBtn.on('click',function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on').attr("title","펼쳐짐");
				$(this).parent().siblings().removeClass('acco-on').find(accordioncon).slideUp(100)
				$(this).parent().siblings().find(accordionBtn).removeClass('on').attr("title",'접힘');
				$(this).parent().addClass('acco-on');
				$(this).next(accordioncon).stop().slideDown(100);
			}else{
				$(this).removeClass('on').attr("title",'접힘');
				$(this).parent().removeClass('acco-on');
				$(this).parent().find(accordioncon).slideUp(100);
			}
		});
	};

	init(obj);
	event();
}
function createTab(obj, con){
		
	var tab = null
	var	tabContent = null;
	var	b_dClass = null;

	function init(obj, con){
		tab = $(obj).find('> div > button');
		tabContent = $(con + ' > [class*="tab-cont0"]');
	};

	function event(obj){
		tab.on('click', function(e){
			e.preventDefault();
			var i = $(this).parent().index();
			console.log(i);
			tabMenu(i);
		});
	};

	function tabMenu(index){
		tab.parent('div').children('button').removeClass('on').removeAttr('title');
		tab.eq(index).parent('div').children('button').addClass('on').attr('title',"선택됨");
		tabContent.removeClass('on');
		tabContent.eq(index).addClass('on')
	};

	init(obj, con);
	event();
}

/* layer events */
registerLayerPopup();

/* accordion */
accordion('.accordion-tit');
accordionSecond('.accordionsecond-wrap');

var UNIT = { K: "km/h", M: "m/s" }, 
	DISPLAY_MODE_DEFAULT = "default",
	DISPLAY_MODE_MAP = "map",
	LANG = {
		ko: { code: "ko", name: { en: "Korean", ko: "한국어"}},
		en: { code: "en", name: { en: "English", ko: "영어"}},
		ja: { code: "ja", name: { en: "Japanese", ko: "일본어"}},
		cn: { code: "cn", name: { en: "Chinese", ko: "중국어"}},
	};

var appConfig = typeof AppConfig != 'undefined' ? new AppConfig('weather-config') : null;
//appConfig.updateView();
