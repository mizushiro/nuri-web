/**
 *  바다 - 현재바다 - 등표 (url: /ocean/now/lhaws)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaLhaws.refresh();
	});
	var seaLhaws = new SeaLhaws('sea-lhaws');
	
	createLegend("kmap");
	KMAP_createMap("kmap", {
		zoom:8,
		onLoad: function(vmap) {
			KMAP_addLayer(vmap, [ { name: "lhaws", options: { onKmapLhawsClick: onKmapLhawsClick, onLayerLoad: onLayerLoad} } ]);
			showLoading('kmap',true);
			var currentLocation = null;
			getLocation(function(lat, lon) {
				currentLocation = [lon, lat];
				vmap.setCenter(currentLocation);
				vmap.addLocation(currentLocation);
				showLoading('kmap',false);
			},function() {showLoading('kmap',false);});
			$('button.cho-btn[data-role="select-stn"]').on('click', function(e) {
				var stnId = $('#data-stn').val();
				if(stnId == "0") {
					vmap.setCenter(currentLocation);
					return;
				}
				if(lhawsData) {
					for(var i = 0 ; i < lhawsData.length ; i++) {
						var data = lhawsData[i];
						if(data.stnId == stnId) {
							var coord = data.coord;
							vmap.setCenter(coord);
							break;
						}
					}
				}
			});
		} 
	});	
	function onKmapLhawsClick(info) {
		if(!info) return;
		var s = $('#data-stn')[0];
		s.value = info.stnId;
		$('button.cho-btn[data-role="select-stn"]').trigger('click');
	}
	var lhawsData = null;
	function onLayerLoad(data) {
		lhawsData = data;
	}
})(jQuery, window, document);
