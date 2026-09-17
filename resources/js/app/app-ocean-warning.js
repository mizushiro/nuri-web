/**
 *  바다 - 해상특보(url: /ocean/warning)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	
	var seaWarningNow = new SeaWarningNow('sea-warning-now', 'ocean-warning');
	var marineWarning = new MarineWarning('marine-warning');
})(jQuery, window, document);
