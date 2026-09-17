var PastTyphoonrManager = {};

// 키 분리
PastTyphoonrManager.parseKey = function(key) {
  var Array = key.split("_");
  if (objectUtils.isUndefined(array)) {
    return undefined;
  }
  var result = {
    type : Array[0],
    year : Array[1],
    seq : Array[2],
  };
  return result;
};

// Typhoon 객체
var PastTyphoon = function(typInf, drawIdx) {
  this.year = -1; // 태풍발생년도
  this.seq = -1; // 태풍번호
  this.name = ''; // 태풍명
  this.nameEn = ''; // 태풍영문명

  this.headers = []; // TD, TYP 정보를 가지는 객체.
  this.tracks = []; // 트랙 경로

  this.centers = []; // Marke: 태풍 중심 그리기 객체.

  this.html; // 팝업을 위한 정보
  this.feature = undefined; // 태풍을 그리기 위한 객체.

  this.drawIdx = 0; // 태풍 스타일을 가져오기 위한 인덱스

  this.tmSt = "-"; // 태풍 시작시간
  this.tmEd = "-"; // 태풍 종료시간
  this.tmStEx = "-"; // 태풍 시작시간 (EX)
  this.tmEdEx = "-"; // 태풍 종료시간 (EX)
  this.tmStUtc = "-"; // 태풍 시작시간 (UTC)
  this.tmEdUtc = "-"; // 태풍 종료시간 (UTC)
  this.range = {}; // 태풍 범위

  this.loadTyp(typInf, drawIdx);
  this.addEventZoom();
  this.onlySelected = true;	//선택된 태풍만 예보값 표출(디폴트)
};

// //////////////////////////////////////////////////////////////////////////////
// DEFINE
// //////////////////////////////////////////////////////////////////////////////

// 태풍 적용.
PastTyphoon.prototype.loadTyp = function(typInf, drawIdx) {
  if (objectUtils.isUndefined(typInf)) {
    return;
  }
  var past = this;
  past.year = typInf.year + "";
  past.seq = typInf.seq + "";
  past.name = typInf.name || '-';
  if (past.name === '-') {
    past.name = typInf.nameEn || '-';
  }
  past.nameEn = typInf.nameEn;

  past.headers = typInf.headers;
  past.tracks = typInf.tracks;
  
  past.drawIdx = drawIdx;

  past.tmSt = typInf.tmStart;
  past.tmEd = typInf.tmEnd;
  past.tmStEx = typInf.tmStartEx;
  past.tmEdEx = typInf.tmEndEx;
  past.tmStUtc = typInf.tmStartUtc;
  past.tmEdUtc = typInf.tmEndUtc;

  past.range = typInf.range;

  past.initCenters(); // html 보다 위에 있어야 한다.
  past.initHtml(); // feature 보다 위에 있어야 한다.
  past.initFreature(typInf);
};

// 태풍 중심 좌표 만들기.
PastTyphoon.prototype.initCenters = function() {
  var lon_min = 0;
  var lon_max = 0;
  var lat_min = 0;
  var lat_max = 0;

  var isTyphoon = false;
  var past = this;
  var headers = past.headers;
  var tracks = past.tracks;
  var seqArray =  new Array();
  
  var j=0;
  for ( var i = 0; i < tracks.length; i++) {
	    var track = tracks[i];

	    var idx = track.key;
	    if (idx >= headers.length) {
	      continue;
	    }
	  var header = headers[idx];
	
	  if (header.key !== track.key) {
		  header = undefined;
		  for ( var k = 0; k < headers.length; k++) {
			  var temp = headers[k];
			  if (track.key === temp.key) {
				  header = temp;
			  }
		  }
	  }
	  if (objectUtils.isUndefined(header)) {
		  continue;
	  }
	  seqArray.push(header.seq);
  }
  
  for ( var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    var idx = track.key;
    if (idx >= headers.length) {
      continue;
    }

    if(track.key==0){
    	if(track.tp=="TD"||track.tp=="LOW"){
    		if (headers.length>1) {
    			track.key=1;
    	      }
    	}
    }
    
    
    var header = headers[idx];

    if (header.key !== track.key) {
      header = undefined;
      for ( var k = 0; k < headers.length; k++) {
        var temp = headers[k];
        if (track.key === temp.key) {
          header = temp;
        }
      }
    }

    if (objectUtils.isUndefined(header)) {
      continue;
    }
    // TD와 TYP의 차이점 ws 값을 가지고 판단한다.
    isTyphoon = (header.type === 1) ? true : false;
    if (isTyphoon) {
      // 태풍 정보에 한하여 태풍 이름정보를 반영한다. 그래야 feature 제목에 태풍 명이 들어간다.
      header.name = past.name || '-';
      if (header.name === '-') {
        // 한글명이 없을 경우, EN으로 변경.
        header.name = past.nameEn || '-';
      }
      header.nameEn = past.nameEn || '-';
    } else {
      // TD도 태풍 이름정보를 반영한다. 그래야 feature 제목에 태풍 명이 들어간다.
      header.name = past.name || '-';
      if (header.name === '-') {
        // 한글명이 없을 경우, EN으로 변경.
        header.name = past.nameEn || '-';
      }
      header.nameEn = past.nameEn || '-';
    }
    

    // 태풍 중심 객체 생성
    // i: TMSEQ 정보를 나타내기 위한 값. TYP, TD에 따라 동작이 바뀌어야 하는 문제가 발생.
    // i, length: TD의 경우, 시작과 중간, 끝에 대한 아이콘이 다르므로 이를 구분짓는 정보가 필요하다.
    var center = new TyphoonCenter(track, header, false, past, i, tracks.length, seqArray);
    past.centers.push(center);
  }
};

// HTML 정보 생성.
PastTyphoon.prototype.initHtml = function() {
  var past = this;
  var className = "g";
  var tmStComments = "";
  var tmEdComments = "";
  var title = "";
  var tmSt = past.tmSt;
  var tmEd = past.tmEd;
  var titleComments = past.name || past.nameEn || '-';
  var typno = past.year + "-" + past.seq;
  if (typhoonLang.currentLang === "en") {
    tmSt = past.tmStUtc;
    tmEd = past.tmEdUtc;
    titleComments = past.past.nameEn;
  }
  // 발표시각.
  if (tmSt.length > 2) {
    tmStComments = typhoonLang.msg('typho.n.0011').format(tmSt.substring(0, 4), tmSt.substring(4, 6),
        tmSt.substring(6, 8), tmSt.substring(8, 10)); // {YYYY}.{MM}.{DD}. {hh}
    // Forecast
  }
  if (tmEd.length > 2) {
    tmEdComments = typhoonLang.msg('typho.n.0011').format(tmEd.substring(0, 4), tmEd.substring(4, 6),
        tmEd.substring(6, 8), tmEd.substring(8, 10)); // {YYYY}.{MM}.{DD}. {hh}
    // Forecast
  }
  // TITLE
  title = typhoonLang.msg('typho.n.0013.1').format(past.year, past.seq, titleComments); // No.

  // 내용
  var contents = typhoonLang.msg('typho.n.0014.1'); // <li>yyyy.mm. hh ~
  // yyyy.mm. hh</li>
  contents = contents.format(tmStComments, tmEdComments);

  var html = {
    title : title,
    contents : contents,
    className : className
  };
  past.html = html;
}

// 태풍 트랙 만들기.
PastTyphoon.prototype.initFreature = function(typInf) {
  var past = this;
  // feature data 생성
  lineString = olUtils.pastTracksToLineString(typInf.tracks);
  if (objectUtils.isUndefined(lineString)) {
    return;
  }
  olUtils.transPolygonEpsg4326toEpsg111111(lineString); // 좌표계 변경. (4326 to
  // 111111)
  // feature 생성
  var feature = new ol.Feature({
    geometry : lineString,
    typ : past.typInf,
    html : past.html
  });
  feature.setId(past.getKey());
  past.feature = feature;

  // 스타일 반영.
  var style = pastTypStyleManager.getTyphoonTrackStyle(past.drawIdx);
  past.feature.setStyle(style);
};

// 태풍 키 반환.
PastTyphoon.prototype.getKey = function() {
  var past = this;
  // TY : Typhoon
  return "TY" + "_" + past.year + "_" + past.seq;
};

//zoom 시 아이콘 변경
PastTyphoon.prototype.addEventZoom = function(typInf) {
	mapManager.map.getView().on('propertychange', function(e) {
		var pastTyphoonManager = mapManager.getPastTyphoonManager();
		//addEventZoom에 존재하는 소스
		   switch (e.key) {
		      case 'resolution':  
		        if(e.oldValue === this.get('resolution') || typeof this.getZoom() === "undefined"){
		        	return false;
		        }
		        //0.5, 0.6, 0.7, 0.8, 1
		        var suf = mapManager.getZoomLvlSuffix();
	        /****================================================================================****/
		    	//아이콘 스타일 재조정
		    	pastTyphoonManager.refreshIcons(suf);
		        break; 
		   }
	});
};



