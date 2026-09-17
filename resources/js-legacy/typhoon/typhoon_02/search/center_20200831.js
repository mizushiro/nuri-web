var TyphoonCenterManager = {};
var pastTyphoon={};
// 키 분리
TyphoonCenterManager.parseKey = function(key) {
  var array = key.split("_");
  if (objectUtils.isUndefined(array)) {
    return undefined;
  }
  var result = {
    type : array[0],
    year : array[1],
    seq : array[2],
    tmseq : array[3],
  };
  return result;
};

// Typhoon 객체
// track : 트랙정보
// header : 트랙헤더 (TD, TYP 정보)
// active : 현재 진행 여부
// drawIdx: 스타일을 적용하기 위한 인덱스
var TyphoonCenter = function(track, header, active, past, index, length, seqArray) {
  var center = this;
  center.key = track.key;
  center.type = track.type;

  center.header = header; // ex: 2011
  center.year = header.year + ""; // ex: 2011
  center.seq = header.seq + ""; // ex: 1 tmseq
  // center.seq2 = track.seq2 + ""; // ex: td, typ 발생번호
  center.tmseq = track.tmseq; // ex: 1

  center.name = header.name;
  center.nameEn = header.nameEn;

  center.tm = track.tm; // ex: "2011050706"
  center.tmUtc = track.tmUtc; // ex: "2011050706"
  center.lon = track.lon; // ex: 126.4
  center.lat = track.lat; // ex: 13.1
  center.ws = track.ws; // ex: 18.0
  center.ps = track.ps; // ex: 998.0
  center.gr = track.gr; // ex: "TS"

  center.tp = track.tp; // 

  center.sp = track.sp; // ex: 18
  center.dir = track.dir; // ex: "WNW"
  center.intensity = track.intensity; // ex: "약"
  center.size = track.size; // ex: "소형"
  center.rad15 = track.rad15; // ex: 200.0
  center.er15 = track.er15; // ex: 0.0
  center.ed15 = track.ed15; // ex: "-"
  center.rad25 = track.rad25; // ex: 0.0
  center.er25 = track.er25; // ex: 0.0
  center.ed25 = track.ed25; // ex: "-"

  center.ws15 = track.ws15; // 강풍반경
  center.ws15er = track.ws15er; // 강풍반경(예외반경)
  center.ws15ed = track.ws15ed; // 강풍반경(예외반경)

  center.past = past;
  center.active = active; // 진행중인 태풍인가?

  center.feature = undefined; // 태풍을 그리기 위한 객체.
  center.html = undefined; // 팝업을 위한 정보

  center.drawIdx = past.drawIdx;
center.seqArray = seqArray;
  center.initHtml(); // feature 보다 위에 있어야 한다.
  center.initFreature(index, length);
};

// //////////////////////////////////////////////////////////////////////////////
// DEFINE
// //////////////////////////////////////////////////////////////////////////////
var lengthCnt =0;
var resultLength=0;
var after = 0;
TyphoonCenter.prototype.initHtml = function() {
	
  var center = this;
  var className = "g";
  var tmComments = "";
  var title = "";
  lengthCnt=center.past.tracks.length;
  var dirCommants = center.dir;
  var tmSt = center.tm;
  var titleComments = center.name || '-';
  if (titleComments === '-') {
    // 한글명이 없을 경우, EN으로 변경.
    titleComments = center.nameEn;
  }
  var typno = center.year + "-" + center.seq;
  if (typhoonLang.currentLang === "en") {
    tmSt = center.tmUtc;
    titleComments = center.nameEn || '-';
    dirCommants = center.dirEn;
  }
  // 발표시각.
  var centersBefore =center.past.tracks[resultLength];
  tmComments = typhoonLang.msg('typho.n.0011').format(tmSt.substring(0, 4), tmSt.substring(4, 6), tmSt.substring(6, 8),
      tmSt.substring(8, 10)); // {YYYY}.{MM}.{DD}. {hh} Forecast
  
  if((center.key == '1')||center.key == '2'){
	  if (resultLength == 0) {
		  title = typhoonLang.msg('typho.n.0013').format(center.year, center.seq, titleComments, tmComments); // No.  
	  } else {
		  title = typhoonLang.msg('typho.n.0015').format(center.year, center.seq,  tmComments); // No.
	  }
  }else{
	  title = typhoonLang.msg('typho.n.0013').format(center.year, center.seq, titleComments, tmComments); // No.
  }
  // TITLE
  if(dirCommants == -1 || dirCommants ==""){
	  dirCommants = "-";
  }
  // 내용
  var contents = typhoonLang.msg('typho.n.0014');
  var tp = center.tp;
//  alert("tp=="+tp);
  var centersBefore =center.past.tracks[resultLength];
	if(lengthCnt-1 == resultLength){
		after = 0;
	}else{
		after = after +1;
	}
	  
	var centersAfter =center.past.tracks[after];
	//TD일 경우
  if((center.key == '1')||center.key == '2'|| center.tp=='TD'){
	  // 끝나는 시점이 TD일경우
	if (resultLength == 0) {
		  contents =typhoonLang.msg('typho.n.0017');
		  
//		  console.log("=============================");
//		  console.log("center.tp=="+center.tp);
//		  console.log("center.tm=="+center.tm);
//		  
//		  console.log("centersAfter.tp=="+centersAfter.tp);
//		  console.log("centersBefore.tp=="+centersBefore.tp);
//		  console.log("centersBefore.tm=="+centersBefore.tm);
//		  console.log("=============================");
		  
		  if (centersBefore.tm == center.tm) {
			  console.log("center.tp=="+center.tp);
			  console.log("center.lat=="+center.lat);
			  console.log("center.lon=="+center.lon);
			  console.log("center.ws=="+center.ws);
			  console.log("center.ps=="+center.ps);
			  console.log("center.sp=="+center.sp);
			  console.log("dirCommants=="+dirCommants);
			  console.log("center.past.seq=="+center.past.seq);
			  if(center.tp=="LOW"){
				  contents =typhoonLang.msg('typho.n.0017.02');
			  } else if(center.tp=="TD"){
				  contents =typhoonLang.msg('typho.n.0017.01');
			  } else {
				  center.tp="TD";
				  contents =typhoonLang.msg('typho.n.0017.01'); 
			  }
			  console.log("center.tp=="+center.tp);
			  contents = contents.format(
					  center.lat, center.lon, 
					  typhoonUtils.zeroToBlank(center.ws, '-'), 
					  typhoonUtils.zeroToBlank(center.ps, '-'), 
					  typhoonUtils.zeroToBlank(center.sp, '-'), 
					  dirCommants, 
					  center.past.seq
			  );
		  }else if (centersAfter.ws < 17) {
			  contents =typhoonLang.msg('typho.n.0016');
			  contents = contents.format(
					  center.lat, center.lon, 
					  typhoonUtils.zeroToBlank(center.ws, '-'), 
					  typhoonUtils.zeroToBlank(center.ps, '-'), 
					  typhoonUtils.zeroToBlank(center.sp, '-'), 
					  dirCommants
			  );
		  } else{
			  contents = contents.format(
					  center.lat, center.lon, 
					  typhoonUtils.zeroToBlank(center.ws, '-'), 
					  typhoonUtils.zeroToBlank(center.ps, '-'), 
					  typhoonUtils.zeroToBlank(center.sp, '-'), 
					  dirCommants, 
					  typhoonUtils.transValToSize(center.tp,center.rad15)
			  );
		  }
		  
	} else{
		

		console.log("centersAfter.tp=="+centersAfter.tp);
		console.log("centersBefore.tp=="+centersBefore.tp);
		if(centersAfter.tp == "TS"&& centersBefore.tp == ""||centersAfter.tp == "TS"&& centersBefore.tp == "TD"){
			console.log("=============");
			console.log("centersAfter.tp=="+centersAfter.tp);
			console.log("centersBefore.tp=="+centersBefore.tp);
			  console.log("center.lat=="+center.lat);
			  console.log("center.lon=="+center.lon);
			  console.log("center.ws=="+center.ws);
			  console.log("center.ps=="+center.ps);
			  console.log("center.sp=="+center.sp);
			  console.log("dirCommants=="+dirCommants);
			  console.log("center.seqArray[after]=="+center.seqArray[after]);
			  console.log("=============");
			  
			
			  if(center.tp=="LOW"){
				  contents =typhoonLang.msg('typho.n.0017.02');
			  } else if(center.tp=="TD"){
				  contents =typhoonLang.msg('typho.n.0017.01');
			  } 
			contents = contents.format(
					center.lat, center.lon, 
					typhoonUtils.zeroToBlank(center.ws, '-'), 
					typhoonUtils.zeroToBlank(center.ps, '-'), 
					typhoonUtils.zeroToBlank(center.sp, '-'), 
					dirCommants, 
					center.seqArray[after]);
		}else{
			//TD
			contents =typhoonLang.msg('typho.n.0016');
			contents = contents.format(
					center.lat, center.lon, 
					typhoonUtils.zeroToBlank(center.ws, '-'), 
					typhoonUtils.zeroToBlank(center.ps, '-'), 
					typhoonUtils.zeroToBlank(center.sp, '-'), 
					dirCommants, 
					typhoonUtils.transValToSize(center.tp,center.rad15));
		}
	}

  }else{
	  //'<li>중심위치: {0}˚N,{1}˚E</li><li>최대풍속(중심기압): {2}㎧({3}h㎩) <font color="#250369">{4}</font></li><li>강풍반경(예외반경): {5}㎞({6} 약{7}㎞) <font color="#250369">{8}</font><br/><font color="#E0040B">제 {9}호 열대저압부에서 발달</font></li>'
	  //TD에서 TY로 변형됨
		
	  if(centersAfter.tp == ""&& centersBefore.tp == "TS"){
		  var centerArray = center.past.centers;
			if(typhoonUtils.zeroToBlank(center.ws15er, '-') == '-'||dirCommants == '-'){
				contents =typhoonLang.msg('typho.n.0019.01');
				contents = contents.format(center.lat, 
										   center.lon, 
										   typhoonUtils.zeroToBlank(center.ws, '-'), 
										   typhoonUtils.zeroToBlank(center.ps, '-'), 
										   
										   //2019-04-02 강도등급 수정
										   //typhoonUtils.transValToStrength(center.ws), 
										   typhoonUtils.transValToStrength2(center.ws, tmSt.substring(0, 8)), 
										   
										   typhoonUtils.zeroToBlank(center.ws15,'-'), 
										   dirCommants, 
										   center.seqArray[after]
				);
			}else{
				contents =typhoonLang.msg('typho.n.0019');
				contents = contents.format(center.lat, 
										   center.lon, 
										   typhoonUtils.zeroToBlank(center.ws, '-'), 
										   typhoonUtils.zeroToBlank(center.ps, '-'), 
										   
										   //2019-04-02 강도등급 수정
										   //typhoonUtils.transValToStrength(center.ws), 
										   typhoonUtils.transValToStrength2(center.ws, tmSt.substring(0, 8)), 
										   
										   typhoonUtils.zeroToBlank(center.ws15,'-'), 
										   typhoonUtils.zeroToBlank(center.ws15ed,'-'), 
										   typhoonUtils.zeroToBlank(center.ws15er, '-'), 
										   typhoonUtils.transValToSize(center.tp,center.rad15), 
										   center.seqArray[after]
				);
			}
		}else{
			if(typhoonUtils.zeroToBlank(center.ws15er, '-') == '-'||dirCommants == '-'){
				if(tp == "LOW"){
					contents =typhoonLang.msg('typho.n.0014.02');
					contents = contents.format(
							center.lat, 
							center.lon, 
							typhoonUtils.zeroToBlank(center.ws, '-'), 
							typhoonUtils.zeroToBlank(center.ps, '-'), 
							
							//2019-04-02 강도등급 수정
							//typhoonUtils.transValToStrength(center.ws),
							typhoonUtils.transValToStrength2(center.ws, tmSt.substring(0, 8)), 
							
							typhoonUtils.zeroToBlank(center.ws15,'-'), 
							typhoonUtils.transValToSize(center.tp,center.rad15)
					);
				}else{
					contents =typhoonLang.msg('typho.n.0014.01');
					contents = contents.format(
							center.lat, 
							center.lon, 
							typhoonUtils.zeroToBlank(center.ws, '-'), 
							typhoonUtils.zeroToBlank(center.ps, '-'), 
							
							//2019-04-02 강도등급 수정
							//typhoonUtils.transValToStrength(center.ws),
							typhoonUtils.transValToStrength2(center.ws, tmSt.substring(0, 8)), 
							
							typhoonUtils.zeroToBlank(center.ws15,'-'), 
							typhoonUtils.transValToSize(center.tp,center.rad15)
					);
				}
			}else{
				//일반 TY
				contents = contents.format(
						center.lat, 
						center.lon, 
						typhoonUtils.zeroToBlank(center.ws, '-'), 
						typhoonUtils.zeroToBlank(center.ps, '-'), 
						
						//2019-04-02 강도등급 수정
						//typhoonUtils.transValToStrength(center.ws),
						typhoonUtils.transValToStrength2(center.ws, tmSt.substring(0, 8)), 
						
						typhoonUtils.zeroToBlank(center.ws15,'-'), 
						typhoonUtils.zeroToBlank(center.ws15ed,'-'), 
						typhoonUtils.zeroToBlank(center.ws15er, '-'), 
						typhoonUtils.transValToSize(center.tp,center.rad15)
				);
			}
		}
  }


  var html = {
    title : title,
    contents : contents,
    className : className
  };
  center.html = html;
  
  if(lengthCnt-1 == resultLength){
		resultLength = 0;
	}else{
		resultLength = resultLength +1;
	}
};

TyphoonCenter.prototype.initFreature = function(index, length) {
  var center = this;
//  alert("center=="+center.tp);
  // feature data 생성
  var pos = [ parseFloat(center.lon), parseFloat(center.lat) ];
  // feature 생성
  var feature = new ol.Feature({
    geometry : new ol.geom.Point(ol.proj.transform(pos, 'EPSG:4326', 'EPSG:111111')),
    track : center,
    html : center.html
  /* 태풍 중심 HTML 정보 */
  });
  feature.setId(center.getKey());
  
  var style = {};
  var ws = center.ws;
  var tp = center.tp;
  if (center.active == false) {
    // icon 반영
    style = pastTypStyleManager.getTyphoonCenterStyle(ws, tp, index, length);
  } else {
    // icon 반영
    alert.show("typStyleManager is empty.");
    style = pastTypStyleManager.getTyphoonCenterStyle(ws, tp, index, length);
  }
  feature.setStyle(style);

  // feature 반영
  center.feature = feature;
};

TyphoonCenter.prototype.getKey = function() {
  var center = this;
  // TYC : Typhoon Center
  return "TYC" + "_" + center.year + "_" + center.key + "_" + center.type + "_" + center.seq + "_" + center.tmseq;
};

