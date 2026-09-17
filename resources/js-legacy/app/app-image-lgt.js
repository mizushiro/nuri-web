/**
 *  영상-낙뢰영상 (url: /image/lgt)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "lgt",
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
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
