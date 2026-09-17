/**
 *  바다 - 바다예측 - 너울 예측정보(url: /ocean/predict/swell)
 */
'use strict';
(function($, window, document){
	
	$('.day1-rip a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on');
			$('.day1-rip-cont').css({height:'auto', overflow:'auto'});
		} else {
			// close
			$(this).removeClass('on');
			$('.day1-rip-cont').css({height:'0px', overflow:'hidden'});
		}
	});
	
	$('.day2-rip a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on');
			$('.day2-rip-cont').css({height:'auto', overflow:'auto'});
		} else {
			// close
			$(this).removeClass('on');
			$('.day2-rip-cont').css({height:'0px', overflow:'hidden'});
		}
	});
	
	$('.day3-rip a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on');
			$('.day3-rip-cont').css({height:'auto', overflow:'auto'});
		} else {
			// close
			$(this).removeClass('on');
			$('.day3-rip-cont').css({height:'0px', overflow:'hidden'});
		}
	});
	
	$('.cmp-swell-chart .left-swell .wrap-swell-spot li').each(function(index,value) {
		$('.cmp-swell-chart .left-swell .wrap-swell-spot .swell-spot-' + (index+1) +' img').hover(function() {
			$('.cmp-swell-chart .left-swell .wrap-swell-spot .swell-spot-' + (index+1) +' span').css({"visibility":"visible"});
		}, function(){
			$('.cmp-swell-chart .left-swell .wrap-swell-spot .swell-spot-' + (index+1) +' span').css({"visibility":"hidden"});
		});
	});
	

	function initMap() {
		var options = {
				lat: 37.493546, 
				lon: 126.921654, 
				onLoad: null ,
				zoom: 9,
				minZoom: 3,
				maxZoom: 16,
				whitemap: true,
				fullscreen: false,
				scaleLine: true,
			};
		var vmap = new kmap({
			target: "kmap",
			scaleLine: options.scaleLine,
			fullScreen: options.fullScreen,
			zoom: options.zoom,
			minZoom: options.minZoom,
			maxZoom: options.maxZoom,
			wsUnit: "m/s",
			center: [options.lon, options.lat],
			mapLayers: [
				{title: "거리지도", layer: "New_baroemap", visible: !options.whitemap},
				{title: "백지도", layer: "WhiteMap", visible: options.whitemap}
			],
			workspace: "kma_2024"
		});
		var markers = [];
		var selectedMarker = null;
		var stationPop = null;
		function createMarker(vmap) {
			var PROJ = "EPSG:980201";
			
			for(var group in stationGroups) {
				var stations = stationGroups[group];
				stations.forEach(function(s) {
					var marker = new ol.Feature({
						geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(s.station.longitude), parseFloat(s.station.latitude)],PROJ))
					});
					marker.userInfo = s;
					markers.push(marker);
					var vectorSource = new ol.source.Vector({
						visible: true,
						features: [marker]
					});
					var markerVectorLayer = new ol.layer.Vector({
						source: vectorSource,
						style: new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5,1],
								src: `${window.appBase}/resources/image/marine/ico_swell_${s.todayLevel}.png`,
								scale: 0.4,
							})
						})
					});
					markerVectorLayer.setZIndex(1001);
					vmap._map.addLayer(markerVectorLayer);
					
					if(s.station.nameEn == selectedNameEn) {
						selectedMarker = marker;
					}
				});
			}
			
			stationPop = new ol.Overlay({
				element: document.getElementById("station-popup")
			})
			vmap._map.addOverlay(stationPop);
			
			$(stationPop.getElement()).on('click', 'a.station-pop-close', function(e) { e.preventDefault(); $(this).parent().hide(); });
			
			vmap._map.on('click', function(e) {
				var feature = vmap._map.forEachFeatureAtPixel(e.pixel, function(feature) {
					return feature;
				});
				if(feature && feature.userInfo) {
					var coordinates = feature.getGeometry().getCoordinates();
					stationPop.setPosition(coordinates);
					showStationPopup(feature.userInfo);
					updateMenu(feature.userInfo.station);
					updateData(feature.userInfo.station);
				} else {
					stationPop.getElement().style.display = "none";
				}
			});
			vmap._map.on('pointermove', function(e) {
				var hit = vmap._map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
					return true;
				});
				if(hit) {
					this.getTargetElement().style.cursor = 'pointer';
				} else {
					this.getTargetElement().style.cursor = '';
				}
			});
			var coordinates = selectedMarker.getGeometry().getCoordinates();
			stationPop.setPosition(coordinates);
			vmap.setCenter([parseFloat(selectedMarker.userInfo.station.longitude), parseFloat(selectedMarker.userInfo.station.latitude)]);
			vmap.setZoom(9);
			if(selectedMarker) showStationPopup(selectedMarker.userInfo);
		}
		function showStationPopup(userInfo) {
			if(userInfo.todayDate && userInfo.todayHour && userInfo.todayIndex && userInfo.todayLevel) {
				var tm = moment(userInfo.todayDate + ' ' + userInfo.todayHour, ['YYYYMMDD HH', 'YYYYMMDD H']).format('D[일] H[시]');
				$('#station-popup-content').html(`<h3>${userInfo.station.name}</h3>
													<ul>
														<li>${tm}</li>
														<li>기준: <strong data-level="${userInfo.todayLevel}">${userInfo.todayIndex}</strong></li>
													</ul>`);				
			} else {
				$('#station-popup-content').html(`<h3>${userInfo.station.name}</h3>
													<ul>
														<li>&nbsp;</li>
														<li>자료 없음</li>
													</ul>`);
			}
			
			$('#station-popup').show();
		}
		function updateMenu(station) {
			if(!station) return;
			$('.kmap-menu').find('>li').removeClass('on');
			$('.kmap-menu').find('>li>ul>li').removeClass('on');
			$('.kmap-menu').find('>li>ul>li>a').each(function(e) {
				var data = $(this).data();
				if(data.nameEn == station.nameEn) {
					$(this).parent().addClass('on');
				}
			});
		}
		function updateData(station) {
			$.ajax({
				url: "swell-data.do",
				method: "get",
				data: { nameEn: station.nameEn },
				success: function(html) {
					$('#swell-data-panel').html(html);
				},
				error: function(err) {
					alert('오류가 발생하였습니다.');
				}
			});
		}
		function updateMarker(station) {
			for(var i in markers) {
				var marker = markers[i];
				if(marker.userInfo.station.nameEn == station.nameEn) {
					selectedMarker = marker;
					break;
				}
			}
			var coordinates = selectedMarker.getGeometry().getCoordinates();
			stationPop.setPosition(coordinates);
			vmap.setCenter([parseFloat(selectedMarker.userInfo.station.longitude), parseFloat(selectedMarker.userInfo.station.latitude)]);
			showStationPopup(selectedMarker.userInfo);
		}
		function initMenu(vmap) {
			$('.kmap-menu').on('click', '>li>a', function(e) {
				e.preventDefault();
				if($(this).parent().hasClass('on')) {
					$(this).parent().removeClass('on');					
				} else {
					$(this).parent().parent().find('>li').removeClass('on');
					$(this).parent().parent().find('>li>ul>li').removeClass('on');
					$(this).parent().addClass('on');
				}
			});
			
			$('.kmap-menu').on('click', '>li>ul>li>a', function(e) {
				e.preventDefault();
				$(this).parent().parent().find('li').removeClass('on');
				$(this).parent().addClass('on');
				var data = $(this).data();
				if(history.pushState) {
					var historyPath = location.pathname + "?nameEn=" + data.nameEn;
					history.pushState(data, null, historyPath);
				}
				updateData(data);
				updateMarker(data);
			});
			$(window).on('popstate', function (e) {
				if(history.state) {
					var data = history.state;
					updateMenu(data);
					updateData(data);
					updateMarker(data);
				}
			});
		}
		function setInteraction(vmap) {
			var dragPanInteraction = new ol.interaction.DragPan({
				condition: function(event) {
					if(ol.events.condition.mouseOnly(event)) {
						return true;
					} else if(ol.events.condition.touchOnly(event)) {
						if(event.touches) {
							if(event.touches.length > 1) {
								return true;
							}
						} else if(this.getPointerCount() > 1){
							return true;
						}
					}
					return false;
				}
			});
			var dragPan;
			var mouseWheelZoom;
			vmap._map.getInteractions().forEach(function(ia) {
				if(ia instanceof ol.interaction.DragPan) {
					dragPan = ia;
				}
				if(ia instanceof ol.interaction.MouseWheelZoom) {
					mouseWheelZoom = ia;
				}
			});
			if(dragPan) {
				vmap._map.removeInteraction(dragPan);
			}
			if(mouseWheelZoom) {
				vmap._map.removeInteraction(mouseWheelZoom);
			}
			
			vmap._map.addInteraction(dragPanInteraction);
		}
		initMenu(vmap);
		createMarker(vmap);
		setInteraction(vmap);
		if(isMobileEnv()) {
			$('.kmap-guide').show();
		} else {
			$('.kmap-guide').remove();
		}
	}
	
	initMap();
})(jQuery, window, document);
