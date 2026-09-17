//프로젝션 정의
proj4.defs('EPSG:111111', '+proj=lcc +lat_1=28 +lat_0=28 +lon_0=128.2 +k_0=1.0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
//var ext = ol.extent.boundingExtent();
//지도 매니져


/**
 * 2019-04-29
 * 브라우저 체크(종류 및 버전)
 */
function get_browser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null){return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    
    return {name: M[0],version: M[1]};
}

/**
 * 2019-04-29
 * 브라우저 체크에 따른 문구 적용
 */
function chk_browser(){
	var browser = get_browser();
	
	$("#typhoon_desc").text(typhoonLang.msg('typho.0020'));
	
	if(browser.name == "IE"){
		if(browser.version >= 10){
			$("#typhoon_desc").text("");
		}
	}else if(browser.name == "Chrome"){
		if(browser.version >= 30){
			$("#typhoon_desc").text("");
		}
	}else if(browser.name == "Firefox"){
		if(browser.version >= 31){
			$("#typhoon_desc").text("");
		}
	}
}

var mapManager = {
		
		config : {map:'map'
				 ,marker:'marker'
				 ,popup : 'popup'
				 ,selectbox : 'selectItems'
				 ,graph : 'graph'
				 ,detail : 'detail'
				},
		controls : {
			noItemMsgControl : undefined	//태풍 또는 TD가 없는 경우, 메세지 표출 컨트롤
		   ,tapControl : undefined			//탭 컨트롤
		   ,playControl : undefined 		//위성영상 탭에서 플레이 컨트롤
		   ,onlySelectedControl : undefined //선택한 태풍만 예보정보 보기 | 모든 태풍 예보정보 보기 컨트롤
		   ,nowViewControl : undefined		//위성영상 탭에서 영상의 시간 표시 컨트롤
		   ,loadingBarControl : undefined	//loading bar
		},		
		contentManager : undefined, 
		graphManager : undefined, 
		map : undefined, 			//지도 객체
		projection : undefined, 
		layers : {
			base : undefined,		//지도 layer
			satellite :	undefined,	//위성영상 layer
			position : undefined,	//지점 layer
			typhoon : undefined,	//태풍 layer
			
			/**
			 * 2019-03-19
			 * 위험반경 레이어 추가
			 */
			danger : undefined
		}, 
		
		imageSources : [],			//천리안 위성이미지 소스 
		extents : {
			base : ol.proj.transformExtent([-40, -40, 180, 60], "EPSG:4326", "EPSG:111111"),	//적도0~북위60도 경도 100~180 [100, 0, 180, 60]
			satellite :[-4396000, -3796000, 4396000, 3796000]									//위성 영상의 표출범위    
		},  
		
		sourceParams : {
			base : {LAYERS: 'typhoon:typhoon_kr', VERSION: '1.1.0'},
			baseEn : {LAYERS: 'typhoon:typhoon_eng', VERSION: '1.1.0'},
			satellite : {LAYERS: 'green map_2', VERSION: '1.1.0'}
		},
		minZoom : 3,
		maxZoom : 7,
		popup : undefined,	//마우스오버 팝업
		marker : undefined,	//지점
		overlays : []		//최근접예상 팝업
};

//오버레이 추가
mapManager.addOverlay = function(message, coordinate){
	var id = "overlays" + this.overlays.length;
	var element = "<div id='" + id  + "' style='margin: 5px;border:3px solid gray;background-color:rgba(255, 255, 255, 0.9);font:15px Dotum;color:black;font-weight:bold; padding:10px 10px 10px 10px;'>"+ message +"</div>";
	$("#gisContents").append(element);
	
	var overlay = new ol.Overlay({
		  position: coordinate,
		  positioning: 'bottom-left',
		  element: document.getElementById(id),
		  stopEvent: false
	});  
	
	var o = {id : id, overlay: overlay};
	this.overlays.push(o);   
	this.map.addOverlay(overlay); 
	
	return id;
};
//오버레이 추가
//마커 드래그
mapManager.addOverlaySe = function(message0, message, message2, coordinate){
	var id = "overlays" + this.overlays.length; 
	var element = "<div id='" + id  + "' style='-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);margin: 3px;border:3px solid rgba(180, 180, 180, 0.9);background-color:rgba(255, 255, 255, 0.9);color:black; padding:10px 10px 10px 10px;'>"+"<div style='font-weight:bold;color:#0059b3;'>"+ message0 +"</div>"+"<div style='font-weight:bold;'>"+ message +"</div>"+message2+"</div>";
	$("#gisContents").append(element);
	
	var overlay = new ol.Overlay({
		position: coordinate,
		positioning: 'bottom-left',
		element: document.getElementById(id),
		stopEvent: false,
		dragging: true
	});  
	
	var o = {id : id, overlay: overlay};
	this.overlays.push(o);   
	this.map.addOverlay(overlay); 
	
	var marker_el = document.getElementById(id);
	var dragPan;
	this.map.getInteractions().forEach(function(interaction){
		if (interaction instanceof ol.interaction.DragPan) {
			dragPan = interaction;  
	  }
	}); 


	
	marker_el.addEventListener('mousedown', function(evt) {
	  dragPan.setActive(false);
	  overlay.set('dragging', true);
	});

	this.map.on('pointermove', function(evt) {
		if (overlay.get('dragging') === true) {
			overlay.setPosition(evt.coordinate);
	  }
	});

	this.map.on('pointerup', function(evt) {
		if (overlay.get('dragging') === true) {
	    dragPan.setActive(true);
	    overlay.set('dragging', false);
	  }
	});

	return id;
};

//오버레이 추가
//마커 드래그
mapManager.addOverlaySeArea = function(message0, message, message2, coordinate){
	var id = "overlays" + this.overlays.length; 
	var element = "<div id='" + id  + "' style='-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);margin: 3px;border:3px solid rgba(180, 180, 180, 0.9);background-color:rgba(255, 255, 255, 0.9);color:black; padding:10px 10px 10px 10px;'>"+"<div style='font-weight:bold;color:#0059b3;'>"+ message0 +"</div>"+"<div style='font-weight:bold;'>"+ message +"</div>"+message2+"</div>";
	$("#gisContents").append(element);
	
	var overlay = new ol.Overlay({
		position: coordinate,
		positioning: 'bottom-left',
		element: document.getElementById(id),
		stopEvent: false,
		dragging: true
	});  
	
	var o = {id : id, overlay: overlay};
	this.overlays.push(o);   
	this.map.addOverlay(overlay); 
	
	var marker_el = document.getElementById(id);
	var dragPan;
	this.map.getInteractions().forEach(function(interaction){
		if (interaction instanceof ol.interaction.DragPan) {
			dragPan = interaction;  
	  }
	});

	marker_el.addEventListener('mousedown', function(evt) {
	  dragPan.setActive(false);
	  overlay.set('dragging', true);
	});

	this.map.on('pointermove', function(evt) {
		if (overlay.get('dragging') === true) {
			overlay.setPosition(evt.coordinate);
			overlay.setPositioning('center-center');
	  }
	});

	this.map.on('pointerup', function(evt) {
		if (overlay.get('dragging') === true) {
	    dragPan.setActive(true);
	    overlay.set('dragging', false);
	  }
	});

	return id;
};

//오버레이 추가
mapManager.removeOverlay = function(id){
	
	for(var i in this.overlays){
		var o = this.overlays[i];
		if(o.id == id){
			this.map.removeOverlay(o.overlay); 
			$("#"+o.id).remove(); 
			this.overlays.splice(i, 1);
			break;
		}
	}
};


//위성영상 토글 버튼
mapManager.toggleSatellite = function(arg){
	/*** 위성영상 on ***/
	if(arg === true){
		
		//play control 추가
		if(typeof mapManager.controls.playControl === "undefined"){
			var playControl = new mapManager.PlayControl();
			mapManager.addControl(playControl);
		}
		
		//위성이미지 reload
		mapManager.setSateliteSources();
		
		//위성영상 표출을 위해 위성지도 표출
		//mapManager.layers.base.getSource().updateParams(this.getSourceParams('satellite'));
		//위성영상 표출시 지도는 안보이도록 변경
		mapManager.layers.base.setVisible(false);
	}else{ 
		/*** 위성영상 off ***/
		//play control 제거
		mapManager.removeControl(mapManager.controls.playControl);
		
		//영상 초기화
		mapManager.imageSources = []; 
		mapManager.layers.satellite.setVisible(false);   
		mapManager.layers.satellite.setSource(undefined);  
		
		//기본 지도 표출   
		//mapManager.layers.base.getSource().updateParams(this.getSourceParams('base'));
		mapManager.layers.base.setVisible(true);
	} 
	
};


mapManager.setSateliteSources = function(){
	
	var loadingBarControl = new mapManager.LoadingBarControl();
	mapManager.addControl(loadingBarControl);
	
	var imageObj = $('<img width="0" height="0" src="">');
	
	function setSatImg(list){
		
			var image = list[list.length-1];
			var s = new ol.source.ImageStatic({  
				url: image.fileName,
				projection: mapManager.projection,
				imageExtent: mapManager.extents.satellite
			});  
			
			if(typeof mapManager.controls.nowViewControl !== "undefined"){
				
				var timstring;
				
				if(typhoonLang.currentLang === "en"){
					var tmpDate = image.tm.toDate();
					tmpDate = typhoonUtils.addHours(tmpDate,-9);
					timstring = tmpDate.toDateTimeString()+"(UTC)";
				}else{
					timstring = image.tm.timeString()+"(KST)";
				} 
				
				mapManager.controls.nowViewControl.setTimestamp(timstring);
			}
			
			mapManager.layers.satellite.setSource(s);
			mapManager.layers.satellite.setVisible(true);
			mapManager.layers.satellite.setOpacity(0.7);	//위성영상 투명도 
			mapManager.imageSources = list;
		
	}
	
	function loadImage(list){
		
		var loadedCnt = list.length;
		if(loadedCnt>0){
			
			for(var i in list){ 
				
				imageObj.attr('src', list[i].fileName);  // alert(list[i].fileName);
				imageObj.load(function() {
					
					loadedCnt--; 
					if(loadedCnt==0){
						setSatImg(list);
						mapManager.removeControl(loadingBarControl);
					}
					
				}).error(function() {
					
					loadedCnt--;  
					if(loadedCnt==0){
						setSatImg(list);
						mapManager.removeControl(loadingBarControl);
					} 
				}); 
			}
			
		}else{ 
			mapManager.removeControl(loadingBarControl);
		} 
	}
	 
	//영상 초기화
	if(typeof mapManager.controls.playControl !== "undefined"){
		mapManager.controls.playControl.init();
	} 
	mapManager.imageSources = []; 
	mapManager.layers.satellite.setVisible(false);   
	mapManager.layers.satellite.setSource(undefined);  
	
	//현재 선택된 아이템 키조회
	var key = mapManager.getSelectedKey();
	if(key.length<1){
		//현재 진행 중인 태풍 또는 TD가 없는 경우 최근 영상 8건 조회 //tm=2015.07.11.22&x=29&y=13&timeTerm=1 
		$.get('./satellite/satelliteImageList.jsp', function(list){
			loadImage(list); 
		})
		.fail(function() {
			mapManager.removeControl(loadingBarControl);
		 });
		
	}else{
		//현재 선택된 아이템
		var item  = mapManager.contentManager.getItem(key);
		var centers = item.centers;
		var list = [];
		
		for(var i in centers){
			
			var info = centers[i].get("info");
			
			if(info.tmTp.indexOf("F")<0){//과거~현재 
				
				list.push(info.tm);
			} 
		} 
		if(list.length > 0){
			
			$.get('./satellite/satelliteImageListForItem.jsp' , {'tms[]' : list}) 
				.done(function( r ) {
					  for(var i in r){
						  r[i].center = centers[r[i].centerIndex];
					  }
					  
					  loadImage(r);
				  })
				  .fail(function() {
					  mapManager.removeControl(loadingBarControl);
				  });
		}
	}  
	
};


//control 추가 함수
mapManager.addControl = function(control){
	
	if(typeof control === "undefined" || control === null ){
		return false;
	}
	
	if(control instanceof mapManager.TapControl){
		this.controls.tapControl = control; 
		
	}else if(control instanceof mapManager.NoItemMsgControl){
		this.controls.noItemMsgControl = control; 
		
	}else if(control instanceof mapManager.PlayControl){
		this.controls.playControl = control;  
		
	}else if(control instanceof mapManager.OnlySelectedControl){
		this.controls.onlySelectedControl = control; 
		
	}else if(control instanceof mapManager.NowViewControl){ 
		this.controls.nowViewControl = control;
		
	}else if(control instanceof mapManager.LoadingBarControl){ 
		this.controls.loadingBarControl = control;
	}
	
	this.map.addControl(control);
};

//control 제거 함수
mapManager.removeControl = function(control){
	
	if(typeof control === "undefined" || control === null){
		return false;
	}
	
	if(control instanceof mapManager.TapControl && typeof mapManager.controls.tapControl !== "undefined"){
		this.controls.tapControl = undefined; 
		
	}else if(control instanceof mapManager.NoItemMsgControl && typeof mapManager.controls.noItemMsgControl !== "undefined"){
		this.controls.noItemMsgControl = undefined; 
		
	}else if(control instanceof mapManager.PlayControl && typeof mapManager.controls.playControl !== "undefined"){
		this.controls.playControl.init();
		this.controls.playControl = undefined; 							//플레이 삭제 
		mapManager.removeControl(mapManager.controls.nowViewControl);	//현재 위성영상 시간 표출 컨트롤 삭제
		
	}else if(control instanceof mapManager.OnlySelectedControl && typeof mapManager.controls.onlySelectedControl !== "undefined"){
		this.controls.onlySelectedControl = undefined; 
		
	}else if(control instanceof mapManager.NowViewControl && typeof mapManager.controls.nowViewControl !== "undefined"){
		this.controls.nowViewControl = undefined;  
		
	}else if(control instanceof mapManager.LoadingBarControl && typeof mapManager.controls.loadingBarControl !== "undefined"){
		this.controls.loadingBarControl = undefined; 
		$("#" + mapManager.config.selectbox).prop('disabled', false); 	//로딩바가 있는 경우 조작못하게 한 것 풀기
	}
	
	this.map.removeControl(control);
	
};

/** 탭 컨트롤, 상단 버튼(기본화면, 위성영상, 최근접예상, 위험영역)
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */

var old_idx = 0;

mapManager.TapControl = function(opt_options) {   
	
	var html = 
			 '<div class="tab list jx">'
			+'<ul>'
			+'<li class="active">'
			+'<a href="javascript:;" class="tab_menu" title="'+typhoonLang.msg('typho.0001')+'"><span>'+ typhoonLang.msg('typho.0001') +'</span></a>' // 기본화면
			+'</li>'
			+'<li id ="statistics_id">'
			+'<a href="javascript:;" class="tab_menu" title="'+typhoonLang.msg('typho.0002')+'">'+ typhoonLang.msg('typho.0002') +'</a>' // 위성영상
			+'</li>'
			+'<li>'
			+'<a href="javascript:;" class="tab_menu" title="'+typhoonLang.msg('typho.0003')+'">'+ typhoonLang.msg('typho.0003') +'</a>' // 최근접예상
			+'</li>'
			
			
			/**
			 * 2019-02-26 추가
			 */
			+'<li>'
			+'<a href="javascript:;" class="tab_menu" title="'+typhoonLang.msg('typho.0022')+'" id="btnDangerArea">'+ typhoonLang.msg('typho.0022') +'</a>' // 위험영역
			+'</li>'
			
			
			+'</ul>'
			+'</div>'
			;
	
	  var blind = $('<h1 class="blind">'+ typhoonLang.msg('typho.0004') +'</h1>');
  	  var options = opt_options || {};
	  var tab_list = $(html); 
	  var tab_list_i = tab_list.find('>ul>li');
	  var tabIdx = 0;
	  
	  var handleTapControl = function(e) {
			
		  	if(typeof mapManager.controls.loadingBarControl !== "undefined"){
		  		return false;
		  	}
		  	var t = $(this).parent('li'); //현재 선택된 tap li
		    var tList = tab_list_i;
		    var idx = tList.index(t);
		     
		    tList.removeClass('active');  
			t.addClass('active');
			tabIdx = idx;
			
			var typhoon_desc= $("#typhoon_desc");
			var desc_map_id= $("#desc_map_id");
			
			
			/**
			 * 2019-03-19
			 * 탭 중복선택 방지
			 */
			if(old_idx == idx){
				return;
			}else{
				old_idx = idx;
			}
			
			/**
			 * 2019-04-29
			 * 범례 이미지 추가 (기본)
			 */
			$("#legendImg").attr("src","../../images/weather/typoon/typ_legend.png");
			
			
			/**
			 * 2019-04-29
			 * 브라우저 체크에 따른 문구 적용
			 */
			chk_browser();
			
			
			switch(idx){
				case 0 : // 기본화면
					
					//desc_map_id.attr("style", "top:522px;");
					//typhoon_desc.html(typhoonLang.msg('typho.0020'));
					
					//위성영상 지도 변경
					mapManager.toggleSatellite(false);
					
					//최근접예상 layer 안보이게 하기
					mapManager.toggleNearlest(false); 
			        var suf = mapManager.getZoomLvlSuffix();
			        
	        		//현재 모든 아이템 새로 그리기
			        mapManager.contentManager.refreshIcons(suf);
			        
			        /**
					 * 2019-03-19
					 * 위험반경 레이어
					 */
			        mapManager.layers.danger.setVisible(false);
					break;
					
				case 1 : // 위성영상
					
					//desc_map_id.attr("style", "top:522px;");
					//typhoon_desc.html(typhoonLang.msg('typho.0020'));
					
					//위성영상 지도 변경
					mapManager.toggleSatellite(true);
					
					//최근접예상 layer 안보이게 하기
					mapManager.toggleNearlest(false); 
					
					/**
					 * 2019-03-19
					 * 위험반경 레이어
					 */
					mapManager.layers.danger.setVisible(false);
					break;
					
				case 2 : // 최근접예상
					
					//desc_map_id.attr("style", "top:504px;");
					//typhoon_desc.html(typhoonLang.msg('typho.0021'));					
					
					/**
					 * 2019-04-29
					 * 최근접예상 문구 적용
					 */
					if(typhoon_desc.html() != ""){
						typhoon_desc.html(typhoon_desc.html()+"<br>"+typhoonLang.msg('typho.0023'));
					}else{
						typhoon_desc.html(typhoonLang.msg('typho.0023'));
					}
					
					//위성영상 지도 변경
					mapManager.toggleSatellite(false);
					
					//최근접예상 layer 보이게 하기
					mapManager.toggleNearlest(true);
			        var suf = mapManager.getZoomLvlSuffix();
			        
	        		//현재 모든 아이템 새로 그리기
			        mapManager.contentManager.refreshIcons(suf);
			        
			        /**
					 * 2019-03-19
					 * 위험반경 레이어
					 */
			        mapManager.layers.danger.setVisible(false);
					break;
				
				case 3 : // 위험영역
					
					//desc_map_id.attr("style", "top:522px;");
					//typhoon_desc.html(typhoonLang.msg('typho.0020'));
					
					/**
					 * 2019-04-29
					 * 범례 이미지 추가 (위험반경) 예정
					 */
					$("#legendImg").attr("src","../../images/weather/typoon/typ_legend_03.png");
					
					
					/**
					 * 2019-04-30
					 * 하단 문구 추가
					 */
					if(typhoon_desc.html() != ""){
						typhoon_desc.html(typhoon_desc.html()+"<br>"+typhoonLang.msg('typho.0024'));
					}else{
						typhoon_desc.html(typhoonLang.msg('typho.0024'));
					}
					
					
					//위성영상 지도 변경
					mapManager.toggleSatellite(false);
					
					//최근접예상 layer 안보이게 하기
					mapManager.toggleNearlest(false); 
			        var suf = mapManager.getZoomLvlSuffix();
			        
			        
			        /**
			         * 2019-04-05
			         * 위험반경 토글 추가
			         */
			        mapManager.layers.danger.setVisible(true);
			        mapManager.contentManager.AddDanger();
			        //mapManager.contentManager.AddCircle();
			        
			        //현재 모든 아이템 새로 그리기
			        mapManager.contentManager.refreshIcons(suf);
					break;
				
			}  
			
			//view.setZoom(minZoom);
			//zoom 및 center 초기화
			/*var view = mapManager.map.getView();
			var item = mapManager.contentManager.getItem(maspManager.getSelectedKey());
			if(typeof item !=="undefined"){
				view.setCenter(item.getCenter());
			} 
			*/
			return false;
			  
	  };
	  
	  //지도 도움말
	  tab_list.find('.tab_menu').click(handleTapControl); 
	  
	  var element = document.createElement('div');
	  element.className = 'map_tap';
	  element.appendChild(blind[0]);
	  element.appendChild(tab_list[0]);
	  
	  ol.control.Control.call(this, {
	    element: element,
	    target: options.target
	  });
	  
	  this.getControlElement = function(){
		  return tab_list;
	  };
	  
	  this.getTapIdx = function(){
		  return tabIdx;
	  };
	
};
ol.inherits(mapManager.TapControl, ol.control.Control);


/** 플레이 버튼 컨트롤
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
var idx = -1; 				//현재 소스 인덱스
mapManager.PlayControl = function(opt_options) {   
		
	var view = mapManager.map.getView();  
	var interval = 1000;
	var rate = 10; 
	var lastS = undefined;
	var lastIdx = 'N'; 			//마지막소스 인덱스 유무
	var backIdx = 'N'; 			//	
	var forwardIdx = 'N'; 		//	
	var stopIdx = 'N'; 			//
	var command = 0;			//뒤로감기 : 0,  재생: 1, 일시정지: 2, 앞으로감기 : 3  
	var timeoutArray = [];		//이벤트 핸들러
	var timeoutArray2 = [];		//이벤트 핸들러
	var nowViewControl = new mapManager.NowViewControl();	//현재 영상 시간 표시 컨트롤
	mapManager.addControl(nowViewControl); 
	
	function chageSource(s, time, index, status){
		/***status 
		 * 0:play
		 * 1:back, forward
		 ***/
		var source = new ol.source.ImageStatic({  
			url: s.fileName,
			projection: mapManager.projection,
			imageExtent: mapManager.extents.satellite
		});
		
		var originStyle = undefined;
		var newStyle = undefined;
		var timeout = setTimeout(function(){
			if(typeof s.center !== "undefined"){
				 
				originStyle = s.center.getStyle();    
				var suf = mapManager.getZoomLvlSuffix(); 
				var imgPath = originStyle.getImage().getSrc();
				var imgPathIdx = imgPath.lastIndexOf("/")+1;
				var imgFileArr = imgPath.substr(imgPathIdx).split("]"); 
				var bigImgPath = imgPath.substring(0,imgPathIdx) + "big_" + imgFileArr[0].replace(".png","") + suf + ".png";
				if(index != mapManager.imageSources.length-1){
					newStyle = new ol.style.Style({
						image: new ol.style.Icon({
		                    scale: 1,  
		                    opacity: 1,
		                    src: bigImgPath
		                })
					}); 
				}else if(index == mapManager.imageSources.length-1){
					newStyle = new ol.style.Style({
						image: new ol.style.Icon({
		                    scale: 1,  
		                    opacity: 1,
		                    src: bigImgPath
						}) 
					}); 
				}
				
				s.center.setStyle(newStyle);
				if(index != mapManager.imageSources.length-1&&status==0){

					var timeout2 =setTimeout(function(){
						var suf = mapManager.getZoomLvlSuffix(); 
						var imgPath = originStyle.getImage().getSrc();
						var imgPathIdx = imgPath.lastIndexOf("/")+1;
						var imgFileArr = imgPath.substr(imgPathIdx).split("]"); 
						imgPath = imgPath.substring(0,imgPathIdx) + imgFileArr[0].replace(".png","") + suf + ".png";
						
						newStyle = new ol.style.Style({
							 text : originStyle.getText(),
							 image : new ol.style.Icon({
				                    scale: 1,  
				                    opacity: 1,
				                    src: imgPath
				                })
						 });
						 
						s.center.setStyle(newStyle);
					},1000);
					timeoutArray2.push(timeout2);
				}
				lastS=s;
			}
			mapManager.layers.satellite.setSource(source); 
			
				
			var timstring;
			
			if(typhoonLang.currentLang === "en"){
				var tmpDate = s.tm.toDate();
				tmpDate = typhoonUtils.addHours(tmpDate,-9);
				timstring = tmpDate.toDateTimeString()+"(UTC)";
			}else{
				timstring = s.tm.timeString()+"(KST)";
			} 
			
			nowViewControl.setTimestamp(timstring);
			
			idx = index;
			if(index == mapManager.imageSources.length-1){
				lastIdx='Y';
			}else{
				lastIdx='N';
			}
		},time); 
		
		timeoutArray.push(timeout);
	};
	/*** 마지막 index 초기화(마지막에는 노란색불이 들어와있음) 이전 태풍 확인시 마지막인덱스를 노란색불을 없애야함 ***/
	function lastInit(status){
		var source = new ol.source.ImageStatic({  
			url: lastS.fileName,
			projection: mapManager.projection,
			imageExtent: mapManager.extents.satellite
		});
		
		var originStyle = originStyle = lastS.center.getStyle();
		var newStyle = undefined;
		
		if(typeof lastS !== "undefined"&&status!=3){
			var suf = mapManager.getZoomLvlSuffix(); 
			var imgPath = originStyle.getImage().getSrc();
			var imgPathIdx = imgPath.lastIndexOf("/")+1;
			var imgFileArr = imgPath.substr(imgPathIdx).split("]"); 
			var imgRename =imgFileArr[0];
			
			imgRename= imgRename.substring(4,imgRename.length);
			imgPath2 = imgPath.substring(0,imgPathIdx) + imgFileArr[0].replace(".png","") + suf + ".png";
			
			if(imgPath.indexOf("big_") != -1){
				imgPath2 = imgPath.substring(0,imgPathIdx) + imgRename.replace(".png","").replace("big_", "") + suf + ".png";
			}
			imgPath = imgPath.substring(0,imgPathIdx) + imgRename.replace(".png","") + suf + ".png";
			
			if(imgRename != ".png"&&imgRename != "ng.png"&&imgRename != ""&&status==0){
					newStyle = new ol.style.Style({
						text : new ol.style.Text({
							font: 'Normal 12px Arial',
//							text : "L",
							textAlign : "start",
							stroke: new ol.style.Stroke({
							  color: '#E0040B',
							  width: 1
							}),
							fill: new ol.style.Fill({
								color: 'red'
							})
						}),
						image: new ol.style.Icon({
			                scale: 1,  
			                opacity: 1,
			                src: imgPath
						}) 
					}); 
				lastS.center.setStyle(newStyle);
			}else if(imgRename != ".png"&&imgRename != "ng.png"&&imgRename != ""&&status==1){
				
				newStyle = new ol.style.Style({
					 text : originStyle.getText(),
					 image : new ol.style.Icon({
		                    scale: 1,  
		                    opacity: 1,
		                    src: imgPath
		                })
				 });
					 lastS.center.setStyle(newStyle);
				
			}
		}
		
	}
	
	function back(){
		stop();
		command = 0;
		
		if(backIdx=='Y'){
			lastInit(1);
		}
		var cnt = 0; 
		var i = idx;
		if(i > 0){
			
			if(command != 0)return; 
			
			var index = --i;  
			
			var s = mapManager.imageSources[index];    
			
			var time = (1 + cnt++ ) * interval/rate ; 
			
			chageSource(s, time, index, 1);
			console.log("i=="+i);
			console.log("index=="+index);
		}
	};
	
	function play(){
		stop();
		command = 1; 
		if(lastIdx=='Y'){
			lastIdx ='N';
			idx=-1;
	        var suf = mapManager.getZoomLvlSuffix();
    		//현재 모든 아이템 새로 그리기
	        mapManager.contentManager.refreshIcons(suf);
		}
		
		if(idx == 0){
			idx = -1
			suf = mapManager.getZoomLvlSuffix();
    		//현재 모든 아이템 새로 그리기
	        mapManager.contentManager.refreshIcons(suf);
		}
		var cnt = 0;
		var i = idx;
		while(i < mapManager.imageSources.length-1){
			
			if(command != 1)return; 
			
			var index = ++i;
			
			var s = mapManager.imageSources[index]; 
		 
			var time = (1 + cnt++ ) * interval ; 
			if(index==0){
				
		        var suf = mapManager.getZoomLvlSuffix();
	    		//현재 모든 아이템 새로 그리기
		        mapManager.contentManager.refreshIcons(suf);
			}
			chageSource(s, time, index, 0);
			
			console.log("i=="+i)
			console.log("s=="+s);
			console.log("time=="+time);
			console.log("index=="+index);
			
		}  
	};
	
	function stop(){  
		command = 2; 
		if(stopIdx !='Y'){
			stopStatus();
		}else{
			while(timeoutArray2.length > 0){  
				clearTimeout(timeoutArray2.shift());
			}  
		}
		while(timeoutArray.length > 0){  
			clearTimeout(timeoutArray.shift());
		}  
	};
	
	function stopStatus(){
		var cnt = 0;
		var i = idx;
		if(i!= -1){
			if(i < mapManager.imageSources.length -1){
				
				if(command != 2)return;
				
				var index = i;
				
				var s = mapManager.imageSources[index]; 
				
				var time = (1 + cnt++ ) * interval/rate ;
				
				chageSource(s, time, index, 3); 
			}  
		}
	};   
	
	function forward(){
		
		if(idx < mapManager.imageSources.length -1){
			stop();
		}
		if(forwardIdx=='Y'){
			if(idx < mapManager.imageSources.length -1){
				lastInit(1);
			}
		}
		command = 3; 
		var cnt = 0;
		var i = idx;
		if(i < mapManager.imageSources.length -1){
			
			if(command != 3)return;
			
			var index = ++i;
			
			var s = mapManager.imageSources[index]; 
			
			var time = (1 + cnt++ ) * interval/rate ;
			
			chageSource(s, time, index, 2); 
		}  
		
	};   
	
	  var html = ' <ul>                                '
			  +' 	<li><a href="javascript:;">' + typhoonLang.msg('typho.0005') + '</a></li>  '
			  +' 	<li><a href="javascript:;">' + typhoonLang.msg('typho.0006') + '</a></li>  '
			  +' 	<li><a href="javascript:;">' + typhoonLang.msg('typho.0007') + '</a></li>  '
			  +' 	<li><a href="javascript:;">' + typhoonLang.msg('typho.0008') + '</a></li>  '
			  +'</ul>  ';
  
  	  var options = opt_options || {};
	  var obj = $(html); 
	  
	  //이벤트
	  var handlePlayControl = function(e) {
		  
		  if(typeof mapManager.controls.loadingBarControl !== "undefined"){
	  		return false;
	  	  }
			
		  //스타일 적용
		  var aTag = this;
		  var aIndex = obj.find("a").index(aTag); 
		  
		  var liList = obj.find("li"); 
		  liList.removeClass("on");
		  liList.eq(aIndex).addClass("on"); 
		  switch(aIndex){
		  
			  case 0 : //뒤로감기
				  	backIdx='Y';
				  	forwardIdx='N';
				  	stopIdx ='N';
				  	if(idx!=0&&idx!=-1){
				  		back(); 
				  	}else{
				  		backIdx='N';
				  	}
				  	break;
				  	
			  case 1 : //재생
				  
					if(backIdx=='Y'){
						lastInit(1);
					}
					if(forwardIdx=='Y'){
						lastInit(1);
					}
					if(stopIdx=='Y'){
						lastInit(1);
					}
					
					backIdx = 'N'; 			
					forwardIdx = 'N'; 		
					stopIdx ='N';
				    play();
				  	break;
				  
			  case 2 : //일시정지
					backIdx = 'N'; 			
					forwardIdx = 'N'; 		
					stopIdx ='Y';
					stop();
				  	break;
				  
			  case 3 : //앞으로감기
					backIdx = 'N'; 			
					forwardIdx = 'Y'; 		
					stopIdx ='N';
				  	if(idx!=-1){
				  		forward();
				  	}else{
				  		forwardIdx='N';
				  	}
				    
				  	break;
		  }
	  }; 
	  
	 
	  obj.find('a').click(handlePlayControl);  
	  
	  var element = document.createElement('div');
	  element.className = 'map_control';
	  element.appendChild(obj[0]);
	
	  ol.control.Control.call(this, {
	    element: element,
	    target: options.target
	  });    
	  
	  this.getControlElement = function(){
		  return obj;
	  }; 
	  
	  this.init = function(){ 
		  stop();
		  idx = -1;  
		  lastIdx = 'N'; 			//마지막소스 인덱스 유무
		  backIdx = 'N'; 			
		  forwardIdx = 'N'; 	
		  stopIdx = 'N'; 
		  obj.find("li").removeClass("on");  
		  nowViewControl.setTimestamp("");
	  };
};
ol.inherits(mapManager.PlayControl, ol.control.Control);

/** 위성영상시간 표시컨트롤
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
mapManager.NowViewControl = function(opt_options) {   
	
	  var html = '<p></p>';  
  	  var options = opt_options || {};
	  var obj = $(html);  
	  
	  var element = document.createElement('div');
	  element.className = 'now_view'; 
	  element.appendChild(obj[0]);
	  
	  ol.control.Control.call(this, {
	    element: element,
	    target: options.target
	  });
	  
	  this.getControlElement = function(){
		  return obj;
	  }; 
	  
	  this.setTimestamp = function(timestamp){
		  obj.text(timestamp);
	  };
};
ol.inherits(mapManager.NowViewControl, ol.control.Control);


/**
 * 2019-03-26
 * 모두보기
 */
mapManager.OnlySelectedControl = function(opt_options) {
	
	var html = '<a href="javascript:;" class="btn_custom">'+ typhoonLang.msg('typho.0009') +'</a>';  
  	var options = opt_options || {};
	var obj = $(html); 
	  
	/**
	 * 2019-04-04
	 * 모두보기 클릭 이벤트
	 */
	var handleControl = function(e) {
		mapManager.toggleOnlySelected(this); 
	}; 
	  
	obj.click(handleControl); 
	  
	var element = document.createElement('div');
	element.className = 'map_toggle'; 
	element.appendChild(obj[0]);
	
	ol.control.Control.call(this, {
		element: element,
	    target: options.target
	});
	  
	this.getControlElement = function(){
		return obj;
	};
	
};
ol.inherits(mapManager.OnlySelectedControl, ol.control.Control);


/** geoserver의 주요지점 데이타 받기(geoserver 설정에 jsonp 사용여부를 true로 해야함)
 * JSONP WFS callback function.
 * @param {Object} response The response object.
 */

var city_position= undefined;
var step0 = ["서울", "평양", "베이징", "독도", "서귀포", "이어도", 
             "도쿄", "타이베이", "하노이", "마닐라", "괌", "팔라우", 
             "쿠알라룸프르"];

var step1 = ["서울", "평양", "베이징", "독도", "서귀포", "이어도", 
             "도쿄", "타이베이", "하노이", "마닐라", "괌", "팔라우", 
             "쿠알라룸프르",
             
             "사할린", "삿포로", "센다", "블라디보스토크", "청진", "강계", 
             "신의주", "함흥", "원산", "센다이", "나고야", "오사카", 
             "가고시마", "상하이", "칭다오", "오키나와", "푸저우", "산터우", 
             "홍콩", "잔장", "다낭", "호치민", "세부", "보라카이", 
             "삿포로"
             ];

var step2 = ["서울", "평양", "베이징", "독도", "서귀포", "이어도", 
             "도쿄", "타이베이", "하노이", "마닐라", "괌", "팔라우", 
             "쿠알라룸프르",
             
             "사할린", "삿포로", "센다", "블라디보스토크", "청진", "강계", 
             "신의주", "함흥", "원산", "센다이", "나고야", "오사카", 
             "가고시마", "상하이", "칭다오", "오키나와", "푸저우", "산터우", 
             "홍콩", "잔장", "다낭", "호치민", "세부", "보라카이", 
             "삿포로",
             
             "인천", "대전", "대구", "울산", "부산", "광주"];

var step3 = ["서울", "평양", "베이징", "독도", "서귀포", "이어도", 
             "도쿄", "타이베이", "하노이", "마닐라", "괌", "팔라우", 
             "쿠알라룸프르",
             
             "사할린", "삿포로", "센다", "블라디보스토크", "청진", "강계", 
             "신의주", "함흥", "원산", "센다이", "나고야", "오사카", 
             "가고시마", "상하이", "칭다오", "오키나와", "푸저우", "산터우", 
             "홍콩", "잔장", "다낭", "호치민", "세부", "보라카이", 
             "삿포로",
             
             "인천", "대전", "대구", "울산", "부산", "광주","세종",
             
             "수원",	"성남",	"의정부",	"안양",	"부천",	"광명",	"평택",	"동두천",	"고양",	
             "과천",	"구리",	"남양주",	"오산",	"시흥",	"군포",	"의왕",	"하남",	"용인",	
             "파주",	"이천",	"안성",	"김포",	"화성",	"광주(경)",	"양주",	"포천",	"여주",	
             "연천",	"가평",	"양평",	"춘천",	"원주",	"강릉",	"동해",	"태백",	"속초",	
             "삼척",	"홍천",	"횡성",	"영월",	"평창",	"정선",	"철원",	"화천",	"양구",	
             "인제",	"고성(강)",	"양양",	"청주",	"충주",	"제천",	"보은",	"옥천",	"영동",	
             "증평",	"진천",	"괴산",	"음성",	"단양",	"천안",	"공주",	"보령",	"아산",	
             "서산",	"논산",	"계룡",	"당진",	"금산",	"부여",	"서천",	"청양",	"홍성",	
             "예산",	"태안",	"전주",	"군산",	"익산",	"정읍",	"남원",	"김제",	"완주",	
             "진안",	"무주",	"장수",	"임실",	"순창",	"고창",	"부안",	"목포",	"여수",	
             "순천",	"나주",	"광양",	"담양",	"곡성",	"구례",	"고흥",	"보성",	"화순",	
             "장흥",	"강진",	"해남",	"영암",	"무안",	"함평",	"영광",	"장성",	"완도",	
             "진도",	"신안",	"포항",	"경주",	"김천",	"안동",	"구미",	"영주",	"영천",	
             "상주",	"문경",	"경산",	"군위",	"의성",	"청송",	"영양",	"영덕",	"청도",	
             "고령",	"성주",	"칠곡",	"예천",	"봉화",	"울진",	"울릉",	"창원",	"진주",	
             "통영",	"사천",	"김해",	"밀양",	"거제",	"양산",	"의령",	"함안",	"창녕",	
             "고성(경)",	"남해",	"하동",	"산청",	"함양",	"거창",	"합천",	"제주",	"서귀포",	
             "안산",  "백령도", "이어도", "흑산도"

];

mapManager.loadPosFeatures = function(response) {  
	city_position= response;
    var source = mapManager.layers.position.getSource();
    var geojsonFormat = new ol.format.GeoJSON();  
    console.log("city_position=="+city_position);
    if(city_position!=undefined ){
		for(var i = 0; i<city_position.totalFeatures;i++){
			var fea =city_position.features[i];
			for(var j=0; j<step3.length;j++){
				if(fea.properties.key == step3[j]){
					source.addFeatures(geojsonFormat.readFeatures(fea)); 
				}
			}
			
		}
    }
}; 

//기본 지도 생성
mapManager.loadMap = function(config){
	
	//containers 설정
	if(typeof config !== "undefined"){
		this.config = config;
	}
	
	//지도 좌표계 및 표출 영역 정의
	var projection =  new ol.proj.Projection({
						  code: 'EPSG:111111',  
						  extent: this.extents.base
						});
	
	ol.proj.addProjection(projection);  
	
	this.projection = projection;
	
	//지도 layer
	var params = this.getSourceParams(typhoonLang.currentLang === "en" ? "baseEn" : "base" );
	this.layers.base =
//		new ol.layer.Image({
//					    extent: this.extents.base,
//					    source: new ol.source.ImageWMS({
//					      url: 'http://203.247.66.46/typhoon/typhoon/wms',
//					      params: params,
//					      serverType: 'geoserver'
//					    }) 
//					  });
	
	new ol.layer.Tile({
						title: "KMA Typhoon",
						source: new ol.source.TileWMS({
//							url: 'http://203.247.66.46/typhoon/typhoon/wms',
							url: 'https://typgis.kma.go.kr/typhoon/typhoon/wms',
								  params: params
								}),
						extent : this.extents.base
						}) ;  
						
	
	//위성영상 이미지 레이어
	this.layers.satellite = new ol.layer.Image({
		  source: undefined
	});  
	
	//주요지점 레이어  
	this.layers.position = new ol.layer.Vector({
		  extent:this.extents.base,	
		  source: new ol.source.Vector({
			  loader: function(extent, resolution, projection) {
//				    var url = 'http://203.247.66.46/typhoon/typhoon/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=typhoon:city&outputFormat=text/javascript&format_options=callback:mapManager.loadPosFeatures';
				    var url = 'https://typgis.kma.go.kr/typhoon/typhoon/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=typhoon:city&outputFormat=text/javascript&format_options=callback:mapManager.loadPosFeatures';
				    // use jsonp: false to prevent jQuery from adding the "callback"
				    // parameter to the URL
				    $.ajax({url: url, dataType: 'jsonp', jsonp: false});
				  }
			}),
		  style: new ol.style.Style({
			  image: new ol.style.Circle({
				  radius: 6//,
//				  fill: new ol.style.Fill({color: 'rgba(255, 255, 255, 0.1)'})//,
				 // stroke: new ol.style.Stroke({color: 'rgba(255, 255, 255, 0.3)', width: 3})
				})
		})
	});  
	
	//태풍, TD 표출을 위한 typhoon layer
	this.layers.typhoon = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: []
				})
	});
	
	
	/**
	 * 2019-03-19
	 * 위험반경 레이어 추가
	 */
	this.layers.danger = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: []
		})
	});
	
	
	this.layers.danger.setVisible(false);
	
	
	//기본화면에서는 위성영상, 주요지점 표출 레이어, 드래그 레이어 off한다.
	this.layers.satellite.setVisible(false);  
	this.layers.position.setVisible(false);   
	//지도 객체 생성
	
	
	/**
	 * 2019-03-19
	 * 위험반경 레이어 추가
	 * this.layers.danger
	 */
	this.map = new ol.Map({
		  layers: [this.layers.base,this.layers.satellite,this.layers.position,this.layers.danger,this.layers.typhoon],
		  target: document.getElementById(config.map), 
		  controls: [new ol.control.Zoom(),new ol.control.ZoomSlider()],
		  /*controls: ol.control.defaults({
			    attributionOptions:  ({
			      collapsible: false
			    })
			  }).extend([
			    control1
		  ]),*/
	      view: new ol.View({
			projection: projection,
//			extent : ol.proj.transformExtent([80, 0, 145, 30], "EPSG:4326", "EPSG:111111"),	//적도0~북위60도 경도 100~180
//			extent : ol.extent.boundingExtent = function(coordinates) {
//			  var extent = ol.extent.createEmpty();
//			    ol.extent.extendCoordinate(this.extents.base, [-6192207.171119944, 1312256.5895937718]);
//			  return extent;
//		},
//			extent : ol.proj.transformExtent([-40, -40, 180, 60], "EPSG:4326", "EPSG:111111"),	//적도0~북위60도 경도 100~180 [-40, -40, 180, 60]
								//			minx,miny,maxx,maxy
//			extent : ol.proj.transformExtent([113, 15, 150, 46], "EPSG:4326", "EPSG:111111"),	//적도0~북위60도 경도 100~180 [-40, -40, 180, 60]
//			extent : ol.proj.transformExtent([100, 0, 160, 50], "EPSG:4326", "EPSG:111111"),	//적도0~북위60도 경도 100~180 [-40, -40, 180, 60]
			extent : ol.proj.transformExtent([100, -60, 160, 50], "EPSG:4326", "EPSG:111111"),	//적도0~북위60도 경도 100~180 [-40, -40, 180, 60]
			center: ol.extent.getCenter(projection.getExtent()),
			zoom: this.minZoom,
			maxZoom : this.maxZoom,
			minZoom : this.minZoom,
			enableRotation : false
		  })
	}); 

	//tap 컨트롤 추가
	var tapControl = new mapManager.TapControl(); 
	this.addControl(tapControl);   
	
	//토글 컨트롤 추가
	var onlySelectedControl = new mapManager.OnlySelectedControl(); 
	this.addControl(onlySelectedControl);  
	
	//contents 표출 위해 컨텐츠 매니져 생성 및 실행 
	this.contentManager = new ContentManager(this);
	
	this.graphManager  = new GraphManager();
	
	//이벤트 추가
	this.addEventPopup(); 		//지도 위의 feature 에 마우스 오버시 액션 추가
	this.addEventOverlay();		//지점 선택시 overay 추가  
	this.addEventOverlayArea();		//지점 선택시 overay 추가  
	this.addEventSelectBox();	//콤보선택 이벤트
	this.addEventClickItem();	//지도위에서 태풍선택 이벤트
	this.addEventZoom();		//지도위에서 zoom in/out 시에  태풍아이콘 사이즈 조정

};


/**
 * 2019-04-04
 * 태풍 셀렉트 박스
 */
mapManager.addEventSelectBox = function(){
	var selectboxId = this.config.selectbox;
	var graphId = this.config.graph;
	var contentManager = this.contentManager; 
	var graphManager = this.graphManager;
	var view = this.map.getView();
	

	
	$("#" + selectboxId).on("change",function(e){	
		var key = $(this).val();  
		var item = contentManager.getItem(key); 
		
		$(".graph_area").html(""); //그래프 영역 초기화
		$(".graph_area").hide();   //그래프 영역 초기화
		$(".layer_graph_area").html(""); //그래프 상세팝업
		$(".layer_graph_area").hide(); 	 //그래프 상세팝업
		$('.graphDetailLayer .tit a').trigger("click"); //그래프 내용 html 뷰어 초기화
		
		//선택된 옵션 색깔 표시
		$(this).find("option").removeClass("selected"); 
		$(this).find("option").filter(function(){
			return this.value == key ? true : false;
		}).addClass("selected"); 
		if( item instanceof ContentManager.Typhoon ){
			$(".graph_area:lt(3)").show();			//태풍 그래프만 표출 
			$(".layer_graph_area:lt(3)").show();	//태풍 그래프만 표출 
			//1.graph set 
			graphManager.showWs(item, graphId+"1", 2, 1);	//그래프내용, 그래프컨테이너DIV 아이디, 그래프 chart 타입, 그래프 y축 폰트 스타일 
			graphManager.showRad(item, graphId+"2", 1 , 1);
			graphManager.showSp(item, graphId+"3", 1 , 1);
			
			//2.graph detail set
			graphManager.showWs(item, graphId+"Popup1", 3, 2);
			graphManager.showRad(item, graphId+"Popup2", 3, 2);
			graphManager.showSp(item, graphId+"Popup3", 3, 2);
			
			//3.details set(테이블)
			contentManager.setDetailInfo(item);
			//4.change view center
			view.setCenter(item.getCenter());
			
		}
		else if( item instanceof ContentManager.Depression){
			
			$(".graph_area:gt(2)").show();			//TD 그래프만 표출 
			$(".layer_graph_area:gt(2)").show();	//태풍 그래프만 표출 
			
			//1.graph set 
			graphManager.showWsTd(item, graphId+"4", 2 , 1);
			graphManager.showSpTd(item, graphId+"5", 1 , 1);
			
			//2.graph detail set
			graphManager.showWsTd(item, graphId+"Popup4", 3, 2);
			graphManager.showSpTd(item, graphId+"Popup5", 3, 2);
			
			//3.details set
			contentManager.setDetailInfo(item);
			//4.change view center
			view.setCenter(item.getCenter());
		} 
		
		//zoom 초기화
		view.setZoom(mapManager.minZoom);
		
		//5.태풍 다시그리기
		contentManager.refreshContents();
		
		//6.위성영상 다시그리기
		if(mapManager.getCurrentTapIdx()==1){
			mapManager.setSateliteSources();
		}
		
	});
};


mapManager.getCurrentTapIdx = function(){ 
	return mapManager.controls.tapControl.getTapIdx();
};

mapManager.getSourceParams = function(arg){ 
	var param = {}; 
	
	if(typeof this.sourceParams[arg] !== "undefined"){ 
		for(var p in this.sourceParams[arg]){
			param[p]=this.sourceParams[arg][p];
		} 
	} 
	return param; 
};

//최근접예상 표출
mapManager.toggleNearlest = function(toggle){   
	this.contentManager.removeNearlest();

	if(toggle === true){
		this.contentManager.addNearlest();
	}
	
	//maker 안보이게 하기
	this.setMarker("",undefined);
	
	//지점선택 레이어 안보이게 하기
	this.layers.position.setVisible(toggle);
};

//지도 위의 feature 에 마우스 오버시 액션 추가
mapManager.addEventPopup = function(){
	 var map = this.map;
	 var typhoonLayer = this.layers.typhoon;
	 var popupId = this.config.popup;
	 var popup = this.popup;
	
	//지도 위의 feature 에 마우스 오버시 액션 추가
	map.on('pointermove', function(e){
		var pointX = e.pixel[0];
	    var pointY = e.pixel[1];
	    var mapWidth = map.getSize()[0];
	    var mapHeight = map.getSize()[1];
	    var checkX1 = mapWidth - (mapWidth / 3);
	    var checkY1 = mapHeight / 3;
	    var type1 = 'bottom';
	    var type2 = 'left';
	    if (checkX1 < pointX) {
	      type2 = 'right';
	    }
	    if (checkY1 > pointY) {
	      type1 = 'top';
	    }
	  if (e.dragging) {
		return;
	  } 
	  
	  try{
		  
		  popup = mapManager.popup;  
		  
		  var pixel = map.getEventPixel(e.originalEvent);
		  var hit = map.hasFeatureAtPixel(pixel); 
		  
		  map.getTarget().style.cursor = hit ? 'pointer' : '';

		  //태풍중심 아이콘 마우스 오버 시, DIV 정보 표출
		  var feature = map.forEachFeatureAtPixel(e.pixel,
			  function(feature, layer) {
		 
				  if(layer === typhoonLayer) {
					 return feature;
				  }
				  
				  return undefined;
		  }); 
//			var featurePos = 
//				[parseFloat(feature.get("x")),parseFloat(feature.get("y"))];

			
			if(typeof feature === "undefined"){
			  
				//popup overlay 안보이게 하기 
				if(typeof popup !== "undefined"){
					popup.setPosition(undefined);
				} 

		  }else{

				if(feature.getGeometry() instanceof ol.geom.Point){//태풍 또는 TD 중심
					//popup overlay 보이게 하기 
					var info = feature.get("info");
					
					if(info.ref instanceof ContentManager.Typhoon && info.rTp !== "TD" || info.rTp === "TY"){//태풍인 경우 
						
						var className = "g";
						var tmComments = "";
						var title = "";	
						
						if(typhoonLang.currentLang === "en"){
							var tm = info.utcTmDate.yyyymmddhhmi();
							if(info.tmTp.indexOf("F") > -1){
								tmComments = typhoonLang.msg('typho.0011').format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));	//{MM}.{DD}. {hh} Forecast
								className = "p";
							}else{
								tmComments = typhoonLang.msg('typho.0012').format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));	//{MM}.{DD}. {hh} Analysis
							}
							if(info.rTp === "TY"){
								title = typhoonLang.msg('typho.0013').format(info.ref.year, info.rSeq, info.rTyphoonName, tmComments);	//No. {0} Typhoon {1}<br/>({2}) 
							}else{
								title = typhoonLang.msg('typho.0013').format(info.ref.year, info.ref.no, info.ref.enName, tmComments);	//No. {0} Typhoon {1}<br/>({2}) 
							}
						}else{
							if(info.tmTp.indexOf("F") > -1){
								tmComments = typhoonLang.msg('typho.0011').format(info.tmTp.replace("F",""));	//예보간격이 24시 아닌 경우도 존재함.
								className = "p";
							}else if(info.tmTp == "C"){
								tmComments = typhoonLang.msg('typho.0012');
							}
							var tmString = info.tm.dateTimeFormat();  
							if(info.rTp === "TY"){
//								if(info.rDesc.length > 0){
//									tmComments ="";
//								}		
								title = typhoonLang.msg('typho.0013').format(info.ref.year, info.rSeq, info.rTyphoonName, tmComments, tmString);
							}else{
//								if(info.rDesc.length > 0){
//										tmComments ="";
//								}								
								title = typhoonLang.msg('typho.0013').format(info.ref.year, info.ref.no, info.ref.name, tmComments, tmString);
							}
						}
						
						var contents = typhoonLang.msg('typho.0014'); //<li>중심위치:{0}˚N,{1}˚E</li><li>최대풍속(중심기압):{2}㎧({3}hPa){4}</li><li>강풍반경(예외반경):{5}㎞({6} 약{7}㎞){8}</li>
							contents = contents.format( 
													Math.round(info.lat * 10)/10.0,
													Math.round(info.lon * 10)/10.0,
													typhoonUtils.zeroToBlank(info.ws,'-'),
													typhoonUtils.zeroToBlank(info.ps,'-'), 
													typhoonUtils.transValToStrength(info.ws),
													typhoonUtils.zeroToBlank(info.rad15,'-'),
													typhoonUtils.transValToDir(info.ed15),
													typhoonUtils.zeroToBlank(info.er15,'-'),
													typhoonUtils.transValToSize(info.tp, info.rad15)
										);
							
						if(typhoonUtils.transValToDir(info.ed15)=="" || typhoonUtils.zeroToBlank(info.er15,'-')=='-'){
							var contents = typhoonLang.msg('typho.0014.01'); //<li>중심위치:{0}˚N,{1}˚E</li><li>최대풍속(중심기압):{2}㎧({3}hPa){4}</li><li>강풍반경(예외반경):{5}㎞({6} 약{7}㎞){8}</li>
							contents = contents.format( 
									Math.round(info.lat * 10)/10,
									Math.round(info.lon * 10)/10,
									typhoonUtils.zeroToBlank(info.ws,'-'),
									typhoonUtils.zeroToBlank(info.ps,'-'), 
									typhoonUtils.transValToStrength(info.ws),
									typhoonUtils.zeroToBlank(info.rad15,'-'),
//									typhoonUtils.transValToDir(info.ed15),
//									typhoonUtils.zeroToBlank(info.er15,'-'),
									typhoonUtils.transValToSize(info.tp, info.rad15)
							);
							
						}
						if(info.rDesc.length > 0){
								contents += "<li style='color:#E0040B;'>" + info.rDesc + "</li>";
						}
						var popupObj = $("#" + popupId);
						popupObj.find("div.date").html(title);
						popupObj.find("ul").html(contents);
						popupObj.removeClass("typhoon_g typhoon_p");
						popupObj.addClass("typhoon_" + className);  
					    var positioning = type1 + '-' + type2;

					    // 기존 bottom css 제거를 위해서 설정.
					    popupObj.css("bottom", '0px');
						popupObj.find("span.arrow > img").attr("src", "../../images/weather/typoon/typ_new/bg_arrow_map_"+ className +".png"); 
						if(typeof popup !== "undefined"){ 
							popup.setElement(document.getElementById(popupId));
							popup.setPositioning(positioning);
							popup.setPosition(e.coordinate);
						}else{ 
							mapManager.popup = new ol.Overlay({
							  position: e.coordinate,
							  positioning: positioning,
							  element: document.getElementById(popupId),
							  stopEvent: false
							});  
							map.addOverlay(mapManager.popup);
						}
					}else if(info.ref instanceof ContentManager.Depression && info.rTp !== "TY"  || info.rTp === "TD"){ //TD인 경우
						var className = "g"; 
						var title = "";
						if(typhoonLang.currentLang === "en"){
							var tm = info.utcTmDate.yyyymmddhhmi();
							var tmComments = "";
							
							if(info.tmTp.indexOf("F") > -1){ 
								tmComments = typhoonLang.msg('typho.0011').format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));	//{MM}.{DD}. {hh} Forecast
								className = "p";
							}else{
								tmComments = typhoonLang.msg('typho.0012').format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));	//{MM}.{DD}. {hh} Analysis
							}
							//No. {0} Tropical Depression<br/>({1})
							if(info.rTp === "TD"){
								title = typhoonLang.msg('typho.0015').format(info.ref.year, info.rSeq, tmComments);
							}else{
								title = typhoonLang.msg('typho.0015').format(info.ref.year, info.ref.no, tmComments);
							}
						}else{
							var tmComments = "";
							if(info.tmTp.indexOf("F") > -1){
								tmComments = typhoonLang.msg('typho.0011').format(info.tmTp.replace("F",""));	
								className = "p";
							}else if(info.tmTp == "C"){
								tmComments = typhoonLang.msg('typho.0012');
							}
							var tmString = info.tm.dateTimeFormat(); 
							//"제 {0}호 열대저압부 {1}<br/>({2})"
							if(info.rTp === "TD"){
								title = typhoonLang.msg('typho.0015').format(info.ref.year, info.rSeq, tmComments, tmString);
							}else{
								title = typhoonLang.msg('typho.0015').format(info.ref.year, info.ref.no, tmComments, tmString);
							}
						}
						
						var contents = typhoonLang.msg('typho.0016').format(Math.round(info.lat * 10)/10,
																			Math.round(info.lon * 10)/10,
																			typhoonUtils.zeroToBlank(info.ws,'-'),
																			typhoonUtils.zeroToBlank(info.ps,'-'),
																			typhoonUtils.zeroToBlankSp(info.sp,'0'),
																			typhoonUtils.zeroToBlank(info.dir,'-'));	
						if(info.rDesc.length > 0){
							contents += "<li style='color:#E0040B;'>" + info.rDesc + "</li>";
						}
						
						var popupObj = $("#" + popupId);
						popupObj.find("div.date").html(title);
						popupObj.find("ul").html(contents);
						
						popupObj.removeClass("typhoon_g typhoon_p");
						popupObj.addClass("typhoon_" + className); 
					    var positioning = type1 + '-' + type2;
//					    popup.setPositioning(positioning);

					    // 기존 bottom css 제거를 위해서 설정.
					    popupObj.css("bottom", '0px');
						popupObj.find("span.arrow > img").attr("src", "../../images/weather/typoon/typ_new/bg_arrow_map_"+ className +".png");
						
						if(typeof popup !== "undefined"){ 
							
							popup.setPositioning(positioning);
							popup.setElement(document.getElementById(popupId));
							popup.setPosition(e.coordinate);
							
						}else{ 
							mapManager.popup = new ol.Overlay({
							  position: e.coordinate,
							  positioning: positioning,
							  element: document.getElementById(popupId),
							  stopEvent: false
							});  
							map.addOverlay(mapManager.popup);
						}
					}
				  }
		  }
	  }catch(e){
	  } 
	});  
		
};

 
//지점 선택시 overay 추가 
mapManager.addEventOverlay = function(){
	
	var map = this.map;
	var contentManager = this.contentManager;
	var positionLayer = this.layers.position;
	map.on('click', function(evt) {
		
		var suf = mapManager.getZoomLvlSuffix();
		marker = mapManager.marker;
		
//		if(typeof mapManager.controls.dragControl === "undefined"){
//			var dragControl = new mapManager.PlayControl();
//			mapManager.addControl(playControl);
//		}
		/***이벤트를 통해 클릭한 피쳐와 피쳐의 소속 레이어를 얻을 수 있음 ***/
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			  function(feature, layer) {
		 
				  if(layer === positionLayer) {
					 return feature;
				  }
				  return undefined;
		  }); 
		
		if(positionLayer.getVisible() === true){
			//최근접예상 표출 제거
			contentManager.removeNearlestLines();
		}
		
		if (typeof feature === "undefined") {    
			mapManager.setMarker("",undefined);
		}else{
			mapManager.setMarker(feature.get("key"),feature.getGeometry().getCoordinates());
			
			//최근접예상 표출
			contentManager.showNearlestLine(feature);
		}
	}); 
};


//지점 선택시 overay 추가 
mapManager.addEventOverlayArea = function(){
	
	var map = this.map;
	var contentManager = this.contentManager;
	var positionLayer = this.layers.position;
	map.on('pointermove', function(evt) {
		var suf = mapManager.getZoomLvlSuffix();
		marker = mapManager.marker;
		
//		console.log("suf=="+suf);
//		console.log("marker=="+marker);
		
		/***이벤트를 통해 클릭한 피쳐와 피쳐의 소속 레이어를 얻을 수 있음 ***/
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			  function(feature, layer) {
		 
				  if(layer === positionLayer) {
					 return feature;
				  }
				  return undefined;
		  }); 
		
//		if(positionLayer.getVisible() === true){
//			//최근접예상 표출 제거
//			contentManager.removeNearlestLines();
//		}
		
		if (typeof feature === "undefined") {    
			mapManager.setMarker("",undefined);
		}else{
			mapManager.setMarker(feature.get("key"),feature.getGeometry().getCoordinates());
			
			//최근접예상 표출
			contentManager.showArea(feature);
		}
	}); 
};


//마커
mapManager.setMarker = function(key, coordinates){
	var marker = this.marker;
	var markerId = this.config.marker;
	var map = this.map;
	
	if(typeof marker !== "undefined"){
		$("#" + markerId).attr("title",key);
		marker.setElement(document.getElementById(markerId));
		marker.setPosition(coordinates);
	}else{
		$("#" + markerId).attr("title",key);
		mapManager.marker = new ol.Overlay({
			  position: coordinates,
			  positioning: 'center-center',
			  element: document.getElementById(markerId),
			  stopEvent: false,
			  autoPan: true,
			  autoPanMargin: 0
		}); 
		map.addOverlay(mapManager.marker);
	}
};

//태풍 또는 TD 클릭시, 선택되는 효과 //select setting
mapManager.addEventClickItem = function(){
	
	var map = this.map;
	var typhoonLayer = this.layers.typhoon;
	var contentManager = this.contentManager; 
	var selectboxId = this.config.selectbox;
	
	map.on('click', function(evt) {		
		
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			  function(feature, layer) {
		 
				  if(layer === typhoonLayer) {
					 return feature;
				  }
				  
				  return undefined;
		}); 
	 
		if (typeof feature !== "undefined" && feature.getGeometry() instanceof ol.geom.Point) {    //태풍 또는 TD 중심
			
			var opts = $("#" + selectboxId + " > option");
			var opts_t = $("#" + selectboxId + " > option:selected").val();
			
			for(var i = 0; i < opts.length ; i++){
				var key = opts[i].value; 
				if(key.length>0&&key!=opts_t){
					var item = contentManager.getItem(key);
					var fs = item.getFeatures();
					for(var f in fs){
						if(fs[f] === feature){
							$("#" + selectboxId ).val(key);
							$("#" + selectboxId ).trigger("change");
							return;
						}
					}
				}
			}
		}
	}); 
};


mapManager.getZoomLvlSuffix = function(){
	
	var zoom = this.map.getView().getZoom();
	var maxZoom = this.maxZoom;
	var minZoom = this.minZoom; 
	var suffix = "";
	
	if(zoom > minZoom){
		
		var delta = zoom - minZoom;
		delta  = delta > maxZoom ? maxZoom : delta;
		suffix = "]z" + (zoom - minZoom);
	}
	
	return suffix;
};

//축척변경 zoom
mapManager.addEventZoom = function(){ 
	
	var contentManager = this.contentManager; 
	this.map.getView().on('propertychange', function(e) {
		   switch (e.key) {
		   		
		      case 'resolution':  
		    	
		        if(e.oldValue === this.get('resolution') || typeof this.getZoom() === "undefined"){
		        	return false;
		        }
		        
		        //0.5, 0.6, 0.7, 0.8, 1
		        var suf = mapManager.getZoomLvlSuffix();
		        zoomArea(suf);
        		//현재 모든 아이템 새로 그리기
        		contentManager.refreshIcons(suf);
		        
		        break; 
		   }
	});
	//축척에 따라 표출되는 아이콘변경 
	function zoomArea(suf){
        var stepStand =undefined;
//        switch (suf) {
//        case "]z1":
//        	stepStand =step1;
//        	break;
//        case "]z2":
//        	stepStand =step2;
//        	break;
//        case "]z3":
//        	stepStand =step3;
//        	break;
//        case "]z4":
//        	stepStand =step3;
//        	break;
//        case "":
//        	stepStand =step0;
//        	break;
//        	
//        default:
//        	stepStand =step1;
//        break;
//        }
        
        console.log("suf=="+suf);
        switch (suf) {
			case "]z1":
				stepStand =step1;
				break;
			case "]z2":
				stepStand =step3;
				break;
			case "]z3":
				stepStand =step3;
				break;
			case "]z4":
				stepStand =step3;
				break;
			case "":
				stepStand =step0;
				break;
			default:
				stepStand =step3;
				break;
		}
		
        if(stepStand != undefined){
        	var source = mapManager.layers.position.getSource();
        	source.clear();
        	var geojsonFormat = new ol.format.GeoJSON();  
        	if(city_position!=undefined ){
	        	for(var i = 0; i<city_position.totalFeatures;i++){
	        		var fea =city_position.features[i];
	        		for(var j=0; j< stepStand.length;j++){
	        			if(fea.properties.key == stepStand[j]){
	        				source.addFeatures(geojsonFormat.readFeatures(fea)); 
	        			}
	        		}
	        	}
        	}
        }
      //축척에 따라 표출되는 아이콘변경 end
        
	}
};




/** [현재 진행중인 태풍 또는 열대저압부가 없습니다.]메세지 컨트롤
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
mapManager.NoItemMsgControl = function(opt_options) {  
	
  	  var html = '<p>'+ opt_options.html +'</p>'; 
  	  var options = opt_options || {};
	  var obj = $(html); 
	  
	  var element = document.createElement('div');
	  element.className = 'map_notice';
	  element.appendChild(obj[0]);
	  
	  ol.control.Control.call(this, {
	    element: element,
	    target: options.target
	  });
};
ol.inherits(mapManager.NoItemMsgControl, ol.control.Control);

/** 로딩바 컨트롤
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
mapManager.LoadingBarControl = function(opt_options) {   
	
	 $("#" + mapManager.config.selectbox).prop('disabled', true); 
	  var html = '<p><img src="../../images/weather/typoon/typ_new/loading_bar.gif" width="339px" height="26px" alt="로딩바" /></p>'; 
  	  var options = opt_options || {};
	  var obj = $(html); 
	  
	  var element = document.createElement('div');
	  element.className = 'map_notice';
	  element.appendChild(obj[0]);
	  
	  ol.control.Control.call(this, {
	    element: element,
	    target: options.target
	  }); 
};
ol.inherits(mapManager.LoadingBarControl, ol.control.Control);


/** 
 * [현재 진행중인 태풍 또는 열대저압부가 없습니다.] 지도위에 메세지 표시
 */
mapManager.addNoItemMsgControl = function(){
	var control = new mapManager.NoItemMsgControl({html : typhoonLang.msg('typho.0017')});
	this.addControl(control); 
	
	var view = mapManager.map.getView();  
	
	
	
	
	view.setCenter(ol.proj.transform([125.5,38.5], "EPSG:4326", "EPSG:111111"));
	$(".more_info_wrap").hide();
	
	$(".typhoon_map").html('<img src="../../images/weather/typoon/img_nonetyphoon.gif" alt="현재 진행중인 태풍 또는 열대저압부가 없습니다.">');
};

/**
 * 2019-04-04
 * 모두보기 토글시 호출
 */
mapManager.toggleOnlySelected = function(obj){ 
	
	if(this.contentManager.toggleOnlySelected() == true){
		$(obj).html(typhoonLang.msg('typho.0019'));
		$(obj).toggleClass('allTyp');
	}else{ 
		$(obj).html(typhoonLang.msg('typho.0018'));
		$(obj).toggleClass('allTyp');
	}
	
};

//현재 선택된 selectbox 아이템의 키값 조회 
mapManager.getSelectedKey = function(){
	return $("#"+this.config.selectbox + " option:selected").val();  
};

//중심 위치 변경
mapManager.setCenter = function(center) {
  if (objectUtils.isUndefined(center)) {
    return;
  }
  var lon;
  var lat;
  if (center.hasOwnProperty('slon')) {
    // rect
    lon = (center.slon + center.elon) / 2;
    lat = (center.slat + center.elat) / 2;
  } else if (center.hasOwnProperty('lon_min')) {
    // rect
    lon = (center.lon_min + center.lon_max) / 2;
    lat = (center.lat_min + center.lat_max) / 2;
  } else if (center.hasOwnProperty('lon')) {
    // coordinate
    lon = center.lon;
    lat = center.lat;
  } else if (center.hasOwnProperty('length')) {
    // array
    lon = center[0];
    lat = center[1];
  }
  var view = mapManager.map.getView();
  var pos = olUtils.transEpsg4326toEpsg111111(ol, [ lon, lat ]);
  view.setCenter(pos); 
};
