'use strict';
(function($){
	var seaAreaSelect = null,
		seaBookmarkDropdown = null,
		seaShortTerm = null,
		seaMidTerm = null,
		seaWarningNow = null;
	GlobalEvent.on('onAddSeaBookmark', function(e, bookmark, sender) {
		seaBookmarkDropdown.refresh();
		if(bookmark) seaShortTerm.refresh(bookmark);
		if(bookmark) seaMidTerm.refresh(bookmark);
	});
	
	GlobalEvent.on('onSaveSeaBookmark', function(e, sender) {
		seaBookmarkDropdown.refresh();
	});
	
	GlobalEvent.on('onSeaBookmarkSelected', function(e, bookmarkIndex, bookmark) {
		seaShortTerm.refresh(bookmark);
		seaMidTerm.refresh(bookmark);
	});
	
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		seaShortTerm.refresh();
		seaMidTerm.refresh();
	});
	

	GlobalEvent.on('onSeaRecentShow', function(e, bookmark) {
		if(bookmark) {
			seaBookmarkDropdown.refreshSelected(bookmark);
			seaShortTerm.refresh(bookmark);
			seaMidTerm.refresh(bookmark);
		}
	});
	GlobalEvent.on('onSeaBookmarkShow', function(e, bookmark) {
		if(bookmark) {
			seaBookmarkDropdown.refreshSelected(bookmark);
			seaShortTerm.refresh(bookmark);
			seaMidTerm.refresh(bookmark);
		}
	});
	
	GlobalEvent.on('onAddSeaRecent', function(e, bookmark){
		if(bookmark) {
			seaBookmarkDropdown.refreshSelected(bookmark);
			seaShortTerm.refresh(bookmark);
			seaMidTerm.refresh(bookmark);
		}
	});
	function createEvents() {
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
			}
		});
	}
	/* maptab */
	function initMapTab(obj){
		var tab = null;
		var close = null;

		function init(obj){
			tab = $(obj).find('.imgtab-btn')
			close = $('.prev-btn-js')
		};

		function event(){
			tab.on('mouseover focus', function(){
				var i = $(this).attr('data-imgtab')
				 	$('.img-area1 img').attr('src', window.appBase + 'resources/image/level01_'+ i +'.png')
				})
				.mouseout(function(){
					$('.img-area1 img').attr('src', window.appBase + 'resources/image/level01_'+ 1 +'.png')
				});

			tab.on('click', function(e){
				e.preventDefault();
				var i = $(this).attr('data-imgtab')
				tabMenu(i);
			});
			close.on('click', function(e){
				e.preventDefault();
				$('[class*="img-area"').hide()
				$('.img-area1').show()	
			});

		};

		function tabMenu(index){
			$('[class*="img-area"').hide()
			$('.img-area' + index).show()
		};

		init(obj);
		event();
	}
	function init() {
		seaAreaSelect = new SeaAreaSelect('special-sea-area-select');
		seaBookmarkDropdown = new SeaBookmarkDropdown('bookmark-dropdown');
		seaShortTerm = new SeaShortTerm('sea-today-short-term', 'sea-today-short-term-title');
		seaMidTerm = new SeaMidTerm('sea-today-mid-term');
		seaWarningNow = new SeaWarningNow('sea-warning-now');
		initMapTab('.map-tab-js');
		createEvents();	
	}
	
	init();
})(jQuery);
