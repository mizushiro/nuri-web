/**
 *  일기도 전문가용
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var TYPE_DATA = {
			"S": [
				["kim_gdps_erly_asia_gph850_ft06_pa4_", "850hPa 기온"],
				["kim_gdps_erly_asia_dft850_ft06_pa4_", "850hPa 기온변화"],
				["kim_gdps_erly_asia_tgc2d_ft06_pa4_", "지상 2m기온, 10m바람"],
				["kim_gdps_erly_asia_wnd850_ft06_pa4_", "850hPa 유선,풍속"],
				["kim_rww3_wind_ft03_pa4_", "해상풍(풍향, 풍속)"],
				["kim_gdps_lc20_fxkorh_", "습도예상"],
			],
			"M": [
				["kim_n500_anlmod_pb4_", "북반구일기도"],					
				["dfs_medm_stn_best_tmxn01_", "주간기온(서울/경기)"],
				["dfs_medm_stn_best_tmxn02_", "주간기온(충청/강원)"],
				["dfs_medm_stn_best_tmxn03_", "주간기온(경북/경남)"],
				["dfs_medm_stn_best_tmxn04_", "주간기온(전라/제주)"],
			],
			"N": [
				["kim_surf_newsur_pa4_", "분석일기도(지상)"],
				["kor1_anlmod_pb4_", "분석일기도(국지)"],
				["kim_gdps_anal_axfe01_pb4_", "보조일기도 1"],
				["kim_gdps_anal_axfe02_pb4_", "보조일기도 2"],
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
			"kor1_anlmod_pb4_": ["-18", "-12", "-6", "0"],
			"kim_gdps_anal_axfe01_pb4_": ["-18", "-12", "-6", "0"],
			"kim_gdps_anal_axfe02_pb4_": ["-18", "-12", "-6", "0"],
	}
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cht_expert",
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
				value: "S",
				onchange: function(e, obj, player) {
					var selectedData = "";
					if(TYPE_DATA[obj.value]) {
						var html = "";
						for(var i in TYPE_DATA[obj.value]) {
							var values = TYPE_DATA[obj.value][i];
							if(i == 0) {
								selectedData = values[0];
							}
							html += '<option value="' + values[0] + '">' + values[1] + '</option>';
						}
						$(obj.form.data).html(html);
					}
					var timeNav = TIME_NAV_DATA[selectedData];
					if(timeNav && timeNav.length > 0) {
						var buttons = "";
						for(var i = 0 ; i < timeNav.length ; i++) {
							var dtm = timeNav[i];
							var moveValue = dtm;
							var moveText = dtm=="0"?"현재":(dtm + "H");
							buttons += '<div class="btn-lap"><button class="type" data-move="' + moveValue + '" data-move-unit="hours">' + moveText + '</button></div>\n';	
						}
						$(obj.form).find('.image-player-move').html(buttons);
					} else {
						$(obj.form).find('.image-player-move').html("");
					}
					$(obj.form.tm).val('');
					player._updateNow();
					
				}
			},
			data: {
				value: "kim_gdps_erly_asia_gph850_ft06_pa4_",
				onchange: function(e, obj, player) {
					var timeNav = TIME_NAV_DATA[obj.value];
					if(timeNav && timeNav.length > 0) {
						var buttons = "";
						for(var i = 0 ; i < timeNav.length ; i++) {
							var dtm = timeNav[i];
							var moveValue = dtm;
							var moveText = dtm=="0"?"현재":(dtm + "H");
							buttons += '<div class="btn-lap"><button class="type" data-move="' + moveValue + '" data-move-unit="hours">' + moveText + '</button></div>\n';	
						}
						$(obj.form).find('.image-player-move').html(buttons);
					} else {
						$(obj.form).find('.image-player-move').html("");
					}
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
