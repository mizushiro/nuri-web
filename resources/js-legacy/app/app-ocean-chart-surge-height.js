/**
 *  바다 일기도 - 폭풍해일
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var TYPE_DATA = {
		"S": [
			["kim_rtsm_post_grph_ft03_surg_pa4_", "폭풍해일모델"],
			["kim_rtsm_post_grph_ft03_surg_all_pa4_", "해일고종합"],
			["kim_rtsm_jibang", "시계열-지방(지)청"],
		],
	}
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cht_surge_height",
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
				value: "kim_rtsm_post_grph_ft03_surg_pa4_",
				onchange: function(e, obj, player) {
					var selectedData = obj.value;
					if(selectedData == "kim_rtsm_jibang") {
						$(obj.form).find('div[data-role="stn"]').show();
					} else {
						$(obj.form).find('div[data-role="stn"]').hide();	
					}
					//player._updateNow();
				}
			},
			stn: {
				value: "kim_rtsm_post_grph_series06_pa4_",
				onchange: function(e, obj, player) {
					//player._update();
				}
			}
		}
	});
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
