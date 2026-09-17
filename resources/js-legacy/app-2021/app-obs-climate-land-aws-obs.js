/**
 * 관측기후 - 육상 - 지역별 상세관측자료 (url: /obs-climate/land/aws-obs.do)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	
	var STORE_KEY = "_awsobs_state";
	var SEARCH_DELAY = 500;
	var state = {
			inqueryHistory: [],
			toggleButtons: {
				map: {
					open: true
				},
				guide: {
					open: true
				}
			}
	};

	var REG_BOUNDS = {
			// 경도, 위도, 줌레벨
			// 서울 경기 인천
			"1100000000": [ 126.96813, 37.56408, 11.20396],
			"4100000000": [ 126.9769, 37.5738, 9],
			"2800000000": [ 126.9769, 37.5738, 9],
			// 부산 울산 대구 경상남북도
			"2600000000": [ 129.02917, 35.20491, 10.87063],
			"3100000000": [ 129.21630, 35.53096, 10.70441],
			"2700000000": [ 128.59907, 35.95706, 9.87063],
			"4800000000": [ 128.46015, 35.29797, 9.13267],
			"4700000000": [ 128.64967, 36.21956, 9.13267],
			// 광주, 전라남북도
			"2900000000": [ 126.80958, 35.15527, 11.53730],
			"4600000000": [ 126.83647, 34.84047, 9.03797],
			"4500000000": [ 127.05300, 35.75825, 9.37131],
			// 대전 충청남북도 세종
			"3000000000": [ 127.35866, 36.34407, 10.87063],
			"4400000000": [ 127.25, 36.5999, 9],
			"4300000000": [ 127.25, 36.5999, 9],
			"3600000000": [ 127.23549, 36.56955, 10.70441],
			// 강원도
			"5100000000": [ 128.399, 37.6496, 9],
			// 제주도
			"5000000000": [ 126.5584, 33.3856, 10]
	};
	var vmap = null;
	var prefix = (window.appBase?window.appBase:"/");
	var $wrapper = $('#aws-panel-wrap');
	var $awsSido = $('#aws-sido');
	var $awsSidoStn = $('#aws-sido-stn');
	var $awsSidoCode =$('#aws-sido-code');
	var $awsSort =$('#aws-sort');
	var $awsDb = $('#aws-db');
	var $awsTm = $('#aws-tm');
	var $awsStnId = $('#aws-stn-id');
	var $awsConfig = $('#aws-config');
	var $awsKeyword = $('#aws-keyword');
	var $awsKeywordSearchResult = $('#aws-keyword-search-result');
	var $awsInqueryHistory = $('#aws-inquery-history');
	var $awsSelectDbBtn = $wrapper.find('a[data-role="select-db"]');
	var $awsSelectTmBtn = $wrapper.find('a[data-role="select-tm"]');
	var $awsSearchBtn = $wrapper.find('a[data-role="search-stn"]');
	var $awsTogglePanelBtn = $wrapper.find('a[data-role="toggle-panel"]');
	var $awsSelectSidoStnBtn = $wrapper.find('a[data-role="select-sido-stn"]');
	var $awsToggleMapBtn = $wrapper.find('a[data-role="toggle-map"]');
	var $awsToggleGuideBtn = $wrapper.find('a[data-role="toggle-guide"]');
	var $awsSidoGroupBtn = $wrapper.find('a[data-role="aws-sido-group"]');
	var $searchCurrentLocationBtn = $wrapper.find('a[data-role="search-current-location"]');
	var $awsWindUnitSelect = $wrapper.find('#aws-wind-unit-select');
	var $awsConfigSelect = $wrapper.find('#aws-config-select');
	var $awsConfigSelectWrap = $wrapper.find('#aws-config-select-wrap');
	var $awsDataHolder = $wrapper.find('#aws-data-holder');
	var $awsDataTm = $wrapper.find('#aws-data-tm');
	var $awsSelectDtm = $wrapper.find('a[data-role="select-dtm"]');
	var $awsDataName = $wrapper.find('#aws-data-name');
	var $awsWindUnit = null;
	var $awsWindSpeedValue = null;
	var searchTimer = null;
	var wsUnit = "m/s";
	
	var templates = {
		awsSearchResult: '{{#items}}<li><a href="#" data-role="aws-dropdown-item-select" data-index="{{index}}" data-aws-id="{{awsId}}" data-name-ko="{{nameKo}}" data-name-en="{{nameEn}}" data-lat="{{lat}}" data-lon="{{lon}}" data-addr="{{addr}}" data-dong-code="{{dongCode}}">{{nameKo}}({{awsId}},{{addr}})</a></li>{{/items}}',
		awsData: '{{#items}}<tr><td>{{awsStnId}}</td><td class="aws-table-col-default {{awsSpColorCode}}"><a href="#" data-aws-id="{{awsStnId}}" data-name-ko="{{awsStnName}}" data-role="aws-data-item-select" title="{{awsTroblKnd}}" class="{{#isSystemFault}}aws-system-fault{{/isSystemFault}}{{#isUserStop}}aws-user-stop{{/isUserStop}}{{#isFaultNa}}aws-fault-na{{/isFaultNa}}">{{awsStnName}}</a></td><td class="aws-table-col-default">{{awsAltitude}}</td><td class="aws-table-col-default {{#isPtyOn}}pty-on{{/isPtyOn}} {{#isPtyOff}}pty-off{{/isPtyOff}}">{{awsPty}}</td><td class="aws-table-col-default">{{awsPcpDay}}</td><td class="aws-table-col-default">{{awsTmp}}</td><td class="aws-table-col-default">{{awsChillTmp}}</td><td class="aws-table-col-default">{{awsWd10}}</td><td class="aws-table-col-default"><span data-role="aws-wind-speed-value">{{awsWs10}}</span></td><td class="aws-table-col-default">{{awsReh}}</td><td class="aws-table-col-auto"><span>{{awsAddr}}</span></td></tr>{{/items}}',
		awsDayData: `
			{{#items}}
			<tr>
				<td>{{awsStnId}}</td>
				<td class="aws-table-col-auto {{awsSpColorCode}}"><a href="#" data-aws-id="{{awsStnId}}" data-name-ko="{{awsStnName}}" data-role="aws-data-item-select" title="{{awsTroblKnd}}" class="{{#isSystemFault}}aws-system-fault{{/isSystemFault}}{{#isUserStop}}aws-user-stop{{/isUserStop}}{{#isFaultNa}}aws-fault-na{{/isFaultNa}}">{{awsStnName}}</a></td>
				<td class="aws-table-col-auto">{{awsAltitude}}</td>
				<td class="aws-table-col-auto"><span><span>{{awsWssMaxDirKo}}</span> / <span data-role="aws-wind-speed-value">{{awsWssMax}}</span></span><br><span>({{awsWssMaxTm}})</span></td>
				<td class="aws-table-col-auto">{{awsTaMin}}<br>({{awsTaMinTm}})</td>
				<td class="aws-table-col-auto">{{awsTaMax}}<br>({{awsTaMaxTm}})</td>
				<td class="aws-table-col-auto">{{awsPcpDay}}</td>
				<td class="aws-table-col-auto">{{awsRehMin}}<br>({{awsRehMinTm}})</td>
				<td class="aws-table-col-auto">{{awsRehMax}}<br>({{awsRehMaxTm}})</td>
				<td class="aws-table-col-auto">{{awsPsMin}}<br>({{awsPsMinTm}})</td>
				<td class="aws-table-col-auto">{{awsPsMax}}<br>({{awsPsMaxTm}})</td>			
				<td class="aws-table-col-auto" title="{{awsAddr}}"><span>{{awsAddr}}</span></td>
			</tr>
			{{/items}}`,
		awsTimeSeriesData: '{{#items}}<tr><td class="aws-table-col-default"><span title="{{awsTroblKnd}}" class="{{#isSystemFault}}aws-system-fault{{/isSystemFault}}{{#isUserStop}}aws-user-stop{{/isUserStop}}{{#isFaultNa}}aws-fault-na{{/isFaultNa}}">{{hmTm}}</span></td><td class="aws-table-col-auto" {{#isPtyOn}}pty-on{{/isPtyOn}} {{#isPtyOff}}pty-off{{/isPtyOff}}>{{awsPty}}</td>{{#isFull}}<td class="aws-table-col-auto">{{awsPcpM15}}</td>{{/isFull}}<td class="aws-table-col-auto">{{awsPcpHr1}}</td>{{#isFull}}<td class="aws-table-col-auto">{{awsPcpHr12}}</td>{{/isFull}}<td class="aws-table-col-auto">{{awsPcpDay}}</td><td class="aws-table-col-auto">{{awsTmp}}</td><td class="aws-table-col-auto">{{awsChillTmp}}</td><td class="aws-table-col-auto">{{awsWd10}}</td><td class="aws-table-col-auto"><span data-role="aws-wind-speed-value">{{awsWs10}}</span></td>{{#isFull}}<td class="aws-table-col-auto">{{awsWd1}}</td><td class="aws-table-col-auto"><span data-role="aws-wind-speed-value">{{awsWs1}}</span></td>{{/isFull}}<td class="aws-table-col-auto">{{awsWds}}</td><td class="aws-table-col-auto"><span data-role="aws-wind-speed-value">{{awsWss}}</span></td><td class="aws-table-col-auto">{{awsReh}}</td><td class="aws-table-col-auto">{{awsPs}}</td></tr>{{/items}}',
		awsTimeSeriesDayData: `
			{{#items}}
			<tr>
				<td><span title="{{awsTroblKnd}}" class="{{#isSystemFault}}aws-system-fault{{/isSystemFault}}{{#isUserStop}}aws-user-stop{{/isUserStop}}{{#isFaultNa}}aws-fault-na{{/isFaultNa}}">{{fullTm}}</span></td>
				<td class="aws-table-col-auto"><span><span>{{awsWssMaxDirKo}}</span> / <span data-role="aws-wind-speed-value">{{awsWssMax}}</span></span><br><span>({{awsWssMaxTm}})</span></td>
				<td class="aws-table-col-auto">{{awsTaMin}}<br>({{awsTaMinTm}})</td>
				<td class="aws-table-col-auto">{{awsTaMax}}<br>({{awsTaMaxTm}})</td>
				<td class="aws-table-col-auto">{{awsPcpDay}}</td>
				<td class="aws-table-col-auto">{{awsRehMin}}<br>({{awsRehMinTm}})</td>
				<td class="aws-table-col-auto">{{awsRehMax}}<br>({{awsRehMaxTm}})</td>
				<td class="aws-table-col-auto">{{awsPsMin}}<br>({{awsPsMinTm}})</td>
				<td class="aws-table-col-auto">{{awsPsMax}}<br>({{awsPsMaxTm}})</td>
			</tr>
			{{/items}}`,
		awsInqueryHistory: '{{#items}}<li><a href="#" data-role="aws-dropdown-item-select" data-index="{{index}}" data-aws-id="{{awsId}}" data-name-ko="{{nameKo}}" data-name-en="{{nameEn}}" data-lat="{{lat}}" data-lon="{{lon}}" data-addr="{{addr}}" data-dong-code="{{dongCode}}">{{nameKo}}({{awsId}})</a><a href="#" data-role="history-delete-item" data-index="{{index}}" data-aws-id="{{awsId}}" data-name-ko="${nameKo}}" title="{{nameKo}} 삭제">x</a></li>{{/items}}'
	};
	
	function readState() {
		var savedState = store.get(STORE_KEY);
		if(savedState) {
			state = savedState;
		}
		if(!state.toggleButtons) {
			state.toggleButtons = {
					map: {
						open: true
					},
					guide: {
						open: true
					}
				};
		}
	}
	function saveState() {
		if(state) {
			store.set(STORE_KEY, state);
		}
	}
	function init() {
		readState();
		initSidoStations();
		initMap();
		initDongSearchBox();
		initEvents();
		
		if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
			 wsUnit = appConfig.config.unit.ws;
		}
		updateWindSpeedUnit();
		createStickyHeader();
		initToggleButtons();
		
	}
	function initToggleButtons() {
		{
			var data = $awsToggleMapBtn.data();
			var $panel = $('#' + data.panelId);
			if(state.toggleButtons.map.open) {
				if(isMobileEnv()) {
					$('.kmap-guide').addClass('on');
				}
				$panel.removeClass('aws-slide-off');
				$awsToggleMapBtn.removeClass('opened').text('지도닫기');
			} else {
				$('.kmap-guide').removeClass('on');
				$panel.addClass('aws-slide-off');
				$awsToggleMapBtn.addClass('opened').text('지도열기');
			}
		}
		
		{
			var data = $awsToggleGuideBtn.data();
			var $panel = $('#' + data.panelId);
			if(state.toggleButtons.guide.open) {
				$panel.removeClass('aws-slide-off');
				$awsToggleGuideBtn.removeClass('opened').text('닫기');
			} else {
				$panel.addClass('aws-slide-off');
				$awsToggleGuideBtn.addClass('opened').text('열기');
			}
		}
	}
	function updateWindSpeedUnit() {
		$awsWindUnit = $wrapper.find('[data-role="aws-wind-unit"]');
		$awsWindSpeedValue = $wrapper.find('[data-role="aws-wind-speed-value"]');
		$awsWindUnit.html(wsUnit);
		$awsWindUnitSelect.val(wsUnit);
		if(wsUnit == "km/h") {
			$.each($awsWindSpeedValue, function() {
				var value = $(this).html();
				if(value && !isNaN(value)) {
					$(this).html((parseFloat(value) * 3.6).toFixed(1));
				}
			});
		}
		$awsWindUnit.show();
		$awsWindSpeedValue.show();
	}
	function initDongSearchBox() {
		var localSearchbox = new DongSearchboxInMap('local-search-inmap');
	}
	function initSidoStations() {
		if(!sidoStations) return;
		var sidoCode = $awsSido.val();
		var selectedSidoStations = [];
		if(!sidoCode) {
			for(var k in sidoStations) {
				for(var i in sidoStations[k]) {
					selectedSidoStations.push(sidoStations[k][i]);
				}
			}
			selectedSidoStations.sort(function(a,b) {
				return a.nameKo > b.nameKo ? 1 : a.nameKo < b.nameKo ? -1 : 0;
			});
		} else {
			selectedSidoStations = sidoStations[sidoCode];
		}
		if(selectedSidoStations) {
			$awsSidoStn.empty();
			for(var i in selectedSidoStations) {
				var selectedSidoStation = selectedSidoStations[i];
				$('<option>').attr('value', selectedSidoStation.awsId).html(selectedSidoStation.nameKo).appendTo($awsSidoStn);
			}
		}
	}
	function initMap() {
		vmap = KMAP_createMap("kmap", {
			zoom:13,
			onLoad: function(vmap) {
				KMAP_addLayer(vmap, [ { name: "sfc", options: { onKmapSfcClick: onKmapSfcClick, onLayerLoad: onKmapLayerLoad} } ]);
				onMapLoad(vmap);
			} 
		});
		
		function onMapLoad(vmap) {
			var stnId = $awsStnId.val();
			var sidoCode = $awsSidoCode.val();
			var showCurrentLocation = false;
			if(stnId == '0') {
				var centerZoom = REG_BOUNDS[sidoCode];
				if(centerZoom) {
					vmap.setCenter(centerZoom.slice(0,2));
					vmap.setZoom(centerZoom[2]);
				}
				showCurrentLocation = true;
			} else {
				if(selectedStnInfo 
						&& selectedStnInfo.awsId != "0"
						&& selectedStnInfo.lon
						&& selectedStnInfo.lat) {
					vmap.setCenter([selectedStnInfo.lon, selectedStnInfo.lat]);
				} else {
					showCurrentLocation = true;
				}
			}
			if(showCurrentLocation) {
				showLoading('kmap',true);
				getLocation(function(lat, lon, err) {
					vmap.setCenter([lon, lat]);
					vmap.addLocation([lon, lat]);
					showLoading('kmap',false);
				});
			}
			
			setInteraction(vmap);
		}
	}
	function setInteraction(vmap) {
		var dragPanInteraction = new ol.interaction.DragPan({
			condition: function(event) {
				if(ol.events.condition.mouseOnly(event)) {
					return true;
				} else if(ol.events.condition.touchOnly(event)) {
					if(event.touches) {
						if(event.touches.length > 1) {
							return true;
						}
					} else if(this.getPointerCount() > 1){
						return true;
					}
				}
				return false;
			}
		});
		var dragPan;
		var mouseWheelZoom;
		vmap._map.getInteractions().forEach(function(ia) {
			if(ia instanceof ol.interaction.DragPan) {
				dragPan = ia;
			}
			if(ia instanceof ol.interaction.MouseWheelZoom) {
				mouseWheelZoom = ia;
			}
		});
		if(dragPan) {
			vmap._map.removeInteraction(dragPan);
		}
		if(mouseWheelZoom) {
			vmap._map.removeInteraction(mouseWheelZoom);
		}
		
		vmap._map.addInteraction(dragPanInteraction);
	}
	function onKmapSfcClick(info) {
		$awsStnId.val(info.stnId);
		showAwsData();
	}
	function onKmapLayerLoad(result) {
	}
	function requestAwsStationSearch(keyword) {
		var url = prefix + "rest/zone/find/aws-stations.do";
		var data = { keyword: keyword };
		return $.ajax({
			url: url,
			data: data,
			type: "GET"
		});
	}
	function requestAwsData(param) {
		var url = prefix + "observation/land/aws-obs-data.do";
		return $.ajax({
			url: url,
			data: param,
			type: "GET"
		});
	}
	function registerKeywordSearch(keyword) {
		if(searchTimer) {
			window.clearTimeout(searchTimer);
			searchTimer = null;
		}
		searchTimer = window.setTimeout(function() {
			awsStationSearch(keyword);
		}, SEARCH_DELAY);
	}
	function awsStationSearch(keyword) {
		showLoading('aws-panel-wrap', true, "light aws-loading");
		requestAwsStationSearch(keyword).then(function(result) {
			showLoading('aws-panel-wrap', false, "light");
			if(result) {
				for(var i = 0 ; i < result.length ; i++) {
					result[i].index = i;
				}
				renderAwsStationSearchResult(result);
			}
		}, function(error) {
			console.log(error);
			alert('오류가 발생하였습니다.');
			showLoading('aws-panel-wrap', false, "light");
		});
	}
	function renderAwsStationSearchResult(result) {
		$awsInqueryHistory.hide();
		$awsKeywordSearchResult.empty();
		var $ul = $('<ul>');
		if(result && result.length > 0) {
			$ul.html(Mustache.render(templates.awsSearchResult, {items: result}));
		} else {
			$ul.html('<li><strong class="empty-result">검색 결과가 없습니다.</strong></li>')
		}
		$ul.appendTo($awsKeywordSearchResult);
		$awsKeywordSearchResult.show();
	}
	function renderAwsStationHistory() {
		$awsKeywordSearchResult.hide();
		$awsInqueryHistory.empty();
		var $ul = $('<ul>');
		if(state.inqueryHistory && state.inqueryHistory.length > 0) {
			$ul.html(Mustache.render(templates.awsInqueryHistory, {items: state.inqueryHistory}));
		} else {
			$ul.html('<li><strong class="empty-result">조회 히스토리가 없습니다.</strong></li>')
		}
		$ul.appendTo($awsInqueryHistory);
		$awsInqueryHistory.show();
	}
	function mergeInqueryHistory(data) {
		if(!state.inqueryHistory) {
			state.inqueryHistory = [];
		}
		var found = false;
		for(var i in state.inqueryHistory) {
			var hist = state.inqueryHistory[i];
			if(hist.awsId == data.awsId) {
				found = true;
				break;
			}
		}
		if(!found) {
			state.inqueryHistory.unshift(data);
		}
		saveState();
	}
	function showAwsData( opts ) {
		var param = readCurrentParams();
		if(opts && opts.reload) {
			 window.location.href = window.location.pathname + '?' + $.param(param)
		} else {
			pushHistoryState(param);
			showLoading('aws-panel-wrap', true, "light aws-loading");
			requestAwsData(param).then(function(data) {
				showLoading('aws-panel-wrap', false, "light aws-loading");
				if(data.stnId == "0") {
					var centerZoom = REG_BOUNDS[data.sidoCode];
					if(centerZoom) {
						updateMap({ center: centerZoom.slice(0,2), zoom: centerZoom[2]});
					} else {
						updateMap();
					}
					$awsConfigSelectWrap.hide();
				} else {
					// 구역 탭버튼 변경
					$awsSidoGroupBtn.removeClass('active');
					$.each($awsSidoGroupBtn, function() {
						var sidoData = $(this).data();
						if(sidoData.code == data.sidoCode) {
							$(this).addClass('active');
						}
					});
					updateMap();
					$awsConfigSelectWrap.show();
				}
				renderAwsData(data);
				createStickyHeader();
				updateWindSpeedUnit();
			}, function(error) {
				console.log(error);
				showLoading('aws-panel-wrap', false, "light aws-loading");
			});
		}
	}
	function updateMap(opts) {
		if(!vmap) return;
		if(opts) {
			// 센터 변경
			if(opts.center) {
				vmap.setCenter(opts.center);
			}
			// Zoom 변경
			if(opts.zoom) {
				vmap.setZoom(opts.zoom);
			}
		} else {
			var stnId = $awsStnId.val();
			if(stnId == '0' || stnId == '') return;
			var selectedStnInfo = findStnInfo(stnId);
			if(selectedStnInfo) {
				vmap.setCenter([selectedStnInfo.lon, selectedStnInfo.lat]);
				vmap.setZoom(13);
			}
		}
	}
	function findStnInfo(stnId) {
		for(var sidoCode in sidoStations) {
			var stations = sidoStations[sidoCode];
			for(var i in stations) {
				var stnInfo = stations[i];
				if(stnInfo.awsId == stnId) {
					return Object.assign({sidoCode: sidoCode}, stnInfo);
				}
			}
		}
		return null;
	}
	function renderAwsData(data) {
		var sort = data.sort;
		var isFull = data.config == 'full';
		$awsDataHolder.find('>table>tbody').empty();
		var isMinDb = data.db != "DAYDB";
		if(data) {
			for(var i in data.items) {
				data.items[i].isSystemFault = data.items[i].awsTroblKnd == '장애';
				data.items[i].isUserStop = data.items[i].awsTroblKnd == '비장애중단';
				data.items[i].isFaultNa = data.items[i].awsTroblKnd == 'N/A';
				if(data.items[i].isFaultNa) { data.items[i].awsTroblKnd = ""; }
				data.items[i].isFull = isFull;
				data.items[i].isPtyOn = data.items[i].awsPty == '유';
				data.items[i].isPtyOff = data.items[i].awsPty == '무';
			}
			if(data.stnId == "0") {
				if(isMinDb) {
					$awsDataHolder.find('>table>thead').html('<tr>' +
							'<th scope="col" class="aws-table-col-default">' +
							'	<span>번호</span>' +
							'	<span>' +
							'		<a href="#" class="sym-btn sym-arrow-down ' + (sort == 'awsStnId/asc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnId/asc" title="내림차순">내림차순</a>' +
							'		<a href="#" class="sym-btn sym-arrow-up ' + (sort == 'awsStnId/desc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnId/desc" title="오름차순">오름차순</a>' +
							'	</span>' +
							'</th>' +
							'<th scope="col" class="aws-table-col-default">' +
							'	<span>지점</span>' +
							'	<span>' +
							'		<a href="#" class="sym-btn sym-arrow-down ' + (sort == 'awsStnName/asc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnName/asc" title="내림차순">내림차순</a>' +
							'		<a href="#" class="sym-btn sym-arrow-up ' + (sort == 'awsStnName/desc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnName/desc" title="오름차순">오름차순</a>' +
							'	</span>' +
							'</th>' +
							'<th scope="col" class="aws-table-col-default">고도<br/>(m)</th>' +
							'<th scope="col" class="aws-table-col-default">강수<br/>유무</th>' +
							'<th scope="col" class="aws-table-col-default">일강수<br/>(mm)</th>' +
							'<th scope="col" class="aws-table-col-default">기온<br>(℃)</th>' +
							'<th scope="col" class="aws-table-col-default">체감온도<br>(℃)</th>' +
							'<th scope="col" class="aws-table-col-default">10분풍향</th>' +
							'<th scope="col" class="aws-table-col-default">10분풍속<br>(' + wsUnit + ')</th>' +
							'<th scope="col" class="aws-table-col-default">습도<br>(%)</th>' +
							'<th scope="col" class="aws-table-col-auto">위치</th>' +
						'</tr>');
					$awsTm.val(data.tm);
					$awsDataTm.html(data.tm);
					
					if(data.items.length > 0) {
						$awsDataHolder.find('>table>tbody').html(Mustache.render(templates.awsData, {items: data.items}));						
					} else {
						$awsDataHolder.find('>table>tbody').html('<tr class="empty-data"><td class="aws-table-col-auto aws-table-txt-center" colspan="11">자료가 존재하지 않습니다.</td></tr>');
					}
					
					$awsDataHolder.removeClass('aws-table-timeseries');
					$awsDataHolder.find('a[data-role="aws-data-item-select"]').on('click', function(e) {
						e.preventDefault();
						$awsStnId.val($(this).data().awsId);
						showAwsData({reload: true});
					});
				} else {
					$awsDataHolder.find('>table>thead').html('<tr>' +
							'<th scope="col" class="aws-table-col-default">' +
							'	<span>번호</span>' +
							'	<span>' +
							'		<a href="#" class="sym-btn sym-arrow-down ' + (sort == 'awsStnId/asc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnId/asc" title="내림차순">내림차순</a>' +
							'		<a href="#" class="sym-btn sym-arrow-up ' + (sort == 'awsStnId/desc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnId/desc" title="오름차순">오름차순</a>' +
							'	</span>' +
							'</th>' +
							'<th scope="col" class="aws-table-col-default">' +
							'	<span>지점</span>' +
							'	<span>' +
							'		<a href="#" class="sym-btn sym-arrow-down ' + (sort == 'awsStnName/asc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnName/asc" title="내림차순">내림차순</a>' +
							'		<a href="#" class="sym-btn sym-arrow-up ' + (sort == 'awsStnName/desc' ? 'on' : '') + '" data-role="aws-data-sort" data-sort="awsStnName/desc" title="오름차순">오름차순</a>' +
							'	</span>' +
							'</th>' +
							'<th scope="col" class="aws-table-col-auto">고도<br/>(m)</th>' +
							'<th scope="col" class="aws-table-col-auto">최대순간풍향/풍속(<em data-role="aws-wind-unit">m/s</em>)(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최저기온(℃)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최고기온(℃)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">일강수량<br/>(mm)</th>' +
							'<th scope="col" class="aws-table-col-auto">최저습도(%)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최고습도(%)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최저기압(hPa)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최고기압(hPa)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">위치</th>' +
						'</tr>');
					$awsTm.val(data.tm);
					$awsDataTm.html(data.tm);
					
					if(data.items.length > 0) {
						$awsDataHolder.find('>table>tbody').html(Mustache.render(templates.awsDayData, {items: data.items}));						
					} else {
						$awsDataHolder.find('>table>tbody').html('<tr class="empty-data"><td class="aws-table-col-auto aws-table-txt-center" colspan="8">자료가 존재하지 않습니다.</td></tr>');
					}
					
					$awsDataHolder.removeClass('aws-table-timeseries');
					$awsDataHolder.find('a[data-role="aws-data-item-select"]').on('click', function(e) {
						e.preventDefault();
						$awsStnId.val($(this).data().awsId);
						showAwsData({reload:true});
					});
				}
			} else {
				if(isMinDb) {
					$awsDataHolder.find('>table>thead').html('<tr>' +
							'<th scope="col" class="aws-table-col-default">시:분</th>' +
							'<th scope="col" class="aws-table-col-auto">강수<br/>유무</th>' +
							(isFull ? '<th scope="col" class="aws-table-col-auto">15분강수<br>(mm)</th>' : '') +
							'<th scope="col" class="aws-table-col-auto">1시간강수<br>(mm)</th>' +
							(isFull ? '<th scope="col" class="aws-table-col-auto">12시간분강수<br>(mm)</th>' : '') +
							'<th scope="col" class="aws-table-col-auto">일강수<br>(mm)</th>' +
							'<th scope="col" class="aws-table-col-auto">기온<br>(℃)</th>' +
							'<th scope="col" class="aws-table-col-auto">체감온도<br>(℃)</th>' +
							'<th scope="col" class="aws-table-col-auto">10분풍향</th>' +
							'<th scope="col" class="aws-table-col-auto">10분풍속<br>(' + wsUnit + ')</th>' +
							(isFull ? '<th scope="col" class="aws-table-col-auto">1분풍향</th>' : '') +
							(isFull ? '<th scope="col" class="aws-table-col-auto">1분풍속<br>(' + wsUnit + ')</th>' : '') +
							'<th scope="col" class="aws-table-col-auto">순간최대풍향</th>' +
							'<th scope="col" class="aws-table-col-auto">순간최대풍속<br>(' + wsUnit + ')</th>' +
							'<th scope="col" class="aws-table-col-auto">습도<br>(%)</th>' +
							'<th scope="col" class="aws-table-col-auto">해면기압<br>(hPa)</th>' +
						'</tr>');
					$awsTm.val(data.tm);
					$awsDataTm.html(data.stnInfo.nameKo + ' ' + data.stnId + ' (' + data.stnInfo.height + 'm) / ' + data.tm + ' / ' + data.stnInfo.addr);
					if(data.items.length > 0) {
						$awsDataHolder.find('>table>tbody').html(Mustache.render(templates.awsTimeSeriesData, {items: data.items}));						
					} else {
						$awsDataHolder.find('>table>tbody').html('<tr class="empty-data"><td class="aws-table-col-auto aws-table-txt-center" colspan="' + ( isFull ? 16 : 12 ) + '">자료가 존재하지 않습니다.</td></tr>');
					}
					
					$awsDataHolder.addClass('aws-table-timeseries');
				} else {
					$awsDataHolder.find('>table>thead').html('<tr>' +
							'<th scope="col" class="aws-table-col-medium">년월일</th>' +
							'<th scope="col" class="aws-table-col-auto">최대순간풍향/풍속(<em data-role="aws-wind-unit">m/s</em>)(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최저기온(℃)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최고기온(℃)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">일강수량<br/>(mm)</th>' +
							'<th scope="col" class="aws-table-col-auto">최저습도(%)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최고습도(%)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최저기압(hPa)<br>(시각)</th>' +
							'<th scope="col" class="aws-table-col-auto">최고기압(hPa)<br>(시각)</th>' +
						'</tr>');
					$awsTm.val(data.tm);
					$awsDataTm.html(data.stnInfo.nameKo + ' ' + data.stnId + ' (' + data.stnInfo.height + 'm) / ' + data.tm + ' / ' + data.stnInfo.addr);
					if(data.items.length > 0) {
						$awsDataHolder.find('>table>tbody').html(Mustache.render(templates.awsTimeSeriesDayData, {items: data.items}));						
					} else {
						$awsDataHolder.find('>table>tbody').html('<tr class="empty-data"><td class="aws-table-col-auto aws-table-txt-center" colspan="5">자료가 존재하지 않습니다.</td></tr>');
					}
					
					$awsDataHolder.addClass('aws-table-timeseries');
				}
			}
			if(data.stnId != "0" && isMinDb) {
				$awsConfigSelectWrap.show();
			} else {
				$awsConfigSelectWrap.hide();
			}
			if(isMinDb) {
				$awsDataName.html('매분 관측자료');
			} else {
				$awsDataName.html('일극값자료');
			}
		}
	}
	function readCurrentParams() {
		var param = {};
		// 자료 선택
		param.db = $awsDb.val();
		// 시간 입력
		param.tm = $awsTm.val();
		// 지점 번호
		param.stnId = $awsStnId.val();
		// 시도 코드
		param.sidoCode = $awsSidoCode.val();
		// 정렬
		param.sort = $awsSort.val();
		// 보기 설정
		param.config = $awsConfig.val();
		return param;
	}
	function pushHistoryState(param) {
		if(history.pushState) {
			history.pushState(param, null, location.pathname + '?' + $.param(param));
		}
	}
	function initEvents() {
		$awsSelectTmBtn.on('click', function(e) {
			e.preventDefault();
			showAwsData()
		});
		$awsSelectDbBtn.on('click', function(e) {
			e.preventDefault();
			var dtmBtnData = [
				{ value:0, byMinutes: 1, text: "현재"},
				{ value:-60, byMinutes: 1, text: "60분전"},
				{ value:-10, byMinutes: 1, text: "10분전"},
				{ value:-1, byMinutes: 1, text: "1분전"},
				{ value:1, byMinutes: 1, text: "1분후"},
				{ value:10, byMinutes: 1, text: "10분후"},
				{ value:60, byMinutes: 1, text: "60분후"},
			];
			// 기준 시간 버튼 그룹 변경.
			if($awsDb.val() == 'DAYDB') {
				dtmBtnData = [
					{ value:0, byMinutes: 60, text: "현재"},
					{ value:-144, byMinutes: 60, text: "6일전"},
					{ value:-72, byMinutes: 60, text: "2일전"},
					{ value:-24, byMinutes: 60, text: "1일전"},
					{ value:24, byMinutes: 60, text: "1일후"},
					{ value:72, byMinutes: 60, text: "2일후"},
					{ value:144, byMinutes: 60, text: "6일후"},
				];
			} else if($awsDb.val() == 'MINDB_10M') {
				dtmBtnData = [
					{ value:0, byMinutes: 1, text: "현재"},
					{ value:-180, byMinutes: 1, text: "3시간전"},
					{ value:-60, byMinutes: 1, text: "1시간전"},
					{ value:-10, byMinutes: 1, text: "10분전"},
					{ value:10, byMinutes: 1, text: "10분후"},
					{ value:60, byMinutes: 1, text: "1시간후"},
					{ value:180, byMinutes: 1, text: "3시간후"},
				];
			} else if($awsDb.val() == 'MINDB_30M') {
				dtmBtnData = [
					{ value:0, byMinutes: 1, text: "현재"},
					{ value:-180, byMinutes: 1, text: "3시간전"},
					{ value:-60, byMinutes: 1, text: "1시간전"},
					{ value:-30, byMinutes: 1, text: "30분전"},
					{ value:30, byMinutes: 1, text: "30분후"},
					{ value:60, byMinutes: 1, text: "1시간후"},
					{ value:180, byMinutes: 1, text: "3시간후"},
				];
			} else if($awsDb.val() == 'MINDB_60M') {
				dtmBtnData = [
					{ value:0, byMinutes: 60, text: "현재"},
					{ value:-6, byMinutes: 60, text: "6시간전"},
					{ value:-3, byMinutes: 60, text: "3시간전"},
					{ value:-1, byMinutes: 60, text: "1시간전"},
					{ value:1, byMinutes: 60, text: "1시간후"},
					{ value:3, byMinutes: 60, text: "3시간후"},
					{ value:6, byMinutes: 60, text: "6시간후"},
				];
			}
			
			$.each($awsSelectDtm, function(i) {
				var $dtmBtn = $(this);
				$dtmBtn.attr('data-value', dtmBtnData[i].value);
				$dtmBtn.attr('data-by-minutes', dtmBtnData[i].byMinutes);
				$dtmBtn.text(dtmBtnData[i].text);
			});
			showAwsData()
		});
		$awsSelectDtm.on('click', function(e) {
			e.preventDefault();
			var $dtmBtn = $(this);
			var value = $dtmBtn.attr('data-value');
			var byMinutes = $dtmBtn.attr('data-by-minutes');
			if(parseInt(value) == 0) {
				$awsTm.val("");
			} else {
				var tmMoment = moment($awsTm.val(), 'YYYY.MM.DD HH:mm');
				var minutes = parseInt(value) * parseInt(byMinutes); 
				tmMoment = tmMoment.add(minutes, 'minute');
				$awsTm.val(tmMoment.format('YYYY.MM.DD HH:mm'));	
			}
			showAwsData();
		});
		$awsSido.on('change', function(e) {
			initSidoStations();
		});
		$awsSelectSidoStnBtn.on('click', function(e) {
			e.preventDefault();
			var sidoStnId = $awsSidoStn.val();
			$awsStnId.val(sidoStnId);
			showAwsData();
		});
		$awsSidoGroupBtn.on('click', function(e) {
			e.preventDefault();
			$awsSidoGroupBtn.removeClass('active');
			$(this).addClass('active');
			var data = $(this).data();
			$awsSidoCode.val(data.code);
			$awsStnId.val('0');
			showAwsData();
		});
		$awsTm.datetimepicker({ timeInput: true
			,timeFormat: "HH:mm"
			,dateFormat: "yy.mm.dd"
			//,maxDateTime: new Date()
		});
		$awsKeyword.on('focus', function(e) {
			renderAwsStationHistory();
		});
		$awsKeyword.on('keyup', function(e) {
			if(e.keyCode != 13) return;
			
			var keyword = $(this).val();
			if(keyword) {
				//registerKeywordSearch(keyword);
				awsStationSearch(keyword);
			}
		});
		$awsSearchBtn.on('click', function(e) {
			e.preventDefault();
			if(searchTimer) {
				window.clearTimeout(searchTimer);
			}
			var keyword = $awsKeyword.val();
			if(keyword) {
				awsStationSearch(keyword);
			}
		});
		
		$awsInqueryHistory.on('click', '[data-role=aws-dropdown-item-select]', function(e) {
			e.preventDefault();
			var data = $(this).data();
			$awsStnId.val(data.awsId);
			mergeInqueryHistory(data);
			showAwsData();
			$awsInqueryHistory.hide();
			$awsKeyword.val('');
		});
		
		$awsInqueryHistory.on('click', '[data-role=history-delete-item]', function(e) {
			e.preventDefault();
			var data = $(this).data();
			var found = false;
			if(state.inqueryHistory) {
				for(var i in state.inqueryHistory) {
					var hist = state.inqueryHistory[i];
					if(hist.awsId == data.awsId) {
						state.inqueryHistory.splice(i,1);
						found = true;
						break;
					}
				}
			}
			if(found) {
				saveState();
				renderAwsStationHistory();
			}
		});
		
		$awsKeywordSearchResult.on('click', '[data-role=aws-dropdown-item-select]', function(e) {
			e.preventDefault();
			var data = $(this).data();
			$awsStnId.val(data.awsId);
			mergeInqueryHistory(data);
			showAwsData();
			$awsKeywordSearchResult.hide();
			$awsKeyword.val('');
		});
		
		$awsTogglePanelBtn.on('click', function(e) {
			e.preventDefault();
			var data = $(this).data();
			$('#' + data.panelId).toggle();
			$('#' + data.panelId).toggleClass('on');
		});
		
		$awsToggleMapBtn.on('click', function(e) {
			e.preventDefault();
			var data = $(this).data();
			var $panel = $('#' + data.panelId);
			$panel.toggleClass('aws-slide-off');
			if($panel.hasClass('aws-slide-off')) {
				$('.kmap-guide').removeClass('on');
				$(this).addClass('opened').text('지도열기');
				state.toggleButtons.map.open = false;
			} else {
				if(isMobileEnv()) {
					$('.kmap-guide').addClass('on');
				}
				$(this).removeClass('opened').text('지도닫기');
				state.toggleButtons.map.open = true;
			}
			saveState();
		});
		$awsToggleGuideBtn.on('click', function(e) {
			e.preventDefault();
			var data = $(this).data();
			var $panel = $('#' + data.panelId);
			$panel.toggleClass('aws-slide-off');
			if($panel.hasClass('aws-slide-off')) {
				$(this).addClass('opened').text('열기');
				state.toggleButtons.guide.open = false;
			} else {
				$(this).removeClass('opened').text('닫기');
				state.toggleButtons.guide.open = true;
			}
			saveState();
		});
		$awsWindUnitSelect.on('change', function(e) {
			wsUnit = $(this).val();
			if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
				appConfig.config.unit.ws = wsUnit;
				appConfig.writeConfig();
			}
			showAwsData();
		});
		$awsConfigSelect.on('change', function(e) {
			var config = $(this).val();
			$awsConfig.val(config);
			showAwsData({reload: true});
		});
		$awsDataHolder.find('a[data-role="aws-data-item-select"]').on('click', function(e) {
			e.preventDefault();
			$awsStnId.val($(this).data().awsId);
			showAwsData();
		});
		$(document).click(function(e) {
			if($(e.target).parents('.aws-panel-inputwrap').length >= 1 
					|| $(e.target).parents('.local-search-box').length >= 1) {
				return false;
			}
			$('.cmp-local-search-items').removeClass('on');
			$awsInqueryHistory.hide();
		});
		$searchCurrentLocationBtn.on('click', function(e) {
			e.preventDefault();
			startUserLocation(function(position) {
				if(position.coords.latitude && position.coords.longitude) {
					if(vmap) {
						vmap.addLocation([position.coords.longitude,position.coords.latitude]);
						vmap.setCenter([position.coords.longitude,position.coords.latitude]);
					}
				}
			});
		});
		$awsDataHolder.on('click', 'a[data-role="aws-data-sort"]', function(e) {
			e.preventDefault();
			var $awsDataSort = $wrapper.find('a[data-role="aws-data-sort"]');
			var data = $(this).data();
			if($(this).hasClass('on')) {
				$awsSort.val('');
			} else {
				$awsDataSort.removeClass('on');
				$(this).addClass('on');
				$awsSort.val(data.sort);
			}
			showAwsData({reload:true});
		});
		GlobalEvent.on('onAppConfigUpdated', function(e) {
			window.location.reload();
		});
		GlobalEvent.on('onAreaShow', function(e, bookmark, sender, disableUpdateMapCenter) {
			if(vmap) {
				vmap.addLocation([bookmark.lon, bookmark.lat]);
				vmap.setCenter([bookmark.lon, bookmark.lat]);
			}
		});
		
		// 기타
		$('.cmp-help-tooltip .close-box').click(function(e) {
			e.preventDefault();
			$(this).parents('.cmp-help-tooltip').toggle().toggleClass('on');
		});
	}
	function startUserLocation(callback, errorCallback) {
		var base = this;
		var errorDefaultCallback = function(error) {
			if(console) console.log(error);
			switch(error.code) {
			case 1: // error.PERMISSION_DENIED:
				if(!hideMessage) alert("현재 위치 요청이 거부되었습니다.");
				break;
			case 2: // error.POSITION_UNAVAILABLE:
				if(!hideMessage) alert("위치정보를 사용할 수 없습니다.");
				break;
			case 3: // error.TIMEOUT:
				if(!hideMessage) alert("위치정보 요청 시간이 초과되었습니다.");
				break;
			case 4: // error.UNKNOWN_ERROR:
				if(!hideMessage) alert("알 수 없는 요류로 현재 위치 요청이 실패하였습니다.");
				break;
			}
			if(typeof errorCallback === "function") {
				errorCallback();
			}
		}
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(callback, errorDefaultCallback);
		} else {
			alert("현재 위치를 지원하지 않는 브라우져입니다.");
		}
	}
	function createStickyHeader() {
		var $sticky = $('.cmp-sticky-scroll > table');
		var tableDimen = [];
		var currentTableWidth = $sticky.width();
		$(window).unbind('resize').on('resize', function() {
			updateResize();
		});
		$(window).unbind('scroll').scroll(function() {
			updateScrollPos();
		});
		function updateResize() {
			$sticky = $('.cmp-sticky-scroll > table');
			var tableWidth = $sticky.width();
			var windowWidth = $(window).width();
			if(tableWidth > windowWidth) {
				tableWidth = windowWidth;
			}
			if(tableWidth < 1024) tableWidth = 1024;
			var ratio = tableWidth / currentTableWidth;
			
			$sticky.each(function(sindex, el) {
				if($(el).find('.empty-data').length > 0) return;
				var dimen = tableDimen[sindex];
				var $stickyTable = $(el);
				$stickyTable.find('thead > tr').each(function(rowIndex, row){
					var $cols = $(row).find('th');
					var colLength = $cols.length;
					$cols.each(function(colIndex, col) {
						$(col).width(dimen.body[colIndex] * ratio);
					});
				});
				$stickyTable.find('tbody > tr').each(function(rowIndex, row){
					var $cols = $(row).find('td');
					var colLength = $cols.length;
					$cols.each(function(colIndex, col) {
						$(col).width(dimen.body[colIndex] * ratio);
					});
				});
				$stickyTable.find('thead').width(tableWidth);
				$stickyTable.find('tbody').width(tableWidth);
			});
				
			updateScrollPos();
		}
		function updateScrollPos() {
			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			$sticky.each(function(sindex, el) {
				if($(el).find('.empty-data').length > 0) return;
				var $stickyTable = $(el);
				var $stickyHead = $stickyTable.find('thead');
				var $stickyBody = $stickyTable.find('tbody');
				var headHeight = $stickyHead.find('tr').first().height();
				var toggleHeight = $stickyTable.offset().top;
				if(toggleHeight < scrollTop) {
					$stickyTable.addClass('floating');
					$stickyHead.css('top', (scrollTop - toggleHeight) + 'px');
					$stickyBody.first().css('border-top', headHeight + 'px solid transparent');
				} else if(toggleHeight - headHeight > scrollTop){
					$stickyTable.removeClass('floating');
					$stickyHead.css('top', 'auto');
					$stickyBody.first().css('border-top', '0px solid transparent');
				}	
			});
		}
		$sticky.parent().on('scroll', function() {
			var $stickyWrap = $(this);
			var stickyLeft = $stickyWrap.scrollLeft();
			if(stickyLeft < 0 ) stickyLeft = 0;
			$stickyWrap.find('td .sticky').css('margin-left', stickyLeft + 'px');
		});
		$sticky.each(function(sindex, el) {
			$(el).find('span.sticky').each(function() {
				var bgColor = $(this).parent().css('background-color');
				if(bgColor == 'rgba(0, 0, 0, 0)') {
					$(this).css('background-color', '#fff');
				} else {
					$(this).css('background-color', bgColor);
				}
			});
			
			tableDimen.push(setupHeadWidth($(el)));
		});
		updateResize();
		function getTableBodyColWidthArr($stickyTable) {
			var colWidthArray = [];
			var $tdChildren = $stickyTable.find('tbody:first-of-type > tr:nth-child(1) > td');
			var colCount = $tdChildren.length;
			var tableWidth = $stickyTable.width() - colCount;
			var addrWidth = 280;
			if(tableWidth <= 1024) {
				addrWidth = 200;
			}
			if($awsStnId.val() != "0") {
				addrWidth = Math.floor(tableWidth / colCount);
			} 
			var colWidth = Math.floor((tableWidth - addrWidth) / (colCount-1));
			var colWidthTot = 0;
			for(var i = 0 ; i < colCount - 1 ; i++) {
				colWidthArray.push(colWidth);
				colWidthTot += colWidth;
			}
			addrWidth = tableWidth - colWidthTot;
			colWidthArray.push(addrWidth);
//			$stickyTable.find('tbody:first-of-type > tr:nth-child(1) > td').each(function() {
//				colWidthArray.push($(this).width());
//			});
				
			return colWidthArray;
		}
		function getTableHeadColWidthArr($stickyTable) {
			var colWidthArray = [];
			var $tdChildren = $stickyTable.find('thead:first-of-type > tr:nth-child(1) > th');
			var colCount = $tdChildren.length;
			var tableWidth = $stickyTable.width() - colCount;
			var addrWidth = 280;
			if(tableWidth <= 1024) {
				addrWidth = 200;
			}
			if($awsStnId.val() != "0") {
				addrWidth = Math.floor(tableWidth / colCount);
			} 
			var colWidth = Math.floor((tableWidth - addrWidth) / (colCount-1));
			var colWidthTot = 0;
			for(var i = 0 ; i < colCount - 1 ; i++) {
				colWidthArray.push(colWidth);
				colWidthTot += colWidth;
			}
			addrWidth = tableWidth - colWidthTot;
			colWidthArray.push(addrWidth);
//			$stickyTable.find('thead:first-of-type > tr:nth-child(1) > th').each(function() {
//				colWidthArray.push($(this).width());
//			});
				
			return colWidthArray;
		}
		function setupHeadWidth($stickyTable) {
			var bodyColWidthArray = getTableBodyColWidthArr($stickyTable);
			var headColWidthArray = getTableHeadColWidthArr($stickyTable);
			var headWidth = $stickyTable.width();
			$stickyTable.find('thead > tr').each(function(rowIndex, row){
				var $cols = $(row).find('th');
				var colLength = $cols.length;
				$cols.each(function(colIndex, col) {
					$(col).width(headColWidthArray[colIndex]);
				});
			});
			$stickyTable.find('tbody > tr:not(.empty-data)').each(function(rowIndex, row){
				var $cols = $(row).find('td');
				var colLength = $cols.length;
				$cols.each(function(colIndex, col) {
					$(col).width(bodyColWidthArray[colIndex]);
				});
			});
			$stickyTable.find('thead').width(headWidth);
			$stickyTable.find('tbody').width(headWidth);
			return { head: headColWidthArray, body: bodyColWidthArray};
		}
		return $sticky;
	}
	init();
})(jQuery, window, document);
