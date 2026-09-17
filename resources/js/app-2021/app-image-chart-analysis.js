/**
 *  일기도 분석영상
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var TYPE_DATA = {
		"M": [
			["surf", "지상12"],
			["kim_sfc3_anlden_pa4", "지상03"],
			["ghmd_s24", "지상24시간예상"],
			["kim_up92_anlmod_pa4", "925hPa"],
			["kim_up85_anlmod_pa4", "850hPa"],
			["kim_up70_anlmod_pa4", "700hPa"],
			["kim_up50_anlmod_pa4", "500hPa"],
			["kim_up30_anlmod_pa4", "300hPa"],
			["kim_up20_anlmod_pa4", "200hPa"],
			["kim_up10_anlmod_pa4", "100hPa"],
		],
		"N": [
			["kim_surf_newsur_pa4_", "분석일기도(지상)"],
			["kim_kor1_anlmod_pb4_", "분석일기도(국지)"],
		],
		"B": [
			["kim_n500_anlmod_pb4", "북반구500"],
			["kim_n500_difmod_pb4", "북반구편차"],
			["kim_gdps_anal_axfe01_pb4_", "보조(가)"],
			["kim_gdps_anal_axfe02_pb4_", "보조(나)"],
		]
	}
	var TIME_NAV_DATA = {
			"kim_gdps_erly_asia_gph850_ft06_pa4_": ["-18", "-12", "-6", "0"],
			"kim_gdps_erly_asia_dft850_ft06_pa4_": ["-18", "-12", "-6", "0"],
			"kim_gdps_erly_asia_tgc2d_ft06_pa4_": ["-18", "-12", "-6", "0"],
			"kim_gdps_erly_asia_wnd850_ft06_pa4_": ["-18", "-12", "-6", "0"],
			"kim_rww3_wind_ft03_pa4_": ["-48", "-24", "-12", "0"],
			"kim_gdps_lc20_fxkorh_": [],
			
			"kim_n500_anlmod_pb4_": [],
			"dfs_medm_stn_best_tmxn01_": [],
			"dfs_medm_stn_best_tmxn02_": [],
			"dfs_medm_stn_best_tmxn03_": [],
			"dfs_medm_stn_best_tmxn04_": [],
			
			"kim_surf_newsur_pa4_": ["-18", "-12", "-6", "0"],
			"kim_kor1_anlmod_pb4_": ["-18", "-12", "-6", "0"],
			"kim_gdps_anal_axfe01_pb4_": ["-18", "-12", "-6", "0"],
			"kim_gdps_anal_axfe02_pb4_": ["-18", "-12", "-6", "0"],
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
		panZoomEnabled: false,
		singleLineLimit: 0,
		isForecast: false,
		form: {
			type: {
				value: "M",
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
				value: "kim_surf_anlden_pa4",
				onchange: function(e, obj, player) {
					$(obj.form.tm).val('');
					player._updateNow();
					// player._update();
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
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
