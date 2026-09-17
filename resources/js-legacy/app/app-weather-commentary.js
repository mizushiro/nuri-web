/**
 *  날씨 - 날씨해설(url: /weather/commentary)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	window.udpateWeatherOn = function(data) {
		var template = "", html = "";
//		template = $('#weather-on-header-template').html();
//		data.header.title = decodeHTML(data.header.title);
//		html = Mustache.render(template, data.header);
//		$('#weather-on-header').html(html);
//		weatherUI.scrollY('.scroll-js');
		
		template = $('#weather-on-list-template').html();
		for(var i in data.list) {
			var item = data.list[i];
			item.title = decodeHTML(item.title);
			item.video = item.video.replace("https://youtu.be","https://www.youtube.com/embed");
			item.content = decodeHTML(item.content).replace("\n", "<br />")
			item.scrollIndex = parseInt(i) + 2;
		}
		
		html = Mustache.render(template, data);
		$('#weather-on-list').html(html);
		for(var i in data.list) {
			weatherUI.scrollY('.scroll-js' + (parseInt(i)+2));
		}
		weatherUI.accordion('#weather-on-list .accordion-tit');
	}
	window.udpateWeatherQList  = function(data) {
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
			$('#weather-on-header').html(html);
			weatherUI.scrollY('.scroll-js');
		}
		
		template = $('#weather-on-list-template').html();
		
		html = Mustache.render(template, data);
		$('#weather-on-list').html(html);
		for(var i in data.list) {
			weatherUI.scrollY('.scroll-js' + (parseInt(i)+2));
		}
		weatherUI.accordion('#weather-on-list .accordion-tit');
		// pagination area
		
		var totalPage = Math.ceil(data.totalCount / data.pageSize);
		var pagePerBlock = 6;
		var curBlock = Math.floor((data.pageNumber-1)/pagePerBlock)+1;
		
		var pageStart = (curBlock-1)*pagePerBlock+1;
		var pagination = '';
		if(data.pageNumber > pagePerBlock) {
			pagination += '<button class="page-prev" data-page="' + (pageStart-pagePerBlock) + '" tabindex="0">&nbsp;</button>';
		} else {
			pagination += '<button class="page-prev" style="visibility: hidden">&nbsp;</button>';
		}
		
		for(var i = 0; i < pagePerBlock ; i++) {
			var pageNum = pageStart + i;
			if(pageNum > totalPage) break;
			if(pageNum == data.pageNumber) {
				pagination += '<button class="num on" data-page="' + pageNum + '" tabindex="0">' + pageNum + '</button>';
			} else {
				pagination += '<button class="num" data-page="' + pageNum + '" tabindex="0">' + pageNum + '</button>';
			}
		}
		if(pageStart + pagePerBlock -1 < totalPage) {
			pagination += '<button class="page-next" data-page="' + (pageStart+pagePerBlock) + '" tabindex="0">&nbsp;</button>';
		} else {
			pagination += '<button class="page-next" style="visibility: hidden">&nbsp;</button>';
		}
		

		$('.page-num.page').html(pagination).unbind('click').on('click','.num, .page-prev, .page-next',function(e) {
			var toPage = $(this).attr('data-page');
			showLoading('weather-on-list', true, 'light');
			addScript('https://www.kma.go.kr/wtouch/wtouchQListJs.jsp?page=' + toPage);
		});
	}
	window.udpateWeatherSList  = function(data) {
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
			$('#weather-on-header').html(html);
			weatherUI.scrollY('.scroll-js');
		}
		
		template = $('#weather-on-list-template').html();
		
		html = Mustache.render(template, data);
		$('#weather-on-list').html(html);
		for(var i in data.list) {
			weatherUI.scrollY('.scroll-js' + (parseInt(i)+2));
		}
		weatherUI.accordion('#weather-on-list .accordion-tit');
		// pagination area
		
		var totalPage = Math.ceil(data.totalCount / data.pageSize);
		var pagePerBlock = 6;
		var curBlock = Math.floor((data.pageNumber-1)/pagePerBlock)+1;
		
		var pageStart = (curBlock-1)*pagePerBlock+1;
		var pagination = '';
		if(data.pageNumber > pagePerBlock) {
			pagination += '<button class="page-prev" data-page="' + (pageStart-pagePerBlock) + '" tabindex="0">&nbsp;</button>';
		} else {
			pagination += '<button class="page-prev" style="visibility: hidden">&nbsp;</button>';
		}
		
		for(var i = 0; i < pagePerBlock ; i++) {
			var pageNum = pageStart + i;
			if(pageNum > totalPage) break;
			if(pageNum == data.pageNumber) {
				pagination += '<button class="num on" data-page="' + pageNum + '" tabindex="0">' + pageNum + '</button>';
			} else {
				pagination += '<button class="num" data-page="' + pageNum + '" tabindex="0">' + pageNum + '</button>';
			}
		}
		if(pageStart + pagePerBlock -1 < totalPage) {
			pagination += '<button class="page-next" data-page="' + (pageStart+pagePerBlock) + '" tabindex="0">&nbsp;</button>';
		} else {
			pagination += '<button class="page-next" style="visibility: hidden">&nbsp;</button>';
		}
		

		$('.page-num.page').html(pagination).unbind('click').on('click','.num, .page-prev, .page-next',function(e) {
			var toPage = $(this).attr('data-page');
			showLoading('weather-on-list', true, 'light');
			addScript('https://www.kma.go.kr/wtouch/wtouchSListJs.jsp?page=' + toPage);
		});
	}
	var decodeHTML = function (html) {
		var txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	};
	showLoading('weather-on-header', true, 'light');
	showLoading('weather-on-list', true, 'light');
	function addScript( src ) {
		var s = document.createElement( 'script' );
		s.setAttribute( 'src', src );
		document.body.appendChild( s );
	}
})(jQuery, window, document);
	
