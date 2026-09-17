/**
 *  영상-종합영상 (url: /image/synthesis)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "rsl",
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
		leafletEnabled: false,
		kmapEnabled: true,
		kmapOptions: { zoom: 8.4, lat: 0, lon: 0, defaultZoom: 8.4 },
		kmapLayers: [ { name:"rsl", options:{ sat:"ir1", rdr:"lng" } } ],
		form: {
			sat: {
				value: "ir1",
				onchange: function(e, obj, player) {
                     player.options.kmapLayers = [ { name:"rsl", options:{ sat:obj.value, rdr:obj.form.rdr.value } } ];
                     player._update();
				}
			},
			rdr: {
				value: "lng",
				onchange: function(e, obj, player) {
					player.options.kmapLayers = [ { name:"rsl", options:{ sat:obj.form.sat.value, rdr:obj.value } } ];
                    player._update();
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
