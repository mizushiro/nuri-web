/**
 *  영상 - 위성 - 바다수온 (url: /image/sat/water-temp)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "sat_water_temp",
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
					//player._update();
				}
			},
			data: {
				value: "sst-1dm",
				onchange: function(e, obj, player) {
					//player._update();
				}
			}
		}
	});

	window.currentImagePlayer = player;

	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		$imageWrap.css('min-height', width);
		$('#kmap').css('height', width);
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
