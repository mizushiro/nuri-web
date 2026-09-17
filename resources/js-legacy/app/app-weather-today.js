/**
 *  날씨 - 오늘의 날씨(url: /weather/today)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		todayVshortmid.refresh();
		todayWarning.refreshWarning();
	});
	GlobalEvent.on('onAddAreaBookmark', function(e) {
		bookmarkDropdown.refresh();
		todayWarning.refreshWarning();
	});
	
	GlobalEvent.on('onSaveAreaBookmark', function(e) {
		bookmarkDropdown.refresh();
		todayVshortmid.refresh();
		todayWarning.refreshWarning();
	});
	
	GlobalEvent.on('onAddAreaRecent', function(e, bookmark, sender) {
		bookmarkDropdown.refresh(bookmark);
		todayVshortmid.refresh(bookmark);
		todayWarning.refreshWarning(bookmark);
	});
	GlobalEvent.on('onAreaBookmarkSelected', function(e, bookmarkIndex, bookmark) {
		todayVshortmid.refresh(bookmark);
		todayWarning.refreshWarning(bookmark);
	});
	GlobalEvent.on('onAreaShow', function(e, bookmark) {
		bookmarkDropdown.refresh(bookmark);
		todayVshortmid.refresh(bookmark);
		todayWarning.refreshWarning(bookmark);
	});
	
	GlobalEvent.on('onAreaBookmarkShow', function(e, bookmark) {
		bookmarkDropdown.refresh(bookmark);
		todayVshortmid.refresh(bookmark);
		todayWarning.refreshWarning(bookmark);
	});
	
	GlobalEvent.on('onAreaRecentShow', function(e, bookmark) {
		bookmarkDropdown.refresh(bookmark);
		todayVshortmid.refresh(bookmark);
		todayWarning.refreshWarning(bookmark);
	});
	var bookmarkDropdown = new BookmarkDropdown("bookmark-dropdown");
	var todayVshortmid = new TodayVshortmid("today-vshortmid");
	var todayWarning = new TodayWarning("today-warning");
	
})(jQuery, window, document);
