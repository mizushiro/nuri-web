//컨텐츠 매니져
var PastTyphoonManager = function(mapManager_) {
  var fid = 0;
  this.createFeatureId = function() {
    return ++fid;
  };
  this.loadCnt_REMOVE = 0;
  this.pastTyphoons = []; //과거 태풍목록
  this.depressions = []; //과거 TD목록 (만약을 대비하여 남겨둠)
  this.mapManager = mapManager_;
  this.displayMarker = true; //태풍 마커 표시
};

// 과거 태풍 로드.
PastTyphoonManager.prototype.loadPastTyphoons = function(dataArr) {
  var vm = this;
  // 기존 검색 객체 제거.
  vm.removePastTyphoons();
  // 데이터가 없는 경우 리턴.
  if (objectUtils.isEmptyArray(dataArr)) {
    return;
  }
  // 태풍 그리기.
  for (var i = 0 ; i < dataArr.length ; i++) {
    var typInf = dataArr[i];
    if (objectUtils.isUndefined(typInf)) {
      continue;
    }
    vm.loadPastTyphoon(typInf);
  }
};

// 기존 정보 제거하기.
PastTyphoonManager.prototype.removePastTyphoons = function() {
  var vm = this;
  // feature 제거
  var pastLayerSource = mapManager.layers.past.getSource();
  pastLayerSource.clear();
  var pastMarkerLayerSource = mapManager.layers.pastMarker.getSource();
  pastMarkerLayerSource.clear();
  // 기존 데이터 정리
  vm.pastTyphoons.length = 0;
};

//태풍 그리기
PastTyphoonManager.prototype.loadPastTyphoon = function(typInf) {
  var vm = this;
  // 과거 태풍 적용
  var past = new PastTyphoon(typInf, vm.pastTyphoons.length);
  vm.pastTyphoons.push(past);
  // 지도 레이어 준비
  var mapManager = vm.mapManager;
  var pastLayerSource = mapManager.layers.past.getSource();
  var pastMarkerLayerSource = mapManager.layers.pastMarker.getSource();
  if (objectUtils.isUndefined(pastLayerSource, pastMarkerLayerSource)) {
    return;
  }
  // 태풍 라인 추가.
  pastLayerSource.addFeature(past.feature);
  // 태풍 중심좌표 추가.
  var centers = past.centers;
  for (var i = 0; i < centers.length; i++) {
    var center = centers[i];
    pastMarkerLayerSource.addFeature(center.feature);
  }
};

// featureOverlay에 대한 작업
PastTyphoonManager.prototype.featureOverlay = function(evt) {
  //
}

// feature click
PastTyphoonManager.prototype.featureClick = function(feature) {
  var vm = this;
  // key 분리
  var key = feature.getId();
  var param = TyphoonCenterManager.parseKey(key);
  if (objectUtils.isUndefined(param)) {
    return;
  }
  // pastTyphoon 찾기
  var year = param.year;
  var seq = param.seq;
  var pastTyphoon = vm.getPastTyphoon(year, seq);
  if (objectUtils.isUndefined(param)) {
    return;
  }
  if (objectUtils.isUndefined(mapManager.config.cbPastTyphoonClick)) {
    return;
  }
  // 등록된 콜백이 있으면 호출한다.
  mapManager.config.cbPastTyphoonClick(pastTyphoon);
};

// feature click
PastTyphoonManager.prototype.getPastTyphoon = function(year, seq) {
  var vm = this;
  var pastTyphoons = vm.pastTyphoons;
  for (var i = 0; i < pastTyphoons.length; i++) {
    var past = pastTyphoons[i];
    if (past.year == year && past.seq == seq) {
      return past;
    }
  }
  return undefined;
};

PastTyphoonManager.typhoonStyles = { //태풍 스타일

  track: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.3)'
    })
    , stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 1)'
      , width: 1
    })
  })
  , forecast: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.3)'
    })
    , stroke: new ol.style.Stroke({
      color: '#75328e'
      , width: 1
    })
  })
  , area70: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 93, 0.3)'
    })
  })
  , area15: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0, 130, 200, 0.4)'
    })
  })
  , area25: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(20, 28, 184, 0.5)'
    })
  })
  , trackTd: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.3)'
    })
    , stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 1)'
      , width: 1
    })
  })
  , forecastTd: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0.3)'
    })
    , stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 1)'
      , width: 1
      , lineDash: [3, 3]
    })
  })
  , icon1: { //과거, 과거 태풍 중심 아이콘
    active: {
      startTd: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/start_td.png'
        })
      })
      , low: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/td.png'
        })
      })
      , td: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/td.png'
        })
      })
      , weak: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/weak.png'
        })
      })
      , normal: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/normal.png'
        })
      })
      , strong: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/strong.png'
        })
      })
      , very: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/very.png'
        })
      })
     , superStrong: new ol.style.Style({   //20200513 초강력 추가, 손태림
        image: new ol.style.Icon({
           scale: 1
           , opacity: 1
           , src: urlPrefix + 'resources/image/typoon/gis/super.png'
        })
      })
    }, noneActive: {
      startTd: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/start_td_gray.png'
        })
      })
      , low: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/td_gray.png'
        })
      })
      , td: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/td_gray.png'
        })
      })
      , weak: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/weak_gray.png'
        })
      })
      , normal: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/normal_gray.png'
        })
      })
      , strong: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/strong_gray.png'
        })
      })
      , very: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/very_gray.png'
        })
      })
      , superStrong: new ol.style.Style({
        image: new ol.style.Icon({
          scale: 1
          , opacity: 1
          , src: urlPrefix + 'resources/image/typoon/gis/super_gray.png'
        })
      })
    }
  }
  , icon2: { //예보 태풍중심 아이콘
        forecastTd : new ol.style.Style({
            image : new ol.style.Icon({
              scale : 1,
              opacity : 1,
              src : urlPrefix + 'resources/image/typoon/gis/td_red.png'
            })
          }),
          end_typ : new ol.style.Style({ /* td end */
//            text : new ol.style.Text({
//              text : "",
//              textAlign : "start",
//              offsetY : -12,
//              stroke : new ol.style.Stroke({
//                color : '#E0040B',
//                width : 1
//              })
//            }),
            image : new ol.style.Icon({
              scale : 1,
              opacity : 1,
              src : urlPrefix + 'resources/image/typoon/gis/td_red.png'
            })
          }),
          end_td : new ol.style.Style({ /* td end */
//            text : new ol.style.Text({
//              text : "TD",
//              textAlign : "start",
//              offsetY : -12,
//              stroke : new ol.style.Stroke({
//                color : '#E0040B',
//                width : 1
//              })
//            }),
            image : new ol.style.Icon({
              anchor :[0.5,0.8],
              scale : 1,
              opacity : 1,
              src : urlPrefix + 'resources/image/typoon/gis/red_td.png'
            })
          }),
          end_low : new ol.style.Style({
//            text : new ol.style.Text({
//              text : "L",
//              textAlign : "start",
//              offsetY : -12,
//              stroke : new ol.style.Stroke({
//                color : '#E0040B',
//                width : 1
//              })
//            }),
            image : new ol.style.Icon({
                anchor :[0.5,0.8],
              scale : 1,
              opacity : 1,
              src : urlPrefix + 'resources/image/typoon/gis/red_td_low.png'
            })
          }),
          start_td : new ol.style.Style({ /* td start */
            image : new ol.style.Icon({
              scale : 1,
              opacity : 1,
              src : urlPrefix + 'resources/image/typoon/gis/td.png'
            })
          }),
          ing_td : new ol.style.Style({ /* td ing */
            image : new ol.style.Icon({
              scale : 1,
              opacity : 1,
              src : urlPrefix + 'resources/image/typoon/gis/td.png'
            })
          })
    , weak: new ol.style.Style({
      image: new ol.style.Icon({
        scale: 1
        , opacity: 1
        , src: urlPrefix + 'resources/image/typoon/gis/weak2.png'
      })
    })
    , normal: new ol.style.Style({
      image: new ol.style.Icon({
        scale: 1
        , opacity: 1
        , src: urlPrefix + 'resources/image/typoon/gis/normal2.png'
      })
    })
    , strong: new ol.style.Style({
      image: new ol.style.Icon({
        scale: 1
        , opacity: 1
        , src: urlPrefix + 'resources/image/typoon/gis/strong2.png'
      })
    })
    , very: new ol.style.Style({
      image: new ol.style.Icon({
        scale: 1
        , opacity: 1
        , src: urlPrefix + 'resources/image/typoon/gis/very2.png'
      })
    })
     , superStrong: new ol.style.Style({   //20210506 초강력 추가
	      image: new ol.style.Icon({
	        scale: 1
	        , opacity: 1
	        , src: urlPrefix + 'resources/image/typoon/gis/super2.png'
	      })
	    })
  }
};

//아이콘 사이즈 조정하기
PastTyphoonManager.typhoonStyles.resizeIcon = function(suffix) {

  function getStyle(sub) {

    var image = undefined;
    var text = sub.getText();

    if (typeof sub.getImage() !== "undefined" && sub.getImage() != null) {
        
        /**
         * 2019-04-03 수정
         * 로컬 테스트용 경로 변경 (날씨누리 태풍찾아보기)
         */
        var pathArr = sub.getImage().getSrc().replace("big_", "").replace(".png", "").split("]");
        
        /*var pathArr = sub.getImage().getSrc().replace("big_","").replace(".png","").split("%5D");
        var temp = pathArr[0] +  suffix + '.png';
        temp = temp.replace(']','%5D');*/
        
        

        var getImageSrcName =sub.getImage().getSrc();
        if(getImageSrcName.indexOf("red_td")>-1){
            image = new ol.style.Icon({
                anchor :[0.5,0.8],
                scale: 1,
                opacity: 1,
                src: pathArr[0] +  suffix + '.png'
                //src: temp
            });  
        }else{
            image = new ol.style.Icon({
                scale: 1,
                opacity: 1,
                src: pathArr[0] +  suffix + '.png'
                //src: temp
             });  
        }
    }

    var style = new ol.style.Style({
      text: text
      , image: image
    });

    return style;
  }

  //image , text
  for (var mainKey in this.icon1) {
    for (var subKey in this.icon1[mainKey]) {
      var sub = this.icon1[mainKey][subKey];
      if (sub != null && typeof sub !== "undefined") {
        this.icon1[mainKey][subKey] = getStyle(sub);
      }
    }
  }

  for (var subKey in this.icon2) {
    var sub = this.icon2[subKey];
    if (sub != null && typeof sub !== "undefined") {
      this.icon2[subKey] = getStyle(sub);
    }
  }
};
var index =0;

//아이콘 사이즈 조절하는곳 !!!!!!!! 여기가 진짜임
PastTyphoonManager.prototype.refreshIcons = function(suf) {

  //아이콘 스타일 재조정
  PastTyphoonManager.typhoonStyles.resizeIcon(suf);

  //아이콘 리프레쉬
  var displayMarker = this.displayMarker;
  if (displayMarker === true) {
    // 과거 태풍
    for (var i = 0 ; i < this.pastTyphoons.length ; i++) {
      var typhoon = this.pastTyphoons[i];
          if(typeof typhoon !== "undefined"){
            for (var i = 0 ; i < typhoon.centers.length ; i++) {
                index =i;
                var info = typhoon.centers[i];
                typhoon.centers[i].feature.setStyle(PastTyphoonManager.getCenterIcon(info, true));  
            }
        }
          index =0;
    }
    // 과거 TD
    for (var i = 0 ; i < this.depressions.length ; i++) {
      var depression = this.depressions[i];
      depression.refreshIcons(true);
    }
  }
};


//아이템 키값으로 조회
PastTyphoonManager.prototype.getItem = function(key) {

  if (key.indexOf("TY") > -1) {
    return this.pastTyphoons[key];
  }
  else if (key.indexOf("TD") > -1) {
    return this.depressions[key];
  }
};

// 과거 태풍 발표정보 표시여부
PastTyphoonManager.prototype.toggleDisplayMarker = function() {
  if (this.displayMarker === true) {
    this.displayMarker = false;
  }
  else {
    this.displayMarker = true;
  }
  this.refreshContents();
  return this.displayMarker;
};

// 과거 태풍 발표정보 표시여부
PastTyphoonManager.prototype.refreshContents = function() {
  var displayMarker = this.displayMarker;
  var pastMarkerLayer = mapManager.layers.pastMarker;
  pastMarkerLayer.setVisible(displayMarker);
};

//상세정보 설정
PastTyphoonManager.prototype.setDetailInfo = function(item) {
    
  var tit = "";
  var body = "";
  var tableIdx = -1; //태풍과 TD 정보 표출 테이블 결정하는 인덱스
  var titFormat = typhoonLang.msg('conte.0002');
  var tmFc = item.tmFc; //kst발표시각

  if (typhoonLang.currentLang === "en") {
    var tmFcDate = typhoonUtils.addHours(tmFc.toDate(), -9);
    tmFc = tmFcDate.yyyymmddhhmi();
  }

  tit = titFormat.format(tmFc.substring(0, 4), tmFc.substring(4, 6), tmFc.substring(6, 8), tmFc.substring(8, 10)
    , tmFc.substring(10, 12));

  if (item instanceof PastTyphoonManager.Typhoon) {
    tableIdx = 0;
    var timeStringC = typhoonLang.msg('conte.0003');
    var timeStringF = typhoonLang.msg('conte.0004');
    var rad15Format = typhoonLang.msg('conte.0005'); //강풍반경
    var trFormat = "";
    trFormat += '<tr>          ';
    trFormat += '  <td>{0}</td>';
    trFormat += '  <td>{1}</td>';
    trFormat += '  <td>{2}</td>';
    trFormat += '  <td>{3}</td>';
    trFormat += '  <td>{4}</td>';
    trFormat += '  <td>{5}</td>';
    trFormat += '  <td>{6}</td>';
    trFormat += '  <td>{7}</td>';
    trFormat += '  <td>{8}</td>';
    trFormat += '  <td>{9}</td>';
    trFormat += '  <td>{10}</td>';
    trFormat += '  <td>{11}</td>';
    trFormat += '</tr>         ';
    
    for (var i = 0 ; i < item.centers.length ; i++) {

      var info = item.centers[i].get("info");

      if (info.tmTp.indexOf("P") < 0) { //과거 부터 표출

        var timeStr = "";

        if (info.tmTp == "C") {

          if (typhoonLang.currentLang === "en") {
            var tm = info.utcTmDate.yyyymmddhhmi();
            timeStr = timeStringC.format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(8, 10));
          }
          else {
            var tm = info.tmDate.yyyymmddhhmi();
            timeStr = timeStringC.format(tm.substring(6, 8), tm.substring(8, 10));
          }

        }
        else {

          if (typhoonLang.currentLang === "en") {
            var tm = info.utcTmDate.yyyymmddhhmi();
            timeStr = timeStringF.format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(8, 10));
          }
          else {
            var tm = info.tmDate.yyyymmddhhmi();
            timeStr = timeStringF.format(tm.substring(6, 8), tm.substring(8, 10));
          }
        }

        var rad15Msg = info.rad15.length < 1 ? " <br/>&nbsp; " : rad15Format.format(info.rad15, typhoonUtils.transValToDir(
          info.ed15), typhoonUtils.zeroToBlank(info.er15));

        body += trFormat.format(timeStr, info.lat, info.lon, typhoonUtils.zeroToBlank(info.ps), typhoonUtils.zeroToBlank(
            info.ws), typhoonUtils.zeroToBlank(Math.round(info.ws * 3.6)), rad15Msg, typhoonUtils.transValToStrength(
            info.ws), typhoonUtils.transValToSize(info.tp, info.rad15), typhoonUtils.zeroToBlank(info.dir)
          , typhoonUtils.zeroToBlank(info.sp), typhoonUtils.zeroToBlank(info.rad));
      }
    }

  }
  else if (item instanceof PastTyphoonManager.Depression) {

    tableIdx = 1;
    var timeStringC = typhoonLang.msg('conte.0003');
    var timeStringF = typhoonLang.msg('conte.0004');
    var trFormat = "";
    trFormat += '<tr>          ';
    trFormat += '  <td>{0}</td>';
    trFormat += '  <td>{1}</td>';
    trFormat += '  <td>{2}</td>';
    trFormat += '  <td>{3}</td>';
    trFormat += '  <td>{4}</td>';
    trFormat += '  <td>{5}</td>';
    trFormat += '  <td>{6}</td>';
    trFormat += '  <td>{7}</td>';
    trFormat += '</tr>         ';
    for (var i = 0 ; i < item.centers.length ; i++) {
      var info = item.centers[i].get("info");

      if (info.tmTp.indexOf("P") < 0) { //과거 부터 표출

        var timeStr = "";

        if (info.tmTp == "C") {

          if (typhoonLang.currentLang === "en") {
            var tm = info.utcTmDate.yyyymmddhhmi();
            timeStr = timeStringC.format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(8, 10));
          }
          else {
            var tm = info.tmDate.yyyymmddhhmi();
            timeStr = timeStringC.format(tm.substring(6, 8), tm.substring(8, 10));
          }

        }
        else {

          if (typhoonLang.currentLang === "en") {
            var tm = info.utcTmDate.yyyymmddhhmi();
            timeStr = timeStringF.format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(8, 10));
          }
          else {
            var tm = info.tmDate.yyyymmddhhmi();
            timeStr = timeStringF.format(tm.substring(6, 8), tm.substring(8, 10));
          }
        }

        body += trFormat.format(timeStr, info.lat, info.lon, typhoonUtils.zeroToBlank(info.ps), typhoonUtils.zeroToBlank(
            info.ws), typhoonUtils.zeroToBlank(Math.round(info.ws * 3.6)), typhoonUtils.zeroToBlank(info.dir)
          , typhoonUtils.zeroToBlank(info.sp)
        );
      }
    }
  }

  var detailId = this.mapManager.config.detail;
  $("#" + detailId + " > .tit > h1")
    .html(tit);
  $("#" + detailId + " > .body > table")
    .hide()
    .eq(tableIdx)
    .show()
    .find("tbody")
    .html(body);
};

//최근접 정보 표출  제거
PastTyphoonManager.prototype.removeNearlest = function() {

  var displayMarker = this.displayMarker; //선택된 태풍만 보기
  var selectedKey = this.mapManager.getSelectedKey();
  var source = this.mapManager.layers.typhoon.getSource();
  for (var i = 0 ; i < this.pastTyphoons.length ; i++) {

    var typhoon = this.pastTyphoons[i];

    if (displayMarker === false || selectedKey == typhoon.getKey()) {

      //removeFeature
      if (typeof typhoon.nearlest !== "undefined" && source.getFeatureById(typhoon.nearlest.getId()) != null) {
        typhoon.unShowNearlestLine(this);
      }

      if (typeof typhoon.forecastSp !== "undefined" && source.getFeatureById(typhoon.forecastSp.getId()) != null) {
        source.removeFeature(typhoon.forecastSp);
      }

      if (typeof typhoon.areaSp70 !== "undefined" && source.getFeatureById(typhoon.areaSp70.getId()) != null) {
        source.removeFeature(typhoon.areaSp70);
      }

      if (typeof typhoon.areaSp15 !== "undefined" && source.getFeatureById(typhoon.areaSp15.getId()) != null) {
        source.removeFeature(typhoon.areaSp15);
      }

      //addFeature
      if (typeof typhoon.forecast !== "undefined" && source.getFeatureById(typhoon.forecast.getId()) == null) {
        source.addFeature(typhoon.forecast);
      }

      if (typeof typhoon.area70 !== "undefined" && source.getFeatureById(typhoon.area70.getId()) == null) {
        source.addFeature(typhoon.area70);
      }

      if (typeof typhoon.area15 !== "undefined" && source.getFeatureById(typhoon.area15.getId()) == null) {
        source.addFeature(typhoon.area15);
      }
    }

  }
};

//최근접 정보 표출 선 제거
PastTyphoonManager.prototype.removeNearlestLines = function() {
  for (var i = 0 ; i < this.pastTyphoons.length ; i++) {	
    this.pastTyphoons[i].unShowNearlestLine(this);
  }
};

//최근접 정보 표출 기능 추가
PastTyphoonManager.prototype.addNearlest = function(feature) {

  var displayMarker = this.displayMarker;
  var selectedKey = this.mapManager.getSelectedKey();
  var pastTyphoons = this.pastTyphoons;
  var source = this.mapManager.layers.typhoon.getSource();
  for (var k = 0 ; k < pastTyphoons.length ; k++) {

    var typhoon = pastTyphoons[k];

    if (displayMarker === false || selectedKey == typhoon.getKey()) {

      if (typeof typhoon.forecast !== "undefined" && source.getFeatureById(typhoon.forecast.getId()) != null) {
        source.removeFeature(typhoon.forecast);
      }

      if (typeof typhoon.area70 !== "undefined" && source.getFeatureById(typhoon.area70.getId()) != null) {
        source.removeFeature(typhoon.area70);
      }
      if (typeof typhoon.area15 !== "undefined" && source.getFeatureById(typhoon.area15.getId()) != null) {
        source.removeFeature(typhoon.area15);
      }

      if (typeof typhoon.forecastSp !== "undefined" && source.getFeatureById(typhoon.forecastSp.getId()) == null) {
        source.addFeature(typhoon.forecastSp);
      }

      if (typeof typhoon.areaSp70 !== "undefined" && source.getFeatureById(typhoon.areaSp70.getId()) == null) {
        source.addFeature(typhoon.areaSp70);
      }
      if (typeof typhoon.areaSp15 !== "undefined" && source.getFeatureById(typhoon.areaSp15.getId()) == null) {
        source.addFeature(typhoon.areaSp15);
      }

    }
  }
};

//최근접 정보 표출 기능 추가
PastTyphoonManager.prototype.showNearlestLine = function(feature) {

  var displayMarker = this.displayMarker;
  var selectedKey = this.mapManager.getSelectedKey();
  var pastTyphoons = this.pastTyphoons;
  for (var k = 0 ; k < pastTyphoons.length ; k++) {

    var typhoon = pastTyphoons[k];

    if (displayMarker === false || selectedKey == typhoon.getKey()) {
      typhoon.showNearlestLine(this, feature);
    }
  }
};

//선택된 태풍/TD 만 보이게 한다.
/*
      PastTyphoonManager.prototype.showSelected = function(keys){
      var source = this.mapManager.layers.typhoon.getSource();
      source.clear(); //모든 feature 제거

      var pastTyphoons = this.pastTyphoons;
      var depressions = this.depressions;
      for (var i = 0 ; i < keys.length ; i++) {
      var key = keys[i];
      if(typeof pastTyphoons[key] !== "undefined"){
      pastTyphoons[key].setVisible(source,true);
    }else if(typeof depressions[key] !== "undefined"){

  }
}
};
*/

//중심 아이콘 스타일 리턴(태풍)
PastTyphoonManager.getCenterIcon = function(info, isActive) {
  //중심 아이콘 스타일 리턴(TD)
  function getTdStyle(info, isActive) {
    if (info.tmTp == "C" && info.ref.tmEnd === "Y") { //미래 이거나 TD예보종료 지점인 경우
      var icon = PastTyphoonManager.typhoonStyles.icon2;
      return info.tp == "LOW" ? icon.low : icon.td;
    }
    else {
      if (info.tmTp == "P1") {
        var icon = (isActive === true ? PastTyphoonManager.typhoonStyles.icon1.active : PastTyphoonManager.typhoonStyles.icon1.noneActive);
        return icon.startTd;
      }else if (info.tmTp.indexOf("P") > -1 || info.tmTp == "C") {
        var icon = (isActive === true ? PastTyphoonManager.typhoonStyles.icon1.active : PastTyphoonManager.typhoonStyles.icon1.noneActive);
        return icon.td;
      }else if (info.tmTp.indexOf("F") > -1) {
        var icon = PastTyphoonManager.typhoonStyles.icon2;
        return icon.forecastTd;
      }
    }
  };

  //중심 아이콘 스타일 리턴(TD)
  function getTypStyle(info, isActive) {
     
      var tp = info.tp;  
       console.log("tp=="+tp);
    if (tp == "LOW") { // L(온대저기압) 과거 또는 미래에는 빨간 아이콘으로
//      var icon = info.tmTp.indexOf("P") > -1 ? (isActive === true ? PastTyphoonManager.typhoonStyles.icon1.active :
      var icon = -1 > -1 ? 
              (isActive === true ? PastTyphoonManager.typhoonStyles.icon1.active :
        PastTyphoonManager.typhoonStyles.icon1.noneActive) : PastTyphoonManager.typhoonStyles.icon2;
      return icon.end_low;
    }
    else {
      //과거 또는 미래의 td는 빨간 아이콘으로
      var icon =  info.ws < 17 ? PastTyphoonManager.typhoonStyles.icon2 :
        (isActive === true ? PastTyphoonManager.typhoonStyles.icon1.active : PastTyphoonManager.typhoonStyles.icon1.noneActive);
      
	  if (info.ws >= 54) { //20210506 초강력추가  //태풍찾아보기에서 확대시에 적용되는 아이콘, 첫화면 아님.
		return icon.superStrong;
	  }
      else if (info.ws >= 44) { //매우 강
        return icon.very;
      }
      else if (info.ws >= 33) { //강
        return icon.strong;
      }
      else if (info.ws >= 25) { //중
        return icon.normal;
      }
      else if (info.ws >= 17) { //약
        return icon.weak;
      }
      else if (info.ws < 17) { //열대저압부
            if (parseInt(index) === 0) {
                // 마지막.
                if (tp === 'TD') {
                    return icon.end_td;
                } else if (tp === 'LOW') {
                  return icon.end_low;
                }
                return icon.end_typ;
          } else if(tp == 'TD' && info.tmseq == info.past.tracks.length){

              return icon.end_td;
            } else if(tp == '' && info.tmseq == info.past.tracks.length){

              return icon.end_typ;
            } else if(tp == '-' && info.tmseq == info.past.tracks.length){
              return icon.end_typ;
            } else if (info.past.tracks.length - 1 - index > 0) {
            // 진행중.
            return icon.ing_td;
          } else {
            // 시작. 검은 점
            return icon.start_td;
          }
      }
    }
  };

  if (typeof isActive !== "boolean") {
    isActive = false;
  }
  
  if (info.rTp === "TD" || info.ref instanceof PastTyphoonManager.Depression && info.rTp !== "TY") {
    return getTdStyle(info, isActive);
  }else {
    return getTypStyle(info, isActive);
  }
};

PastTyphoonManager.prototype.appendSelectboxOption = function(item) {

  var vm = this;

  vm.loadCnt_REMOVE--; //로드 완료 의미

  if (item instanceof PastTyphoonManager.Typhoon) {
    //태풍목록에 추가
    vm.pastTyphoons[item.getKey()] = item;

  }
  else if (item instanceof PastTyphoonManager.Depression) {
    //TD목록에 추가
    vm.depressions[item.getKey()] = item;
  }

  //옵션 총 건수
  if (vm.loadCnt_REMOVE < 1) {

    var realCnt = 0;
    for (var key in vm.pastTyphoons) {
      realCnt++;
    }
    for (var key in vm.depressions) {
      realCnt++;
    }

    //마지막 아이템이 추가된 경우
    if (realCnt > 0) {

      function asc(a, b) { // 번호순 : 4, 33, 222, 1111
        return a - b;
      }

      var optionTyArray = []; //오름차순 정렬
      var optionTdArray = []; //오름차순 정렬
      for (var key in vm.pastTyphoons) {
        optionTyArray.push(parseInt(vm.pastTyphoons[key].getKey()
          .replace("TY", "")));
      }
      for (var key in vm.depressions) {
        optionTdArray.push(parseInt(vm.depressions[key].getKey()
          .replace("TD", "")));
      }

      optionTyArray.sort(asc);
      optionTdArray.sort(asc);

      var selectbox = $("#" + mapManager.config.selectbox);
      var strHtml = "";
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();

      for (var i = 0 ; i < optionTyArray.length ; i++) {
        var typhoon = vm.pastTyphoons["TY" + optionTyArray[i]];
        var optionText = "";

        if (currentYear != typhoon.year) {
          optionText = typhoonLang.currentLang === "en" ? typhoonLang.msg('conte.0016')
            .format(typhoon.year, typhoon.no
              , typhoon.enName) : typhoonLang.msg('conte.0016')
            .format(typhoon.year, typhoon.no, typhoon.name, typhoon.enName);
        }
        else {
          optionText = typhoonLang.currentLang === "en" ? typhoonLang.msg('conte.0014')
            .format(typhoon.no, typhoon.enName) :
            typhoonLang.msg('conte.0014')
            .format(typhoon.no, typhoon.name, typhoon.enName);
        }

        strHtml += "<option value='" + typhoon.getKey() + "'>" + optionText + "</option>";
      }
      for (var i = 0 ; i < optionTdArray.length ; i++) {
        var depression = vm.depressions["TD" + optionTdArray[i]];
        var optionText = "";

        if (currentYear != depression.year) {
          optionText = typhoonLang.msg('conte.0017')
            .format(depression.year, depression.no);
        }
        else {
          optionText = typhoonLang.msg('conte.0015')
            .format(depression.no);
        }
        strHtml += "<option value='" + depression.getKey() + "'>" + optionText + "</option>";
      }

      selectbox.append(strHtml);

      //디폴트 옵션 제거
      selectbox.find("option")
        .filter(function() {
          return (this.value.length < 1 ? true : false);
        })
        .remove();

      // OR option 순서값으로 선택
      selectbox.find("option:eq(0)")
        .prop("selected", true);
      $('.btn_custom')
        .show(); //표 상세보기 팝업버튼(컨텐츠가 있는 경우만 표출)

      selectbox.trigger("change");
    }
    else {
//      mapManager.addNoItemMsgControl(); //과거 진행 중인 태풍 또는 열대저압부가 없습니다.
    }
  }

};

PastTyphoonManager.Depression = function() {
  this.tmFc; //예보시각
  this.year; //TD발생년도
  this.no; //TD번호
  this.tmEnd; //TD예보종료여부(Y/N)
  this.track; //과거 ~ 과거까지 경로
  this.forecast; //과거 ~ 예측 경로
  this.centers; //TD 중심
  this.area70; //TD 70%확률반경
};

PastTyphoonManager.Depression.prototype.getKey = function() {
  return "TD" + this.year + this.no;
};

PastTyphoonManager.Depression.prototype.getFeatures = function() {
  var arr = [];
  var keys = Object.keys(this);
  for (var i = 0 ; i < keys.length ; i++) {
    if (this[keys[i]] instanceof ol.Feature) {
      arr.push(this[keys[i]]);
    }
    else if (this[keys[i]] instanceof Array) {
      var tempArr = this[keys[i]];
      for (var j = 0 ; j < tempArr.length ; j++) {
        if (tempArr[j] instanceof ol.Feature) {
          arr.push(tempArr[j]);
        }
      }
    }
  }

  return arr;
};

PastTyphoonManager.Depression.prototype.setVisible = function(source, val) {

  var fs = this.getFeatures();
  for (var i = 0 ; i < fs.length ; i++) {

    if (val === true) {

      if (source.getFeatureById(fs[i].getId()) == null) {
        source.addFeature(fs[i]);
      }

    }
    else {

      if (source.getFeatureById(fs[i].getId()) != null) {
        source.removeFeature(fs[i]);
      }
    }
  }
};

PastTyphoonManager.Depression.prototype.getCenter = function() {
  var centers = this.centers;
  for (var i = 0 ; i < centers.length ; i++) {
    var info = centers[i].get("info");
    if (info.tmTp === "C") {
      return centers[i].getGeometry()
        .getLastCoordinate();
    }
  }
};

PastTyphoonManager.Depression.prototype.refreshIcons = function(isActive) {

  if (typeof this.centers !== "undefined") {
	for (var i = 0 ; i < this.centers.length ; i++) {

      var info = this.centers[i].get("info");
      this.centers[i].setStyle(PastTyphoonManager.getCenterIcon(info, isActive));
    }
  }
};

PastTyphoonManager.Depression.prototype.redraw = function(vm, isActive) {

  var source = vm.mapManager.layers.typhoon.getSource();

  if (isActive) {

    if (typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) == null) {
      source.addFeature(this.area70);
    }

    if (typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) == null) {
      source.addFeature(this.forecast);
    }

    if (typeof this.centers !== "undefined") {

      for (var i = 0 ; i < this.centers.length ; i++) {

        var info = this.centers[i].get("info");

        this.centers[i].setStyle(PastTyphoonManager.getCenterIcon(info, isActive));

        if (info.tmTp.indexOf("F") > -1 && source.getFeatureById(this.centers[i].getId()) == null) {
          source.addFeature(this.centers[i]);
        }
      }
    }

  }
  else {

    if (typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) != null) {
      source.removeFeature(this.area70);
    }

    if (typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) != null) {
      source.removeFeature(this.forecast);
    }

    if (typeof this.centers !== "undefined") {
        for (var i = 0 ; i < this.centers.length ; i++) {

        var info = this.centers[i].get("info");

        this.centers[i].setStyle(PastTyphoonManager.getCenterIcon(info, isActive));

        if (info.tmTp.indexOf("F") > -1 && source.getFeatureById(this.centers[i].getId()) != null) {
          source.removeFeature(this.centers[i]);
        }
      }
    }
  }
};
