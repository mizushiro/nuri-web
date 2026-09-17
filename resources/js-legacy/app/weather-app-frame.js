'use strict';
if(typeof jQuery === 'undefined') {
	alert('jQuery required!');
}
var Util = {
	send: function(message, target, domain) {
		if(!target) target = window.parent;
		if(!domain) domain = '*';
		target.postMessage(message, domain);
	}
}
var DEFAULT = {
	LOCATION: { lat: 37.493546, lon:126.921654 },
	GRID: { x: 59, y: 125 },
};
var MAIN_FRAME_WINDOW = null;

function iframeLoad(e) {
	Util.send({ action: 'getVersion', param: [ 1 ] }, MAIN_FRAME_WINDOW);
}
function bookmarkSend() {
	var bookmarkConfig = store.get('W_DC');
	console.log(bookmarkConfig);
	if(bookmarkConfig == null) {
		bookmarkConfig = { bookmarks: [], selectedBookmark: null };
	}
	Util.send( { action: 'bookmark-read', bookmarks: bookmarkConfig.bookmarks, selectedBookmark: bookmarkConfig.selectedBookmark }, MAIN_FRAME_WINDOW);
}

function findCurrentLocation() {
	if(window.navigator) {
		navigator.geolocation.getCurrentPosition(
			function(position){
				if(position.coords.latitude && position.coords.longitude) {
					Util.send({ action: 'getLocation', param: [ position.coords.latitude, position.coords.longitude ] }, MAIN_FRAME_WINDOW);
				}
			}, 
			function(error) {
				Util.send({ action: 'getLocation', param: [ DEFAULT.LOCATION.lat, DEFAULT.LOCATION.lon ] }, MAIN_FRAME_WINDOW);
				if(console) console.log(error);
				switch(error.code) {
					case 1: // error.PERMISSION_DENIED:
						alert("권한이 없습니다.");
						break;
					case 2: // error.POSITION_UNAVAILABLE:
						alert("위치를 찾을 수 없습니다.");
						break;
					case 3: // error.TIMEOUT:
						alert("제한시간이 지나서 위치를 찾을 수 없습니다.");
						break;
					case 4: // error.UNKNOWN_ERROR:
						alert("알 수 없는 오류입니다.");
						break;
				}
			}
		);
	} else {
		Util.send({ action: 'getLocation', param: [ DEFAULT.LOCATION.lat, DEFAULT.LOCATION.lon ] }, MAIN_FRAME_WINDOW);
	}
}
function messageHandler(e) {
	if(!MAIN_FRAME_WINDOW) return;
	if(!e.data) return;
	console.log('messageHandler', e.data);
	switch(e.data.action) {
		case 'load':
			iframeLoad(e); 
			break;
		case 'getLocation':
			findCurrentLocation();
			break;
		case 'bookmark-save':
			store.set('W_DC', { bookmarks: e.data.bookmarks, selectedBookmark: e.data.selectedBookmark });
			break;
		case 'bookmark-read':
			bookmarkSend();
			break;
	}
}
