/**
 *  바다 일기도 - 해양순환
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cht_current",
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
			type: {
				value: "S",
				onchange: function(e, obj, player) {
					//player._updateNow();
				}
			},
			data: {
				value: "glosea_post_grph_nwpacific_current_",
				onchange: function(e, obj, player) {
					//player._updateNow();
				}
			},
			area: {
				value: "000",
				onchange: function(e, obj, player) {
					//player._update();
				}
			}
		}
	});
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
