// 언어팩 선언.
var typhoonLang = {  
		
};

typhoonLang.currentLang = "ko";

// 한글 메시지 처리
typhoonLang.ko = {
    'graph.0001': '강도',
    'graph.0002': '최대풍속(m/s)',
    'graph.0003': '-',//'약',
    'graph.0004': '중',
    'graph.0005': '강',
    'graph.0006': '매우강',
    'graph.0007': '중심기압(hPa)',
    'graph.0008': '최대풍속',
    'graph.0009': '중심기압',
    'graph.0010': '크기',
    'graph.0011': '강풍반경(㎞)',
    'graph.0012': '소형',
    'graph.0013': '중형',
    'graph.0014': '대형',
    'graph.0015': '초대형',
    'graph.0016': '이동속도',
    'graph.0017': '이동속도(㎞/h)',
    'graph.0018': '최대풍속',
    'graph.0019': '그래프 상세 보기',
    'graph.0020': '최대풍속(m/s)',
    'graph.0021': '중심기압(hPa)',
    'graph.0022': '일시',
    'graph.0023': '{0}.{1}.{2}. {3}시',	//2015.08.22. 21시
    'graph.0024': '(현재)',
    'graph.0025': '(예상)',
    'graph.0026': '날짜',
    'graph.0027': '초강력',    //20200508 손태림
    'graph.0028': '반경',	   //20200515
    'graph.0029': '폭풍반경(㎞)', //20200515
    
    //typhoonUtils
    'utils.0001': '북',
    'utils.0002': '북북동',
    'utils.0003': '북동',
    'utils.0004': '동북동',
    'utils.0005': '동',
    'utils.0006': '동남동',
    'utils.0007': '남동',
    'utils.0008': '남남동',
    'utils.0009': '남',
    'utils.0010': '남남서',
    'utils.0011': '남서',
    'utils.0012': '서남서',
    'utils.0013': '서',
    'utils.0014': '서북서',
    'utils.0015': '북서',
    'utils.0016': '북북서',
    'utils.0017': '-',
    'utils.0018': '-',//'약',
    'utils.0019': '중',
    'utils.0020': '강',
    'utils.0021': '매우강',
    'utils.0022': '소형',
    'utils.0023': '중형',
    'utils.0024': '대형',
    'utils.0025': '초대형', 
    'utils.0026': '초강력', //20200508 손태림
    
    //typhoonContents
    'conte.0001': '{0}월 {1}일 {2}시경 {3}㎞',
    'conte.0002': '{0}년 {1}월 {2}일 {3}시 {4}분 발표',
    'conte.0003': '{0}일 {1}시<br/>현재',
    'conte.0004': '{0}일 {1}시<br/>예상',
    'conte.0005': '{0}<br/>[{1} 약{2}]',
    'conte.0006': '제{0}호 열대저압부에서 발달',
    'conte.0007': '{0}년 제 {1}호 열대저압부에서 발달',
    'conte.0010': '제{0}호 태풍 {1}에서 약화',
    'conte.0011': '온대저기압으로 변질',
    'conte.0012': '열대저압부로 약화',
    'conte.0013': '{0}년 제 {1}호 태풍 {2}에서 약화',
    'conte.0014': '제{0}호 태풍 {1} ({2})',
    'conte.0015': '제{0}호 열대저압부',
    'conte.0016': '{0}년 제{1}호 태풍 {2} ({3})',
    'conte.0017': '{0}년 제{1}호 열대저압부',
    'conte.0018': '최근접시간 : {1}월 {2}일 {3}시<br/>최근접거리 : {4}㎞<br/>강도 : {5}',
    'conte.0019': '최근접시간 : {1}월 {2}일 {3}시<br/>최근접거리 : {4}㎞',

    //typhoon
    'typho.0001': '기본화면',
    'typho.0002': '위성영상',
    'typho.0003': '최근접예상',
    'typho.0004': '지도조작관련 버튼',
    'typho.0005': '뒤로감기',
    'typho.0006': '재생',
    'typho.0007': '일시정지',
    'typho.0008': '앞으로감기',
    'typho.0009': '모든 태풍보기',
    'typho.0010': '선택된 태풍보기',
    'typho.0011': '{0}시간 후 예상',
    'typho.0012': '현재',
    'typho.0013': '{0}년 제{1}호 태풍 {2} {3}<br/>({4}시)',
    'typho.0014': '<li>중심위치: {0}˚N,{1}˚E</li><li>최대풍속(중심기압): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>강풍반경(예외반경): {5}㎞({6} 약{7}㎞) </li><li>폭풍반경(예외반경): {8}㎞({9} 약{10}㎞)</li>', //강풍반경, 폭풍반경 둘 다 있을때
    'typho.0014.01': '<li>중심위치: {0}˚N,{1}˚E</li><li>최대풍속(중심기압): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>강풍반경(예외반경): {5}㎞</li><li>폭풍반경(예외반경): {6}㎞</li>',  //강풍반경, 폭풍반경 둘 다 없을때
    'typho.0014.02': '<li>중심위치: {0}˚N,{1}˚E</li><li>최대풍속(중심기압): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>강풍반경(예외반경): {5}㎞</li><li>폭풍반경(예외반경): {6}㎞({7} 약{8}㎞)</li>',  //강풍반경만 없을때
    'typho.0014.03': '<li>중심위치: {0}˚N,{1}˚E</li><li>최대풍속(중심기압): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>강풍반경(예외반경): {5}㎞({6} 약{7}㎞)</li><li>폭풍반경(예외반경): {8}㎞</li>',  //폭풍반경만 없을때
    'typho.0015': '{0}년 제{1}호 열대저압부 {2}<br/>({3}시)',
    'typho.0016': '<li>중심위치:{0}˚N,{1}˚E</li><li>최대풍속(중심기압): {2}㎧({3}hPa)</li><li>이동속도(진행방향): {4}㎞/h({5})</li>',
    'typho.0017': '현재 진행중인 태풍이 없습니다.',
    'typho.0018': '선택된 태풍보기',
    'typho.0019': '모든 태풍보기',
    'typho.0020': '※ 상세보기 지도는 인터넷 브라우저 Explorer10 이상, Chrome 30 이상, FireFox 31 이상에서 정상표출됩니다.',
    'typho.0021': '※ 상세보기 지도는 인터넷 브라우저 Explorer10 이상, Chrome 30 이상, FireFox 31 이상에서 정상표출됩니다.<br/>※ 최근접예상은 태풍정보의 예상중심위치를 기준으로 계산된  참고정보로 예보시간마다 변동 가능성이 있습니다.',
    'typho.0022': '위험영역',
    'typho.0023': '※ 최근접예상은 태풍정보의 예상중심위치를 기준으로 계산된  참고정보로 예보시간마다 변동 가능성이 있습니다.',
    'typho.0024': '※ 태풍 위험영역은 예측진로의 불확실성을 고려하여 강풍이 나타날 수 있는 영역을 표현한 것임.<br>(위험영역 = 15m/s 이상 강풍역 + 진로 확률반경)<br/>※ 위험영역 정보는 태풍 강풍반경이 예보된 시간 범위에 대해서만 제공됩니다.',
    
    'commo.0001' : '그래프 보기',
    'commo.0002' : '상세정보 보기',
    'commo.0003' : '태풍경로지도',
    'commo.0004' : '실시간 그래프',
    'commo.0005' : '태풍선택',
    'commo.0006' : '현재 진행 중인 태풍 또는 열대저압부가 없습니다.',
    'commo.0007' : '레이어팝업열림', 
    'commo.0009' : '태풍에 대한 일시, 중심위치, 중심기압, 최대풍속, 반경, 강도, 크기, 진행방향, 이동속도, 확률반경의 정보를 보여줍니다.',  
    'commo.0010' : '일시', 
    'commo.0011' : '중심위치', 
    'commo.0012' : '중심기압<br/>(hPa)', 
    'commo.0013' : '최대풍속', 
    'commo.0014' : '강풍반경(㎞)<br/>[예외반경]', 
    'commo.0015' : '강도', 
    'commo.0016' : '크기', 
    'commo.0017' : '진행<br/>방향', 
    'commo.0018' : '이동<br/>속도<br/>(㎞/h)', 
    'commo.0019' : '70%<br/>확률반경<br/>(㎞)', 
    'commo.0020' : '위도(˚N)', 
    'commo.0021' : '경도(˚E)', 
    'commo.0022' : '초속<br/>(m/s)', 
    'commo.0023' : '시속<br/>(㎞/h)', 
    'commo.0024' : '열대저압부에 대한 일시, 중심위치, 중심기압, 최대풍속, 진행방향, 이동속도의 정보를 보여줍니다.', 
    'commo.0025' : '선택된 태풍의 상세정보', 
    'commo.0026' : '선택된 열대저압부의 상세정보',
    'commo.0027' : '자세히보기(그래프 크게보기)',
    'commo.0028' : '태풍그래프 상세보기',
    'commo.0029' : '닫기',
    'commo.0030' : '강풍반경',
    'commo.0031' : '이동속도',
    'commo.0032' : '그래프 크게보기' ,
    'commo.0033' : '크게보기 닫기' ,
    'commo.0034' : '폭풍반경(㎞)<br/>[예외반경]' //손태림 20200507    
};

// 영문 메시지 처리
typhoonLang.en = {
		//typhoonGraph	
	    'graph.0001': 'Intensity',
	    'graph.0002': 'Maximum Sustained Wind(㎧)',
	    'graph.0003': '-',//'Weak',
	    'graph.0004': 'Normal',
	    'graph.0005': 'Strong',
	    'graph.0006': 'Very Strong',
	    'graph.0007': 'Central Pressure(hPa)',
	    'graph.0008': 'Maximum sustained wind',
	    'graph.0009': 'Central Pressure',
	    'graph.0010': 'Scale',
	    'graph.0011': 'Radius of 15㎧(㎞)',
	    'graph.0012': 'Small',
	    'graph.0013': 'Medium',
	    'graph.0014': 'Large',
	    'graph.0015': 'Extra Large',
	    'graph.0016': 'Moving speed',
	    'graph.0017': 'Moving speed(㎞/h)',
	    'graph.0018': 'Maximum Sustained Wind', 
	    'graph.0019': 'View Graph Detail',
	    'graph.0020': 'Maximum<br/>Sustained<br/>Wind(㎧)',
	    'graph.0021': 'Central<br/>Pressure<br/>(hPa)',
	    'graph.0022': 'Time',
	    'graph.0023': '{0}.{1}.{2}. {3}',	//2015.08.22. 21
	    'graph.0027': 'Super Strong',    //20200508 손태림
	    'graph.0028': 'Radius',	   //20200515
	    'graph.0029': 'Radius of 25㎧(㎞)', //20200515
	    
	    //typhoonUtils
	    'utils.0001': 'N',
	    'utils.0002': 'NNE',
	    'utils.0003': 'NE',
	    'utils.0004': 'ENE',
	    'utils.0005': 'E',
	    'utils.0006': 'ESE',
	    'utils.0007': 'SE',
	    'utils.0008': 'SSE',
	    'utils.0009': 'S',
	    'utils.0010': 'SSW',
	    'utils.0011': 'SW',
	    'utils.0012': 'WSW',
	    'utils.0013': 'W',
	    'utils.0014': 'WNW',
	    'utils.0015': 'NW',
	    'utils.0016': 'NNW',
	    'utils.0017': '',
	    'utils.0018': '-',//'Weak',
	    'utils.0019': 'Normal',
	    'utils.0020': 'Strong',
	    'utils.0021': 'Very Strong',
	    'utils.0022': 'Small',
	    'utils.0023': 'Medium',
	    'utils.0024': 'Large',
	    'utils.0025': 'Extra Large', 
	    'utils.0026': 'Super Strong', //20200508 손태림
	    
	    //typhoonContents
	    'conte.0001': '{0}.{1}. {2}UTC {3}㎞',
	    'conte.0002': 'Issued at {0}.{1}.{2}. {3}:{4} UTC',
	    'conte.0003': '{0}.{1}. {2} <br/>Analysis ',	//{MM}.{DD}. {hh} Analysis 
	    'conte.0004': '{0}.{1}. {2} <br/>Forecast',	//{MM}.{DD}. {hh} Forecast
	    'conte.0005': '{0}<br/>[{1} {2}]',	//370<br/>[W 약310]
	    'conte.0006': 'Developed from No. {0} tropical depression',
	    'conte.0007': 'Developed from {0} No. {1} tropical depression',
	    'conte.0010': 'Weakened form No. {0} {1} typhoon',
	    'conte.0011': 'Transformed into extratropical low',
	    'conte.0012': 'Weakened into tropical depression',
	    'conte.0013': 'Weakened from {0} No. {1} {2} typhoon',
	    'conte.0014': 'No. {0} Typhoon {1}',
	    'conte.0015': 'No. {0} Tropical Depression',
	    'conte.0016': '{0} No. {1} Typhoon {2}',
	    'conte.0017': '{0} No. {1} Tropical Depression',
	    
	    //typhoon
	    'typho.0001': 'Default',
	    'typho.0002': 'Satellite',
	    'typho.0003': 'Distance',
	    'typho.0004': 'Map Buttons',
	    'typho.0005': 'Back',
	    'typho.0006': 'Play',
	    'typho.0007': 'Pause',
	    'typho.0008': 'Forward',
	    'typho.0009': 'View all topical cyclones',
	    'typho.0010': 'View selected tropical cyclone',
	    'typho.0011': '{0}.{1}. {2}UTC Forecast',	//{MM}.{DD}. {hh} Forecast
	    'typho.0012': '{0}.{1}. {2}UTC Analysis',
	    'typho.0013': 'No. {0} - {1} Typhoon {2}<br/>({3})',
	    'typho.0014': '<li>Position: {0}˚N,{1}˚E</li><li>Maximum sustained wind(Central pressure): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>Radius of 15㎧(Radius at short axis): {5}㎞({7}㎞ {6}) </li><li>Radius of 25㎧(Radius at short axis): {8}㎞({10}㎞ {9})</li>', //강풍반경, 폭풍반경 둘 다 있을때
	    'typho.0014.01': '<li>Position: {0}˚N,{1}˚E</li><li>Maximum sustained wind(Central pressure): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>Radius of 15㎧(Radius at short axis): {5}</li><li>Radius of 25㎧(Radius at short axis): {6}</li>',  //강풍반경, 폭풍반경 둘 다 없을때
	    'typho.0014.02': '<li>Position: {0}˚N,{1}˚E</li><li>Maximum sustained wind(Central pressure): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>Radius of 15㎧(Radius at short axis): {5}</li><li>Radius of 25㎧(Radius at short axis): {6}㎞({8}㎞ {7})</li>',  //강풍반경만 없을때
	    'typho.0014.03': '<li>Position: {0}˚N,{1}˚E</li><li>Maximum sustained wind(Central pressure): {2}㎧({3}hPa) <font color="#250369">{4}</font></li><li>Radius of 15㎧(Radius at short axis): {5}㎞({7}㎞ {6})</li><li>Radius of 25㎧(Radius at short axis): {8}</li>',  //폭풍반경만 없을때
	    'typho.0015': 'No. {0} - {1} Tropical Depression<br/>({2})',
	    'typho.0016': '<li>Position:{0}˚N,{1}˚E</li><li>Maximum sustained wind(Central pressure):{2}㎧({3}hPa)</li><li>Moving speed(Moving direction):{4}㎞/h({5})</li>',
	    'typho.0017': 'There is no active tropical cyclones.',
	    'typho.0018': 'View selected tropical cyclone',
	    'typho.0019': 'View all topical cyclones',
	    'typho.0022': 'Danger radius',
	    
	    'commo.0001' : 'View time series',
	    'commo.0002' : 'View details',
	    'commo.0003' : 'Map',
	    'commo.0004' : 'Time series',
	    'commo.0005' : 'Select',
	    'commo.0006' : 'There is no active tropical cyclones.',
	    'commo.0007' : 'Pop-up', 
	    'commo.0009' : 'Table contains position (latitude, longitude), the central pressure, maximum sustained wind, moving speed, strength, size, moving direction, moving speed, probability circle.',  
	    'commo.0010' : 'Date<br/>(UTC)', 
	    'commo.0011' : 'Position', 
	    'commo.0012' : 'Central<br/>pressure<br/>(hPa)', 
	    'commo.0013' : 'Maximum<br/>sustained<br/>wind(m/s)', 
	    'commo.0014' : 'Radius<br/>of<br/>15㎧<br/>(㎞)', 
	    'commo.0015' : 'Intensity', 
	    'commo.0016' : 'Size', 
	    'commo.0017' : 'Moving<br/>direction', 
	    'commo.0018' : 'Moving<br/>speed<br/>[㎞/h]', 
	    'commo.0019' : 'Radius<br/>of 70%<br/>probability<br/>(㎞)', 
	    'commo.0020' : 'Lat<br/>(N)', 
	    'commo.0021' : 'Lon<br/>(E)', 
	    'commo.0022' : 'Per<br/>second<br/>(㎧)', 
	    'commo.0023' : 'Per<br/>hour<br/>(㎞/h)', 
	    'commo.0024' : 'Table contains position (latitude, longitude), the central pressure, maximum sustained wind, moving speed, moving speed.', 
	    'commo.0025' : 'View details', 
	    'commo.0026' : 'View details',
	    'commo.0027' : 'Enlarge',
	    'commo.0028' : 'View detailed graphs typhoon',
	    'commo.0029' : 'Close',
	    'commo.0030' : 'Radius<br/>of<br/>15㎧<br/>(㎞)',
	    'commo.0031' : 'Moving speed',
	    'commo.0032' : 'Graph(enlarge)' ,
	    'commo.0033' : 'enlarge close',
	    'commo.0034' : 'Radius<br/>of<br/>25㎧<br/>(㎞)' //손태림 20200507
};

typhoonLang.setLanguage = function(currentLang){
	
	if(currentLang==="ko" || currentLang ==="en"){
		typhoonLang.currentLang = currentLang; 
	} 
}; 

typhoonLang.msg = function(code){ 
	return typhoonLang[this.currentLang][code];
};