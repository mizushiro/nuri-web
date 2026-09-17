/**
 *  일기도 예상일기도
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	
	var TYPE_DATA = {
		"G": [
			["kim_gdps_erly_asia_surfce_ft06_pa4_", "지상예상도"],
			["kim_gdps_erly_asia_gph500_ft06_pa4_", "와도예상도"],
			["kim_gdps_erly_asia_ttd700_ft06_pa4_", "습수예상도"],
			["kim_gdps_erly_asia_vel700_ft06_pa4_", "연직류예상도"],
			["kim_gdps_erly_asia_div200_ft06_pa4_", "발산예상도"],
			["kim_nhem_ps60_surfce_", "북반구:지상"],
			["kim_nhem_ps60_gph500_", "북반구:500hPa"],
			["kim_gdps_lc40_fxko4r1_", "강수예상도"],
			["kim_gdps_lc20_fxko78_", "습윤예상도"],
			["kim_gdps_lc20_fxkorh_", "습도예상도"],
		],
		"P": [
			["dfs_shrt_grd_best_tmxn_kor_", "최고최저기온"],
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
				value: "kim_gdps_erly_asia_surfce_ft06_pa4_",
				onchange: function(e, obj, player) {
					//player._update();
				}
			}
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
