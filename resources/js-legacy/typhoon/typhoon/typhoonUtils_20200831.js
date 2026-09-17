var typhoonUtils = {};

typhoonUtils.getDirection = function(){
	
	return {
			N : typhoonLang.msg('utils.0001'),
			NNE : typhoonLang.msg('utils.0002'),
			NE : typhoonLang.msg('utils.0003'),
			ENE : typhoonLang.msg('utils.0004'),
			E :typhoonLang.msg('utils.0005'),
			ESE : typhoonLang.msg('utils.0006'),
			SE : typhoonLang.msg('utils.0007'),
			SSE : typhoonLang.msg('utils.0008'),
			S : typhoonLang.msg('utils.0009'),
			SSW : typhoonLang.msg('utils.0010'),
			SW : typhoonLang.msg('utils.0011'),
			WSW : typhoonLang.msg('utils.0012'),
			W : typhoonLang.msg('utils.0013'),
			WNW : typhoonLang.msg('utils.0014'),
			NW : typhoonLang.msg('utils.0015'),
			NNW : typhoonLang.msg('utils.0016'),
			NONE : typhoonLang.msg('utils.0017')
	};
};

typhoonUtils.getIntensity  = function(){
	
	return {
		WEAK : typhoonLang.msg('utils.0018'),
		NORMAL : typhoonLang.msg('utils.0019'),
		STRONG : typhoonLang.msg('utils.0020'),
		VERY_STRONG : typhoonLang.msg('utils.0021'),
		NONE : typhoonLang.msg('utils.0017')
	};
};
		

typhoonUtils.getSize = function(){
	
		return {
				SMALL : typhoonLang.msg('utils.0022'),
				MEDIUM : typhoonLang.msg('utils.0023'),
				LARGE : typhoonLang.msg('utils.0024'),
				EXTRA_LARGE : typhoonLang.msg('utils.0025'),
				NONE : typhoonLang.msg('utils.0017')
		};
};

typhoonUtils.R2D = function (radian){
	return radian * 180.0 / Math.PI;
};  
 
typhoonUtils.getCityName = function(feature){
	return typhoonLang.currentLang === "en" ?feature.get("key_eng") : feature.get("key");
}; 

//강도(팝업)
typhoonUtils.transValToStrength = function (val){ 
	/*
	약	17m/s(34knots)이상～25m/s(48knots)미만	
	중	25m/s(48knots)이상～33m/s(64knots)미만	
	강	33m/s(64knots)이상～44m/s(85knots)미만	
	매우 강	44m/s(85knots)이상
	*/ 
	var intensity = this.getIntensity();
	var str = "";
	val = parseInt(val);
	
	if(val>=17 && val<25){
		str = intensity.WEAK;	//약
	}else if(val>=25 && val<33){
		str = intensity.NORMAL;	//중
	}else if(val>=33 && val<44){
		str = intensity.STRONG;	//강
	}else if(val>=44){	
		str = intensity.VERY_STRONG; //매우강
	}else{
		str = intensity.NONE;
	}
	
	return str;
};

//강도(테이블)
typhoonUtils.transValToStrengthTdLow = function (val1,val2){ 
	/*
	약	17m/s(34knots)이상～25m/s(48knots)미만	
	중	25m/s(48knots)이상～33m/s(64knots)미만	
	강	33m/s(64knots)이상～44m/s(85knots)미만	
	매우 강	44m/s(85knots)이상
	 */ 
	var intensity = this.getIntensity();
	var str = "";
	val = parseInt(val1);
	if(val2=="TD" || val2=="LOW"){
		str = intensity.NONE;
	} else {
		if(val1>=17 && val1<25){
			str = intensity.WEAK;	//약
		}else if(val1>=25 && val1<33){
			str = intensity.NORMAL;	//중
		}else if(val1>=33 && val1<44){
			str = intensity.STRONG;	//강
		}else if(val1>=44){	
			str = intensity.VERY_STRONG; //매우강
		}else{
			str = intensity.NONE;
	}
	}
	
	return str;
};

//크기
typhoonUtils.transValToSize = function (tp , val){
	
	if(tp === "TD" || tp === "LOW"){
		return "-";
	}

	/*
	소형	300km 미만	
	중형	300km 이상 ~ 500km 미만	
	대형	500km 이상 ~ 800km 미만	
	초대형	800km 이상	
	*/
	var size = this.getSize();

	var str = "";
	if(val<300 && val>0){
		str = size.SMALL;		//"소형";
	}else if(val>=300 && val<500){
		str = size.MEDIUM;		//"중형";
	}else if(val>=500 && val<800){
		str = size.LARGE;		//"대형";
	}else if(val>=800){
		str = size.EXTRA_LARGE; //"초대형";
	}else if(val<=0){
		str = "-"; //"초대형";
	}else {
		str = size.NONE;
	}
	return str;
};

typhoonUtils.transValToDir = function (val){
	
	var direction = this.getDirection();
	
	if(val.length < 1 ){
		return "";
	}
	return direction[val];
}; 

typhoonUtils.getRotation = function( lon1,  lat1,  lon2,  lat2)
////////////////////////////////////////////////////////////////////////////////
//Description
//  두개의 위.경도 사이의 각도 계산 
//  북쪽을 0으로 하고 시계 방향으로 돌아간다.
//Param
//  lon1 = 첫번째 경도 좌표
//  lat1 = 첫번째 위도 좌표
//  lon2 = 두번째 경도 좌표
//  lat2 = 두번째 위도 좌표
//Return
//  각도
//Log
//  create/2010/06/15 JUN DAE HYUN.
////////////////////////////////////////////////////////////////////////////////
{	
	var re;
	var dx, dy;
	dx = lon2 - lon1;
	//if(fabs(dx) > 180)//180도 이상 차이나는 것은 반구의 반대편이기 때문에 위치상으로 역상이 된다.
	//    dx = ((lon2-360)+180) - (lon1+180);
	dy = (lat2+90) - (lat1+90);//남반구도 계산하기 위해...
	re = this.R2D(Math.atan2(dx, dy));
	// 360도 기준으로 만들기위해...
	if(re < 0)
	    re = 360+re;
	return re; 
};
////////////////////////////////////////////////////////////////////////////////
//Description
//지도상 두 지점간의 거리를 km 단위로 리턴 한다.
//Haversine formula 공식 사용
//검증 사이트 :  http://www.nhc.noaa.gov/gccalc.shtml
//2008/10/15 예보관 회의 결정에 따른 변경 => 구 TAPS 공식
//2008/11/12 태풍센터 예보관 회의 결정에 따른 변경 => Haversine formula 공식 사용
//2012/07/30 위성센터와 태풍센터의 협의로 위성센터에서 사용하는 거리계산 공식을 사용하기로 변경함.
//Param
//lon1 = 첫번째 경도 좌표
//lat1 = 첫번째 위도 좌표
//lon2 = 두번째 경도 좌표
//lat2 = 두번째 위도 좌표
//Return
//두 지점 사이의 거리[km]
//Log
//create/2008/06/11 JUN DAE HYUN.
//update/2008/10/15 JUN DAE HYUN.
//update/2012/07/30 JUN DAE HYUN.
////////////////////////////////////////////////////////////////////////////////
typhoonUtils.getDistance = function (pos1, pos2){ 
	var lon1 = pos1[0];	//경도
	var lat1 = pos1[1]; //위도
	var lon2 = pos2[0]; 
	var lat2 = pos2[1];  
	
	var DEGRAD = Math.PI/180.0;
    var R = 6371.0; // km
    var dlat = (lat2-lat1)*DEGRAD;
    var dlon = (lon2-lon1)*DEGRAD; 
    var a = Math.sin(dlat/2.0) * Math.sin(dlat/2.0) + Math.cos(lat1*DEGRAD) * Math.cos(lat2*DEGRAD) * Math.sin(dlon/2.0) * Math.sin(dlon/2.0); 
    var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0-a)); 
    return (R * c); 
};

//위치비교 방향 체크값 - 지점기준
typhoonUtils.areaToWindPoint = function(pos1, pos2)
{
	var lon = pos1[1];
	var lat = pos1[0]; 
	var nowLong = pos2[1];
	var nowLat = pos2[0]; 
	var wind = 0 ; 
	
	if(((1/Math.tan(lon*Math.PI/180)-(nowLong-lon)*Math.PI/180)*Math.sin(Math.sin(lon*Math.PI/180)*(nowLat-lat+0.0000000001)*Math.PI/180))>=0 ) {
		wind =  90-Math.atan(((1/Math.tan(lon*Math.PI/180)-(1/Math.tan(lon*Math.PI/180)-(nowLong-lon)*Math.PI/180)*Math.cos(Math.sin(lon*Math.PI/180)*(nowLat-lat)*Math.PI/180)))/((1/Math.tan(lon*Math.PI/180)-(nowLong-lon)*Math.PI/180)*Math.sin(Math.sin(lon*Math.PI/180)*(nowLat-lat+0.0000000001)*Math.PI/180)))*180/Math.PI;
	}else{ 
		wind = 270 - Math.atan(((1/Math.tan(lon*Math.PI/180)-(1/Math.tan(lon*Math.PI/180)-(nowLong-lon)*Math.PI/180)*Math.cos(Math.sin(lon*Math.PI/180)*(nowLat-lat)*Math.PI/180)))/((1/Math.tan(lon*Math.PI/180)-(nowLong-lon)*Math.PI/180)*Math.sin(Math.sin(lon*Math.PI/180)*(nowLat-lat+0.0000000001)*Math.PI/180)))*180/Math.PI;
	}
	
	return wind;
};

//방향
typhoonUtils.getWdir = function(wdir){
	
	var direction = this.getDirection();
	var aws_wk = ""; 
	if      (wdir >=  11.25 && wdir <  33.75) { aws_wk= direction.NNE; }   // 북북동 225
	else if (wdir >=  33.75 && wdir <  56.25) { aws_wk= direction.NE;  }   // 북동   450
	else if (wdir >=  56.25 && wdir <  78.75) { aws_wk= direction.ENE; }   // 동북동 675
	else if (wdir >=  78.75 && wdir < 101.25) { aws_wk= direction.E;   }   // 동     900
	else if (wdir >= 101.25 && wdir < 123.75) { aws_wk= direction.ESE; }   // 동남동 1125
	else if (wdir >= 123.75 && wdir < 146.25) { aws_wk= direction.SE;  }   // 남동   1350
	else if (wdir >= 146.25 && wdir < 168.75) { aws_wk= direction.SSE; }   // 남남동 1575
	else if (wdir >= 168.75 && wdir < 191.25) { aws_wk= direction.S;   }   // 남     1800
	else if (wdir >= 191.25 && wdir < 213.75) { aws_wk= direction.SSW; }   // 남남서 2025
	else if (wdir >= 213.75 && wdir < 236.25) { aws_wk= direction.SW;  }   // 남서   2250
	else if (wdir >= 236.25 && wdir < 258.75) { aws_wk= direction.WSW; }   // 서남서 2475
	else if (wdir >= 258.75 && wdir < 281.25) { aws_wk= direction.W;   }   // 서     2700
	else if (wdir >= 281.25 && wdir < 303.75) { aws_wk= direction.WNW; }   // 서북서 2925
	else if (wdir >= 303.75 && wdir < 326.25) { aws_wk= direction.NW;  }   // 북서   3150
	else if (wdir >= 326.25 && wdir < 348.75) { aws_wk= direction.NNW; }   // 북북서 3375
	else if ( wdir <  11.25) { aws_wk= direction.N;     }   // 북     0/3600
	else {aws_wk = direction.NONE;}
	return aws_wk;

}; 

typhoonUtils.getIntervalHours = function (fromDate, toDate){
	return (toDate.getTime() - fromDate.getTime()) / 1000 / 60 / 60;     
};

typhoonUtils.addHours = function (date, hour){
	var copiedDate = new Date(date.getTime());
	copiedDate.setHours(copiedDate.getHours()+hour);    
	return copiedDate;
}; 

typhoonUtils.zeroToBlank = function (val, defaultVal){
	
	/**
	 * 2019-02-18 추가
	 */
	if(val === undefined) return;
	
	if(val.length < 1 || (val+"") === "0" || (val+"") === " "){ 
		return typeof defaultVal ==="undefined" ? "-" : defaultVal;
	}
	
	return val;
}; 

typhoonUtils.zeroToBlankSp = function (val, defaultVal){
	if(val.length < 1 || (val+"") === "0"){ 
		return typeof defaultVal ==="undefined" ? "0" : defaultVal;
	}
	return val;
}; 
 