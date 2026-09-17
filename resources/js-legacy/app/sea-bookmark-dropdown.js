/**
 * Sea bookmark dropdown
 *
 * 바다예보구역 즐겨찾기 드롭다운 인덱스
 */
'use strict';
(function($, window, document){
	var AREA = {
			TOP: "TOP",
			MID: "MID",
			BTM: "BTM"
	},
	DEFAULT_AREA = {
		top: {code: "12A20000", name: "서해중부"},
		mid: {code: "12A20100", name: "서해중부 앞바다"},
		btm: {code: "12A20100", name: "서해중부앞바다"},
	},
	SeaBookmarkDropdown = function(wrapperId, searchType) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		var base = this;
		base.id = wrapperId;
		base.config = { bookmarks: [], recent: [] };
		base.key = "W_SC";
		base.readConfig();
		if(base.configureHashParams() == true){
			// 파라미터를 받음.
			base.requestFindArea()
			.then(
				function(data) {
					console.log(data);
					if(data && data.top) {
						var bookmark = {
							top: { code: data.top.code, name: data.top.name },
							mid: { code: data.mid?data.mid.code:"", name: data.mid?data.mid.name:"" },
							btm: { code: data.btm?data.btm.code:"", name: data.btm?data.btm.name:"" },
						};
						createFullName(bookmark);
						base.config.selectedBookmark = bookmark;
						base.saveConfig();
						base.updateSelectedBookmark();
						base.onSeaBookmarkSelected(-1, bookmark);
					}
					base.updateBookmarks();
					base.addEventHandler();
					
				},function(error) {
					console.log(error);
					base.updateBookmarks();
					base.addEventHandler();
				}
			);
		} else {
			base.updateBookmarks();
			base.addEventHandler();	
		}
	};
	function setBookmarkAttribute($item, bookmark) {
		if(bookmark) {
			$item.attr('data-top-code', bookmark.top.code);
			$item.attr('data-top-name', bookmark.top.name);
			$item.attr('data-mid-code', bookmark.mid.code);
			$item.attr('data-mid-name', bookmark.mid.name);
			$item.attr('data-btm-code', bookmark.btm.code);
			$item.attr('data-btm-name', bookmark.btm.name);
			$item.attr('data-index', bookmark.index);
			$item.html(bookmark.fullName);	
		} else {
			bookmark = Object.assign({}, DEFAULT_AREA);
			$item.attr('data-top-code', bookmark.top.code);
			$item.attr('data-top-name', bookmark.top.name);
			$item.attr('data-mid-code', bookmark.mid.code);
			$item.attr('data-mid-name', bookmark.mid.name);
			$item.attr('data-btm-code', bookmark.btm.code);
			$item.attr('data-btm-name', bookmark.btm.name);
			$item.attr('data-index', "-1");
			$item.html(bookmark.fullName);
		}	
	}
	function createFullName(bookmark) {
		if(bookmark.top) {
			if(bookmark.top.code && bookmark.mid.code && bookmark.btm.code) {
				bookmark.fullName = bookmark.top.name + " > " + bookmark.mid.name + " > " + bookmark.btm.name;	
			} else if(bookmark.top.code && bookmark.mid.code ) {
				bookmark.fullName = bookmark.top.name + " > " + bookmark.mid.name;
			} else if(bookmark.top.code) {
				bookmark.fullName = bookmark.top.name;
			} else {
				bookmark.fullName = "-";
			}	
		} else {
			bookmark.fullName = "-";
		}
	}
	SeaBookmarkDropdown.prototype = {
		configureHashParams: function() {
			var base = this;
			var url = window.location.href;
			var hashExists = url.indexOf('#') > -1;
			var hash = url.substring(url.indexOf('#'));

			if(hash == '#last-recent') {
				// 마지막 검색을 선택된 북마크로
				if(base.config.recent && base.config.recent.length > 0) {
					var selectedRecent = base.config.selectedRecent;
					if(!selectedRecent) {
						selectedRecent = base.config.recent[0];
					}
					base.config.selectedBookmark = Object.assign({}, selectedRecent);
				}
			} else if(hashExists) {
				var values = hash.split("/");
				if(values.length == 2) {
					if(values[0] == "#area") {
						base.options = { area: values[1] };
						return true;
					}
				}
			}
		},
		readConfig: function() {
			var loadedConfig = store.get(this.key);
			if(loadedConfig) {
				this.config = loadedConfig;
			}
		},
		saveConfig: function() {
			var base = this;
			if(base.config) {
				store.set(base.key, base.config);	
			}
		},
		refresh: function(bookmark) {
			var base = this;
			base.readConfig();
			if(bookmark) {
				base.config.selectedBookmark = Object.assign({}, bookmark);
			}
			base.updateBookmarks();
		},
		refreshSelected: function(bookmark) {
			var base = this;
			if(bookmark) {
				if(!bookmark.fullName) {
					createFullName(bookmark);
				}
				base.config.selectedBookmark = Object.assign({}, bookmark);
				base.updateSelectedBookmark();
			}
		},
		getPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		requestFindArea: function() {
			var base = this;
			var prefix = base.getPrefix();
			var data = {
				area: base.options.area
			};
			
			return $.ajax({
				url: prefix + "rest/zone/areaInfo.do",
				data: data,
				dataType: "json"
			});
		},
		updateBookmarks: function() {
			var base = this;
			var $wrapper = $('#' + base.id);
			var $view = $wrapper.find('ul[data-role="bookmark-holder"]');
			for(var i in base.config.bookmarks) {
				var bookmark = base.config.bookmarks[i];
				bookmark.index = i;
				createFullName(bookmark);
			}
			
			var template = '{{#data}}';
			template += '<li class="serch-con-item"><button class="select-btn" ';
			template += ' {{#top}}data-top-code="{{code}}" data-top-name="{{name}}"{{/top}}';
			template += ' {{#mid}}data-mid-code="{{code}}" data-mid-name="{{name}}"{{/mid}}';
			template += ' {{#btm}}data-btm-code="{{code}}" data-btm-name="{{name}}"{{/btm}}';
			template += ' data-index="{{index}}">{{fullName}}</button></li>';
			template += '{{/data}}';
			var html =  Mustache.render(template, {data: base.config.bookmarks});
			$view.html(html);
			base.updateSelectedBookmark();
		},
		updateSelectedBookmark: function() {
			var base = this;
			var $wrapper = $('#' + base.id);
			var $title = $wrapper.find('button[data-role="bookmark-selected"]');
			if(base.config.selectedBookmark) {
				setBookmarkAttribute($title, base.config.selectedBookmark);
			} else {
				if(base.config.bookmarks && base.config.bookmarks.length > 0) {
					var selectedBookmark = Object.assign({}, base.config.bookmarks[0]);
					setBookmarkAttribute($title,selectedBookmark);	
				} else {
					var selectedBookmark = Object.assign({}, DEFAULT_AREA);
					createFullName(selectedBookmark);
					setBookmarkAttribute($title, selectedBookmark);	
				}
			}
		},
		error: function() {
			var base = this;
			return function(request, status) {
				if(console) console.log(request, status);
			};
		},
		addEventHandler: function() {
			var base = this;
			// save, cancel
			var $wrapper = $('#' + base.id);
			var $view = $wrapper.find('ul[data-role="bookmark-holder"]');
			$view.on('click', 'button', function(e) {
				var index = $(this).attr('data-index');
				var bookmark = base.config.bookmarks[index];
				if(bookmark) {
					base.config.selectedBookmark = bookmark;
					base.saveConfig();
					base.updateSelectedBookmark();
					base.onSeaBookmarkSelected(index, bookmark);
					$wrapper.find('.accordionsecond-con').slideUp(0);
					$wrapper.find('.accordionsecond-tit').removeClass('on');
				}
			});
			$(window).on('popstate', function () {
		    	if(window.location.hash.length >= 5 && "#area" == window.location.hash.substring(0,5)) {
		    		if(base.configureHashParams() == true){
		    			// 파라미터를 받음.
		    			base.requestFindArea().then(
		    				function(data) {
		    					if(data && data.top) {
		    						var bookmark = {
		    							top: { code: data.top.code, name: data.top.name },
		    							mid: { code: data.mid?data.mid.code:"", name: data.mid?data.mid.name:"" },
		    							btm: { code: data.btm?data.btm.code:"", name: data.btm?data.btm.name:"" },
		    						};
		    						createFullName(bookmark);
		    						base.config.selectedBookmark = bookmark;
		    						base.saveConfig();
		    						base.updateSelectedBookmark();
		    						base.onSeaBookmarkSelected(-1, bookmark);
		    					}
		    					
		    				},function(error) {
		    					console.log(error);
		    				}
		    			);
		    		}
		    	}
		    });
		},
		onSeaBookmarkSelected: function(bookmarkIndex, bookmark) {
			var base = this;
			GlobalEvent.trigger($.Event("onSeaBookmarkSelected"), [bookmarkIndex, bookmark, this]);
		}
	};
	
	if (typeof exports !== 'undefined') exports.SeaBookmarkDropdown = SeaBookmarkDropdown;
	else window.SeaBookmarkDropdown = SeaBookmarkDropdown;
})(jQuery, window, document);


