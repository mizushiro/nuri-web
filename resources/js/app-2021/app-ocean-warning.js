/**
 *  바다 - 해상특보(url: /ocean/warning)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	
	var seaWarningNow = new SeaWarningNow('sea-warning-now', 'ocean-warning');
	var marineWarning = new MarineWarning('marine-warning');
	createLegend("kmap");
	KMAP_createMap("kmap", {
		whitemap: true,
		zoom: 6,
		lat: 36.073972,
		lon: 127.932021,
		onLoad: function(vmap) {
			KMAP_addLayer(vmap, [ { name: "wrn_sea" } ]);
			vmap.removeLocation();
		} 
	});	
	
	$('.cmp-toggle-gis a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on').html('<span>고해상도 지도 닫기</span>');
			$('.kmap-app').css({height:'auto', overflow:'auto'});
		} else {
			// close
			$(this).removeClass('on').html('<span>고해상도 지도 보기</span>');
			$('.kmap-app').css({height:'0px', overflow:'hidden'});
		}
	});
})(jQuery, window, document);
