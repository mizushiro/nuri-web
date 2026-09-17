var pastTypStyleManager = {};

pastTypStyleManager.trackStrokes = [ // 태풍 별 라인 스타일
'rgba(199,  21, 133, 1)', 'rgba( 16,  78, 139, 1)', 'rgba(102, 204,   0, 1)', 'rgba(205, 133,   0, 1)',
    'rgba(153,  50, 204, 1)', 'rgba(100, 100, 100, 1)', 'rgba(204,  90,  91, 1)', 'rgba(  0, 130, 200, 1)',
    'rgba( 51, 204, 153, 1)', 'rgba(153,  51,   0, 1)', 'rgba(142,  56, 142, 1)', 'rgba(150, 150, 150, 1)',
    'rgba(235,   0,   0, 1)', 'rgba( 50,   0, 185, 1)', 'rgba( 61, 145,  64, 1)', 'rgba(255, 124,  31, 1)',
    'rgba( 75,   0, 130, 1)', 'rgba( 50,  50,  50, 1)' ];

pastTypStyleManager.typhoonStyles = { // 태풍 스타일
  pastIcon : { // 예보 태풍중심 아이콘
    forecastTd : new ol.style.Style({
      image : new ol.style.Icon({
        scale : 1,
        opacity : 1,
        src : urlPrefix + 'resources/image/typoon/gis/td_red.png'
      })
    }),
    end_typ : new ol.style.Style({ /* td end */
//      text : new ol.style.Text({
//        text : "",
//        textAlign : "start",
//        offsetY : -12,
//        stroke : new ol.style.Stroke({
//          color : '#E0040B',
//          width : 1
//        })
//      }),
      image : new ol.style.Icon({
		scale : 1,
		opacity : 1,
		src : urlPrefix + 'resources/image/typoon/gis/td_red.png'
      })
    }),
    end_td : new ol.style.Style({ /* td end */
//      text : new ol.style.Text({
//        text : "TD",
//        textAlign : "start",
//        offsetY : -12,
//        stroke : new ol.style.Stroke({
//          color : '#E0040B',
//          width : 1
//        })
//      }),
      image : new ol.style.Icon({
    	anchor :[0.5,0.8],
        scale : 1,
        opacity : 1,
        src : urlPrefix + 'resources/image/typoon/gis/red_td.png'
      })
    }),
    end_low : new ol.style.Style({
//      text : new ol.style.Text({
//        text : "L",
//        textAlign : "start",
//        offsetY : -12,
//        stroke : new ol.style.Stroke({
//          color : '#E0040B',
//          width : 1
//        })
//      }),
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
    }),
    weak : new ol.style.Style({
      image : new ol.style.Icon({
        scale : 1,
        opacity : 1,
        src : urlPrefix + 'resources/image/typoon/gis/weak.png'
      })
    }),
    normal : new ol.style.Style({
      image : new ol.style.Icon({
        scale : 1,
        opacity : 1,
        src : urlPrefix + 'resources/image/typoon/gis/normal.png'
      })
    }),
    strong : new ol.style.Style({
      image : new ol.style.Icon({
        scale : 1,
        opacity : 1,
        src : urlPrefix + 'resources/image/typoon/gis/strong.png'
      })
    }),
    very : new ol.style.Style({
      image : new ol.style.Icon({
        scale : 1,
        opacity : 1,
        src : urlPrefix + 'resources/image/typoon/gis/very.png'
      })
    })
    ,
    superStrong : new ol.style.Style({   //20210429 태풍찾아보기 초강력아이콘 추가, 손태림
      image : new ol.style.Icon({
        scale : 1,
        opacity : 1,
        src : urlPrefix + 'resources/image/typoon/gis/super.png'
      })
    })
  },
  pastIcon2 : {	//예보 태풍중심 아이콘
		forecastTd : new ol.style.Style({
			image: new ol.style.Icon({
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/td_red.png'
            })
		}),low : new ol.style.Style({
//				text : new ol.style.Text({
//					text : "L",
//					textAlign : "start",
//					offsetY : -12,
//					stroke: new ol.style.Stroke({
//							  color: '#E0040B',
//							  width: 1
//							})
//				}),
				image: new ol.style.Icon({
					anchor :[0.5,0.8],
	                scale: 1,  
	                opacity: 1,
	                src: urlPrefix + 'resources/image/typoon/gis/red_td_low.png'
				}) 
		}),td : new ol.style.Style({
//				text : new ol.style.Text({
//					text : "TD",
//					textAlign : "start",
//					offsetY : -12,
//					stroke: new ol.style.Stroke({
//							  color: '#E0040B',
//							  width: 1
//							})
//				}),
				image: new ol.style.Icon({
					anchor :[0.5,0.8],
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/red_td.png'
                })
		}),weak : new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/weak2.png'
                })
		}),normal : new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/normal2.png'
                })
		}),strong : new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/strong2.png'
                })
		}),very : new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/very2.png'
                })
		}),superStrong : new ol.style.Style({  //20210429 태풍찾아보기 초강력아이콘 추가, 손태림
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/super2.png'
                })
		}) 
	}
};

// index 별 태풍 스타일 반환.
pastTypStyleManager.getTyphoonTrackStyle = function(index) {
  if (index < 0) {
    index = 0;
  }

  var key = index % pastTypStyleManager.trackStrokes.length;
  var lineColor = pastTypStyleManager.trackStrokes[key];

  var style = new ol.style.Style({
    fill : new ol.style.Fill({
      color : 'rgba(0, 0, 0, 0)'
    }),
    stroke : new ol.style.Stroke({
      color : lineColor,
      width : 1
    })
  });

  return style;
};

pastTypStyleManager.getResizeIcon = function(suffix) {
	function getStyle(sub){ 
		  var image = undefined;
		  var text = sub.getText();
		  var image_ori = sub.getImage();
		  if (objectUtils.isUndefined(image_ori) === false) {
		    var pathArr = image_ori.getSrc().replace("big_", "").replace(".png", "").split("]");
		    image = new ol.style.Icon({
		      scale : 1,
		      opacity : 1,
		      src : pathArr[0] + suffix + '.png'
		    });
		  }
		  var style = new ol.style.Style({
		    text : text,
		    image : image
		  });
		  return style;
	}
	
	//image , text
	for(var mainKey in this.pastIcon){
		for(var subKey in this.pastIcon[mainKey]){
			 var sub = this.pastIcon[mainKey][subKey];
			 if(sub!=null && typeof sub !== "undefined"){
				 this.pastIcon[mainKey][subKey] = getStyle(sub);
			 }
		 }
	 }
	for(var subKey in this.pastIcon2){
		 var sub = this.pastIcon2[subKey];
		 if(sub!=null && typeof sub !== "undefined"){
			 this.pastIcon2[subKey] = getStyle(sub);
		 }
	}
	
};

// 중심 아이콘 스타일 리턴(TYP)
pastTypStyleManager.getTyphoonCenterStyle = function(ws, tp, index, length) {
  // 현재 또는 미래의 td는 빨간 아이콘으로
	
//	alert("ws, tp, index, length=="+ws+tp+index+length);
  var icon = pastTypStyleManager.typhoonStyles.pastIcon;
  if (index === 0) {   //현재 태풍의 마지막 빨간색으로
      // 마지막.
      if (tp === 'TD') {
        return icon.end_td;
      } else if (tp === 'LOW') {
        return icon.end_low;
      }
      return icon.end_typ;
    }
  if (ws >= 54) { //20210429 태풍찾아보기 초강력 아이콘 추가. First layer on map 손태림
	return icon.superStrong;
  } else if (ws >= 44) { // 매우 강
    return icon.very;
  } else if (ws >= 33) { // 강
    return icon.strong;
  } else if (ws >= 25) { // 중
    return icon.normal;
  } else if (ws >= 17) { // 약
    return icon.weak;
  } else if (ws < 17) { // 열대저압부
     if(tp == '' && index == length){
        return icon.end_td;
    } else if (length - 1 - index > 0) {
      // 진행중.
      return icon.ing_td;
    } else {
      // 시작.
      return icon.start_td;
    }
  }
};
