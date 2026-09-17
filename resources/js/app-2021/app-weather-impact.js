/**
 *  날씨 - 기상특보 - 영향예보 (url: /weather/warning/impact)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		weatherImpact.refresh();
	});
	
	var opts = { dongCode: (typeof dongCode !== "undefined" ? dongCode : "")};
	opts.type = "area";
	var weatherImpact = new WeatherImpact("impact", opts);

})(jQuery, window, document);
