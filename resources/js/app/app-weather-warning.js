/**
 *  날씨 - 기상특보(url: /weather/warning)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		weatherWarning.refresh();
	});
	var weatherWarning = new WeatherWarning("weather-warning");
	$('#weather-warning').on('click', 'button[data-role="refresh-data"]', function(e) {
		weatherWarning.refresh();
		$('html, body').animate({
	        scrollTop: $("#weather-warning").offset().top
	    }, 1000);
	});
})(jQuery, window, document);
