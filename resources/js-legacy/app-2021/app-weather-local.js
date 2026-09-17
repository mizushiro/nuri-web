/**
 *  날씨-전국날씨 Default
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		window.location.reload();
	});
	
	// 날씨해설 조회
	var prefix = window.appBase?window.appBase:"/";
	$.ajax({
		url: prefix + "wnuri-fct/weather/weather-cmt.do",
		data: {},
		dataType: "html"
	}).then(function(html) {
		$('#weather-cmt').html(html);
	});
})(jQuery, window, document);
