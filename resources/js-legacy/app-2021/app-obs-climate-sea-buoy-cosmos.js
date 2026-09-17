/**
 *  바다 - 현재바다 - 파복부이 (url: /ocean/now/buoy-cosmos)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaBuoyCosmos.refresh();
	});
	var seaBuoyCosmos = new SeaBuoyCosmos('buoy-cosmos');
	
	createLegend("kmap");
	KMAP_createMap("kmap", {
		zoom:9,
		onLoad: function(vmap) {
			KMAP_addLayer(vmap, [ { name: "seaBuoy", options: { onKmapSeaBuoyClick: onKmapSeaBuoyClick, onLayerLoad: onLayerLoad} } ]);
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
				if(seaBuoyData) {
					for(var i = 0 ; i < seaBuoyData.length ; i++) {
						var data = seaBuoyData[i];
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
	function onKmapSeaBuoyClick(info) {
		if(!info) return;
		var s = $('#data-stn')[0];
		s.value = info.stnId;
		$('button.cho-btn[data-role="select-stn"]').trigger('click');
	}
	var seaBuoyData = null;
	function onLayerLoad(data) {
		seaBuoyData = data;
	}
	function switchToggle(switchButton) {
		if($(switchButton).hasClass('off')) {
			$('#buoy-cosmos-chart-holder').addClass('off');
			$('#buoy-cosmos-chart-check').hide();
			$(switchButton).parent().parent().removeClass("justify-content-space-between");
			$(switchButton).parent().parent().addClass("justify-content-start");
		} else {
			$('#buoy-cosmos-chart-holder').removeClass('off');
			$('#buoy-cosmos-chart-check').show();
			$(switchButton).parent().parent().removeClass("justify-content-start");
			$(switchButton).parent().parent().addClass("justify-content-space-between");
		}
	}
	
	addSwitchToggleEvent('.switch-toggle', switchToggle, { save: false });
	switchToggle($('.switch-toggle'));
	$('#buoy-cosmos-chart-check').on('change', 'input[type="checkbox"]', function() {
		var id = this.id;
		var targetId = $(this).data().target;
		var $target = $('#' + targetId);
		var checked = this.checked;
		if(!checked) {
			$target.prev().show();
			$target.show();
		} else {
			$target.prev().hide();
			$target.hide();
		}
	});
})(jQuery, window, document);
