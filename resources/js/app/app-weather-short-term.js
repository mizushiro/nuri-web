/**
 *  날씨 - 단기예보(url: /weather/short-term)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		weatherShortTerm.refresh();
		weatherSummary.refresh();
	});
	GlobalEvent.on('onAddAreaBookmark', function(e) {
		bookmarkDropdown.refresh();
	});
	
	GlobalEvent.on('onSaveAreaBookmark', function(e) {
		bookmarkDropdown.refresh();
		weatherShortTerm.refresh();
		weatherSummary.refresh();
	});
	
	GlobalEvent.on('onAreaBookmarkSelected', function(e, bookmarkIndex, bookmark) {
		weatherShortTerm.refresh(bookmark);
		weatherSummary.refresh(bookmark);
	});
	GlobalEvent.on('onAreaShow', function(e, bookmark) {
		bookmarkDropdown.refresh(bookmark);
		weatherShortTerm.refresh(bookmark);
		weatherSummary.refresh(bookmark);
	});
	var bookmarkDropdown = new BookmarkDropdown("bookmark-dropdown");
	var weatherShortTerm = new WeatherShortTerm("weather-short-term");
	var weatherSummary = new WeatherSummary("weather-summary");
	var todayWarning = new TodayWarning("today-warning");

})(jQuery, window, document);
