/**
 * 메인 페이지
 *
 * 날씨누리 홈페이지 app (url: /)
 */
'use strict';
var mainSlick = null;
var mobileApp = true;
(function($, window, document){
	var appLocation = [];
	var tabTitleTemplate = '<div class="tab-btn0{{tab}}"><button type="button" {{#on}}class="on" title="선택됨"{{/on}} data-main="{{tab}}" data-sub-tab="1">{{name}}</button></div>';
	function arrageMainTab() {
		var panels = appConfig.config.panelOrder.main;
		var html = "";
		var isMobile = mobilecheck();
		try{
			if(window.typhoonEnabled) html += '<div class="tab-btn13"><button type="button" data-main="6" class="on" title="새창열림">태풍</button></div>';
			for(var i in panels) {
				if(panels[i] == null || i > 1) continue;
				panels[i].on = (i == 0 && !window.typhoonEnabled);
				panels[i].tabIndex = panels[i].tab - 1; 
				if(panels[i].tab == 1) {
					html += '<div class="tab-btn08"><button type="button" data-main="1" ' + ((panels[i].on&&!window.typhoonEnabled)?'class="on" ':'') + 'title="선택됨" data-sub-tab="1">강수</button></div>';
					html += '<div class="tab-btn07"><button type="button" data-main="1" title="선택됨" data-sub-tab="2">바람</button></div>';
					if(window.winterEnabled) {
						html += '<div class="tab-btn09"><button type="button" data-main="1" title="선택됨" data-sub-tab="3">눈/비</button></div>';
						if(!isMobile) html += '<div class="tab-btn10"><button type="button" data-main="1" title="선택됨" data-sub-tab="4">어는비</button></div>';
					}
				} else {
					html += Mustache.render(tabTitleTemplate, panels[i]);
				}
			}
			// 기타 버튼
			if(window.forestfireEnabled) html += '<div class="tab-btn11"><button type="button" data-main="3" title="새창열림">산불</button></div>';
			if(window.marineAccidentEnabled) html += '<div class="tab-btn12"><button type="button" data-main="5" title="새창열림">해양</button></div>';
			$('div.maintab[data-role="tab-title"]').html(html);
		} catch(e) {if(window.console) console.log(e);}
		
		$('div.maintab[data-role="tab-title"]').show();
		var $tabContents = $('.maintab-wrap > [class*="tab-cont0"]');
		var selectedTab = 0;
		try {
			if(panels[0]) {
				selectedTab = panels[0].tabIndex;
				/*if(window.typhoonEnabled) {
					$('.container').removeClass().addClass('container').addClass('on-bg06');
				} else {
					$('.container').removeClass().addClass('container').addClass('on-bg0' + panels[0].tab);	
				}*/
			} else {
				//$('.container').removeClass().addClass('container').addClass('on-bg01');
			}
		} catch(e) { 
			if(window.console) console.log(e);
			//$('.container').removeClass().addClass('container').addClass('on-bg01');
		}
		
		var $panelHolder = $('#panel-holder');
		var $mainTabWrap = $('.maintab-wrap');
		if($mainTabWrap.hasClass('slick-initialized')) {
			$mainTabWrap.slick('unslick');
		}
		
		mainSlick = weatherUI.slickMainTab('.maintab-wrap');
		weatherUI.mainTab('.maintab', '.maintab-wrap');
		
//		weatherUI.popOpen('.tab-cont01 .pop-open');
//		weatherUI.accordionSecond('.tab-cont01 .weather-cont-wrap .accordionsecond-wrap');
//		weatherUI.accordion('.tab-cont01 .accordion-tit');
		
		//bookmarkDropdown.addEventHandler();
		//mapBookmarkDropdown = new BookmarkDropdown("map-bookmark-dropdown",null, { rainEnabled: true});
		if(window.typhoonEnabled) {
			mainSlick.slick('slickGoTo', 2, false);
			GlobalEvent.trigger($.Event("onMainTabSelected"), [5, this]);
		} else {
			mainSlick.slick('slickGoTo', selectedTab, false);
			GlobalEvent.trigger($.Event("onMainTabSelected"), [selectedTab, this]);
		}
		
		
		$('a[data-role="vmap-open-btn"]').on('click', function(e) {
			var width = $(window).width();
			var $vmapFrame = $('#vmap-iframe');
			e.preventDefault();
			var iframeSrc = $vmapFrame.find('iframe').attr('src');
			var isRadar = false;
			if(iframeSrc.indexOf("snowrain-frame") > -1) {
				isRadar = true;
			}
			if(isRadar) {
				openExternalPop(window.appBase + 'image/radar.do#data=SFC');
			} else {
				var vmapUrl = window.vmapBaseUrl + "/vpm_mobile/m_visual_map_kr.html?unitws=" + unitws.replace("/","");
				if(width > 1101) {
					vmapUrl = window.vmapBaseUrl + "/vpm_mobile/m_visual_map_kr.html?unitws=" + unitws.replace("/","");
				}
				openExternalPop(vmapUrl);
			}
		});
	}	
	var bookmarkDropdown = new BookmarkDropdown("bookmark-dropdown");
	
	var indexVShort = new IndexVShort("index-vshort");
	var indexShortmid = new IndexShortmid("index-shortmid");	
	var indexTodayWarning = new TodayWarning("index-today-warning","today");
	
	//var vsrtRainText = new VsrtRainText();
	
	//var mapBookmarkDropdown = null;//new BookmarkDropdown("map-bookmark-dropdown");
	//var mapIndexVShort = new IndexVShort("map-index-vshort", "map");
	//var mapIndexShortmid = new IndexShortmid("map-index-shortmid", "map");	
	var mapIndexTodayWarning = new TodayWarning("map-index-today-warning","today");
	
	var eqkWarning = new EqkWarning("index-eqk-warning");
	var typhoonInfo = new TyphoonInfo("index-typhoon-info");
	
	var iframeType = "";
	
	function removeVmap() {
		var $vmapFrame = $('#vmap-iframe');
		$vmapFrame.find('iframe').remove();
	}
	var unitws = "km/h";
	if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
		unitws = appConfig.config.unit.ws;
	}
	var desktopVmapUrl = window.vmapBaseUrl + "/vpm_mobile/m_visual_map_kr.html?" + (window.vmapBaseParam?(window.vmapBaseParam+"&"):"") + "unitws=" + unitws.replace("/","");
	var mobileVmapUrl = window.vmapBaseUrl + "/vpm_mobile/m_visual_map_kr.html?" + (window.vmapBaseParam?(window.vmapBaseParam+"&"):"") + "unitws=" + unitws.replace("/","");
	
	var desktopIframe = '<iframe src="about:blank" height="728" style="width: 100%; height; 728px;" allow="geolocation *;"></iframe>';
	var mobileIframe = '<iframe src="about:blank" height="420" style="width: 100%; height; 420px;" allow="geolocation *;"></iframe>';
	var radarMobileIframe = '<iframe src="about:blank" height="620" style="width: 100%; height; 620px;" allow="geolocation *;"></iframe>';
	var radarDesktopIframe = '<iframe src="about:blank" height="728" style="width: 100%; height; 728px;" allow="geolocation *;"></iframe>';
	var snowrainFrameUrl = window.appBase + "image/snowrain-frame.do";
	var freezingRainFrameUrl = window.appBase + "image/freezing-rain-frame.do";
	function showVmap(forceCreate, submenu) {
		if(!submenu) submenu = 0;
		if(mainTabIndex != 0) return;
		var width = $(window).width();
		var height = $(window).height();
		height = height - 132;
		var $vmapFrame = $('#vmap-iframe');
		var iframeExists = true;
		if($vmapFrame.find('iframe').length == 0) {
			iframeExists = false;
		}
		var iframeCreated = false;
		
		if(submenu == 3) {
			if(!iframeExists) {
				if(width > 1101){
					$vmapFrame.html(radarDesktopIframe);
				} else {
					$vmapFrame.html(radarMobileIframe);
				}
			}
			$vmapFrame.find('iframe').attr('src', freezingRainFrameUrl);
			if(width > 1101){
				var frameWidth = $vmapFrame.width();
				var frameHeight = 1066;
				$vmapFrame.css({ height: frameHeight + "px" });
				$vmapFrame.find('iframe').attr('height', frameHeight);
				$vmapFrame.find('iframe').css({ height: frameHeight + "px" });
			} else {
				var frameWidth = $vmapFrame.width();
				var frameHeight = frameWidth>100?(frameWidth+205):620;
				$vmapFrame.css({ height: frameHeight + "px" });
				$vmapFrame.find('iframe').attr('height', frameHeight);
				$vmapFrame.find('iframe').css({ height: frameHeight + "px" });
			}
		} else if(submenu == 2) {
			if(!iframeExists) {
				if(width > 1101){
					$vmapFrame.html(radarDesktopIframe);
				} else {
					$vmapFrame.html(radarMobileIframe);
				}
			}
			$vmapFrame.find('iframe').attr('src', snowrainFrameUrl);
			if(width > 1101){
				var frameWidth = $vmapFrame.width();
				var frameHeight = 1066;
				$vmapFrame.css({ height: frameHeight + "px" });
				$vmapFrame.find('iframe').attr('height', frameHeight);
				$vmapFrame.find('iframe').css({ height: frameHeight + "px" });
			} else {
				var frameWidth = $vmapFrame.width();
				var frameHeight = frameWidth>100?(frameWidth+195):620;
				$vmapFrame.css({ height: frameHeight + "px" });
				$vmapFrame.find('iframe').attr('height', frameHeight);
				$vmapFrame.find('iframe').css({ height: frameHeight + "px" });
			}
			$('.over-map').hide();
		} else {
			if(iframeExists) {
				var iframeSrc = $vmapFrame.find('iframe').attr('src');
				if(iframeSrc.indexOf("snowrain-frame") > -1) {
					forceCreate = true;
				}
			}
			var locationParam = "&lat=" + bookmarkSelectedLat + "&lon=" + bookmarkSelectedLon;
			if(width > 1101){
				if(iframeType != "desktop" || forceCreate || !iframeExists) {
					$vmapFrame.empty();
					$vmapFrame.html(desktopIframe);
					if(submenu == 1) {
						$vmapFrame.find('iframe').attr('src', desktopVmapUrl + "&MI=main_wind" + locationParam);	
					} else {
						$vmapFrame.find('iframe').attr('src', desktopVmapUrl + "&MI=rain" + locationParam);
					}
					
					iframeType = "desktop";
					iframeCreated = true;
				} else {
					if(submenu == 1) {
						$vmapFrame.find('iframe').attr('src', desktopVmapUrl + "&MI=main_wind" + locationParam);	
					} else {
						$vmapFrame.find('iframe').attr('src', desktopVmapUrl + "&MI=rain" + locationParam);
					}
				}
					
			}else if(width <= 1100){
				if(iframeType != "mobile" || forceCreate || !iframeExists) {
					$vmapFrame.empty();
					$vmapFrame.html(mobileIframe);
					if(submenu == 1) {
						$vmapFrame.find('iframe').attr('src', mobileVmapUrl + "&MI=main_wind" + locationParam);	
					} else {
						$vmapFrame.find('iframe').attr('src', mobileVmapUrl + "&MI=rain" + locationParam);
					}
					iframeType = "mobile";
					iframeCreated = true;
				} else {
					if(submenu == 1) {
						$vmapFrame.find('iframe').attr('src', desktopVmapUrl + "&MI=main_wind" + locationParam);	
					} else {
						$vmapFrame.find('iframe').attr('src', desktopVmapUrl + "&MI=rain" + locationParam);
					}
				}
			}
			if(width > 1101){
				$vmapFrame.css({ height: "728px" });
				$vmapFrame.find('iframe').attr('height', '728');
				$vmapFrame.find('iframe').css({ height: "728px" });
			} else {
				var frameWidth = $vmapFrame.width();
				var frameHeight = 450;
				$vmapFrame.css({ height: frameHeight + "px" });
				$vmapFrame.find('iframe').attr('height', frameHeight);
				$vmapFrame.find('iframe').css({ height: frameHeight + "px" });
			}
			$('.over-map').show();
			if(submenu == 0 || submenu == 1) {
				rainMapAleadyLoaded = true;
			}
		}
	}
	
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		window.location.reload();
	});
	
	GlobalEvent.on('onNearDongReceived', function(e, bookmark, sender) {
		readBookmarkSelectedInfo();
		$('.air-station .air-station-name').html(bookmarkSelectedDong);
	});
	
	GlobalEvent.on('onGridReceived', function(e, x, y, sender) {
		var latlon = dfs_xy_conv("toLatLon", x,y);
		if(bookmarkDropdown) {
			bookmarkDropdown.onLocationReceived(latlon.lat,latlon.lng,'INSTANT_SAVE');
		}
		
	});
	
	GlobalEvent.on('onAddAreaBookmark', function(e, bookmark) {
		bookmarkDropdown.refresh(bookmark);
		indexVShort.refresh(bookmark);
		indexShortmid.refresh(bookmark);
		typhoonInfo.refreshForecast(bookmark);
		indexTodayWarning.refreshWarning(bookmark);
		//if(mapBookmarkDropdown != null) mapBookmarkDropdown.refresh(bookmark);
		//mapIndexVShort.refresh(bookmark);
		//mapIndexShortmid.refresh(bookmark);
	});
	GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
		bookmarkDropdown.refresh(bookmark);
		indexVShort.refresh(bookmark);
		indexShortmid.refresh(bookmark);
		typhoonInfo.refreshForecast(bookmark);
		indexTodayWarning.refreshWarning(bookmark);
		//if(mapBookmarkDropdown != null) mapBookmarkDropdown.refresh(bookmark);
		//mapIndexVShort.refresh(bookmark);
		//mapIndexShortmid.refresh(bookmark);
	});
	
	GlobalEvent.on('onSaveAreaBookmark', function(e) {
		bookmarkDropdown.refresh();
		indexVShort.refresh();
		indexShortmid.refresh();
		typhoonInfo.refreshForecast();
		
		//if(mapBookmarkDropdown != null) mapBookmarkDropdown.refresh();
		//mapIndexVShort.refresh();
		//mapIndexShortmid.refresh();
	});
	
	GlobalEvent.on('onAreaBookmarkSelected', function(e, bookmarkIndex, bookmark, sender) {
		if(sender.id != bookmarkDropdown.id) {
			bookmarkDropdown.refreshSelected(bookmark);
		} else {
			//mapBookmarkDropdown.refreshSelected(bookmark);
		}
		if(mainTabIndex == 1) {
			indexVShort.refresh(bookmark);
			indexShortmid.refresh(bookmark);
		}
		typhoonInfo.refreshForecast(bookmark);
		indexTodayWarning.refreshWarning(bookmark);
		//mapIndexVShort.refresh(bookmark);
		//mapIndexShortmid.refresh(bookmark);
	});
	
	GlobalEvent.on('onAreaShow', function(e, bookmark) {
		indexVShort.refresh(bookmark);
		indexShortmid.refresh(bookmark);
		typhoonInfo.refreshForecast(bookmark);
		bookmarkDropdown.refreshSelected(bookmark);
		indexTodayWarning.refreshWarning(bookmark);
		//mapIndexVShort.refresh(bookmark);
		//mapIndexShortmid.refresh(bookmark);
		//if(mapBookmarkDropdown != null) mapBookmarkDropdown.refreshSelected(bookmark);
	});
	
	GlobalEvent.on('onAreaRecentShow', function(e, bookmark) {
		indexVShort.refresh(bookmark);
		indexShortmid.refresh(bookmark);
		typhoonInfo.refreshForecast(bookmark);
		bookmarkDropdown.refreshSelected(bookmark);
		indexTodayWarning.refreshWarning(bookmark);
		//mapIndexVShort.refresh(bookmark);
		//mapIndexShortmid.refresh(bookmark);
		//if(mapBookmarkDropdown != null) mapBookmarkDropdown.refreshSelected(bookmark);
	});
	
	GlobalEvent.on('onAreaBookmarkShow', function(e, bookmark) {
		indexVShort.refresh(bookmark);
		indexShortmid.refresh(bookmark);
		typhoonInfo.refreshForecast(bookmark);
		bookmarkDropdown.refreshSelected(bookmark);
		indexTodayWarning.refreshWarning(bookmark);
		//mapIndexVShort.refresh(bookmark);
		//mapIndexShortmid.refresh(bookmark);
		//if(mapBookmarkDropdown != null) mapBookmarkDropdown.refreshSelected(bookmark);
	});
	GlobalEvent.on('onVshortUpdated', function(e, isRainNow, x, y, dates) {
		//console.log("onVShortUpdated", isRainNow);
		//vsrtRainText.updateRainDescription(isRainNow, x, y, dates)
	});
	var mainTabIndex = -1;
	var mainSubmenu = -1;
	var rainMapAleadyLoaded = false;
	var bookmarkSelectedLat = 37.493546;
	var bookmarkSelectedLon = 126.921654;
	var bookmarkSelectedDong = "서울특별시 동작구 신대방제2동";
	function startUserLocation(callback) {
		var base = this;
		var errorCallback = function(error) {
			if(console) console.log(error);
			switch(error.code) {
				case 1: // error.PERMISSION_DENIED:
					if(console) console.log("현재 위치 요청이 거부되었습니다.");
					break;
				case 2: // error.POSITION_UNAVAILABLE:
					if(console) console("위치정보를 사용할 수 없습니다.");
					break;
				case 3: // error.TIMEOUT:
					if(console) console("위치정보 요청 시간이 초과되었습니다.");
					break;
				case 4: // error.UNKNOWN_ERROR:
					if(console) console("알 수 없는 오류로 현재 위치 요청이 실패하였습니다.");
					break;
			}
		}

		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(callback, errorCallback);
		} else {
			//alert("현재 위치를 지원하지 않는 브라우져입니다.");
		}
	}
	function readBookmarkSelectedInfo() {
		var lat = appLocation[0];
		var lon = appLocation[1];
		var favoriteFound = false;
		if(bookmarkDropdown.config 
				&& ((bookmarkDropdown.config.bookmarks && bookmarkDropdown.config.bookmarks.length > 0) 
						|| bookmarkDropdown.config.selectedBookmark)) {
			if(bookmarkDropdown.config.selectedBookmark) {
				var bm = bookmarkDropdown.config.selectedBookmark;
				if(bm.dong && bm.dong.lat && bm.dong.lon && bm.dong.lat != "null" && bm.dong.lon != "null") {
					lat = bm.dong.lat;
					lon = bm.dong.lon;
					bookmarkSelectedDong = bm.fullName;
					favoriteFound = true;
				} else {
					if(bm.dong) {
						var latlon = dfs_xy_conv("toLatLon", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
						if(latlon['lat'] && latlon['lng']) {
							lat = latlon['lat'];
							lon = latlon['lng'];
							favoriteFound = true;
						}
					}
				}
					
			} else {
				var bm = bookmarkDropdown.config.bookmarks[0];
				if(bm.dong && bm.dong.lat && bm.dong.lon && bm.dong.lat != "null" && bm.dong.lon != "null") {
					lat = bm.dong.lat;
					lon = bm.dong.lon;
					bookmarkSelectedDong = bm.fullName;
					favoriteFound = true;
				} else {
					if(bm.dong) {
						var latlon = dfs_xy_conv("toLatLon", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
						if(latlon['lat'] && latlon['lng']) {
							lat = latlon['lat'];
							lon = latlon['lng'];
							bookmarkSelectedDong = bm.fullName;
							favoriteFound = true;
						}
					}
				}
			}
		}
		bookmarkSelectedLat = lat;
		bookmarkSelectedLon = lon;
	}
	GlobalEvent.on('onMainTabSelected', function(e, tabIndex, sender, submenu) {
		//console.log('onMainTabSelected', tabIndex, sender, submenu);
		if(isNaN(tabIndex)) return;
		if(typeof submenu == "undefined") submenu = 0;
		mainSubmenu = submenu;
		
		hideVmapForecast();
		
		if(tabIndex == 0) {
			if(submenu == 0) {
				$('#map-index-vshort').empty();
				$('#map-index-shortmid').empty();
				$('.tab-cont01 .weather-cont-wrap').show();
			} else {
				$('.tab-cont01 .weather-cont-wrap').hide();
			}
		} else {
			$('.tab-cont01 .weather-cont-wrap').hide();
		}
		mainTabIndex = tabIndex;
		if(tabIndex == 1) {
			if(appVersion < 1 || appLocation.length != 2) return;
			indexVShort.refresh();
			indexShortmid.refresh();
			removeVmap();
		} else if(tabIndex == 2) {
			// goto 산불
			openExternalPop('https://www.weather.go.kr/weather/special/forest_fire.jsp');
		} else if(tabIndex == 4) {
			// goto 해양사고
			openExternalPop('https://www.weather.go.kr/weather/special/special_marine_accident.jsp');
		} else if(tabIndex == 0) {
			// appVersion 을 받았고 위경도가 있을 경우만호출.
			if(appVersion < 1 || appLocation.length != 2) return;
			if(submenu == 1) {
				$('.open-btn').show();
			} else {
				$('.open-btn').hide();
			}
				
			// 기본값
			readBookmarkSelectedInfo();
			
			// 처음만 현재 위치로 시작
			if(submenu == 0) {
				$('.airkorea').hide();
				showNumericForecast(bookmarkSelectedLat, bookmarkSelectedLon, false);	
			} else if(submenu == 1) {
				$('.airkorea .air-values').hide();
				$('.airkorea .air-station').hide();
				$('.airkorea').show();
				showAirValues(bookmarkSelectedLat, bookmarkSelectedLon);
			}
			showVmap(false, submenu);
		} else if(tabIndex == 5) {
			typhoonInfo.updateData();
			$('#index-shortmid').empty();
		} else {
			removeVmap();
		}
	});
	
	arrageMainTab();
	
	function hideVmapForecast() {
		var width = $(window).width();
		var isMobile = width <= 1100;
		var $forecastPanel = $('.tab-cont01 > .weather-cont-wrap').first();
		if($forecastPanel.hasClass('closed')) {
			$('.tab-cont01 > .vmap-forecast').remove();
			$forecastPanel.removeClass('closed');
			if(mainSlick) mainSlick.find('.slick-list.draggable').first().css({'height': isMobile?'1257px':'1565px'});
		}
	}
	var lastLat, lastLon;
	function updateForecast(lat, lon, isDev) {
		lastLat = lat;
		lastLon = lon;
		// 강수 일경우만 대응.
		if(mainSubmenu != 0) return; 
		var path = "/visualmap/landfct/forecast/retrieveForecast.do?lat=" + lat + "&lon=" + lon + "&unitws=" + unitws.replace("/","") + "&menuid=rain&HIDEMENU=Y";
		var url = (isDev?"https://devvmap.kma.go.kr":"https://vmap.kma.go.kr") + path;
		var forecastIframe = '<iframe src="' + url + '" height="290" style="width: 100%; height; 290px;" allow="geolocation *;"></iframe>';
		var $forecastPanel = $('.tab-cont01 > .weather-cont-wrap').first();
		if($forecastPanel.hasClass('closed')) {
			$('.tab-cont01 > .vmap-forecast > iframe').attr('src', url);
		}
	}
	function showNumericForecast(lat, lon, isDev) {
		// 강수 일경우만 대응.
		if(mainSubmenu != 0) return; 
		lastLat = lat;
		lastLon = lon;
		var path = "/visualmap/landfct/forecast/retrieveForecast.do?lat=" + lat + "&lon=" + lon + "&unitws=" + unitws.replace("/","") + "&menuid=rain&HIDEMENU=Y";
		var url = (isDev?"https://devvmap.kma.go.kr":"https://vmap.kma.go.kr") + path;
		var forecastIframe = '<iframe src="' + url + '" height="286" width="535" style="width: 535px; height; 300px;" allow="geolocation *;" scrolling="yes"></iframe>';
		var $forecastPanel = $('.tab-cont01 > .weather-cont-wrap').first();
		var vmapForecast = '<div class="vmap-forecast">' + forecastIframe + '</div>';
		var width = $(window).width();
		var isMobile = width <= 1100;
		if($forecastPanel.hasClass('forecast-loaded')) {
			$forecastPanel.find('iframe').attr('src', url);
		} else {
			$forecastPanel.addClass('forecast-loaded');			
			$forecastPanel.html(vmapForecast);
			if(mainSlick) mainSlick.find('.slick-list.draggable').first().css({'height': isMobile?'736px':'1044px'});
		}
		if(bookmarkDropdown) {
			bookmarkDropdown.onLocationReceived(lat,lon,'INSTANT_SAVE');
		}
	}
	function requestNearAirStation(lat, lon) {
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "rest/zone/find/air-station.do",
			data: {lat: lat, lon: lon},
			dataType: "json"
		});
	}
	function requestNearAirValue(name) {
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "rest/zone/find/air-value.do",
			data: {name: name},
			dataType: "json"
		});
	}
	var AIR_LEVEL = [
		{level: 0, text:'자료없음', color: '#cbd0d3'}
		, {level: 1, text:'좋음', color: '#1f6fdd'}
		, {level: 2, text:'보통', color: '#01b56e'}
		, {level: 3, text:'나쁨', color: '#f5c932'}
		, {level: 4, text:'매우나쁨', color: '#da3539'}
	];
	function getAirLevel(type, strVal) {
		if(isNaN(strVal)) return AIR_LEVEL[0];
		var value = parseFloat(strVal);
		switch(type) {
			case 'pm25':
				if(value <= 15) return AIR_LEVEL[1];
				else if(value <= 35) return AIR_LEVEL[2];
				else if(value <= 75) return AIR_LEVEL[3];
				else return AIR_LEVEL[4];
				break;
			case 'pm10':
				if(value <= 30) return AIR_LEVEL[1];
				else if(value <= 80) return AIR_LEVEL[2];
				else if(value <= 150) return AIR_LEVEL[3];
				else return AIR_LEVEL[4];
				break;
			case 'o3':
				if(value <= 0.03) return AIR_LEVEL[1];
				else if(value <= 0.09) return AIR_LEVEL[2];
				else if(value <= 0.15) return AIR_LEVEL[3];
				else return AIR_LEVEL[4];
				break;
			case 'no2':
				if(value <= 0.03) return AIR_LEVEL[1];
				else if(value <= 0.06) return AIR_LEVEL[2];
				else if(value <= 0.2) return AIR_LEVEL[3];
				else return AIR_LEVEL[4];
				break;
			case 'co':
				if(value <= 2) return AIR_LEVEL[1];
				else if(value <= 9) return AIR_LEVEL[2];
				else if(value <= 15) return AIR_LEVEL[3];
				else return AIR_LEVEL[4];
				break;
			case 'so2':
				if(value <= 0.02) return AIR_LEVEL[1];
				else if(value <= 0.05) return AIR_LEVEL[2];
				else if(value <= 0.15) return AIR_LEVEL[3];
				break;
			case 'cai':
				if(value <= 50) return AIR_LEVEL[1]
				else if(value <= 100) return AIR_LEVEL[2];
				else if(value <= 250) return AIR_LEVEL[3];
				else return AIR_LEVEL[4];
				break;
		}
		return AIR_LEVEL[0];
	}
	function fillAirValue(query, value, level) {
		var $item = $(query);
		$item.find('.air-lvv').html(value);
		$item.find('.air-lvt').html(level.text);
		$item.find('.air-level').css({color: level.color});
	}
	function showAirValues(lat, lon) {
		// 바람일경우
		if(mainSubmenu != 1) return;
		try {
			requestNearAirStation(lat, lon).then(
					function(data) {
						for(var i in data) {
							var station = data[i];
							$('.air-station .air-station-name').html(bookmarkSelectedDong);
							var addrs = station.addr.split(' ');
							var stationAddr = addrs[0] + ' ' + addrs[1] + (station.name!=addrs[1]?(' ' + station.name):'');
							$('.air-station .air-station-addr').html(stationAddr + '측정소' + '(' + station.mangName + ') ');
							requestNearAirValue(station.name).then(
									function(value) {
										console.log(value);
										if(value.length > 0) {
											var pm25Level = getAirLevel('pm25', value[0].pm25Value);
											var pm10Level = getAirLevel('pm10', value[0].pm10Value);
											var o3Level = getAirLevel('o3', value[0].o3Value);
											
											$('.air-station .air-value-time').html(value[0].dataTime + ' 기준');
											fillAirValue('.air-values .air-item .pm25', value[0].pm25Value, pm25Level);
											fillAirValue('.air-values .air-item .pm10', value[0].pm10Value, pm10Level);
											fillAirValue('.air-values .air-item .o3', value[0].o3Value, o3Level);
											
											$('.airkorea .air-values').find('li.air-level').css('visibility','visible');
										} else {
											$('.airkorea .air-values').hide();
											$('.airkorea .air-station').hide();
										}								
										
									},
									function(err) {
										console.log(err)
										$('.airkorea .air-values').hide();
										$('.airkorea .air-station').hide();
									}
							);;
						}
						$('.airkorea .air-values').find('li.air-level').css('visibility','hidden');
						$('.airkorea .air-values').show();
						$('.airkorea .air-station').show();
						var isMobile = mobilecheck();
						mainSlick.find('.slick-list').height(isMobile?'770px':'980px');
					},
					function(err) {
						console.log(err)
						$('.airkorea .air-values').hide();
						$('.airkorea .air-station').hide();
					}
			);
			if(bookmarkDropdown) {
				bookmarkDropdown.onLocationReceived(lat,lon,'INSTANT_SAVE');
			}
		}catch(e){if(window.console) console.log(e);}
	}

	$(document).ready(function() {
		window.parent.postMessage({
			action: "load"
		}, '*');
	});
	
	window.addEventListener('message', function (e) {
		if (e.origin === 'https://devvmap.kma.go.kr' || e.origin === 'https://vmap.kma.go.kr') {
			if(e.data.action == "click-location"){
				if($('.tab-cont01 > .weather-cont-wrap').hasClass('forecast-loaded')) {
					if(parseInt(e.data.param[2]) != 0) return;
					showNumericForecast(e.data.param[0], e.data.param[1], e.origin === 'https://devvmap.kma.go.kr');
				} else {
//					if(mapBookmarkDropdown) {
//						/*
//						 * params = [ '위도', '경도', 'mask(0,1,2)'];
//						 * mask: '0' 육지, '1' 바다, '2' 국외
//						 */
//						if(parseInt(e.data.param[2]) != 0) return;
//						mapBookmarkDropdown.onLocationReceived(e.data.param[0],e.data.param[1])
//					}
				}
				if(parseInt(e.data.param[2]) != 0) return;
				showAirValues(e.data.param[0], e.data.param[1]);
			} else if(e.data.action == "show-forecast" || e.data.action == "show-forecase") {
				if(parseInt(e.data.param[2]) != 0) return;
				showNumericForecast(e.data.param[0], e.data.param[1], e.origin === 'https://devvmap.kma.go.kr')
				showAirValues(e.data.param[0], e.data.param[1]);
			}
		} else {
			if(e.data.action == "getVersion"){
				if(!e.data.param) return;
				appVersion = e.data.param[0];
				if(bookmarkDropdown && typeof bookmarkDropdown.appVersionReceived == "function") {
					bookmarkDropdown.appVersionReceived(appVersion);
					bookmarkDropdown.addEventHandler();
				}
				getAppLocation();
			} else if(e.data.action == "getLocation") {
				if(!e.data.param) return;
				appLocation = e.data.param;
				if(bookmarkDropdown && typeof bookmarkDropdown.appLocationReceived == "function") {
					bookmarkDropdown.appLocationReceived(appLocation[0], appLocation[1]);
				}
				if(mainTabIndex == 0) {
					GlobalEvent.trigger($.Event("onMainTabSelected"), [mainTabIndex, this, mainSubmenu]);	
				}
				
			} else if(e.data.action == "bookmark-save") {
				console.log(e.data);
				if(!e.data.success || e.data.success != "true") {
					//alert("관심지역 저장이 실패하였습니다.");
				}
			} else if(e.data.action == "bookmark-init" || e.data.action == "bookmark-read") {
				console.log(e.data);
				var config = store.get("W_DC");
				if(config == null) {
					config = { bookmarks: [], selectedBookmark: null};
				}
				// 북마크가 변경되었는지 검사.
				var isBookmarkUpdated = false;
				if(e.data.bookmarks) {
					if(config.bookmarks == null) {
						isBookmarkUpdated = true;
					} else if(e.data.bookmarks.length != config.bookmarks.length) {
						isBookmarkUpdated = true;
					} else if(e.data.bookmarks.length == config.bookmarks.length) {
						for(var i = 0 ; i < e.data.bookmarks.length ; i++) {
							var b1 = config.bookmarks[i].dong?config.bookmarks[i].dong.code:"";
							var b2 = e.data.bookmarks[i].dong?e.data.bookmarks[i].dong.code:"";
							if(b1 == "" || b2 == "") {
								isBookmarkUpdated = true;
								break;
							} else if(b1 != b2) {
								isBookmarkUpdated = true;
								break;
							}
						}
					}
					
					// 관심지역 변경된 경우 업데이트.
					if(isBookmarkUpdated) {
						config.bookmarks = [];
						for(var i = 0 ; i < e.data.bookmarks.length ; i++) {
							var bookmark = Object.assign({}, e.data.bookmarks[i]);
							bookmark.wide = Object.assign({}, {
								code: bookmark.dong.code.substring(0,2) + (bookmark.dong.code.length == 12 ? "0000000000" : "00000000"),
								name: bookmark.dong.wide_name 
							});
							bookmark.city = Object.assign({}, {
								code: bookmark.dong.code.substring(0,5) + (bookmark.dong.code.length == 12 ? "0000000" : "00000"),
								name: bookmark.dong.city_name 
							});
							bookmark.dong = Object.assign({}, bookmark.dong);
							config.bookmarks.push(bookmark);
						}
						
						store.set("W_DC", config);	
					}
				} else {
					// 비정상 패킷은 화면 리프레시.
					isBookmarkUpdated = true;
				}
				if(bookmarkDropdown && !bookmarkDropdown.loaded) {
					isBookmarkUpdated = true;
				}
				if(isBookmarkUpdated) {
					if(bookmarkDropdown) bookmarkDropdown.refresh();
					if(dongConfigInSearch) dongConfigInSearch.reloadMyAreas();
					if(loadConfigInSearch) loadConfigInSearch.reloadMyAreas();
					if(dongConfigInUserConfig) dongConfigInUserConfig.reloadMyAreas();
					if(loadConfigInUserConfig) loadConfigInUserConfig.reloadMyAreas();
					if(myAreaList) myAreaList.reloadMyAreas();	
				}
				//if(bookmarkDropdown) bookmarkDropdown.showDropdown();
				
			} else if(e.data.action == "config-init" || e.data.action == "config-read") {
				var ac = Object.assign({}, { unit: e.data.unit, panelOrder: e.data.panelOrder });
				store.set("W_AC", ac);
				if(appConfig) {
					appConfig.readConfig();
					appConfig.updateView();
				}
			} else if(e.data.action == "config-save") {
				console.log(e.data);
				if(!e.data.success || e.data.success != "true") {
					//alert("설정 저장이 실패하였습니다.");
				}
			}
		}
	});
	
//	function configureTab(hash) {
//		if(hash) {
//			var dirs = hash.split("/");
//			if(dirs.length >= 2) {
//				if(dirs[0] == "#tab") {
//					var tabIndex = parseInt(dirs[1]) - 1;
//					$('.maintab>div>button').each(function(idx) {
//						if(tabIndex == idx) {
//
//						}
//					});
//				} 
//			}
//		}
//	}
	// main tab
//	$(window).on('hashchange', function(e) {
//		var hash = window.location.hash;
//		configureTab(hash);
//	});
	function openExternalPop(url) {
		if(!url) return;
		
		if(url.substring(0,1) == "/") {
			url = window.location.origin + url;
		}
		
		try {
			parent.mobileWebOpen(url);
		} catch(e) {
			console.log(e);
			try {
				window.parent.postMessage({ childData : { url: url } }, '*');
			}catch(ee) { console.log(ee);}
		}
	}
	$('.maintab-wrap').on('click', 'a', function(e) {
		var url = this.href;
		var href = $(this).attr('href');
		if(url && (href.length > 0 && href.substring(0,1) != "#")) {
			e.preventDefault();
			openExternalPop(url);
		}
	});
	$('.open-btn').on('click', function(e) {
		var url = this.href;
		if(url) {
			e.preventDefault();
			openExternalPop(url);
		}
	});
	$('.banner-btn').on('click', function(e) {
		var url = this.href;
		if(url) {
			e.preventDefault();
			openExternalPop(url);
		}
	});
	
	// request app version 
	function getAppVersion() {
		try { window.parent.postMessage({ action : "getVersion" }, '*'); } catch(e) { if(console) console.log(e);}
	}
	function getAppLocation() {
		try { window.parent.postMessage({ action : "getLocation" }, '*'); } catch(e) { if(console) console.log(e);}
	}
	getAppVersion();
})(jQuery, window, document);

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