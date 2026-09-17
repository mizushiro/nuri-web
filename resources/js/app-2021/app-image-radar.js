/**
 *  영상-레이더-합성영상 (url: /image/radar)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('EVENT', function(e, sender) {
	
	});
	var RDR_STN_INFO = {
			// 지점번호	종료시각	시작시각	지점코드	지점명	영문지짐명	특성코드	위도	경도	안테나 해발고도	관측반경
			GDK: ["47094", "2100.12.31.00:00", "2010.04.27.00:00", "GDK", "광덕산", "Gwangdeoksan", "1S000", 38.11736888 , 127.4336122, 1064, 250],
			BRI: ["47102", "2100.12.31.00:00", "2010.04.27.00:00", "BRI", "백령도", "Baengnyeongdo", "1C080", 37.96739649, 124.6301354, 188, 256],
			GNG: ["47105", "2100.12.31.00:00", "2010.04.28.00:00", "GNG", "강릉", "Gangneung", "1S030", 37.81770892, 128.8657342, 99, 280],
			KWK: ["47116", "2100.12.31.00:00", "2010.04.27.00:00", "KWK", "관악산", "Gwanaksan", "1S000", 37.44411208, 126.9640135, 640, 240],
			KSN: ["47144", "2100.12.31.00:00", "2010.04.27.00:00", "KSN", "오성산", "Gunsan", "1S060", 36.01270024, 126.7841684, 231, 240],
			MYN: ["47148", "2100.12.31.00:00", "2010.04.27.00:00", "MYN", "면봉산", "Myeon", "1C000", 36.17940052, 128.9973139, 1127, 200],
			PSN: ["47160", "2100.12.31.00:00", "2010.04.27.00:00", "PSN", "구덕산", "Pusan", "1S110", 35.11880841, 128.9999632, 547, 240],
			JNI: ["47175", "2100.12.31.00:00", "2010.04.27.00:00", "JNI", "진도", "jindo", "1S120", 34.47239181, 126.3238097, 497, 240],
			GSN: ["47185", "2100.12.31.00:00", "2010.04.27.00:00", "GSN", "고산", "Gosan", "1S000", 33.29426298, 126.1630229, 101, 250],
			SSP: ["47188", "2100.12.31.00:00", "2010.04.27.00:00", "SSP", "성산", "Seongsan", "1S120", 33.38710347, 126.8799855, 68, 250],
			IIA: ["47113", "2100.12.31.00:00", "2001.04.27.00:00", "IIA", "인천공항", "Incheon Airport", "1C020", 37.46065833, 126.3657833, 145.5, 130]
	}
	var data = "pop";
	var area = "KWK";
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
		leafletEnabled: false,
		kmapEnabled: true,
		kmapOptions: { zoom: 9, lat: 0, lon: 0, defaultZoom: 7 },
		kmapLayers: [ { name:"radar", options:{ type:"pop" } } ],
		form: {
			data: {
				value: data,
				onchange: function(e, obj, player) {
					data = obj.value;
					area = obj.form.area.value;
				    if(obj.value == 'HAIL') {
				    	$('#area-wrap').hide();
				    	player.removeKmap();
				    	player.options.type = 'cmp';
                        player.options.kmapEnabled = false;
                        $(obj.form.tm).val('');
                        player._updateNow();
                    } else if(obj.value == 'pty') {
                    	$('#area-wrap').hide();
                        player.removeKmap();
                        player.options.type = 'stn';
                        player.options.kmapEnabled = true;
                        player.options.kmapOptions = { zoom: 8.4, lat: 0, lon: 0, defaultZoom: 9 };
                        player.options.kmapLayers = [ { name:"radar", options:{ type:obj.value, area:obj.form.area.value } } ];
                        player._update();
                    } else if(obj.value == 'stn') {
                        $('#area-wrap').show();
                        player.removeKmap();
                        
                        minHeightImageWrap();
                        
                        player.options.type = 'stn';
                        player.options.kmapEnabled = true;
                        player.options.kmapOptions = { zoom: 9, lat: 0, lon: 0, defaultZoom: 9 };
                        player.options.kmapLayers = [ { name:"radar", options:{ type:obj.value, area:obj.form.area.value } } ];
                        player._update();
                    } else {
                    	$('#area-wrap').hide();
                    	player.removeKmap();
				        player.options.type = 'cmp';
                        player.options.kmapEnabled = true;
                        player.options.kmapOptions = { zoom: 9, lat: 0, lon: 0, defaultZoom: 9 };
                        player.options.kmapLayers = [ { name:"radar", options:{ type:obj.value } } ];
                        player._update();
                    }
				}
			},
		     area: {
                value: area,
                onchange: function(e, obj, player) {
                	data = obj.form.data.value;
					area = obj.value;
                	player.removeKmap();
                	player.options.type = 'stn';
                	player.options.kmapEnabled = true;
                	player.options.kmapOptions = { zoom: 9, lat: RDR_STN_INFO[area][7], lon: RDR_STN_INFO[area][8], defaultZoom: 9 };
                	player.options.kmapLayers = [ { name:"radar", options:{ type:obj.form.data.value, area:obj.value } } ];
                    player._update();
                }
            }
		}
	});
	function minHeightImageWrap() {
		var frameWidth = $(window).width();
		var width = 0;
		if(frameWidth > 1260 && frameWidth <= 1550) {
			$("#kmap").css({height: "730px"});			
		} else {
			var $imageWrap = $('.image-player-slide');
			width = $imageWrap.width();
			if(width < 400) width = 400;
			if(data == "stn") {
				$imageWrap.css('min-height', width > 500 ? width : 500);
				$("#kmap").css({ height: width > 500 ? width : 500});
			} else {
				$imageWrap.css('min-height', width);
				$("#kmap").css({ height: width});
			}
		}
	}
	function updateMapWidth(checked) {
		var height = $('.image-player-slide').height();
		if(checked) {
			var width = 800;
			$("#kmap").css({height: height+"px", width: width + "px", overflow:"hidden"});
		} else {
			var width = 570;
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
