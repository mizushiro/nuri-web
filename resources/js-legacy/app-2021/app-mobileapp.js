/**
 * 리뉴2021 날씨알리미
 */
'use strict';
(function($, window, document){
	var	version = "1.0",
		bookmarkDropdown = null,
		bookmarkSelectedLat = 37.493546, 
		bookmarkSelectedLon = 126.921654,
		bookmarkSelectedDong = "서울특별시 동작구 신대방제2동",
		bookmarkSelectedDongCode = "1159068000",
		wsUnit = "m/s",
		appPrefix = (window.appBase ? window.appBase : '/'),
		renewPrefix = appPrefix + 'renew2021/',
		indexLocalSearchbox = null,
		popLocalSearchbox = null,
		myPointSlider = null,
		appLocation = null,
		vmap = null,
		hashParam = null,
		ptrEnabled = true,
		typhoonInfo = null,
		currentLocation = { lat:bookmarkSelectedLat, lon:bookmarkSelectedLon};
	
	var dfsSlider = null;
	if(appConfig && appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
		wsUnit = appConfig.config.unit.ws;
	}
	/*
		해시 파라미터 읽기.
		형식 : #tab=vmap/subtab=1/lat=36.7/lon=126.2/zoom=7
	*/
	if(window.location.hash) {
		try {
			var route = window.location.hash.substr(1);
			var routes = route.split('/');
			hashParam = {};
			for(var i in routes) {
				var kv = routes[i].split('=');
				if(kv[1]) hashParam[kv[0]] = kv[1];
			}
		}catch(e) {
			if(window.console) console.log(e);
			hashParam = null;
		}
	}
	// mobile app start();
	$(document).ready(function() {
		// 전체 지도 모드에서는 스킵
		window.parent.postMessage({
			action: "load"
		}, '*');
		
		if($('body').hasClass("mode-map")) {
			initMapMode();
		} else {
			initDefaultMode();		
		}
	});
	function initDefaultMode() {
		
		createMainTab();
		createMyPointSlider();
		createLocalWeather();
		createIconInfo();
		createRadarSat();
		createSearchBox();
		if($('.cont-wrap').hasClass('plan-b')) {
			if(!vmap) createMapInterface();
		}
		
		createCurrentWarning();
		createBookmarks();
		createCurrentWeather();
		createTyphoonInfo();
		createPopMyPointsEvent();
		createEqkWarning();
		createDefaultModeEvent();
		createGlobalEvent();
		if(window.typhoonEnabled) {
			$('.cmp-main-tabs .tab-item').removeClass('on');
			$('.cmp-main-tabs .tab-item').eq(0).addClass('on');
		}
		startMobileApp();
	}
	function initMapMode() {
		createMainTab();
		createLocalWeather();
		createRadarSat();
		createMapInterface();
		createGlobalEvent();
	}
	function createTyphoonInfo() {
		if(!window.typhoonEnabled) return false;
		  var $tabs = $('.cmp-main-tabs');
		  var $newTab = $('<div class="tab-item">');
		  $newTab.append('<h2 class="tab-head typh"><a href="#">태풍</a></h2>')
			  .append('<div class="tab-content" id="index-typhoon-info"></div>')
			  .prependTo($tabs);
		  typhoonInfo = new TyphoonInfo("index-typhoon-info");
		  typhoonInfo.updateData();
		  return true;
	}
	function createIconInfo() {
		$('#open_icon_info').on('click', function(e) {
			e.preventDefault();
			ptrEnabled = false;
			var src = this.href;
		    $('<div>').html('<button class="btn-fullimage-close" title="강수 아이콘 구분 안내 닫기"></button>').css({
		        background: 'rgba(0,0,0,.7) url('+src+') no-repeat center',
		        backgroundSize: 'contain',
		        width:'100%', height:'100%',
		        position:'fixed',
		        zIndex:'10000',
		        top:'0', left:'0',
		        cursor: 'zoom-out',
		    }).click(function(){
		        $(this).remove();
		        ptrEnabled = true;
		    }).appendTo('body');
		});
	}
	function createPTR(){
		var ptr = PullToRefresh.init({
			mainElement: '.cont-wrap',
			triggerElement: '.container',
			distThreshold: 80,
			distMax: 100,
			distReload: 70,
			distIgnore: 20,
			instructionsPullToRefresh: '당겨서 날씨를 새로고칩니다.',
			instructionsReleaseToRefresh: '놓으면 새로고칩니다.',
			instructionsRefreshing: '새로고칩니다.',
			refreshTimeout: 300,
			shouldPullToRefresh: function() {
				return !this.triggerElement.scrollTop // !window.scrollY 
						&& ptrEnabled 
						&& !$('#today-warning').hasClass('on')
						&& $('.cmp-main-tabs .tab-item').eq(window.typhoonEnabled ? 1 : 0).hasClass('on');
			},
			onRefresh: function() {
				window.setTimeout(function() {
					if(bookmarkDropdown) {
						var bookmark = bookmarkDropdown.config.selectedBookmark;
						if(bookmark) {
							updateCurrentWeather(bookmark);
							updateDigitalForecast(bookmark);
						}
					}
				},10);
			}
		});
	}
	function createLongTermRefresh(){
		var lastUpdated = (new Date()).getTime();
		// 1시간
		var updateTerm = 1000 * 60 * 60;
		
		function _checkUpdateExecute(){
			var currentTime = (new Date()).getTime();
			if(currentTime - lastUpdated >= updateTerm ) {
				if(bookmarkDropdown && bookmarkDropdown.config) {
					var bookmark = bookmarkDropdown.config.selectedBookmark;
					if(bookmark) {
						updateCurrentWeather(bookmark);
						updateDigitalForecast(bookmark);
					}
				}
				updateRadarSat();
				lastUpdated = currentTime;
			}
			
			window.setTimeout(function() {
				_checkUpdateExecute();
			},1000 * 5);
		}
		window.setTimeout(function() {
			_checkUpdateExecute();
		},1000 * 5);
	}
	function startMobileApp() {
		window.addEventListener('message', function (e) {
			if(e.data.action == "getVersion"){
				if(!e.data.param) return;
				appVersion = e.data.param[0];
				if(bookmarkDropdown && typeof bookmarkDropdown.appVersionReceived == "function") {
					bookmarkDropdown.appVersionReceived(appVersion);
					bookmarkDropdown.addEventHandler();
				}
				getAppLocation();
			} else if(e.data.action == "getLocation") {
				showLoading('current-weather', false);
				if(!e.data.param) return;
				appLocation = e.data.param;
				currentLocation = { lat:appLocation[0], lon:appLocation[1] }
				if(bookmarkDropdown && typeof bookmarkDropdown.appLocationReceived == "function") {
					bookmarkDropdown.appLocationReceived(appLocation[0], appLocation[1]);
				}
				createPTR();
				createLongTermRefresh();
			} else if(e.data.action == "bookmark-save") {
				//console.log(e.data);
				if(!e.data.success || e.data.success != "true") {
					//alert("관심지역 저장이 실패하였습니다.");
				}
			} else if(e.data.action == "bookmark-init" || e.data.action == "bookmark-read") {
				//console.log(e.data);
				if($('.cmp-main-tabs > .tab-item').length > 0 && !$('.cmp-main-tabs > .tab-item').first().hasClass('on')) {
					$('.cmp-main-tabs > .tab-item > .tab-head.home > a').first().trigger('click');
				}
				
				var config = store.get("W_DC");
				// 북마크가 변경되었는지 검사.
				var isBookmarkUpdated = false;
				if(config==null) {
					config = { bookmarks: [], selectedBookmark: null};
				}
				if(e.data.bookmarks && config != null) {
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
				}
				if(myPointSlider) myPointSlider.refresh();
				//if(bookmarkDropdown) bookmarkDropdown.showDropdown();
				
			} else if(e.data.action == "config-init" || e.data.action == "config-read") {
				//console.log(e.data);
				var ac = null;
				if(e.data.config) {
					ac = Object.assign({}, e.data.config);
				} else {
					ac = Object.assign({}, { unit: e.data.unit, panelOrder: e.data.panelOrder });
				}
				
				store.set("W_AC", ac);
				if(appConfig) {
					appConfig.readConfig();
					appConfig.updateView();
				}
			} else if(e.data.action == "config-save") {
				//console.log(e.data);
				if(!e.data.success || e.data.success != "true") {
					//alert("설정 저장이 실패하였습니다.");
				}
			}
		});
		getAppVersion();
	}
	
	function createMainTab() {
		$('.cmp-main-tabs').on('click', '.tab-item .tab-head a', function(e) {
			var isNoTabContent = $(this).hasClass('no-tab-content');
			if(!isNoTabContent) {
				e.preventDefault();
				$(this).parents('.cmp-main-tabs').find('.tab-item').removeClass('on');
				$(this).parents('.tab-item').addClass('on');
				window.setTimeout(function() {
					if(dfsSlider) dfsSlider.refresh();
				},10);
			} else {
				$(this).blur();
			}
			if($(this).parent().hasClass('home')) {
				if(myPointSlider) myPointSlider.refresh(); 
			}
			
		});
	}
	function createMyPointSlider() {
		myPointSlider = new MyPointSlider('my-point-slider');
	}
	var satSlick = null;
	function updateRadarSat() {
		requestCurrentImages().then(function(data) {
			//console.log('requestCurrentImages', data);
			if(data.length >= 2) {
				if(data[0].url) $('#radar-image .image-item').eq(0).html('<img src="' + (appPrefix + data[0].url + '?ver=' + (new Date().getTime())) + '" alt="' + data[0].alt + '">');
				var satHtml = '';
				for(var i = 1 ; i < data.length ; i++) {
					var dt = data[i];
					if(dt.url) {
						satHtml += '<img src="' + (appPrefix + dt.url) + '" alt="' + dt.alt + '">';
					}
				}
				var $satItem = $('#radar-image .image-item').eq(1); 
				$satItem.html(satHtml);
				if(satSlick) {
					satSlick.slick("unslick");
				}
				satSlick = $satItem.slick({
		            dots: false,
		            arrows: false,
		            infinite: true,
		            slidesToShow: 1,
		            slidesToScroll: 1,
		            autoplay:true,
		            autoplaySpeed:300,
		            speed:0,
		            swipe: false,
		            fade: false,
		            adaptiveHeight: true,
		            accessibility: false
		        });
			}
		}, function(err){
			console.log(err);
		});
	}
	function createRadarSat() {
		$('.cmp-common-tabs a[data-role="radar-image"]').on('click', function(e) {
			e.preventDefault();
			var index = $(this).parent().index();
			$('#radar-image .image-item').removeClass('on').eq(index).addClass('on');
			if(satSlick && index == 1) {
				satSlick.slick('setPosition');
				satSlick.slick('slickGoTo', 0, false);
			}
		});
		
		$('#radar-image .updated-at a').on('click', function(e) {
			e.preventDefault();
			updateRadarSat();
		});
		updateRadarSat();
	}
	function createLocalWeather() {
		requestLocalWeather('current', '0', wsUnit).then(
			function(html) {
				$('#local-weather').html(html);
			},
			function(err) {
				console.log(err);
			}
		);
		requestWeatherCmt().then(
			function(html) {
				$('#weather-cmt').html(html);
			},
			function(err){
				console.log(err);
			}
		);
		addEvents();
		function addEvents() {
			$('.cmp-common-tabs a[data-role="local-weather"]').on('click', function(e) {
				e.preventDefault();
				var type = $(this).attr('data-type');
				requestLocalWeather(type, '0', wsUnit).then(
					function(html) {
						$('#local-weather').html(html);
					},
					function(err) {
						console.log(err);
					}
				);
			});
			$('#local-weather').on('click', '>.cmp-local-weather > div > h3 > a', function(e) {
				e.preventDefault();
				var $localWeather = $(this).parents('.cmp-local-weather');
				$localWeather.find('> .map-data-wrap').removeClass('on');
				$localWeather.find('> .map-data-wrap > h3 > a').attr('title','');
				$(this).attr('title','선택됨');
				$(this).parents('.map-data-wrap').addClass('on');
			});
			$('#local-weather').on('click', '[data-dong-code]', function(e) {
				var dongCode = $(this).attr('data-dong-code');
				$.ajax({
	                url: appPrefix + '/rest/zone/dongInfo.do',
	                data: { dong: dongCode },
	                type: 'get',
	                dataType: 'json'
	            }).then(function(result) {
	                var wide = result.wide;
	                var city = result.city;
	                var dong = result.dong;
	                
	                if(!wide) return;
	                var x = wide.x, 
	                    y = wide.y, 
	                    lat = wide.lat, 
	                    lon = wide.lon;
	                if(!city) {
	                    city = { code: dongCode.substring(0,5) + "00000", name:"" };
	                } else {
	                    x = city.x;
	                    y = city.y;
	                    lat = city.lat;
	                    lon = city.lon;
	                }
	                if(!dong) {
	                    dong = { code: city.code, name: "", x: x, y: y, lat: lat, lon: lon };
	                } else {
	                    x = dong.x;
	                    y = dong.y;
	                    lat = dong.lat;
	                    lon = dong.lon;
	                }
	                var fullName = "";
	                if(wide) fullName += wide.name;
	                if(city) fullName += city.name ? (" " + city.name) : "";
	                if(dong) fullName += dong.name ? (" " + dong.name) : ""; 
	                var bookmark = {
	                        wide: wide,
	                        city: city,
	                        dong: dong,
	                        x: x, 
	                        y: y,
	                        lat: lat,
	                        lon: lon,
	                        fullName: fullName
	                    };
	                $('.cmp-main-tabs > .tab-item > .tab-head.home > a').first().trigger('click');
	                GlobalEvent.trigger($.Event("onAreaShow"), [bookmark, this, true]);
	            });
			});
		}
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
	function createCurrentWarning() {
		var todayWarning = new TodayWarning('today-warning');
	}
	function createBookmarks() {
		bookmarkDropdown = new BookmarkDropdown('index-bookmarks');
	}
	function createCurrentWeather() {
		// get code from bookmark
		readBookmarkSelectedInfo();
	}
	function createPopMyPointsEvent() {
		$('.cmp-pop-my-points .sym-close').click(function(e) {
			e.preventDefault();
			var $comp = $(this).parents('.cmp-pop-my-points');
			$comp.css({ marginTop: -$comp.height() + 'px' })
				.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ $(this).addClass('closed'); });
		});
	}
	function createEqkWarning() {
		var eqkWarning = new EqkWarning('eqk-warning');
	}
	function createDefaultModeEvent() {
		$('.open-wgis, .open-wgis-tab').on('click', function(e) {
			e.preventDefault();
			if(bookmarkDropdown && bookmarkDropdown.config) {
				e.preventDefault();
				var selectedBookmark = bookmarkDropdown.config.selectedBookmark;
				if(!selectedBookmark || !selectedBookmark.lat || !selectedBookmark.lon) {
					var $selectedItem = $('#index-bookmarks a[data-role="bookmark-selected"]').first();
					var wideCode = $selectedItem.attr('data-wide-code');
					var cityCode = $selectedItem.attr('data-city-code');
					var dongCode = $selectedItem.attr('data-dong-code');
					var wideName = $selectedItem.attr('data-wide-name');
					var cityName = $selectedItem.attr('data-city-name');
					var dongName = $selectedItem.attr('data-dong-name');
					var x = $selectedItem.attr('data-x');
					var y = $selectedItem.attr('data-y');
					var lat = $selectedItem.attr('data-lat');
					var lon = $selectedItem.attr('data-lon');
					var near = $selectedItem.attr('data-near') == "true" ? true : false;
					var fullName = $selectedItem.text();
					selectedBookmark = {
							wide: {code: wideCode, name: wideName},
							city: {code: cityCode, name: cityName},
							dong: {code: dongCode, name: dongName, x: x, y: y, lat: lat, lon: lon,},
							x: x, 
							y: y,
							lat: lat,
							lon: lon,
							fullName: fullName,
							near: near
						};
					bookmarkDropdown.config.selectedBookmark = selectedBookmark;
				}
				var href = this.href;
				href += "?location=";
				href += selectedBookmark.near ? currentLocation.lon : selectedBookmark.lon;
				href += "," + (selectedBookmark.near ? currentLocation.lat : selectedBookmark.lat);
				openExternalPop(href);
			} 
		});
		$('.cmp-sp-banner a').on('click', function(e) {
			e.preventDefault();
			openExternalPop(this.href);
		});
		$('#today-warning').on('click', '.big-btn', function(e) {
			e.preventDefault();
			openExternalPop(this.href);
		});
		$('.cmp-main-tabs').on('click', '#eqk-warning a[target="_blank"]', function(e) {
			e.preventDefault();
			openExternalPop(this.href);
		});
		$('.cmp-main-tabs').on('click', '#index-typhoon-info a[target="_blank"]', function(e) {
			e.preventDefault();
			openExternalPop(this.href);
		});
		$('#current-weather').on('click', 'a[target="_blank"]', function(e) {
			e.preventDefault();
			openExternalPop(this.href);
		});
		$('#digital-forecast').on('click', 'a[target="_blank"]', function(e) {
			e.preventDefault();
			openExternalPop(this.href);
		});
		$('.container').on('click', '.cmp-cur-weather-air a[data-air-type]', function(e) {
			e.preventDefault();
			var airType = $(this).attr('data-air-type');
			$('.cmp-air-legend .shadow-box').each(function(idx,ele) {
				var $box = $(ele);
				if(airType == $box.attr('data-air-type')) {
					if(!$box.hasClass('on')) {
						$box.addClass('on');
					}
				} else {
					$box.removeClass('on');
				}
			});
		});
		$('.container').on('click', '.cmp-air-legend .close-box', function(e) {
			e.preventDefault();
			$('.cmp-air-legend .shadow-box').removeClass('on');
		});
		$('#current-weather').on('click','.cmp-cmn-para.odam-updated .updated-at', function(e) {
			e.preventDefault();
			if(bookmarkDropdown) {
				var bookmark = bookmarkDropdown.config.selectedBookmark;
				if(bookmark) {
					updateCurrentWeather(bookmark);
					updateDigitalForecast(bookmark);
				}
			}
		});
		$('.iconguide-wrap').on('click', 'a[target="_blank"]', function(e) {
			e.preventDefault();
			openExternalPop(this.href);
		});
		$('#digital-forecast').on('click','a.pop10-toggle-btn', function(e) {
            e.preventDefault();
            var $vf = $('#digital-forecast').find('.vshort-forecast');
            if(bookmarkDropdown) {
                var bookmark = bookmarkDropdown.config.selectedBookmark;
                if(bookmark && bookmark.dong && bookmark.dong.code) {
                    var dongCode = bookmark.dong.code;  
                    if(!$vf.hasClass('on')) {
                        $vf.addClass('on');
                    }
                    updateVshortForecast(bookmark);
                }
            };
        });
		$('#digital-forecast').on('click','a.cmp-vshort-forecast-close', function(e) {
            e.preventDefault();
            var $vf = $('#digital-forecast').find('.vshort-forecast');
            $vf.removeClass('on');
        });
	}
	function updateCurrentWeather(bookmark) {
		showLoading('current-weather', true);
		requestCurrentWeather(bookmark.dong.code, wsUnit).then(
			function(html) {
				showLoading('current-weather', false);
				$('#current-weather').html(html);
			},
			function(err) {
				showLoading('current-weather', false);
				console.log(err);
			}
		);
	}
	function updateDigitalForecast(bookmark) {
		showLoading('digital-forecast', true);
		requestDigitalForecast(bookmark.dong.code, wsUnit).then(
			function(html) {
				showLoading('digital-forecast', false);
				var isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
				var isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
				var $dfWrapper = $('#digital-forecast');
				$dfWrapper.html(html);
				if(isModeChart) {
					$dfWrapper.find('> .cmp-dfs-slider').addClass('mode-chart');
					$.each($dfWrapper.find('.view-options a'), function(i,ele) {
						var $opt = $(this);
						if($opt.attr('data-value') == 'mode-chart') {
							if(!$opt.hasClass('on')) $opt.addClass('on');
						} else {
							$opt.removeClass('on');
						}
					});		
					$('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
					$('.cmp-dfs-slider a.sym-btn[data-view="mode-chart"]').addClass('on');
				} else if(isModeTable) {
					$dfWrapper.find('> .cmp-dfs-slider').addClass('mode-table');
					$.each($dfWrapper.find('.view-options a'), function(i,ele) {
						var $opt = $(this);
						if($opt.attr('data-value') == 'mode-table') {
							if(!$opt.hasClass('on')) $opt.addClass('on');
						} else {
							$opt.removeClass('on');
						}
					});
					$('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
					$('.cmp-dfs-slider a.sym-btn[data-view="mode-table"]').addClass('on');
				}
				window.setTimeout(function () {
					createDfsSlider();
				}, 0);
			},
			function(err) {
				console.log(err);
				showLoading('digital-forecast', false);
			}
		);	
	}
	function updateVshortForecast(bookmark) {
        showLoading('vshort-forecast', true, 'light under-pos');
        $.ajax({
            url: appPrefix + 'wnuri-fct2021/main/vshort-forecast.do',
            data: { code: bookmark.dong.code, unit: wsUnit, hr1: 'Y' },
            type: 'get',
            dataType: 'html'
        }).then(
            function(html) {
                $('#vshort-forecast').html(html);
                buildRain10Chart(bookmark);
            },
            function(err) {
                console.log(err);
                showLoading('vshort-forecast', false);
            }
        );
    }
    function buildRain10Chart(bookmark) {
        function buildChart(data) {
            var vshortDates = [];
            var $vf = $('#vshort-forecast');
            $.each($vf.find('.vsitem'), function(i, ele) {
                var date = $(this).attr('data-date');
                var time = $(this).attr('data-time');
                if(!date) return;
                vshortDates.push(moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').add(-1,'hour'));
            });
            var rangeStart = vshortDates[0].clone();
            rangeStart.set('minute', 0);
            rangeStart.set('second', 0);
            var rangeEnd = vshortDates[vshortDates.length - 1].clone();
            rangeEnd.add(1, 'hour');
            rangeEnd.set('minute', 0);
            rangeEnd.set('second', 0);
            console.log(rangeStart.format('YYYY-MM-DD HH:mm:ss'));
            console.log(rangeEnd.format('YYYY-MM-DD HH:mm:ss'));
            var hourlyMax = {};
            var values = _.filter(data, function(d) {
               var dt = moment(d[0], 'YYYY[.]MM[.]DD[.]HH[:]mm');
               return dt.isAfter(rangeStart, 'minute') && ( dt.isBefore(rangeEnd, 'minute') || dt.isSame(rangeEnd, 'minute'));
            });
            values = _.map(values, function(v) {
               var dt = moment(v[0], 'YYYY[.]MM[.]DD[.]HH[:]mm');
               dt.clone().add(-1,'minute');
               return { dt:dt.clone().add(-1,'minute').format('YYYY[-]MM[-]DD HH[:00:00]'), x:dt.toDate(), y:v[2] }
            });
            var yMax = 0.0;
            _.forEach(values, function(v,i) {
               var max = hourlyMax[v.dt];
               if(!max) {
                   max = { v: 0, i: i };
                   hourlyMax[v.dt] = max;
               }
               if(max.v < v.y) {
                   max = { v: v.y, i: i};
                   hourlyMax[v.dt] = max;
               }
            });
            _.forEach(values, function(v, i) {
               var max = hourlyMax[v.dt];
               if(max && max.i == i) {
                   v.max = true;
               }
            });
             
            var hourlySum = {};
            _.forEach(values, function(d) {
               var y = hourlySum[d.dt];
               if(!y) y = 0;
               y += d.y;
               hourlySum[d.dt] = y;
            });
            
            var hourlyValues = _.map(_.keys(hourlySum).sort(), function(k, i) {
                var v = hourlySum[k];
                if(v > yMax) yMax = v;
                return { x: moment(k).toDate(), dt: k,  y: v }; 
            });
            // build
            var rain10Series = [{
                    data: hourlyValues, 
                    name:'한시간 강수',
                    type: 'column',
                    showInLegend: false,
                    animation: false,
                    marker : { enabled: false},
                    yAxis: 0,
                    xAxis: 0,
                    groupPadding: 0,
                    pointPadding: 0,
                    tooltip: { enabled: true }
                },
                {
                    data: values, 
                    name:'10분 강수',
                    type: 'areaspline',
                    showInLegend: false,
                    animation: false,
                    marker : { enabled: true, radius:2 },
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get('rgba')]
                        ]
                    },
                    yAxis: 0,
                    xAxis: 1,
                }
            ];
            var yTicks = new Array();
            if (yMax <= 4) {
                yTicks = [0, 2.5, 5];
            } else if (yMax <= 8) {
                yTicks = [0, 5, 10];
            } else if (yMax <= 16) {
                yTicks = [0, 10, 20];
            } else if (yMax <= 24) {
                yTicks = [0, 15, 30];
            } else if (yMax <= 40) {
                yTicks = [0, 25, 50];
            } else if (yMax <= 80) {
                yTicks = [0, 50, 100];
            } else if (yMax <= 160) {
                yTicks = [0, 100, 200];
            } else if (yMax <= 240) {
                yTicks = [0, 150, 300];
            } else {
                yTicks = [0, 250, 500];
            }
            var minPadding1 = 0; 
            var maxPadding1 = 0;
            var minPadding2 = 1.0 / (rain10Series[1].data.length * 2.0); 
            var maxPadding2 = minPadding2;
            console.log(rain10Series);
            var rain10Chart = creteRain10Chart(rain10Series, { 
                chart: { 
                    margin: [10, 0, 5, 43]
                },
                xAxis: [
                    { lineColor: '#39B1E8', lineWidth: 1, padding:10, tickColor: "rgba(0,0,0,0)", labels: { enabled: false }, title: { enabled: false }, minPadding: minPadding1, maxPadding: maxPadding1, margin: 0}, 
                    { lineColor: '#39B1E8', lineWidth: 1, padding:10, tickColor: "rgba(0,0,0,0)", labels: { enabled: false }, title: { enabled: false }, minPadding: minPadding2, maxPadding: maxPadding2, margin: 0},
                ],
                yAxis: [
                    { offset:0, max: yTicks[2], min:yTicks[0], tickPosition: yTicks, tickInterval: yTicks[1] - yTicks[0], tickWidth: 1, lineWidth: 1, labels:{ enabled: true }, title: { enabled: false }  }
                ]
            });
            
            function creteRain10Chart(series, options) {
                var id = 'my-rain10chart';
                var $rain10ChartWrap = $vf.find('.rain10-chart').first();
                $('<div>').attr('id', id).css({ width: '100%', height: '84px'}).appendTo($rain10ChartWrap.empty());
                
                var minPadding = 1.0 / (series[0].data.length * 2.0); 
                var maxPadding = minPadding;
                var minValue = 999;
                var maxValue = -999;
                for(var j = 0 ; j < series.length ; j++) {
                    var valList = series[j].data;
                    for(var i = 0 ; i < valList.length ; i++) {
                        var val = valList[i];
                        if(typeof val.y != 'undefined') {
                            if(val.y > maxValue) maxValue = val.y;
                            if(val.y < minValue) minValue = val.y;
                        } else {
                            if(val > maxValue) maxValue = val;
                            if(val < minValue) minValue = val;
                        }    
                    }
                }
                var lineColor = "#009AE0", fontColor = "#000000";
                var chartOptions = {
                    plotOptions: {
                        series: { 
                            pointStart: 1, 
                            fillColor:'#009AE1', 
                        },
                        column: {
                            color: 'rgba(0,0,0,0)',
                            enableMouseTracking: false
                        },
                        areaspline: {
                            color: lineColor,
                            dataLabels: {
                                enabled: true, 
                                style: { fontSize: '13px', fontWeight: 'normal', color: fontColor, textOutline: false },
                                formatter: function () {
                                   if(this.point.max) {
                                       return this.y > 0 ? this.y + '' : '';
                                   } else{
                                       return '';
                                   }
                                },
                                crop: false,
                                overflow: 'none',
                                y: 0
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: series,
                    chart: { backgroundColor: "rgba(0,0,0,0)", style: { fontFamily: "'ns', sans-serif" } },
                    title: { text: null },
                    credits: { enabled:false},
                };
                if(options) _.merge(chartOptions, options);
                var chart = Highcharts.chart(id, chartOptions);
                return chart;
            }
        }
        var tm = moment().utc().add(-20, 'minute').format("YYYYMMDDHHmm");
        var data = {
            tm: tm,
            lat: "",
            lon: "",
            x: bookmark.dong.x,
            y: bookmark.dong.y,
            disp: "V",
            type: "BLND"
        };
        var url = "https://vapi.kma.go.kr/capi/url/vs_prcp_blnd_pt_txt1.php";
        showLoading('vshort-forecast', true, 'light under-pos');
        $.ajax({
            url: url,
            data: data,
            dataType: "json"
        }).then(function(result) {
            showLoading('vshort-forecast', false);
            if(result.resultCode == "0") {
                buildChart(result.data.resultList);
            } else {
                alert("초단기 10분강수 조회 중 오류가 발생하였습니다.");
            }
        }, function(err) {
            console.log(err);
            showLoading('vshort-forecast', false);
            alert("초단기 10분강수 조회 중 오류가 발생하였습니다.");
        });
    }
	/*
		GIS 연동 인터페이스 생성 
	*/
	function createMapInterface() {
		try{
			vmap = new kmap({
				target: "map",
				scaleLine: true,
				fullScreen: false,
				zoom: 13,
				center: [bookmarkSelectedLon, bookmarkSelectedLat],
				myLocation: [bookmarkSelectedLon, bookmarkSelectedLat],
				mapLayers: [
					{title: "거리지도", layer: "New_baroemap", visible: true},
					{title: "백지도", layer: "WhiteMap", visible: false}
				],
				workspace: "kma_2021"
			});
		}catch(e) {
			console.log(e);
		}
		// 지상
		var awsUrl = ["https://www.weather.go.kr/wgis-nuri/aws/sfc?date=", "https://www.weather.go.kr/wgis-nuri/aws/aws?date="];
		var result = null;
		var count = 0;
		var visible = true;
		awsUrl.forEach(function(url) {
			fetch(url).then(res => {
				return res.json();
			}).then(function (data) {
				if(result != null) {
					result = result.concat(data);
				} else {
					result = data;
				}
				count++;
				if(count === awsUrl.length) {
					//if (self.isVisible(type)) {
						vmap.setObs(result, {
							type: 'sfc', 
							visible: visible,  
							callback: function(info) {
								console.log("click ==> ", info);
							}
						});
					//}
				}
			});
		});

		// 공항
		$.ajax({ url: 'https://www.weather.go.kr/wgis-nuri/aws/air?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
			vmap.setObs(data, {
				type: 'air', 
				callback: function(info) {
					console.log("click ==> ", info);
				}
			});
		});
		// 등표 
		$.ajax({ url: 'https://www.weather.go.kr/wgis-nuri/aws/lhaws?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
			vmap.setObs(data, {
				type: 'lhaws', 
				callback: function(info) {
					console.log("click ==> ", info);
				}
			});
		});
		// 부이 
		$.ajax({ url: 'https://www.weather.go.kr/wgis-nuri/aws/buoy?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
			vmap.setObs(data, {
				type: 'buoy', 
				callback: function(info) {
					console.log("click ==> ", info);
				}
			});
		});
		// 파고부이 
		$.ajax({ url: 'https://www.weather.go.kr/wgis-nuri/aws/seaBuoy?date=', dataType: 'json', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(function(data) {
			vmap.setObs(data, {
				type: 'seaBuoy', 
				callback: function(info) {
					console.log("click ==> ", info);
				}
			});
		});
	}
	function updateMapCenter(bookmark) {
		if(vmap && bookmark && bookmark.dong) {
			vmap.setCenter([bookmark.dong.lon, bookmark.dong.lat]);
			vmap.removeLocation();
			vmap.addLocation([bookmark.dong.lon, bookmark.dong.lat]);
		}
	}
	function createDfsSlider() {
        var isHr1Fct = $('.cmp-dfs-slider').first().hasClass('hr1-fct');
		var isMovingToTab = false;
		var obj = '.dfs-tab-body .dfs-slider';
		var $slider = $(obj);
		var $slideWrap = $slider.find('.slide-wrap');
		var scrollWidth = 0;
		var slidePoints = null;
		var tchartWidth = 0;
		var midtchartWidth = 0;
		var midtchartLeft = 0;
		var tchartItemCount = 0;
		var isModeChart = false;
		var isModeTable = false;
		var $slides = $slider.find('.slide');
        var $dailyHeads = $slider.find('.slide:not(.day-ten) .daily-head');
		var slideLength = $slides.length;
		var lastTabIndex = 0;
		var sliderWidth = $slider.width();
		prepareSlider();
		
		dfsSlider = new IScroll('.dfs-tab-body .dfs-slider', { eventPassthrough:true, scrollX: true, scrollY: false, mouseWheel: false, scrollbars: 'custom', resizePolling : 40, probeType : 3, interactiveScrollbars: true});
		
		updateChart();
		
		dfsSlider.on('scroll', function(){
			if(isMovingToTab) return;
			var scrollX = -this.x;
			var selectedTabIndex = 0;
			for(var i = 0 ; i < slidePoints.length ; i++) {
				var p1 = slidePoints[i] - (i > 0 ? (isHr1Fct ? 55 : 30) : 0);
				var p2 = (i+1 >= slidePoints.length) ? 99999999 : (slidePoints[i+1] - (isHr1Fct ? 55 : 30));
				if(p1 <= scrollX && scrollX < p2) {
					selectedTabIndex = i;
					break;
				}
			}
			if(isHr1Fct) {
				if(selectedTabIndex < $dailyHeads.length && scrollX >= 0) {
					var selectedSlideLeft = slidePoints[selectedTabIndex];
					var slideWidth = slidePoints[selectedTabIndex+1] - selectedSlideLeft;
					var marginLeft = scrollX - selectedSlideLeft;
					if(marginLeft < slideWidth - $dailyHeads.eq(selectedTabIndex).width() - 70) {
						$dailyHeads.eq(selectedTabIndex).css({ 'margin-left': (selectedTabIndex == 0 ? marginLeft : marginLeft+55)+ 'px'});
					}
				} else if(scrollX < 0) {
					$dailyHeads.eq(0).css({ 'margin-left': 'auto'});
				}
			}
			if(lastTabIndex != selectedTabIndex) {
				if(isHr1Fct) {
					if(lastTabIndex < $dailyHeads.length) {
						if(lastTabIndex == 0 || isModeTable) {
                    		$dailyHeads.eq(lastTabIndex).css({ 'margin-left': 'auto'});                    		
                    	} else {
                    		$dailyHeads.eq(lastTabIndex).css({ 'margin-left': '23px'});
                    	}
					}
				}
				lastTabIndex = selectedTabIndex;
				if(sliderWidth + scrollX < scrollWidth) {
                	selectTab(lastTabIndex);
                }
				if(slidePoints.length - 1 == selectedTabIndex) {
					if(!$('.cmp-dfs-slider .item-lbl').hasClass('off')) {
						$('.cmp-dfs-slider .item-lbl').addClass('off');
					}
					if(!$('.cmp-dfs-slider .item-lbl-graph').hasClass('off')) {
						$('.cmp-dfs-slider .item-lbl-graph').addClass('off');
					}
					if(!$('.cmp-dfs-slider .item-lbl-midterm').hasClass('on')) {
						$('.cmp-dfs-slider .item-lbl-midterm').addClass('on');
					}
				} else {
					$('.cmp-dfs-slider .item-lbl').removeClass('off');
					$('.cmp-dfs-slider .item-lbl-graph').removeClass('off'); 
					$('.cmp-dfs-slider .item-lbl-midterm').removeClass('on');
				}
			}
		});
		/* 
			보기 옵션 열기 
		*/
		$('.cmp-dfs-slider a[data-layer]').click(function(e) {
			e.preventDefault();
			var dataLayer = $(this).attr('data-layer');
			var $panel = $('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']');
			if(!$panel.hasClass('on')) $panel.addClass('on')
			$panel.find('.big-close').unbind('click').bind('click', function(e) {
				e.preventDefault();
				$panel.removeClass('on');
			});
		});
		/*
			예보 보기 옵션 레이어 이벤트.
		*/
		$('.cmp-dfs-slider').on('click', '.view-options a.sym-btn[data-option]', function(e) {
            e.preventDefault();
			var dataLayer = 'view-options';
			$(this).parent().parent().find('a.sym-btn').removeClass('on');
			$(this).addClass('on');
			var optionType = $(this).attr('data-option');
			var optionValue = $(this).attr('data-value');
			if(optionType == 'series') {
				$('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(optionValue);
				window.setTimeout(function() {
					prepareSlider();
					dfsSlider.refresh();
					updateChart();
					$('.dfs-tab-head > li > a').first().trigger('click');
					}, 0);
				$('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
				$('.cmp-dfs-slider a.sym-btn[data-view="' + optionValue + '"]').addClass('on');
			}
			$('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']').removeClass('on');
		});
		$('.cmp-dfs-slider').on('click', 'a.sym-btn[data-view]', function(e) {
            e.preventDefault();
			$(this).parent().find('a.sym-btn[data-view]').removeClass('on');
			$(this).addClass('on');
			
			var mode = $(this).attr('data-view');
			$('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(mode);
			window.setTimeout(function() {
				prepareSlider();
				dfsSlider.refresh();
				updateChart();
				$('.dfs-tab-head > li > a').first().trigger('click');
				}, 0);
			$('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"]').removeClass('on');
			$('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"][data-value="' + mode + '"]').addClass('on');
		});
		/*
			오늘 내일 모레 10일 이후 탭과 스크롤 연동.
		*/
		$('.cmp-dfs-slider .dfs-tab .dfs-tab-head').on('click', 'a', function(e) {
			e.preventDefault();
			$(this).parents('.dfs-tab-head').find('a.on').removeClass('on');
			$(this).addClass('on');
			var date = $(this).attr('data-date');
			var $slider = $('.cmp-dfs-slider .dfs-slider').first();
			var scrollLeft = 0;
			var isExperimentalTab = $(this).parent().attr('data-experimental') == 'Y';
            $slider.find('.daily').each(function(idx, ele) {
            	if(isExperimentalTab) {
            		if(date == $(ele).attr('data-date') && $(this).attr('data-experimental') == 'Y') return false;
            	} else {
            		if(date == $(ele).attr('data-date') && $(this).attr('data-experimental') != 'Y') return false;
            	}
                
                scrollLeft +=  Math.ceil($(ele).width());
            });
			var isMidTerm = $(this).parent().index() == $(this).parent().parent().find('li').last().index(); 
			if(isMidTerm && !isModeTable) scrollLeft += 25; //78;
            if(isHr1Fct) scrollLeft -= 47;
			isMovingToTab = true;
			if(dfsSlider) dfsSlider.scrollTo( -scrollLeft, 0, 500, IScroll.utils.ease.quadratic);
			window.setTimeout(function() { isMovingToTab = false;}, 500);
			
			if(isMidTerm) {
				if(!$('.cmp-dfs-slider .item-lbl').hasClass('off')) {
					$('.cmp-dfs-slider .item-lbl').addClass('off');
				}
				if(!$('.cmp-dfs-slider .item-lbl-graph').hasClass('off')) {
					$('.cmp-dfs-slider .item-lbl-graph').addClass('off');
				}
				if(!$('.cmp-dfs-slider .item-lbl-midterm').hasClass('on')) {
					$('.cmp-dfs-slider .item-lbl-midterm').addClass('on');
				}
			} else {
				$('.cmp-dfs-slider .item-lbl').removeClass('off');
				$('.cmp-dfs-slider .item-lbl-graph').removeClass('off');
				$('.cmp-dfs-slider .item-lbl-midterm').removeClass('on'); 
			}
		});
		$('.cmp-dfs-updated a').on('click', function(e) {
			e.preventDefault();
			if($(this).hasClass('open-box')) {
				$(this).toggleClass('on');
			} else if($(this).hasClass('close-box')) {
				$('.cmp-dfs-updated a.open-box').toggleClass('on');
			}
		});
		// 윈도우 사이즈 변경에 따라 슬라이더 갱신.
		var isMobileSize = $(window).width() <= 1100;
		$(window).resize(function(e) {
			var width = $(window).width();
			if(isMobileSize) {
				if(width > 1100) {
					window.setTimeout(function() {
						prepareSlider();
						if(dfsSlider) dfsSlider.refresh();
					},0);
					isMobileSize = false;
				}
			} else {
				if(width <= 1100) {
					window.setTimeout(function() {
						prepareSlider();
						if(dfsSlider) dfsSlider.refresh();
					},0);
					isMobileSize = true;
				}
			}
		});
		
		/*
			슬라이더 준비.
		*/
		function prepareSlider() {
			isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
			isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
			scrollWidth = 0;
			slidePoints = [];
			tchartItemCount = 0;
			
			if(!isModeTable) {
				$slides.each(function(idx, ele) {
					var slideWidth = 0;
					$(ele).find('.item').each(function(idx2, ele2) {
						var w = Math.ceil($(ele2).width());
						slideWidth += w;
						if(idx < slideLength-1) tchartItemCount++;
					});
					$(ele).css('width', slideWidth + 'px');
					slidePoints.push(scrollWidth);
					scrollWidth += slideWidth;
				});
				
				scrollWidth += 78;
				$slideWrap.css('width', scrollWidth + 'px');
			} else {
				$slides.each(function(idx, ele) {
					var slideWidth = Math.ceil($(ele).width());
					slidePoints.push(scrollWidth);
					scrollWidth += slideWidth;
				});
				$slideWrap.css('width', scrollWidth + 'px');
			}
			sliderWidth = $slider.width();
			//console.log("isModeTable", isModeTable, "slidePoints", slidePoints, "scrollWidth", scrollWidth);
		}
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
		}
		function selectTab(tabIndex) {
			$('.cmp-dfs-slider > .dfs-tab > .dfs-tab-head-wrap > .dfs-tab-head > li > a.on').removeClass('on').trigger('blur');
			var $a = $('.cmp-dfs-slider .dfs-tab .dfs-tab-head li').eq(tabIndex).find('a').addClass('on');
			//window.setTimeout(function(){$a.trigger('focus');}, 0);
		}
		function updateChart() {
			/* 기온 차트 */
			tchartWidth = slidePoints[slidePoints.length - 1];
			
			var $tchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .tchart').css({ width: tchartWidth + 'px'});
			var tchartId = "my-tchart";
			var $tchart = $('<div>').attr('id', tchartId).css({ width: '100%', height: '100%'}).appendTo($tchartWrap);
			var tempList = JSON.parse($tchartWrap.attr('data-data'));
			var tchart = createTChart(tchartId, tempList[0]);
			/* 중기 최저/최고 기온 차트 */
			midtchartWidth = scrollWidth - ((isModeTable) ? 0 : 100) - slidePoints[slidePoints.length - 1];
            midtchartLeft = tchartWidth + ((isModeTable) ? 0 : (isHr1Fct ? 63 : 90) );
			var $midtchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .midtchart').css({ left: midtchartLeft + 'px',width: midtchartWidth + 'px'});
			var midtchartId = "my-midtchart";
			var $midtchart = $('<div>').attr('id', midtchartId).css({ width: '100%', height: '100%'}).appendTo($midtchartWrap);
			var midchartSeries = JSON.parse($midtchartWrap.attr('data-data'));
			var tmnList = midchartSeries[0], tmxList = midchartSeries[1];
			var midtchart = createChart2(midtchartId, tmnList, tmxList);
			/* 차트 모드 */
			if(isModeChart) {
				var chartWidth = tchartWidth;
				/* 강수확률 */
				var $ptychartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .ptychart').css({ width: chartWidth + 'px'});
				$('<div>').attr('id', 'my-ptychart').css({ width: '100%', height: '100%'}).appendTo($ptychartWrap);
				var ptychartSeries = JSON.parse($ptychartWrap.attr('data-data'));
				var ptyList = ptychartSeries[0];
				
				var ptyChart = createChart('my-ptychart', [{data: ptyList, name:'', dataLabel: {overflow:'allow', formatter: function () { return this.y >= 0 ? (this.y + '%') : '';}}}], { 
					chart: { 
						type: 'column',
						paddingTop: 20, 
						paddingBottom: 20, 
					}, 
					plotOptions: {
						series: {
							showInLegend:false,
							animation: false,
						}
					}, 
					xAxis: { lineColor: '#39B1E8', lineWidth: 2, minPadding: 0, maxPadding: 0,},
					yAxis: { max: 130, min: 0 }
				});
				
				/* 강수량 */
				var $rainchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .rainchart').css({ width: chartWidth + 'px'});
				$('<div>').attr('id', 'my-rainchart').css({ width: '100%', height: '100%'}).appendTo($rainchartWrap);
				var rainchartSeries = JSON.parse($rainchartWrap.attr('data-data'));
				var rainList = rainchartSeries[0];
				var maxRain = 0;
				for(var i = 0 ; i < rainList.length ; i++) {
					if(maxRain < rainList[i]) {
						maxRain = rainList[i];
					}
				}
				if(maxRain < 20) maxRain = 20;
				maxRain *= 1.3;
				var rainChartSeries = [{
						data: rainList, 
						name:'강수', 
						dataLabels: {
							overflow: 'allow',
							useHTML: true,
							formatter: function () {
								var label = '<span class="chart-label">';
								var f = this.y;
                                if(!isHr1Fct) {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 5.0) label += "1~4";
                                    else if(f >= 5.0 && f < 10.0) label += "5~9";
                                    else if(f >= 10.0 && f < 20.0) label += "10~19";
                                    else if(f >= 20.0 && f < 40.0) label += "20~39";
                                    else if(f >= 40.0 && f < 70.0) label += "40~69";
                                    else label += "70~";  
                                } else {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 30.0) label += Math.round(f) + "";
                                    else if(f >= 30.0 && f < 50.0) label += "30~50";
                                    else label += "50~";  
                                }
								label += '</span>';
								return label; 
							}
						}
					}];
				var rainChart = createChart('my-rainchart', rainChartSeries, { 
					chart: { 
						type: 'column',
						paddingTop: 20, 
						paddingBottom: 20, 
					}, 
					plotOptions: {
						series: {
							showInLegend:false,
							animation: false,
						}
					},
					xAxis: { lineColor: '#39B1E8', lineWidth: 2, minPadding: 0, maxPadding: 0 },
					yAxis: { max: maxRain, min: 0, tickInterval:0.1 }
				});
				
				/* 적설량 */
				var $snowchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .snowchart').css({ width: chartWidth + 'px'});
				$('<div>').attr('id', 'my-snowchart').css({ width: '100%', height: '100%'}).appendTo($snowchartWrap);
				var snowchartSeries = JSON.parse($snowchartWrap.attr('data-data'));
				var snowList = snowchartSeries[0];
				var maxSnow = 0;
				for(var i = 0 ; i < snowList.length ; i++) {
					if(maxSnow < snowList[i]) {
						maxSnow = snowList[i];
					}
				}
				if(maxSnow < 10) maxSnow = 10;
				maxSnow *= 1.3;
				var snowChartSeries = [{
						data: snowList, 
						name:'적설', 
						dataLabels: {
							overflow: 'allow',
							useHTML: true,
							formatter: function () {
								var label = '<span class="chart-label">';
								var f = this.y;
                                if(!isHr1Fct) {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 5.0) label += "1~4";
                                    else if(f >= 5.0 && f < 10.0) label += "5~9";
                                    else if(f >= 10.0 && f < 20.0) label += "10~19";
                                    else label += "20~";
                                } else {
                                    if(f < 0.1) label += "-";
                                    else if(f >= 0.1 && f < 1.0) label += "~1";
                                    else if(f >= 1.0 && f < 5.0) label += f.toFixed(1) + "";
                                    else label += "5~";  
                                }
								label += '</span>';
								return label; 
							}
						}
					}];
				var snowChart = createChart('my-snowchart', snowChartSeries, { 
					chart: { 
						type: 'column',
						paddingTop: 20, 
						paddingBottom: 20, 
					}, 
					plotOptions: {
						series: {
							showInLegend:false,
							animation: false,
						}
					},
					xAxis: { lineColor: '#39B1E8', lineWidth: 2, minPadding: 0, maxPadding: 0 },
					yAxis: { max: maxSnow, min: 0, tickInterval:0.1 }
				});
				
				/* 풍향 풍속 */
				var $windchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .windchart').css({ width: chartWidth + 'px'});
				$('<div>').attr('id', 'my-windchart').css({ width: '100%', height: '100%'}).appendTo($windchartWrap);
				var windchartSeries = JSON.parse($windchartWrap.attr('data-data'));
				var windList = [];
				var wsList = windchartSeries[0];
				var wdList = windchartSeries[1];
				var maxWs = 0;
				var minWs = 99999999;
				for(var i = 0 ; i < wsList.length; i++) {
					if(maxWs < wsList[i]) {
						maxWs = wsList[i];
					}
					if(minWs > wsList[i]) {
						minWs = wsList[i];
					}
					windList.push({x:i, y: wsList[i], arrow: wdList[i] + '_b'});
				}
				minWs -= (maxWs - minWs) * 0.4; 
				maxWs += (maxWs - minWs) * 0.4;
				var windChart = createChart('my-windchart', [
							{data: windList, name:'1',
								dataLabels: {
									formatter: function() {
										return '<span class="wdic ' + this.point.arrow + ' sm" />';
						            },
						            overflow: 'allow',
						            enabled: true,
						            useHTML: true,
						            inside: true
								}
							},
							{data: windList, name:'dummy',
								dataLabels: {
									formatter: function () { return this.y; },
								    overflow: 'allow',
						            enabled: true,
						            y: 24
								},	
							}
						], { 
						chart: { 
							type: 'spline',
							paddingTop: 20, 
							paddingBottom: 20, 
						},
						plotOptions: {
							series: {
								showInLegend:false,
								animation: false,
							}
						},
						xAxis: { lineColor: '#39B1E8', lineWidth: 2 },
						yAxis: { min: minWs, max: maxWs, tickInterval:0.01}
					});
				/* 습도 */
				var $hmchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .hmchart').css({ width: chartWidth + 'px'});
				$('<div>').attr('id', 'my-hmchart').css({ width: '100%', height: '100%'}).appendTo($hmchartWrap);
				var hmchartSeries = JSON.parse($hmchartWrap.attr('data-data'));
				var hmList = hmchartSeries[0];
				var hmChart = createChart('my-hmchart', [{data: hmList, name:'', dataLabels: { overflow:'allow'}}], { 
						chart: { 
							type: 'areaspline',
							paddingTop: 20, 
							paddingBottom: 20, 
							marginBottom: 2,
						}, 
						plotOptions: {
							series: {
								showInLegend:false,
								animation: false,
								marker : { enabled: true },
								fillColor: {
									linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
									stops: [
										[0, Highcharts.getOptions().colors[0]],
										[1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
									]
								},
							}
						},
						xAxis: { lineColor: '#39B1E8', lineWidth: 1},
						yAxis: { max: 130, min:0 }
					});
			}
		}
		/**
			차트
			series : array of array or..
			options : chart options
		*/
		function createChart(id, series, options) {
			if(!series || series.length < 1) return;
			
			var minPadding = 1.0 / (series[0].data.length * 2.0); 
			var maxPadding = minPadding;
			var minValue = 999;
			var maxValue = -999;
			for(var j = 0 ; j < series.length ; j++) {
				var valList = series[j].data;
				for(var i = 0 ; i < valList.length ; i++) {
					var val = valList[i];
					if(typeof val.y != 'undefined') {
						if(val.y > maxValue) maxValue = val.y;
						if(val.y < minValue) minValue = val.y;
					} else {
						if(val > maxValue) maxValue = val;
						if(val < minValue) minValue = val;
					}	
				}
			}
			var lineColor = "#009AE0", fontColor = "#000000";
			var chartOptions = {
				plotOptions: {
					series: { 
						pointStart: 1, 
						fillColor:'#009AE1' 
					},
					line: { 
					    color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y + '℃'; }
						},	
						enableMouseTracking: false,
					},
					spline: { 
					    color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y + '℃'; }
						},	
						enableMouseTracking: false,
					},
					area: { 
					    color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y + '%'; },
							verticalAlign: 'bottom',
						},	
						enableMouseTracking: false,
						marker: { enabled: false }
					},
					bar: {
						color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y + '%'; },
							verticalAlign: 'bottom',
						},	
						enableMouseTracking: false
					},
					column: {
						color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y >= 0 ? this.y + '%' : ''; },
							inside: false,
						},	
						enableMouseTracking: false
					},
					areaspline: {
						color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y >= 0 ? this.y + '%' : ''; },
							inside: false,
						},	
						enableMouseTracking: false
					}
				},
				series: series,
				yAxis: {
				    min: minValue-1, max: maxValue+1,
				    tickInterval: 0.1,
				    gridLineColor: "rgba(0,0,0,0)",
				    labels:{ enabled: false },
			    	title: { enabled: false },
				},
				xAxis: {
					lineColor: "rgba(0,0,0,0)",
					tickColor: "rgba(0,0,0,0)",
				    labels: { enabled: false },
			    	title: { enabled: false },
			    	minPadding: minPadding,
	    			maxPadding: maxPadding,
	    			margin: 0, padding: 0,
				},
				chart: { backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
				title: { text: null },
				credits: { enabled:false},
			};
			if(options) _.merge(chartOptions, options);
			//console.log(chartOptions, options);
			var chart = Highcharts.chart(id, chartOptions);	
			return chart;		
		}
		
		function createTChart(id, tempList) {
			var minPadding = 1.0 / (tempList.length * 2.0); 
			var maxPadding = minPadding;
			var minValue = 999;
			var maxValue = -999;
			for(var i = 0 ; i < tempList.length ; i++) {
				var tempValue = tempList[i];
				if(tempValue > maxValue) maxValue = tempValue;
				if(tempValue < minValue) minValue = tempValue;
			}
			var lineColor = "#009AE0", fontColor = "#000000"; 
			var chart = Highcharts.chart(id, {
				plotOptions: {
					series: {
						pointStart: 1
					},
					spline: { 
						color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y + '℃'; }
						},	
						enableMouseTracking: false
					}
				},
				series: [{ name: '', data: tempList, showInLegend: false, animation:false }],
				yAxis: {
				    min: minValue-1, max: maxValue+1,
				    tickInterval: 0.1,
				    gridLineColor: "rgba(0,0,0,0)",
				    labels:{ enabled: false },
			    	title: { enabled: false },
				},
				xAxis: {
					lineColor: "rgba(0,0,0,0)",
					tickColor: "rgba(0,0,0,0)",
				    labels: { enabled: false },
			    	title: { enabled: false },
			    	minPadding: minPadding,
	    			maxPadding: maxPadding,
	    			margin: 0, padding: 0,
				},
				chart: { type:'spline', backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
				title: { text: null },
				credits: { enabled:false },
			});	
			return chart;		
		}
		function createChart2(id, tmnList, tmxList) {
			var minPadding = 1.0 / (tmnList.length * 2.0); 
			var maxPadding = minPadding;
			var minValue = 999;
			var maxValue = -999;
			for(var i = 0 ; i < tmnList.length ; i++) {
				var tempValue = tmnList[i];
				if(tempValue > maxValue) maxValue = tempValue;
				if(tempValue < minValue) minValue = tempValue;
			}
			for(var i = 0 ; i < tmxList.length ; i++) {
				var tempValue = tmxList[i];
				if(tempValue > maxValue) maxValue = tempValue;
				if(tempValue < minValue) minValue = tempValue;
			}
			var delta = maxValue - minValue;
			if(delta != 0) {
				maxValue = maxValue + (delta * 0.7);
				minValue = minValue - (delta * 0.7);
			} else {
				maxValue = maxValue + (maxValue * 0.7);
				minValue = minValue - (minValue * 0.7);
			}
			var lineColor = "#009AE0", fontColor = "#000000"; 
			var chart = Highcharts.chart(id, {
				plotOptions: {
					series: {
						pointStart: 1
					},
					spline: { 
						color: lineColor,
						dataLabels: {
							enabled: true, 
							style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
							formatter: function () { return this.y + '℃'; }
						},	
						enableMouseTracking: false
					}
				},
				series: [
						{ name: '', data: tmnList, marker: { symbol:'circle' }, showInLegend: false, animation:false, dataLabels: { overflow: 'allow', y: 25 } },
						{ name: '', data: tmxList, marker: { symbol:'circle' }, showInLegend: false, animation:false,}
				],
				yAxis: {
					min: minValue, max: maxValue,
					tickInterval: 0.1,
					gridLineColor: "rgba(0,0,0,0)",
					labels:{ enabled: false },
					title: { enabled: false },
				},
				xAxis: {
					lineColor: "rgba(0,0,0,0)",
					tickColor: "rgba(0,0,0,0)",
					labels: { enabled: false },
					title: { enabled: false },
					minPadding: minPadding,
					maxPadding: maxPadding,
					margin: 0, padding: 0,
				},
				chart: { type:'spline', backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
				title: { text: null },
				credits: { enabled:false },
			});	
			return chart;		
		}
	}
	function createGlobalEvent() {
		GlobalEvent.on('onAppConfigUpdated', function(e) {
			window.location.reload();
		});
		GlobalEvent.on('onAreaBookmarkDeleted', function(e, bookmarkIndex, bookmark, sender) {
			if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
		});
		GlobalEvent.on('onAreaBookmarkAdded', function(e, bookmarkIndex, bookmark, sender) {
			if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
		});
		GlobalEvent.on('onAddAreaBookmark', function(e, bookmark) {
			bookmarkDropdown.refresh(bookmark);
			updateCurrentWeather(bookmark);
			updateDigitalForecast(bookmark);
		});
		GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
			bookmarkDropdown.refresh(bookmark);
			updateCurrentWeather(bookmark);
			updateDigitalForecast(bookmark);
		});
		
		GlobalEvent.on('onSaveAreaBookmark', function(e) {
			bookmarkDropdown.refresh();
			if(myPointSlider) myPointSlider.onAreaBookmarkUpdated();
		});
		
		GlobalEvent.on('onAreaBookmarkSelected', function(e, bookmarkIndex, bookmark, sender) {
			//console.log('onAreaBookmarkSelected', bookmark, sender);
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
			updateCurrentWeather(bookmark);
			updateDigitalForecast(bookmark);
			if(bookmark.dong.lat && bookmark.dong.lon){
				updateMapCenter(bookmark);
			}
		});
		
		GlobalEvent.on('onAreaShow', function(e, bookmark, sender) {
			//console.log('onAreaShow', bookmark, sender);
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
			updateCurrentWeather(bookmark);
			updateDigitalForecast(bookmark);
			if(bookmark.dong.lat && bookmark.dong.lon){
				updateMapCenter(bookmark);
			}
		});
		
		$(document).click(function(e){
			var canCloseLocalSearchItems = $(e.target).parents('.cmp-local-search').length == 0
				&& $(e.target).parents('.cmp-local-search-items').length == 0
				&& $(e.target).attr('data-role') != 'log-delete'; 
			if(canCloseLocalSearchItems) {
				$('.cmp-local-search-items').removeClass('on').removeClass('opened');
			}
			
			var canCloseTodayWarning = $(e.target).parents('.cmp-main-wrn.accordion-wrap').length == 0;
			if(canCloseTodayWarning) {
				$('.cmp-main-wrn .box-con-on.accordion-tit.on').trigger('click');
			}
		});
	}	
	
	function readBookmarkSelectedInfo() {
		var lat = 37.493546;
		var lon = 126.921654;
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
					bookmarkSelectedDongCode = bm.dong.code;
					favoriteFound = true;
				} else {
					if(bm.dong) {
						var latlon = convertDfsGrid("toLL", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
						if(latlon['lat'] && latlon['lng']) {
							lat = latlon['lat'];
							lon = latlon['lng'];
							bookmarkSelectedDong = bm.fullName;
							favoriteFound = true;
						}
						bookmarkSelectedDongCode = bm.dong.code;
					}
				}
				
			} else {
				var bm = bookmarkDropdown.config.bookmarks[0];
				if(bm.dong && bm.dong.lat && bm.dong.lon && bm.dong.lat != "null" && bm.dong.lon != "null") {
					lat = bm.dong.lat;
					lon = bm.dong.lon;
					bookmarkSelectedDong = bm.fullName;
					bookmarkSelectedDongCode = bm.dong.code;
					favoriteFound = true;
				} else {
					if(bm.dong) {
						var latlon = convertDfsGrid("toLL", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
						if(latlon['lat'] && latlon['lng']) {
							lat = latlon['lat'];
							lon = latlon['lng'];
							bookmarkSelectedDong = bm.fullName;
							bookmarkSelectedDongCode = bm.dong.code;
							favoriteFound = true;
						}
					}
				}
			}
		}
		bookmarkSelectedLat = lat;
		bookmarkSelectedLon = lon;
		return favoriteFound;
	}
	function requestCurrentImages() {
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "renew2021/rest/main/current-images.do",
			data: {},
			dataType: "json"
		});
	}
	function requestWeatherCmt() {
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/weather/weather-cmt-main.do",
			data: {},
			dataType: "html"
		});
	}
	function requestLocalWeather(type, ele, wsUnit) {
		return $.ajax({
			url: renewPrefix+ "weather/local/" + type + "-frame.do",
			data: {ele: ele, wsUnit: wsUnit},
			dataType: "html"
		});
	}
	function requestCurrentWeather(code, wsUnit) {
		//console.log('requestCurrentWeather',code);
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/mobile-app/current-weather.do",
			data: {code: code, unit: wsUnit},
			dataType: "html"
		});
	}
	function requestDigitalForecast(code, wsUnit) {
		//console.log('requestDigitalForecast',code);
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/mobile-app/digital-forecast.do",
			data: {code: code, unit: wsUnit, hr1: 'Y'},
			dataType: "html"
		});
	}
	
	function requestNearAirStation(lat, lon) {
		return $.ajax({
			url: (window.appBase?window.appBase:"/") + "rest/zone/find/air-station.do",
			data: {lat: lat, lon: lon},
			dataType: "json"
		});
	}
	
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
	
	// request app version 
	function getAppVersion() {
		try { window.parent.postMessage({ action : "getVersion" }, '*'); } catch(e) { if(console) console.log(e);}
	}
	function getAppLocation() {
		showLoading('current-weather', true);
		try { window.parent.postMessage({ action : "getLocation" }, '*'); } catch(e) { if(console) console.log(e);}
	}
	function getAppBookmarks() {
		try { window.parent.postMessage({ action : "bookmark-read" }, '*'); } catch(e) { if(console) console.log(e);}
	}
	/**
		code: "toXY"
			lat, lng to x, y
		code: "toLL" 
			x, y to lat, lng 
		return { lat, lng, x, y }
	*/
	function convertDfsGrid(code,v1,v2) {
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
})(jQuery, window, document);
