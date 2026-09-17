/**
 * 2021 Mobile app - Bookmark dropdown
 * 
 * 즐겨찾기 드롭다운 인덱스
 */
'use strict';
var WeatherLang = {
		text: {
			"msg.history.empty": {
				kor: "찾아본 내역이 없습니다.",
				eng: "History does not exists.",
				chn: "歷史不存在。",
				jpn: "歴史はありません。",
			},
			"error.location.find":{
				kor: "현재 위치를 조회 중 오류가 발생하였습니다.",
				eng: "An error has occurred while determining the current location",
				chn: "查询当前位置时发生错误。",
				jpn: "現在位置を照会中に、エラーが発生しました。"
			},
			"error.favorite.exceed": {
				kor: "즐겨찾는 지역은 최대 10개까지 등록할 수 있습니다.",
				eng: "Up to 10 favorite regions can be registered.",
				chn: "最多可添加10个地区至收藏夹。",
				jpn: "お気に入り地域は最大10個まで登録できます。"
			},
			"error.favorite.aleady-exists": {
				kor: "이미 등록된 지역입니다.",
				eng: "This region has already been registered.",
				chn: "该地区已收藏。",
				jpn: "すでに登録済みの地域です。"
			},
			"msg.location.searching": {
				kor: "현재 위치를 검색중입니다",
				eng: "Searching for current location.",
				chn: "正在搜索当前位置。",
				jpn: "現在位置を検索中です。"
			},
			"error.location.permission-denied": {
				kor: "현재 위치 요청이 거부되었습니다.",
				eng: "Current location request has been rejected.",
				chn: "当前位置请求被拒绝。",
				jpn: "現在位置の要請が拒否されました。"
			},
			"error.location.position-unavailable": {
				kor: "위치정보를 사용할 수 없습니다.",
				eng: "Location information cannot be used.",
				chn: "无法使用位置信息。",
				jpn: "位置情報が使用できません。"
			},
			"error.location.timeout": {
				kor: "위치정보 요청 시간이 초과되었습니다.",
				eng: "Location information request has timed out.",
				chn: "已超过位置信息请求时间。",
				jpn: "位置情報の要請時間が超過しました。"
			},
			"error.location.unknown-error": {
				kor: "알 수 없는 요류로 현재 위치 요청이 실패하였습니다.",
				eng: "Current location request failed due to an unknown error.",
				chn: "Current location request failed due to an unknown error.",
				jpn: "原因不明のエラーで現在位置の要請に失敗しました。"
			},
			"error.location.not-support": {
				kor: "현재 위치를 지원하지 않는 브라우져입니다.",
				eng: "This browser does not support current location information.",
				chn: "This browser does not support current location information.",
				jpn: "現在位置に対応していないブラウザです。"
			}		
		},
		get: function(code, lang) {
			var langs = this.text[code];
			if(langs == null) {
				return code;
			} else {
				if(!lang) lang = "kor";
				var text = langs[lang];
				if(!text) {
					text = langs["eng"];
					if(!text) {
						text = langs["kor"];
						if(!text) {
							return code;
						} 
						return text;
					} else {
						return text;
					}
				} else {
					return text;
				}
			}
		}
	};
var lat = 37.493546;
var lon = 126.921654;
(function($, window, document){
	var KMA = {
		wide: { code: "1100000000", name: "서울특별시"},
		city: { code: "1159000000", name: "동작구"},
		dong: { code: "1159068000", name: "신대방제2동", x: 59, y: 125, lat: 37.493546, lon:126.921654},
		x: 59,
		y: 125,
		lat: 37.493546,
		lon:126.921654,
		fullName: "서울특별시 동작구 신대방제2동",
		index: 0
	},DEFAULT_OPTIONS={
		lang: 'kor',
		locationEnabled: false
	},
	INSTANT_SAVE_MINUTES = 10,
	BookmarkDropdown = function(wrapperId, searchType, opts) {
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
		base.appVersion = 0;
		base.appLocation = [];
		base.options = Object.assign({}, DEFAULT_OPTIONS);
		if(opts) base.options = Object.assign({}, opts);
		
		base.id = wrapperId;
		base.key = "W_DC";
		base.config = {
			bookmarks: [],
			recent: []
		};
		base.readConfig();
	};
	function createFullName(bookmark) {
		if(bookmark.wide) {
			if(bookmark.wide.name && bookmark.city.name && bookmark.dong.name) {
				bookmark.fullName = bookmark.wide.name + " " + bookmark.city.name + " " + bookmark.dong.name;	
			} else if(bookmark.wide.name && bookmark.city.name) {
				bookmark.fullName = bookmark.wide.name + " " + bookmark.city.name;
			} else if(bookmark.wide.name) {
				bookmark.fullName = bookmark.wide.name + "";
			} else {
				bookmark.fullName = "-";
			}	
		} else {
			bookmark.fullName = "-";
		}
	}
	function setBookmarkAttribute($item, bookmark, defaultTitle) {
		if(bookmark) {
			$item.attr('data-wide-code', bookmark.wide.code);
			$item.attr('data-wide-name', bookmark.wide.name);
			$item.attr('data-city-code', bookmark.city.code);
			$item.attr('data-city-name', bookmark.city.name);
			$item.attr('data-dong-code', bookmark.dong.code);
			$item.attr('data-dong-name', bookmark.dong.name);
			$item.attr('data-x', bookmark.dong.x);
			$item.attr('data-y', bookmark.dong.y);
			$item.attr('data-lat', bookmark.dong.lat);
			$item.attr('data-lon', bookmark.dong.lon);
			$item.attr('data-index', bookmark.index);
			$item.attr('data-near', bookmark.near ? true : false);
			$item.html(defaultTitle?defaultTitle:bookmark.fullName);	
		} else {
			$item.attr('data-wide-code', "");
			$item.attr('data-wide-name', "");
			$item.attr('data-city-code', "");
			$item.attr('data-city-name', "");
			$item.attr('data-dong-code', "");
			$item.attr('data-dong-name', "");
			$item.attr('data-x', "");
			$item.attr('data-y', "");
			$item.attr('data-lat', "");
			$item.attr('data-lon', "");
			$item.attr('data-index', "-1");
			$item.attr('data-near', false);
			$item.html(defaultTitle?defaultTitle:"관심지역을 추가해 주세요.");
		}
	}
	function dfsConvertToXY(lat, lon) {
		return dfs_xy_conv("toXY", lat,lon);
	}
	function dfs_xy_conv(code,v1,v2) {
		//
		// LCC DFS 좌표변환을 위한 기초 자료
		//
		var RE = 6371.00877; // 지구 반경(km)
		var GRID = 5.0;      // 격자 간격(km)
		var SLAT1 = 30.0;    // 투영 위도1(degree)
		var SLAT2 = 60.0;    // 투영 위도2(degree)
		var OLON = 126.0;    // 기준점 경도(degree)
		var OLAT = 38.0;     // 기준점 위도(degree)
		var XO = 43;         // 기준점 X좌표(GRID)
		var YO = 136;        // 기1준점 Y좌표(GRID)

		var DEGRAD = Math.PI / 180.0;
		var RADDEG = 180.0 / Math.PI;

		var re = RE / GRID;
		var slat1 = SLAT1 * DEGRAD;
		var slat2 = SLAT2 * DEGRAD;
		var olon  = OLON  * DEGRAD;
		var olat  = OLAT  * DEGRAD;

		var sn = Math.tan( Math.PI*0.25 + slat2*0.5 ) / Math.tan( Math.PI*0.25 + slat1*0.5 );
		sn = Math.log( Math.cos(slat1) / Math.cos(slat2) ) / Math.log(sn);
		var sf = Math.tan( Math.PI*0.25 + slat1*0.5 );
		sf = Math.pow(sf,sn) * Math.cos(slat1) / sn;
		var ro = Math.tan( Math.PI*0.25 + olat*0.5 );
		ro = re * sf / Math.pow(ro,sn);
		var rs = {};
		if (code == "toXY") {
			rs['lat'] = v1;
			rs['lng'] = v2;
			var ra = Math.tan( Math.PI*0.25 + (v1)*DEGRAD*0.5 );
			ra = re * sf / Math.pow(ra,sn);
			var theta = v2 * DEGRAD - olon;
			if (theta >  Math.PI) theta -= 2.0 * Math.PI;
			if (theta < -Math.PI) theta += 2.0 * Math.PI;
			theta *= sn;
			rs['x'] = Math.floor( ra*Math.sin(theta) + XO + 0.5 );
			rs['y'] = Math.floor( ro - ra*Math.cos(theta) + YO + 0.5 );
		} else {
			rs['x'] = v1;
			rs['y'] = v2;
			var xn = v1 - XO;
			var yn = ro - v2 + YO;
			ra = Math.sqrt( xn*xn+yn*yn );
			if (sn < 0.0) -ra;
			var alat = Math.pow( (re*sf/ra),(1.0/sn) );
			alat = 2.0*Math.atan(alat) - Math.PI*0.5;

			if (Math.abs(xn) <= 0.0) {
				theta = 0.0;
			} else {
				if (Math.abs(yn) <= 0.0) {
					theta = Math.PI*0.5;
					if( xn < 0.0 ) -theta;
				} else theta = Math.atan2(xn,yn);
			}
			var alon = theta/sn + olon;
			rs['lat'] = alat*RADDEG;
			rs['lng'] = alon*RADDEG;
		}
		return rs;
	}
	
	BookmarkDropdown.prototype = {
		initConfig: function() {
			var base = this;

			function requestCurrentLocation() {
				// do not use
				base.startUserLocation(function(position) {
					if(position.coords.latitude && position.coords.longitude) {
						base.onLocationReceived(position.coords.latitude, position.coords.longitude);
					}
				}, true);
			}
			if(base.configureHashParams() == true){
				// 파라미터를 받음.
				base.requestFindDong()
				.then(
					function(data) {
						if(data && data.wide && data.city && data.dong) {
							var bookmark = {
									wide: {code: data.wide.code, name: data.wide.name},
									city: {code: data.city.code, name: data.city.name},
									dong: {code: data.dong.code, name: data.dong.name, x: data.dong.x, y: data.dong.y, lat: data.dong.lat, lon: data.dong.lon},
									x: data.dong.x, 
									y: data.dong.y,
									lat: data.dong.lat,
									lon: data.dong.lon
								};
							createFullName(bookmark);
							base.config.selectedBookmark = Object.assign({}, bookmark);
							base.saveConfig(true);
							base.onAreaBookmarkSelected(-1, bookmark);
							base.updateSelectedBookmark();
						}
						base.updateBookmarks();
						base.addEventHandler();
						//requestCurrentLocation();
						
					},function(error) {
						console.log(error);
						base.updateBookmarks();
						base.addEventHandler();
						//requestCurrentLocation();
					}
				);
			} else {
				base.updateBookmarks();
				base.addEventHandler();	
				//requestCurrentLocation();
			}
		},
		appVersionReceived: function(ver) {
			if(console) console.log("appVersion", ver);
			this.appVersion = ver;
		},
		appLocationReceived: function(lat, lon) {
			this.appLoation = [lat, lon];
			this.onLocationReceived(lat, lon, 'INSTANT_SAVE');
		},
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
					if(values[0] == "#dong") {
						base.options.dong = values[1];
						return true;
					}
				}
			}
			return false;
		},
		readConfig: function() {
			var loadedConfig = store.get(this.key);
			if(loadedConfig) {
				this.config = loadedConfig;
			}
		},
		saveConfig: function(sync) {
			var base = this;
			if(base.config) {
				store.set(base.key, base.config);
				if(sync) {
					for(var i = 0 ; i < base.config.bookmarks.length ; i++) {
						createFullName(base.config.bookmarks[i]);
						base.config.bookmarks[i].dong.code_type = base.config.bookmarks[i].dong.code.length == 12 ? "01":"02";
						base.config.bookmarks[i].code_type = base.config.bookmarks[i].dong.code_type;
						base.config.bookmarks[i].dong.wide_name = base.config.bookmarks[i].wide.name;
						base.config.bookmarks[i].dong.city_name = base.config.bookmarks[i].city.name;
					}
					if(base.config.selectedBookmark) {
						createFullName(base.config.selectedBookmark);
						base.config.selectedBookmark.dong.code_type = base.config.selectedBookmark.dong.code.length == 12 ? "01":"02";
						base.config.selectedBookmark.code_type = base.config.selectedBookmark.dong.code_type;
						base.config.selectedBookmark.dong.wide_name = base.config.selectedBookmark.wide.name;
						base.config.selectedBookmark.dong.city_name = base.config.selectedBookmark.city.name;	
					}
					window.parent.postMessage({
						action: "bookmark-save",
						bookmarks: base.config.bookmarks,
						selectedBookmark: base.config.selectedBookmark,
					}, '*');
				}
			}
		},
		refresh: function(bookmark) {
			//console.log('refresh', bookmark);
			var base = this;
			base.loaded = true;
			base.readConfig();
			if(bookmark) {
				base.config.selectedBookmark = Object.assign({}, bookmark);
			}
			base.updateBookmarks();		
		},
		showDropdown: function() {
			//console.log('showDropdown');
			var base = this;
			var $acTitle = $('#' + base.id).find('.accordionsecond-tit').first();
			$acTitle.addClass('on').next('.accordionsecond-con').stop(true).slideDown(100);
			$acTitle.attr("title","펼쳐짐").parent().addClass('on');
		},
		refreshSelected: function(bookmark) {
			//console.log('refreshSelected', bookmark);
			var base = this;
			if(bookmark) {
				base.config.selectedBookmark = Object.assign({}, bookmark);
				base.updateSelectedBookmark();
			}
		},
		updateBookmarks: function() {
			//console.log('updateBookmarks');
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
			template += '{{#wide}}data-wide-code="{{code}}" data-wide-name="{{name}}"{{/wide}}';
			template += '{{#city}}data-city-code="{{code}}" data-city-name="{{name}}"{{/city}}';
			template += '{{#dong}}data-dong-code="{{code}}" data-dong-name="{{name}}" data-x="{{x}}" data-y="{{y}}" data-lat="{{lat}}" data-lon="{{lon}}"{{/dong}}';
			template += 'data-index="{{index}}">{{fullName}}</button></li>';
			template += '{{/data}}';
			var html =  Mustache.render(template, {data: base.config.bookmarks});
			
			$view.html(html);
			base.updateSelectedBookmark();
		},
		updateSelectedBookmark: function () {
			var base = this;
			var $wrapper = $('#' + base.id);
			var $title = $wrapper.find('a[data-role="bookmark-selected"]');
			if(base.config.selectedBookmark) {
				var selectedBookmark = base.config.selectedBookmark;
				if(!selectedBookmark.fullName) createFullName(selectedBookmark);
				setBookmarkAttribute($title, selectedBookmark);
					
			} else {
				var selectedBookmark = Object.assign({}, KMA);
				setBookmarkAttribute($title, selectedBookmark);
			}
			var isMy = false;
			if(base.config.bookmarks) {
				for(var i in base.config.bookmarks) {
					var bm = base.config.bookmarks[i];
					if(bm.fullName == base.config.selectedBookmark.fullName) {
						isMy = true;
						break;
					}
				}
			}
			var $star = $wrapper.find('.sym-btn.star');
			if(isMy) {
				if(!$star.hasClass('on')) $star.addClass('on');
			} else {
				if($star.hasClass('on')) $star.removeClass('on');
			}
		},
		error: function() {
			var base = this;
			return function(request, status) {
				if(console) console.log(request, status);
			};
		},
		getPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		requestNearDong: function(lat, lon) {
			var base = this;
			var prefix = base.getPrefix();
			var xy = dfsConvertToXY(lat, lon);
			var data = {
				x: xy.x, 
				y: xy.y, 
				lat: lat,
				lon: lon,
				lang: base.options.lang
			};
			
			return $.ajax({
				url: prefix + "rest/zone/find/dong.do",
				data: data,
				dataType: "json"
			});
		},
		requestFindDong: function() {
			var base = this;
			var prefix = base.getPrefix();
			var data = {
				dong: base.options.dong
			};
			
			return $.ajax({
				url: prefix + "rest/zone/dongInfo.do",
				data: data,
				dataType: "json"
			});
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
					base.onAreaBookmarkSelected(index, bookmark);
					$wrapper.find('.accordionsecond-con').slideUp(0);
					$wrapper.find('.accordionsecond-tit').removeClass('on');
				}
			});
			function getAppLocation() {
				try { window.parent.postMessage({ action : "getLocation" }, '*'); } catch(e) { if(console) console.log(e);}
			}
			// 현재 위치 검색 시작
			$wrapper.on('click', 'a[data-role="search-current-location"]', function(e) {
				if(base.appVersion > 0) {
					getAppLocation();
				} else {
					base.startUserLocation(function(position) {
						if(position.coords.latitude && position.coords.longitude) {
							base.onLocationReceived(position.coords.latitude, position.coords.longitude);
						}
					});
				}
			});
			// 관심지역 토글
			$wrapper.on('click', 'a[data-role="toggle-bookmark"]', function(e) {
				e.preventDefault();
				var isDelete = $(this).hasClass('on');
				if(isDelete 
					&& base.config 
					&& base.config.bookmarks 
					&& base.config.bookmarks.length > 0
					&& base.config.selectedBookmark) {
					// delete
					var selectedIndex = -1;
					for(var i in base.config.bookmarks) {
						var b = base.config.bookmarks[i];
						if(base.config.selectedBookmark.fullName == b.fullName) {
							selectedIndex = i;
							break;
						} 
					}
					var removed = base.config.bookmarks.splice(selectedIndex, 1);
					base.saveConfig(true);
					base.updateBookmarks();
					if(removed.length > 0) {
						GlobalEvent.trigger($.Event("onAreaBookmarkDeleted"), [selectedIndex, removed[0], this]);	
					}
				} else {
					//console.log(base.config);
					if(base.config && base.config.bookmarks && base.config.bookmarks.length >= 10) {
						alert("관심지역은 최대 10개까지 등록 가능합니다.");
						return;
					}
					// add
					var newBookmark = Object.assign({}, base.config.selectedBookmark);
					base.config.bookmarks.unshift(newBookmark);
					base.saveConfig(true);
					base.updateBookmarks();
					GlobalEvent.trigger($.Event("onAreaBookmarkAdded"), [0, base.config.bookmarks[0], this]);
				}
			});
			$(window).on('popstate', function () {
		    	if(window.location.hash.length >= 5 && "#dong" == window.location.hash.substring(0,5)) {
		    		if(base.configureHashParams() == true){
		    			// 파라미터를 받음.
		    			base.requestFindDong().then(
		    				function(data) {
		    					if(data && data.wide && data.city && data.dong) {
		    						var bookmark = {
		    								wide: {code: data.wide.code, name: data.wide.name},
		    								city: {code: data.city.code, name: data.city.name},
		    								dong: {code: data.dong.code, name: data.dong.name},
		    								x: data.dong.x, 
		    								y: data.dong.y,
		    								lat: data.dong.lat,
		    								lon: data.dong.lon
		    							};
		    						createFullName(bookmark);
		    						base.config.selectedBookmark = Object.assign({}, bookmark);
		    						base.saveConfig(false);
		    						base.onAreaBookmarkSelected(-1, bookmark);
		    						base.updateSelectedBookmark();
		    					}
		    				},function(error) {
		    					console.log(error);
		    				}
		    			);
		    		}
		    	}
		    });
		},
		onNearDongError: function(error) {
			var base = this;
			alert(WeatherLang.get("error.location.find", base.options.lang));
			base.showFindingMessage(false);
		},
		onNearDongReceived: function(data, fromVMap, instantSaveMode) {
			var base = this;
			if(data && data.length > 0) {
				for(var i = 0 ; i < data.length ; i++) {
					var item = data[i];
					var wideCode = item.code.substring(0,2) + "00000000";
					var cityCode = item.code.substring(0,5) + "00000";
					var dongCode = item.code;
					var names = item.name.split(" ");
					var wideName = names[0]
					var cityName = item.name.replace(wideName, '').replace(item.shortName, '').trim();
					var dongName = item.shortName;
					var bookmark = {
							wide: {code: wideCode, name: wideName},
							city: {code: cityCode, name: cityName},
							dong: {code: dongCode, name: dongName, x: item.x, y: item.y,lat: item.lat, lon: item.lon,},
							x: item.x, 
							y: item.y,
							lat: item.lat,
							lon: item.lon,
							fullName: item.name,
							near: true
						};
					base.config.selectedBookmark = Object.assign({ timeStamp: new Date()}, bookmark);
					base.saveConfig(false);
					base.onAreaBookmarkSelected(-1, bookmark);
					base.updateSelectedBookmark();
					GlobalEvent.trigger($.Event("onNearDongReceived"), [bookmark, this]);
					if(instantSaveMode && instantSaveMode == 'INSTANT_SAVE') {
						window.setTimeout(function(){
							if(base.appVersion > 0) {
								getAppLocation();
							} else {
								base.startUserLocation(function(position) {
									if(position.coords.latitude && position.coords.longitude) {
										base.onLocationReceived(position.coords.latitude, position.coords.longitude);
										GlobalEvent.trigger($.Event("onLocationReceived"), [position.coords.latitude, position.coords.longitude, this]);
									}
								}, true);
							}
						}, INSTANT_SAVE_MINUTES * 1000 * 60);
					}
					break;
				}
			} else {
				base.showFindingMessage(false);
			}
		}, 
		showFindingMessage: function(show) {
			var base = this;
			
			if(show) {
				
			} else {
				
			}
		},
		startUserLocation: function(callback, hideMessage) {
			var base = this;
			var errorCallback = function(error) {
				if(console) console.log(error);
				switch(error.code) {
					case 1: // error.PERMISSION_DENIED:
						if(!hideMessage) alert(WeatherLang.get("error.location.permission-denied", base.options.lang));
						break;
					case 2: // error.POSITION_UNAVAILABLE:
						if(!hideMessage) alert(WeatherLang.get("error.location.position-unavailable", base.options.lang));
						break;
					case 3: // error.TIMEOUT:
						if(!hideMessage) alert(WeatherLang.get("error.location.timeout", base.options.lang));
						break;
					case 4: // error.UNKNOWN_ERROR:
						if(!hideMessage) alert(WeatherLang.get("error.location.unknown-error", base.options.lang));
						break;
				}
				base.onAreaBookmarkSelected(-1, base.config.selectedBookmark);
				base.showFindingMessage(false);
			}
			// test
//			base.requestNearDong(36.456, 126.532)
//				.then(
//					function(data){ base.onNearDongReceived(data); },
//					base.onNearDongError
//			);
			if(navigator.geolocation) {
				base.showFindingMessage(true);
				navigator.geolocation.getCurrentPosition(callback, errorCallback);
			} else {
				if(!hideMessage) alert(WeatherLang.get("error.location.not-support", base.options.lang));
			}
		},
		onAreaBookmarkSelected: function(bookmarkIndex, bookmark) {
			var base = this;
			GlobalEvent.trigger($.Event("onAreaBookmarkSelected"), [bookmarkIndex, bookmark, this]);
		},
		onLocationReceived: function(lat, lon, instantSaveMode) {
			var base = this;
			base.requestNearDong(lat, lon)
			.then(
					function(data){ 
						base.onNearDongReceived(data, true, instantSaveMode); 
					},
					base.onNearDongError
			);
		}
	};
	
	if (typeof exports !== 'undefined') exports.BookmarkDropdown = BookmarkDropdown;
	else window.BookmarkDropdown = BookmarkDropdown;
})(jQuery, window, document);


