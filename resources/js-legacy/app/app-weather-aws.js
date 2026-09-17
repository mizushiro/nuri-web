/**
 *  날씨 - 현재 - 지전별 상세관측(url: /weather/aws)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		sfcAwsWeather.refresh();
	});
	var sfcAwsWeather = new SfcAwsWeather('sfc-aws-weather');
	addUpdownToggleEvent('.updown-toggle');
})(jQuery, window, document);
