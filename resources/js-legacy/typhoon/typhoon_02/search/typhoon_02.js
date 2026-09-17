//�������� ����
proj4.defs('EPSG:111111',
    '+proj=lcc +lat_1=28 +lat_0=28 +lon_0=128.2 +k_0=1.0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');

// ���� �Ŵ���
var mapManager = {
  config : {
    map : 'map',
    marker : 'marker',
    popup : 'popup',
    selectbox : 'selectItems',
    graph : 'graph',
    detail : 'detail',
    cbTyphoonClick : undefined,/* �ǽð� ��ǳ Ŭ�� ��, ������ �ϱ� ���� �Լ� ���. */
    cbPastTyphoonClick : undefined,/* ��ǳ Ŭ�� ��, ������ �ϱ� ���� �Լ� ���. */
    cbToggleSearchMode : undefined,/* ��� ���濡 ���� �ݹ� */
    enableSearch : false,/* �˻� ��� ����. */
    dontDisplayTabControl : false,/* �� ��Ʈ�� ���� ǥ������ �ʱ� ���� ��ü �⺻�� false. */
    dontLoadRealTime : false,/* �ǽð� ��ȸ ������ �������� ���� ��� false */
    dontDisplayPastTyp : false,/* ���� ��ǳ ����� ������ ��� false */
    pastTypDisplayLikeRealTime : false
  /* ���� ��ǳ�� �ǽð��� ������ ��ǳ ǥ�� ���� TODO : �����ʿ� */
  },
  controls : {
    noItemMsgControl : undefined /* ��ǳ �Ǵ� TD�� ���� ���, �޼��� ǥ�� ��Ʈ�� */
    ,
    tapControl : undefined /* �� ��Ʈ�� */
    ,
    playControl : undefined /* �������� �ǿ��� �÷��� ��Ʈ�� */
    ,
    onlySelectedControl : undefined /* ������ ��ǳ�� �������� ���� | ��� ��ǳ �������� ���� ��Ʈ�� */
    ,
    nowViewControl : undefined /* �������� �ǿ��� ������ �ð� ǥ�� ��Ʈ�� */
    ,
    loadingBarControl : undefined /* loading bar */
    ,
    disaplayPastTyphoonMarker : undefined /* ��ǳ ��ǥ���� ��Ŀ ǥ�� */
    ,
    disaplayRealTime : undefined
  /* �ǽð� ��ǥ���� ǥ�� */
  },
  manager : {
    current : undefined /* ���� �������� TD, TYP ���� ���� */
    ,
    pastTyp : undefined /* ���� ��ǳ ���� ���� */
    ,
    search : undefined
  /* �˻� ���� ���� */
  },
  map : undefined /* ���� ��ü */
  ,
  projection : undefined,
  layers : {
    base : undefined /* ���� layer */
    ,
    position : undefined /* ���� layer */
    ,
    past : undefined /* ���� ��ǳ layer */
    ,
    pastMarker : undefined /* ���� ��ǳ �������� layer */
    ,
    typhoon : undefined /* ��ǳ layer */
    ,
    search : undefined
  /* �˻� layer */
  },
  imageSources : [] /* õ���� �����̹��� �ҽ� */
  ,
  extents : {
//    base : ol.proj.transformExtent([ 113, 15, 150, 46 ], "EPSG:4326", "EPSG:111111")
    base : ol.proj.transformExtent([ -40, -40, 180, 60 ], "EPSG:4326", "EPSG:111111")
  /* ����0~����60�� �浵 100~180 [100, 0, 180, 60] */
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
/* �׽�Ʈ ���� */
};

// �˻� ���� ��ü ��ȯ
mapManager.getSearchManager = function() {
  var vm = this;
  return vm.manager.search;
};

// ������ǳ ���� ��ü ��ȯ
mapManager.getPastTyphoonManager = function() {
  var vm = this;
  return vm.manager.pastTyp;
};

// �������� �߰�
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

// �������� �߰�
mapManager.removeOverlay = function(id) {

  for ( var i in this.overlays) {
    var o = this.overlays[i];
    if (o.id == id) {
      this.map.removeOverlay(o.overlay);
      $("#" + o.id).remove();
      this.overlays.splice(i, 1);
      break;
    }
  }
};

// �˻����� ���� ó��.
mapManager.toggleSearchMode = function(toggle) {
  if (objectUtils.isUndefined(toggle)) {
    toggle = !mapManager.config.enableSearch || false;
  }
  mapManager.config.enableSearch = toggle;

  var active;
  var inactives = [];
  if (toggle) {
    // true : 0 �� active
    active = "map_tab_search";
    inactives = [ "map_tab_select" ];
  } else {
    // false : 1 �� active
    active = "map_tab_select";
    inactives = [ "map_tab_search" ];
  }

  // ��� ��Ȱ��ȭ
  for ( var i = 0; i < inactives.length; i++) {
    var inactive = inactives[i];
    $("#" + inactive).parent('li').removeClass('active');
  }

  // ��� Ȱ��ȭ
  $("#" + active).parent('li').addClass('active');

  if (objectUtils.isUndefined(mapManager.config.cbToggleSearchMode)) {
    return;
  }
  mapManager.config.cbToggleSearchMode(toggle);
};


//�˻����� ���� ó��.
mapManager.toggleSearchMode2 = function(toggle) {
//if (objectUtils.isUndefined(toggle)) {
// toggle = !mapManager.config.enableSearch || false;
//}
mapManager.config.enableSearch = toggle;

};


// control �߰� �Լ�
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

// �߽� ��ġ ����
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

// control ���� �Լ�
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
      $("#" + mapManager.config.selectbox).prop('disabled', false); // �ε��ٰ� �ִ�
      // ��� ���۸��ϰ�
      // �� �� Ǯ��
    }
  }

  this.map.removeControl(control);

};

function toggleChange(toggleSearch){
	mapManager.toggleSearchMode2(toggleSearch);
}
/**
 * �� ��Ʈ�� (�˻����, ��ȸ���)
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

    var t = $(this).parent('li'); /* ���� ���õ� tap li */
    var tList = tab_list_i;
    var idx = tList.index(t);

    // tList.removeClass('active');
    // t.addClass('active');
    // tabIdx = idx;

    var toggleSearch = false;
//    switch (idx) {
//    case TAP_SEARCH_MODE:
//      /* �˻��� �ϱ� ���� ���� ���� */
//      toggleSearch = true;
//      break;
//    case TAP_SELECT_MODE:
//      /* ��ǳ�� ��ȸ �ϱ� ���� ���� ���� */
//      toggleSearch = false;
//      break;
//    }
//    mapManager.toggleSearchMode(toggleSearch);
    return false;
  };


  // ���� ����
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
 * ��ǳ ��Ŀ ���� ��Ʈ��
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

  // ����
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
 * �ǽð� ���� ���� ��Ʈ��
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

  // ����
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
 * ������ ��ǳ�� �������� ��Ʈ��
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

  // ���� ����
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
 * geoserver�� �ֿ����� ����Ÿ �ޱ�(geoserver ������ jsonp ��뿩�θ� true�� �ؾ���) JSONP WFS
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

// �⺻ ���� ����
mapManager.loadMap = function(config) {

  // containers ����
  if (typeof config !== "undefined") {
    this.config = config;
  }

  // �� ��Ʈ�� ���� ǥ������ �ʴ� ���� true�� �ƴ� ���(undefined, false) false
  this.config.dontDisplayTabControl = this.config.dontDisplayTabControl || false;

  // �ǽð� ��ȸ ������ true�� �ƴ� ���(undefined, false) false
  this.config.dontLoadRealTime = this.config.dontLoadRealTime || false;

  // ���� ��ǳ ����� ������ true�� �ƴ� ���(undefined, false) false
  this.config.dontDisplayPastTyp = this.config.dontDisplayPastTyp || false;

  // ���� ��ǥ�� �� ǥ�� ���� ����
  var projection = new ol.proj.Projection({
    code : 'EPSG:111111',
    extent : this.extents.base
  });

  ol.proj.addProjection(projection);

  this.projection = projection;

  // ���� layer
  var params = this.getSourceParams(typhoonLang.currentLang === "en" ? "baseEn" : "base");

  this.layers.base = new ol.layer.Image({
    extent : this.extents.base,
    source : new ol.source.ImageWMS({
      url : 'http://203.247.66.46/typhoon/typhoon/wms',
      params : params,
      serverType : 'geoserver'
    })
  });

  // �ֿ����� ���̾�
  this.layers.position = new ol.layer.Vector(
      {
        extent : this.extents.base,
        source : new ol.source.Vector(
            {
              loader : function(extent, resolution, projection) {
                var url = 'http://203.247.66.46/typhoon/typhoon/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=typhoon:city&outputFormat=text/javascript&format_options=callback:mapManager.loadPosFeatures';
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
              color : 'rgba(255, 255, 255, 0.1)'
            })
          })
        })
      });

  // �˻����� ǥ���� ���� search layer
  this.layers.search = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // ���� ��ǳ ǥ���� ���� past typhoon layer
  this.layers.past = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // ���� ��ǳ ���� ǥ���� ���� past typhoon marker layer
  this.layers.pastMarker = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // ��ǳ, TD ǥ���� ���� typhoon layer
  this.layers.typhoon = new ol.layer.Vector({
    source : new ol.source.Vector({
      features : []
    })
  });

  // ���� ��ü ����
  this.map = new ol.Map({
    layers : [ this.layers.base /* ���� */
    , this.layers.position /* �������� */
    , this.layers.past /* ���� ��ǳ ���� */
    , this.layers.pastMarker /* ���� ��ǳ ��Ŀ */
    , this.layers.typhoon /* ���� ��ǳ */
    , this.layers.search /* �˻� */
    ],
    target : document.getElementById(config.map),
    controls : [ new ol.control.Zoom(), new ol.control.ZoomSlider() ],
    view : new ol.View({
      projection : projection,
//      extent : ol.proj.transformExtent([113, 15, 150, 46], "EPSG:4326", "EPSG:111111") 
//      extent : ol.proj.transformExtent([70, 0, 150, 46], "EPSG:4326", "EPSG:111111") 
      extent : ol.proj.transformExtent([ -40, -40, 180, 60 ], "EPSG:4326", "EPSG:111111")
      /*
       * ����0~����60��
       * �浵
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
    // tap ��Ʈ�� �߰�
    var tapControl = new mapManager.TapControl();
    this.addControl(tapControl);
  }

  var dontDisplayPastTyp = this.config.dontDisplayPastTyp || false;
  if (dontDisplayPastTyp === false) {
    // ���� ��ǳ�� ����ϴ� ��쿡�� ��� ��Ʈ�� �߰�
    var disaplayPastTyphoonMarker = new mapManager.DisaplayPastTyphoonMarker();
    this.addControl(disaplayPastTyphoonMarker);
  }

  var dontLoadRealTime = this.config.dontLoadRealTime || false;
  if (dontLoadRealTime === false) {
    // �ǽð� ��ǳ������ ����ϴ� ��쿡�� ��� ��Ʈ�� �߰�
    var disaplayRealTime = new mapManager.DisaplayRealTime();
    this.addControl(disaplayRealTime);
  }

  var dontLoadRealTime = this.config.dontLoadRealTime || false;
  if (dontLoadRealTime === false) {
    // �ǽð� ��ǳ�� ������ ��쿡�� ��� ��Ʈ�� �߰�
    var onlySelectedControl = new mapManager.OnlySelectedControl();
    this.addControl(onlySelectedControl);
  }

  // contents ǥ�� ���� ������ �Ŵ��� ���� �� ����
  this.manager.current = new ContentManager(this, dontLoadRealTime);

  // ���� ��ǳ ǥ�� ���� �Ŵ��� ���� �� ����
  this.manager.pastTyp = new PastTyphoonManager(this);

  // contents ǥ�� ���� ������ �Ŵ��� ���� �� ����
  this.manager.search = new SearchManager(this);

  // �̺�Ʈ �߰�
  this.addEventPopup(); // ���� ���� feature �� ���콺 ������ �׼� �߰� (��ǳ, ���� �� ����)
  this.addEventClickItem(); // ���������� Ŭ�� �̺�Ʈ
  this.addEventZoom(); // ���������� zoom in/out �ÿ� ��ǳ������ ������ ����
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

// �ֱ������� ǥ��
mapManager.toggleNearlest = function(toggle) {
  this.manager.current.removeNearlest();
  if (toggle === true) {
    this.manager.current.addNearlest();
  }
  // �������� ���̾� �Ⱥ��̰� �ϱ�
  this.layers.position.setVisible(toggle);
};

// ���� ���� feature �� ���콺 ������ �׼� �߰�
mapManager.addEventPopup = function() {
  var vm = this;
  var map = this.map;

  var contentManager = vm.manager.current;
  var pastTyphoonManager = vm.manager.pastTyp;
  var searchManager = vm.manager.search;
  var managers = [ contentManager, pastTyphoonManager ]; // ��ǳ���� ǥ�� ��

  var positionLayer = vm.layers.position;
  var pastLayer = vm.layers.past;
  var pastMarkerLayer = vm.layers.pastMarker;
  var typhoonLayer = vm.layers.typhoon;
  var searchLayer = vm.layers.search;

  var popupId = vm.config.popup;
  var popup = vm.popup;

  // ���� ���� feature �� ���콺 ������ �׼� �߰�
  map.on('pointermove', function(evt) {
    if (evt.dragging) {
      return;
    }

    // Ŭ�� ��, �̺�Ʈ �߻��ϴ� �κ��� �־ Ŭ�� �� �߻��ϴ� ������ �̺�Ʈ�� ����.
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
        // ���� ��ǳ �켱 > ��ǳ ��Ŀ �켱 > ��ǳ ���� �켱 > ��Ÿ
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

  // popup �� ������ �����Ѵ�.
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

  // feature, html ���� ������ �˾��� �����Ѵ�.
  if (objectUtils.isUndefined(feature, html)) {
    // �˾� ����.
    try {
      map.removeOverlay(popup);
      popup.setPosition(undefined);
    } catch (e) {
      // ����ó�� ����.
    }
    // popup.setPosition([-100, -100]);
  } else {
    map.addOverlay(popup);

    // popup
    var title = html.title;
    var contents = html.contents;
    var className = html.className;

    // �ݿ�.
    var popupObj = $("#" + popupId);
    popupObj.find("div.date").html(title);
    popupObj.find("ul").html(contents);

    // ǥ�� ��ġ üũ
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

    // ���� bottom css ���Ÿ� ���ؼ� ����.
    popupObj.css("bottom", '0px');

    // // ȭ��ǥ ǥ�ø� �䱸�� ���, �۾��� ���Ǵ� �κ�.
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
        "../../resources/image/typoon/typ_new/bg_arrow_map_" + className + ".png");

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

// ��ǳ �Ǵ� TD Ŭ����, ���õǴ� ȿ��
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

    // �˻� ����� ���, ���ڸ� �׸��� ������ �Ѵ�.
    var message;
    var feature;
    if (vm.config.enableSearch) {
      // �˻� ���� �׸���.
      message = "call searchManager.toggleSimilarTyphoonFindOption()";
      searchManager.toggleSimilarTyphoonFindOption(evt.coordinate);
      feature = {};
    } else {
      // ��Ŀ ã��. (���̾ ���Ƽ� ���̾ ���� ������ ���ο��� �Ѵ�.)
      feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        // �˻� ��尡 �ƴ� ��쿡 ����.
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

          // manager�� ���ų� Ŭ�� �̺�Ʈ�� ������ ����
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

    // �˻��� feature �� ������ ����.
    if (objectUtils.isUndefined(feature)) {
      return;
    }

    // click �̺�Ʈ�� ��� popup �� ������ �����Ѵ�.
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

// ������ ���� �̺�Ʈ
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
      // ���� ��� ������ ���� �׸���
      contentManager.refreshIcons(suf);

      break;
    }
  });
};
/**
 * [���� �������� ��ǳ �Ǵ� �������кΰ� �����ϴ�.]�޼��� ��Ʈ��
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
 * �ε��� ��Ʈ��
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
  var html = '<p><img src="../../resources/image/typoon/typ_new/loading_bar.gif" width="339px" height="26px" alt="�ε���" /></p>';
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
 * [���� �������� ��ǳ �Ǵ� �������кΰ� �����ϴ�.] �������� �޼��� ǥ��
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

// ���� ���õ� selectbox �������� Ű�� ��ȸ
mapManager.getSelectedKey = function() {
  if (objectUtils.isUndefined(mapManager.config.selectbox) == false) {
    return $("#" + this.config.selectbox + " option:selected").val();
  }
  return -1;
};
