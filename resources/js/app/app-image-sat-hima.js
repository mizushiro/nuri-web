/**
 *  영상 - 위성 - HIMA (url: /image/sat/hima)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "sat_hima",
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
				value: "rd040ps",
				onchange: function(e, obj, player) {
					$(obj.form.tm).val('');
					player._updateNow();
				}
			},
			data: {
				value: "ch13",
				onchange: function(e, obj, player) {
					player._update();
				}
			}
		}
	});
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		$imageWrap.css('min-height', width);
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
})(jQuery, window, document);
