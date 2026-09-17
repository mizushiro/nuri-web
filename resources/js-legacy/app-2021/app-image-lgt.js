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
		timeTerm: parseFloat("10"),
		interval: parseFloat("0.5"),
		autoStart: false, 
		zoomLevel: "0",
		zoomX: "0000000",
		zoomY: "0000000",
		zoomEnabled: false,
		singleLineLimit: 0,
		isForecast: false,
		kmapEnabled: true,
		kmapOptions: { zoom: 7, lat: 0, lon: 0, defaultZoom: 7 },
		kmapLayers: [ { name:"lgt", options:{}} ],
		form: {
			mapType: {
				value: "gis",
				onchange: function(e, obj, player) {
					if(obj.selectedIndex == 0) {
						player.options.kmapEnabled = false;
						player.removeKmap();
						$(obj.form.tm).val('');
						player._updateNow();
						
					} else {
						player.options.kmapEnabled = true;
						player.options.kmapLayers = [ { name:"lgt", options:{  tm: null } } ];
						player._update();
					}
				}
			},
		}
	});
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		if(width < 400) width = 400;
		$imageWrap.css('min-height', width);
		$('#kmap').css('min-height', width);
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
