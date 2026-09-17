/**
 *  바다 - 현재바다 - 파복부이 (url: /ocean/now/buoy-cosmos)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaBuoyCosmos.refresh();
	});
	var seaBuoyCosmos = new SeaBuoyCosmos('buoy-cosmos');
})(jQuery, window, document);
