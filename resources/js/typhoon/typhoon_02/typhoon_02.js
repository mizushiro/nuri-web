//프로젝션 정의
proj4.defs('EPSG:111111',
    '+proj=lcc +lat_1=28 +lat_0=28 +lon_0=128.2 +k_0=1.0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');

// 지도 매니져
var mapManager = {
  config : {
    map : 'map',
    marker : 'marker',
    popup : 'popup',
    selectbox : 'selectItems',
    graph : 'graph',
    detail : 'detail',
    cbTyphoonClick : undefined,/* 실시간 태풍 클릭 시, 동작을 하기 위한 함수 등록. */
    cbPastTyphoonClick : undefined,/* 태풍 클릭 시, 동작을 하기 위한 함수 등록. */
    cbToggleSearchMode : undefined,/* 모드 변경에 따른 콜백 */
    enableSearch : false,/* 검색 모드 여부. */
    dontDisplayTabControl : false,/* 탭 컨트롤 등을 표시하지 않기 위한 객체 기본은 false. */
    dontLoadRealTime : false,/* 실시간 조회 금지가 설정되지 않은 경우 false */
    dontDisplayPastTyp : false,/* 과거 태풍 사용이 금지된 경우 false */
    pastTypDisplayLikeRealTime : false
  /* 과거 태풍의 실시간과 동일한 태풍 표시 여부 TODO : 구현필요 */
  },
  controls : {
    noItemMsgControl : undefined /* 태풍 또는 TD가 없는 경우, 메세지 표출 컨트롤 */
    ,
    tapControl : undefined /* 탭 컨트롤 */
    ,
    playControl : undefined /* 위성영상 탭에서 플레이 컨트롤 */
    ,
    onlySelectedControl : undefined /* 선택한 태풍만 예보정보 보기 | 모든 태풍 예보정보 보기 컨트롤 */
    ,
    nowViewControl : undefined /* 위성영상 탭에서 영상의 시간 표시 컨트롤 */
    ,
    loadingBarControl : undefined /* loading bar */
    ,
    disaplayPastTyphoonMarker : undefined /* 태풍 발표정보 마커 표시 */
    ,
    disaplayRealTime : undefined
  /* 실시간 발표정보 표시 */
  },
  manager : {
    current : undefined /* 현재 진행중인 TD, TYP 정보 관리 */
    ,
    pastTyp : undefined /* 과거 태풍 정보 관리 */
    ,
    search : undefined
  /* 검색 격자 관리 */
  },
  map : undefined /* 지도 객체 */
  ,
  projection : undefined,
  layers : {
    base : undefined /* 지도 layer */
    ,
    position : undefined /* 지점 layer */
    ,
    past : undefined /* 과거 태풍 layer */
    ,
    pastMarker : undefined /* 과거 태풍 지점정보 layer */
    ,
    typhoon : undefined /* 태풍 layer */
    ,
    search : undefined
  /* 검색 layer */
  },
  imageSources : [] /* 천리안 위성이미지 소스 */
  ,
  extents : {
//    base : ol.proj.transformExtent([ 113, 15, 150, 46 ], "EPSG:4326", "EPSG:111111")
    base : ol.proj.transformExtent([ -40, -40, 180, 60 ], "EPSG:4326", "EPSG:111111")
  /* 적도0~북위60도 경도 100~180 [100, 0, 180, 60] */
  },

  sourceParams : {
    base : {
      LAYERS : 'typhoon:typhoon_kr',
      VERSION : '1.1.0'
    },
    baseEn : {
      LAYERS : 'typhoon:typhoon_eng',
      VERSION : '1.1.0'
    }
  },
  minZoom : 3,
  maxZoom : 7,
  popup : undefined,
  marker : undefined,
  LOGGING : true
/* 테스트 여부 */
};

// 검색 관리 객체 반환
mapManager.getSearchManager = function() {
  var vm = this;
  return vm.manager.search;
};

// 이전태풍 관리 객체 반환
mapManager.getPastTyphoonManager = function() {
  var vm = this;
  return vm.manager.pastTyp;
};

// 오버레이 추가
mapManager.addOverlay = function(message, coordinate) {

  var id = "overlays" + this.overlays.length;
  var element = "<div id='"
      + id
      + "' style='border:3px solid red;background-color:rgba(255, 255, 255, 0.9);font:15px Dotum;color:red;font-weight:bold; padding:10px 10px 10px 10px;'>"
      + message + "</div>";
  $("#gisContents").append(element);

  var overlay = new ol.Overlay({
    position : coordinate,
    positioning : 'center-center',
    element : document.getElementById(id),
    stopEvent : false
  });

  var o = {
    id : id,
    overlay : overlay
  };

  this.overlays.push(o);
  this.map.addOverlay(overlay);

  return id;
};

// 오버레이 추가
mapManager.removeOverlay = function(id) {

  for ( var i = 0 ; i < this.overlays.length ; i++) {
    var o = this.overlays[i];
    if (o.id == id) {
      this.map.removeOverlay(o.overlay);
      $("#" + o.id).remove();
      this.overlays.splice(i, 1);
      break;
    }
  }
};

// 검색조건 변경 처리.
mapManager.toggleSearchMode = function(toggle) {
  if (objectUtils.isUndefined(toggle)) {
    toggle = !mapManager.config.enableSearch || false;
  }
  mapManager.config.enableSearch = toggle;

  var active;
  var inactives = [];
  if (toggle) {
    // true : 0 번 active
    active = "map_tab_search";
    inactives = [ "map_tab_select" ];
  } else {
    // false : 1 번 active
    active = "map_tab_select";
    inactives = [ "map_tab_search" ];
  }

  // 토글 비활성화
  for ( var i = 0; i < inactives.length; i++) {
    var inactive = inactives[i];
    $("#" + inactive).parent('li').removeClass('active');
  }

  // 토글 활성화
  $("#" + active).parent('li').addClass('active');

  if (objectUtils.isUndefined(mapManager.config.cbToggleSearchMode)) {
    return;
  }
  mapManager.config.cbToggleSearchMode(toggle);
};


//검색조건 변경 처리.
mapManager.toggleSearchMode2 = function(toggle) {
//if (objectUtils.isUndefined(toggle)) {
// toggle = !mapManager.config.enableSearch || false;
//}
mapManager.config.enableSearch = toggle;

};


// control 추가 함수
mapManager.addControl = function(control) {
  if (typeof control === "undefined" || control === null) {
    return false;
  }

  if (control instanceof mapManager.TapControl) {
    this.controls.tapControl = control;
  } else if (control instanceof mapManager.DisaplayPastTyphoonMarker) {
    this.controls.disaplayPastTyphoonMarker = control;
  } else if (control instanceof mapManager.DisaplayRealTime) {
    this.controls.disaplayRealTime = control;
  } else if (control instanceof mapManager.NoItemMsgControl) {
    this.controls.noItemMsgControl = control;
  } else if (control instanceof mapManager.OnlySelectedControl) {
    this.controls.onlySelectedControl = control;
  } else if (control instanceof mapManager.NowViewControl) {
    this.controls.nowViewControl = control;
  } else if (control instanceof mapManager.LoadingBarControl) {
    this.controls.loadingBarControl = control;
  }

  this.map.addControl(control);
};

// 중심 위치 변경
mapManager.setCenter = function(center) {
  if (objectUtils.isUndefined(center)) {
    return;
  }
  var lon;
  var lat;
  if (center.hasOwnProperty('slon')) {
    // rect
    lon = (center.slon + center.elon) / 2;
    lat = (center.slat + center.elat) / 2;
  } else if (center.hasOwnProperty('lon_min')) {
    // rect
    lon = (center.lon_min + center.lon_max) / 2;
    lat = (center.lat_min + center.lat_max) / 2;
  } else if (center.hasOwnProperty('lon')) {
    // coordinate
    lon = center.lon;
    lat = center.lat;
  } else if (center.hasOwnProperty('length')) {
    // array
    lon = center[0];
    lat = center[1];
  }
  var view = mapManager.map.getView();
  var pos = olUtils.transEpsg4326toEpsg111111(ol, [ lon, lat ]);
  view.setCenter(pos); 
};

// control 제거 함수
mapManager.removeControl = function(control) {

  if (typeof control === "undefined" || control === null) {
    return false;
  }

  if (control instanceof mapManager.TapControl && typeof mapManager.controls.tapControl !== "undefined") {
    this.controls.tapControl = undefined;

  } else if (control instanceof mapManager.NoItemMsgControl
      && typeof mapManager.controls.noItemMsgControl !== "undefined") {
    this.controls.noItemMsgControl = undefined;
  } else if (control instanceof mapManager.OnlySelectedControl
      && typeof mapManager.controls.onlySelectedControl !== "undefined") {
    this.controls.onlySelectedControl = undefined;

  } else if (control instanceof mapManager.NowViewControl && typeof mapManager.controls.nowViewControl !== "undefined") {
    this.controls.nowViewControl = undefined;

  } else if (control instanceof mapManager.LoadingBarControl
      && typeof mapManager.controls.loadingBarControl !== "undefined") {
    this.controls.loadingBarControl = undefined;
    if (objectUtils.isUndefined(mapManager.config.selectbox) == false) {
      $("#" + mapManager.config.selectbox).prop('disabled', false); // 로딩바가 있는
      // 경우 조작못하게
      // 한 것 풀기
    }
  }

  this.map.removeControl(control);

};

function toggleChange(toggleSearch){
	mapManager.toggleSearchMode2(toggleSearch);
}
/**
 * 탭 컨트롤 (검색모드, 조회모드)
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=}
 *            opt_options Control options.
 */
mapManager.TapControl = function(opt_options) {
  var vm = this;

  var html = "";
  html += '<div class="tab list jx">';
  html += '  <ul>';
  html += '    <li class="active">';
  html += '    <a href="javascript:;" class="tab_search_menu" id="map_tab_search"><span>'
      + typhoonLang.msg('typho.n.0001');
  html += '    </span></a>';
  html += '    </li>';
  html += '    <li>';
  html += '      <a href="javascript:;" class="tab_search_menu" id="map_tab_select">' + typhoonLang.msg('typho.n.0002');
  html += '      </a>';
  html += '    </li>';
  html += '  </ul>';
  html += '</div>';
  var blind = $('<h1 class="blind">' + typhoonLang.msg('typho.0004') + '</h1>');
  var options = opt_options || {};
  var tab_list = $(html);
  var tab_list_i = tab_list.find('>ul>li');
  var tabIdx = 0;

  var TAP_SEARCH_MODE = 0;
  var TAP_SELECT_MODE = 1;
  var handleTapControl = function(e) {
    if (typeof mapManager.controls.loadingBarControl !== "undefined") {
      return false;
    }

    var t = $(this).parent('li'); /* 현재 선택된 tap li */
    var tList = tab_list_i;
    var idx = tList.index(t);

    // tList.removeClass('active');
    // t.addClass('active');
    // tabIdx = idx;

    var toggleSearch = false;
//    switch (idx) {
//    case TAP_SEARCH_MODE:
//      /* 검색을 하기 위한 모드로 변경 */
//      toggleSearch = true;
//      break;
//    case TAP_SELECT_MODE:
//      /* 태풍을 조회 하기 위한 모드로 변경 */
//      toggleSearch = false;
//      break;
//    }
//    mapManager.toggleSearchMode(toggleSearch);
    return false;
  };


  // 지도 도움말
  tab_list.find('.tab_search_menu').click(handleTapControl);

  var element = document.createElement('div');
  element.className = 'map_tap';
  element.appendChild(blind[0]);
//  element.appendChild(tab_list[0]);

  ol.control.Control.call(this, {
    element : element,
    target : options.target
  });

  this.getControlElement = function() {
    return tab_list;
  };

  this.getTapIdx = function() {
    return tabIdx;
  };
};

ol.inherits(mapManager.TapControl, ol.control.Control);

/**
 * 태풍 마커 보기 컨트롤
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=}
 *            opt_options Control options.
 */
mapManager.DisaplayPastTyphoonMarker = function(opt_options) {
  var html = '<a href="javascript:;" class="btn_custom">' + typhoonLang.msg('typho.0009') + '</a>';
  var options = opt_options || {};
  var obj = $(html);

  var handleControl = function(e) {
    mapManager.toggleDisplayMarker(this);
  };

  // 동작
  obj.click(handleControl);

  var dontDisplayTabControl = mapManager.config.dontDisplayTabControl || false;
  var element = document.createElement('div');
  if (dontDisplayTabControl) {
    element.className = 'map_toggle_marker_2';
  } else {
    element.className = 'map_toggle_marker';
  }
  element.appendChild(obj[0]);

  ol.control.Control.call(this, {
    element : element,
    target : options.target
  });

  this.getControlElement = function() {
    return obj;
  };
};
ol.inherits(mapManager.DisaplayPastTyphoonMarker, ol.control.Control);

/**
 * 실시간 정보 보기 컨트롤
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=}
 *            opt_options Control options.
 */
mapManager.DisaplayRealTime = function(opt_options) {
  var html = '<a href="javascript:;" class="btn_custom">' + typhoonLang.msg('typho.0009') + '</a>';
  var options = opt_options || {};
  var obj = $(html);

  var handleControl = function(e) {
    mapManager.toggleDisplayRealtime(this);
  };

  // 동작
  obj.click(handleControl);

  var dontDisplayTabControl = mapManager.config.dontDisplayTabControl || false;
  var element = document.createElement('div');
  if (dontDisplayTabControl) {
    element.className = 'map_toggle_realtime_2';
  } else {
    element.className = 'map_toggle_realtime';
  }
//  element.appendChild(obj[0]);

  ol.control.Control.call(this, {
    element : element,
    target : options.target
  });

  this.getControlElement = function() {
    return obj;
  };
};
ol.inherits(mapManager.DisaplayRealTime, ol.control.Control);

/**
 * 선택한 태풍만 예보보기 컨트롤
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=}
 *            opt_options Control options.
 */
mapManager.OnlySelectedControl = function(opt_options) {

  var html = '<a href="javascript:;" class="btn_custom">' + typhoonLang.msg('typho.0009') + '</a>';
  var options = opt_options || {};
  var obj = $(html);

  var handleControl = function(e) {
    mapManager.toggleOnlySelected(this);
  };

  // 지도 도움말
  obj.click(handleControl);

  var dontDisplayTabControl = mapManager.config.dontDisplayTabControl || false;
  var element = document.createElement('div');
  if (dontDisplayTabControl) {
    element.className = 'map_toggle_rt_future_2';
  } else {
    element.className = 'map_toggle_rt_future';
  }
//  element.appendChild(obj[0]);

  ol.control.Control.call(this, {
    element : element,
    target : options.target
  });

  this.getControlElement = function() {
    return obj;
  };
};
ol.inherits(mapManager.OnlySelectedControl, ol.control.Control);

/**
 * geoserver의 주요지점 데이타 받기(geoserver 설정에 jsonp 사용여부를 true로 해야함) JSONP WFS
 * callback function.
 * 
 * @param {Object}
 *            response The response object.
 */
mapManager.loadPosFeatures = function(response) {
  var geojsonFormat = new ol.format.GeoJSON();
  var source = mapManager.layers.position.getSource();
  source.addFeatures(geojsonFormat.readFeatures(response));
};

// 기본 지도 생성
mapManager.loadMap = function(config) {

  // containers 설정
  if (typeof config !== "undefined") {
    this.config = config;
  }

  // 탭 컨트롤 등을 표시하지 않는 값이 true가 아닌 경우(undefined, false) false
  this.config.dontDisplayTabControl = this.config.dontDisplayTabControl || false;

  // 실시간 조회 금지가 true가 아닌 경우(undefined, false) false
  this.config.dontLoadRealTime = this.config.dontLoadRealTime || false;

  // 과거 태풍 사용이 금지가 true가 아닌 경우(undefined, false) false
  this.config.dontDisplayPastTyp = this.config.dontDisplayPastTyp || false;

  // 지도 좌표계 및 표출 영역 정의
  var projection = new ol.proj.Projection({
    code : 'EPSG:111111',
    extent : this.extents.base
  });

  ol.proj.addProjection(projection);

  this.projection = projection;

  // 지도 layer
  var params = this.getSourceParams(typhoonLang.currentLang === "en" ? "baseEn" : "base");

  this.layers.base = 
				/*		new ol.layer.Image({
						extent : this.extents.base,
						source : new ol.source.ImageWMS({
						  url : 'http://203.247.66.46/typhoon/typhoon/wms',
						  params : params,
						  serverType : 'geoserver'
						}) */
	
						new ol.layer.Tile({
						extent : this.extents.base,
						title: "KMA Typhoon",
						source: new ol.source.TileWMS({
								  //url: 'http://203.247.66.46/typhoon/typhoon/wms',
								  url: 'https://typgis.kma.go.kr/typhoon/typhoon/wms',
								  params: params
								})
						
						

  });

  // 주요지점 레이어
  this.layers.position = new ol.layer.Vector(
      {
        extent : this.extents.base,
        source : new ol.source.Vector(
            {
              loader : function(extent, resolution, projection) {
                // var url = 'http://203.247.66.46/typhoon/typhoon/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=typhoon:city&outputFormat=text/javascript&format_options=callback:mapManager.loadPosFeatures';
				
				var url = 'https://typgis.kma.go.kr/typhoon/typhoon/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=typhoon:city&outputFormat=text/javascript&format_options=callback:mapManager.loadPosFeatures';
				
                $.ajax({
                  url : url,
                  dataType : 'jsonp',
                  jsonp : false
                });
              }
            }),
        style : new ol.style.Style({
          image : new ol.style.Circle({
            radius : 5,
            fill : new ol.style.Fill({
              color : 'rgba(255, 255, 255, 0)'
            })
          })
        })
      });

  // 검색관련 표출을 위한 search layer
  this.layers.search = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // 과거 태풍 표출을 위한 past typhoon layer
  this.layers.past = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // 과거 태풍 지점 표출을 위한 past typhoon marker layer
  this.layers.pastMarker = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // 태풍, TD 표출을 위한 typhoon layer
  this.layers.typhoon = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // 지도 객체 생성
  this.map = new ol.Map({
    layers : [ this.layers.base /* 지도 */
    , this.layers.position /* 지점정보 */
    , this.layers.past /* 이전 태풍 라인 */
    , this.layers.pastMarker /* 이전 태풍 마커 */
    , this.layers.typhoon /* 현재 태풍 */
    , this.layers.search /* 검색 */
    ],
    target : document.getElementById(config.map),
    controls : [ new ol.control.Zoom(), new ol.control.ZoomSlider() ],
    view : new ol.View({
      projection : projection,
//      extent : ol.proj.transformExtent([113, 15, 150, 46], "EPSG:4326", "EPSG:111111") 
//      extent : ol.proj.transformExtent([70, 0, 150, 46], "EPSG:4326", "EPSG:111111") 
      extent : ol.proj.transformExtent([ -40, -40, 180, 60 ], "EPSG:4326", "EPSG:111111")
      /*
       * 적도0~북위60도
       * 경도
       * 100~180
       * [-40,
       * -40,
       * 180,
       * 60]
       */
      ,
      center : ol.extent.getCenter(projection.getExtent()),
      zoom : this.minZoom,
      maxZoom : this.maxZoom,
      minZoom : this.minZoom,
      enableRotation : false
    })
  });

  var dontDisplayTabControl = this.config.dontDisplayTabControl || false;
  if (dontDisplayTabControl === false) {
    // tap 컨트롤 추가
    var tapControl = new mapManager.TapControl();
    this.addControl(tapControl);
  }

  var dontDisplayPastTyp = this.config.dontDisplayPastTyp || false;
  if (dontDisplayPastTyp === false) {
    // 과거 태풍을 사용하는 경우에만 토글 컨트롤 추가
    var disaplayPastTyphoonMarker = new mapManager.DisaplayPastTyphoonMarker();
    this.addControl(disaplayPastTyphoonMarker);
  }

  var dontLoadRealTime = this.config.dontLoadRealTime || false;
  if (dontLoadRealTime === false) {
    // 실시간 태풍정보를 사용하는 경우에만 토글 컨트롤 추가
    var disaplayRealTime = new mapManager.DisaplayRealTime();
    this.addControl(disaplayRealTime);
  }

  var dontLoadRealTime = this.config.dontLoadRealTime || false;
  if (dontLoadRealTime === false) {
    // 실시간 태풍을 가져온 경우에만 토글 컨트롤 추가
    var onlySelectedControl = new mapManager.OnlySelectedControl();
    this.addControl(onlySelectedControl);
  }

  // contents 표출 위해 컨텐츠 매니져 생성 및 실행
  this.manager.current = new ContentManager(this, dontLoadRealTime);

  // 과거 태풍 표출 위한 매니져 생성 및 실행
  this.manager.pastTyp = new PastTyphoonManager(this);

  // contents 표출 위해 컨텐츠 매니져 생성 및 실행
  this.manager.search = new SearchManager(this);

  // 이벤트 추가
  this.addEventPopup(); // 지도 위의 feature 에 마우스 오버시 액션 추가 (태풍, 과거 등 연결)
  this.addEventClickItem(); // 지도위에서 클릭 이벤트
  this.addEventZoom(); // 지도위에서 zoom in/out 시에 태풍아이콘 사이즈 조정
};

mapManager.getCurrentTapIdx = function() {
  return mapManager.controls.tapControl.getTapIdx();
};

mapManager.getSourceParams = function(arg) {
  var param = {};

  if (typeof this.sourceParams[arg] !== "undefined") {
    for ( var p in this.sourceParams[arg]) {
      param[p] = this.sourceParams[arg][p];
    }
  }
  return param;
};

// 최근접예상 표출
mapManager.toggleNearlest = function(toggle) {
  this.manager.current.removeNearlest();
  if (toggle === true) {
    this.manager.current.addNearlest();
  }
  // 지점선택 레이어 안보이게 하기
  this.layers.position.setVisible(toggle);
};

// 지도 위의 feature 에 마우스 오버시 액션 추가
mapManager.addEventPopup = function() {
  var vm = this;
  var map = this.map;

  var contentManager = vm.manager.current;
  var pastTyphoonManager = vm.manager.pastTyp;
  var searchManager = vm.manager.search;
  var managers = [ contentManager, pastTyphoonManager ]; // 태풍정보 표출 용

  var positionLayer = vm.layers.position;
  var pastLayer = vm.layers.past;
  var pastMarkerLayer = vm.layers.pastMarker;
  var typhoonLayer = vm.layers.typhoon;
  var searchLayer = vm.layers.search;

  var popupId = vm.config.popup;
  var popup = vm.popup;

  // 지도 위의 feature 에 마우스 오버시 액션 추가
  map.on('pointermove', function(evt) {
    if (evt.dragging) {
      return;
    }

    // 클릭 후, 이벤트 발생하는 부분이 있어서 클릭 후 발생하는 최초의 이벤트는 무시.
    if (mapManager.clicked) {
      mapManager.clicked = false;
      return;
    }

    var workers = [];
    map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
      var worker;
//      if (vm.config.enableSearch) {
        if (layer === searchLayer) {
          worker = {
            manager : searchManager,
            type : "search",
            feature : feature,
            layer : layer
          };
          workers.push(worker);
        }
//      } else {
        if (layer === typhoonLayer) {
          worker = {
            manager : contentManager,
            type : "content",
            feature : feature = contentManager.featureOverlay(evt),
            layer : layer
          };
          workers.push(worker);
        } else if (layer === pastMarkerLayer) {
          worker = {
            manager : pastTyphoonManager,
            type : "pastMarker",
            feature : feature,
            layer : layer
          };
          workers.push(worker);
        } else if (layer === pastLayer) {
          worker = {
            manager : pastTyphoonManager,
            type : "pastLine",
            feature : feature,
            layer : layer
          };
          workers.push(worker);
        } else {
          feature = undefined;
        }
//      }
    });

    var worker;
    if (workers.length === 0) {
      worker = undefined;
    } else if (workers.length === 1) {
      worker = workers[0];
    } else {
      var w1, w2, w3, w4;
      for ( var i = 0; i < workers.length; i++) {
        // 현재 태풍 우선 > 태풍 마커 우선 > 태풍 라인 우선 > 기타
        var w = workers[i];
        if (w.type === "content") {
          w1 = w;
        } else if (w.type === "pastMarker") {
          w2 = w;
        } else if (w.type === "pastLine") {
          w3 = w;
        } else {
          w4 = w;
        }
      }
      worker = w1 || w2 || w3 || w4 || undefined;
    }

    if (objectUtils.isUndefined(worker)) {
      vm.togglePopup(evt, undefined);
    } else {
      vm.togglePopup(evt, worker.feature);
    }
  });
};

mapManager.clicked = false;

// popup on, off
mapManager.togglePopup = function(evt, feature) {
  var vm = this;
  var popupId = vm.config.popup;
  var popup = vm.popup;
  var map = vm.map;

  var html;
  if (objectUtils.isUndefined(feature) === false) {
    html = feature.html || feature.get('html');
  }

  // popup 이 없으면 생성한다.
  if (objectUtils.isUndefined(popup)) {
    // popup = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    // autoPan: true,
    // autoPanAnimation: {
    // duration: 250
    // }
    // }));

    popup = new ol.Overlay({
      // positioning : 'center-center',
      stopEvent : false
    });
    mapManager.popup = popup;
  }

  // feature, html 값이 없으면 팝업을 제거한다.
  if (objectUtils.isUndefined(feature, html)) {
    // 팝업 제거.
    try {
      map.removeOverlay(popup);
      popup.setPosition(undefined);
    } catch (e) {
      // 예외처리 무시.
    }
    // popup.setPosition([-100, -100]);
  } else {
    map.addOverlay(popup);

    // popup
    var title = html.title;
    var contents = html.contents;
    var className = html.className;

    // 반영.
    var popupObj = $("#" + popupId);
    popupObj.find("div.date").html(title);
    popupObj.find("ul").html(contents);

    // 표시 위치 체크
    var mapWidth = map.getSize()[0];
    var mapHeight = map.getSize()[1];

    var pointX = evt.pixel[0];
    var pointY = evt.pixel[1];

    var checkX1 = mapWidth - (mapWidth / 3);
    var checkY1 = mapHeight / 3;

    var type1 = 'bottom';
    var type2 = 'left';
    if (checkX1 < pointX) {
      type2 = 'right';
    }
    if (checkY1 > pointY) {
      type1 = 'top';
    }

    var positioning = type1 + '-' + type2;
    popup.setPositioning(positioning);

    // 기존 bottom css 제거를 위해서 설정.
    popupObj.css("bottom", '0px');

    // // 화살표 표시를 요구할 경우, 작업에 사용되는 부분.
    // var cssLeft = (mapWidth - 10) + 'px';
    // var top = "0px";
    // var bottom = "-10px";
    // var left = "10px";
    // var right = "0px";
    // if (type1 === 'bottom') {
    // bottom = "10px";
    // } else {
    // // top = "10px";
    // }
    // if (type2 === 'left') {
    // left = '-10px';
    // cssLeft = '0px';
    // } else {
    // // right = '10px';
    // }
    // // popupObj.css("top", top);
    // popupObj.css("bottom", bottom);
    // popupObj.css("left", left);
    // // popupObj.css("right", right);

    popupObj.removeClass("typhoon_g typhoon_p");
    popupObj.addClass("typhoon_" + className);
    popupObj.find("span.arrow > img").attr("src",
        (window.appBase ? window.appBase : '') + "/resources/image/typoon/typ_new/bg_arrow_map_" + className + ".png");

    popup.setElement(document.getElementById(popupId));
    popup.setPosition(evt.coordinate);
  }
};

mapManager.setMarker = function(key, coordinates) {
  var marker = this.marker;
  var markerId = this.config.marker;
  var map = this.map;

  if (typeof marker !== "undefined") {
    $("#" + markerId).attr("title", key);
    marker.setElement(document.getElementById(markerId));
    marker.setPosition(coordinates);
  } else {
    $("#" + markerId).attr("title", key);
    mapManager.marker = new ol.Overlay({
      position : coordinates,
      positioning : 'center-center',
      element : document.getElementById(markerId),
      stopEvent : false
    });
    map.addOverlay(mapManager.marker);
  }
};

// 태풍 또는 TD 클릭시, 선택되는 효과
mapManager.addEventClickItem = function() {
  var vm = this;
  var map = vm.map;

  var contentManager = vm.manager.current;
  var pastTyphoonManager = vm.manager.pastTyp;
  var searchManager = vm.manager.search;

  var positionLayer = vm.layers.position;
  var pastLayer = vm.layers.past;
  var pastMarkerLayer = vm.layers.pastMarker;
  var typhoonLayer = vm.layers.typhoon;
  var searchLayer = vm.layers.search;

  map.on('singleclick', function(evt) {
    marker = mapManager.marker;

    // 검색 모드인 경우, 격자를 그리는 행위만 한다.
    var message;
    var feature;
    if (vm.config.enableSearch) {
      // 검색 격자 그리기.
      message = "call searchManager.toggleSimilarTyphoonFindOption()";
      searchManager.toggleSimilarTyphoonFindOption(evt.coordinate);
      feature = {};
    } else {
      // 마커 찾기. (레이어가 많아서 레이어에 대한 동작은 내부에서 한다.)
      feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        // 검색 모드가 아닌 경우에 동작.
        if (vm.config.enableSearch === false) {
          var manager;
          if (layer === positionLayer) {
            message = "map.forEachFeatureAtPixel() = positionLayer.";
          } else if (layer === typhoonLayer) {
            message = "map.forEachFeatureAtPixel() = typhoonLayer.";
            manager = contentManager;
          } else if (layer === pastLayer || layer === pastMarkerLayer) {
            message = "map.forEachFeatureAtPixel() = pastLayer or pastMarkerLayer.";
            manager = pastTyphoonManager;
          } else if (layer === searchLayer) {
            message = "map.forEachFeatureAtPixel() = searchLayer. (return)";
          } else {
            message = "map.forEachFeatureAtPixel() = otherLayer. (return)";
          }

          // manager가 없거나 클릭 이벤트가 없으면 리턴
          if (objectUtils.isUndefined(manager) || objectUtils.isUndefined(manager.featureClick)) {
            return feature;
          }
          manager.featureClick(feature);
        }
        return feature;
      });
    }

    if (vm.LOGGING) {
    }

    // 검색된 feature 가 없으면 리턴.
    if (objectUtils.isUndefined(feature)) {
      return;
    }

    // click 이벤트인 경우 popup 이 있으면 종료한다.
    mapManager.togglePopup(null, null);
    mapManager.clicked = true;
  });
};

mapManager.getZoomLvlSuffix = function() {

  var zoom = this.map.getView().getZoom();
  var maxZoom = this.maxZoom;
  var minZoom = this.minZoom;
  var suffix = "";

  if (zoom > minZoom) {

    var delta = zoom - minZoom;

    delta = delta > maxZoom ? maxZoom : delta;

    suffix = "]z" + (zoom - minZoom);
  }

  return suffix;
};

// 컨텐츠 선택 이벤트
mapManager.addEventZoom = function() {

  var contentManager = this.manager.current;

  this.map.getView().on('propertychange', function(e) {
    switch (e.key) {
    
    case 'resolution':

      if (e.oldValue === this.get('resolution') || typeof this.getZoom() === "undefined") {
        return false;
      }
      // 0.5, 0.6, 0.7, 0.8, 1
      var suf = mapManager.getZoomLvlSuffix();
      var maxZoom = this.maxZoom;
      // 현재 모든 아이템 새로 그리기
      contentManager.refreshIcons(suf);

      break;
    }
  });
};
/**
 * [현재 진행중인 태풍 또는 열대저압부가 없습니다.]메세지 컨트롤
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=}
 *            opt_options Control options.
 */
mapManager.NoItemMsgControl = function(opt_options) {

  var html = '<p>' + opt_options.html + '</p>';
  var options = opt_options || {};
  var obj = $(html);

  var element = document.createElement('div');
  element.className = 'map_notice';
  element.appendChild(obj[0]);

  ol.control.Control.call(this, {
    element : element,
    target : options.target
  });
};
ol.inherits(mapManager.NoItemMsgControl, ol.control.Control);

/**
 * 로딩바 컨트롤
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=}
 *            opt_options Control options.
 */
mapManager.LoadingBarControl = function(opt_options) {

  if (objectUtils.isUndefined(mapManager.config.selectbox) == false) {
    $("#" + mapManager.config.selectbox).prop('disabled', true);
  }
  var html = '<p><img src="' + (window.appBase ? window.appBase : '') +  + '/resources/image/typoon/typ_new/loading_bar.gif" width="339px" height="26px" alt="로딩바" /></p>';
  var options = opt_options || {};
  var obj = $(html);

  var element = document.createElement('div');
  element.className = 'map_notice';
  element.appendChild(obj[0]);

  ol.control.Control.call(this, {
    element : element,
    target : options.target
  });
};
ol.inherits(mapManager.LoadingBarControl, ol.control.Control);

/**
 * [현재 진행중인 태풍 또는 열대저압부가 없습니다.] 지도위에 메세지 표시
 */
mapManager.addNoItemMsgControl = function() {
//  var control = new mapManager.NoItemMsgControl({
//    html : typhoonLang.msg('typho.0017')
//  });
//  this.addControl(control);
//
//  var view = mapManager.map.getView();
//  view.setCenter(ol.proj.transform([ 125.5, 38.5 ], "EPSG:4326", "EPSG:111111"));
};

mapManager.toggleDisplayMarker = function(obj) {
  if (this.manager.pastTyp.toggleDisplayMarker() == true) {
    $(obj).html(typhoonLang.msg('typho.n.0004'));
    $(obj).toggleClass('allTyp');
  } else {
    $(obj).html(typhoonLang.msg('typho.n.0003'));
    $(obj).toggleClass('allTyp');
  }
};

mapManager.toggleDisplayRealtime = function(obj) {
  if (this.manager.current.toggleDisplayRealtime() == true) {
    $(obj).html(typhoonLang.msg('typho.n.0004'));
    $(obj).toggleClass('allTyp');
  } else {
    $(obj).html(typhoonLang.msg('typho.n.0003'));
    $(obj).toggleClass('allTyp');
  }
};

mapManager.toggleOnlySelected = function(obj) {

  if (this.manager.current.toggleOnlySelected() == true) {
    $(obj).html(typhoonLang.msg('typho.0019'));
    $(obj).toggleClass('allTyp');
  } else {
    $(obj).html(typhoonLang.msg('typho.0018'));
    $(obj).toggleClass('allTyp');
  }
};

// 현재 선택된 selectbox 아이템의 키값 조회
mapManager.getSelectedKey = function() {
  if (objectUtils.isUndefined(mapManager.config.selectbox) == false) {
    return $("#" + this.config.selectbox + " option:selected").val();
  }
  return -1;
};
