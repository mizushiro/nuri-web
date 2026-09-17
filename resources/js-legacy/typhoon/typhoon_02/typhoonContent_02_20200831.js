//컨텐츠 매니져
var ContentManager = function(mapManager_) {
  var fid = 0;
  this.createFeatureId = function() {
    return ++fid;
  };
  this.loadCnt = 0;
  this.typhoons = {}; //현재진행중인 태풍목록
  this.depressions = {}; //현재진행중인 TD목록
  this.mapManager = mapManager_;
  this.onlySelected = true; //선택된 태풍만 예보값 표출(디폴트)
  this.displayRealtime = true; // 실시간 정보 표시

  // mapManager.config.dontLoadRealTime 값이 지정되지 않거나 false 인 경우 실시간 조회한다.
  if (objectUtils.isUndefined(this.mapManager.config.dontLoadRealTime) || this.mapManager.config.dontLoadRealTime ==
    false) {
    this.loadTlb(); //태풍, TD 현재진행 중인 목록 조회
  }
};

ContentManager.typhoonStyles = {		//태풍 스타일

		track : new ol.style.Style({
					fill: new ol.style.Fill({
					  color: 'rgba(0, 0, 0, 0.3)'
					}),
					stroke: new ol.style.Stroke({
					  color: 'rgba(0, 0, 0, 1)',
					  width: 1
					})
				})  
		,forecast : new ol.style.Style({
					fill: new ol.style.Fill({
					  color: 'rgba(255, 255, 255, 0.3)'
					}),
					stroke: new ol.style.Stroke({
					  color: '#75328e',
					  width: 1
					})
				}) 
	
		,area70 : new ol.style.Style({
				fill: new ol.style.Fill({
				  color: 'rgba(255, 0, 93, 0.3)'
				})
		}) 
		
		,area15 : new ol.style.Style({
			fill: new ol.style.Fill({
			  color: 'rgba(0, 130, 200, 0.4)'
			})
		}) 
	
		,area25 : new ol.style.Style({
			fill: new ol.style.Fill({
			  color: 'rgba(20, 28, 184, 0.5)'
			})
		}) 

		,trackTd : new ol.style.Style({
			fill: new ol.style.Fill({
				  color: 'rgba(0, 0, 0, 0.3)'
				}),
				stroke: new ol.style.Stroke({
				  color: 'rgba(0, 0, 0, 1)',
				  width: 1
				})
		})  

		,forecastTd : new ol.style.Style({
					fill: new ol.style.Fill({
						  color: 'rgba(0, 0, 0, 0.3)'
					}),
					stroke: new ol.style.Stroke({
					  color: 'rgba(0, 0, 0, 1)',
					  width: 1,
					  lineDash : [3,3]
					})
		})

		,icon1 : {//현재, 과거 태풍 중심 아이콘
			
			active : { 
				
				startTd : new ol.style.Style({
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/td.png'
                    }) 
				}),  
				
				low : new ol.style.Style({ 
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/td.png'
                    })
				}), 
				
				td : new ol.style.Style({
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/td.png'
                    })
				}),	 
				
				
					
				weak : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/weak.png'
	                    })
				}),	
				
				normal : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/normal.png'
	                    })
				}),
				
				strong : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/strong.png'
	                    })
				}),
				
				very : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/very.png'
	                    })
				})
			},
			
			noneActive : {
				
				startTd : new ol.style.Style({
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/start_td_gray.png'
                    }) 
				}),
				

				low : new ol.style.Style({ 
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/td_gray.png'
                    })
				}),
					
				td : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/td_gray.png'
	                    })
				}),	
					
				weak : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/weak_gray.png'
	                    })
				}),	
					
				normal : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/normal_gray.png'
	                    })
				}),	
					
				strong : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/strong_gray.png'
	                    })
				}),	
					
				very : new ol.style.Style({
						image: new ol.style.Icon({
	                        scale: 1,  
	                        opacity: 1,
	                        src: '../../images/weather/typoon/gis/very_gray.png'
	                    })
				})
			}
		}
		,icon2 : {	//예보 태풍중심 아이콘
			
			forecastTd : new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: '../../images/weather/typoon/gis/td_red.png'
                })
			}),
			
			low : new ol.style.Style({
//					text : new ol.style.Text({
//						text : "L",
//						textAlign : "start",
//						offsetY : -12,
//						stroke: new ol.style.Stroke({
//								  color: '#E0040B',
//								  width: 1
//								})
//					}),
					image: new ol.style.Icon({
						anchor :[0.5,0.8],
	                    scale: 1,  
	                    opacity: 1,
	                    src: '../../images/weather/typoon/gis/red_td_low.png'
					}) 
			}),
			
			td : new ol.style.Style({
//					text : new ol.style.Text({
//						text : "TD",
//						textAlign : "start",
//						offsetY : -12,
//						stroke: new ol.style.Stroke({
//								  color: '#E0040B',
//								  width: 1
//								})
//					}),
					image: new ol.style.Icon({
						anchor :[0.5,0.8],
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/red_td.png'
                    })
			}),	
				
			weak : new ol.style.Style({
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/weak2.png'
                    })
			}),	
			
			normal : new ol.style.Style({
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/normal2.png'
                    })
			}),
			
			strong : new ol.style.Style({
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/strong2.png'
                    })
			}),
			
			very : new ol.style.Style({
					image: new ol.style.Icon({
                        scale: 1,  
                        opacity: 1,
                        src: '../../images/weather/typoon/gis/very2.png'
                    })
			}) 
		}
};
//아이콘 사이즈 조정하기
ContentManager.typhoonStyles.resizeIcon = function(suffix){ 
	function getStyle(sub){ 
		 var image = undefined;
		 var text = sub.getText();
		 
		 if(typeof sub.getImage()!=="undefined" && sub.getImage()!=null){
			 
			 var pathArr = sub.getImage().getSrc().replace("big_","").replace(".png","").split("]");
			 var getImageSrcName =sub.getImage().getSrc();
			 
			 if(getImageSrcName.indexOf("red_td")>-1){
				 image = new ol.style.Icon({
					 anchor :[0.5,0.8],
					 scale: 1,  
					 opacity: 1,
					 src: pathArr[0] +  suffix + '.png'
				 });  
			 }else{
				 image = new ol.style.Icon({
					 scale: 1,  
					 opacity: 1,
					 src: pathArr[0] +  suffix + '.png'
				 });  
			 }
			 
		 }
		 var style = new ol.style.Style({
			 text : text,
			 image : image
		 });
		 
		 return style;
	}
	
	//image , text
	for(var mainKey in this.icon1){
		 for(var subKey in this.icon1[mainKey]){
			 var sub = this.icon1[mainKey][subKey];
			 if(sub!=null && typeof sub !== "undefined"){
				 this.icon1[mainKey][subKey] = getStyle(sub);
			 }
		 }
	 }
	
	for(var subKey in this.icon2){
		 var sub = this.icon2[subKey];
		 if(sub!=null && typeof sub !== "undefined"){
			 this.icon2[subKey] = getStyle(sub);
		 }
	}
};

ContentManager.prototype.refreshIcons = function(suf){
	//아이콘 스타일 재조정
	ContentManager.typhoonStyles.resizeIcon(suf); 
	//아이콘 리프레쉬
	var onlySelected = this.onlySelected; 
	if(onlySelected === false){
		for(var i in this.typhoons){ 
			var typhoon = this.typhoons[i]; 
			typhoon.refreshIcons(true);
		}
		
		for(var i in this.depressions){ 
			var depression = this.depressions[i]; 
			depression.refreshIcons(true);
		}
		
	}else{
		
		var selectedKey = this.mapManager.getSelectedKey();  
		for(var i in this.typhoons){
			var typhoon = this.typhoons[i]; 
			if(typhoon.getKey() == selectedKey){
				typhoon.refreshIcons(true);
			}else{
				typhoon.refreshIcons(false);
			} 
		} 
		
		for(var i in this.depressions){ 
			var depression = this.depressions[i]; 
			if(depression.getKey() == selectedKey){
				depression.refreshIcons(true);
			}else{
				depression.refreshIcons(false);
			} 
		}
	}
	
};

//아이템 키값으로 조회
ContentManager.prototype.getItem = function(key) {
  if (key.indexOf("TY") > -1) {
    return this.typhoons[key];
  }
  else if (key.indexOf("TD") > -1) {
    return this.depressions[key];
  }
};

// 실시간 표시여부
ContentManager.prototype.toggleDisplayRealtime = function() {
  if (this.displayRealtime === true) {
    this.displayRealtime = false;
  }
  else {
    this.displayRealtime = true;
  }
  var realtimeLayer = mapManager.layers.typhoon;
  realtimeLayer.setVisible(this.displayRealtime);
  return this.displayRealtime;
};

//현재 선택된 태풍에 대한 예보만 보기/모든 태풍에 대한 예보 보기 토클 이벤트 핸들러
ContentManager.prototype.toggleOnlySelected = function() {
  if (this.onlySelected === true) {
    this.onlySelected = false;
  }
  else {
    this.onlySelected = true;
  }
  this.refreshContents();
  return this.onlySelected;
};

//태풍(열대저압부) 다시 그리기 - 현재 onlySelected값에 따라 다시 그려짐
ContentManager.prototype.refreshContents = function() {

  var onlySelected = this.onlySelected;
  var isNearlest = this.mapManager.getCurrentTapIdx() > 1 ? true : false;

  if (onlySelected === false) {

    for (var i in this.typhoons) {
      var typhoon = this.typhoons[i];
      typhoon.redraw(this, true, isNearlest);
    }

    for (var i in this.depressions) {
      var depression = this.depressions[i];
      depression.redraw(this, true);
    }

  }
  else {

    var selectedKey = this.mapManager.getSelectedKey();

    for (var i in this.typhoons) {

      var typhoon = this.typhoons[i];

      if (typhoon.getKey() == selectedKey) {
        typhoon.redraw(this, true, isNearlest);
      }
      else {
        typhoon.redraw(this, false, isNearlest);
      }
    }

    for (var i in this.depressions) {
      var depression = this.depressions[i];

      if (depression.getKey() == selectedKey) {
        depression.redraw(this, true);
      }
      else {
        depression.redraw(this, false);
      }
    }
  }

};

//상세정보 설정
ContentManager.prototype.setDetailInfo = function(item) {
  var tit = "";
  var body = "";

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
ContentManager.prototype.removeNearlest = function() {

  var onlySelected = this.onlySelected; //선택된 태풍만 보기
  var selectedKey = this.mapManager.getSelectedKey();
  var source = this.mapManager.layers.typhoon.getSource();

  for (var i in this.typhoons) {

    var typhoon = this.typhoons[i];

    if (onlySelected === false || selectedKey == typhoon.getKey()) {

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
ContentManager.prototype.removeNearlestLines = function() {
  for (var i in this.typhoons) {
    this.typhoons[i].unShowNearlestLine(this);
  }
};

//최근접 정보 표출 기능 추가
ContentManager.prototype.addNearlest = function(feature) {

  var onlySelected = this.onlySelected;
  var selectedKey = this.mapManager.getSelectedKey();
  var typhoons = this.typhoons;
  var source = this.mapManager.layers.typhoon.getSource();

  for (var k in typhoons) {

    var typhoon = typhoons[k];

    if (onlySelected === false || selectedKey == typhoon.getKey()) {

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
ContentManager.prototype.showNearlestLine = function(feature) {

  var onlySelected = this.onlySelected;
  var selectedKey = this.mapManager.getSelectedKey();
  var typhoons = this.typhoons;

  for (var k in typhoons) {

    var typhoon = typhoons[k];

    if (onlySelected === false || selectedKey == typhoon.getKey()) {
      typhoon.showNearlestLine(this, feature);
    }
  }
};

//선택된 태풍/TD 만 보이게 한다.
      ContentManager.prototype.showSelected = function(keys){
      var source = this.mapManager.layers.typhoon.getSource();
      source.clear(); //모든 feature 제거

      var typhoons = this.typhoons;
      var depressions = this.depressions;

      for(var i in keys){
      var key = keys[i];
      if(typeof typhoons[key] !== "undefined"){
      typhoons[key].setVisible(source,true);
    }else if(typeof depressions[key] !== "undefined"){

  }
}
};

//중심 아이콘 스타일 리턴(태풍)
ContentManager.getCenterIcon = function(info, isActive) {
  //중심 아이콘 스타일 리턴(TD)
  function getTdStyle(info, isActive) {

    if (info.tmTp == "C" && info.ref.tmEnd === "Y") { //미래 이거나 TD예보종료 지점인 경우
      var icon = ContentManager.typhoonStyles.icon2;
      return info.tp == "LOW" ? icon.low : icon.td;
    }
    else {

      if (info.tmTp == "P1") {
        var icon = (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1
          .noneActive);
        return icon.startTd;
      }
      else if (info.tmTp.indexOf("P") > -1 || info.tmTp == "C") {
        var icon = (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1
          .noneActive);
        return icon.td;
      }
      else if (info.tmTp.indexOf("F") > -1) {
        var icon = ContentManager.typhoonStyles.icon2;
        return icon.forecastTd;
      }
    }
  };

  //중심 아이콘 스타일 리턴(TD)
  function getTypStyle(info, isActive) {
    if (info.tp == "LOW") { // L(온대저기압) 현재 또는 미래에는 빨간 아이콘으로
      var icon = info.tmTp.indexOf("P") > -1 ? (isActive === true ? ContentManager.typhoonStyles.icon1.active :
        ContentManager.typhoonStyles.icon1.noneActive) : ContentManager.typhoonStyles.icon2;
      return icon.low;
    }
    else {
      //현재 또는 미래의 td는 빨간 아이콘으로
      var icon = info.tmTp.indexOf("F") > -1 || (info.tmTp === "C" && info.ws < 17) ? ContentManager.typhoonStyles.icon2 :
        (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1.noneActive);

      if (info.ws >= 44) { //매우 강
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
        return icon.td;
      }
    }

  };

  if (typeof isActive !== "boolean") {
    isActive = false;
  }
  
  if (info.rTp === "TD" || info.ref instanceof ContentManager.Depression && info.rTp !== "TY") {
    return getTdStyle(info, isActive);
  }
  else {
    return getTypStyle(info, isActive);
  }
};

//현재 진행 중인 태풍/TD 목록 조회
ContentManager.prototype.loadTlb = function() {

  var contentManager = this;
  var mapManager = this.mapManager;

  function loadTlb2(data63Arr) {

    //현재진행중인 TD 목록 조회
    $.post('../../repositary/xml/typ/raw/DAOU/RTKO64/RTKO64.tbl', function(data64) {

        var data64Arr = data64.split("\n");

        for (var i in data64Arr) {
          if ($.trim(data64Arr[i])
            .length > 1) {
            contentManager.loadCnt++;
          }
        }

        if (contentManager.loadCnt === 0) {
//          mapManager.addNoItemMsgControl(); //현재 진행 중인 태풍 또는 열대저압부가 없습니다.

        }
        else {
          contentManager.loadTyphoons(data63Arr);
          contentManager.loadDepressions(data64Arr);
        }

      })
      .fail(function() {

        if (contentManager.loadCnt === 0) {

//          mapManager.addNoItemMsgControl(); //현재 진행 중인 태풍 또는 열대저압부가 없습니다.

        }
        else {
          contentManager.loadTyphoons(data63Arr);
        }
      });
  }

  //현재진행중인 태풍 목록 조회
  $.post('../../repositary/xml/typ/raw/DAOU/RTKO63/RTKO63.tbl', function(data63) {

      var data63Arr = data63.split("\n");

      for (var i in data63Arr) {
        if ($.trim(data63Arr[i])
          .length > 1) {
          contentManager.loadCnt++;
        }
      }

      loadTlb2(data63Arr);
    })
    .fail(function() {
      loadTlb2([]);
    });

};

ContentManager.prototype.loadTyphoons = function(dataArr) {

  var contentManager = this;

  //현재 진행중인 태풍이 없는 경우
  if (typeof dataArr === "undefined" || dataArr.length < 1) {
    return;
  }

  for (var i in dataArr) {

    var tmpArr = dataArr[i].split(","); //osp,ini

    if (tmpArr.length < 2) {
      continue;
    }

    var ospPath = tmpArr[0];
    var iniPath = tmpArr[1];

    contentManager.loadTyphoon(ospPath, iniPath);
  }

};

ContentManager.prototype.loadDepressions = function(dataArr) {

  var contentManager = this;

  //현재 진행중인 TD가 없는 경우
  if (typeof dataArr === "undefined" || dataArr.length < 1) {
    return;
  }

  for (var i in dataArr) {

    var tmpArr = dataArr[i].split(","); //osp,ini

    if (tmpArr.length < 2) {
      continue;
    }

    var ospPath = tmpArr[0];
    var iniPath = tmpArr[1];

    contentManager.loadDepression(ospPath, iniPath);
  }

};

//태풍 정보 로딩
ContentManager.prototype.loadTyphoon = function(osp, ini) {
  var contentManager = this;
  var mapManager = contentManager.mapManager;
  var typhoon = new ContentManager.Typhoon();

  function checkValidationRow(tempArr) {

    if (tempArr.length < 19 || tempArr[0].length < 1 || tempArr[1].length < 1 || tempArr[2].length < 1 || tempArr[1].toNumber() <=
      -999 || tempArr[2].toNumber() <= -999) {
      return false;
    }
    return true;
  }

  $.get(osp, function(data) { //load OSP file (track/forecast/centers)

      var trackCnt = 0; //과거~현재지점 포인트 갯수
      var tracks = []; //과거경로 목록
      var trackArr = []; //과거~현재지점 위경도 정보
      var forecastArr = []; //현재지점~예보 위경도 정보
      var centerArr = []; //중심점 features
      var ospFile = osp.split("/");
      var dataArr = data.split("\n");
      var infoArr = dataArr[0].split(",");

      if (infoArr.length < 4) {
        contentManager.appendSelectboxOption(undefined);
        return false;
      }

      typhoon.tmFc = ospFile[ospFile.length - 1].substr(7, 12);
      typhoon.year = parseInt(infoArr[0]);
      typhoon.no = parseInt(infoArr[1]);
      typhoon.name = infoArr[2];
      typhoon.enName = infoArr[3];

      var currentTmDate = undefined;
      var forcastCnt = 0;

      for (var i = 1; i < dataArr.length; i++) {

        var isCut = false;
        var tempArr = dataArr[i].split(",");

        if (!checkValidationRow(tempArr)) {
          continue;
        }

        var nextTempArr = i < dataArr.length - 1 ? dataArr[i + 1].split(",") : undefined;

        if (typeof nextTempArr !== "undefined" && checkValidationRow(nextTempArr)) {

          //현재가 태풍이면서 다음번이 연관TD예보 이거나 현재가 연관예보이면서 다음번이 태풍예보일때,
          if ((tempArr[18].length < 1 && nextTempArr[18].length > 0 || tempArr[18].length > 0 && nextTempArr[18].length <
              1)) {

            //이번과 다음번의 시간이 동일하지 않는다면->예보가 끊어진 것이다.
            if (tempArr[0] !== nextTempArr[0]) {
              isCut = true;
            }
            else {
              continue; //예보가 끊기지 않은 경우는 현재 예보는 패스하고 나중에 예보된 내용을 표출한다.
            }
          }
        }

        var dirName = typhoonUtils.transValToDir(tempArr[4]);
        var info = {
          ref: typhoon
          , tm: tempArr[0] /*orginal text datestring*/
          , tmDate: tempArr[0].toDate() /*kst tm date*/
          , utcTmDate: typhoonUtils.addHours(tempArr[0].toDate(), -9) /*utc tm date*/
          , lat: tempArr[1] /*위도*/
          , lon: tempArr[2] /*경도*/
          , loc: tempArr[3] /*위치설명*/
          , dir: dirName /*방향*/
          , sp: tempArr[5].toNumber() /*진행속도*/
          , ps: tempArr[6].toNumber() /*중심기압*/
          , ws: tempArr[7].toNumber() /*중심풍속*/
          , tp: tempArr[8] /*TD,TS,LOW*/
          , rad25: tempArr[9] /*25m/s 반경(km)*/
          , ed25: tempArr[10] /*25m/s 예외방향(16방위)*/
          , er25: tempArr[11] /*25m/s 예외반경(km)*/
          , rad15: tempArr[12] /*15m/s 반경(강풍반경)(km)*/
          , ed15: tempArr[13] /*예외반경 방위*/
          , er15: tempArr[14] /*예외반경 (km)*/
          , rad: tempArr[15] /*70%확률반경 (km)*/
          , rYear: tempArr[16] /*연관TD발생년도*/
          , rSeq: tempArr[17] /*연관TD번호*/
          , rTp: tempArr[18] /*연관개체 타입(TD)*/
          , rDesc: "" /*이전 중심점이 연관개체인 경우 메세지*/
          , tmTp: undefined /*예보값인지, 현재, 과거 값인지 여부(F0,C,P)*/
        };
        var pos = [parseFloat(info.lon), parseFloat(info.lat)];
        var center = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform(pos, 'EPSG:4326', 'EPSG:111111'))
          , info: info
        });
        center.setId(contentManager.createFeatureId());

        if (info.rad.length < 1 || parseFloat(info.rad) > 0) { //미래

          forcastCnt++;
          var futureInterval = "";
          if (typeof currentTmDate !== "undefined") {
            futureInterval = typhoonUtils.getIntervalHours(currentTmDate, info.tmDate); //미래 예보 시간 간격
          }
          info.tmTp = 'F' + futureInterval;

          if (forcastCnt <= 3) { // 예보중심선은 3일예보까지만 표출한다.
            forecastArr.push(pos);
          }

        }
        else if (typeof nextTempArr !== "undefined" && (nextTempArr[15].length < 1 || parseFloat(nextTempArr[15]) >
            0)) { //현재
          info.tmTp = 'C';
          trackArr.push(pos);
          forecastArr.push(pos);
          currentTmDate = info.tmDate;

        }
        else { //과거
          info.tmTp = 'P' + ++trackCnt;
          trackArr.push(pos);
        }

        //rDesc 설정
        if (centerArr.length > 0) {

          var perInfo = centerArr[centerArr.length - 1].get("info");

          if (info.rTp.length < 1 && perInfo.rTp.length > 0) {

            if (perInfo.rYear === perInfo.tm.substring(0, 4)) {
              var resultMsg = typhoonLang.msg('conte.0006');
              info.rDesc = resultMsg.format(perInfo.rSeq);
            }
            else {
              var resultMsg = typhoonLang.msg('conte.0007');
              info.rDesc = resultMsg.format(perInfo.rYear, perInfo.rSeq);
            }

          }
          else if (info.rTp.length > 0 && perInfo.rTp.length < 1) {
            var typhoonNameStr = typhoonLang.currentLang === "en" ? typhoon.enName : typhoon.name;
            info.rDesc = typhoonLang.msg('conte.0010')
              .format(typhoon.no, typhoonNameStr);
          }
          else if (info.rTp.length < 1) {

            if (info.tp === "LOW") {
              info.rDesc = typhoonLang.msg('conte.0011');
            }
            else if (info.ws < 17) {
              info.rDesc = typhoonLang.msg('conte.0012');
            }
          }
        }

        if (isCut) {
          tracks.push(trackArr);
          trackArr = []; //초기화
        }

        //center style
        var s = ContentManager.getCenterIcon(info);
        center.setStyle(s);
        centerArr.push(center);

      } //for

      tracks.push(trackArr);
      typhoon.track = [];

      for (var i in tracks) {

        if (tracks[i].length < 2) {
          //선은 두점 이상 존재할 때 가능하므로 패스
          continue;
        }

        var tLineString = new ol.geom.LineString(tracks[i]);
        tLineString.transform('EPSG:4326', 'EPSG:111111');

        var track = new ol.Feature({
          geometry: tLineString
        });
        track.setId(contentManager.createFeatureId());
        track.setStyle(ContentManager.typhoonStyles.track);

        typhoon.track.push(track);
      }

      var fLineString = new ol.geom.LineString(forecastArr);
      fLineString.transform('EPSG:4326', 'EPSG:111111');

      var forecast = new ol.Feature({
        geometry: fLineString
      });
      forecast.setId(contentManager.createFeatureId());
      forecast.setStyle(ContentManager.typhoonStyles.forecast);

      typhoon.centers = centerArr;
      typhoon.forecast = forecast;

      //지도에 실측정보만 반영(예보 미반영)
      var source = mapManager.layers.typhoon.getSource();
      source.addFeatures(typhoon.track);

      //과거~현재까지의 중심점만 표시
      for (var i in centerArr) {
        var info = centerArr[i].get("info");
        if (info.tmTp.indexOf("F") < 0) {
          source.addFeature(centerArr[i]);
        }
      }

      //스플라인 정보(미래진로 및 외곽선) 표출
      $.get(ini, function(doc) {

          var docArr = doc.split("\n");
          var multiLineArray = {
            "line25": []
            , "line70": []
            , "line15": []
            , "lineSp70": [], //시간내삽 - 70%확률 반경 외곽선
            "lineSp15": [], //시간내삽 - 15m/s 반경 외곽선
            "lineSp00": [] //시간내삽 - 예보 중심이동 경로
          };

          var infoArr = docArr[0].split(',');

          if (infoArr.length != 3) {
            return false;
          }

          var arrayKey = "";
          var reStart = /^\d{2}/;
          var reStartSp = /^rtko66 \d{2}/;

          for (var i = 1; i < docArr.length; i++) {

            var tempArr1 = docArr[i].split(",");

            if (tempArr1.length < 2) {

              if (docArr[i].indexOf("rtko66") > -1) {

                if (docArr[i].lastIndexOf("start") > -1) {
                  var resultArray = reStartSp.exec(docArr[i]);
                  arrayKey = "lineSp" + resultArray[0].replace("rtko66 ", "");

                }
                else if (docArr[i].lastIndexOf("end") > -1) {
                  arrayKey = "";
                }

              }
              else {

                if (docArr[i].lastIndexOf("start") > -1) {
                  var resultArray = reStart.exec(docArr[i]);
                  arrayKey = "line" + resultArray[0];
                }
                else if (docArr[i].lastIndexOf("end") > -1) {
                  arrayKey = "";
                }
              }

              continue;

            }
            else if (arrayKey.length > 0) {
              var point1 = [parseFloat(tempArr1[1]), parseFloat(tempArr1[0])]; //경도, 위도
              multiLineArray[arrayKey].push(point1);
            }

          } //for

          //var source = mapManager.layers.typhoon.getSource();

          if (multiLineArray.line70.length > 0) {
            var polygon70 = new ol.geom.Polygon([multiLineArray.line70]);
            polygon70.transform('EPSG:4326', 'EPSG:111111');

            var feature70 = new ol.Feature({
              geometry: polygon70
            });
            feature70.setId(contentManager.createFeatureId());
            feature70.setStyle(ContentManager.typhoonStyles.area70);
            typhoon.area70 = feature70;

            //source.addFeature(typhoon.area70);
          }

          if (multiLineArray.line15.length > 0) {
            var polygon15 = new ol.geom.Polygon([multiLineArray.line15]);
            polygon15.transform('EPSG:4326', 'EPSG:111111');

            var feature15 = new ol.Feature({
              geometry: polygon15
            });
            feature15.setId(contentManager.createFeatureId());
            feature15.setStyle(ContentManager.typhoonStyles.area15);
            typhoon.area15 = feature15;

            //source.addFeature(typhoon.area15);
          }

          if (multiLineArray.line25.length > 0) {
            var polygon25 = new ol.geom.Polygon([multiLineArray.line25]);
            polygon25.transform('EPSG:4326', 'EPSG:111111');

            var feature25 = new ol.Feature({
              geometry: polygon25
            });
            feature25.setId(contentManager.createFeatureId());
            feature25.setStyle(ContentManager.typhoonStyles.area25);
            typhoon.area25 = feature25;

            //source.addFeature(typhoon.area25);
          }
          // 스플라인된 외곽선 표출 주석(사용안함)
          if (multiLineArray.lineSp70.length > 0) {
            var polygonSp70 = new ol.geom.Polygon([multiLineArray.lineSp70]);
            polygonSp70.transform('EPSG:4326', 'EPSG:111111');

            var featureSp70 = new ol.Feature({
              geometry: polygonSp70
            });

            featureSp70.setId(contentManager.createFeatureId());
            featureSp70.setStyle(ContentManager.typhoonStyles.area70);
            typhoon.areaSp70 = featureSp70;
          }

          if (multiLineArray.lineSp15.length > 0) {
            var polygonSp15 = new ol.geom.Polygon([multiLineArray.lineSp15]);
            polygonSp15.transform('EPSG:4326', 'EPSG:111111');

            var featureSp15 = new ol.Feature({
              geometry: polygonSp15
            });
            featureSp15.setId(contentManager.createFeatureId());
            featureSp15.setStyle(ContentManager.typhoonStyles.area15);
            typhoon.areaSp15 = featureSp15;
          }
          if (multiLineArray.lineSp00.length > 0) { //시간내삽 중심 이동선
            var startDate = infoArr[0].toDate(); //현재시각
            //var typSeq = infoArr[1];				//태풍번호
            var interval = parseInt(infoArr[2]); //내삽시간(1시간 단위)
            var fLineString = new ol.geom.LineString(multiLineArray.lineSp00);
            fLineString.transform('EPSG:4326', 'EPSG:111111');

            var featureSp = new ol.Feature({
              geometry: fLineString
              , info: {
                tmDate: startDate
                , utcTmDate: typhoonUtils.addHours(startDate, -9)
                , interval: interval
              }
            });
            featureSp.setId(contentManager.createFeatureId());
            featureSp.setStyle(ContentManager.typhoonStyles.forecast);
            typhoon.forecastSp = featureSp;
          }

          //목록 추가
          contentManager.appendSelectboxOption(typhoon);

        })
        .fail(function() {

          contentManager.appendSelectboxOption(typhoon);
        });

    })
    .fail(function() {

      contentManager.appendSelectboxOption(undefined);
    });
};

//현재진행중인 TD 정보 로딩
ContentManager.prototype.loadDepression = function(osp, ini) {
  var contentManager = this;
  var mapManager = contentManager.mapManager;

  function checkValidationRow(tempArr) {

    if (tempArr.length < 19 || tempArr[0].length < 1 || tempArr[1].length < 1 || tempArr[2].length < 1 || tempArr[1].toNumber() <=
      -999 || tempArr[2].toNumber() <= -999) {
      return false;
    }

    return true;
  }

  $.get(osp, function(data) { //load OSP file (track/forecast/centers)

      var trackCnt = 0; //과거~현재지점 포인트 갯수
      var tracks = []; //과거 이동 경로 목록
      var trackArr = []; //과거~현재지점 위경도 정보
      var forecastArr = []; //현재지점~예보 위경도 정보
      var centerArr = []; //중심점 features
      var ospFile = osp.split("/");
      var dataArr = data.split("\n");

      if (dataArr.length < 2) {
        contentManager.appendSelectboxOption(undefined);
        return false;
      }

      var infoArr = dataArr[0].split(","); //td_year,td_Seq,TD상황_현재일시(년월일시분),예보종료여부,typNo,typKorName,typEnName

      if (infoArr.length < 8 || infoArr[0].length < 1 || infoArr[1].length < 1) {
        contentManager.appendSelectboxOption(undefined);
        return false;
      }

      var depression = new ContentManager.Depression();
      depression.year = parseInt(infoArr[0]);
      depression.no = parseInt(infoArr[1]);
      depression.tmFc = ospFile[ospFile.length - 1].substr(7, 12); //발표시각은 파일명(kst)
      depression.tmEnd = infoArr[3]; //TD예보종료여부(Y/N)

      var currentTmDate = infoArr[2].toDate(); //현재시각
      var rTyphoonName = typhoonLang.currentLang !== "en" ? infoArr[6] : infoArr[7];

      for (var i = 1; i < dataArr.length; i++) {
        var isCut = false;
        var tempArr = dataArr[i].split(",");

        if (!checkValidationRow(tempArr)) {
          continue;
        }

        var nextTempArr = i < dataArr.length - 1 ? dataArr[i + 1].split(",") : undefined;

        if (typeof nextTempArr !== "undefined" && checkValidationRow(nextTempArr)) {

          //현재TD, 다음번이 연관태풍예보 이거나 현재가 연관예보이면서 다음번이 TD예보일때, 현재가 연관예보이고 다음번도 연관예보이면서 타입이 다른 경우
          if (tempArr[18].length < 1 && nextTempArr[18].length > 0 || tempArr[18].length > 0 && nextTempArr[18].length <
            1 || tempArr[18].length > 0 && nextTempArr[18].length > 0 && tempArr[18] !== nextTempArr[18]) {

            //이번과 다음번의 시간이 동일하지 않는다면->예보가 끊어진 것이다.
            if (tempArr[0] !== nextTempArr[0]) {
              isCut = true;
            }
            else {
              continue; //예보가 끊기지 않은 경우는 현재는 패스하고 나중에 예보된 내용을 표출한다.
            }
          }
        }

        var dirName = typhoonUtils.transValToDir(tempArr[4]);
        var info = {
          ref: depression
          , tm: tempArr[0], //일시(년월일시분)
          tmDate: tempArr[0].toDate(), //시간객체(kst)
          utcTmDate: typhoonUtils.addHours(tempArr[0].toDate(), -9), //utc tm date
          lat: tempArr[1], //위도(deg)
          lon: tempArr[2], //경도(deg)
          loc: tempArr[3], //위치설명
          dir: dirName, //방향
          sp: tempArr[5].toNumber(), //진행속도(km/h)
          ps: tempArr[6].toNumber(), //중심기압(hPa)
          ws: tempArr[7].toNumber(), //중심풍속(m/s)
          tp: tempArr[8], //TD,TS,LOW
          rad25: tempArr[9], //25m/s 반경(km)
          ed25: tempArr[10], //25m/s 예외방향(16방위)
          er25: tempArr[11], //25m/s 예외반경(km)
          rad15: tempArr[12], //15m/s 반경(강풍반경)(km)
          ed15: tempArr[13], //예외반경 방위
          er15: tempArr[14], //예외반경 (km)
          rad: tempArr[15], //70%확률반경 (km)
          rYear: tempArr[16], //연관개체 발생년도
          rSeq: tempArr[17], //연관개체 번호
          rTp: tempArr[18], //연관개체 타입(TD/TY)
          rTyphoonName: rTyphoonName, //연관태풍인 경우 태풍명
          rDesc: "", //이전 중심점이 연관개체인 경우 메세지
          tmTp: undefined //예보값인지, 현재, 과거 값인지 여부(F0,C,P0)
        };

        var pos = [parseFloat(info.lon), parseFloat(info.lat)]; //경위도
        var center = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform(pos, 'EPSG:4326', 'EPSG:111111'))
          , info: info
        });
        center.setId(contentManager.createFeatureId());

        var timeInterval = typhoonUtils.getIntervalHours(currentTmDate, info.tmDate);

        if (timeInterval > 0) { //미래
          info.tmTp = 'F' + timeInterval;
          forecastArr.push(pos);
        }
        else if (timeInterval == 0) { //현재
          info.tmTp = 'C';
          trackArr.push(pos);
          forecastArr.push(pos);
        }
        else { //과거
          info.tmTp = 'P' + ++trackCnt;
          trackArr.push(pos);
        }

        //rDesc 설정
        if (rTyphoonName.length > 0 && centerArr.length > 0) {

          var perInfo = centerArr[centerArr.length - 1].get("info");
          if (info.rTp === "TY") {

            if (perInfo.rTp.length < 1 || perInfo.rTp === "TD") { //이전이 TD 정보였고 현재가 TY인 경우

              if (perInfo.rTp.length < 1 || perInfo.rYear === currentTmDate.getFullYear()
                .toString()) {
                var resultMsg = typhoonLang.msg('conte.0006'); //Developed from No. {0} tropical depression
                info.rDesc = resultMsg.format(perInfo.rSeq);
              }
              else {
                var resultMsg = typhoonLang.msg('conte.0007'); //Developed from {0} No. {1} tropical depression
                info.rDesc = resultMsg.format(perInfo.rYear, perInfo.rSeq);
              }

            }
            else if (perInfo.rTp === "TY" && (info.tp === "TD" || info.tp === "LOW")) {
              var resultMsg = info.tp === "TD" ? typhoonLang.msg('conte.0012') : typhoonLang.msg('conte.0011');
              info.rDesc = resultMsg;
            }
          }
          else if ((info.rTp.length < 1 || info.rTp === "TD") && perInfo.rTp === "TY") {

            if (perInfo.rYear === currentTmDate.getFullYear()
              .toString()) {
              info.rDesc = typhoonLang.msg('conte.0010')
                .format(perInfo.rSeq, rTyphoonName);
            }
            else {
              info.rDesc = typhoonLang.msg('conte.0013')
                .format(perInfo.rYear, perInfo.rSeq, rTyphoonName);
            }
          }
        }

        if (isCut) {
          tracks.push(trackArr);
          trackArr = []; //초기화
        }

        var s = ContentManager.getCenterIcon(info);
        center.setStyle(s);
        centerArr.push(center);

      } //for

      //중심 이동 진로
      tracks.push(trackArr);
      depression.track = [];

      for (var i in tracks) {

        var tLineString = new ol.geom.LineString(tracks[i]);
        tLineString.transform('EPSG:4326', 'EPSG:111111');

        var track = new ol.Feature({
          geometry: tLineString
        });
        track.setId(contentManager.createFeatureId());
        track.setStyle(ContentManager.typhoonStyles.trackTd);

        depression.track.push(track);
      }

      var fLineString = new ol.geom.LineString(forecastArr);
      fLineString.transform('EPSG:4326', 'EPSG:111111');

      var forecast = new ol.Feature({
        geometry: fLineString
      });
      forecast.setId(contentManager.createFeatureId());
      forecast.setStyle(ContentManager.typhoonStyles.forecastTd);

      depression.centers = centerArr;
      depression.forecast = forecast;

      //지도에 반영
      var source = mapManager.layers.typhoon.getSource();
      source.addFeature(depression.forecast);
      source.addFeatures(depression.track);
      source.addFeatures(depression.centers);

      //스플라인 정보(미래진로 및 외곽선) 표출
      $.get(ini, function(doc) {

          var docArr = doc.split("\n");
          var multiLineArray = {
            "line70": []
          };

          var arrayKey = "";
          var reStart = /^\d{2}/;

          for (var i = 0; i < docArr.length; i++) {

            var tempArr1 = docArr[i].split(",");

            if (tempArr1.length < 2) {

              if (docArr[i].lastIndexOf("start") > -1) {
                var resultArray = reStart.exec(docArr[i]);
                arrayKey = "line" + resultArray[0];
              }
              else if (docArr[i].lastIndexOf("end") > -1) {
                arrayKey = "";
              }

            }
            else if (arrayKey.length > 0) {
              var point1 = [parseFloat(tempArr1[1]), parseFloat(tempArr1[0])]; //경도, 위도
              multiLineArray[arrayKey].push(point1);
            }

          } //for

          if (multiLineArray.line70.length > 0) {
            var polygon70 = new ol.geom.Polygon([multiLineArray.line70]);
            polygon70.transform('EPSG:4326', 'EPSG:111111');

            var feature70 = new ol.Feature({
              geometry: polygon70
            });
            feature70.setId(contentManager.createFeatureId());
            feature70.setStyle(ContentManager.typhoonStyles.area70);
            depression.area70 = feature70;

            //source.addFeature(depression.area70);
          }

          //목록 추가
          contentManager.appendSelectboxOption(depression);

        })
        .fail(function() {

          contentManager.appendSelectboxOption(depression);
        });

    })
    .fail(function() {

      contentManager.appendSelectboxOption(undefined);
    });;

};

// 태풍 오버레이
ContentManager.prototype.featureOverlay = function(evt) {
  var map = mapManager.map;
  var typhoonLayer = mapManager.layers.typhoon;
  var popupId = mapManager.config.popup;
  var popup = mapManager.popup;
  var feature;

  try {
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);

    map.getTarget()
      .style.cursor = hit ? 'pointer' : '';

    //태풍중심 아이콘 마우스 오버 시, DIV 정보 표출
    feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
      if (layer === typhoonLayer) {
        return feature;
      }
      return undefined;
    });

    if (typeof feature === "undefined") {
      //popup overlay 안보이게 하기
      if (typeof popup !== "undefined") {
        popup.setPosition(undefined);
      }
    }
    else {

      if (feature.getGeometry() instanceof ol.geom.Point) { //태풍 또는 TD 중심
        //popup overlay 보이게 하기
        var info = feature.get("info");

        if (info.ref instanceof ContentManager.Typhoon && info.rTp !== "TD" || info.rTp === "TY") { //태풍인 경우
          var className = "g";
          var tmComments = "";
          var title = "";
       
          if (typhoonLang.currentLang === "en") {
	            var tm = info.utcTmDate.yyyymmddhhmi();
	            if (info.tmTp.indexOf("F") > -1) {
	              tmComments = typhoonLang.msg('typho.0011')
	                .format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(
	                  8, 10)); //{MM}.{DD}. {hh} Forecast
	              className = "p";
	            }
	            else {
	              tmComments = typhoonLang.msg('typho.0012')
	                .format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(
	                  8, 10)); //{MM}.{DD}. {hh} Analysis
	            }
	            
	            if (info.rTp === "TY") {
	              title = typhoonLang.msg('typho.0013')
	                .format(info.rSeq, info.rTyphoonName, tmComments); //No. {0} Typhoon {1}<br/>({2})
	            }
	            else {
	              title = typhoonLang.msg('typho.0013')
	                .format(info.ref.no, info.ref.enName, tmComments); //No. {0} Typhoon {1}<br/>({2})
	            }
          }else {
	            if (info.tmTp.indexOf("F") > -1) {
	              tmComments = typhoonLang.msg('typho.0011')
	                .format(info.tmTp.replace("F", "")); //예보간격이 24시 아닌 경우도 존재함.
	              className = "p";
	            }
	            else if (info.tmTp == "C") {
	              tmComments = typhoonLang.msg('typho.0012');
	            }
	
	            var tmString = info.tm.dateTimeFormat();
	          
	
	            if (info.rTp === "TY") {
	              //'제 {0}호 태풍 {1} {2}<br/>({3})'
	              title = typhoonLang.msg('typho.0013')
	                .format(info.ref.year,info.rSeq, info.rTyphoonName, tmString);
	            }
	            else {
	              //'제 {0}호 태풍 {1} {2}<br/>({3})'
	              title = typhoonLang.msg('typho.0013')
	                .format(info.ref.year,info.ref.no, info.ref.name, tmString);
	            }
          }

          var contents = typhoonLang.msg('typho.0014'); //<li>중심위치:{0}˚N,{1}˚E</li><li>최대풍속(중심기압):{2}㎧({3}hPa){4}</li><li>강풍반경(예외반경):{5}㎞({6} 약{7}㎞){8}</li>
          contents = contents.format(info.lat, info.lon, typhoonUtils.zeroToBlank(info.ws, '-'), typhoonUtils.zeroToBlank(
              info.ps, '-'), typhoonUtils.transValToStrength(info.ws), typhoonUtils.zeroToBlank(info.rad15
              , '-'), typhoonUtils.transValToDir(info.ed15), typhoonUtils.zeroToBlank(info.er15, '-')
            , typhoonUtils.transValToSize(info.tp, info.rad15)
          );

          if (info.rDesc.length > 0) {
            contents += "<li style='color:#E0040B;'>" + info.rDesc + "</li>";
          }
          var html = {
            title: title
            , contents: contents
            , className: className
          };
          feature.html = html;

          // var popupObj = $("#" + popupId);
          // popupObj.find("div.date")
          //   .html(title);
          // popupObj.find("ul")
          //   .html(contents);
          //
          // var bottom = (popupObj.height() / 2 + 10) + "px";
          // popupObj.removeClass("typhoon_g typhoon_p");
          // popupObj.addClass("typhoon_" + className);
          // popupObj.css("bottom", bottom);
          // popupObj.find("span.arrow > img")
          //   .attr("src", "../../images/weather/typoon/typ_new/bg_arrow_map_" +
          //     className + ".png");
          //
          // if (typeof popup !== "undefined") {
          //   popup.setElement(document.getElementById(popupId));
          //   popup.setPosition(feature.getGeometry()
          //     .getCoordinates());
          // }
          // else {
          //
          //   mapManager.popup = new ol.Overlay({
          //     position: feature.getGeometry()
          //       .getCoordinates()
          //     , positioning: 'center-center'
          //     , element: document.getElementById(popupId)
          //     , stopEvent: false
          //   });
          //   map.addOverlay(mapManager.popup);
          // }

        }
        else if (info.ref instanceof ContentManager.Depression && info.rTp !== "TY" || info.rTp === "TD") { //TD인 경우

          var className = "g";
          var title = "";

          if (typhoonLang.currentLang === "en") {

            var tm = info.utcTmDate.yyyymmddhhmi();
            var tmComments = "";

            if (info.tmTp.indexOf("F") > -1) {
              tmComments = typhoonLang.msg('typho.0011')
                .format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(
                  8, 10)); //{MM}.{DD}. {hh} Forecast
              className = "p";
            }
            else {
              tmComments = typhoonLang.msg('typho.0012')
                .format(tm.substring(4, 6), tm.substring(6, 8), tm.substring(
                  8, 10)); //{MM}.{DD}. {hh} Analysis
            }

            //No. {0} Tropical Depression<br/>({1})
            if (info.rTp === "TD") {
              title = typhoonLang.msg('typho.0015')
                .format(info.rSeq, tmComments);
            }
            else {
              title = typhoonLang.msg('typho.0015')
                .format(info.ref.no, tmComments);
            }

          }
          else {

            var tmComments = "";
            if (info.tmTp.indexOf("F") > -1) {
              tmComments = typhoonLang.msg('typho.0011')
                .format(info.tmTp.replace("F", ""));
              className = "p";
            }
            else if (info.tmTp == "C") {
              tmComments = typhoonLang.msg('typho.0012');
            }

            var tmString = info.tm.dateTimeFormat();
            //"제 {0}호 열대저압부 {1}<br/>({2})"
            if (info.rTp === "TD") {
              title = typhoonLang.msg('typho.0015')
                .format(info.ref.year, info.rSeq, tmComments, tmString);
            }
            else {
              title = typhoonLang.msg('typho.0015')
                .format(info.ref.year, info.ref.no, tmComments, tmString);
            }

          }

          var contents = typhoonLang.msg('typho.0016')
            .format(info.lat, info.lon, typhoonUtils.zeroToBlank(info
                .ws, '-'), typhoonUtils.zeroToBlank(info.ps, '-'), typhoonUtils.zeroToBlank(info.sp, '-')
              , typhoonUtils.zeroToBlank(info.dir, '-'));
          if (info.rDesc.length > 0) {
            contents += "<li style='color:#E0040B;'>" + info.rDesc + "</li>";
          }

          var html = {
            title: title
            , contents: contents
            , className: className
          };
          feature.html = html;

          // var popupObj = $("#" + popupId);
          // popupObj.find("div.date")
          //   .html(title);
          // popupObj.find("ul")
          //   .html(contents);
          //
          // var bottom = (popupObj.height() / 2 + 10) + "px";
          // popupObj.removeClass("typhoon_g typhoon_p");
          // popupObj.addClass("typhoon_" + className);
          // popupObj.css("bottom", bottom);
          // popupObj.find("span.arrow > img")
          //   .attr("src", "../../images/weather/typoon/typ_new/bg_arrow_map_" +
          //     className + ".png");
          //
          // if (typeof popup !== "undefined") {
          //
          //   popup.setElement(document.getElementById(popupId));
          //   popup.setPosition(feature.getGeometry()
          //     .getCoordinates());
          //
          // }
          // else {
          //
          //   mapManager.popup = new ol.Overlay({
          //     position: feature.getGeometry()
          //       .getCoordinates()
          //     , positioning: 'center-center'
          //     , element: document.getElementById(popupId)
          //     , stopEvent: false
          //   });
          //   map.addOverlay(mapManager.popup);
          // }

        }

      }
    }
  }
  catch (error) {
  }
  return feature;
}

ContentManager.prototype.appendSelectboxOption = function(item) {

  var contentManager = this;

  contentManager.loadCnt--; //로드 완료 의미

  if (item instanceof ContentManager.Typhoon) {
    //태풍목록에 추가
    contentManager.typhoons[item.getKey()] = item;

  }
  else if (item instanceof ContentManager.Depression) {
    //TD목록에 추가
    contentManager.depressions[item.getKey()] = item;
  }

  //옵션 총 건수
  if (contentManager.loadCnt < 1) {

    var realCnt = 0;

    for (var key in contentManager.typhoons) {
      realCnt++;
    }

    for (var key in contentManager.depressions) {
      realCnt++;
    }

    //마지막 아이템이 추가된 경우
    if (realCnt > 0) {

      function asc(a, b) { // 번호순 : 4, 33, 222, 1111
        return a - b;
      }

      var optionTyArray = []; //오름차순 정렬
      var optionTdArray = []; //오름차순 정렬

      for (var key in contentManager.typhoons) {
        optionTyArray.push(parseInt(contentManager.typhoons[key].getKey()
          .replace("TY", "")));
      }
      for (var key in contentManager.depressions) {
        optionTdArray.push(parseInt(contentManager.depressions[key].getKey()
          .replace("TD", "")));
      }

      optionTyArray.sort(asc);
      optionTdArray.sort(asc);

      var selectbox = $("#" + mapManager.config.selectbox);
      var strHtml = "";
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();

      for (var i in optionTyArray) {
        var typhoon = contentManager.typhoons["TY" + optionTyArray[i]];
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

      for (var i in optionTdArray) {
        var depression = contentManager.depressions["TD" + optionTdArray[i]];
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
//      mapManager.addNoItemMsgControl(); //현재 진행 중인 태풍 또는 열대저압부가 없습니다.
    }
  }

};

//Typhoon 객체
ContentManager.Typhoon = function() {
  this.tmFc; //예보시각
  this.year; //태풍발생년도
  this.no; //태풍번호
  this.name; //태풍명
  this.enName; //태풍영문명
  this.track; //과거 ~ 현재까지 경로
  this.forecast; //현재 ~ 예측 경로(직선)
  this.area70; //태풍 중심위치의 70% 확률영역
  this.area15; //3일 예보 구간까지의 초속 15m 강풍영역
  this.area25; //현재 위치에서의 초속 25 m 폭풍영역
  this.centers; //태풍 중심
  this.forecastSp; //현재 ~ 예측 경로(spline)
  this.areaSp70; //태풍 중심위치의 70% 확률영역(spline)
  this.areaSp15; //3일 예보 구간까지의 초속 15m 강풍영역(spline)
  this.nearlest; //최근접선
};

ContentManager.Typhoon.prototype.getKey = function() {
  return "TY" + this.year + this.no;
};

ContentManager.Typhoon.prototype.getFeatures = function() {
  var arr = [];
  var keys = Object.keys(this);

  for (var i in keys) {
    if (this[keys[i]] instanceof ol.Feature) {
      arr.push(this[keys[i]]);
    }
    else if (this[keys[i]] instanceof Array) {
      var tempArr = this[keys[i]];
      for (var j in tempArr) {
        if (tempArr[j] instanceof ol.Feature) {
          arr.push(tempArr[j]);
        }
      }
    }
  }

  return arr;
};

//val 가 true 이면 예보정보까지 보이고 , false 이면 현재까지 정보만 표출
/*
 * 태풍이 그려진 레이어의 벡터 소스 : source
 * 태풍예보정보를 표출하는 옵션 : all (true 이면 예보 정보 보이게한다.)
 * 태풍예보 표출시 옵션 : nearlest (true 이면 spine 처리된 예보정보로 표출한다.)
 * */
ContentManager.Typhoon.prototype.redraw = function(contentManager, all, nearlest) {

  //this.forecast;	//현재 ~ 예측 경로(직선)
  //this.area70;		//태풍 중심위치의 70% 확률영역
  //this.area15;		//3일 예보 구간까지의 초속 15m 강풍영역
  //this.area25;		//현재 위치에서의 초속 25 m 폭풍영역
  //this.centers;		//태풍 중심
  //this.forecastSp;	//현재 ~ 예측 경로(spline)
  //this.areaSp70;	//태풍 중심위치의 70% 확률영역(spline)
  //this.areaSp15;	//3일 예보 구간까지의 초속 15m 강풍영역(spline)
  //this.nearlest;	//최근접선

  var source = contentManager.mapManager.layers.typhoon.getSource();

  if (all == true) {

    if (nearlest == true) {

      if (typeof this.forecastSp !== "undefined" && source.getFeatureById(this.forecastSp.getId()) == null) {
        source.addFeature(this.forecastSp);
      }

      if (typeof this.areaSp70 !== "undefined" && source.getFeatureById(this.areaSp70.getId()) == null) {
        source.addFeature(this.areaSp70);
      }

      if (typeof this.areaSp15 !== "undefined" && source.getFeatureById(this.areaSp15.getId()) == null) {
        source.addFeature(this.areaSp15);
      }

      this.unShowNearlestLine(contentManager);

    }
    else {

      if (typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) == null) {
        source.addFeature(this.forecast);
      }
      if (typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) == null) {
        source.addFeature(this.area70);
      }

      if (typeof this.area15 !== "undefined" && source.getFeatureById(this.area15.getId()) == null) {
        source.addFeature(this.area15);
      }
    }

    if (typeof this.area25 !== "undefined" && source.getFeatureById(this.area25.getId()) == null) {
      source.addFeature(this.area25);
    }

    if (typeof this.centers !== "undefined") {

      for (var i in this.centers) {

        var info = this.centers[i].get("info");

        this.centers[i].setStyle(ContentManager.getCenterIcon(info, true));

        if (info.tmTp.indexOf("F") > -1 && source.getFeatureById(this.centers[i].getId()) == null) {
          source.addFeature(this.centers[i]);
        }
      }
    }

  }
  else {

    if (nearlest == true) {

      if (typeof this.forecastSp !== "undefined" && source.getFeatureById(this.forecastSp.getId()) != null) {
        source.removeFeature(this.forecastSp);
      }
      if (typeof this.areaSp70 !== "undefined" && source.getFeatureById(this.areaSp70.getId()) != null) {
        source.removeFeature(this.areaSp70);
      }

      if (typeof this.areaSp15 !== "undefined" && source.getFeatureById(this.areaSp15.getId()) != null) {
        source.removeFeature(this.areaSp15);
      }

      this.unShowNearlestLine(contentManager);
    }
    else {

      if (typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) != null) {
        source.removeFeature(this.forecast);
      }
      if (typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) != null) {
        source.removeFeature(this.area70);
      }

      if (typeof this.area15 !== "undefined" && source.getFeatureById(this.area15.getId()) != null) {
        source.removeFeature(this.area15);
      }
    }

    if (typeof this.area25 !== "undefined" && source.getFeatureById(this.area25.getId()) != null) {
      source.removeFeature(this.area25);
    }

    if (typeof this.centers !== "undefined") {

      for (var i in this.centers) {

        var info = this.centers[i].get("info");

        this.centers[i].setStyle(ContentManager.getCenterIcon(info, false));

        if (info.tmTp.indexOf("F") > -1 && source.getFeatureById(this.centers[i].getId()) != null) {
          source.removeFeature(this.centers[i]);
        }
      }
    }
  }
};

ContentManager.Typhoon.prototype.refreshIcons = function(isActive) {
  if (typeof this.centers !== "undefined") {

    for (var i in this.centers) {

      var info = this.centers[i].get("info");
      this.centers[i].setStyle(ContentManager.getCenterIcon(info, isActive));
    }
  }

};
ContentManager.Typhoon.prototype.getCenter = function() {
  var centers = this.centers;
  for (var i in centers) {
    var info = centers[i].get("info");
    if (info.tmTp === "C") {
      return centers[i].getGeometry()
        .getLastCoordinate();
    }
  }
};

//태풍의 최근접선 표출
ContentManager.Typhoon.prototype.showNearlestLine = function(contentManager, feature) {

  if (typeof this.forecastSp === "undefined") {
    return false;
  }

  var source = contentManager.mapManager.layers.typhoon.getSource();
  var featurePos = [parseFloat(feature.get("x")), parseFloat(feature.get("y"))];

  if (typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())) {
    this.unShowNearlestLine(contentManager);
  }

  //var wgs84Sphere= new ol.Sphere(6378137);
  var info = this.forecastSp.get("info");
  var coordinates = this.forecastSp.getGeometry()
    .getCoordinates();
  var posArr = [];

  var dmin = 99999.9; //taps client 로직
  var minDistance = Number.MAX_VALUE;
  var minIdx = coordinates.length;

  for (var i in coordinates) {
    var centerPos = ol.proj.transform(coordinates[i], 'EPSG:111111', 'EPSG:4326'); //경도, 위도
    var distance = typhoonUtils.getDistance(featurePos, centerPos);
    posArr.push(centerPos);
    //var distance2 = wgs84Sphere.haversineDistance(centerPos,featurePos);

    if (minDistance > distance) {
      minDistance = distance;
      minIdx = i;
    }
  }

  if (minIdx < posArr.length && minDistance < dmin) {

    var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate : info.tmDate;
    tmDate = typhoonUtils.addHours(tmDate, minIdx * info.interval); //index 가 0일때, 내삽시점의 시각이다.
    var centerPos = posArr[minIdx];
    /*
    key: "블라디보스토크"
    key_eng: "Vladivostok"
    national: "러시아"
    */
    var textFormat = typhoonLang.msg('conte.0001');
    //var city = typhoonUtils.getCityName(feature);
    //var direction = typhoonUtils.getWdir(typhoonUtils.areaToWindPoint(featurePos,centerPos));
    var mm = (tmDate.getMonth() + 1)
      .toString(); // getMonth() is zero-based
    var dd = tmDate.getDate()
      .toString();
    var hh = tmDate.getHours()
      .toString();
    var ds = Math.round(minDistance / 10) * 10;
    var text = textFormat.format(mm, dd, hh, ds + "");

    var tLineString = new ol.geom.LineString([featurePos, centerPos]);
    tLineString.transform('EPSG:4326', 'EPSG:111111');

    var overlayId = contentManager.mapManager.addOverlay(text, tLineString.getLastCoordinate());

    var nearlest = new ol.Feature({
      geometry: tLineString
      , overlayId: overlayId
    });
    nearlest.setId(contentManager.createFeatureId());

    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 0.7)'
          , width: 5
        })
        /*,
                  text : new ol.style.Text({
                  font: '15px Dotum, "돋움", AppleGothic, sans-serif',
                  text : text,
                  textAlign : "left",16
                  textBaseline : "middle",
                  offsetX : -70,
                  offsetY : -10,
                  stroke: new ol.style.Stroke({
                  color: '#9A0202',
                  width: 1
                })

              })*/
    });

    nearlest.setStyle(style);

    this.nearlest = nearlest;
    source.addFeature(this.nearlest);
  }
};

//태풍의 최근접 선 표출
ContentManager.Typhoon.prototype.unShowNearlestLine = function(contentManager) {

  var source = contentManager.mapManager.layers.typhoon.getSource();

  if (typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())) {
    var overlayId = this.nearlest.get("overlayId");
    source.removeFeature(this.nearlest);
    this.nearlest = undefined;
    contentManager.mapManager.removeOverlay(overlayId);
  }
};

ContentManager.Depression = function() {
  this.tmFc; //예보시각
  this.year; //TD발생년도
  this.no; //TD번호
  this.tmEnd; //TD예보종료여부(Y/N)
  this.track; //과거 ~ 현재까지 경로
  this.forecast; //현재 ~ 예측 경로
  this.centers; //TD 중심
  this.area70; //TD 70%확률반경
};

ContentManager.Depression.prototype.getKey = function() {
  return "TD" + this.year + this.no;
};

ContentManager.Depression.prototype.getFeatures = function() {
  var arr = [];
  var keys = Object.keys(this);

  for (var i in keys) {
    if (this[keys[i]] instanceof ol.Feature) {
      arr.push(this[keys[i]]);
    }
    else if (this[keys[i]] instanceof Array) {
      var tempArr = this[keys[i]];
      for (var j in tempArr) {
        if (tempArr[j] instanceof ol.Feature) {
          arr.push(tempArr[j]);
        }
      }
    }
  }

  return arr;
};

ContentManager.Depression.prototype.setVisible = function(source, val) {

  var fs = this.getFeatures();

  for (var i in fs) {

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

ContentManager.Depression.prototype.getCenter = function() {
  var centers = this.centers;
  for (var i in centers) {
    var info = centers[i].get("info");
    if (info.tmTp === "C") {
      return centers[i].getGeometry()
        .getLastCoordinate();
    }
  }
};

ContentManager.Depression.prototype.refreshIcons = function(isActive) {

  if (typeof this.centers !== "undefined") {

    for (var i in this.centers) {

      var info = this.centers[i].get("info");

      this.centers[i].setStyle(ContentManager.getCenterIcon(info, isActive));
    }
  }
};

ContentManager.Depression.prototype.redraw = function(contentManager, isActive) {

  var source = contentManager.mapManager.layers.typhoon.getSource();

  if (isActive) {

    if (typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) == null) {
      source.addFeature(this.area70);
    }

    if (typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) == null) {
      source.addFeature(this.forecast);
    }

    if (typeof this.centers !== "undefined") {

      for (var i in this.centers) {

        var info = this.centers[i].get("info");

        this.centers[i].setStyle(ContentManager.getCenterIcon(info, isActive));

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

      for (var i in this.centers) {

        var info = this.centers[i].get("info");

        this.centers[i].setStyle(ContentManager.getCenterIcon(info, isActive));

        if (info.tmTp.indexOf("F") > -1 && source.getFeatureById(this.centers[i].getId()) != null) {
          source.removeFeature(this.centers[i]);
        }
      }
    }
  }
};
