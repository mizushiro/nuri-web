/**
 *  바다 - 현재바다 - 등표 (url: /ocean/now/lhaws)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaLhaws.refresh();
	});
	var seaLhaws = new SeaLhaws('sea-lhaws');
})(jQuery, window, document);
