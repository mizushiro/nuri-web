/**
 *  황사 - 황사영상 - 위성영상
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
				value: "ea020lc",
				onchange: function(e, obj, player) {
					$(obj.form.tm).val('');
					player._updateNow();
				}
			},
			data: {
				value: "adps",
				onchange: function(e, obj, player) {
					player._update();
				}
			}
		}
	});
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		$imageWrap.css('min-height', width * 0.9);
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
