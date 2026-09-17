/**
 *  황사 - 황사모델예측
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var TYPE_DATA = {
		"G": [
			["kim_adm3_pm10_dust_asia_", "황사모델예측"],
		]
	}
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cht_forecast",
		showOptionControl: true,
		showOption: false,
		timeTerm: parseFloat("5"),
		interval: parseFloat("0.5"),
		autoStart: false, 
		zoomLevel: "0",
		zoomX: "0000000",
		zoomY: "0000000",
		zoomEnabled: false,
		panZoomEnabled: true,
		singleLineLimit: 0,
		isForecast: true,
		form: {
			type: {
				value: "G",
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
				value: "kim_adm3_pm10_dust_asia_",
				onchange: function(e, obj, player) {
					player._update();
				}
			}
		}
	});
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		$imageWrap.css({'height':'auto', 'min-height':'auto', 'overflow':'hidden'});
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
})(jQuery, window, document);
