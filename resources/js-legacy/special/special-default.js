'use strict';
function initHeaderMenu() {
	var path = window.location.pathname;
	$.each($('#global-nav .sp-header-menu-item a'), function(idx, ele) {
		var $a = $(this);
		if($a.attr('href') == path) {
			$a.addClass('on').attr('title','선택됨');
		} else {
			$a.removeClass('on').attr('title', '');
		}
	});
}
/* 기상특보 */
function createWarning() {
	function requestWarning() {
		return $.ajax({
			url: window.appBase + "wnuri-fct/special/land-warning.do",
			dataType: "html"
		});
	}
	function updateWarningView(html) {
		var $wrapper = $('#global-warning');
		$wrapper.html(html);
		var $btn = $wrapper.find('.accordion-tit');
		var $closeBtn = $wrapper.find('.close');
		$btn.each(function(){
			if($(this).hasClass('on')){
				$(this).attr("title","펼쳐짐");
			}else{
				$(this).attr("title","접힘");
			}
		});
		$btn.unbind('click');
		$btn.on('click',function(e){
			var _this = $(this);
			if(!$(this).hasClass('on')){
				$(this).parents('.accordion-wrap').find('.accordion-tit').removeClass('on').next('.accordion-con').stop(true).fadeOut(100);
				$(this).addClass('on').next('.accordion-con').stop(true).fadeIn(100, function() { 
					var warnHeight = _this.next('.accordion-con').height() + 10;
					_this.parents('.cmp-main-tabs').css('min-height', warnHeight + 'px');
				});
				$(this).attr("title","펼쳐짐").parent().addClass('on');
			}else{
				$(this).removeClass('on').next('.accordion-con').stop(true).fadeOut(100, function() {
					_this.parents('.cmp-main-tabs').css('min-height', 'auto');	
				});
				$(this).attr("title","접힘").parent().removeClass('on');
			};
		});
		createTab('#global-warning .tab-wrap01', '#global-warning .tab-cont-wrap01');
		
		$closeBtn.on('click', function(e) {
			e.preventDefault();
			if($btn.hasClass('on')){
				$btn.removeClass('on').next('.accordion-con').stop(true).fadeOut(100, function() {
					$btn.parents('.cmp-main-tabs').css('min-height', 'auto');	
				});
				$btn.attr("title","접힘").parent().removeClass('on');
			}
		});
	}
	requestWarning().then(function(html) {
		updateWarningView(html);
	},function(err){
		console.log(err);	
	});
}
/* 날씨해설 */
function createWeatherCmt() {
	function closeBox() {
		createDimm().fadeOut(200, function() {
			$(this).remove();
		});
		var $moreBtn = $('a[data-event=on-more-click]');
		$moreBtn.show().prev().removeClass('more');
	}
	
	function createEvents() {
		$('a[data-event=on-more-click]').on('click', function(e) {
			e.preventDefault();
			$(this).hide();
			createDimm().fadeIn(200).on('click', function(e) { closeBox(); });
			var $box = $(this).prev();
			if(!$box.hasClass('more')) $box.addClass('more');
		});
		
		$('.sp-weather-cmt-txt-box-close').on('click', function(e) { e.preventDefault(); closeBox(); });	
	}
	
	function requestWeatheronYoutube() {
		return $.ajax({
			url: window.appBase + 'repositary/upload/neoboard/weatheronyoutube/cache.xml',
			dataType: 'xml'
		});
	}
	
	window.udpateWeatherQList = function(data) {
		if($('#sp-weather-cmt-wrap').length == 0) return;
		var template = $('#weather-on-header-template').html();
		for(var i in data.list) {
			var item = data.list[i];
			item.title = decodeHTML(item.title);
			item.video = item.video.replace("https://youtu.be","https://www.youtube.com/embed");
			item.content = decodeHTML(item.content).replace("\n", "<br />")
			item.scrollIndex = parseInt(i) + 2;
		}
		if(data.list && data.list.length > 0) {
			data.header = data.list[0];
			data.header.title = decodeHTML(data.header.title);
			var html = Mustache.render(template, data.header);		
			$('#sp-weather-cmt-wrap').html(html);
		}
		
	}

	var decodeHTML = function (html) {
		var txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	};
	function loadYoutubeCache() {
		requestWeatheronYoutube().then(
			function(xml) {
				var $xml = $(xml);
				var $article = $xml.find('article').first();
				var data = {};
				data.num = $article.attr('no');
				data.title = decodeHTML($article.attr('subject'));
				data.link = $article.attr('extension.youtubeLink');
				data.video = data.link.replace("https://youtu.be","https://www.youtube.com/embed");
				data.content = $article.find('content').html();
				data.content = decodeHTML(data.content).replace("\n", "<br />")
				var template = $('#weather-on-header-template').html();
				var html = Mustache.render(template, data);
				$('#sp-weather-cmt-wrap').html(html);
				createEvents();
			},
			function(err) {
				showLoading('sp-weather-cmt-wrap', false, 'light');
			}
		);
	}
	function loadData(url) {
		$.ajax({
			url: url,
			dataType: 'jsonp',
			complete: function() {
				createEvents();
			}
		});
	}
	$(document).ready(function(e) {
		showLoading('sp-weather-cmt-wrap', true, 'light');
		loadData('https://www.kma.go.kr/kma/wtouch/wtouchQListJs.jsp');
		//loadYoutubeCache();
	});
}
function initNewYear() {
	initHeaderMenu();
	createWeatherCmt();
	createWarning();
}

/** init new year special page */
initNewYear();
