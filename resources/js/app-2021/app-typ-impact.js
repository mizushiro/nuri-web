/**
 *  태풍영향예보 - 위험시점정보 (url: /typhoon/ifs-typ)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		typImpact.refresh();
	});
	var typImpact = new TypImpact("impact");

})(jQuery, window, document);
