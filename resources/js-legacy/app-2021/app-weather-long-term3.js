/**
 *  날씨 - 중장기전망(url: /weather/long-term/month1, month3)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	var longTerm = new LongTerm('long-term', 3);

})(jQuery, window, document);
	