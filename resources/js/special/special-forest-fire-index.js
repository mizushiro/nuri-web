'use strict';
(function($, window, document){
	var wsUnit = "m/s",
		appPrefix = (window.appBase ? window.appBase : '/'),
		player
		;
		
	if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
		wsUnit = appConfig.config.unit.ws;
	}
	var $selectedTab = $('.cmp-sp-pos > .cmp-sp-pos-item > span > a.on').first();
	if($selectedTab.length == 0) {
		$selectedTab = $('.cmp-sp-pos > .cmp-sp-pos-item > span > a').first();
	}
	var lat = null, lon = null;
	if($selectedTab.length > 0 ) {		
		lat = $selectedTab.attr('data-lat');
		lon = $selectedTab.attr('data-lon');
		updateDigitalForecast($selectedTab.attr('data-dong-code'), lat, lon);
	}
	
	function showFFLocation(geojson) {
		if(player && player.vmap) {
			player.vmap.removeLocation();
			var geojsonObj = JSON.parse(geojson);
			var list = player.vmap.readGeojson(geojsonObj);
			for(var i in list) {
				//addSpecialPoint(coord, imageSrc, imageScale, options)
				player.vmap.addSpecialPoint(list[i].coord, null, null, { title: list[i].data["name"] });
			}
		}
	}
	
	function refreshNearAwsValues(tm) {
		$.ajax({
			url: (window.appBase?window.appBase:"/") + "special/near-aws-values.do",
			data: { lat: lat, lon:lon, tm: tm, limit:10},
			dataType: "json",
			success: function(data) {
				if(data && data.length > 0) {
					$('#aws-data-head').html(data[0].awsUpdated + " 갱신");
					var $awsDataBody = $('#aws-data-body').empty();
					for(var i = 0 ; i < data.length && i < 6 ; i++) {
						var awsItem = data[i];
						var resDistance = '';
						if(awsItem.distance && awsItem.distance != '-') {
							var res = awsItem.distance/1000;
							resDistance = res.toFixed(1);
						}
						var tr = '';
						tr += '<tr>';
						tr += '	<td><a href="#AWS/' + awsItem.awsStnId + '" data-stn-id="' + awsItem.awsStnId +'" data-lat="' + awsItem.lat + '" data-lon="' + awsItem.lon + '">' + awsItem.awsStnName + '</a></td>';
						tr += '	<td><span>' + resDistance + '</span>' + (awsItem.distance != '-' ? '<small>km</small>' : '') + '</td>';
						tr += '	<td><span>' + awsItem.awsTmp + '</span>' + (awsItem.awsTmp != '-' ? '<small>℃</small>' : '') + '</td>';
						tr += '	<td><span>' + awsItem.awsWind + '</span></td>';
						tr += '	<td><span>' + awsItem.awsReh + '</span>' + (awsItem.awsReh != '-' ? '<small>%</small>' : '') + '</td>';
						tr += '	<td><span>' + awsItem.awsPcpDay + '</span>' + ((awsItem.awsPcpDay != '-' && awsItem.awsPcpDay != '.') ? '<small>mm</small>' : '') + '</td>';
						tr += '</tr>';
						$awsDataBody.append(tr);
					}
				} else {
					alert($('#aws-data-tm-input').val() + " 관측자료가 존재하지 않습니다.");
				}
			},
			error: function(err) {
				console.log(err);
				alert("자동기상관측자료 조회 중 오류가 발생하였습니다.");
			}
		});
	}
	$('#aws-data-tm-input').datetimepicker({ timeInput: true
		,timeFormat: "HH'시' mm'분'"
		,dateFormat: "yy'년' m'월' d'일'"
		//,maxDateTime: new Date()
	});
	$('#btn-change-tm').on('click', function(e) {
		e.preventDefault();
		var tmText = $('#aws-data-tm-input').val();
		if(!tmText) {
			alert("시간을 선택하세요.");
			return;
		}
		var m = moment(tmText,'YYYY[년] M[월] D[일] HH[시] mm[분]');
		var tm = m.format('YYYYMMDDHHmm');
		refreshNearAwsValues(tm)
	});
	$('button[data-aws-dtm]').on('click', function(e) {
		e.preventDefault();
		var data = $(this).data();
		var m = moment();
		if(data.awsDtm != 0) {
			m = moment($('#aws-data-tm-input').val(),'YYYY[년] M[월] D[일] HH[시] mm[분]');
			m.add(data.awsDtm, "minutes");
		}
		$('#aws-data-tm-input').val(m.format('YYYY[년] M[월] D[일] HH[시] mm[분]'));
		var tm = m.format('YYYYMMDDHHmm');
		refreshNearAwsValues(tm)
	});
	
	
	/*
	-관측 : 지상
	-초단기 예측 : 바람, 강수
	-동네예보 : 기온, 풍향/풍속, 강수확률, 강수량
	-특보 : 주의보/경보
	-레이더 : 강수
	-위성 : RGB천연
	-산불영상
	-관측차량
	*/
	function updateSfc() {
		if(player) {
			player.kmapLayerUpdate([ { name:"sfc", options:{  } } ]);
		}
	}
	function updateVshrtWind() {
		if(player) {
			player.kmapLayerUpdate([ { name:"vshrt_wind", options:{  } } ]);
		}
	}
	function updateVshrtRain() {
		if(player) {
			player.kmapLayerUpdate([ { name:"vshrt_rain", options:{  } } ]);
		}
	}
	function updateWarning() {
		if(player) {
			player.kmapLayerUpdate([ { name:"wrn", options:{ } } ]);
		}
	}
	function updateRadar() {
		if(player) {
			player.kmapLayerUpdate([ { name:"radar", options:{ type:"pop"  } } ]);
		}
	}
	function updateSat() {
		if(player) {
			player.kmapLayerUpdate([ { name:"sat", options:{ satIndex: 9 } } ]);
		}
	}
	function updateFFSat() {
		if(player) {
			player.kmapLayerUpdate([ { name:"sat", options:{ satIndex: 13 } } ]);
		}
	}
	function updateDfsTemp() {
		if(player) {
			player.kmapLayerUpdate([ { name:"dfs", options:{ dfsIndex: 0 } } ]);
		}
	}
	function updateDfsWind() {
		if(player) {
			player.kmapLayerUpdate([ { name:"dfs", options:{ dfsIndex: 4 } } ]);
		}
	}
	function updateDfsPop() {
		if(player) {
			player.kmapLayerUpdate([ { name:"dfs", options:{ dfsIndex: 5 } } ]);
		}
	}
	function updateDfsPcp() {
		if(player) {
			player.kmapLayerUpdate([ { name:"dfs", options:{ dfsIndex: 6 } } ]);
		}
	}
	function updateAutoObsVehicle() {
		alert("Do update AOV")
	}
	
	var aovSelect = [];
	for(var i = 0 ; i < activeVehicles.length ; i++) {
		var vehicle = activeVehicles[i];
		aovSelect.push({
			name: vehicle.name, 
			update: function() {
				window.open(appPrefix + 'special/aov/dashboard.do?stnId=' + this.vehicle.stnId, 'AOV_DASHBOARD_' + this.vehicle.stnId).focus();
				updateMapCenter(this.vehicle.latitude, this.vehicle.longitude);
			}, 
			vehicle: vehicle
		});		
	}
	var selections = [
		[ '관측', [ { name:'지상', update: updateSfc } ]],
		[ '초단기예측', [ { name:'바람', update: updateVshrtWind }, { name:'강수', update: updateVshrtRain } ]],
		[ '동네예보', [ { name:'기온', update: updateDfsTemp }, { name:'풍향/풍속', update: updateDfsWind}, { name:'강수확률', update: updateDfsPop}, { name:'강수량', update: updateDfsPcp} ]],
		[ '특보', [ { name:'주의보/경보', update: updateWarning} ]],
		[ '레이더', [ { name:'강수', update: updateRadar } ]],
		[ '위성', [ { name:'RGB천연', update: updateSat} ]],
		[ { data: '산불영상', update: updateSat } , [] ],
		[ { data:'관측차량', update: updateSfc}, aovSelect ],
	];
	function updateDataSelections(eventSource) {
		var $typeSel = $('#select-type');
		var $obsBox = $('#obs-holder');
		var selectedIndex = $typeSel[0].selectedIndex;
		var selection = selections[selectedIndex];
		if(selectedIndex == 0) {
			$('.near-aws').show();
		} else {
			$('.near-aws').hide();
		}
		$obsBox.empty();
		for(var i in selection[1]) {
			var s = selection[1][i];
			$obsBox.append('<li><a href="#" data-role="data-toggle" data-obs="' + i + '" ' + (i == 0 ? 'class="on"' : '') + '>' + s.name+ '</a></li>');
		}
		var $li = $obsBox.find('> li');
		if($li.length % 2 == 1) {
			$obsBox.append('<li class="empty"></li>');
		}
		var $obsButton = $obsBox.find('a[data-role="data-toggle"].on').first();
		if($obsButton.length > 0) {
			var obs = $obsButton.attr('data-obs');
			executeDataToggle(obs, eventSource);
		}
		if(selection[0].update) {
			selection[0].update();
			if(selectedIndex == 0 || selectedIndex == 3 || selectedIndex == 7) {
				$('.image-player-control-wrapper').hide();
			} else {
				$('.image-player-control-wrapper').show();
			}
		}
	}
	function executeDataToggle(obs, eventSource) {
		var $typeSel = $('#select-type');
		var $obsBox = $('#obs-holder');
		var selectedIndex = $typeSel[0].selectedIndex;
		if(selectedIndex == 0 || selectedIndex == 3 || selectedIndex == 7) {
			$('.image-player-control-wrapper').hide();
		} else {
			$('.image-player-control-wrapper').show();
		}
		var selection = selections[selectedIndex];
		
		var selected = selection[1];
		var data = null;
		if(selected && selected.length > 0) {
			data = selected[parseInt(obs)];
		} else {
			data = selected;
		}
		if(data && data.update) {
			if(eventSource) {
				if(selectedIndex != 7) data.update();
			} else {
				data.update();
			}
		}
	}
	try {
		player = new ImagePlayer("image-player-wrapper",null, {
			type: "kmap",
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
			leafletEnabled: false,
			kmapEnabled: true,
			kmapOptions: { lat: lat, lon: lon, zoom:12.1 },
			form: {}
		});
	}catch(e) { console.log(e); }
	
	updateDataSelections();
	if(typeof ffLocationGeoJson !== "undefined" && ffLocationGeoJson) {
		showFFLocation(ffLocationGeoJson);
	}
	function updateMapCenter(lat, lon) {
		if(player.vmap) {
			player.vmap.setCenter([lon, lat]);
			//player.vmap.addLocation([lon, lat]);
		}
	}
	function requestDigitalForecast(code, wsUnit, lat, lon, interval) {
		console.log(lat + ", " + lon);
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/main/digital-forecast.do",
			data: {code: code, unit: wsUnit, hr1: interval == 1 ? 'Y' : 'N', lat: lat, lon: lon, useLatLon: 'Y'},
			dataType: "html"
		});
	}
	function updateDigitalForecast(dongCode, lat, lon, interval) {
		showLoading('digital-forecast', true);
		requestDigitalForecast(dongCode, wsUnit, lat, lon, interval).then(
			function(html) {
				showLoading('digital-forecast', false);
				var isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
				var isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
				var $dfWrapper = $('#digital-forecast');
				$dfWrapper.html(html);
				if(isModeChart) {
					$dfWrapper.find('> .cmp-dfs-slider').addClass('mode-chart');
					$.each($dfWrapper.find('.view-options a'), function(i,ele) {
						var $opt = $(this);
						if($opt.attr('data-value') == 'mode-chart') {
							if(!$opt.hasClass('on')) $opt.addClass('on');
						} else {
							$opt.removeClass('on');
						}
					});		
					$('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
					$('.cmp-dfs-slider a.sym-btn[data-view="mode-chart"]').addClass('on');
				} else if(isModeTable) {
					$dfWrapper.find('> .cmp-dfs-slider').addClass('mode-table');
					$.each($dfWrapper.find('.view-options a'), function(i,ele) {
						var $opt = $(this);
						if($opt.attr('data-value') == 'mode-table') {
							if(!$opt.hasClass('on')) $opt.addClass('on');
						} else {
							$opt.removeClass('on');
						}
					});
					$('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
					$('.cmp-dfs-slider a.sym-btn[data-view="mode-table"]').addClass('on');
				}
				$dfWrapper.find('a.tab-btn[data-interval-hours]').on('click', function(e) {
        	    	e.preventDefault();
        	    	var data = $(this).data();
        	    	$(this).parent().find('a.tab-btn').each(function(ele) {
        	    		$(ele).removeClass('on');
        	    	});
        	    	$(this).addClass('on');
        	    	
        	    	if($selectedTab.length > 0 ) {
        	    		updateDigitalForecast($selectedTab.attr('data-dong-code'), lat, lon, parseInt(data.intervalHours));
        	    	}
        	    });
        		updateTimelineOptionStatus(interval);
				window.setTimeout(function () {
					createDfsSlider();
				}, 0);
			},
			function(err) {
				console.log(err);
				showLoading('digital-forecast', false);
			}
		);	
	}
	function updateTimelineOptionStatus(timelineMode) {
    	if(timelineMode == 1) {
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').removeClass('on').attr('title','');
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').eq(1).addClass('on').attr('title','선택됨');
    	} else {
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').removeClass('on').attr('title','');
    		$('.cmp-dfs-slider .dfs-tab.daily-fcsm .dfs-tab-head .tab-btn').eq(0).addClass('on').attr('title','선택됨');
    	}
    	
    }
	function addEventHandler() {
		/*	
		$('.cmp-sp-pos > .cmp-sp-pos-item > span > a').on('click', function(e) {
			e.preventDefault();
			var dongCode = $(this).attr('data-dong-code');
			var lat = $(this).attr('data-lat');
			var lon = $(this).attr('data-lon');
			updateDigitalForecast(dongCode);
			updateMapCenter(lat, lon);
			$(this).parents('.cmp-sp-pos').find('> .cmp-sp-pos-item > span > a').removeClass('on');
			$(this).addClass('on');
		});
		*/
		$('.near-aws').on('click', 'a[data-stn-id]', function(e) {
			e.preventDefault();
			var data = $(this).data();
			if(player && player.vmap) {
				player.vmap.setCenter([data.lon, data.lat]);
			}
		});
		$('a[data-role="toggle-ff-image"]').on('click', function(e) {
			e.preventDefault();
			if(!$(this).hasClass('on')) {
				$(this).addClass('on').html('메테오그램 열기');
				$('.cmp-sp-image .cmp-sp-image-header').slideUp();
				$('.cmp-sp-image .cmp-sp-image-wrap').slideUp();
			} else {
				$(this).removeClass('on').html('메테오그램 접기');
				$('.cmp-sp-image .cmp-sp-image-header').slideDown();
				$('.cmp-sp-image .cmp-sp-image-wrap').slideDown();
			}
		});
				
		$('#select-type').on('change', function(e) {
			//
		});
		$('#btn-change-type').on('click', function(e) {
			e.preventDefault();
			updateDataSelections(this);
		});
		
		$('#obs-holder').on('click', 'a[data-role="data-toggle"]', function(e) {
			e.preventDefault();
			$(this).parents('.cmp-form-button-pack').find('a').removeClass('on');
			$(this).addClass('on');
			var obs = $(this).attr('data-obs');
			executeDataToggle(obs);
		})
	}
	
	addEventHandler();
	
	window.addEventListener('load', function() {
		window.setTimeout(function (){
			var mapData = $('#kmap .sfcName').data();
			if(mapData && (mapData.tm != '-')) {
				var mapMoment = moment(mapData.tm, 'YYYY[년] M[월] D[일] HH[시] mm[분]');
				var resTm = mapMoment.format('MM.DD.(ddd) HH:mm 갱신');
				var html = "";
				html = "<div class=\"cmp-map-layer-tm\"><p>";
				html += resTm;
				html += "</p></div>";
				$('.kmap-app').prepend(html);
			}
		}, 1000);
	});
	
})(jQuery, window, document);

