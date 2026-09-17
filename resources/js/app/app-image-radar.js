/**
 *  영상-레이더-합성영상 (url: /image/radar)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cmp",
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
		leafletEnabled: true,
		form: {
			data: {
				value: "SFC-HSR",
				onchange: function(e, obj, player) {
					//player._update();
				}
			}
		}
	});
	function minHeightImageWrap() {
		var frameWidth = $(window).width();
		var width = 0;
		if(frameWidth > 1260 && frameWidth <= 1550) {
			$("#map").css({height: "680px"});
			$("#mapWrapDiv").css({height: "680px"});			
		} else {
			var $imageWrap = $('.image-player-slide');
			width = $imageWrap.width();
			$imageWrap.css('min-height', width);
			$("#mapWrapDiv").css({ height: width});
		}
	}
	function updateMapWidth(checked) {
		console.log("updateMapWidth");
		
		var height = $('.image-player-slide').height();
		if(checked) {
			var width = 800;
			$("#map").css({height: height+"px", width: width + "px", overflow:"hidden"});
			$("#mapWrapDiv").css({height: height+"px", width: width + "px", overflow:"hidden"});
		} else {
			var width = 730;
			$("#map").css({height: height+"px", width: width + "px", overflow:"hidden"});
			$("#mapWrapDiv").css({height: height+"px", width: width + "px", overflow:"hidden"});	
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
