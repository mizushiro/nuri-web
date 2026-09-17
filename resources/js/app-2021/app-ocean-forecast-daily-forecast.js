/**
 *  바다 - 오늘의 바다(url: /ocean/today)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAddSeaBookmark', function(e, bookmark, sender) {
		seaBookmarkDropdown.refresh();
		if(bookmark) seaShortTerm.refresh(bookmark);
		if(bookmark) seaMidTerm.refresh(bookmark);
		if(bookmark) seaNearObs.refresh(bookmark);
	});
	
	GlobalEvent.on('onSaveSeaBookmark', function(e, sender) {
		seaBookmarkDropdown.refresh();
	});
	
	GlobalEvent.on('onSeaBookmarkSelected', function(e, bookmarkIndex, bookmark) {
		seaShortTerm.refresh(bookmark);
		seaMidTerm.refresh(bookmark);
		seaNearObs.refresh(bookmark);
	});
	
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaShortTerm.refresh();
		seaMidTerm.refresh();
		seaNearObs.refresh();
	});
	

	GlobalEvent.on('onSeaRecentShow', function(e, bookmark) {
		if(bookmark) {
			seaBookmarkDropdown.refreshSelected(bookmark);
			seaShortTerm.refresh(bookmark);
			seaMidTerm.refresh(bookmark);
			seaNearObs.refresh(bookmark);	
		}
	});
	GlobalEvent.on('onSeaBookmarkShow', function(e, bookmark) {
		if(bookmark) {
			seaBookmarkDropdown.refreshSelected(bookmark);
			seaShortTerm.refresh(bookmark);
			seaMidTerm.refresh(bookmark);
			seaNearObs.refresh(bookmark);
		}
	});
	
	GlobalEvent.on('onAddSeaRecent', function(e, bookmark){
		if(bookmark) {
			seaBookmarkDropdown.refreshSelected(bookmark);
			seaShortTerm.refresh(bookmark);
			seaMidTerm.refresh(bookmark);
			seaNearObs.refresh(bookmark);
		}
	});
	
	var subSeaConfig = new SeaConfig('sub-sea-config');
	var seaBookmarkDropdown = new SeaBookmarkDropdown("bookmark-dropdown");
	var seaShortTerm = new SeaShortTerm('sea-today-short-term', 'sea-today-short-term-title');
	var seaMidTerm = new SeaMidTerm('sea-today-mid-term');
	var seaNearObs = new SeaNearObs('sea-near-obs');
	var seaWarningNow = new SeaWarningNow('sea-warning-now');
	var vmap = null;
	
	$('button[data-role="sea-forecast-area"]').on('click', function(e) {
		var item = $(this);
		if(item.attr('data-top-code')) {
			var area = {
					top: { code: item.attr('data-top-code'), name: item.attr('data-top-name') },
					mid: { code: item.attr('data-mid-code'), name: item.attr('data-mid-name') },
					btm: { code: item.attr('data-btm-code'), name: item.attr('data-btm-name') },
					index: -1
			};
			seaBookmarkDropdown.refreshSelected(area);
			seaShortTerm.refresh(area);
			seaMidTerm.refresh(area);
			seaNearObs.refresh(area);
			
		}
	});
/*	
	KMAP_createMap("kmap", {
		onLoad: function(vmap) {
			KMAP_addLayer(vmap, [ "buoy", "lhaws", "seaBuoy" ]);
			getLocation(function(lat, lon) {
				vmap.setCenter([lon, lat]);
				vmap.addLocation([lon, lat]);
			});	
		}
	});
*/	
})(jQuery, window, document);
