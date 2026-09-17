/**
 *  레이더 별도 페이지 (url: /image/cbs)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cbs",
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
		kmapOptions: { zoom: 10, lat: 0, lon: 0, defaultZoom: 7, whitemap: true },
		kmapLayers: [ { name:"radar_cbs", options:{ type:"pop" } } ],
		form: {
			data: {
				value: "pop",
				onchange: function(e, obj, player) {
				    if(obj.value == 'pop' || obj.value == 'pty') {
				        $('#area-wrap').hide();
				        player.options.type = 'cbs';
                        player.options.kmapEnabled = true;
                        player.options.kmapLayers = [ { name:"radar", options:{ type:obj.value } } ];
                        player._update();
                    } else if(obj.value == 'stn') {
                        $('#area-wrap').show();
                        player.options.type = 'stn';
                        player.options.kmapEnabled = false;
                        player.removeKmap();
                        $(obj.form.tm).val('');
                        player._updateNow();
                    } else {
                        $('#area-wrap').hide();
                        player.options.type = 'cbs';
                        player.options.kmapEnabled = false;
                        player.removeKmap();
                        $(obj.form.tm).val('');
                        player._updateNow();
                    }
				}
			},
		     area: {
                value: "KWK",
                onchange: function(e, obj, player) {
                    $(obj.form.tm).val('');
                    player._updateNow();
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
