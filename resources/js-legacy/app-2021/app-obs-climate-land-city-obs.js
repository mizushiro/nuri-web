/**
 * 관측기후 - 육상 - 도시별관측 (url: /obs-climate/land/city-obs.do)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	
	$('.cmp-form-button[data-action="hour-shift"]').on('click', function(e) {
		e.preventDefault();
		var f = $('#' + $(this).attr('data-form-id'))[0];
		f.dtm.value = $(this).attr('data-value');
		f.submit();
	});
	$('.cmp-form-button[data-action="refresh-now"]').on('click', function(e) {
		e.preventDefault();
		var f = $('#' + $(this).attr('data-form-id'))[0];
		f.tm.value = '';
		f.submit();
	});
	
	var RegBounds = {
			"100": null,
			"109": [ 126.9769, 37.5738, 9],  // 경도, 위도, 줌레벨
			"159": [ 128.6080, 35.8985, 9],
			"156": [ 127.01, 35.2170, 9],
			"133": [ 127.25, 36.5999, 9],
			"105": [ 128.399, 37.6496, 9],
			"184": [ 126.5584, 33.3856, 10]
	};
	var vmap = KMAP_createMap("kmap", {
		zoom:10,
		onLoad: function(vmap) {
			KMAP_addLayer(vmap, [ { name: "sfc" } ]);
			onMapLoad(vmap);
		} 
	});
	
	function onMapLoad(vmap) {
		var stnId = $('#select-reg').val();
		if(!stnId || stnId == '100') {
			showLoading('kmap',true);
			getLocation(function(lat, lon) {
				vmap.setCenter([lon, lat]);
				vmap.addLocation([lon, lat]);
				showLoading('kmap',false);
			});	
		} else {
			var llz = RegBounds[stnId+""];
			if(llz) {
				vmap.setCenter(llz.slice(0,2));
				vmap.setZoom(llz[2]);
			}
		}
	}

})(jQuery, window, document);
