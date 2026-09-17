/**
 *  날씨 - 기상특보 - 영향예보 (url: /weather/warning/impact)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		weatherImpact.refresh();
	});
	var bookmarkDropdown = null,
		bookmarkSelectedLat = 37.493546, 
		bookmarkSelectedLon = 126.921654,
		bookmarkSelectedDong = "서울특별시 동작구 신대방제2동",
		bookmarkSelectedDongCode = "1159068000",
		wsUnit = "m/s",
		appPrefix = (window.appBase ? window.appBase : '/'),
		indexLocalSearchbox = null,
		popLocalSearchbox = null,
		myPointSlider = null;
	
	var opts = { dongCode: (typeof dongCode !== "undefined" ? dongCode : "")};
	opts.type = "location";
	var weatherImpact = new WeatherImpact("impact", opts);
	
	createMyPointSlider();
	createSearchBox();
	createBookmarks();
	createGlobalEvent();
	
	function createBookmarks() {
        bookmarkDropdown = new BookmarkDropdown('index-bookmarks');
    }
	
	function createMyPointSlider() {
        myPointSlider = new MyPointSlider('my-point-slider');
    }
	
    function createSearchBox() {
        indexLocalSearchbox = new DongSearchbox('index-local-search');
        var $popLocalSearch = $('.modal-layer.pop-local-search');
        $popLocalSearch.find('.modal-layer-close').on('click', function(e) {
            e.preventDefault();
            $popLocalSearch.removeClass('on');
        });
        $('a[data-role="pop-local-search"]').on('click', function(e) {
            e.preventDefault();
            if(!$popLocalSearch.hasClass('on')) $popLocalSearch.addClass('on');
            window.setTimeout( function() {
                $popLocalSearch.find('input').first().trigger('focus');
            },0);
        });
        $popLocalSearch.on('click', '.cmp-local-search-input > .pop-open', function(e) {
        	e.preventDefault();
        	$popLocalSearch.removeClass('on');
        });
        popLocalSearchbox = new DongSearchbox('pop-local-search');
    }
    
    function createGlobalEvent() {
        GlobalEvent.on('onAreaBookmarkDeleted', function(e, bookmarkIndex, bookmark, sender) {
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
        });
        GlobalEvent.on('onAreaBookmarkAdded', function(e, bookmarkIndex, bookmark, sender) {
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
        });
        GlobalEvent.on('onAddAreaBookmark', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            updateImpact(bookmark);
        });
        GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            updateImpact(bookmark);
        });
        
        GlobalEvent.on('onSaveAreaBookmark', function(e) {
            bookmarkDropdown.refresh();
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated();
        });
        
        GlobalEvent.on('onAreaBookmarkSelected', function(e, bookmarkIndex, bookmark, sender) {
            if(!bookmark || !bookmark.dong) return;
            if(!bookmark.dong.lat || !bookmark.dong.lon){
                var latlon = convertDfsGrid('toLL', bookmark.dong.x, bookmark.dong.y)
                if(latlon['lat'] && latlon['lng']) {
                    bookmark.dong.lat = latlon['lat'];
                    bookmark.dong.lon = latlon['lng'];
                }
            }
                
            if(sender.id != bookmarkDropdown.id) {
                bookmarkDropdown.refreshSelected(bookmark);
            } 
            
            if(myPointSlider && sender.id != myPointSlider.id) {
                myPointSlider.refreshSelected(bookmark);
            }
            updateImpact(bookmark);
        });
        
        GlobalEvent.on('onAreaShow', function(e, bookmark, sender) {
            if(!bookmark.dong.lat || !bookmark.dong.lon){
                var latlon = convertDfsGrid('toLL', bookmark.dong.x, bookmark.dong.y)
                if(latlon['lat'] && latlon['lng']) {
                    bookmark.dong.lat = latlon['lat'];
                    bookmark.dong.lon = latlon['lng'];
                }
            }
            if(sender && sender.id == 'pop-local-search') {
                $('.pop-local-search').removeClass('on');
            }
            if(myPointSlider && sender.id != myPointSlider.id) {
                 myPointSlider.refreshSelected(bookmark);
            }
            if(bookmarkDropdown) bookmarkDropdown.refreshSelected(bookmark);
            updateImpact(bookmark);
        });
        
        $(document).click(function(e){
            var canCloseLocalSearchItems = $(e.target).parents('.cmp-local-search').length == 0
                && $(e.target).parents('.cmp-local-search-items').length == 0; 
            if(canCloseLocalSearchItems) {
                $('.cmp-local-search-items').removeClass('on').removeClass('opened');
            }
            
            var canCloseTodayWarning = $(e.target).parents('.cmp-main-wrn.accordion-wrap').length == 0;
            if(canCloseTodayWarning) {
                $('.cmp-main-wrn .box-con-on.accordion-tit.on').trigger('click');
            }
            
            var canCloseHelpTooltip = $(e.target).parents('.cmp-help-tooltip').length == 0 && $(e.target).attr('data-role')!="toggle-help";
            if(canCloseHelpTooltip) $('.cmp-help-tooltip').removeClass('on');
        });
        function updateImpact(bookmark) {
        	if(bookmark && bookmark.dong && bookmark.dong.code)
        		weatherImpact.refresh(bookmark.dong.code);
        }
        
        $('ul[data-role="bookmark-holder"]').on('click', '>li>.select-btn', function(e) {
        	var dongCode = $(this).data('dong-code');
        	var data = $(this).data();
        	if(dongCode) {
            	history.pushState(data, null, "#dong/" + dongCode);
            }
        });
    }    
})(jQuery, window, document);
