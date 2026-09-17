/**
 *  바다 - 바다영상 - 파고실황 예측  (url: /ocean/image/wave)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
	});
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "seafct",
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
		isForecast: true,
		form: {
			data: {
				value: "wv",
				onchange: function(e, obj, player) {
					player._update();
				}
			},
			wv: {
				value: "1",
				onchange: function(e, obj, player) {
					player._update();
				}
			}
		}
	});
})(jQuery, window, document);
