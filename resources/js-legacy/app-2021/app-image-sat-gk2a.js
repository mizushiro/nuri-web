/**
 *  영상 - 위성 - GK2A (url: /image/sa/gk2a)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var SAT = [
			// GK2A EA
			{ title: "적외", id: "GK2A_EA_IR105", matrixSet: "GK2A-3" },
	        { title: "가시", id: "GK2A_EA_VI006", matrixSet: "GK2A-1" },
	        { title: "수증기", id: "GK2A_EA_WV069", matrixSet: "GK2A-3" },
	        { title: "RGB천연(AI)", id: "GK2A_EA_S_RGBTRUE", matrixSet: "GK2A-2" },
	        { title: "RGB주야간합성(AI)", id: "GK2A_EA_S_DAYNIGHT", matrixSet: "GK2A-3" },
	        { title: "안개분석",  id: "GK2A_EA_FOG", matrixSet: "GK2A-3", legend: "FOG" },
	        { title: "황사분석", id: "GK2A_EA_ADPS", matrixSet: "GK2A-3", legend: "ADPS" },
	        // GK2A KO
	        { title: "적외", id: "GK2A_KO_IR105", matrixSet: "GK2A-3" },
	        { title: "가시", id: "GK2A_KO_VI006", matrixSet: "GK2A-1" },
	        { title: "수증기", id: "GK2A_KO_WV069", matrixSet: "GK2A-3" },
	        { title: "RGB천연(AI)", id: "GK2A_KO_S_RGBTRUE", matrixSet: "GK2A-2" },
	        { title: "주야간합성(AI)", id: "GK2A_KO_S_DAYNIGHT", matrixSet: "GK2A-3" },
	        { title: "안개분석", id: "GK2A_KO_FOG", matrixSet: "GK2A-3" },
	        { title: "황사분석", id: "GK2A_KO_ADPS", matrixSet: "GK2A-3" },
	        { title: "산불", id: "GK2A_KO_FF", matrixSet: "GK2A-3" },
	        // HIMA EA
	        { title: "(EA)주야간합성",  id: "HIMA_EA_DAYNIGHT", matrixSet: "GK2A-3" },
	        { title: "(EA)CH9", id: "HIMA_EA_CH9", matrixSet: "GK2A-3" },
	        { title: "(EA)CH13", id: "HIMA_EA_CH13", matrixSet: "GK2A-3" },
	        // HIMA KO
	        { title: "(KO)주야간합성", id: "HIMA_KO_DAYNIGHT", matrixSet: "GK2A-3" },
	        { title: "(KO)CH9", id: "HIMA_KO_CH9", matrixSet: "GK2A-3" },
	        { title: "(KO)CH13", id: "HIMA_KO_CH13", matrixSet: "GK2A-3" }
		];

	var formSelects = [
		[
			{ text:'전지구', value:'fd020ge', items: [
				//{ value: 'true+ir', text: 'RGB 주야간합성1'},
				//{ value: 'rgb-daynight', text: 'RGB 주야간합성'}, 
				{ value: 'ir105', text: '적외영상'}, 
				{ value: 'vi006', text: '가시영상'},
				{ value: 'wv063', text: '수증기'}, 
				//{ value: 'fog', text: '안개'},
				//{ value: 'adps', text: '황사'}
			]},
			{ text:'동아시아', value:'ea020lc', items: [
				{ value: 'rgb-s-true', text: 'RGB 천연색(AI)'},
				{ value: 'rgb-s-daynight', text: 'RGB 주야간합성(AI)'}, 
				{ value: 'rgb-cs', text: 'RGB 구름 강조영상'}, 
				{ value: 'rgb-hlc', text: 'RGB 상하층운영상'}, 
				{ value: 'ir105', text: '적외영상'}, 
				{ value: 'vi006', text: '가시영상'},
				{ value: 'wv063', text: '수증기'}, 
				{ value: 'fog', text: '안개'},
				{ value: 'adps', text: '황사'}
			]},
			{ text:'한반도', value:'ko020lc', items: [
				{ value: 'rgb-s-true', text: 'RGB 천연색(AI)'},
				{ value: 'rgb-s-daynight', text: 'RGB 주야간합성(AI)'}, 
				{ value: 'rgb-cs', text: 'RGB 구름 강조영상'}, 
				{ value: 'rgb-hlc', text: 'RGB 상하층운영상'},
				{ value: 'ir105', text: '적외영상'}, 
				{ value: 'vi006', text: '가시영상'},
				{ value: 'wv063', text: '수증기'}, 
				{ value: 'fog', text: '안개'},
				{ value: 'adps', text: '황사'}
			]}
		],
		[ 
			{ text:'아시아', value:'ea020lc', items: [
				{ value: 'GK2A_EA_IR105', text: '적외'},
				{ value: 'GK2A_EA_VI006', text: '가시'}, 
				{ value: 'GK2A_EA_WV069', text: '수증기'}, 
				{ value: 'GK2A_EA_S_RGBTRUE', text: 'RGB천연(AI)'},
				{ value: 'GK2A_EA_S_DAYNIGHT', text: 'RGB주야간합성(AI)'},
				{ value: 'GK2A_EA_FOG', text: '안개분석'},
				{ value: 'GK2A_EA_ADPS', text: '황사분석'}
			]},
			{ text:'한반도', value:'ko020lc', items: [
				{ value: 'GK2A_KO_IR105', text: '적외'},
				{ value: 'GK2A_KO_VI006', text: '가시'}, 
				{ value: 'GK2A_KO_WV069', text: '수증기'}, 
				{ value: 'GK2A_KO_S_RGBTRUE', text: 'RGB천연(AI)'}, 
				{ value: 'GK2A_KO_S_DAYNIGHT', text: 'RGB주야간합성(AI)'},
				{ value: 'GK2A_KO_FOG', text: '안개분석'},
				{ value: 'GK2A_KO_ADPS', text: '황사분석'},
//				{ value: 'GK2A_KO_FF', text: '산불'}
			]}
		]
	];
	 
	var player = new ImagePlayer("image-player-wrapper",null, {
		type: "sat",
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
		kmapEnabled: false,
		form: {
			mapType: {
				value: "img",
				onchange: function(e, obj, player) {
					updateAreaSelect();
					if(obj.selectedIndex == 0) {
						$('#opacity-wrap').hide();
						player.options.kmapEnabled = false;
						player.removeKmap();
						$(obj.form.tm).val('');
						player._updateNow();
						
					} else {
						$('#opacity-wrap').show();
						player.options.kmapEnabled = true;
						var satId = obj.form.data.value;
						var satIndex = _.findIndex(SAT, function(s) { return s.id == satId; });
						var opacity = parseFloat(obj.form.opacity.value);
						player.options.kmapLayers = [ { name:"sat", options:{ satIndex: satIndex, opacity: opacity } } ];
						player._update();
					}
				}
			},
			opacity: {
				value: "0.5",
				onchange: function(e, obj, player) {
					if(obj.form.mapType.selectedIndex == 1) {
						player.options.kmapEnabled = true;
						var satId = obj.form.data.value;
						var satIndex = _.findIndex(SAT, function(s) { return s.id == satId; });
						var opacity = parseFloat(obj.value);
						player.options.kmapLayers = [ { name:"sat", options:{ satIndex: satIndex, opacity: opacity } } ];
						player._update();
					}
				}
			},
			area: {
				value: "ko020lc",
				onchange: function(e, obj, player) {
					updateDataSelect();
					if(obj.form.mapType.selectedIndex == 0) {
						player.options.kmapEnabled = false;
						player.removeKmap();
						$(obj.form.tm).val('');
						player._updateNow();
					} else {
						player.options.kmapEnabled = true;
						var satId = obj.form.data.value;
						var satIndex = _.findIndex(SAT, function(s) { return s.id == satId; });
						var opacity = parseFloat(obj.form.opacity.value);
						player.options.kmapLayers = [ { name:"sat", options:{ satIndex: satIndex, opacity: opacity } } ];
						player._update();
					}
				}
			},
			data: {
				value: "rgb-s-true",
				onchange: function(e, obj, player) {
					if(obj.form.mapType.selectedIndex == 0) {
						// img mode
						if(obj.value == "fog") {
							$(obj.form.tm).val('');
							player._updateNow();
						} else {
							player._update();
						}
					} else {
						// gis mode
						var satId = obj.value;
						var satIndex = _.findIndex(SAT, function(s) { return s.id == satId; });
						var opacity = parseFloat(obj.form.opacity.value);
						player.kmapLayerUpdate([ { name:"sat", options:{ satIndex: satIndex, opacity: opacity } } ]);
						
					}
					updateAiGuide();
				}
			}
		}
	});
	function updateAreaSelect() {
		var f = $('form[name="image-player-form"]')[0];
		var mapTypeIndex = f.mapType.selectedIndex;
		var selects = formSelects[mapTypeIndex];
		var $area = $(f.area);
		$area.empty();
		for(var i in selects) {
			var s = selects[i];
			$area.append($('<option value="' + s.value + '" ' + (i == selects.length-1 ? 'selected="selected"' :'') + '>' + s.text + '</option>'));
		}
		
		var areaIndex = f.area.selectedIndex;
		var dataSelects = selects[areaIndex].items;
		var $s = $(f.data);
		$s.empty();
		for(var i in dataSelects) {
			var s = dataSelects[i];
			$s.append($('<option value="' + s.value + '">' + s.text + '</option>'));
		}
		updateAiGuide();
	}
	function updateDataSelect() {
		var f = $('form[name="image-player-form"]')[0];
		var mapTypeIndex = f.mapType.selectedIndex;
		var areaIndex = f.area.selectedIndex;
		var selects = formSelects[mapTypeIndex];
		var dataSelects = selects[areaIndex].items;
		var $s = $(f.data);
		$s.empty();
		for(var i in dataSelects) {
			var s = dataSelects[i];
			$s.append($('<option value="' + s.value + '">' + s.text + '</option>'));
		}
		
		updateAiGuide();
	}
	function minHeightImageWrap() {
		var $imageWrap = $('.image-player-slide');
		var width = $imageWrap.width();
		if(width < 400) width = 400;
		$imageWrap.css('min-height', width);
		$('#kmap').css('height', width);
	}
	function updateAiGuide() {
		var obj = $('form[name="image-player-form"]')[0].data;
		if(!obj) return;
		if(obj.value == "rgb-s-true" 
				|| obj.value == "rgb-s-daynight" 
				|| obj.value == "GK2A_KO_S_RGBTRUE" 
				|| obj.value == "GK2A_KO_S_DAYNIGHT"
				|| obj.value == "GK2A_EA_S_RGBTRUE"
				|| obj.value == "GK2A_EA_S_DAYNIGHT"
			) {
			$('.gk2a-ai-guide').show();
		} else {
			$('.gk2a-ai-guide').hide();
		}
	}
	$(window).on('resize', function(e) {
		minHeightImageWrap();
	});
	minHeightImageWrap();
	addSwitchToggleEvent('.switch-toggle');
	updateDataSelect();
})(jQuery, window, document);
