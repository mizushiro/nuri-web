/**
 *  지식/소식
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	var indexSNS = new IndexSNS("index-sns");
	
	indexSNS.refresh();
	showLoading('weather-on', true);
	addScript("https://www.kma.go.kr/wtouch/wtouchOnJs.jsp");
	var typeNumSlick = weatherUI.slickNumTab('.slick-type-num');
//	if(typeNumSlick.find('.slick-slide').length > 1) {
//		typeNumSlick.on('vmousedown touchstart', function(e) {
//			mainSlick.slick("slickSetOption","swipe", false);
//		}).on('afterChange', function() {
//			mainSlick.slick("slickSetOption","swipe", true);
//		});
//	}
	weatherUI.slickChange2('.sns-list');
//	.on('vmousedown touchstart', function(e) {
//		mainSlick.slick("slickSetOption","swipe", false);
//	}).on('afterChange', function() {
//		mainSlick.slick("slickSetOption","swipe", true);
//	});

})(jQuery, window, document);
//날씨터치
window.udpateWeatherOn = function(data) {
	showLoading('weather-on', false);
	var $wrapper = $('#weather-on');
	if(data.list && data.list.length > 0) {
		var item = data.list[0];
		$wrapper.find('iframe').attr('src', item.video.replace("https://youtu.be","https://www.youtube.com/embed")).attr('title', '날씨해설 ' + item.title + ' 유튜브 동영상');
		$wrapper.find('.swiper-slide .txt').html(item.content);
	}
}

function addScript( src ) {
	var s = document.createElement( 'script' );
	s.setAttribute( 'src', src );
	document.body.appendChild( s );
}
