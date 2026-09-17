/**
 *  영상-어는비 (url: /image/freezing-rain)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "freezing_rain",
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
		selectedIndex: 0,
		leafletEnabled: false,
		kmapEnabled: true,
		kmapOptions: { zoom: 10, lat: 0, lon: 0, defaultZoom: 7 },
		kmapLayers: [ { name:"freezing_rain", options:{ } } ],
		form: {
		}
	});
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		if(width < 400) width = 400;
		$imageWrap.css('min-height', width);
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
})(jQuery, window, document);
