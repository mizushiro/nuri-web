/**
 *  날씨 - 기상특보 - 안개정보 (url: /weather/warning/fog)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		weatherFogInfo.refresh();
	});
	var weatherFogInfo = new WeatherFogInfo("fog-info");
	
	$('button[data-role="refresh-data"]').on('click', function(e) {
		weatherFogInfo.refresh();
		$('html, body').animate({
	        scrollTop: $("#fog-info").offset().top
	    }, 1000);
	});
})(jQuery, window, document);
