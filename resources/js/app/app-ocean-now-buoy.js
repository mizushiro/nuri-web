/**
 *  바다 - 현재바다 - 부이 (url: /ocean/now/buoy)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaBuoy.refresh();
	});
	var seaBuoy = new SeaBuoy('sea-buoy');
})(jQuery, window, document);
