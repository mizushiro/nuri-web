var olUtils = {};

////////////////////////////////////////////////////////////////////////////////
// CONST
////////////////////////////////////////////////////////////////////////////////

var EPSG_111111 = 'EPSG:111111';
var EPSG_4326 = 'EPSG:4326';

////////////////////////////////////////////////////////////////////////////////
// DEFINE
////////////////////////////////////////////////////////////////////////////////

// typhoonSearch option을 이용하여 폴리곤 생성하는 부분 구현
olUtils.pastTracksToLineString = _pastTracksToLineString;
olUtils.optionToPolygon = _optionToPolygon;
olUtils.fromEpsg4326toEpsg111111 = _fromEpsg4326toEpsg111111;
olUtils.fromEpsg111111toEpsg4326 = _fromEpsg111111toEpsg4326;
olUtils.transEpsg4326toEpsg111111 = _transEpsg4326toEpsg111111;
olUtils.transEpsg111111toEpsg4326 = _transEpsg111111toEpsg4326;
olUtils.getGeomPoint = _getGeomPoint;
olUtils.transPolygonEpsg4326toEpsg111111 = _transPolygonEpsg4326toEpsg111111;
olUtils.transPolygonEpsg111111toEpsg4326 = _transPolygonEpsg111111toEpsg4326;
olUtils.arrayToLonlat = _arrayToLonlat;

////////////////////////////////////////////////////////////////////////////////
// FUNCTION
////////////////////////////////////////////////////////////////////////////////

function _pastTracksToLineString(typInf) {
  if (objectUtils.isEmptyArray(typInf)) {
    return undefined;
  }
  var tracks = [];
  for (var i = 0; i < typInf.length; i++) {
    var track = typInf[i];
    var pos = [parseFloat(track.lon), parseFloat(track.lat)];
    tracks.push(pos);
  }
  return new ol.geom.LineString(tracks);
};

function _optionToPolygon(option) {
  if (objectUtils.isUndefined(option)) {
    return undefined;
  }
  geometry = new ol.geom.Polygon(null);
  var start = [option.lon_min, option.lat_min];
  var end = [option.lon_max, option.lat_max];
  geometry.setCoordinates([
    [start, [start[0], end[1]], end, [end[0], start[1]], start]
  ]);
  return geometry;
};

// 좌표계 변경.
function _fromEpsg4326toEpsg111111(items) {
  if (objectUtils.isUndefined(items)) {
    return undefined;
  }
  var tLineString = new ol.geom.LineString(items);
  tLineString.transform(EPSG_4326, EPSG_111111);
  return tLineString;
};

// 좌표계 변경.
function _fromEpsg111111toEpsg4326(items) {
  if (objectUtils.isUndefined(items)) {
    return undefined;
  }
  var tLineString = new ol.geom.LineString(items);
  tLineString.transform(EPSG_111111, EPSG_4326);
  return tLineString;
};

// 좌표계 변경.
function _transEpsg4326toEpsg111111(ol, pos) {
  if (objectUtils.isUndefined(pos, ol)) {
    return undefined;
  }
  var tmp = ol.proj.transform(pos, EPSG_4326, EPSG_111111);
  return tmp;
};

// 좌표계 변경.
function _transEpsg111111toEpsg4326(ol, pos) {
  if (objectUtils.isUndefined(pos, ol)) {
    return undefined;
  }
  var tmp = ol.proj.transform(pos, EPSG_111111, EPSG_4326);
  return tmp;
};

function _getGeomPoint(ol, pos) {
  if (objectUtils.isUndefined(pos, ol)) {
    return undefined;
  }
  var point = new ol.geom.Point(pos);
  return point;
};

// 좌표계 변경.
function _transPolygonEpsg4326toEpsg111111(polygon) {
  if (objectUtils.isUndefined(polygon)) {
    return undefined;
  }
  polygon.transform(EPSG_4326, EPSG_111111);
  return polygon;
};

// 좌표계 변경.
function _transPolygonEpsg111111toEpsg4326(polygon) {
  if (objectUtils.isUndefined(polygon)) {
    return undefined;
  }
  polygon.transform(EPSG_111111, EPSG_4326);
  return polygon;
};

function _arrayToLonlat(array) {
  if (objectUtils.isUndefined(array)) {
    return undefined;
  }
  if (array.length < 2) {
    return undefined;
  }
  var lonlat = {
    lon: (array[0] * 1.0),
    lat: (array[1] * 1.0)
  };
  return lonlat;
}
