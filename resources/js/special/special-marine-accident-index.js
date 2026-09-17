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
		updateWavePredict(lat, lon);
	}
	/*
	-특보 : 주의보/경보
	-초단기 예측 : 해상풍, 유의파고, 해양시정, 강수, 바람
	-관측 : 부이, 등표, 파고부이
	*/
	function updateWarning() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"wrn", options:{ } } ]);
		}
	}
	function updateSeaWind() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"seafct_wave", options:{ type: "WSD", windEnabled: false } } ]);
		}
	}
	function updateVis() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"seafct_wave", options:{ type: "WAV", windEnabled: false } } ]);
		}
	}
	function updateWaveHeight() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"seafct_vis", options:{ type: "VIS"} } ]);
		}
	}
	function updateVshrtRain() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"vshrt_rain", options:{  } } ]);
		}
	}
	function updateVshrtWind() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"vshrt_wind", options:{  } } ]);
		}
	}
	function updateBuoy() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"buoy", options:{  } } ]);
		}
	}
	function updateLhaws() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"lhaws", options:{  } } ]);
		}
	}
	function updateSeaBuoy() {
		if(player) {
			player.options.kmapEnabled = true;
			player.kmapLayerUpdate([ { name:"seaBuoy", options:{  } } ]);
		}
	}
	var selections = [
		[ '특보', [ { name:'주의보/경보', update: updateWarning} ]],
		[ '초단기예측', [ { name:'해상풍', update: updateSeaWind } , { name:'유의파고', update: updateWaveHeight }, { name:'유의파고', update: updateVis }, { name:'강수', update: updateVshrtRain }, { name:'바람', update: updateVshrtWind } ]],
		[ '관측', [ { name:'부이', update: updateBuoy }, { name:'등표', update: updateLhaws }, { name:'파고부이', update: updateSeaBuoy } ]],
	];
	function updateDataSelections() {
		var $typeSel = $('#select-type');
		var $obsBox = $('#obs-holder');
		var selectedIndex = $typeSel[0].selectedIndex;
		var selection = selections[selectedIndex];
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
			executeDataToggle(obs);
		} else if(selection[0].update) {
			selection[0].update();
			if(selectedIndex == 0 || selectedIndex == 3) {
				$('.image-player-control-wrapper').hide();
			} else {
				$('.image-player-control-wrapper').show();
			}
		}
	}
	function executeDataToggle(obs) {
		var $typeSel = $('#select-type');
		var $obsBox = $('#obs-holder');
		var selectedIndex = $typeSel[0].selectedIndex;
		if(selectedIndex == 0 || selectedIndex == 2) {
			$('#image-player-wrapper .image-player-control-wrapper').hide();
		} else {
			$('#image-player-wrapper .image-player-control-wrapper').show();
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
			data.update();
		}
	}
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
		kmapOptions: { lat: lat, lon: lon},
		form: {}
	});
	
	updateDataSelections();
	
	function updateMapCenter(lat, lon) {
		if(player.vmap) {
			player.vmap.setCenter([lon, lat]);
			player.vmap.addLocation([lon, lat]);
		}
	}
	function requestDigitalWaveForecast(lat, lon, wsUnit) {
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/main/digital-wave-forecast.do",
			data: { lat: lat, lon:lon, unit: wsUnit, hr1: 'Y' },
			dataType: "html"
		});
	}
	function updateWavePredict(lat, lon) {
		showLoading('digital-wave-forecast', true);
		requestDigitalWaveForecast(lat, lon,  wsUnit).then(
			function(html) {
				showLoading('digital-wave-forecast', false);
				var isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
				var isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
				var $dfWrapper = $('#digital-wave-forecast');
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
				window.setTimeout(function () {
					createDfsWaveSlider();
				}, 0);
			},
			function(err) {
				console.log(err);
				showLoading('digital-forecast', false);
			}
		);	
	}
	function addEventHandler() {
		$('.cmp-sp-pos > .cmp-sp-pos-item > span > a').on('click', function(e) {
			e.preventDefault();
			var lat = $(this).attr('data-lat');
			var lon = $(this).attr('data-lon');
			updateWavePredict(lat, lon);
			updateMapCenter(lat, lon);
			$(this).parents('.cmp-sp-pos').find('> .cmp-sp-pos-item > span > a').removeClass('on');
			$(this).addClass('on');
		});
		
		$('a[data-role="toggle-metg-image"]').on('click', function(e) {
			e.preventDefault();
			if(!$(this).hasClass('on')) {
				$(this).addClass('on').html('메테오그램 열기');
				$('.cmp-sp-image[data-image="metg"] .cmp-sp-image-wrap').slideUp();
			} else {
				$(this).removeClass('on').html('메테오그램 접기');
				$('.cmp-sp-image[data-image="metg"] .cmp-sp-image-wrap').slideDown();
			}
		});
				
		$('#select-type').on('change', function(e) {
			//
		});
		$('#btn-change-type').on('click', function(e) {
			e.preventDefault();
			updateDataSelections();
		});
		
		$('#obs-holder').on('click', 'a[data-role="data-toggle"]', function(e) {
			e.preventDefault();
			$(this).parents('.cmp-form-button-pack').find('a').removeClass('on');
			$(this).addClass('on');
			var obs = $(this).attr('data-obs');
			executeDataToggle(obs);
		});
	}
	/* 해양순환 해상일기도 생성 */
	var player2= new ImagePlayer("image-player-wrapper2",null, {
		type: "cht_current",
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
		leafletEnabled: false,
		kmapEnabled: false,
		form: {
		}
	});
	var player3= new ImagePlayer("image-player-wrapper3",null, {
		type: "cht_current",
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
		leafletEnabled: false,
		kmapEnabled: false,
		form: {
		}
	});
	addEventHandler();
})(jQuery, window, document);

