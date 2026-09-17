var mapInfo = {};
mapInfo["sea.size"] = [1026, 1295];
mapInfo["radar.extent"] = [-440000.00000000227, 3797382.7212162036, 584000.0000000008, 4821382.721216239];
mapInfo["radar.KWK.extent"] = [-160636.0103746615, 4263210.540685614, 327029.62410584925, 4750980.012349074];
mapInfo["radar.BRI.extent"] = [-360775.03837598284, 4320677.955150365, 126271.30477535143, 4807828.553894983];
mapInfo["radar.GDK.extent"] = [-121022.04854222176, 4337080.468358914, 365857.1667605103, 4824064.0780817885];
mapInfo["radar.GNG.extent"] = [-26882.0302688606, 4278516.404171162, 518525.77493711264, 4824070.437671047];
mapInfo["radar.KSN.extent"] = [-175535.50696926066, 4106828.814583127, 313926.4566592545, 4596393.942425296];
mapInfo["radar.JNI.extent"] = [-216603.91523292952, 3937643.6186477058, 275106.3137062411, 4429457.059676524];
mapInfo["radar.MYN.extent"] = [-10054.183799606633, 4100269.0412214943, 537540.035917783, 4648008.178509874];
mapInfo["radar.PSN.extent"] = [23102.426826288185, 4013770.753286655, 513497.85102194763, 4504269.204673738];
mapInfo["radar.GSN.extent"] = [-231828.50927692873, 3807790.4443043764, 261805.77029612777, 4301528.488524524];
mapInfo["radar.SSP.extent"] = [-165929.3419167011, 3818484.032860554, 327517.9426605287, 4312035.016563437];
mapInfo["radar.IIA.extent"] = [-360775.03837598284, 4320677.955150365, 126271.30477535143, 4807828.553894983]; // 인천공항지점 레이더 영상 바운더리를 실제 값으로 수정해야함.
mapInfo["rsl.extent"] = [-800000.0, 3567382.7212162605, 800000.0, 5167382.72121626];
mapInfo["dfs.extent"] = [-212499.99, 3889882.735848515, 532499.99, 5154882.708534916];
mapInfo["vis.extent"] = [-388728.4, 3951892.87, 514271.6, 5123392.89];
mapInfo["vis.resolution"] = 1500;
mapInfo["ea.extent"] = [-2999750, 1967632.72, 2999750, 7167132.72];
mapInfo["EPSG:980201"] = "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";
mapInfo["resolutions"] = [176389.24166737226,
        88194.620833686131,
        44097.310416843065,
        22577.822933423649,
        11288.911466711825,
        5644.4557333559123,
        2822.2278666779562,
        1411.1139333389781,
        705.55696666948904,
        352.77848333474452,
        176.38924166737226,
        88.19462083368613,
        44.097310416843065,
        22.577822933423647,
        11.288911466711824,
        5.6444557333559118,
        2.8222278666779559,
        1.411113933338978];
mapInfo["klfs.extent"] = [-584831.24, 3864434.118, 585168.76, 5274434.118];
mapInfo["klfs.resolution"] = 5000;
mapInfo["sea.extent"] = [-464500, 3934882.721216, 561500, 5230882.721216];
mapInfo["klfs.size"] = [234, 282];
mapInfo["dfs.size"] = [149, 253];
mapInfo["dfs.resolution"] = 5000;
mapInfo["sea.resolution"] = 1000;
mapInfo["vis.size"] = [602, 781];
mapInfo["frc.extent"] = [-149663.91942769353, 3976154.258850906, 526764.9961504241, 4657411.78497887];
mapInfo["rww.extent"] = [-723506.3380546783, 3163709.5093715442, 1441484.989496232, 5519299.0496278275];
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 *
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([root, 'ol'], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(root, require('ol'));
  } else {
    // window
    root.kmap = factory(root, root.ol);
  }
})(this, function (_this, ol) {
  var PROJ = 'EPSG:980201';
  var APP_URL = _this.APP_URL ? _this.APP_URL : 'https://www.weather.go.kr/wgis-nuri';
  var GEOSERVER_URL = _this.GEOSERVER_URL ? _this.GEOSERVER_URL : 'https://www.weather.go.kr/wgis-geos';
  var DFS_GRID_WIDTH = 149;
  var DFS_GRID_HEIGHT = 253;
  var _mapLayers = [{
    maptype: "IMG",
    title: "거리지도",
    visible: true,
    layer: "New_baroemap",
    zIndex: 10,
    type: "WMTS",
    default: true,
    group: "BaseMap"
  }, {
    maptype: "IMG",
    title: "거리지도",
    visible: false,
    layer: "New_baroemap_en",
    zIndex: 10,
    type: "WMTS",
    default: true,
    group: "BaseMap"
  }, {
    maptype: "IMG",
    title: "위성영상",
    visible: true,
    layer: "arirang_group",
    zIndex: 10,
    type: "WMTS",
    default: true,
    group: "BaseMap"
  }, // {maptype: "IMG", title: "Blue Marble", visible: false, layer: "New_baroemap", zIndex: 10, type: "WMS" },
  {
    maptype: "IMG",
    title: "음영기복도",
    visible: false,
    layer: "ASTGTMV003_DEM_HillShade",
    zIndex: 20,
    type: "WMTS"
  }, {
    maptype: "IMG",
    title: "세계 음영기복도",
    visible: false,
    layer: "gtopo30_sel_area_hillshade",
    zIndex: 25,
    type: "WMTS"
  }, {
    maptype: "IMG",
    title: "백지도",
    visible: false,
    layer: "WhiteMap",
    zIndex: 1000,
    type: "WMTS",
    default: true,
    group: "BaseMap"
  }, {
    maptype: "IMG",
    title: "백지도",
    visible: false,
    layer: "WhiteMap_en",
    zIndex: 1000,
    type: "WMTS",
    default: true,
    group: "BaseMap"
  }, {
    maptype: "IMG",
    title: "해심",
    visible: false,
    layer: "sealevel",
    zIndex: 1,
    type: "WMS"
  }, {
    maptype: "IMG",
    title: "해구격자",
    visible: false,
    layer: "sea_grid_lcc",
    zIndex: 990,
    type: "WMTS"
  }, {
    maptype: "IMG",
    title: "위경도격자",
    visible: false,
    layer: "grid10deg_lcc",
    zIndex: 990,
    type: "WMTS"
  }, {
    maptype: "IMG",
    title: "예보구역",
    visible: false,
    layer: "forecast_area",
    zIndex: 990,
    type: "WMS"
  }, // TODO: 운영에 레이어 없음
  {
    maptype: "IMG",
    title: "해상특보구역",
    visible: false,
    layer: "fcst_warn_lcc",
    zIndex: 990,
    type: "WMTS"
  }, {
    maptype: "IMG",
    title: "특정관리해역",
    visible: false,
    layer: "shp_wrn2_poly",
    zIndex: 990,
    type: "WMS"
  }, {
    maptype: "POI",
    title: "CCTV",
    visible: false,
    layer: "cctv",
    zIndex: 1001,
    type: "WFS",
    default: false
  }, {
    maptype: "POI",
    title: "지상 관측",
    visible: false,
    layer: "sfc",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "공항 관측",
    visible: false,
    layer: "air",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "고층 관측",
    visible: false,
    layer: "upp",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "부이 관측",
    visible: false,
    layer: "buoy",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "등표 관측",
    visible: false,
    layer: "lhaws",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "파고부이 관측",
    visible: false,
    layer: "seaBuoy",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "낙뢰 관측",
    visible: false,
    layer: "lgt",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "일사 관측",
    visible: false,
    layer: "sun",
    zIndex: 1001,
    type: "WFS"
  }, {
    maptype: "POI",
    title: "황사 관측",
    visible: false,
    layer: "pm10",
    zIndex: 1001,
    type: "WFS"
  }];

  var _wsUnit, _wsUnitValue;

  var _dfs_extent, _dfs_x_offset, _dfs_y_offset;
  
  var _geoserver_workspace;

  if (ol === undefined || ol === null) {
    throw 'openlayers is required';
  }

  function assert(condition, message) {
    if (!condition) {
      message = message || "Assertion failed";

      if (typeof Error !== "undefined") {
        throw new Error(message);
      }

      throw message; // Fallback
    }
  }

  function kmap(options) {
    if (!(this instanceof kmap)) {
      throw 'kmap is a constructor and should be called with the `new` keyword';
    }

    this._mapInfo; // 기초 정보

    this._map; // Openlayer MAP

    this._view;
    this._zoom = 6;
    this.lang = "ko"; // 위성 관측

    this._SAT = {
      area: "",
      type: "",
      matrixSet: "",
      index: 0,
      active: false,
      maxCount: 0,
      dates: [],
      layers: [],
      result: null,
      options: {
        layer: {
          opacity: 1,
          zIndex: 50
        },
        source: {
          imageSmoothing: false
        }
      }
    }; 
    // 레이다
    this._RADAR = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      options: {
        layer: {
          opacity: 0.6,
          zIndex: 200
        }
      }
    }; 
    // 종합영상
    this._RSL = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      options: {
        layer: {
          opacity: 0.6,
          zIndex: 200
        }
      }
    }; 
    
    // 낙뢰
    this._LGT = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      layers: [],
      options: {
        layer: {
          opacity: 0.7,
          zIndex: 200,
          style: lgtStyleFunction
        }
      }
    }; // 바람길

    this._STREAM = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      overlay: null,
      pointer: null,
      options: {
        layer: {
          opacity: 1,
          zIndex: 210
        },
        source: {
          imageSmoothing: true
        }
      }
    }; // 동네예보

    this._DFS = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      overlay: null,
      pointer: null,
      options: {
        layer: {
          opacity: 0.7,
          zIndex: 200
        },
        source: {
          imageSmoothing: true
        }
      }
    }; // 바다실황예측

    this._SEA = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      overlay: null,
      pointer: null,
      options: {
        layer: {
          opacity: 0.7,
          zIndex: 200
        },
        source: {
          imageSmoothing: true
        }
      }
    }; // 바다실황예측 (풍향)

    this._SEA_VEC = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      overlay: null,
      pointer: null,
      options: {
        layer: {
          opacity: 0.7,
          zIndex: 200
        },
        source: {
          imageSmoothing: true
        }
      }
    }; // 초단기예측

    this._KLFS = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      overlay: null,
      pointer: null,
      options: {
        layer: {
          opacity: 0.7,
          zIndex: 200
        },
        source: {
          imageSmoothing: true
        }
      }
    }; // 해양 시정

    this._VIS = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      overlay: null,
      pointer: null,
      options: {
        layer: {
          opacity: 0.7,
          zIndex: 200
        },
        source: {
          imageSmoothing: true
        }
      }
    }; // 해구별 예측

    this._RWW = {
      index: 0,
      active: false,
      source: null,
      layers: [],
      options: {
        layer: {
          opacity: 0.7,
          zIndex: 300
        }
      },
      overlay: null,
      interaction: null
    }; // 특보

    this._WRN = {
      index: 0,
      active: false,
      source: null,
      layers: [],
      options: {
        layer: {
          opacity: 1,
          zIndex: 300
        }
      },
      overlay: null,
      interaction: null
    }; // 영향예보

    this._IFS = {
      index: 0,
      active: false,
      source: null,
      layers: [],
      options: {
        layer: {
          opacity: 1,
          zIndex: 300
        }
      },
      overlay: null,
      interaction: null
    }; // 관측

    this._OBS = {
      sfc: {
        layer: null
      },
      buoy: {
        layer: null
      },
      lhaws: {
        layer: null
      },
      seaBuoy: {
        layer: null
      },
      air: {
        layer: null
      }
    }; // 동네예보 지점

    this._DFSP = {
      date: null,
      data: null,
      layer: null,
      source: null,
      features: null,
      options: {
        layer: {
          opacity: 1,
          style: dfspStyleFunction,
          zIndex: 300
        },
        source: {}
      }
    }; // 도로위험기상

    this._RWS = {
      index: 0,
      active: false,
      source: null,
      layer: null,
      options: {
        layer: {
          opacity: 1,
          zIndex: 200
        }
      }
    };
    this.mapLayers = [];
    this._viewIndex = 0;

    this._init(options);

    this._maps = null;
  }

  kmap.prototype._init = function (options) {
    this._mapInfo = mapInfo;
    proj4.defs(PROJ, mapInfo[PROJ]);
    ol.proj.proj4.register(proj4);
    _dfs_extent = this._mapInfo["dfs.extent"];
    _dfs_x_offset = [_dfs_extent[2] - _dfs_extent[0]] / DFS_GRID_WIDTH;
    _dfs_y_offset = [_dfs_extent[3] - _dfs_extent[1]] / DFS_GRID_HEIGHT;
    options = options || {};
    _wsUnit = options.wsUnit ? options.wsUnit : "km/h";
    _wsUnitValue = _wsUnit === "km/h" ? 3.6 : 1;
    _geoserver_workspace = options.workspace ? options.workspace : "kmap";
    
    var viewOption = {
      center: [127.39658658364093, 36.89008112490317],
      //center: [127.07094921697843, 38.002677594486514],
      projection: PROJ,
      zoom: 7,
      minZoom: 3,
      maxZoom: 16,
      resolutions: this._mapInfo.resolutions,
      extent: this._mapInfo["ea.extent"] //constrainResolution: true,

    };
    var OPIONS = ["minZoom", "zoom", "maxZoom", "center"];
    OPIONS.forEach(function (element) {
      if (options[element] !== undefined) {
        viewOption[element] = options[element];
      }
    });
    viewOption.center = ol.proj.fromLonLat(viewOption.center, PROJ);
    this._view = new ol.View(viewOption);
    this._map = new ol.Map({
      target: options.target,
      view: this._view,
      pixelRatio: 1.25,
      controls: ol.control.defaults({
        zoom: false
      }),
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      })
    }); // 배경 레이어

    if (!options.mapLayers) {
      options.mapLayers = _mapLayers.filter(function (l) {
        return l.default;
      });
    } else {
      options.mapLayers = options.mapLayers.map(function (l) {
        return Object.assign({}, _.find(_mapLayers, function (f) {
          return f.layer === l.layer;
        }), l);
      });
    }

    this._maps = options.mapLayers;

    var _this = this; // 줌 레벨에 따라 extent 변경


    changeViewByExtent(_this, viewOption); // 지도 컨트롤 추가

    createElementCtrl(_this);
    fetch("".concat(GEOSERVER_URL, "/gwc/service/wmts?REQUEST=GetCapabilities")).then(function (response) {
      return response.text();
    }).then(function (text) {
      var parser = new ol.format.WMTSCapabilities();
      var result = parser.read(text);
      var source = null;
      options.mapLayers.forEach(function (layer, index) {
        if (layer.maptype === "IMG") {
          if (layer.type === "WMTS") {
            source = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(result, {
              layer: _geoserver_workspace + ":" + layer.layer,
              matrixSet: layer.matrixSet === undefined ? 'EPSG:980201-1' : layer.matrixSet,
              FORMAT: 'image/png',
              crossOrigin: "Anonymous"
            }));
          } else {
            source = new ol.source.TileWMS({
              params: {
                'LAYERS': _geoserver_workspace + ":" + layer.layer,
                'FORMAT': 'image/png',
                crossOrigin: "Anonymous"
              },
              url: layer.url ? layer.url : "".concat(GEOSERVER_URL, "/" + _geoserver_workspace + "/wms")
            });
          }

          var l = new ol.layer.Tile({
            source: source,
            visible: layer.visible,
            zIndex: layer.zIndex
          });
          _this.mapLayers[index] = l;

          _this.map.addLayer(l);
        } else if (layer.maptype === "POI") {
          _this.setPOI(layer, index);
        }
      });

      if (options.clickPoi) {
        _this.selectPoi(options.clickPoi);
      }

      if (options.clickMap) {
        _this.clickMap(options.clickMap);
      }
    });
    var zoomInOut = new ol.control.Zoom({
      zoomInTipLabel: "확대",
      zoomOutTipLabel: "축소"
    });

    _this._map.addControl(zoomInOut);

    if (options.scaleLine === true) {
      var scaleLine = new ol.control.ScaleLine({
        text: true,
        minWidth: 64
      });

      _this._map.addControl(scaleLine);
    }

    if (options.fullScreen === true) {
      var fullScreen = new ol.control.FullScreen({
        tipLabel: "전체 화면"
      });

      _this._map.addControl(fullScreen);
    }

    if (options.myLocation) {
      this.addLocation(options.myLocation);
    }

    if (options.DFS !== undefined) {
      _this.setDfs(options.DFS);
    }

    if (options.DFSP !== undefined) {// _this.setDfsp(options.DFSP, 0);
    }

    if (options.RADAR !== undefined) {
      _this.setRadar(options.RADAR);
    }
    
    if (options.RSL !== undefined) {
      _this.setRsl(options.RSL);
    }

    if (options.SEA !== undefined) {
      _this.setSeaFct(options.SEA);
    }

    if (options.KLFS !== undefined) {
      _this.setKlfs(options.KLFS);
    }

    if (options.RWW !== undefined) {
      _this.setRww(options.RWW);
    }

    if (options.WRN !== undefined) {
      _this.setWrn(options.WRN);
    }
  };
  /**
   * 언어 설정
   * @param {String} lang // ko or en
   */


  kmap.prototype.setLang = function (lang) {
    if (lang === "en" || lang === "ko") {
      this.lang = lang;
    } // 관측 refresh


    refreshObsOverlay.call(this);
  };
  /**
   * 외부 풍속 단위 주입
   * @param {String} unit // km/h or m/s
   */


  kmap.prototype.setWsUnit = function setWsUnit(unit) {
    _wsUnit = unit;
    _wsUnitValue = unit === "km/h" ? 3.6 : 1; // 관측 refresh

    refreshObsOverlay.call(this);
  }; // 관측 오버레이 refresh


  function refreshObsOverlay() {
    var _this = this;

    var _loop = function _loop() {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      if (value.layer !== null) {
        var feature = value.layer.getSource().getFeatures();
        feature.forEach(function (f) {
          var overlay = f.get('overlay');

          if (overlay) {
            // HTML 변경
            var element = overlayElement(_this, f, key);
            overlay.setElement(element); // 클릭 이벤트 유지

            element.firstElementChild.onclick = function (event) {
              var data = getObsInfo(_this, event.target.dataset);
              var options = f.get('ops');
              if (options && options.callback && typeof options.callback === "function") options.callback(data);
            };
          }
        });
      }
    };

    for (var _i2 = 0, _Object$entries = Object.entries(_this._OBS); _i2 < _Object$entries.length; _i2++) {
      _loop();
    }
  }
  /**
   * 동화 구현 (source 활용)
   * @param {*} _THIS
   */


  kmap.prototype._nextSource = function _nextSource(_THIS) {
    _THIS.index = _THIS.index >= _THIS.source.length - 1 ? 0 : _THIS.index + 1; // console.log("next Souce ---------  ", _THIS.index); // debugger

    if (_THIS.source[_THIS.index].getUrl() !== "") {
      _THIS.layer.setSource(_THIS.source[_THIS.index]);
    } else {
      _THIS.layer.setSource(null);
    }
  };
  /**
   * 동화 구현 (layer 활용)
   * @param {*} _THIS
   */


  kmap.prototype._nextLayer = function _next(_THIS, isOpacity) {
    _THIS.index = _THIS.index >= _THIS.layers.length - 1 ? 0 : _THIS.index + 1;

    var _iterator = _createForOfIteratorHelper(_THIS.layers.entries()),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            i = _step$value[0],
            layer = _step$value[1];

        if (isOpacity) {
          // console.log("next Layer ---------  ", _THIS.index); // debugger
          if (layer !== undefined) {
            var opacity = i === _THIS.index ? _THIS.options.layer.opacity : 0;
            layer.setOpacity(opacity);
          }
        } else {
          layer.setOpacity(_THIS.options.layer.opacity);
          layer.setVisible(i === _THIS.index);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  /**
   * 위성 - 데이터 로드
   */


  kmap.prototype.loadingSat = function loadingSat(callback) {
    var _THIS = this._SAT;
    this.removeWmtsLayer();

    for (var i = 0; i < _THIS.maxCount; i++) {
      _THIS.index = i;
      this.addWmtsLayer(_THIS, _THIS.index, callback); // 투명도

      _THIS.layers[i].setOpacity(0);
    }
  };
  /**
   * 레이다 - 데이터 로드
   */


  kmap.prototype.loadingRadar = function loadingRadar(index, callback) {
    var _RADAR = this._RADAR;
    _RADAR.index = index;

    _RADAR.layer.setSource(_RADAR.source[index]);

    var source = _RADAR.layer.getSource();

    if (typeof callback !== "undefined") {
      source.on('imageloadstart', function () {
        callback(1);
      });
      source.on('imageloadend', function () {
        callback(-1);
      });
    }
  };
  kmap.prototype.loadingRsl = function loadingRsl(index, callback) {
	    var _RSL = this._RSL;
	    _RSL.index = index;

	    _RSL.layer.setSource(_RSL.source[index]);

	    var source = _RSL.layer.getSource();

	    if (typeof callback !== "undefined") {
	      source.on('imageloadstart', function () {
	        callback(1);
	      });
	      source.on('imageloadend', function () {
	        callback(-1);
	      });
	    }
	  };
  /**
   * 동화 이동
   */


  kmap.prototype.next = function next() {
    if (this._SAT.active) {
      this._nextLayer(this._SAT, true);
    }

    if (this._RADAR.active) {
      this._nextSource(this._RADAR);
    }
    
    if (this._RSL.active) {
        this._nextSource(this._RSL);
      }

    if (this._LGT.active) {
      this._nextLayer(this._LGT, false);
    }

    if (this._STREAM.active) {
      this._nextSource(this._STREAM);
    }

    if (this._DFS.active) {
      this._nextSource(this._DFS);
    }

    if (this._SEA.active) {
      this._nextSource(this._SEA);
    }

    if (this._SEA_VEC.active) {
      this._nextSource(this._SEA_VEC);
    }

    if (this._KLFS.active) {
      this._nextSource(this._KLFS);
    }

    if (this._VIS.active) {
      this._nextSource(this._VIS);
    }

    if (this._IFS.active) {
      this._nextLayer(this._IFS, false);
    }

    if (this._RWS.active) {
      this._nextSource(this._RWS);
    }

    if (this._RWW.active) {
      this._nextLayer(this._RWW, false);
    }
  };

  kmap.prototype.setIndex = function setIndex(index) {
    if (this._SAT.active) {
      this._SAT.index = index - 1;

      this._nextLayer(this._SAT, true);
    }

    if (this._RADAR.active) {
      this._RADAR.index = index - 1;

      this._nextSource(this._RADAR);
    }
    
    if (this._RSL.active) {
        this._RSL.index = index - 1;

        this._nextSource(this._RSL);
      }

    if (this._LGT.active) {
      this._LGT.index = index - 1;

      this._nextLayer(this._LGT, false);
    }

    if (this._STREAM.active) {
      this._STREAM.index = index - 1;

      this._nextSource(this._STREAM, false);
    }

    if (this._DFS.active) {
      this._DFS.index = index - 1;

      this._nextSource(this._DFS);
    }

    if (this._SEA.active) {
      this._SEA.index = index - 1;

      this._nextSource(this._SEA);
    }

    if (this._SEA_VEC.active) {
      this._SEA_VEC.index = index - 1;

      this._nextSource(this._SEA_VEC);
    }

    if (this._KLFS.active) {
      this._KLFS.index = index - 1;

      this._nextSource(this._KLFS);
    }

    if (this._VIS.active) {
      this._VIS.index = index - 1;

      this._nextSource(this._VIS);
    }

    if (this._IFS.active) {
      this._IFS.index = index - 1;

      this._nextLayer(this._IFS, false);
    }

    if (this._RWS.active) {
      this._RWS.index = index - 1;

      this._nextSource(this._RWS);
    }

    if (this._RWW.active) {
      this._RWW.index = index - 1;

      this._nextLayer(this._RWW, false);
    }
  };

  kmap.prototype.setOpacity = function setOpacity(opacity) {
    if (this._SAT.active) {
      this._SAT.options.layer.opacity = opacity;

      this._SAT.layers[this._SAT.index].setOpacity(opacity);
    }

    if (this._RADAR.active) {
      this._RADAR.options.layer.opacity = opacity;

      this._RADAR.layer.setOpacity(opacity);
    }
    
    if (this._RSL.active) {
      this._RSL.options.layer.opacity = opacity;

      this._RSL.layer.setOpacity(opacity);
    }

    if (this._LGT.active) {
      this._LGT.options.layer.opacity = opacity;

      this._LGT.layers[this._LGT.index].setOpacity(opacity);
    }

    if (this._DFS.active) {
      this._DFS.options.layer.opacity = opacity;

      this._DFS.layer.setOpacity(opacity);
    }

    if (this._VIS.active) {
      this._VIS.options.layer.opacity = opacity;

      this._VIS.layer.setOpacity(opacity);
    }

    if (this._SEA.active) {
      this._SEA.options.layer.opacity = opacity;

      this._SEA.layer.setOpacity(opacity);
    }

    if (this._SEA_VEC.active) {
      this._SEA_VEC.options.layer.opacity = opacity;

      this._SEA_VEC.layer.setOpacity(opacity);
    }

    if (this._KLFS.active) {
      this._KLFS.options.layer.opacity = opacity;

      this._KLFS.layer.setOpacity(opacity);
    }
  };

  kmap.prototype.setOpacityByType = function setOpacityByType(type, opacity) {
    switch (type) {
      case "sat":
        if (this._SAT.active) {
          this._SAT.options.layer.opacity = opacity;

          this._SAT.layers[this._SAT.index].setOpacity(opacity);
        }

        break;

      case "radar":
        if (this._RADAR.active) {
          this._RADAR.options.layer.opacity = opacity;

          this._RADAR.layer.setOpacity(opacity);
        }

        if (this._RSL.active) {
          this._RSL.options.layer.opacity = opacity;

          this._RSL.layer.setOpacity(opacity);
        }
        if (this._LGT.active) {
          this._LGT.options.layer.opacity = opacity;

          this._LGT.layers[this._LGT.index].setOpacity(opacity);
        }

        break;

      case "dfs":
        if (this._DFS.active) {
          this._DFS.options.layer.opacity = opacity;

          this._DFS.layer.setOpacity(opacity);
        }

        break;

      case "sobs":
        if (this._RADAR.active) {
          this._RADAR.options.layer.opacity = opacity;

          this._RADAR.layer.setOpacity(opacity);
        }

        if (this._VIS.active) {
          this._VIS.options.layer.opacity = opacity;

          this._VIS.layer.setOpacity(opacity);
        }

        if (this._SEA.active) {
          this._SEA.options.layer.opacity = opacity;

          this._SEA.layer.setOpacity(opacity);
        }

        if (this._SEA_VEC.active) {
          this._SEA_VEC.options.layer.opacity = opacity;

          this._SEA_VEC.layer.setOpacity(opacity);
        }

        if (this._KLFS.active) {
          this._KLFS.options.layer.opacity = opacity;

          this._KLFS.layer.setOpacity(opacity);
        }

        break;
    }
  };
  /**
   * 위성 영상 6종
   */


  kmap.prototype.setSat = function setSat(options, callback) {
    var _this = this;

    var SAT = this._SAT;
    
        _this.removeWmtsLayer();
        SAT.active = false;

    if (options != null) {
      SAT.area = options.area;
      SAT.type = options.type;
      SAT.matrixSet = options.matrixSet;
      SAT.dates = options.dates;
      SAT.maxCount = SAT.dates.length;
      SAT.options.layer.opacity = options.opacity;
      SAT.index = options.index;
      SAT.layers = new Array(SAT.maxCount - 1);

      fetch("".concat(APP_URL, "/root/Capabilities.xml")).then(function (response) {
        return response.text();
      }).then(function (text) {
        if (SAT.active) {					// 위성이 중복일 경우, setSat으로 콜백
					_this.setSat(options, callback);
				} else {							// 최종적으로 WmtsLayer가 한번 생성됨.
            var parser = new ol.format.WMTSCapabilities();
            SAT.result = parser.read(text);

            _this.addWmtsLayer(SAT, SAT.index, callback);

            SAT.active = true;
        }
      });
    }
  };
  /**
   * 위성 관측 - WMTS Layer 생성
   */


  kmap.prototype.addWmtsLayer = function addWmtsLayer(_THIS, index, callback) {
    var capabilities = ol.source.WMTS.optionsFromCapabilities(_THIS.result, {
      layer: "GK2A",
      matrixSet: _THIS.matrixSet,
      foramt: 'image/png',
      imageSmoothing: _THIS.options.source.imageSmoothing
    });

    capabilities.tileLoadFunction = function (imageTile, src) {
      var param = "?area=".concat(_THIS.area, "&type=").concat(_THIS.type, "&date=").concat(_THIS.dates[index]); // index = _SAT.index

      imageTile.getImage().src = src + param;
    };

    var source = new ol.source.WMTS(capabilities);
    var layer = _THIS.layers[index];
    var opacity = 0;

    if (typeof callback === "undefined") {
      opacity = _THIS.options.layer.opacity;
    }

    layer = new ol.layer.Tile({
      source: source,
      visible: true,
      opacity: opacity,
      extent: [-2999750, 1967632.72, 2999750, 7167132.72],
      zIndex: _THIS.options.layer.zIndex
    });
    _THIS.layers[index] = layer;
    this.map.addLayer(layer);

    if (typeof callback !== "undefined") {
      source.on('tileloadstart', function () {
        callback(1);
      });
      source.on('tileloadend', function () {
        callback(-1);
      });
      source.on('tileloaderror', function (e) {
        callback(-1);
      });
    }
  };
  /**
   * 위성 관측 - WMTS Layer 제거
   */


  kmap.prototype.removeWmtsLayer = function removeWmtsLayer() {
    var _SAT = this._SAT;

    for (index in _SAT.layers) {
      this.map.removeLayer(_SAT.layers[index]);
    }

    _SAT.layers = [];
  };

  function animate(map, _THIS) {
    map.render();

    if (_THIS.active) {
      window.requestAnimationFrame(animate(map, _THIS));
    }
  }
  /**
   * 초단기예측 바람길
   * @param {Object} options
   */


  kmap.prototype.setKlfsStream = function setKlfsStream(option) {
    var extent = this._mapInfo["klfs.extent"];
    var imageSize = this._mapInfo["klfs.size"];
    this.setStream(option, extent, imageSize);
  };
  /**
   * 동네예보 바람길
   * @param {Object} options
   */


  kmap.prototype.setDfsStream = function setDfsStream(option, callback) {
    var extent = this._mapInfo["dfs.extent"];
    var imageSize = this._mapInfo["dfs.size"];
    this.setStream(option, extent, imageSize, callback);
  };
  /**
   * 바람길 Stream
   * @param {Object} options
   */


  kmap.prototype.setStream = function setStream(option, extent, imageSize) {
    function makeSources(_THIS, extent, imageSize, option) {
      var sources = [];

      for (var i = 0; i < option.urls.length; i++) {
        var sopt = {
          url: option.urls[i],
          projection: PROJ,
          imageExtent: extent,
          imageSize: imageSize
        };

        if (_THIS.options && _THIS.options.source) {
          Object.assign(sopt, _THIS.options.source);
        }

        sources[i] = new ol.source.ImageStatic(sopt);
      }

      return sources;
    }

    var _THIS = this._STREAM;

    if (option !== null) {
      _THIS.index = option.dates ? option.dates.length - 1 : 0;
      var sources = makeSources(_THIS, extent, imageSize, option);

      if (!_THIS.layer) {
        var lopt = {
          source: sources[_THIS.index],
          count: Math.round(4000 / ol.has.DEVICE_PIXEL_RATIO)
        };

        if (_THIS.options && _THIS.options.layer) {
          Object.assign(lopt, _THIS.options.layer);
          Object.assign(lopt, option);
        }

        var layer = new kma.windy.WindyImageLayer(lopt);

        this._map.addLayer(layer);

        _THIS.layer = layer;
      } else {
        _THIS.layer.setSource(sources[_THIS.index]);

        _THIS.layer.setVisible(true);
      }

      _THIS.source = sources;
      _THIS.active = true;
      var start;

      function animate(timestamp) {
        if (!start || timestamp - start > 33) {
          this._map.render();

          start = timestamp;
        }

        if (this._STREAM.active) {
          window.requestAnimationFrame(animate);
        }
      }

      window._map = this._map;
      window._STREAM = _THIS;
      animate();
    } else {
      if (_THIS.layer) {
        _THIS.active = false;

        _THIS.layer.setVisible(false);

        _THIS.layer.setSource(null);

        var _sources = _THIS.source;

        for (var i = 0; i < _sources.length; i++) {
          _sources[i].disposeInternal();
        } // end for


        _THIS.source = [];
      }
    }
  };
  /**
   * 동네예보 분포도
   * @param {Object} DFS
   */


  kmap.prototype.setDfs = function setDfs(DFS, callback) {
    this.removeStaticLayer(this._DFS);

    if (DFS && !this._DFS.overlay) {
      // pointer move 일 때 grid x,y값 보여주기
      var dfsOverlay = new ol.Overlay({
        type: "dfs",
        element: document.getElementById('popup'),
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      this._DFS.overlay = dfsOverlay;

      this._map.addOverlay(dfsOverlay);

      this.addStaticLayer(this._DFS, this._mapInfo["dfs.extent"], DFS);

      if (!this._DFS.callback && callback) {
        var _this2 = this;

        fetch("".concat(APP_URL, "/js/info/northInfo.bin")).then(function (res) {
          return res.arrayBuffer();
        }).then(function (buffer) {
          var northInfo = new Int8Array(buffer); // 팝업 제공

          _this2._DFS.callback = function onClickListener(e, f) {
            var feature = null;

            _this2.map.forEachFeatureAtPixel(e.pixel, function (fe, la) {
              feature = fe;
            });

            var coord = e.coordinate;
            var x = Math.ceil((coord[0] - _dfs_extent[0]) / _dfs_x_offset);
            var y = Math.ceil((coord[1] - _dfs_extent[1]) / _dfs_y_offset);
            var name = null;

            if (feature) {
              name = feature.get("name");
            }

            var index = x + y * DFS_GRID_WIDTH;
            var north = northInfo[index] == 1 ? true : false;
            callback(x, y, ol.proj.toLonLat(coord, PROJ), north);
          };

          _this2._map.on('click', _this2._DFS.callback);
          /*
          let dfsPointer = new ol.interaction.Pointer({
             handleMoveEvent: function(evt) {
                 let coord  = evt.map.getEventCoordinate(evt.originalEvent);
                 let grid;
                  _this._DFS.overlay.setPosition(coord);
                 let x = Math.ceil((coord[0] - _dfs_extent[0]) / _dfs_x_offset);
                 let y = Math.ceil((coord[1] - _dfs_extent[1]) / _dfs_y_offset);
                  if (0 < x && x <= DFS_GRID_WIDTH && 0 < y && y <= DFS_GRID_HEIGHT) {
                     grid = [x, y]
                 } else {
                     grid = null;
                 }
                 if (grid) {
                     let index = grid[0] + (grid[1] * DFS_GRID_WIDTH);
                     if (northInfo[index] == 1) {
                         msg = "이 지역은 상세정보가 지원되지 않습니다."; //북한, 중국, 일본
                     } else {
                         msg = "";
                     }
                      _this._DFS.overlay.element.innerHTML = msg;
                 } else {
                      _this._DFS.overlay.element.innerHTML = "";
                 }
             }
          });
          _this._DFS.pointer = dfsPointer;
          _this._map.addInteraction(dfsPointer);
          */

        });
      }
    } else {
      if (DFS !== null) {
        // this._DFS.pointer.setActive(true);
        this.addStaticLayer(this._DFS, this._mapInfo["dfs.extent"], DFS);
        if (this._DFS.callback) this._map.on('click', this._DFS.callback);
      } else {
        // this._DFS.pointer.setActive(false);
        if (this._DFS.overlay) this._DFS.overlay.setPosition(undefined);
        if (this._DFS.callback) this._map.un('click', this._DFS.callback);
      }
    }
  };
  /**
   * 동네예보 지점
   * @param {Object} DFSP
  kmap.prototype.setDfsp = function setDfsp(DFSP, index, dfsElement) {
      const _THIS = this._DFSP;
      function dfspMergeFeatures(data, index) {
          const features = _THIS.features;
          for(let f of features) {
              let x = f.get('x');
              let y = f.get('y');
              let _index = getIndexFromPixel(x, y);
              if(0 <= _index && _index <= 37697) {
                  f.set("sky", -999);
                  for(element of data.element) {
                      if(index == 0 && element == "SKY" && !data.result["SKY0"]) continue;
                      if(data.result[element + index]) {
                          f.set(element.toLocaleLowerCase(), data.result[element + index][_index]);
                      }else {
                          f.set(element.toLocaleLowerCase(), null);
                      }
                  }
              }
          }
      }
       //동네예보 지점을 표출하지 않는 경우
      const elementsWithoutDfsp = ["WAV", "WSD", "UVVEC", "UVWSD"];
      if(elementsWithoutDfsp.indexOf(dfsElement) > -1) {
          index = -1;
      }
       if(this._DFSP.layer === null) {
          const _this = this;
          fetch(`${APP_URL}/js/info/dfsZonePoints.geojson`).then(data => {
              return data.json();
          }).then(function (result) {
              // _this._DFSP.features = (new ol.format.GeoJSON({ featureProjection: PROJ })).readFeatures(result);
              _this.addVectorLayer(_this._DFSP, (new ol.format.GeoJSON({ featureProjection: PROJ })).readFeatures(result));
              _this._DFSP.layer.setVisible(index > -1);
              if (DFSP.data !== null) {
                  _this._DFSP.data = DFSP.data;
                  dfspMergeFeatures(DFSP.data, index);
              }
               if (typeof(DFSP.callback) === "function") {
                  _this._DFSP.callback = function onClickListener(e, f) {
                      let feature = null;
                      _this.map.forEachFeatureAtPixel(e.pixel, function(fe, la) {
                          feature = fe;
                      })
                      const coord  = e.coordinate;
                      const x = Math.ceil((coord[0] - _dfs_extent[0]) / _dfs_x_offset);
                      const y = Math.ceil((coord[1] - _dfs_extent[1]) / _dfs_y_offset);
                      let name = null;
                      if(feature) {
                          name = feature.get("name");
                      }
                      if (0 < x && x <= DFS_GRID_WIDTH && 0 < y && y <= DFS_GRID_HEIGHT) {
                          DFSP.callback(x, y, name, ol.proj.toLonLat(coord, PROJ), closestAws(_this, coord));
                      }
                  }
                  _this._map.on('click', _this._DFSP.callback);
              }
           });
      } else {
          if(index > -1) {
              this._DFSP.layer.setVisible(true);
              if (DFSP && DFSP.data !== null) this._DFSP.data = DFSP.data;
              dfspMergeFeatures(this._DFSP.data, index);
              this._map.on('click', this._DFSP.callback);
          } else{
              this._DFSP.layer.setVisible(false);
              if (typeof(this._DFSP.callback) === "function") {
                  this._map.un('click', this._DFSP.callback);
              }
          }
      }
  }
  */

  /**
   * 레이다
   * @param {Objec} RADAR
   */


  kmap.prototype.setRadar = function setRadar(RADAR) {
    // https://vapi.kma.go.kr/BUFD/rdr_sfc_pty_img_202009031655_1453.png
    // https://vapi.kma.go.kr/BUFD/qpf_ana_img_202009031640_" + diff + "_1453.png";
    this.removeStaticLayer(this._RADAR);

    if (RADAR !== null) {
      assert(RADAR.urls != undefined && RADAR.urls instanceof Array && RADAR.urls.length > 0, "레이다 urls 오류");
      if(RADAR.type == "stn") {
    	  this.addStaticLayer(this._RADAR, this._mapInfo["radar." + RADAR.area + ".extent"], RADAR);  
      } else {
    	  this.addStaticLayer(this._RADAR, this._mapInfo["radar.extent"], RADAR);    	  
      }
    }
  };
  
  kmap.prototype.setRsl = function setRsl(RSL) {
    this.removeStaticLayer(this._RSL);
	    if (RSL !== null) {
      assert(RSL.urls != undefined && RSL.urls instanceof Array && RSL.urls.length > 0, "종합영상 urls 오류");
      this.addStaticLayer(this._RSL, this._mapInfo["rsl.extent"], RSL);
    }
  };
  

  kmap.prototype.removeLayer = function removeLayer(_THIS) {
    if (_THIS.hasOwnProperty("layer")) {
      this._map.removeLayer(_THIS.layer);

      _THIS.layer = null; // 메모리 반환
    }

    if (_THIS.hasOwnProperty("layers")) {
      this._map.removeLayer(_THIS.layers[_THIS.index]);

      _THIS.layers = [];
    }

    _THIS.active = false;
  };

  kmap.prototype.removeStaticLayer = function removeStaticLayer(_THIS) {
    this.removeLayer(_THIS);
    _THIS.active = false;
  };
  /**
   * 정적 이미지 추가
   * @param {*} _THIS 정적이미지
   * @param {*} extent 사용 extent 이름
   * @param {*} option 적용 선택 사항
   */


  kmap.prototype.addStaticLayer = function addStaticLayer(_THIS, extent, option) {
    var sources = [];
    _THIS.index = option.dates ? option.dates.length - 1 : 0;

    for (var i = 0; i < option.urls.length; i++) {
      var sopt = {
        url: option.urls[i],
        projection: PROJ,
        imageExtent: extent
      };

      if (_THIS.options && _THIS.options.source) {
        Object.assign(sopt, _THIS.options.source);
      }

      sources[i] = new ol.source.ImageStatic(sopt);
    }

    var lopt = {
      source: sources[_THIS.index]
    };

    if (_THIS.options && _THIS.options.layer) {
      Object.assign(lopt, _THIS.options.layer);
      Object.assign(lopt, option);
    }

    var layer = new ol.layer.Image(lopt);
    _THIS.source = sources;
    _THIS.layer = layer;
    _THIS.active = true;

    this._map.addLayer(layer);
  };
  /**
   * 바다실황예측
   * @param {Object} SEA
   */


  kmap.prototype.setSeaFct = function setSeaFct(SEA) {
    var _THIS = this._SEA;
    this.removeStaticLayer(_THIS);

    if (SEA !== null) {
      _THIS.options.source.imageSize = this._mapInfo["sea.size"];
      this.addStaticLayer(_THIS, this._mapInfo["sea.extent"], SEA);
    }
  };
  /**
   * 바다실황예측 (풍향)
   * @param {Object} SEA_VEC
   */


  kmap.prototype.setSeaVec = function setSeaVec(SEA_VEC) {
    var _THIS = this._SEA_VEC;
    this.removeStaticLayer(_THIS);

    if (SEA_VEC !== null) {
      _THIS.options.source.imageSize = this._mapInfo["sea.size"];
      this.addStaticLayer(_THIS, this._mapInfo["sea.extent"], SEA_VEC);
    }
  };
  /**
   * 초단기예측 분포도
   * @param {Object} KLFS
   */


  kmap.prototype.setKlfs = function setKlfs(KLFS) {
    var _THIS = this._KLFS;
    this.removeStaticLayer(_THIS);

    if (KLFS !== null) {
      _THIS.options.source.imageSize = this._mapInfo["klfs.size"];
      this.addStaticLayer(_THIS, this._mapInfo["klfs.extent"], KLFS);
    }
  };
  /**
   * 해양 시정 분포도
   * @param {Object} VIS
   */


  kmap.prototype.setVisibility = function setVisibility(VIS) {
    var _THIS = this._VIS;
    this.removeStaticLayer(_THIS);

    if (VIS !== null) {
      _THIS.options.source.imageSize = this._mapInfo["vis.size"];
      this.addStaticLayer(_THIS, this._mapInfo["vis.extent"], VIS);
    }
  };

  kmap.prototype.setRww = function setRww(type, rww, index, pointerCallback, clickCallback) {
    index = index === undefined ? 0 : index;

    switch (type) {
      case "b":
      case "d":
      case "e":
        this.setRwwData(rww, index, pointerCallback, clickCallback, function (zone) {
          var value = getRww(type, zone);
          var color = styles.rww[type][value];

          if (value == 999) {
            return styles.rww.default;
          } else {
            return rwwStyleFunction(color);
          }
        });
        break;

      case "c":
      case "f":
        this.setRwwData(rww, index, pointerCallback, clickCallback, function (zone) {
          var rotation = getRww(type, zone);

          if (rotation == "-990") {
            return styles.rww.default;
          } else {
            return [styles.rww.default, rwwArrowStyleFunction(rotation)];
          }
        });
        break;

      case "ef":
        this.setRwwData(rww, index, pointerCallback, clickCallback, function (zone) {
          var value = getRww("e", zone);
          var color = styles.rww["e"][value];
          var rotation = getRww("f", zone);

          if (value == 999) {
            return styles.rww.default;
          } else {
            return [rwwStyleFunction(color), rwwArrowStyleFunction(rotation)];
          }
        });
        break;

      default:
        this.setRwwData(rww, index);
    }
  };

  function getRww(type, zone) {
    if (type === "b") {
      var db;
      var dx = zone.b;

      if (dx <= -990) {
        db = 999;
      } else {
        db = parseInt(dx / 0.5);
        if (dx > 0 && dx % 0.5 == 0) db -= 1;
        if (db > 19) db = 19;
      }

      return db;
    } else if (type === "c") {
      var _db;

      var _dx = zone.c;
      _db = parseInt(_dx);

      if (_db < 0 || _db > 3600) {
        _db = "-990";
      } else {
        _db = Math.PI * _db / 180;
      }

      return _db;
    } else if (type === "d") {
      var _db2;

      var _dx2 = zone.d;

      if (_dx2 <= -990) {
        _db2 = 999;
      } else {
        _db2 = parseInt(_dx2 / 1);
        if (_dx2 > 0 && _dx2 % 1 == 0) _db2 -= 1;
        if (_db2 > 19) _db2 = 19;
      }

      return _db2;
    } else if (type === "e") {
      var _db3;

      var _dx3 = zone.e;

      if (_dx3 <= -990) {
        _db3 = 999;
      } else {
        var legend = styles.rww.e;

        for (var j in legend) {
          j = Number(j);

          if (j == 0 && legend[j].value >= _dx3) {
            _db3 = j;
            break;
          } else if (j + 1 < 30 && legend[j].value < _dx3 && legend[j + 1].value >= _dx3) {
            _db3 = j;
            break;
          } else if (j + 1 == 30) {
            _db3 = 30 - 1;
          }
        }
      }

      return _db3;
    } else if (type === "f") {
      var _db4;

      var _dx4 = zone.f;
      _db4 = parseInt(_dx4);

      if (_db4 < 0 || _db4 > 3600) {
        _db4 = "-990";
      } else {
        _db4 = Math.PI * _db4 / 180;
      }

      return _db4;
    }
  }
  /**
   * 해구별 예측
   * @param {Objec} RWW
   */


  kmap.prototype.setRwwData = function setRwwData(rww, index, pointerCallback, clickCallback, styleFunction) {
    var _map = this;

    var _THIS = this._RWW;

    function mergeFeatures(zoneRww) {
      var layers = _THIS.layers;
      var features = layers[index].getSource().getFeatures(); // 패턴

      var _iterator2 = _createForOfIteratorHelper(features),
          _step2;

      try {
        var _loop2 = function _loop2() {
          var feature = _step2.value;
          var zone = _.find(zoneRww, function (z) {
            return z.a == feature.get('id');
          });

          if (zone) {
            feature.setProperties(zone);

            if (styleFunction && typeof styleFunction === "function") {
              feature.setStyle(styleFunction(zone));
            }
          }
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop2();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    if (_THIS.layers.length === 0) {
      fetch("".concat(APP_URL, "/js/info/rwwArea.geojson")).then(function (data) {
        return data.json();
      }).then(function (result) {
        for (var i = 0; i < 25; i++) {
          _THIS.options.layer.visible = i === index;

          var layer = _map.addVectorLayer(_THIS, new ol.format.GeoJSON({
            featureProjection: PROJ
          }).readFeatures(result));

          _THIS.layers.push(layer);
        }

        _THIS.index = index;

        if (rww !== null) {
          mergeFeatures(rww);
        }
      }).then(function () {
        if (pointerCallback && typeof pointerCallback === "function") {
          _map.addPointerInteraction(_THIS, function (e, feature, coord) {
            if (feature) {
              var lonlat = ol.proj.toLonLat(coord, PROJ);

              var pixel = _map.map.getPixelFromCoordinate(lonlat);

              pointerCallback(e, feature, lonlat, pixel);
            }
          });
        }

        if (clickCallback && typeof clickCallback === "function") {
          _map.addSelectInteraction(_THIS, function (e) {
            var feature = e.selected[0];

            if (feature) {
              feature.setStyle(styles.rww.selected);
              clickCallback(e, feature);
            }
          }, 2000);
        }
      });
    } else {
      if (rww !== null) {
        _THIS.active = true;
        mergeFeatures(rww);
      } else {
        _THIS.active = false;
        if (_THIS.overlay) _THIS.overlay.setPosition(undefined);
        if (_THIS.layers[_THIS.index]) _THIS.layers[_THIS.index].setVisible(false);
      }
    }
  };

  kmap.prototype.setWrnSea = function setWrnSea(wrn) {
    this.setWrn(wrn, true);
  };
  /**
   * 특보
   * @param {Objec} WRN
   */


  kmap.prototype.setWrn = function setWrn(todays, sea) {
    var _map = this;

    var _THIS = this._WRN;

    function mergeFeatures(todays) {
      var layers = _THIS.layers;

      for (var i = 0; i < layers.length; i++) {
        var features = layers[i].getSource().getFeatures(); // 가공

        var datas = {};

        var _iterator3 = _createForOfIteratorHelper(todays),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var today = _step3.value;
            var key = today.regId;

            if (!datas.hasOwnProperty(key)) {
              datas[key] = [];
            }
            datas[key].push({"regId": today.regId, "lvl": today.lvl, "wrn": today.wrn, "cmd": today.cmd, "tmEf": today.tmEf, "effect": today.effect, "tmFc": today.tmFc});
          } // 패턴

        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        var _iterator4 = _createForOfIteratorHelper(features),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var feature = _step4.value;
            var style = void 0;
            var code = feature.get("code");
            var data = datas[feature.get('regId')];

         // 특보 원본표출 테스트
			if(data) {
				feature.set('data', data);
				style = wrnStyleFunction(data);			
            } else {
                style = styles.wrn["default"];
            }

            feature.setStyle(style);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }

    if (_THIS.layers.length <= 0) {
      fetch("".concat(APP_URL, "/js/info/wrnArea.geojson")).then(function (data) {
        return data.json();
      }).then(function (result) {
        if (sea) {
          result.features = result.features.filter(function (r) {
            return r.properties.code !== "L1";
          });
        }

        if (_THIS.layers.length === 0) {
          var layer = _map.addVectorLayer(_THIS, new ol.format.GeoJSON({
            featureProjection: PROJ
          }).readFeatures(result));

          layer.setVisible(todays != null);

          _THIS.layers.push(layer);
        }

        if (todays !== null) {
          _THIS.layer.setVisible(true);

          mergeFeatures(todays);
        }
      }); // add overlay

      addTooltip(_THIS, _map);
    } else {
      if (todays !== null) {
        _THIS.index = 0;
        _THIS.active = true;
        mergeFeatures(todays);

        _THIS.layer.setVisible(true);

        _THIS.layers[0].setVisible(true);
      } else {
        _THIS.active = false;
        if (_THIS.overlay) _THIS.overlay.setPosition(undefined);
        if (_THIS.layer) _THIS.layer.setVisible(false);
        if (_THIS.layers[0]) _THIS.layers[0].setVisible(false);
      }
    }
  };
  /**
   * 영향예보
   * @param {Objec} IFS
   */


  kmap.prototype.setIfs = function setIfs(datas) {
    var _map = this;

    var _THIS = this._IFS;

    function mergeFeatures(todays) {
      var layers = _THIS.layers;

      for (var i = 0; i < layers.length; i++) {
        var features = layers[i].getSource().getFeatures(); // 가공

        var ifs = {};

        var _iterator5 = _createForOfIteratorHelper(todays.list),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var today = _step5.value;
            var key = today.regId;
            ifs[key] = {
              "regId": today.regId,
              "ifs": today["day".concat(todays.indexs[i])]
            };
          } // 패턴

        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        var _iterator6 = _createForOfIteratorHelper(features),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var feature = _step6.value;
            var data = ifs[feature.get('regId')];
            var style = data ? data.ifs : "0";
            feature.setStyle(styles.ifs[style]);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
    }

    if (_THIS.layers.length === 0 && datas) {
      fetch("".concat(APP_URL, "/js/info/wrnArea.geojson")).then(function (data) {
        return data.json();
      }).then(function (result) {
        result.features = result.features.filter(function (r) {
          return r.properties.code === "L1";
        });

        for (var i = 0; i < datas.indexs.length; i++) {
          _THIS.options.layer.visible = i === 0;

          var layer = _map.addVectorLayer(_THIS, new ol.format.GeoJSON({
            featureProjection: PROJ
          }).readFeatures(result));

          _THIS.layers.push(layer);
        }

        if (datas !== null) {
          mergeFeatures(datas);
        }
      }); // add overlay

      addTooltip(_THIS, _map);
    } else {
      if (datas !== null) {
        _THIS.index = 0;
        _THIS.active = true;
        mergeFeatures(datas);

        _THIS.layers[_THIS.index].setVisible(true);
      } else {
        _THIS.active = false;
        if (_THIS.overlay) _THIS.overlay.setPosition(undefined);
        if (_THIS.layers[_THIS.index]) _THIS.layers[_THIS.index].setVisible(false);
      }
    }
  };

  function addTooltip(_THIS, _map) {
    var tooltipElement = document.createElement("div");

    _map.addOverlay({
      self: _THIS,
      element: tooltipElement,
      className: 'ov-tooltip',
      offset: [0, -30],
      positioning: 'center-center'
    });

    _map.addPointerInteraction(_THIS, function (e, f, c) {
    	if(_map.lang!=="ko") return false;
        if(f) {
            let str = f.get("regKo");		// regKo, regEn
            if(_map.lang==="ko") {
                if(f.getProperties().data) {
                    for(data of f.getProperties().data) {
                        let name = styles.wrn.data[data.wrn].name;
                        let lvl = (data.effect === true) ? (data.lvl === "2" ? "주의" : "경보") : "예비";
                        str += `<br/>${name}(${lvl})`;
                    
                        if(data.lvl !== "1") {
							// 특보 발효시각, 발표시각 항상 표출
                        	str += `<br/>발표시각:${data.tmFc.substr(6,2)}일${data.tmFc.substr(8,2)}:${data.tmFc.substr(10,2)}`;
                            str += `<br/>발효시각:${data.tmEf.substr(6,2)}일${data.tmEf.substr(8,2)}:${data.tmEf.substr(10,2)}이후`;
                        }
                    	
                        
                    }
                }
            }
            tooltipElement.innerHTML = str;
            _THIS.overlay.setPosition(c);
        } else {
            _THIS.overlay.setPosition(undefined);
        }
    });
  }
  /**
   * 도로위험기상 - 어는비
   */


  kmap.prototype.setRws = function setRws(RWS) {
    this.removeStaticLayer(this._RWS);

    if (RWS !== null) {
      assert(RWS.urls != undefined && RWS.urls instanceof Array && RWS.urls.length > 0, "도로위험기상 urls 오류");
      this.addStaticLayer(this._RWS, this._mapInfo["frc.extent"], RWS);
    }
  };


  kmap.prototype.removeVectorLayer = function removeVectorLayer(_THIS) {
    this.removeLayer(_THIS);
    _THIS.active = false;
  };
  /**
   * 벡터 레이어 추가
   * @param {*} _THIS 벡터 레이어
   * @param {*} option 적용 선택 사항
   */


  kmap.prototype.addVectorLayer = function addVectorLayer(_THIS, features, index) {
    _THIS.index = index ? index : 0;
    var source = new ol.source.Vector({
      features: features
    });
    var lopt = {
      source: source
    };

    if (_THIS.options && _THIS.options.layer) {
      Object.assign(lopt, _THIS.options.layer);
    }

    var layer = new ol.layer.Vector(lopt);
    _THIS.source = source;
    _THIS.features = source.getFeatures();
    _THIS.layer = layer;
    _THIS.active = true;

    this._map.addLayer(layer);

    return layer;
  };

  kmap.prototype.addPointerInteraction = function addPointerInteraction(_THIS, callback) {
    var _this = this;

    var pointer = new ol.interaction.Pointer({
      handleMoveEvent: function handleMoveEvent(e) {
        if (e.dragging) return false;

        var feature = _this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
          if (_THIS.layers[_THIS.index] === layer) {
            return feature;
          }
        });

        var coordinates = _this.map.getEventCoordinate(e.originalEvent);

        callback.call(_this, e, feature, coordinates);
      }
    });

    this._map.addInteraction(pointer);
  };

  kmap.prototype.addSelectInteraction = function addSelectInteraction(_THIS, callback, clearTime) {
    var layers = [];
    if (_THIS.hasOwnProperty("layer") && _THIS.layer != null) layers.push(_THIS.layer);
    if (_THIS.hasOwnProperty("layers") && _THIS.layers.length > 0) layers = layers.concat(_THIS.layers);
    var select = new ol.interaction.Select({
      condition: ol.events.condition.click,
      layers: layers
    });

    this._map.addInteraction(select);

    select.on('select', function (e) {
      if (clearTime) {
        setTimeout(function () {
          select.getFeatures().clear();
        }, clearTime);
      }

      if (callback && typeof callback === "function") {
        callback(e);
      }
    });
  };

  kmap.prototype.addOverlay = function addOverlay(options) {
    var overlay = new ol.Overlay({
      id: options.id || '',
      element: options.element || '',
      className: options.className || '',
      offset: options.offset || [0, 0],
      positioning: options.positioning || 'center-center'
    });

    if (options.self) {
      options.self.overlay = overlay;
    }

    this._map.addOverlay(overlay);

    return overlay;
  };
  /**
   * 관측 지점 정보 Layer 생성
   */


  kmap.prototype.setObs = function setObs(data, options) {
    function mergeFeatures(features, data) {
      var _iterator7 = _createForOfIteratorHelper(features),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var f = _step7.value;

          var _iterator8 = _createForOfIteratorHelper(data),
              _step8;

          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var d = _step8.value;

              if (f.get("stnId") === d.stnId && f.get("type") === d.type) {
                d.type = f.get("type");
                d.stnKo = f.get("stnKo");
                d.stnEn = f.get("stnEn");
                d.coord = ol.proj.transform(f.getGeometry().getCoordinates(), PROJ, 'EPSG:4326');
                f.set("data", d);
                break;
              }
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      return features;
    }

    var type = options.type;
    var layer = this._OBS[type].layer;

    if (!layer) {
      var _this3 = this;

      var _option = resolutions.obs[type];
      var obsResolution = _option.resolutions;

      var styleFunction = function styleFunction(feature, resolution) {
        var display = _.find(obsResolution, function (r) {
          return resolution < r.max && resolution >= r.min;
        });
        var displayLevel = display ? display.level : [];
        var overlay = feature.get('overlay');
        var visible = displayLevel.indexOf(feature.get('level')) > -1;

        if (visible) {
          if (!overlay) {
            var element = overlayElement(_this3, feature, type);

            var stnOverlay = _this3.addOverlay({
              element: element,
              offset: _option.offset
            });

            stnOverlay.setPosition(feature.getGeometry().getCoordinates());
            feature.set('overlay', stnOverlay);
            feature.set('ops', options);

            stnOverlay.element.firstElementChild.onclick = function (event) {
              var data = getObsInfo(_this3, event.target.dataset);
              if (options && options.callback && typeof options.callback === "function") options.callback(data);
            };
          }

          return styles.obs[feature.get('type')];
        } else {
          if (overlay) _this3.map.removeOverlay(overlay);
          feature.set('overlay', null);
          return undefined;
        }
      };

      layer = new ol.layer.Vector({
        id: type,
        source: new ol.source.Vector(),
        style: styleFunction,
        zIndex: 1000,
        visible: options.visible
      });
      this.map.addLayer(layer);
      this._OBS[type].layer = layer;
      addPoiPoint(layer, type, function (f) {
        mergeFeatures(f, data);
      });
    } else {
      if (data) {
        var f = layer.getSource().getFeatures();

        if (f) {
          mergeFeatures(f, data);
        }

        layer.setVisible(options.visible);
      } else {
        layer.setVisible(false);
      }
    }
  };

  kmap.prototype.setPOI = function setPOI(options, index) {
    var type = options.layer;
    var resolutions = {
      cctv: [{
        level: [1, 2, 3],
        max: 3000,
        min: 0
      }],
      sfc: [{
        level: [1, 2, 3],
        max: 3000,
        min: 352.78
      }, {
        level: [1, 2, 3, 4, 5],
        max: 352.78,
        min: 0
      }],
      buoy: [{
        level: [1, 2],
        max: 3000,
        min: 0
      }],
      lhaws: [{
        level: [1, 2],
        max: 3000,
        min: 0
      }],
      seaBuoy: [{
        level: [1, 2],
        max: 3000,
        min: 0
      }],
      upp: [{
        level: [1],
        max: 3000,
        min: 0
      }],
      pm10: [{
        level: [1, 2],
        max: 3000,
        min: 0
      }],
      lgt: [{
        level: [1],
        max: 3000,
        min: 0
      }]
    };

    var styleFunction = function styleFunction(feature, resolution) {
      var visible = true;

      if (resolutions[type]) {
        var display = _.find(resolutions[type], function (r) {
          return resolution < r.max && resolution >= r.min;
        });
        var displayLevel = display ? display.level : [];
        visible = displayLevel.indexOf(feature.get('level')) > -1;
      }

      var style = type === "cctv" ? styles.cctv[feature.get('level')] : styles.obs[feature.get('type')];
      return visible ? style : undefined;
    };

    this.mapLayers[index] = new ol.layer.Vector({
      visible: options.visible,
      source: new ol.source.Vector(),
      style: styleFunction,
      zIndex: options.zIndex
    });
    this.map.addLayer(this.mapLayers[index]); // add features

    addPoiPoint(this.mapLayers[index], type);
  };

  function addPoiPoint(layer, type, callback) {
    var result = null;
    var count = 0;
    var urls = {
      cctv: ["/js/info/cctv_new.geojson"],
      sfc: ["/js/info/sfc.geojson", "/js/info/aws.geojson"],
      buoy: ["/js/info/buoy.geojson"],
      lhaws: ["/js/info/lhaws.geojson"],
      seaBuoy: ["/js/info/seaBuoy.geojson"],
      air: ["/js/info/air.geojson"],
      upp: ["/js/info/upp.geojson"],
      pm10: ["/js/info/pm10.geojson"],
      lgt: ["/js/info/lgt.geojson"]
    };
    urls[type].forEach(function (url) {
      fetch(APP_URL + url).then(function (res) {
        return res.json();
      }).then(function (data) {
        if (result != null) {
          result.features = result.features.concat(data.features);
        } else {
          result = data;
        }

        count++;

        if (count === urls[type].length) {
          var f = new ol.format.GeoJSON({
            featureProjection: PROJ
          }).readFeatures(result);
          layer.getSource().addFeatures(f);

          if (callback && typeof callback === "function") {
            callback(f);
          }
        }
      });
    });
  }

  kmap.prototype.selectPoi = function selectPoi(callback) {
    var _this = this;

    var select = new ol.interaction.Select({
      condition: ol.events.condition.click,
      layers: _this.mapLayers
    });
    select.on('select', function (e) {
      var feature = e.selected[0];
      setTimeout(function () {
        select.getFeatures().clear(); // 선택 해제
      }, 1000);

      if (feature && callback && typeof callback === "function") {
        var id = feature.get('stnId');
        var type = feature.get('type');
        callback.call(self, {
          feature: feature,
          type: type,
          id: id
        });
      }
    });

    _this.map.addInteraction(select);
  };

  kmap.prototype.clickMap = function clickMap(callback) {
    if (callback && typeof callback === "function") {
      this.map.on('click', function (e) {
        var coord = e.coordinate;
        var coord4326 = ol.proj.toLonLat(coord, PROJ);
        callback(coord4326);
      });
    }
  };
  /**
   * 관측 지점 정보 Layer 삭제
   */


  kmap.prototype.removeObs = function (id) {
    var map = this._map;
    var types = id.split(",");

    var _iterator9 = _createForOfIteratorHelper(types),
        _step9;

    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        _type = _step9.value;
        map.getLayers().getArray().forEach(function (l) {
          if (l.get('id') === _type) {
            l.getSource().getFeatures().forEach(function (f) {
              map.removeOverlay(f.get('overlay'));
              f.set('overlay', null);
            });
            l.setVisible(false);
          }
        });
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
  };
  /**
   * 지점 상세 정보
   */


  function getObsInfo(_this, dataset) {
    if (dataset.type && dataset.id) {
      var features = _this._OBS[dataset.type].layer.getSource().getFeatures();

      var feature = _.find(features, function (f) {
        return f.get("stnId") == dataset.id;
      });

      if (feature) {
        return feature.get("data");
      }
    }
  } // TODO 단위 옵션 처리 필요


  function overlayElement(_this, f, type) {
    var id = f.get("stnId");
    var name = _this.lang === "ko" ? f.get("stnKo") : f.get("stnEn"); // lang

    name = name ? name : '-';
    var v = f.get("data");
    var ws = "-";
    var ta = "-";
    var rn = "-";
    var whSig = "-";
    var tm = "-";

    if (v) {
      if (type === "sfc") {
        // 지상 관측 (sfc, aws)
        ws = v.ws == undefined ? typeof v.ws10 === "number" ? Number(v.ws10) : v.ws10 : v.ws !== 0 ? Number(v.ws) : "-";
        rn = v.rnDay; 
        tm = v.tm == undefined ? "-" : v.tm;
        // if (v.ws == undefined) { //aws
        //     if (typeof(v.ws10) === "number") {
        //         ws = Number(v.ws10);
        //     } else {
        //         ws = v.ws10;
        //     }
        // } else { // sfc
        //     if (v.ws !== 0) {
        //         ws = Number(v.ws);
        //     }
        // }
      } else {
        // 해상 관측소(buoy, lhaws, seaBuoy), 공항(air)
        ws = v.ws == undefined ? Number(v.ws1) : v.ws !== 0 ? Number(v.ws) : "-";
        rn = v.rn == undefined ? v.rn60m : v.rn; // if (v.ws == undefined) { // buoy
        //     ws =  Number(v.ws1);
        // } else {
        //     if (v.ws !== 0) { // lhaws, air
        //         ws = Number(v.ws);
        //     }
        // }
        // v.rn = v.rn60m;
      }

      rn = rn < 0.01 ? "-" : rn;
      ta = v.ta;
      whSig = v.whSig;

      if (typeof ws === "number") {
        ws = Number((ws * _wsUnitValue).toFixed(1));
      }
    }

    var html = "";
    var element = document.createElement("div");

    element.onmousedown = function () {
      return false;
    };

    switch (type) {
      case "sfc":
        element.className = "sfc";
        html = "<button class='sfcName' data-id='".concat(id, "' data-type='").concat(type, "' data-tm='").concat(tm, "'>").concat(name, "</button>\n                        <span class=\"sfcSection\">").concat(ta, "<span class=\"unit\"> \u2103</span></span>\n                        <span class=\"sfcSection\"><span class=\"value\">").concat(ws, "</span><span class=\"unit\"> ").concat(_wsUnit, "</span></span>\n                        <span class=\"sfcSection\">").concat(rn, "<span class=\"unit\"> mm</span></span>");
        break;

      case "buoy":
        element.className = "buoy weaBuoy";
        html = "<button class='buoyName' data-id='".concat(id, "' data-type='").concat(type, "'>").concat(name, "</button>\n                        <span class=\"buoySection\"><span class=\"value\">").concat(ws, "</span><span class=\"unit\"> ").concat(_wsUnit, "</span></span>\n                        <span class=\"buoySection\">").concat(whSig, "<span class=\"unit\"> m</span></span>");
        break;

      case "lhaws":
        element.className = "buoy lhaws";
        html = "<button class='buoyName' data-id='".concat(id, "' data-type='").concat(type, "'>").concat(name, "</button>\n                        <span class=\"buoySection\"><span class=\"value\">").concat(ws, "</span><span class=\"unit\"> ").concat(_wsUnit, "</span></span>");
        break;

      case "seaBuoy":
        element.className = "buoy seaBuoy";
        html = "<button class='buoyName' data-id='".concat(id, "' data-type='").concat(type, "'>").concat(name, "</button>\n                        <span class=\"buoySection\"><span class=\"value\">").concat(whSig, "</span><span class=\"unit\"> m</span></span>");
        break;

      case "air":
        element.className = "sfc";
        html = "<button class='sfcName' data-id='".concat(id, "' data-type='").concat(type, "'>").concat(name, "</button>\n                        <span class=\"sfcSection\">").concat(ta, "<span class=\"unit\"> \u2103</span></span>\n                        <span class=\"sfcSection\"><span class=\"value\">").concat(ws, "</span><span class=\"unit\"> ").concat(_wsUnit, "</span></span>\n                        <span class=\"sfcSection\">").concat(rn, "<span class=\"unit\"> mm</span></span>");
        break;
    }

    element.innerHTML = html;
    return element;
  }
  /**
   * 동네예보 격자 번호 조회
   */


  function getIndexFromPixel(x, y) {
    var index = (y - 1) * DFS_GRID_WIDTH + (x - 1);
    return index;
  }
  /**
   * 낙뢰 레이어 추가
   * @param {*} lgt {lon: lat: color: 이 포함되어 있는}
   */


  kmap.prototype.setLgt = function setLgt(lgts, dateList) {
    var _THIS = this._LGT;

    if (lgts) {
      var length = dateList.length;

      for (var i = 0; i < length; i++) {
        var _i = dateList.length - i - 1;

        date = new Date(dateList[_i]);
        var features = [];

        var _iterator10 = _createForOfIteratorHelper(lgts),
            _step10;

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var lgt = _step10.value;
            var lgtDate = new Date(lgt["date"]);
            diff = (date.getTime() - lgtDate.getTime()) / 600000;
            lgt.index = Math.floor(diff);
            var _index = lgt.index;

            if (0 <= _index && _index < 6) {
              var coord = [lgt.lon, lgt.lat];
              var feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(coord, PROJ)),
                color: _index
              });
              features.push(feature);
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }

        var layer = this.addVectorLayer(_THIS, features);
        layer.setVisible(_i == 0);

        _THIS.layers.push(layer); //과거 ~ 현재 레이어

      }

      _THIS.index = length - 1;
    } else {
      this.removeLayer(_THIS);
    }
  };
  /**
   * 내위치 overlay 생성
   */


  kmap.prototype.addGeolocation = function (myLocation) {
    this.addLocation(myLocation);
    this.setCenter(myLocation);
  };
  /**
   * 내위치 overlay 제거
   */


  kmap.prototype.removeGeolocation = function () {
    var geolocation = this._map.getOverlayById('geo-location');

    this._map.removeOverlay(geolocation);
  };

  kmap.prototype.on = function (event, handler) {
    this._map.on(event, handler);
  };

  kmap.prototype.un = function (event, handler) {
    this._map.un(event, handler);
  };

  kmap.prototype.once = function (event, handler) {
    this._map.once(event, handler);
  };

  kmap.prototype.onForView = function (event, handler) {
    this._view.on(event, handler);
  };

  kmap.prototype.onceForView = function (event, handler) {
    this._view.once(event, handler);
  };

  kmap.prototype.unForView = function (event, handler) {
    this._view.un(event, handler);
  };

  kmap.prototype.flyTo = function (lonlatCoord, duration) {
    duration ? duration : 500; // view가 변하므로 map에서 호출하여 사용

    this.map.getView().animate({
      center: ol.proj.fromLonLat(lonlatCoord, PROJ),
      duration: duration
    });
  };

  kmap.prototype.setMapLayersVisible = function (index, visible) {
    this.mapLayers[index].setVisible(visible);
  };

  kmap.prototype.toLonLat = function toLonLat(x, y) {
    return ol.proj.toLonLat([x, y], PROJ);
  };

  kmap.prototype.toLCC = function toLonLat(x, y) {
    return ol.proj.fromLonLat([x, y], PROJ);
  };

  kmap.prototype.setZoom = function setZoom(number) {
    return this.map.getView().setZoom(number);
  };

  kmap.prototype.setCenter = function setCenter(coordinates) {
    // coordinates = [x, y];
    return this.map.getView().setCenter(ol.proj.fromLonLat(coordinates, PROJ));
  };

  kmap.prototype.getGridFromCoord = function getGridFromCoord(coord) {
    var x = Math.ceil((coord[0] - _dfs_extent[0]) / _dfs_x_offset);
    var y = Math.ceil((coord[1] - _dfs_extent[1]) / _dfs_y_offset);
    return [x, y];
  };

  kmap.prototype.addLocation = function addLocation(coordinates) {
    this.removeLocation(); // 경위도 정규식

    var regexLon = /^[-+]?(180(\.0{0,20})?|((1[0-7]\d)|([1-9]?\d))(\.\d{0,20})?)$/;
    var regexLat = /^[-+]?(90(\.0{0,20})?|(([0-8]\d)|([1-8]?\d))(\.\d{0,20})?)$/;

    if (!regexLon.test(coordinates[0]) || !regexLat.test(coordinates[1])) {
      return false;
    } // coordinates = [x, y];


    var s = new ol.source.Vector({
      features: [new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates, PROJ))
      })]
    });
    var l = new ol.layer.Vector({
      id: 'myLocation',
      visible: true,
      zIndex: 1500,
      source: s,
      style: new ol.style.Style({
        image: new ol.style.Icon({
          src: icon.location,
          scale: 0.7,
          anchor: [0.5, 0],
          anchorOrigin: 'bottom-left'
        })
      })
    });
    this.map.addLayer(l);
  };

  kmap.prototype.removeLocation = function removeLocation() {
    var l = _.find(this.map.getLayers().getArray(), function (l) {
      return l.get('id') === 'myLocation';
    });
    this.map.removeLayer(l);
  };

  kmap.prototype.readGeojson = function readGeojson(json) {
    var list = [];
    var features = new ol.format.GeoJSON({
      featureProjection: "EPSG:4326"
    }).readFeatures(json);

    var _iterator11 = _createForOfIteratorHelper(features),
        _step11;

    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var feature = _step11.value;
        var f = {};
        f.data = feature.getProperties();
        f.coord = feature.getGeometry().getCoordinates(), PROJ;
        list.push(f);
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }

    return list;
  };
/**
     * 특별기상지원
     */
    kmap.prototype.addSpecialPoint = function addSpecialPoint(coord, imageSrc, imageScale, options) {
        // options
        // {data: {}, title: "해수욕장", offsetX: 0, offsetY: -50}

        // feature
        const f = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coord, PROJ))
        });

        // style
        const s = new ol.style.Style({
            image: new ol.style.Icon({
                src: imageSrc ? imageSrc : icon.location,
                scale: (imageScale !== undefined && imageScale !== null) ? imageScale : 1,
                anchor: [0.5, 0],
                anchorOrigin: 'bottom-left'
            }),
            text: new ol.style.Text({
                fill: ol.style.Fill({ color: '#fff' }),
                scale: 1.3,
                textAlign: 'center',
                textBaseline: 'top',
                text: (options && options.title) ? options.title : "",
                offsetX: (options && options.offsetX) ? options.offsetX : 0,
                offsetY: (options && options.offsetY) ? options.offsetY : 0,
                stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
            })
        });
        f.setStyle(s);

        // data
        var data = (options && options.data) ? options.data : null;
        f.set("data", data);

        // layer
        var l = this.getSpecialLayer();
        l.getSource().addFeature(f);
    }

    kmap.prototype.callbackSpecialPoint = function callbackSpecialPoint(callback) {
        var l = this.getSpecialLayer();

        if(callback && typeof(callback) === "function") {
            var select = new ol.interaction.Select({
                condition: ol.events.condition.click,
                layers: [l]
            });
            select.on('select', function (e) {
                select.getFeatures().clear(); // 선택 해제
                let feature = e.selected[0];
                if(feature) {
                    callback(e.mapBrowserEvent, feature.get('data'));
                }
            });
            this.map.addInteraction(select);
        }
    }

  kmap.prototype.removeSpecialPoint = function removeSpecialPoint() {
    var l = this.findSpecialLayer();

    if (l) {
      this.map.removeLayer(l);
    }
  };

  kmap.prototype.getSpecialLayer = function getSpecialLayer() {
    var l = this.findSpecialLayer();

    if (!l) {
      l = new ol.layer.Vector({
        id: 'specialPoint',
        visible: true,
        zIndex: 1500,
        source: new ol.source.Vector()
      });
      this.map.addLayer(l);
      
      // 커서 변경
      var _this = this;
      this.map.on('pointermove', function(e) {
          if (e.dragging) {
              return false;
          }
          var pixel = _this.map.getEventPixel(e.originalEvent);
          var hit = _this.map.hasFeatureAtPixel(pixel, {
              layerFilter: function(layer) {
                  return layer === l;
              }
          });
          _this.map.getTargetElement().style.cursor = (hit ? 'pointer' : '');
      });
    }
    
    return l;
  };

  kmap.prototype.findSpecialLayer = function findSpecialLayer() {
    var l = _.find(this.map.getLayers().getArray(), function (l) {
      return l.get('id') === 'specialPoint';
    });
    return l;
  };
  /**
   * 거리재는 기능
   * 1. 거리를 나타내는 layer생성
   * 2. pointer handler
   * 3. interaction (draw)
   * 4. overlay  -> measure tool tip
   */


  var draw;
  var sketch; //Currently drawn feature.

  var measureTooltipElement; //measureTooltip의 target element

  var measureTooltip; //측정 거리가 나오는 오버레이

  var distanceSource = new ol.source.Vector(); // 거리는 나타내는 vector layer와 interaction draw가 이 source 공유

  kmap.prototype.addMeasureTool = function addMeasureTool() {
    var map = this._map;
    var distanceLayer = new ol.layer.Vector({
      source: distanceSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 4
        })
      }),
      zIndex: 1000
    });
    var distanceEdgeLayer = new ol.layer.Vector({
      source: distanceSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#000000',
          width: 6
        })
      }),
      zIndex: 1000
    });
    addInteraction(map, distanceSource); //거리를 나타내는 layer생성

    map.addLayer(distanceEdgeLayer);
    map.addLayer(distanceLayer);
  };

  kmap.prototype.removeMeasureTool = function removeMeasureTool() {
    var map = this._map;
    map.removeInteraction(draw);
    distanceSource.clear(); //removeMeasureTooltip

    var overlays = map.getOverlays().getArray();
    var length = overlays.length;

    for (var i = 1; i <= length; i++) {
      var _index2 = length - i;

      var overlay = overlays[_index2];
      var type = overlay.options.type;

      if (type == 'measure') {
        map.removeOverlay(overlay);
      }
    }
  };
  /**
   * **** FUNCTIONS ****
   * 거리 재기 함수들
   * for draw interaction(measure distance)
   * */
  // map에 draw interaction 추가
  // drawstart, drawend에 관한 내용 포함되어 있음


  function addInteraction(map, distanceSource) {
    draw = new ol.interaction.Draw({
      source: distanceSource,
      type: 'LineString',
      stopClick: true,
      style: [new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#000000',
          lineDash: [10, 10],
          width: 6
        })
      }), new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          lineDash: [10, 10],
          width: 4
        })
      }), new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })]
    });
    createMeasureTooltip(map);
    var listener;
    draw.on('drawstart', function (evt) {
      // set sketch
      sketch = evt.feature;
      var tooltipCoord = evt.coordinate;
      listener = sketch.getGeometry().on('change', function (evt) {
        var geom = evt.target;
        var output;

        if (geom instanceof ol.geom.LineString) {
          var length = ol.sphere.getLength(geom);

          if (length > 100) {
            output = Math.round(length / 1000 * 100) / 100 + ' ' + 'km';
          } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
          }

          tooltipCoord = geom.getLastCoordinate();
        }

        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });
    map.addInteraction(draw);
    draw.on('drawend', function () {
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      measureTooltip.setOffset([0, -7]); // unset sketch

      sketch = null; // unset tooltip so that a new one can be created

      measureTooltipElement = null;
      createMeasureTooltip(map);
      ol.Observable.unByKey(listener);
    });
  }
  /**
   * Creates a new measure tooltip
   */


  function createMeasureTooltip(map) {
    if (measureTooltipElement) measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
      type: "measure",
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
  }

  var icon = {
        lgt: {
            aqua: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACQElEQVR4Xu2c0UkEURRD33RkCZagFYkV2IodaAl2NDIIon+ZkMzV5ex3krt7joOwgtv6D699v19rvZ18q49r215Pdi6Pb5dfdA4iwKEW7CAgCNOZQoBDLdhBQBCmM4UAh1qwg4AgTGcKAQ61YAcBQZjOFAIcasEOAoIwnSkEONSCHQQEYTpTCHCoBTsICMJ0phDgUAt2EBCE6UwhwKEW7CAgCNOZQoBDLdhBQBCmM4UAh1qwg4AgTGcKAQ61YAcBQZjOFAIcasEOAoIwnSkEONSCHQQEYTpTCHCoBTsICMJ0phDgUAt2EBCE6UwhwKEW7CAgCNOZQoBDLdhBQBCmM4UAh1qwg4AgTGcKAQ61YOemBXx9uL/+ultrvZx8k89rrfeTncvj29r3/fKrHPwmgIDhHwYEIGCYwPB5ngAEDBMYPs8TgIBhAsPneQIQMExg+DxPAAKGCQyfP56Ah+H3oJw/vox7UoI/MseXcR8nO5fH+a+JlyP/fRABCBAI3PQfZITPPx5BwLACBCCgRYBfwi2y4i4CRFCtGAJaZMVdBIigWjEEtMiKuwgQQbViCGiRFXcRIIJqxRDQIivuIkAE1YohoEVW3EWACKoVQ0CLrLiLABFUK4aAFllxFwEiqFYMAS2y4i4CRFCtGAJaZMVdBIigWjEEtMiKuwgQQbViCGiRFXcRIIJqxRDQIivuIkAE1YohoEVW3EWACKoVQ0CLrLiLABFUK4aAFllxFwEiqFYMAS2y4i4CRFCtGAJaZMXdT/DTdNge1e1hAAAAAElFTkSuQmCC",
            blue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACP0lEQVR4Xu2cwU3EUBQDfzqiBEqAihAV0AodQAl0FBQOCG6OZefBavZs+y0zGyEtEtv6F6/9fq31dvKtPq61vZ7sXB7fLr9oHUSAhS1XQkCOpbWEAAtbroSAHEtrCQEWtlwJATmW1hICLGy5EgJyLK0lBFjYciUE5FhaSwiwsOVKCMixtJYQYGHLlRCQY2ktIcDClishIMfSWkKAhS1XQkCOpbWEAAtbroSAHEtrCQEWtlwJATmW1hICLGy5EgJyLK0lBFjYciUE5FhaSwiwsOVKCMixtJYQYGHLlRCQY2ktIcDClishIMfSWkKAhS1XQkCOpbWEAAtbroSAHEtrCQEWtlwJATmW1hICLGy50k0L+Prh/vrrbq31cvJNPq+13k92Lo9va+375Vc5+E0AAcMfBgQgYJjA8HmeAAQMExg+zxOAgGECw+d5AhAwTGD4PE8AAoYJDJ8/noCH4fegnD++jHtSgj8yx5dxHyc7l8f5r4mXI/99EAEIUAjc9B9kFADTGQQMG0AAAkoE+CVcAqvOIkAlVcohoARWnUWASqqUQ0AJrDqLAJVUKYeAElh1FgEqqVIOASWw6iwCVFKlHAJKYNVZBKikSjkElMCqswhQSZVyCCiBVWcRoJIq5RBQAqvOIkAlVcohoARWnUWASqqUQ0AJrDqLAJVUKYeAElh1FgEqqVIOASWw6iwCVFKlHAJKYNVZBKikSjkElMCqswhQSZVyCCiBVWcRoJIq5RBQAqvOIkAlVcohoARWnf0EgNAU5g1+l4QAAAAASUVORK5CYII=",
            green: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACQklEQVR4Xu2cwU0DURQD33aUEigBKiJUQCt0ACXQUaIICcHNa9n7IZqcbb9kJiskkNjmP7zO8zAz7zvf6tOc521n5/D4dvhF5yACHGrBDgKCMJ0pBDjUgh0EBGE6UwhwqAU7CAjCdKYQ4FALdhAQhOlMIcChFuwgIAjTmUKAQy3YQUAQpjOFAIdasIOAIExnCgEOtWAHAUGYzhQCHGrBDgKCMJ0pBDjUgh0EBGE6UwhwqAU7CAjCdKYQ4FALdhAQhOlMIcChFuwgIAjTmUKAQy3YQUAQpjOFAIdasIOAIExnCgEOtWAHAUGYzhQCHGrBDgKCMJ0pBDjUgh0EBGE6UwhwqAU7CAjCdKYQ4FALdu5awNeH+9uvy5xmm9edb/JlZj52dg6Pb3Oey+FXOfhNAAGLvwwIQMBiAovP8wQgYDGBxed5AhCwmMDi8zwBCFhMYPF5ngAELCaw+PztCXhc/B6U86eZeVaCPzK3X8Z97uwcHue/Jh6O/PdBBCBAIHDXf5ARPv/yCAIWK0AAAloE+CHcIivuIkAE1YohoEVW3EWACKoVQ0CLrLiLABFUK4aAFllxFwEiqFYMAS2y4i4CRFCtGAJaZMVdBIigWjEEtMiKuwgQQbViCGiRFXcRIIJqxRDQIivuIkAE1YohoEVW3EWACKoVQ0CLrLiLABFUK4aAFllxFwEiqFYMAS2y4i4CRFCtGAJaZMVdBIigWjEEtMiKuwgQQbViCGiRFXcRIIJqxRDQIivuIkAE1YohoEVW3L0CadoO9OiFYNgAAAAASUVORK5CYII=",
            purple: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACS0lEQVR4Xu2c0UkDURRE33a0JViClmAH6UCsQDuIJdhBLCEdraiI+JUZmNmn4eR7Zm5yjosQwWX8g9dhPd6MsZy8t7rdPZ/vX73O/ull/5P+RQT4zKINBERx+mMI8JlFGwiI4vTHEOAzizYQEMXpjyHAZxZtICCK0x9DgM8s2kBAFKc/hgCfWbSBgChOfwwBPrNoAwFRnP4YAnxm0QYCojj9MQT4zKINBERx+mMI8JlFGwiI4vTHEOAzizYQEMXpjyHAZxZtICCK0x9DgM8s2kBAFKc/hgCfWbSBgChOfwwBPrNoAwFRnP4YAnxm0QYCojj9MQT4zKINBERx+mMI8JlFGwiI4vTHEOAzizYQEMXpjyHAZxZtXLWArw/351/rGMuT9y63xzHGm9fZP70c1pdt/7Nc/CaAgMk/CwhAwGQCk8/zBCBgMoHJ53kCEDCZwOTzPAEImExg8nmeAARMJjD5/HJYj7eT34Ny/uPLuAcl+JP5/DLu7HX2T/NfE/dn/usiAhBwmcBV/0Hm8sefn0DAZAcIQECNAL+Ea2i1YQRonGopBNTQasMI0DjVUgioodWGEaBxqqUQUEOrDSNA41RLIaCGVhtGgMaplkJADa02jACNUy2FgBpabRgBGqdaCgE1tNowAjROtRQCami1YQRonGopBNTQasMI0DjVUgioodWGEaBxqqUQUEOrDSNA41RLIaCGVhtGgMaplkJADa02jACNUy2FgBpabRgBGqdaCgE1tNowAjROtRQCami1YQRonGopBNTQasPvJuMQgXUHsx8AAAAASUVORK5CYII=",
            red: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACQ0lEQVR4Xu2c0UkDURRE73ZkCZagFYkV2IodaAl2FFkIol+ZHWb2YTh+z8xNzskiRHCbf/BzmXmcmY+DL/V5m3k/2Dk9vp1+0TiIAANasoKAJE1jCwEGtGQFAUmaxhYCDGjJCgKSNI0tBBjQkhUEJGkaWwgwoCUrCEjSNLYQYEBLVhCQpGlsIcCAlqwgIEnT2EKAAS1ZQUCSprGFAANasoKAJE1jCwEGtGQFAUmaxhYCDGjJCgKSNI0tBBjQkhUEJGkaWwgwoCUrCEjSNLYQYEBLVhCQpGlsIcCAlqwgIEnT2EKAAS1ZQUCSprGFAANasoKAJE1jCwEGtGQFAUmaxhYCDGjJCgKSNI0tBBjQkpW7FnB9c0leja2HmXk7OPw6M58HO6fHt8vM5fSrHPwhgIDFHwYEIGAxgcXneQIQsJjA4vM8AQhYTGDxeZ4ABCwmsPg8TwACFhNYfH5/Ap4Wvwbl/P5l3IsS/JXZv4z7Otg5Pc5/TTwd+d+DCEDAbQJ3/QeZ229/fQIBix0gAAE1AvwSrqHVhhGgcaqlEFBDqw0jQONUSyGghlYbRoDGqZZCQA2tNowAjVMthYAaWm0YARqnWgoBNbTaMAI0TrUUAmpotWEEaJxqKQTU0GrDCNA41VIIqKHVhhGgcaqlEFBDqw0jQONUSyGghlYbRoDGqZZCQA2tNowAjVMthYAaWm0YARqnWgoBNbTaMAI0TrUUAmpotWEEaJxqKQTU0GrDCNA41VIIqKHVhhGgcaqlEFBDqw1/A0DDFObDtd2UAAAAAElFTkSuQmCC",
            yellow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACQ0lEQVR4Xu2c0UkDURRE33ZkCZagFYkV2IodaAl2tBIIol+ZHWb2Yjh+z8xNzskiRHBb/+Bn39fjWuvj4Et93rb1frBzenw7/aJxEAEGtGQFAUmaxhYCDGjJCgKSNI0tBBjQkhUEJGkaWwgwoCUrCEjSNLYQYEBLVhCQpGlsIcCAlqwgIEnT2EKAAS1ZQUCSprGFAANasoKAJE1jCwEGtGQFAUmaxhYCDGjJCgKSNI0tBBjQkhUEJGkaWwgwoCUrCEjSNLYQYEBLVhCQpGlsIcCAlqwgIEnT2EKAAS1ZQUCSprGFAANasoKAJE1jCwEGtGQFAUmaxhYCDGjJCgKSNI0tBBjQkhUEJGkaWwgwoCUrdy3g+uaSvBpbD2utt4PDr2utz4Od0+Pbvq/99Ksc/CGAgOEPAwIQMExg+DxPAAKGCQyf5wlAwDCB4fM8AQgYJjB8nicAAcMEhs9fnoCn4degnL98GfeiBH9lLl/GfR3snB7nvyaejvzvQQQg4DaBu/6DzO23P59AwLADBCCgRoBfwjW02jACNE61FAJqaLVhBGicaikE1NBqwwjQONVSCKih1YYRoHGqpRBQQ6sNI0DjVEshoIZWG0aAxqmWQkANrTaMAI1TLYWAGlptGAEap1oKATW02jACNE61FAJqaLVhBGicaikE1NBqwwjQONVSCKih1YYRoHGqpRBQQ6sNI0DjVEshoIZWG0aAxqmWQkANrTaMAI1TLYWAGlptGAEap1oKATW02jACNE61FAJqaLXhb7DGdNgx8yWzAAAAAElFTkSuQmCC"
        },
        weather: {
            wico_briefrain: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAAGQCAYAAAA9XmC5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNGQzFENkIyMjdEMjExRUI5QzQyREM1RTUxRDI0RjNCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNGQzFENkIzMjdEMjExRUI5QzQyREM1RTUxRDI0RjNCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0ZDMUQ2QjAyN0QyMTFFQjlDNDJEQzVFNTFEMjRGM0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0ZDMUQ2QjEyN0QyMTFFQjlDNDJEQzVFNTFEMjRGM0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5BJxflAAAv7UlEQVR42uydD3SU5Zno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",
            wico_briefsnow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAAGQCAYAAAA9XmC5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZFOTEzM0RGMjdEMjExRUJBQkI2RDEyNzVGQzNEQTUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZFOTEzM0UwMjdEMjExRUJBQkI2RDEyNzVGQzNEQTUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkU5MTMzREQyN0QyMTFFQkFCQjZEMTI3NUZDM0RBNTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkU5MTMzREUyN0QyMTFFQkFCQjZEMTI3NUZDM0RBNTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4nbLHLAAA280lEQVR42uydDXBU5b3w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",
            SKY1D: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMyMEYzQzdCMjdEMDExRUI4OTFDRDY2Njc3NTUwNjlEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMyMEYzQzdDMjdEMDExRUI4OTFDRDY2Njc3NTUwNjlEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzIwRjNDNzkyN0QwMTFFQjg5MUNENjY2Nzc1NTA2OUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzIwRjNDN0EyN0QwMTFFQjg5MUNENjY2Nzc1NTA2OUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6N6Zw5AAAQgElEQVR42uzd23VbVR7A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",
            SKY1N: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJERDEwQTU0MjdEMDExRUJCNjU0Q0IwQzU4MjZDRDM3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJERDEwQTU1MjdEMDExRUJCNjU0Q0IwQzU4MjZDRDM3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkREMTBBNTIyN0QwMTFFQkI2NTRDQjBDNTgyNkNEMzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkREMTBBNTMyN0QwMTFFQkI2NTRDQjBDNTgyNkNEMzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz54fPjLAAAVDklEQVR42uzdy3UbR77A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",
            SKY4: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkyNDNEMTE0MjdEMTExRUJCNUU2QkQzRkVDQTUzMzYzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkyNDNEMTE1MjdEMTExRUJCNUU2QkQzRkVDQTUzMzYzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI0M0QxMTIyN0QxMTFFQkI1RTZCRDNGRUNBNTMzNjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTI0M0QxMTMyN0QxMTFFQkI1RTZCRDNGRUNBNTMzNjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7KXn0JAAAvZklEQVR42uydC3BU5dmA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",
            wico_fog: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0QjExQjEzMDI3RDQxMUVCOTIyRUNBNzRCOTcxRDBGQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0QjExQjEyRjI3RDQxMUVCOTIyRUNBNzRCOTcxRDBGQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuIIeTAAAATWSURBVHja7NjRDYMwDEVRXGUptuto/YKxXrtCK2JS6ZwFLIyUq6SSbADwrYcVACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAgIAAICQLPRPvGsWDvAJHvKDQSApQkIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAAXKOS9A6ssnWASTrPdDcQAAQEAAEBQEAAEBAAEBAABAQAAQFAQAAQEAAQEAAEBAABAUBAABAQABAQAAQEAAEBQEAAEBAAEBAABAQAAQFAQAAQEAAQEAAEBAABAUBAABAQABAQAAQEAAEBQEAAEBAAEBAABAQAAQFAQADgY3QPzLE9rR1gmrYztpL0ftpZ8X8BJtlTXaM8YQEgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAsA1xg0zX9YO8P8qSe/AKlsHmKTzTPeEBYCAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAICAAICgIAAICAACAgACAgAvxrdA3NssXaAacoNBIClCQgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIABco5LYAgBuIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIBYAQACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAAICAACAgAAgLA8t4CDACw/iRf5vOkswAAAABJRU5ErkJggg==",
            SKY3D: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQzQ0Q5ODQwMjdEMDExRUJCQzg2QjlEMDhCQjJCNTVEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQzQ0Q5ODQxMjdEMDExRUJCQzg2QjlEMDhCQjJCNTVEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDNDRDk4M0UyN0QwMTFFQkJDODZCOUQwOEJCMkI1NUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDNDRDk4M0YyN0QwMTFFQkJDODZCOUQwOEJCMkI1NUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7OkVISAAAl30lEQVR42uzdf3DU9Z3H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",
            SKY3N: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGNUFERjNDMjdEMDExRUI5OTA2RkJDNkJBQTIyN0RBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGNUFERjNEMjdEMDExRUI5OTA2RkJDNkJBQTIyN0RBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUY1QURGM0EyN0QwMTFFQjk5MDZGQkM2QkFBMjI3REEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUY1QURGM0IyN0QwMTFFQjk5MDZGQkM2QkFBMjI3REEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7x21sPAAAljUlEQVR42uzdC3gV5b3v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",
            wico_mist: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RDRGQUM5MDI3RDQxMUVCOUVDREI2REE0MzRFQkIyQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RDRGQUM4RjI3RDQxMUVCOUVDREI2REE0MzRFQkIyQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnCGWzQAAASsSURBVHja7NfBDYAgEERR19CU/Sda1tgAFw0QDu81QDIHfraSHADw1WkCAAQEAAEBQEAAEBAAEBAABAQAAQFAQAAQEAAQEAAEBAABAUBAABAQABAQAAQEAAEBQEAAEBAAEBAABAQAAQFAQAAQEAAQEAAEBAABAUBAABAQABAQAAQEAAEBQEAAEBAAEBAABAQAAQFAQABAQAAQEAAEBAABAUBAAEBAABAQAAQEAAEBQEAAQEAAEBAABAQAAQFAQABAQAAQEAAEBAABAUBAAEBAABAQAAQEAAEBQEAAQEAAEBAABAQAAQFAQABAQAAQEAAEBAABAUBAAEBAABAQAAQEAAEBAAEBQEAAEBAABAQAAQEAAQFAQAAQEAAEBAABAQABAUBAABAQAAQEAAEBAAEBQEAAEBAABAQAAQEAAQFAQAAQEAAEBAABAQABAUBAABAQAAQEAAEBAAEBQEAAEBAABAQABAQAAQFAQAAQEAAEBAAEBAABAUBAABAQAAQEAAQEAAEBQEAAEBAABAQA+tryF5+K2QEmuVIuEAC2JiAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAwRiVZ+2CV1QEmWfmnu0AAEBAABAQAAQFAQABAQAAQEAAEBAABAUBAAEBAABAQAAQEAAEBQEAAQEAAEBAABAQAAQFAQABAQAAQEAAEBAABAUBAAEBAABAQAAQEAAEBQEAAQEAAEBAABAQAAQFAQABAQAAQEAAEBAABAQABAeCvtvrB3EfMDjBNuUAA2JqAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAICAAICwBiVxAoAuEAAEBAABAQAAQEAAQFAQAAQEAAEBAABAQABAUBAABAQAAQEAAEBAAEBQEAAEBAABAQAAQEAAQFAQAAQEAAEBAABAQABAUBAABAQAAQEAAEBAAEBQEAAEBAABAQAAQEAAQFAQAAQEAAEBAABMQEAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAQMcrwACYiRTecVVqRgAAAABJRU5ErkJggg==",
            PTY1: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MDgxNjNBQjI3RDIxMUVCODY1Q0MzQUJCNUI2MjI1QSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MDgxNjNBQTI3RDIxMUVCODY1Q0MzQUJCNUI2MjI1QSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            PTY2: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMkY1MjIzQzI3RDMxMUVCODdFRTk3MTAzOUE5OUNENSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMkY1MjIzQjI3RDMxMUVCODdFRTk3MTAzOUE5OUNENSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            wico_rainsnowbrief: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMjVBQ0I4NDI3RDMxMUVCQjNCMEQ5MkUzQzJCMTcyQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMjVBQ0I4MzI3RDMxMUVCQjNCMEQ5MkUzQzJCMTcyQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            wico_shower: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MjgzQzg0QTI3RDIxMUVCQjdGMThEMDZDNUE3QUNEQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MjgzQzg0OTI3RDIxMUVCQjdGMThEMDZDNUE3QUNEQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            wico_smog: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozQzA0QkE1MzI3RDQxMUVCQTE1QTk5QTU4Q0RCOTQ5QiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozQzA0QkE1MjI3RDQxMUVCQTE1QTk5QTU4Q0RCOTQ5QiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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FQkBom+5YAtB0nQ7bXCU+ChqnvBIO13Pp9H04NimaVmVACFIYiabxZsJjoaCRPZH+vk0MqV2P44AIUioOEBFQsVBgAQeJM/RQRsyYisOgiP7IJGKhM32xirjHT6cAUiA+NdBN9kgoYPWRsJihxl70BOb481pp522jUpbzfOJ1DzB2WmDw5sJDgHibyeVDvqEYf15umpjV+zXcSiqnqlKpq423vLlWTIESJhVSb/tpL10RvOW/KbaUFmV9DPpqZBN8V22nZa8/l4JEMKE0ABhQmgQIJisk64xY2dx5QPqiMXkZ29M96cKvK1Wt9NQJj6l8XYa8uSGAImrOil4GCiDVR1xkDOoominvR4GSnVgFGNppwRI3BVKr+2k99hAKTg8pBEbFvJz0oZFkW8KdiO+17bTXvvjckO+aAPjpP3zYKzLpwQIJpsBVv90VM0COxuYEVaHwd6q6mIk5g6IhidA1W1yTdW/MtvJ0HibHP9z2YZF5YcKOKAAAQDEq4WPAABAgAAACBAAAAECACBAAAAgQAAABAgAgAABABAgAAACBAAAAgQAQIAAAAgQAAABAgAgQAAAIEAAAAQIAIAAAQAQIAAAAgQAAAIEAECAAAAIEAAAAQIAIEAAACBAAAAECACAAAEAECAAAAIEAAACBABAgAAACBAAAAECACBAAAAgQAAABAgAgAABABAgAAAQIAAAAgQAQIAAAAgQAAABAgAAAQIAIEAAAAQIAIAAAQAQIAAAECAAAAIEAECAAAAIEAAAAQIAAAECACBAAAAECACAAAEAECAAABAgAAACBABAgAAACBAAAAECAAABAgAgQAAABAgAgAABABAgAAAQIAAAAgQAQIAAAAgQAAABAgAAAQIAIEAAAAQIAIAAAQCAAAEAECAAAAIEAECAAAAIEAAACBAAAAECACBAAAAECACAAAEAgAABABAgAAACBABAgAAACBAAAAgQAAABAgAgQAAABAgAgAABAIAAAQAQIAAAAgQA4Lv/F2AA9GDlvoenPakAAAAASUVORK5CYII=",
            PTY3: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpERDc3QTU0MzI3RDIxMUVCOUE5QkE2OEZFRDJDM0FEMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpERDc3QTU0MjI3RDIxMUVCOUE5QkE2OEZFRDJDM0FEMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            wico_snowrain: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMDk1ODI0NjI3RDQxMUVCQjMyNjkxNTQzODQ1OEY3OSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMDk1ODI0NTI3RDQxMUVCQjMyNjkxNTQzODQ1OEY3OSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            wico_snowrainbrief: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNEFFOTI3RDI3RDQxMUVCODUwNEFBREE2RjU4REU2OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNEFFOTI3QzI3RDQxMUVCODUwNEFBREE2RjU4REU2OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            wico_thunderlight: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQUEyNDc3QzI3RDQxMUVCQTAwQ0I2Nzc2QkEyRDZCMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQUEyNDc3QjI3RDQxMUVCQTAwQ0I2Nzc2QkEyRDZCMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
            wico_verycloudy_day: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIxODM1QTNBMjdEMTExRUJCMjU3QUQ1NjI3NEU0QjQ3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIxODM1QTNCMjdEMTExRUJCMjU3QUQ1NjI3NEU0QjQ3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjE4MzVBMzgyN0QxMTFFQkIyNTdBRDU2Mjc0RTRCNDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjE4MzVBMzkyN0QxMTFFQkIyNTdBRDU2Mjc0RTRCNDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7LojzgAAAs9klEQVR42uydC3SU5bmo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",
            wico_verycloudy_night: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMwRTUxOTA4MjdEMTExRUJBRUM5QkJCN0Q3RDY2MzA5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMwRTUxOTA5MjdEMTExRUJBRUM5QkJCN0Q3RDY2MzA5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzBFNTE5MDYyN0QxMTFFQkFFQzlCQkI3RDdENjYzMDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzBFNTE5MDcyN0QxMTFFQkFFQzlCQkI3RDdENjYzMDkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7KzucLAAAwTUlEQVR42uydC3CV5bmo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",
            wico_yellowdust: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RjEwODc4OTI3RDQxMUVCQTkyRDgxOTc2M0U4OUNCMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RjEwODc4ODI3RDQxMUVCQTkyRDgxOTc2M0U4OUNCMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1M0MyQkYzMEQyMjdFQjExOTJCQUI0NzIwRThEM0VBQiIvPiA8L3JkZjpEZXNjcmlwdGlv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hX17viviEdcxvO82ipeZxyqO08SDoPYKHq/g7scCIiCsbMN42OS7S+yss5Jx9/qYvmVfL3lcIhKj7rWdZmltBWN01I3LobVaQASEVUYkZiG1nQl1mV6/pbBM5v3mnWZibRqDZ+lndePhtF0BERByBCQ2niXvyprV+IH/v80e/c5buXfzISACMtyI7DXDvmNuzeJizHeGQUDm5TReHvdF4PnXk+6HjVB9TsQDMxBKmYmUdoEhfy92We306VYwZiBmINTtRZPvwVM83EQ8EBDKmspON0g7IlK0WEYvxIOF/d3bhcVCp9LTC+did9a60SguHjvOuOrp351dWPRkJhIbqC0zEfGg/wSEZURk0tidVYpL8WBpf+t2YbG0afX0th5xjciu0cgaD8c8+v635kJCehySUp62NyRxnYfbswuIgNCLiOym2YiD68sVs42DdIEnAiIg9CYibYrIyGgsReyy2ne8Q0AEhD6HJHZnlfY0vtq5JbuACAhmI8xk3Ex3WZl1CIiAMLiQjFJIWqMxk0madZwYCgSEoYdkryn3eeEliYPk7+2uQkBASGaZcZx2r3eu60BABIQfhyRO+33VOEZymWYcJ9YKBERAmC0kbQrJ7oBmJTHDOEvhcHAcAREQFjQr+SXFpG+nAN9G42MXjTNLGwEREJYXk7ht/Mtmuotrs9JfI2YX4+71STQQEAEhT0zW74Rkuyn3uMk4ReNT/LOD4QiIgFDuDKVNUXnWTHd5rSosEYqIw5cUjIljGQiIgNCfuKyn17e7v25j8z23UbjrMv33eA7K2OgiIAICICACAiAgAgJAMQF5kusX/ve/2kOLHWAhsmxPs81Afm43bixzgMf7dXKVZZfOPww9AAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAuT7YFSAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACIiAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAMAs/l+AAQBQIHIkNN3vnQAAAABJRU5ErkJggg==",
            VEC: "data:image/png;base64,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",
            arrow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAlCAMAAAEcvzkSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA5UExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALx2UD0AAAATdFJOUwAIEBiPMDj7QK8EDNffi5P3/6sqRZaoAAAACXBIWXMAABcRAAAXEQHKJvM/AAAAjUlEQVQoU82QiwrDIAxF3ercu+3t/3/sknqpCVPmYIweMHp70JQEy5V7BmYVmCYc8sHbTyxawDu+XYtqe2JTBEaTJfK0Erl/S2/37hTvkkYGMRPOZQ7y0/YiYEcU/Zt90/s1fqqO/6hb0ppVOmotDPPzoio9cOKnjWGW2SpvZnMVQ1c1q2sYcU2zR0J4AaecBYLIEy4qAAAAAElFTkSuQmCC"
        },
        ctrl: {
            distance: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuugiOydtOyWtF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiDQoJIHk9IjBweCIgd2lkdGg9IjMwcHgiIGhlaWdodD0iMzBweCIgdmlld0JveD0iLTMgLTMgMzAgMzAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTMgLTMgMzAgMzAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAsMGgyNHYyNEgwVjB6Ii8+DQo8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjE4LjQ5NSw3LjgzMyAxOC40OTUsMTAuMzA0IDE3LjUxMSwxMC4zMDQgMTcuNTExLDcuODMzIDE1LjYyOCw3LjgzMyAxNS42MjgsMTAuMzA0IDE0LjY0NCwxMC4zMDQgDQoJMTQuNjQ0LDcuODMzIDEyLjc2MSw3LjgzMyAxMi43NjEsMTIuMzEyIDExLjc3NiwxMi4zMTIgMTEuNzc2LDcuODMzIDguODg5LDcuODMzIDguODg5LDEwLjMwNCA3LjkwNCwxMC4zMDQgNy45MDQsNy44MzMgDQoJNi4wMjIsNy44MzMgNi4wMjIsMTAuMzA0IDUuMDM4LDEwLjMwNCA1LjAzOCw3LjgzMyAyLjI1LDcuODMzIDIuMjUsMTYuMDQxIDIxLjc5MiwxNi4wNDEgMjEuNzkyLDcuODMzICIvPg0KPC9zdmc+DQo=",
            backmap: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuugiOydtOyWtF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiDQoJIHk9IjBweCIgd2lkdGg9IjMwcHgiIGhlaWdodD0iMzBweCIgdmlld0JveD0iLTMgLTMgMzAgMzAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTMgLTMgMzAgMzAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHJlY3QgZmlsbD0ibm9uZSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIi8+DQo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQuMDE1LDE4LjkxM0w5Ljk4NSwxOS45MlY1LjIzOGw0LjAyOS0xLjA4MVYxOC45MTN6IE04LjY0Miw0Ljg5N0w2LjczLDQuMTAzDQoJQzUuNzA0LDMuNjc0LDQuNTIzLDQuMTU5LDQuMDk1LDUuMTg3QzMuOTkzLDUuNDMzLDMuOTM5LDUuNjk1LDMuOTM5LDUuOTYydjEyLjU5N2w0LjcwMiwxLjM0NFY0Ljg5N3ogTTE4LjYyOCw1LjAzMkwxNS43MDUsNC4wNQ0KCWMtMC4xMTMtMC4wMzYtMC4yMjktMC4wNjMtMC4zNDctMC4wNzl2MTQuOTM4bDQuNzAzLDEuMTQ1VjYuOTU4YzAtMC44OS0wLjU4My0xLjY3Mi0xLjQzNC0xLjkzVjUuMDMyeiIvPg0KPC9zdmc+DQo=",
            refresh: "data:image/png;base64,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"
        },
        //location: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFERDlEOUI3MkEwODExRUJCMjc5OUQyQ0M5OEE5NTc0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFERDlEOUI4MkEwODExRUJCMjc5OUQyQ0M5OEE5NTc0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUREOUQ5QjUyQTA4MTFFQkIyNzk5RDJDQzk4QTk1NzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUREOUQ5QjYyQTA4MTFFQkIyNzk5RDJDQzk4QTk1NzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73oXrCAAAGRUlEQVR42pRXW2wUVRj+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",
        location: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAYAAAAo5+5WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE4OUMwREIzNUFFMzExRUI4RkEyQkUxNTVCNDNBNzkyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE4OUMwREI0NUFFMzExRUI4RkEyQkUxNTVCNDNBNzkyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTg5QzBEQjE1QUUzMTFFQjhGQTJCRTE1NUI0M0E3OTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTg5QzBEQjI1QUUzMTFFQjhGQTJCRTE1NUI0M0E3OTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7W6u5YAAADSUlEQVR42qyWTUwTQRTHd9cVSRUDBw6QHrhwkJho+DiacPLQxHCQhKNNgySe9KyJN8WTiR8HqcSvkBoMQaqGUIIYCIeWloQgSUGQHsC0lLa2y7alS9v1veZNstROKR+TvMzuzpvf/ufNe7Mr9vX1CRW0JrI42KJxwG63l5wgc0CdYLeobyoxvqjr+gdRFN/Sy/5rUtH9VbAfZFYOtOAH0KfQB2w2203iiDywlYCdQuWtVpblEavV2kurl4rBqBSXVSsco1VVVQ309PRch8uzjMnAn4UTtpqamlfQXcD3IFc6JJZCNpvdjkajTjS4DvP8JEkyd3d32+DShMoxLl0850QiMTU8PPwcLnWy1xaLpctsNt8u5W8ymSzQfUI9Em+zVFV1EzSPjmB7YMnx8XGHoiiuUnOqq6uRdRHfIfE2bHNzc5qgGgIpX6NooVBolLfKjo4OTAQTr0CETCajktIURgVMwccYEhj7WSZD6lC8xHNoaGi4XKSWWaK5ufkKb14+n0ex57jg+vr6rtbWVsyWNKnGXoOz5RLEsp83D0odmbJcJn3Ot7e3v2lpaXkHSx+FPE1BlV2DobvlCml9fX0Dp8sg/StAbvAcIYWsaJUUiaZpG5FIRC0Ig6T/JpxSC4fD0ywiUjAYdEJclNMAezyeKZb3ksvl+gtLGDgpNB6Pf4eyZym6jzuY8/v9L0+iGvYp6fV6PyKLUnQPwfr8/HwknU4PHhe8s7PzJRAIhFAplX5aosNlf2ho6FEul/MfFYqZ4HQ6HaQ2w3JegoTX2UM4H+4dFezz+djppxEUKzXDKq8wMDk56YNT7UWl0K2trcHl5eXfFAKszF0CawWwQXXa4XD0w/K8h0HxWIUj1GkIgUq2x85jwaAa35ycm5vrhXgHy8V1YmLiGeUsgypMbaFAmLMx1lDvf9bW1u5AGqmlUmtmZuZxLBbbJSEpgjK1uQNgA7zgPDs764G6f1IMdbvdDyC1tg1ntUKWomd6qR8WY0jUsbGx9/C1eGiA3qfNytJmKfQRUCkEeQY509bWdoCK9wsLC+zjqa+urv5qbGyMr6ysjCwtLQVoMoPGDV+WnJEjltl4kX5A8F+hjsxEYNykGKlNGkPA2j8BBgDqDK7DZaBedAAAAABJRU5ErkJggg==",
    }
  var styles = {
    lgt: {
      icon: {
        "0": new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.lgt.red
          })
        }),
        "1": new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.lgt.purple
          })
        }),
        "2": new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.lgt.blue
          })
        }),
        "3": new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.lgt.aqua
          })
        }),
        "4": new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.lgt.green
          })
        }),
        "5": new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.lgt.yellow
          })
        })
      }
    },
    obs: {
      sfc: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(255, 0, 0)'
          })
        })
      }),
      aws: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(0, 0, 255)'
          })
        })
      }),
      buoy: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(245, 230, 140)'
          })
        })
      }),
      lhaws: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(70, 190, 130)'
          })
        })
      }),
      seaBuoy: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(230, 140, 60)'
          })
        })
      }),
      air: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(30, 200, 220)'
          })
        })
      }),
      upp: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(100, 100, 150)'
          })
        })
      }),
      pm10: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(80, 50, 0)'
          })
        })
      }),
      lgt: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgb(255, 100, 100)'
          })
        })
      })
    },
    dfsp: {
      icon: {
        SKY1D: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.SKY1D
          })
        }),
        SKY3D: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.SKY3D
          })
        }),
        SKY4D: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.SKY4
          })
        }),
        SKY1N: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.SKY1N
          })
        }),
        SKY3N: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.SKY3N
          })
        }),
        SKY4N: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.SKY4
          })
        }),
        PTY1: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.PTY1
          })
        }),
        PTY2: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.PTY2
          })
        }),
        PTY3: new ol.style.Style({
          image: new ol.style.Icon({
            src: icon.weather.PTY3
          })
        })
      },
      text: {
        name: new ol.style.Style({
          text: new ol.style.Text({
            fill: ol.style.Fill({
              color: '#fff'
            }),
            scale: 1.3,
            text: "",
            textAlign: 'center',
            textBaseline: 'top',
            stroke: new ol.style.Stroke({
              color: 'white',
              width: 2
            })
          })
        }),
        value: new ol.style.Style({
          text: new ol.style.Text({
            font: '12px sans-serif',
            stroke: new ol.style.Stroke({
              color: 'white',
              width: 2
            }),
            offsetX: -20
          })
        })
      }
    },
    rww: {
      default: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,0)',
          width: 1
        })
      }),
      selected: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(248,223,0,0.3)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,0,0,0.7)',
          width: 2
        }),
        zIndex: 100
      }),
      b: {
        "0": {
          color: "rgba(223,239,255,1)"
        },
        "1": {
          color: "rgba(179,217,255,1)"
        },
        "2": {
          color: "rgba(102,166,255,1)"
        },
        "3": {
          color: "rgba(76,140,255,1)"
        },
        "4": {
          color: "rgba(154,255,129,1)"
        },
        "5": {
          color: "rgba(103,229,78,1)"
        },
        "6": {
          color: "rgba(255,255,0,1)"
        },
        "7": {
          color: "rgba(229,229,80,1)"
        },
        "8": {
          color: "rgba(255,180,120,1)"
        },
        "9": {
          color: "rgba(255,100,50,1)"
        },
        "10": {
          color: "rgba(229,25,0,1)"
        },
        "11": {
          color: "rgba(153,0,0,1)"
        },
        "12": {
          color: "rgba(229,153,255,1)"
        },
        "13": {
          color: "rgba(204,76,255,1)"
        },
        "14": {
          color: "rgba(179,25,255,1)"
        },
        "15": {
          color: "rgba(0,229,0,1)"
        },
        "16": {
          color: "rgba(0,148,255,1)"
        },
        "17": {
          color: "rgba(0,102,255,1)"
        },
        "18": {
          color: "rgba(102,0,255,1)"
        },
        "19": {
          color: "rgba(13,103,21,1)"
        },
        "999": {
          color: "rgba(255,255,255,0.2)"
        }
      },
      d: {
        "0": {
          color: "rgba(254,254,254,1)"
        },
        "1": {
          color: "rgba(217,242,255,1)"
        },
        "2": {
          color: "rgba(179,217,255,1)"
        },
        "3": {
          color: "rgba(127,191,255,1)"
        },
        "4": {
          color: "rgba(102,166,255,1)"
        },
        "5": {
          color: "rgba(76,140,255,1)"
        },
        "6": {
          color: "rgba(154,255,129,1)"
        },
        "7": {
          color: "rgba(103,229,78,1)"
        },
        "8": {
          color: "rgba(255,255,130,1)"
        },
        "9": {
          color: "rgba(217,217,51,1)"
        },
        "10": {
          color: "rgba(255,210,150,1)"
        },
        "11": {
          color: "rgba(255,180,120,1)"
        },
        "12": {
          color: "rgba(255,150,90,1)"
        },
        "13": {
          color: "rgba(255,100,50,1)"
        },
        "14": {
          color: "rgba(255,50,30,1)"
        },
        "15": {
          color: "rgba(255,153,255,1)"
        },
        "16": {
          color: "rgba(217,0,217,1)"
        },
        "17": {
          color: "rgba(179,0,0,1)"
        },
        "18": {
          color: "rgba(102,0,0,1)"
        },
        "19": {
          color: "rgba(12,102,21,1)"
        },
        "999": {
          color: "rgba(255,255,255,0.2)"
        }
      },
      e: {
        "0": {
          color: "rgba(238,238,238,1)",
          value: 0
        },
        "1": {
          color: "rgba(255,234,110,1)",
          value: 0.04
        },
        "2": {
          color: "rgba(204,170,0,1)",
          value: 0.5
        },
        "3": {
          color: "rgba(105,252,105,1)",
          value: 1
        },
        "4": {
          color: "rgba(30,243,30,1)",
          value: 1.5
        },
        "5": {
          color: "rgba(0,213,0,1)",
          value: 2
        },
        "6": {
          color: "rgba(0,164,0,1)",
          value: 2.5
        },
        "7": {
          color: "rgba(0,128,0,1)",
          value: 3
        },
        "8": {
          color: "rgba(135,217,255,1)",
          value: 3.5
        },
        "9": {
          color: "rgba(62,193,255,1)",
          value: 4
        },
        "10": {
          color: "rgba(7,171,255,1)",
          value: 4.5
        },
        "11": {
          color: "rgba(0,141,222,1)",
          value: 5
        },
        "12": {
          color: "rgba(0,119,179,1)",
          value: 5.5
        },
        "13": {
          color: "rgba(179,180,222,1)",
          value: 6
        },
        "14": {
          color: "rgba(128,129,199,1)",
          value: 6.5
        },
        "15": {
          color: "rgba(76,78,177,1)",
          value: 7
        },
        "16": {
          color: "rgba(31,33,157,1)",
          value: 8
        },
        "17": {
          color: "rgba(0,3,144,1)",
          value: 9
        },
        "18": {
          color: "rgba(218,135,255,1)",
          value: 10
        },
        "19": {
          color: "rgba(194,62,255,1)",
          value: 15
        },
        "20": {
          color: "rgba(173,7,255,1)",
          value: 20
        },
        "21": {
          color: "rgba(146,0,228,1)",
          value: 25
        },
        "22": {
          color: "rgba(127,0,191,1)",
          value: 30
        },
        "23": {
          color: "rgba(250,133,133,1)",
          value: 35
        },
        "24": {
          color: "rgba(246,62,62,1)",
          value: 40
        },
        "25": {
          color: "rgba(238,11,11,1)",
          value: 45
        },
        "26": {
          color: "rgba(213,0,0,1)",
          value: 50
        },
        "27": {
          color: "rgba(191,0,0,1)",
          value: 55
        },
        "28": {
          color: "rgba(51,51,51,1)",
          value: 60
        },
        "999": {
          color: "rgba(255,255,255,0.2)",
          value: 90
        }
      }
    },
    wrn: {
      data: {
        "3": {
          name: "해제",
          color: "rgb(220,220,220)"
        },
        "C": {
          name: "한파",
          color: "rgb(0,127,255)"
        },
        "D": {
          name: "건조",
          color: "rgb(255,127,0)"
        },
        "F": {
          name: "안개",
          color: "rgb(128,20,10)"
        },
        "H": {
          name: "폭염",
          color: "rgb(195,0,195)"
        },
        "R": {
          name: "호우",
          color: "rgb(0,0,255)"
        },
        "S": {
          name: "대설",
          color: "rgb(255,0,255)"
        },
        "T": {
          name: "태풍",
          color: "rgb(255,0,0)"
        },
        "V": {
          name: "풍랑",
          color: "rgb(0,255,255)"
        },
        "W": {
          name: "강풍",
          color: "rgb(0,240,0)"
        },
        "Y": {
          name: "황사",
          color: "rgb(255,255,0)"
        },
        "O": {
          name: "폭풍해일",
          color: "rgb(195,192,145)"
        },
        "N": {
          name: "지진해일",
          color: "rgb(195,150,100)"
        }
      },
      "1": {// 예비
        // pattern 스타일 동적 생성 (data 수만큼)
      },
      "2": {// 주의보
        // pattern 스타일 동적 생성 (data 수만큼)
      },
      "3": {// 경보
        // fill 스타일 동적 생성 (data 수만큼)
      },
      sea: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0)'
        }),
        stroke: new ol.style.Stroke({
          color: 'gray',
          width: 1
        })
      }),
      default: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.0)'
        }),
        stroke: new ol.style.Stroke({
          color: 'gray',
          width: 1
        })
      })
    },
    ifs: {
      "0": new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0)'
        }) //stroke: new ol.style.Stroke({color: 'gray', width: 1})

      }),
      "1": new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'cyan'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(200,200,200,0.2)',
          width: 1
        })
      }),
      "2": new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'yellow'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(200,200,200,0.2)',
          width: 1
        })
      }),
      "3": new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'orange'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(200,200,200,0.2)',
          width: 1
        })
      }),
      "4": new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'red'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(200,200,200,0.2)',
          width: 1
        })
      })
    },
    cctv: {
      "1": new ol.style.Style({
        image: new ol.style.Circle({
          radius: 4,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(112, 48, 160, 0.5)'
          })
        })
      }),
      "2": new ol.style.Style({
        image: new ol.style.Circle({
          radius: 4,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(23, 89, 188, 0.5)'
          })
        })
      })
    }
  };
  var resolutions = {
    dfsp: [{
      level: [0],
      description: "서울",
      max: 9999,
      min: 1584.11
    }, {
      level: [0, 1],
      description: "서울, 대구, 부산, 광주, 제주",
      max: 1584.11,
      min: 512.8196713326229
    }, {
      level: [0, 1, 2],
      description: "시도",
      max: 512.8196713326229,
      min: 221.14039212772985
    }, {
      level: [0, 1, 2, 3],
      description: "시",
      max: 221.14039212772985,
      min: 48.67251423257239
    }, {
      level: [3, 4, 5],
      description: "군구",
      max: 48.67251423257239,
      min: 7.415926576816492
    }, {
      level: [10],
      description: "읍면동",
      max: 7.415926576816492,
      min: 0
    }],
    obs: {
      sfc: {
        offset: [2, 2],
        resolutions: [{
          level: [1],
          max: 2822.23,
          min: 1411.11
        }, {
          level: [1, 2],
          max: 1411.11,
          min: 352.78
        }, {
          level: [1, 2, 3],
          max: 352.78,
          min: 176.39
        }, {
          level: [1, 2, 3, 4],
          max: 176.39,
          min: 44.097310416843065
        }, {
          level: [1, 2, 3, 4, 5],
          max: 44.097310416843065,
          min: 0
        }]
      },
      buoy: {
        offset: [-7, -7],
        resolutions: [{
          level: [1],
          max: 2822.23,
          min: 705.56
        }, {
          level: [1, 2],
          max: 705.56,
          min: 0
        }]
      },
      lhaws: {
        offset: [-7, -7],
        resolutions: [{
          level: [1],
          max: 2822.23,
          min: 705.56
        }, {
          level: [1, 2],
          max: 705.56,
          min: 0
        }]
      },
      seaBuoy: {
        offset: [-7, -7],
        resolutions: [{
          level: [1],
          max: 2822.23,
          min: 352.78
        }, {
          level: [1, 2],
          max: 352.78,
          min: 0
        }]
      },
      air: {
        offset: [2, 2],
        resolutions: [{
          level: [1],
          max: 2822.23,
          min: 705.56
        }, {
          level: [1, 2],
          max: 705.56,
          min: 0
        }]
      }
    }
  }; // 특보 스타일 동적 생성

  for (var wrn in styles.wrn.data) {
    var color = styles.wrn.data[wrn].color;

    var getPattern = function getPattern(color) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = 8;
      canvas.height = 8;
      context.fillStyle = 'rgba(255, 255, 255, 0.5)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      context.fillRect(0, 0, 4, 4);
      context.fillRect(4, 4, 4, 4);
      return context.createPattern(canvas, 'repeat');
    }; // 예비 패턴 스타일 생성


    styles.wrn["1"][wrn] = new ol.style.Style({
      fill: new ol.style.Fill({
        color: getPattern(color)
      }),
      stroke: new ol.style.Stroke({
        color: 'gray',
        width: 1
      })
    }); // 주의보 패턴 스타일 생성

    styles.wrn["2"][wrn] = new ol.style.Style({
      fill: new ol.style.Fill({
        color: getPattern(color)
      }),
      stroke: new ol.style.Stroke({
        color: 'gray',
        width: 1
      })
    }); // 경보 채우기 스타일 생성

    styles.wrn["3"][wrn] = new ol.style.Style({
      fill: new ol.style.Fill({
        color: color
      }),
      stroke: new ol.style.Stroke({
        color: 'gray',
        width: 1
      })
    });
  }

  function rwwStyleFunction(color) {
    return new ol.style.Style({
      fill: new ol.style.Fill(color),
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 1
      })
      /*text: new ol.style.Text({
          text: zone.a.toString(),
          textAlign: 'center',
          fill: ol.style.Fill({color: '#fff'}),
          stroke: new ol.style.Stroke({color: 'white', width: 2}),
      })*/

    });
  }

  function rwwArrowStyleFunction(rotation) {
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0)'
      }),
      image: new ol.style.Icon({
        src: icon.weather.arrow,
        scale: 0.5,
        rotation: rotation,
        anchorOrigin: 'bottom-left'
      }),
      geometry: function geometry(feature) {
        var centerPoint = ol.extent.getCenter(feature.getGeometry().getExtent());
        return new ol.geom.Point(centerPoint);
      }
    });
  }

  function wrnStyleFunction(datas) {
    var style = null; // 발효된 특보가 하나 이상일 때, 특보 개수에 따라 패턴 생성

    if (datas.length > 1) {
      var size = 4;
      var length = datas.length;
      var calcLength = length % 2 === 0 ? length : length * 2;
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = size * calcLength;
      canvas.height = size * 2; // 기본 흰색으로 생성

      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < calcLength; i++) {
        var data = datas[i % length];
        var lineType = data.lvl === "2" ? 1 : 2; // 주의보 점선, 경보 실선

        var startX = size * i;
        var startY = Number(i % 2) === 0 || lineType === 2 ? 0 : 1 * size; // 실선이거나, 짝수번째는 패턴을 0에서 시작, 홀수번은 패턴을 1에서 시작

        context.fillStyle = styles.wrn.data[data.wrn].color;
        context.fillRect(startX, startY, size, size * lineType);
      }

      style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: context.createPattern(canvas, 'repeat')
        }),
        stroke: new ol.style.Stroke({
          color: 'gray',
          width: 1
        })
      }); // 발효된 특보가 한 개
    } else {
      var d = datas[0];
      style = styles.wrn[d.lvl][d.wrn];
    }

    var zindex = datas[0].regId.substr(0, 1) === "L" ? 10 : Number(datas[0].lvl);
    style.setZIndex(zindex);
    return style;
  }

  function dfspStyleFunction(feature, resolution) {
    // 현재 resolution에 따라 조회할 level 확인
    var display = _.find(resolutions.dfsp, function (r) {
      return resolution < r.max && resolution >= r.min;
    });
    var displayLevel = display ? display.level : []; // level에 따라 feature 스타일 정의

    var level = feature.get('level');
    var visible = displayLevel.indexOf(level) > -1;

    if (visible) {
      var nameStyle = styles.dfsp.text.name;
      var info = "";
      var iconStyle = null;

      if (feature.get("tmp") == null || feature.get("tmp") == undefined) {
        info = feature.get("name");
      } else {
        info = feature.get("name") + "\n" + feature.get("tmp") + "°C "; //+ feature.get("pcp")+"mm";

        var pty = feature.get("pty");
        var sky = feature.get("sky");

        if (pty === 0) {
          if (sky != -999 && sky != undefined) {
            iconStyle = styles.dfsp.icon["SKY".concat(sky, "D")];
          }
        } else {
          if (pty > 4) {
            pty = pty - 4;
          }

          iconStyle = styles.dfsp.icon["PTY".concat(pty)];
        }
      }

      nameStyle.getText().setText(info);
      if (iconStyle == null) return nameStyle;
      iconStyle.getImage().setScale(0.08);
      iconStyle.getImage().setAnchor([0.5, 1]);
      return [iconStyle, nameStyle];
    } else {
      return undefined;
    }
  }

  function lgtStyleFunction(feature) {
    var iconStyle = styles.lgt.icon[feature.get('color')];
    iconStyle.getImage().setScale(0.2);
    iconStyle.getImage().setAnchor([0.5, 0.8]);
    return iconStyle;
  }

  function clone(input) {
    var output = {};

    for (var i in input) {
      output[i] = input[i];
    }

    return output;
  }

  function changeViewByExtent(_this, viewOption) {
    var map = _this.map;
    var changeZoom = 12;
    var rwwExtent = _this._mapInfo["rww.extent"];
    var viewOption2 = clone(viewOption);
    viewOption2.extent = rwwExtent;
    var view1 = new ol.View(viewOption);
    var view2 = new ol.View(viewOption2);
    map.on('moveend', function () {
      //_this.onForView("change", function() {
      var _view = this.getView();

      var x = _view.getCenter()[0];

      var y = _view.getCenter()[1]; // 해외 영역에서 확대 막기


      var isContains = ol.extent.containsXY(rwwExtent, x, y);

      if (!isContains && _view.getZoom() >= changeZoom) {
        var div = document.createElement("div");
        div.id = 'toast';
        div.innerHTML = "확대할 수 없는 지역입니다. 한반도 영역에서 확대해주세요.";

        _view.setZoom(changeZoom); // add overlay


        var overlay = new ol.Overlay({
          element: div,
          className: 'ov-tooltip',
          offset: [0, -30],
          positioning: 'center-center'
        });
        map.addOverlay(overlay); // add pointer

        var pointer = new ol.interaction.Pointer({
          handleMoveEvent: function handleMoveEvent(e) {
            var coordinates = map.getEventCoordinate(e.originalEvent);
            pointer.setActive(true);
            overlay.setPosition(coordinates);
          }
        });
        map.addInteraction(pointer);
        setTimeout(function () {
          map.removeInteraction(pointer);
          map.removeOverlay(overlay);
        }, 1000);
        return false;
      } // 줌 레벨에 따라 extent 변경


      if (_view.getZoom() >= changeZoom) {
        view2.setCenter(_view.getCenter());
        view2.setZoom(_view.getZoom());
        map.setView(view2); //console.log("view2 ==> ", "zoom", _view.getZoom(), "minZoom", _view.getMinZoom(), "maxZoom", _view.getMaxZoom())
      } else {
        view1.setCenter(_view.getCenter());
        view1.setZoom(_view.getZoom());
        map.setView(view1); //console.log("view1 ==> ", "zoom", _view.getZoom(), "minZoom", _view.getMinZoom(), "maxZoom", _view.getMaxZoom())
      }
    });
  }

  function createElementCtrl(_this) {
    var state = {
      measure: false,
      dialog: false,
      layers: [{
        key: "",
        index: 0,
        visible: false,
        group: null
      }],
      onClass: "clicked"
    };

    var map = _this._map.getTargetElement();

    if (!map) return false;
    map.style.position = 'relative'; // 컨트롤

    var ctrl = document.createElement("div");
    ctrl.className = 'ctrl';
    var ctrlButton = document.createElement("div");
    ctrlButton.style.height = "61px";
    ctrlButton.innerHTML += "<button type=\"button\" id=\"ctrlD\" title=\"\uAC70\uB9AC\uC7AC\uAE30\" class=\"jsico\" data-status=\"inactive\"><img src=\"".concat(icon.ctrl.distance, "\" alt=\"\uAC70\uB9AC\uC7AC\uAE30\" width=\"30px\"></button>");
    ctrlButton.innerHTML += "<button type=\"button\" id=\"ctrlM\" title=\"\uC9C0\uB3C4\" class=\"jsico\"><img src=\"".concat(icon.ctrl.backmap, "\" alt=\"\uC9C0\uB3C4\" width=\"30px\"></button>");
    ctrl.appendChild(ctrlButton);
    map.appendChild(ctrl); // 배경 지도 Dialog

    var mapDialog = document.createElement("div");
    mapDialog.id = "mapDialog";
    mapDialog.className = 'layer';
    mapDialog.style = 'bottom:10px;right:50px;display:none;';
    ctrlButton.appendChild(mapDialog); // 구분선을 긋기 위해 map type 확인

    var mapsType = _this._maps.reduce(function (l, v) {
      if (l.indexOf(v.maptype) < 0) l.push(v.maptype);
      return l;
    }, []); // IMG, POI, ...
    // 배경 지도 목록 동적 생성


    var index = 0;
    state.layers = [];

    var _loop3 = function _loop3(i) {
      var ul = document.createElement("ul");
      ul.className = i === 0 ? "" : "dline";

      _this._maps.forEach(function (l) {
        if (mapsType[i] !== l.maptype) return false;

        if (l.group) {
          var a = _.find(state.layers, function (b) {
            return b.visible && b.group === l.group;
          });
          l.visible = a ? false : l.visible;
        }

        var checked = l.visible ? "checked='checked'" : "";
        var h = "" + "<li>\n                         <label>\n                             <label class=\"switch\">\n                                 <input type=\"checkbox\" data-key=\"".concat(l.layer, "\" ").concat(checked, ">\n                                 <span class=\"slider round\"></span>\n                             </label>\n                             ").concat(l.title, "\n                         </label>\n                      </li>");
        ul.innerHTML += h;
        state.layers.push({
          key: l.layer,
          index: index++,
          visible: l.visible,
          group: l.group
        });
      });

      mapDialog.appendChild(ul);
    };

    for (var i = 0; i < mapsType.length; i++) {
      _loop3(i);
    }

    mapDialog.innerHTML += '<button type="button" id="ctrlClose" class="close">레이어 닫기</button>'; // 배경색 변경

    changeBgColor();

    ctrl.querySelector('#ctrlD').onclick = function (e) {
      methods.measure(e);
    };

    ctrl.querySelector('#ctrlM').onclick = function (e) {
      methods.showDialog(e);
    };

    ctrl.querySelector('#ctrlClose').onclick = function (e) {
      methods.showDialog(e);
    };
	
	/* fix */
	$(mapDialog).find('input[type=checkbox]').on('change', function(e) {
		var key = this.dataset.key;
		methods.changeMap(key);
	});
	$('div[id="mapDialog"]').hide();
	/*
	var checkboxs = mapDialog.querySelectorAll("input[type=checkbox]");

    var _iterator12 = _createForOfIteratorHelper(checkboxs),
        _step12;

    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var checkbox = _step12.value;

        checkbox.onchange = function (e) {
          var key = this.dataset.key;
          methods.changeMap(key);
        };
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
	*/
	
    var methods = {
      "measure": function measure(e) {
        var active = state.measure;
        var element = ctrl.querySelector('#ctrlD');

        if (active) {
          _this.removeMeasureTool();

          state.measure = false;
          element.classList.remove(state.onClass);
        } else {
          _this.addMeasureTool();

          state.measure = true;
          element.classList.add(state.onClass);
        }
      },
      "showDialog": function showDialog(e) {
        var active = state.dialog;
        var element = ctrl.querySelector('#ctrlM');
        var target = ctrl.querySelector('#mapDialog');

        if (active) {
          state.dialog = false;
          target.style.display = "none";
          element.classList.remove(state.onClass);
        } else {
          state.dialog = true;
          target.style.display = "block";
          element.classList.add(state.onClass);
        }
      },
      "changeMap": function changeMap(key) {
        var checkboxs = mapDialog.querySelectorAll("input[type=checkbox]");
        var layer = _.find(state.layers, function (l) {
          return l.key === key;
        });

        if (layer.group) {
          state.layers.map(function (l) {
            if (l.group === layer.group) {
              l.visible = false;

              _this.setMapLayersVisible(l.index, false);

              checkboxs[l.index].checked = false;
            }
          });
        }

        layer.visible = !layer.visible;

        _this.setMapLayersVisible(layer.index, layer.visible);

        checkboxs[layer.index].checked = layer.visible; // 배경색 변경

        changeBgColor();
      }
    };

    function changeBgColor() {
      var bg = _.find(state.layers, function (l) {
        return l.key === "New_baroemap" && l.visible;
      });
      var bgColor = bg ? "#C8E2EC" : "#EEE";
      map.style.backgroundColor = bgColor;
    }
  }

  Object.defineProperties(kmap.prototype, {
    zoom: {
      get: function get() {
        return this._zoom;
      },
      set: function set(v) {
        this._zoom = v;

        this._map.getView().setZoom(v);
      }
    },
    map: {
      get: function get() {
        return this._map;
      }
    },
    view: {
      get: function get() {
        return this._view;
      }
    },
    maps: {
      get: function get() {
        return this._maps;
      }
    }
  });
  return kmap;
});
