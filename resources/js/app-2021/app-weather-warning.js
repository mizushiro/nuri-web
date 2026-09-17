/**
 *  날씨 - 기상특보(url: /weather/warning)
 */
'use strict';
(function($, window, document){
	var vmap = null, vmap2 = null;
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		weatherWarning.refresh();
	});
	GlobalEvent.on('onWeatherWarningLoad', function(e, sender) {
		function createKMAP() {
			createLegend("kmap");
			KMAP_createMap("kmap", {
				zoom: isMobileEnv() ? 6 : 7,
				whitemap:true, 
				lat: 36.073972,
				lon: 127.932021,
				onLoad: function(map) {
					vmap = map;
					KMAP_addLayer(vmap, [ { name: "wrn" } ]);
					vmap.removeLocation();
				} 
			});
			createLegend("kmap2", { el: "#legend2"} );
			KMAP_createMap("kmap2", {
				zoom: isMobileEnv() ? 6 : 7,
				whitemap:true, 
				lat: 36.073972,
				lon: 127.932021,
				onLoad: function(map) {
					vmap2 = map;
					KMAP_addLayer(vmap2, [ { name: "wrn", options: { fe: 'f'} } ]);
					vmap2.removeLocation();
				}
			});	
		}

		$('#current-warnings').tablesorter({
			theme : 'blue',
		});
		
		$('.cmp-toggle-gis a[data-map-mode-action]').on('click', function(e) {
			e.preventDefault();
			var mode = $(this).attr('data-map-mode-action');
			if(mode == 'img') {
				// to image
				$(this).attr('data-map-mode-action','gis').attr('title', 'GIS').html('<span>고해상도 지도 보기</span>');
				$('.cmp-weather-warning-status [data-map-mode="gis"]').hide();
				$('.cmp-weather-warning-status [data-map-mode="img"]').show();
			} else {
				// to gis
				$(this).attr('data-map-mode-action','img').attr('title', 'IMG').html('<span>이미지 지도 보기</span>');
				$('.cmp-weather-warning-status [data-map-mode="gis"]').show();
				$('.cmp-weather-warning-status [data-map-mode="img"]').hide();
				if(vmap == null || vmap2 == null) {
					createKMAP();
				}
			}
		});
	});

	var weatherWarning = new WeatherWarning("weather-warning");
	$('#weather-warning').on('click', 'button[data-role="refresh-data"]', function(e) {
		weatherWarning.refresh();
		$('html, body').animate({
			scrollTop: $("#weather-warning").offset().top
		}, 1000);
	});
})(jQuery, window, document);
