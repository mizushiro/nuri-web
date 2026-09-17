/**
 *  영상-레이더-합성영상 (url: /image/radar)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "sat",
		showOptionControl: true,
		showOption: false,
		timeTerm: parseFloat("5"),
		interval: parseFloat("0.5"),
		autoStart: false, 
		zoomLevel: "0",
		zoomX: "0000000",
		zoomY: "0000000",
		zoomEnabled: false,
		singleLineLimit: 0,
		isForecast: false,
		form: {
			area: {
				value: "ko020lc",
				onchange: function(e, obj, player) {
					player._update();
				}
			},
			data: {
				value: "rgb-daynight",
				onchange: function(e, obj, player) {
					player._update();
				}
			}
		}
	});
})(jQuery, window, document);
