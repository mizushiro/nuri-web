/**
 *  날씨 - 현재(url: /weather/now)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		sfcCityWeather.refresh();
	});
	var sfcCityWeather = new SfcCityWeather('sfc-city-weather');
	addSwitchToggleEvent('.switch-toggle');
	addUpdownToggleEvent('.updown-toggle');
})(jQuery, window, document);
