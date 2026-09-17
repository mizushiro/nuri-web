/**
 * 테마 - 해수욕장예보 (url: /theme/beach-weather.do)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	var appPrefix = (window.appBase ? window.appBase : '/');
	var vmap = KMAP_createMap("kmap", {
		fullScreen: true,
		zoom:10,
		onLoad: function(vmap) {
			//KMAP_addLayer(vmap, [ { name: "sfc" } ]);
			vmap.callbackSpecialPoint(function(e, data) {
				var url = 'https://www.weather.go.kr/special/CRP/beach/rpt_beach_' + data.dataCode + '.html';
				popup2(url);
			});
			//vmap.removeSpecialPoint();
			for(var i = 0 ; i < allBeaches.length ; i++) {
				vmap.addSpecialPoint([allBeaches[i].longitude, allBeaches[i].latitude]
					, null //appPrefix + "resources/image/special/ic_marker_beach.png"
					, 0.7
					, { data: Object.assign({}, allBeaches[i]), title: allBeaches[i].name, offsetX:0, offsetY:-35 }
				);
					
			}
			if(beaches && beaches.length > 0) {
				vmap.setCenter([beaches[0].longitude, beaches[0].latitude]);
			} else {
				showLoading('kmap',true);
				getLocation(function(lat, lon) {
					vmap.setCenter([lon, lat]);
					vmap.addLocation([lon, lat]);
					showLoading('kmap',false);
				});
			}	
		} 
	});
	
})(jQuery, window, document);
