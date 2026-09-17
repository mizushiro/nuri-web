/**
 *  바다 - 현재바다 - 부이 (url: /ocean/now/buoy)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaBuoy.refresh();
	});
	var seaBuoy = new SeaBuoy('sea-buoy');
	createLegend("kmap");
	KMAP_createMap("kmap", {
		zoom:8,
		onLoad: function(vmap) {
			KMAP_addLayer(vmap, [ { name: "buoy", options: { onKmapBuoyClick: onKmapBuoyClick, onLayerLoad: onLayerLoad} } ]);
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
					if(currentLocation) vmap.setCenter(currentLocation);
					return;
				}
				
				if(buoyData) {
					for(var i = 0 ; i < buoyData.length ; i++) {
						var data = buoyData[i];
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
	
	function onKmapBuoyClick(info) {
		if(!info) return;
		var s = $('#data-stn')[0];
		s.value = info.stnId;
		$('button.cho-btn[data-role="select-stn"]').trigger('click');
	}
	var buoyData = null;
	function onLayerLoad(data) {
		buoyData = data;
	}
	
	function switchToggle(switchButton) {
		if($(switchButton).hasClass('off')) {
			$('#sea-buoy-chart-holder').addClass('off');
			$('#sea-buoy-chart-check').hide();
			$(switchButton).parent().parent().removeClass("justify-content-space-between");
			$(switchButton).parent().parent().addClass("justify-content-start");
		} else {
			$('#sea-buoy-chart-holder').removeClass('off');
			$('#sea-buoy-chart-check').show();
			$(switchButton).parent().parent().removeClass("justify-content-start");
			$(switchButton).parent().parent().addClass("justify-content-space-between");
		}
	}
	
	addSwitchToggleEvent('.switch-toggle', switchToggle, { save: false });
	switchToggle($('.switch-toggle'));
	$('#sea-buoy-chart-check').on('change', 'input[type="checkbox"]', function() {
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
