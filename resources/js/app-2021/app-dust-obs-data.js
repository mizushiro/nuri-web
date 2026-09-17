/**
 *  황사 - 황사관측자료 (url: /dust/obs-data.do)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		pm10ObsData.refresh();
	});
	var pm10ObsData = new Pm10ObsData('pm10-data');
})(jQuery, window, document);
