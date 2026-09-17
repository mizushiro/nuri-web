/**
 *  바다 바다예보 바다실황예측
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e, sender) {
		window.location.reload();
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
		selectedIndex: 3,
		kmapEnabled: true,
		kmapLayers: [ { name:"seafct_wave", options:{ type: "WAV", windEnabled: true } } ],
		form: {
			data: {
				value: "wh",
				onchange: function(e, obj, player) {
					console.log(player.options);
					if(obj.value == "wh") {
						player.kmapLayerUpdate([ { name:"seafct_wave", options:{ type: "WAV", windEnabled: true } } ]);	
					} else if(obj.value == "wh_only") {
						player.kmapLayerUpdate([ { name:"seafct_wave", options:{ type: "WAV", windEnabled: false } } ]);
					} else if(obj.value == "ws") {
						player.kmapLayerUpdate([ { name:"seafct_wave", options:{ type: "WSD", windEnabled: true } } ]);
					} else if(obj.value == "vs") {
						player.kmapLayerUpdate([ { name:"seafct_vis", options:{ type: "VIS"} } ]);
					}
				}
			}
		}
	});
	
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		if(width < 400) width = 400;
		$imageWrap.css({'min-height': width, 'height': width, });
		$('.wgis-inner-map').css({'min-height': width, 'height': width, });
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
	
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
