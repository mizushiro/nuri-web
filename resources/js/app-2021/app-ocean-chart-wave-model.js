/**
 *  바다 일기도 - 수치파랑
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var TYPE_DATA = {
		"G6": [
			["kim_gww3_glob_wave_ft06_pb4_", "해상풍과 파고"],
			["kim_gww3_glob_wdpr_ft06_pa4_", "최대파주기와 평균파향"],
			["kim_gww3_glob_wind_ft06_pa4_", "해상풍(풍향,풍속)"],
		],
		"A6": [
			["kim_gww3_asia_wave_ft06_pa4_", "해상풍과 파고"],
			["kim_gww3_asia_wdpr_ft06_pa4_", "최대파주기와 평균파향"],
			["kim_gww3_asia_wind_ft06_pa4_", "해상풍(풍향,풍속)"],
		],
		"R3": [
			["kim_rww3_wave_ft03_pa4_", "해상풍과 파고"],
			["kim_rww3_wdpr_ft03_pa4_", "최대파주기와 평균파향"],
			["kim_rww3_wind_ft03_pa4_", "해상풍(풍향,풍속)"],
			
			["kim_rww3_total_ft03_pa4_", "3시간 해상풍과 파고"],
			["kim_rww3_total_ft12_pa4_", "12시간 해상풍과 파고"],
			["kim_rww3_series01_wavhgt_pa4_", "해역별 파고시계열(앞바다)"],
			["kim_rww3_series01_wind_pa4_", "해역별 해상풍시계열(앞바다)"],
			["kim_rww3_series02_wavhgt_pa4_", "해역별 파고시계열(먼바다)"],
			["kim_rww3_series02_wind_pa4_", "해역별 해상풍시계열(먼바다)"],
		],
		"C": [
			["kim_cww3_[AREA]_wave_", "해상풍/유의파고",{ useArea: true, useStn: false}],
			["kim_cww3_[AREA]_wdpr_", "파주기/파향",{ useArea: true, useStn: false}],			
			["kim_cww3_[AREA]_wind_", "해상풍(풍향,풍속)",{ useArea: true, useStn: false}],
			["kim_cww3_[AREA]_total_spec_[STN]_pa4_", "BUOY 스펙트럼 예상종합장",{ useArea: true, useStn: true}],
			//["kim_cww3_[AREA]_total_wave_pa4_", "해상풍(풍향,풍속)",{ useArea: true, useStn: false}],
			["kim_cww3_[AREA]_wswl_", "너울파고/파향",{ useArea: true, useStn: false}],
			["kim_cww3_[AREA]_wavhgt_swell_point_pa4_", "해역별 너울파고 시계열",{ useArea: true, useStn: false}],
		],
		"RWW3": [
			["kim_rww3_wave_anal_", "파랑실황도"],
		]
	}
	var AREAS = [["dajn","대전청"],["gwju","광주청"],["jeju","제주청"],["busn","부산청"],["gawn","강원청"]];
	var STNS = {
			"dajn": [["B22101","덕적도"], ["B22108","외연도"]],
			"gwju": [["B22102","칠발도"], ["B22103","거문도"]],
			"jeju": [["B22107","마라도"]],
			"busn": [["B22104","거제도"], ["B22106","포항"]],
			"gawn": [["B22105","동해"]]
	}
	
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "cht_ocean_wave",
		showOptionControl: true,
		showOption: false,
		timeTerm: parseFloat("5"),
		interval: parseFloat("0.5"),
		autoStart: false, 
		zoomLevel: "0",
		zoomX: "0000000",
		zoomY: "0000000",
		panZoomEnabled: false,
		zoomEnabled: false,
		singleLineLimit: 0,
		isForecast: true,
		form: {
			type: {
				value: "R3",
				onchange: function(e, obj, player) {
					var selectedData = "";
					var selectedOption = null;
					if(TYPE_DATA[obj.value]) {
						var html = "";
						for(var i in TYPE_DATA[obj.value]) {
							var values = TYPE_DATA[obj.value][i];
							if(i == 0) {
								selectedData = values[0];
								selectedOption = values[2];
							}
							html += '<option value="' + values[0] + '">' + values[1] + '</option>';
						}
						$(obj.form.data).html(html);
					}
					if(selectedOption && selectedOption.useArea) {
						$(obj.form).find('div[data-role="area"]').show();
						obj.form.area.selectedIndex = 0;
						if(selectedOption.useStn) {
							var stns = STNS[selectedData];
							if(stns) {
								var html = "";
								for(var i in stns) {
									var stnItem = stns[i];
									html += '<option value="' + stnItem[0] + '">' + stnItem[1] + '</option>'; 
								}
								$(obj.form.stn).html(html);
							}
							$(obj.form).find('div[data-role="stn"]').show();
						} else {
							$(obj.form).find('div[data-role="stn"]').hide();
						}
					} else {
						$(obj.form).find('div[data-role="area"]').hide();
						$(obj.form).find('div[data-role="stn"]').hide();
					}
					if(obj.value =="RWW3") {
                    	var moveHtml = '<div class="btn-lap"><button class="type" data-move="-3" data-move-unit="hours">-3H</button></div>\n';
                    	moveHtml += '<div class="btn-lap"><button class="type" data-move="-1" data-move-unit="hours">-1H</button></div>\n';
                    	moveHtml += '<div class="btn-lap"><button class="type" data-move="-30" data-move-unit="minutes">-30M</button></div>\n';
                    	moveHtml += '<div class="btn-lap"><button class="type" data-move="0" data-move-unit="hours">현재</button></div>\n';
                    	$('.image-player-move').html(moveHtml);
					} else {
						var moveHtml = '<div class="btn-lap"><button class="type" data-move="-48" data-move-unit="hours">-48H</button></div>\n';
						moveHtml += '<div class="btn-lap"><button class="type" data-move="-24" data-move-unit="hours">-24H</button></div>\n';
                    	moveHtml += '<div class="btn-lap"><button class="type" data-move="-12" data-move-unit="hours">-12H</button></div>\n';
                    	moveHtml += '<div class="btn-lap"><button class="type" data-move="0" data-move-unit="hours">현재</button></div>\n';
                    	$('.image-player-move').html(moveHtml);
					}
					$(obj.form.tm).val('');
					player._updateNow();
				}
			},
			data: {
				value: "kim_rww3_wave_ft03_pa4_",
				onchange: function(e, obj, player) {
					var selectedData = obj.value;
					var selectedType = obj.form.type.value;
					var selectedOption = null;
					if(TYPE_DATA[selectedType]) {
						for(var i in TYPE_DATA[selectedType]) {
							var values = TYPE_DATA[selectedType][i];
							if(selectedData == values[0]) {
								selectedOption = values[2];
								break;
							}
						}
					}
					
					if(selectedOption && selectedOption.useArea) {
						if(selectedData == 'kim_cww3_[AREA]_wavhgt_swell_point_pa4_') {
							var html = "";
							html += '<option value="gawn">강원청</option>';
							$(obj.form.area).html(html);
						}
						else {
							var html = "";
							for(var i in AREAS) {
								var values = AREAS[i];
								html += '<option value="' + values[0] + '">' + values[1] + '</option>';
							}
							$(obj.form.area).html(html);
						}
						obj.form.area.selectedIndex = 0;
						if(selectedOption.useStn) {
							var selectedStn = obj.form.area.value;
							var stns = STNS[selectedStn];
							if(stns) {
								var html = "";
								for(var i in stns) {
									var stnItem = stns[i];
									html += '<option value="' + stnItem[0] + '">' + stnItem[1] + '</option>'; 
								}
								$(obj.form.stn).html(html);
							}
							$(obj.form).find('div[data-role="stn"]').show();
						} else {
							$(obj.form).find('div[data-role="stn"]').hide();
						}
					} else {
						$(obj.form).find('div[data-role="area"]').hide();
						$(obj.form).find('div[data-role="stn"]').hide();
					}
					//player._update();
				}
			},
			area: {
				value: "dajn",
				onchange: function(e, obj, player) {
					var selectedData = obj.form.data.value;
					var selectedType = obj.form.type.value;
					var selectedOption = null;
					if(TYPE_DATA[selectedType]) {
						for(var i in TYPE_DATA[selectedType]) {
							var values = TYPE_DATA[selectedType][i];
							if(selectedData == values[0]) {
								selectedOption = values[2];
								break;
							}
						}
					}
					var selectedStn = obj.form.area.value;
					var stns = STNS[selectedStn];
					if(stns) {
						var html = "";
						for(var i in stns) {
							var stnItem = stns[i];
							html += '<option value="' + stnItem[0] + '">' + stnItem[1] + '</option>'; 
						}
						$(obj.form.stn).html(html);
					}
					if(selectedOption && selectedOption.useStn) {
						$(obj.form).find('div[data-role="stn"]').show();
					} else {
						$(obj.form).find('div[data-role="stn"]').hide();
					}
					//player._update();
				}
			},
			stn: {
				value: "",
				onchange: function(e, obj, player) {
					//player._update();
				}
			}
		}
	});

	window.currentImagePlayer = player;

	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		$imageWrap.css({'min-height': 'auto', 'overflow':'hidden'});
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
	addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
