//검색을 위한 객체.
var SearchManager = function(mapManager_) {
  var fid = 0;
  this.createFeatureId = function() {
    return ++fid;
  };
  this.toggleSimilarTyphoonFindOption();
  this.getSearchOptionsCount();
  this.getSearchOptions();
  this.resetSearchOptions();
  this.setSearchLimit();
  this.setSearchSize();
  this.getSearchLimit();
  this.getSearchSize();
  this.SEARCH_LIMIT = 5;
  this.SEARCH_SIZE = 2.5;
};

// const SEARCH_LIMIT = 100; // 최대 검색 범위
SearchManager.prototype.searchOptions = [];

SearchManager.prototype.setSearchLimit = function(x) {
  this.SEARCH_LIMIT = x;
};

SearchManager.prototype.setSearchSize = function(x) {
  this.SEARCH_SIZE = x;
};

SearchManager.prototype.getSearchLimit = function() {
  return this.SEARCH_LIMIT;
};

SearchManager.prototype.getSearchSize = function() {
  return this.SEARCH_SIZE;
};

/**
 * 유사 태풍 검색 옵션 반환.
 */
SearchManager.prototype.getSearchOptions = function() {
  var vm = this;
  var options = this.searchOptions;
  var array = [];
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (option.toggle) {
      array.push(option);
    }
  }
  return array;
};

/**
 * 유사 태풍 검색 옵션 초기화.
 */
SearchManager.prototype.resetSearchOptions = function() {
  var vm = this;
  var options = this.searchOptions;
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (option.toggle) {
      toggleOption(option);
    }
  }
};

/**
 * 유사 태풍 검색 옵션 개수 반환.
 */
SearchManager.prototype.getSearchOptionsCount = function() {
  var vm = this;
  var options = this.searchOptions;
  var count = 0;
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (option.toggle) {
      count++;
    }
  }
  return count;
};

/**
 * 유사 태풍 검색 옵션 토글.
 */
SearchManager.prototype.toggleSimilarTyphoonFindOption = function(array) {
  if (objectUtils.isUndefined(array)) {
    return;
  }

  // 좌표계 변경. (111111 to 4326)
  geo4326 = olUtils.transEpsg111111toEpsg4326(ol, array);
  if (objectUtils.isUndefined(geo4326)) {
    return;
  }

  if (mapManager.LOGGING) {
//    console.log("SearchManager.toggleSimilarTyphoonFindOption : " + geo4326[0] + ", " + geo4326[1]);
  }

  // array에서 lonlat 객체로 변경.
  var lonlat = olUtils.arrayToLonlat(geo4326);
  if (objectUtils.isUndefined(lonlat)) {
    return;
  }

  // 격자 기반으로 경위도 변경.
  var lonlat_search = changeLonLat(lonlat);
  var option = searchSimilarTyphoonFindOption(lonlat_search);
  if (objectUtils.isUndefined(option)) {
    // 없으면 만든다.
    option = initFindOption(lonlat_search);
    if (objectUtils.isUndefined(option)) {
      return;
    }
  }

  toggleOption(option);
};
//구간검색시 체크된 격자의 수 
function typhoon_searchoptionsCount(){
	return SearchManager.prototype.getSearchOptionsCount();
}
/**
 * Toggle Option
 */
var toggleOption = function(option) {
  if (objectUtils.isUndefined(option)) {
    return;
  }

  if (option.toggle == false) {
    // true로 전환이 되기전에 체크한다.
    var limit = mapManager.manager.search.SEARCH_LIMIT;
    if (SearchManager.prototype.getSearchOptionsCount() >= limit) {
      alert(limit + "개 이하의 지점을 선택하여 주십시오.");
      return undefined;
    }
  }

  // toggle change
  optionManager.changeToggle(option);

  var source = mapManager.layers.search.getSource();
  if (option.toggle) {
    source.addFeature(option.feature);
  }
  else {
    source.removeFeature(option.feature);
  }
};

// feature overlay
SearchManager.prototype.featureOverlay = function(evt) {
  var map = mapManager.map;
  var pastLayer = mapManager.layers.past;
  var pastMarkerLayer = mapManager.layers.pastMarker;
  var popupId = mapManager.config.popup;
  var popup = mapManager.popup;
  var feature;

  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
};

////////////////////////////////////////////////////////////////////////////////
// PRIVATE
////////////////////////////////////////////////////////////////////////////////

// 위경도 재설정.
var changeLonLat = function(lonlat) {
  function getMin(param) {
    if (objectUtils.isUndefined(param)) {
//      console.log("SearchManager.changeLonLat isUndefined(param).");
      return undefined;
    }
    var chk = mapManager.manager.search.SEARCH_SIZE;
    var val = Math.floor(param / chk) * chk;
    return val;
  };
  // convert
  var lon = getMin(lonlat.lon);
  var lat = getMin(lonlat.lat);
  var lonlat_search = olUtils.arrayToLonlat([lon, lat]);
  return lonlat_search;
};

// 검색을 위한 객체 생성.
// 생성은 계속 하고 최종단계에서 제약사항 체크한다.
var initFindOption = function(lonlat) {
  // 생성.
  if (objectUtils.isUndefined(lonlat)) {
//    console.log("SearchManager.initFindOption isUndefined(lonlat).");
    return undefined;
  }
  var chk = mapManager.manager.search.SEARCH_SIZE;
  var lonlat_2 = olUtils.arrayToLonlat([lonlat.lon + chk, lonlat.lat + chk]);
  var option = optionManager.getInstance(lonlat, lonlat_2);

  // 배열에 추가.
  mapManager.manager.search.searchOptions.push(option);
  return option;
};

// 객체 검색.
var searchSimilarTyphoonFindOption = function(lonlat_search) {
  if (objectUtils.isUndefined(lonlat_search)) {
//    console.log("SearchManager.initFindOption isUndefined(lonlat_search).");
    return undefined;
  }
  options = mapManager.manager.search.searchOptions;
  var searchSize = mapManager.manager.search.SEARCH_SIZE;
  for (var i in options) {
    var optionSize = options[i].lat_max - options[i].lat_min;
	var sizeFilter = searchSize === optionSize;
    if (optionManager.isBeginLonlat(options[i], lonlat_search) && sizeFilter) {
      return options[i];
    }
  }
  return undefined;
};