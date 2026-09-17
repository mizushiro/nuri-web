/**
 * MyAreaList
 *
 * 관심지역, 최근 검색 지역 목록/삭제
 */
'use strict';
(function($, window, document){
	var TYPE = {
		WIDE: "WIDE",
		CITY: "CITY",
		DONG: "DONG"
	},
	KMA = {
		wide: { code: "1100000000", name: "서울특별시"},
		city: { code: "1159000000", name: "동작구"},
		dong: { code: "1159068000", name: "신대방제2동"},
		fullName: "서울특별시 동작구 신대방제2동",
		index: 0
	},
	MAX_SHOW_HISTORY = 3,
	PAGE_SIZE = 12,
	MyAreaList = function(wrapperId) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		var self = this;
		self.id = wrapperId;
		self.key = "W_DC";
		self.config = {
			bookmarks: [],
			recent: []
		};
		self.state = {
			page: 1,
			
		};
		self.readConfig();
		self.updateBookmarks();
		self.updateRecent();
		self.addEventHandler();
		
		self.isUpdated = false;
	};
	
	MyAreaList.prototype = {
		readConfig: function() {
			var self = this;
			var loadedConfig = store.get(this.key);
			if(loadedConfig) {
				this.config = loadedConfig;
			}
		},
		addBookmarkOnlyMemory: function(bookmark) {
			var self = this;
			if(bookmark) {
				var newBookmark = Object.assign({}, bookmark);
				self.config.bookmarks.unshift(newBookmark);
				self.updateBookmarks();
				self.isUpdated = true;
			}
		},
		writeConfig: function() {
			store.set(this.key, this.config);
		},
		closeConfig: function() {
			$('.pop-close').trigger("click");
		},
		reloadMyAreas: function() {
			var self = this;
			self.readConfig();
			self.updateBookmarks();
		},
		reloadMyRecents: function() {
			var self = this;
			self.readConfig();
			self.updateRecent();
		},
		updateBookmarks: function() {
			var self = this;
			var $wrapper = $('#' + self.id);
			var $view = $wrapper.find('ul[data-role="my-area-holder"]');
			var template = '{{#data}}<li class="chkbox-wrap">';
			//template += '<input type="checkbox" class="chk-list" checked="checked" tabindex="-1"/>';
			template += '<label>{{#wide}}{{name}}{{/wide}} {{#city}}{{name}}{{/city}}';
			template += '<strong>{{#dong}}{{name}}{{/dong}}</strong>';
			template += '<a href="#delete-bookmark" class="item-hide-btn" data-role="delete-bookmark" data-index={{index}} data-wide-code="{{#wide}}{{code}}{{/wide}}" data-city-code="{{#city}}{{code}}{{/city}}" data-dong-code="{{#dong}}{{code}}{{/dong}}"><span class="blind">{{#dong}}{{name}}{{/dong}} 삭제</span></a>';
			template += '</label>';
			template += '</li>{{/data}}';
			if(!self.config.bookmarks) self.config.bookmarks = [];
			var data = (self.config && self.config.bookmarks) ? self.config.bookmarks.slice((self.state.page - 1)*PAGE_SIZE, self.state.page*PAGE_SIZE) : [];
			for(var i = 0 ; i < data.length ; i++) {
				data[i].index = (self.state.page-1)*PAGE_SIZE + i;
			}
			
			var html =  Mustache.render(template, {data: data});
			
			if(data.length == 0) {
				html = '<li class="no-area">관심지역을 등록하시면 편리하게 날씨를 조회할 수 있습니다.</li>';
			}
			
			$view.html(html);
			
			self.updatePaging();
		},
		updateRecent: function() {
			var self = this;
			var $wrapper = $('#' + self.id);
			var $view = $wrapper.find('ul[data-role="recent-holder"]');
			var template = '{{#data}}<li class="chkbox-wrap">';
			//template += '<input type="checkbox" class="chk-list" checked="checked" />';
			template += '<label>{{#wide}}{{name}}{{/wide}} {{#city}}{{name}}{{/city}}';
			template += '<strong>{{#dong}}{{name}}{{/dong}}</strong>';
			template += '<a href="#add-bookmark" data-role="add-bookmark" {{#wide}}data-wide-code="{{code}}" data-wide-name="{{name}}"{{/wide}}" {{#city}}data-city-code="{{code}}" data-city-name="{{name}}"{{/city}}" {{#dong}}data-dong-code="{{code}}" data-dong-name="{{name}}"{{/dong}}">';
			template += '<i class="item-btn"></i></a>';
			template += '</label>';
			template += '</li>{{/data}}';
			var data = self.config.recent ? self.config.recent.slice(0, 3) : [];
			for(var i = 0 ; i < data.length ; i++) {
				data[i].index = i;
			}
			var html =  Mustache.render(template, {data: data});
			$view.html(html);
		},
		updatePaging: function() {
			var self = this;
			var $wrapper = $('#' + self.id);
			var template = '{{#data}}<button class="num {{#selected}}on{{/selected}}" {{#selected}}title="선택됨"{{/selected}} data-page="{{page}}">{{page}}</button>{{/data}}';
			var totalPage = self.getTotalPage();
			
			var data = [];
			for(var i = 0 ; i < totalPage; i++) {
				data.push({page: i+1, selected: (i+1==self.state.page)});
			}
			var html = Mustache.render(template, {data: data});
			$wrapper.find('div[data-role="paging"]').html('<button class="page-prev" title="이전페이지">&nbsp;</button>' + html + '<button class="page-next" title="다음페이지">&nbsp;</button>');
		},
		getTotalPage: function() {
			var self = this;
			var totalPage = 1;
			if(!self.config.bookmarks) self.config.bookmarks = [];
			if(self.config.bookmarks.length % PAGE_SIZE == 0) {
				totalPage = Math.floor(self.config.bookmarks.length / PAGE_SIZE);
			} else {
				totalPage = Math.floor(self.config.bookmarks.length / PAGE_SIZE) + 1;
			}
			return totalPage;
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
			};
		},
		isFullySelected: function (selected) {
			return selected.wide && selected.wide.code
					&& selected.city && selected.city.code
					&& selected.dong && selected.dong.code;
		},
		addBookmark: function(newBookmark) {
			var self = this;
			if(!self.isFullySelected(newBookmark)) {
				alert("잘못된 데이터입니다.");
				return null;
			}
			if(self.config instanceof Array || !self.config instanceof Object) {
				self.config = {};
				self.config.bookmarks = new Array();
			} 
			if(!self.config.bookmarks || !self.config.bookmarks instanceof Array) {
				self.config.bookmarks = new Array();
			}
			
			var conflict = false;
			
			for(var i in self.config.bookmarks) {
				var area = self.config.bookmarks[i];
				if(newBookmark.wide && area.wide.code == newBookmark.wide.code 
						&& newBookmark.city && area.city.code == newBookmark.city.code 
						&& newBookmark.dong && area.dong.code == newBookmark.dong.code) {
					conflict = true;
					break;
				}
			}
			if(!conflict) {
				self.config.bookmarks.unshift(newBookmark);
				return newBookmark;
			} else {
				alert("이미 등록되어있는 지역입니다.");
				return null;
			}
		},
		onSaveAreaBookmark: function() {
			GlobalEvent.trigger($.Event("onSaveAreaBookmark"), [this]);
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			$wrapper.find('button[data-role="save-dong"]').on('click', function(e) {
				e.preventDefault();
				// 첫번째 북마크를 선택된 북마크로 
				if(self.isUpdated && self.config.bookmarks && self.config.bookmarks.length > 0) {
					self.config.selectedBookmark = Object.assign({}, self.config.bookmarks[0]);
				}
				
				self.writeConfig();
				self.closeConfig();
				self.onSaveAreaBookmark();
			});
			$wrapper.find('button[data-role="cancel"]').on('click', function(e) {
				e.preventDefault();
				self.readConfig();
				self.updateBookmarks();
				self.updateRecent();
				self.closeConfig();
			});	
			$wrapper.on('click', 'a[data-role="delete-bookmark"]', function(e) {
				e.preventDefault();
				var item = $(this);
				var index = parseInt(item.attr('data-index'));
				var removed = self.config.bookmarks.splice(index, 1);
				if(self.config.selectedBookmark && removed[0].dong.code == self.config.selectedBookmark.dong.code) {
					if(self.config.bookmarks.length > 0) {
						self.config.selectedBookmark = Object.assign({}, self.config.bookmarks[0]);	
					} else {
						self.config.selectedBookmark = Object.assign({}, KMA);
					}
				}
				self.updateBookmarks();
				var $nextObj = $wrapper.find('ul[data-role="my-area-holder"] > li > label > a');
				if($nextObj.length > 0) {
					$nextObj.first().trigger('focus');
				} else {
					$wrapper.find('button.page-prev').first().trigger('focus');
				}
			});
			$wrapper.on('click', 'a[data-role="add-bookmark"]', function(e) {
				e.preventDefault();
				var item = $(this);
				var newBookmark = {
						wide: { code: item.attr('data-wide-code'), name: item.attr('data-wide-name')},
						city: { code: item.attr('data-city-code'), name: item.attr('data-city-name')},
						dong: { code: item.attr('data-dong-code'), name: item.attr('data-dong-name')}
				}
				
				if(self.isFullySelected(newBookmark)) {
					self.addBookmark(newBookmark);
					self.updateBookmarks();
				} else {
					alert("잘못된 지역 코드입니다.");
				}
			});
			$wrapper.find('div[data-role="paging"]').on('click','.page-prev',function(e) {
				if(self.state.page > 1) {
					self.state.page--;
					self.updateBookmarks();	
				}
				e.preventDefault();
			}).on('click', '.page-next', function(e) {
				var totalPage = self.getTotalPage();
				if(self.state.page < totalPage) {
					self.state.page++;
					self.updateBookmarks();	
				}
				e.preventDefault();
			}).on('click', '.num', function(e) {
				var page = parseInt($(this).attr('data-page'));
				if(self.state.page != page) {
					self.state.page = page;
					self.updateBookmarks();
				}
				e.preventDefault();
			});
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.MyAreaList = MyAreaList;
	else window.MyAreaList = MyAreaList;
})(jQuery, window, document);


