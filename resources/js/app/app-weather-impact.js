/**
 *  날씨 - 기상특보 - 영향예보 (url: /weather/warning/impact)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		weatherImpact.refresh();
	});
	var weatherImpact = new WeatherImpact("impact");

})(jQuery, window, document);
