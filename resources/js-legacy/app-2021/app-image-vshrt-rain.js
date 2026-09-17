/**
 *  영상-초단기예측-강수 (url: /image/vshr/rain.do)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "fct_vshrt_rain",
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
		leafletEnabled: false,
		kmapEnabled: true,
		kmapLayers: [ { name: "vshrt_rain", options: { } } ],
		kmapOptions: { onPostCreate: function(){  } },
		form: {
			mapType: {
				value: "gis",
				onchange: function(e, obj, player) {
					if(obj.selectedIndex == 1) {
						player.options.kmapEnabled = false;
						player.removeKmap();
						$(obj.form.tm).val('');
						player._updateNow();
					} else {
						player.options.kmapEnabled = true;
						player.options.kmapLayers = [ { name: "vshrt_rain", options: { } } ];
						player._update();
						player.$container.find('.movi-set-wrap').show();
						player.$container.find('.image-control-form-player').show();
					}
				}
			}
		}
	});
	function minHeightImageWrap() {
		var frameWidth = $(window).width();
		var width = 0;
		if(frameWidth > 1260 && frameWidth <= 1550) {
			$("#kmap").css({height: "680px"});			
		} else {
			var $imageWrap = $('.image-player-slide');
			width = $imageWrap.width();
			if(width < 400) width = 400;
			$imageWrap.css('min-height', width);
			$("#kmap").css({ height: width});
		}
	}
	function updateMapWidth(checked) {
		var height = $('.image-player-slide').height();
		if(checked) {
			var width = 800;
			$("#kmap").css({height: height+"px", width: width + "px", overflow:"hidden"});
		} else {
			var width = 730;
			$("#kmap").css({height: height+"px", width: width + "px", overflow:"hidden"});	
		}
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
	$('.movi-toggle').on('change', function(e) {
		updateMapWidth(this.checked);
		
	});
	
	addSwitchToggleEvent('.switch-toggle', function() {
		updateMapWidth($('.switch-toggle').hasClass('off'));
	});
})(jQuery, window, document);
