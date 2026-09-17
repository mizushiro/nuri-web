/**
 *  황사 - 황사영상 - 지상일기도
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var TYPE_DATA = {
		"B": [
			["sfc3_smsand_psm", "황사-지상일기도"],
		]
	}
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cht_analysis",
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
			type: {
				value: "B",
				onchange: function(e, obj, player) {
					if(TYPE_DATA[obj.value]) {
						var html = "";
						for(var i in TYPE_DATA[obj.value]) {
							var values = TYPE_DATA[obj.value][i];
							html += '<option value="' + values[0] + '">' + values[1] + '</option>';
						}
						$(obj.form.data).html(html);
					}
					$(obj.form.tm).val('');
					player._updateNow();
				}
			},
			data: {
				value: "sfc3_smsand_psm",
				onchange: function(e, obj, player) {
					player._update();
				}
			}
		}
	});
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		$imageWrap.css('min-height', width * 0.9);
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
})(jQuery, window, document);
