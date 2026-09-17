var optionManager = {};

// //////////////////////////////////////////////////////////////////////////////
// DEFINE
// //////////////////////////////////////////////////////////////////////////////

// 지도 스타일.
optionManager.styles = {
  on : new ol.style.Style({
    fill : new ol.style.Fill({
      color : 'rgba(255, 0, 0, 0.1)'
    }),
    stroke : new ol.style.Stroke({
      color : 'rgba(255, 0, 0, 1)',
      width : 1,
      lineDash : [ 4, 4 ]
    })
  }),
  off : new ol.style.Style({
    fill : new ol.style.Fill({
      color : 'rgba(0, 0, 0, 0)'
    }),
    stroke : new ol.style.Stroke({
      color : 'rgba(0, 0, 0, 0)',
      width : 0
    })
  })
};

// //////////////////////////////////////////////////////////////////////////////
// FUNCTION
// //////////////////////////////////////////////////////////////////////////////

// 검색을 위한 객체 생성.
optionManager.getInstance = function(lonlat_min, lonlat_max) {
  if (objectUtils.isUndefined(lonlat_min, lonlat_max)) {
    return undefined;
  }
  return _init(lonlat_min.lon, lonlat_min.lat, lonlat_max.lon, lonlat_max.lat);
};

optionManager.changeToggle = function(option) {
  if (objectUtils.isUndefined(option) || objectUtils.isUndefined(option.feature)) {
    return;
  }

  // toggle change
  option.toggle = (option.toggle !== true);

  // 토글 옵션에 맞춰서 스타일 변경.
  if (option.toggle) {
    // display rectangle
    option.feature.setStyle(optionManager.styles.on);
  } else {
    // hide rectangle
    option.feature.setStyle(optionManager.styles.off);
  }
};

// 객체 검색.
optionManager.isBeginLonlat = function(option, lonlat) {
  if (objectUtils.isUndefined(option, lonlat)) {
    return false;
  }
  if (option.lon_min !== lonlat.lon) {
    return false;
  }
  if (option.lat_min !== lonlat.lat) {
    return false;
  }
  return true;
};

// Option 생성.
function _init(lon_1, lat_1, lon_2, lat_2) {
  // 기본 설정.
  var option = {
    lon_min : lon_1,
    lat_min : lat_1,
    lon_max : lon_2,
    lat_max : lat_2,
    toggle : false,
    html : undefined,
    feature : undefined
  };
  // feature 생성.
  option.html = _initHtml(option);
  // feature 생성.
  option.feature = _initFeature(option);
  return option;
}

// HTML 생성.
function _initHtml(option) {
  var className = "g";
  var title = typhoonLang.msg('typho.n.0013.2');
  var contents = typhoonLang.msg('typho.n.0014.2'); // <li>{0}˚N,{1}˚E ~
                                                    // {2}˚N,{3}˚E</li>
  contents = contents.format(option.lat_min, option.lon_min, option.lat_max, option.lon_max);

  var html = {
    title : title,
    contents : contents,
    className : className
  };
  return html;
}

// Polygon Feature 생성.
function _initFeature(option) {
  // Polygon 생성.
  function _initPolygon(option) {
    if (objectUtils.isUndefined(option)) {
      return undefined;
    }
    polygon = olUtils.optionToPolygon(option);
    if (objectUtils.isUndefined(polygon)) {
      return undefined;
    }
    olUtils.transPolygonEpsg4326toEpsg111111(polygon); // 좌표계 변경. (4326 to
                                                        // 111111)
    return polygon;
  }

  polygon = _initPolygon(option);
  if (objectUtils.isUndefined(polygon)) {
    return undefined;
  }
  var feature = new ol.Feature({
    geometry : polygon,
    html : option.html
  });
  return feature;
}
