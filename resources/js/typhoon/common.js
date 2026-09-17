/* top navigation */
function initTopMenu(el,depth1) {
	topMenuOut(el.getElementsByTagName("img").item(0));
	if(el.id == "top-menu" + depth1) {
		topMenuOver(el.getElementsByTagName("img").item(0));
	}
}
function topMenuOver(img) {
	img.src = img.src.replace(".gif", "_on.gif");
}
function topMenuOut(img) {
	img.src = img.src.replace("_on.gif", ".gif");
}

function selectTopmenuByMenuId() {
	var depth1 = this.id.substring("top-menu-head".length,this.id.length);
	var menuId = "sub-menu" + depth1;		
	var selectDepth1 = "top-" + depth1 + "-1";
	var topnav = document.getElementById("gnb");
	if(!topnav) return;
	var topEl = topnav.getElementsByTagName("ul");
	for(i = 0 ; i < topEl.length ; i++){
		if(topEl[i].id.substring(0,12) == "top-sub-menu") {
			topEl[i].style.display = "none";
		}
	}
	var topEl2 = topnav.getElementsByTagName("li");
	for(i = 0 , seq = 1; i < topEl2.length ; i++){
		if(topEl2[i].id.substring(0,8) == "top-menu") {
			initTopMenu(topEl2[i],depth1);
		}
	}
	
	var nav = document.getElementById("top-" + menuId);
	if(!nav) return;
	nav.style.display = "block";
	menuEl = nav.getElementsByTagName("li");
	for(i = 0; i < menuEl.length; i++) {
		var imgEl = menuEl.item(i).getElementsByTagName("img")
		if(imgEl != null && imgEl.length>0) {
			imgEl.item(0).onmouseover = menuOver;
			imgEl.item(0).onmouseout = menuOut;
			imgEl.item(0).onfocus = menuOver;
			imgEl.item(0).onblur = menuOut;
		}
	}
}

function initTopmenuByMenuId(depth1, depth2, depth3, depth4, menuId) {
	var selectDepth1 = "top-" + depth1 + "-" + depth2;
	var selectDepth2 = "top-" + depth1 + "-" + depth2 + "-" + depth3;
	var selectDepth3 = "top-" + depth1 + "-" + depth2 + "-" + depth3 + "-" + depth4;
	var topnav = document.getElementById(menuId);
	if(!topnav) return;
	var topEl = topnav.getElementsByTagName("ul");
	for(var i = 0 ; i < topEl.length ; i++){
		if(topEl[i].id.substring(0,12) == "top-sub-menu") {
			topEl[i].style.display = "none";
		}
	}
	
	var topEl2 = topnav.getElementsByTagName("a");

	for(i = 0, seq = 0 ; i < topEl2.length ; i++){
		if(topEl2[i].id.substring(0,13) == "top-menu-head") {
			topEl2[i].onmouseover =  selectTopmenuByMenuId;
			topEl2[i].onfocus = selectTopmenuByMenuId;
			if ( topEl2[i].id.substring(13) == depth1) {
				topEl2[i].onmouseover();
			}
			seq++;
		}
	}
	
	var nav = document.getElementById("top-sub-menu" + depth1);
	if(!nav) return;
	nav.style.display = "block";
	menuEl = nav.getElementsByTagName("li");
	for(i = 0; i < menuEl.length; i++) {
		var menuElItm = menuEl.item(i);
		var imgEl = menuElItm.getElementsByTagName("img");
		if(imgEl == null || imgEl.length == 0)  {
			var aEl = menuElItm.getElementsByTagName("a");
			var itm = aEl.item(0);
			if (menuElItm.id == selectDepth1 || menuElItm.id == selectDepth2  || menuElItm.id == selectDepth3  ) {
				itm.className = "on";
			}
		} else {
			var itm = imgEl.item(0);
			if (menuElItm.id == selectDepth1 || menuElItm.id == selectDepth2  || menuElItm.id == selectDepth3  ) {
				itm.src = itm.src.replace(".gif", "_on.gif");
				itm.onmouseover = null;
				itm.onmouseout = null;
				itm.onfocus = null;
				itm.onblur = null;
			}
			else {
				itm.onmouseover = menuOver;
				itm.onmouseout = menuOut;
				itm.onfocus = menuOver;
				itm.onblur = menuOut;
			}
		}
	}
}


/* side navigation */
function initSubmenuByMenuId(depth1, depth2, depth3,depth4, menuId) {
	selectDepth1 = "menu" + depth1 + "-" + depth2;
	selectDepth2 = "menu" + depth1 + "-" + depth2 + "-" + depth3;
	selectDepth3 = "menu" + depth1 + "-" + depth2 + "-" + depth3 + "-" + depth4;
	
	nav = document.getElementById(menuId);
	if(!nav) return;
	menuEl = nav.getElementsByTagName("li");	
	
	for(i = 0; i < menuEl.length; i++) {
		if (menuEl.item(i).id == selectDepth1 || menuEl.item(i).id == selectDepth2  || menuEl.item(i).id == selectDepth3  ) {
			var im = menuEl.item(i).getElementsByTagName("img");
			if(im && im.length > 0 ) {
				im.item(0).src = im.item(0).src.replace(".gif", "_on.gif");
			}
			else {
				var anc = menuEl.item(i).getElementsByTagName("a");
				if(anc && anc.length > 0) {
					anc.item(0).className = "on";
					if(menuEl.item(i).id == selectDepth3) {
						anc.item(0).className += " leaf";
					}
				}
			}
		} else {
			var im = menuEl.item(i).getElementsByTagName("img");
			if( im == null || im.length == 0)  continue;
			im.item(0).onmouseover = menuOver;
			im.item(0).onmouseout = menuOut;
			im.item(0).onfocus = menuOver;
			im.item(0).onblur = menuOut;
			if (menuEl.item(i).getElementsByTagName("ul").item(0)) {
				menuEl.item(i).getElementsByTagName("ul").item(0).style.display = "none";
			}
		}
	}	
	menuId = "menu" + depth1;
	initTopmenuByMenuId(depth1,depth2,depth3,depth4,menuId);
}


/* roll over-out image */
function menuOver() {
	var s = this.src;
	s = s.replace("_on.gif", ".gif");
	this.src = s.replace(".gif", "_on.gif");
}

function menuOut() {
	this.src = this.src.replace("_on.gif", ".gif");
}

function initImgEffect(ImgEls,SelImg) {
	
	MenuImg = document.getElementById(ImgEls).getElementsByTagName("img");
	MenuImgLen = MenuImg.length;

	for (i=0; i<MenuImgLen; i++) {
		MenuImg.item(i).onmouseover = menuOver;
		MenuImg.item(i).onmouseout = menuOut;
		if (i == SelImg) {
			MenuImg.item(i).onmouseover();
			MenuImg.item(i).onmouseover = null;
			MenuImg.item(i).onmouseout = null;
		}
	}
}


/* text tab menu */
function tabmenuView(a) {
	if(!document.getElementById) return false;
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById("tabmenu")) return false;
	var a;
	var el = document.getElementById("tab_"+a);
	if(el && el.nodeName == "LI"){
		el.className = "on";
		el.getElementsByTagName("a")[0].className = "on";
	}
}

function tabAnchor(a) {
	if(!document.getElementById) return false;
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById("tab_anchor")) return false;
	var a;
	var el = document.getElementById("anchor_"+a);
	if(el && el.nodeName == "LI"){
		el.className = "on";
		el.getElementsByTagName("a")[0].className = "on";
	}
}


/* tab main board */
function mainBoardChange(idx) {
	var obj;
	var obj2;
	for (var z=1; z<=5; z++) {
		obj = document.getElementById('mainBoard' + z);
		obj2 = document.getElementById('mainBoardMore' + z);
		obj3 = document.getElementById('bImg' + z);
		if ( obj && obj2 && obj3 ) {
			ln1 = obj3.src.substring(0,obj3.src.lastIndexOf(".") -1) + "2.gif";
			ln2 = obj3.src.substring(0,obj3.src.lastIndexOf(".") -1) + "1.gif";
			if (z == idx){
				obj.className="";
				obj2.className="more";
				obj3.src = ln1;
			} else {
				obj.className="hid";
				obj2.className="more_hid";
				obj3.src = ln2;
			}

		}
	}
}


/* IE Flicker Bug */
(function(){
	/*Use Object Detection to detect IE6*/
	var  m = document.uniqueID /*IE*/
	&& document.compatMode  /*>=IE6*/
	&& !window.XMLHttpRequest /*<=IE6*/
	&& document.execCommand ;
	try{
		if(!!m){ m("BackgroundImageCache", false, true) /* = IE6 only */ }
	}catch(oh){};
})();

function getCookie( name )
{
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length )
	{
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie )
		{
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
			break;
	}
	return "";
}

function setCookie( name, value,domain ,expireday)
{
	var todayDate = new Date();

	todayDate.setDate(todayDate.getDate() + expireday);

	document.cookie = name + "=" + escape( value ) + "; path=/; domain=" + domain + "; expires=" + todayDate.toGMTString() +";"
}



/* table td colorChange */
function tableOverChange(obj) {
	var tableObj = document.getElementById(obj);
	var tableObj_td = tableObj.getElementsByTagName('td');
		for(i=0; i<tableObj_td.length; i++) {
		tableObj_td[i].onmouseover = function() {
			this.style.background = "#edf0fa";
		}
		tableObj_td[i].onmouseout = function() {
			this.style.background = "#ffffff";
		}
	}
}


/* 빠른서비스 */
function spreadOpen(obj){
	var obj=document.getElementById(obj);
	if(obj.style.display!="block"){
		obj.style.display="block";
	}
} 

function spreadClose(obj){
	var obj=document.getElementById(obj);
	if(obj.style.display=="block"){
		obj.style.display="none";
	}
} 

/* 찾아오시는길 */
function roadOpen(obj){
	var menuId = document.getElementById("div_location_1").getElementsByTagName("p");


	for(i=0; i<menuId.length; i++){		
		if(menuId[i].id == null || menuId[i].id == ""){
		}else{		
			if( menuId[i].id == obj){			
				menuId[i].style.display = "block";						
			}else{
				menuId[i].style.display = "none";
			}
		}
	}

	var menuId2 = document.getElementById("div_location_1").getElementsByTagName("div");
	var menuId1 = document.getElementById("div_location_1").getElementsByTagName("h5");
	var obj = "tab_"+obj;
	
	for(i=0; i<menuId1.length; i++){
		
		var menuItm1 = menuId1.item(i);		
		var imgItm = menuItm1.getElementsByTagName("img"); 
		
		var itm = imgItm.item(0);	
		
		if( menuId2[i].id == obj){
			if(itm.src.indexOf("_on")<0){
				itm.src = itm.src.replace(".gif", "_on.gif");
			}
		}else{
			itm.src = itm.src.replace("_on.gif", ".gif");				
		}

	}	
		
} 



/* 팝업존 */
function popupZone(){
try{
	for(i=1;i<=popupItemCount;i++){
		if(popupZoneTmpVal!=1) {
			popupZoneVal = popupZoneTmpVal;
			popupZoneTmpVal = 1;
		}
		if(popupZoneVal == popupItemCount+1)	popupZoneVal = 1;
		if(popupZoneVal==0) popupZoneVal = 1;
		id1 = "popNum"+i
		id2 = "popBanner_"+i
		if(popupZoneVal==i){
			document.getElementById(id1).setAttribute('src',"/images/main/btn_circle_on.gif");
			document.getElementById(id2).style.display	= "";
		}else{
			document.getElementById(id1).setAttribute('src',"/images/main/btn_circle.gif");
			document.getElementById(id2).style.display	= "none";
		}
	}

	popupZoneVal = popupZoneVal + 1;
	autocontrolvar=setTimeout("popupZone()",3000);
}catch(e){
}
}

function popupZoneStop(chk){
	if(chk){
		clearTimeout(autocontrolvar);
	}else{
		clearTimeout(autocontrolvar);
		popupZone();
	}
}

function popupZoneMove(num){
	for(i=1;i<=popupItemCount;i++){
		id1 = "popNum"+i
		id2 = "popBanner_"+i
		if(num==i){
			document.getElementById(id1).setAttribute('src',"/images/main/btn_circle_on.gif");
			document.getElementById(id2).style.display	= "";
		}else{
			document.getElementById(id1).setAttribute('src',"/images/main/btn_circle.gif");
			document.getElementById(id2).style.display	= "none";
		}
	}
	popupZoneVal = num;
	popupZoneTmpVal = num;
	popupZoneStop(1);
}



/// G-PIN
function gpinAuthRequest(flag) {
	wWidth = 360;
	wHight = 120;

	if(!flag){
		flag = "join";
	}

	wX = (window.screen.width - wWidth) / 2;
	wY = (window.screen.height - wHight) / 2;

	window.open("http://www.gico.or.kr/GPIN/AuthRequest.jsp?flag="+flag, "gPinLoginWin", "directories=no,toolbar=no,left="+wX+",top="+wY+",width="+wWidth+",height="+wHight);
}


/// Name Check
function nameAuthRequest(f) {
	
	f.a2.value =  f.juminno1.value + f.juminno2.value;
	f.a3.value =  f.realName.value;
	if(f.a2.value.length<13){
		alert("주민번호를 입력하세요");
		return false;
	}
	if(f.a3.value.length<2){
		alert("성명을 입력하세요");
		return false;
	}
}


/// 즐겨찾기
function sendFavorite(f){
	f.title.value = document.title;
}


///// ZonnInOut //////////////////////////////////////////////////////////////////////////////	

var nowZoom = 100; // 현재비율
var maxZoom = 200; // 최대비율
var minZoom = 100; // 최소비율(현재와 같아야 함)


function zoomNo(){

	location.reload();

}

	//화면 키운다.
function zoomIn() {
	scaleFont(1);
	return;
	if (nowZoom < maxZoom) {
		nowZoom += 10; // 10%씩 커진다.
	} else {
		return;
	}
	document.body.style.zoom = nowZoom + "%";
}

//화면 줄인다.
function zoomOut() {
	scaleFont(-1);
	return;
	if (nowZoom > minZoom) {
		nowZoom -= 10; // 10%씩 작아진다.
	} else {
		return;
	}

	document.body.style.zoom = nowZoom + "%";
}
var fontSize = 13;
function scaleFont(val) {

    var fontSizeSave = fontSize;
	
    if (val > 0) {
        if (fontSize <= 20) {
            fontSize = fontSize + val; 
        }
    } else {
        if (fontSize > 10) {
            fontSize = fontSize + val; 
        }
    }
    if (fontSize != fontSizeSave) {
        drawFont(fontSize);
    }
    //set_cookie("ck_fontsize", fontSize, 30); 
}


function drawFont(fontSize) {
//    if (!fontSize) {
//        fontSize = getFontSize();
//    }
	var con_font = document.getElementById("contents");
	con_fonts = con_font.getElementsByTagName("li");
	for(i = 0; i < con_fonts.length; i++) {
		con_fonts.item(i).style.fontSize = fontSize + "px";
	}
	con_fonts = con_font.getElementsByTagName("dd");
	for(i = 0; i < con_fonts.length; i++) {
		con_fonts.item(i).style.fontSize = fontSize + "px";
	}
	con_fonts = con_font.getElementsByTagName("p");
	for(i = 0; i < con_fonts.length; i++) {
		con_fonts.item(i).style.fontSize = fontSize + "px";
	}
	con_fonts = con_font.getElementsByTagName("th");
	for(i = 0; i < con_fonts.length; i++) {
		con_fonts.item(i).style.fontSize = fontSize + "px";
	}
	con_fonts = con_font.getElementsByTagName("td");
	for(i = 0; i < con_fonts.length; i++) {
		con_fonts.item(i).style.fontSize = fontSize + "px";
	}
	con_fonts = con_font.getElementsByTagName("label");
	for(i = 0; i < con_fonts.length; i++) {
		con_fonts.item(i).style.fontSize = fontSize + "px";
	}

	con_fonts = con_font.getElementsByTagName("textarea");
	for(i = 0; i < con_fonts.length; i++) {
		con_fonts.item(i).style.fontSize = fontSize + "px";
	}

}


/// 멀티 체크박스 선택
function multiCheckBox(name,val){ // 이름 , (활성화 비활성화) 여부
	for (i = 0; i < name.length; i++) {
   name[i].checked = val; 
  }
}

//화면 프린트
function print_area(){
	
	if(document.getElementById("gico_iframe")){
		document.getElementById("gico_iframe").focus();				
	    window.print();	    
	}else{
		window.open('/include/print.jsp', 'print_area', 'width=710,height=700,scrollbars=yes'); return false;		
	}	 
}

//지도 프린트
function print_map(){
	window.open('/include/printMap.jsp', 'print_area', 'width=660,height=400'); return false;	
}

//이미지 넘기기
function img_prev(){
	var i;
	var j; 	 	 	 	
	for(i=0; i<newt.length; i++){
		if(newt.length == 1){
			return;
		}else{
			if(document.getElementById(newt[i]).style.display == "block"){
				if(i==0){				
					j = newt.length - 1;
					document.getElementById(newt[j]).style.display = "block";
					document.getElementById(newt[0]).style.display = "none";
					return;
				}else{
					j = i - 1;
					document.getElementById(newt[j]).style.display = "block";
					document.getElementById(newt[i]).style.display = "none";
				}							
			}
		}
	}								
}

function img_next(){
	var i;
	var j; 	 	 
 	
	for(i=0; i<newt.length; i++){
		if(newt.length == 1){
			return;
		}else{		
			if(document.getElementById(newt[i]).style.display == "block"){
				if(i == newt.length-1 ){
					document.getElementById(newt[0]).style.display = "block";
					document.getElementById(newt[i]).style.display = "none";
					return;
				}else{
					j = i + 1;
				}
				document.getElementById(newt[i]).style.display = "none";				
			}
		}
	}
	document.getElementById(newt[j]).style.display = "block";		
}

function img_init() {
	dd = document.getElementById("newtown_image_list");
	if(dd){
		var ddList = dd.getElementsByTagName("P");
		for(i = 0 ; i < ddList.length ; i++) {
			newt[newt.length] = ddList[i].id;
		}
	}
}
function img_block(){
	for(i=0; i<newt.length; i++){
		if(i==0){
			document.getElementById(newt[i]).style.display = "block";
		}else{
			document.getElementById(newt[i]).style.display = "none";
		}			
	}
}
//이미지 넘기기

//레이어 닫기
function hide() {
var item = document.getElementById('layer');
if (item.style.display == 'none') {
	item.style.display = 'none';
	}
	else{
	item.style.display = 'none';
	}
}

function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}
/** quick menu **/
function initMoving(target) {
	if (!target)
		return false;

	var obj = target;
	obj.initTop = 0;
	obj.initLeft = 0;
	

	obj.bottomLimit = getDocHeight();
	//alert(document.documentElement.scrollHeight);
	obj.topLimit = 0;

	obj.style.position = "absolute";
	obj.top = obj.initTop;
	obj.left = obj.initLeft;
	obj.style.top = obj.top + "px";
	obj.style.left = obj.left + "px";

	obj.getTop = function() {
		if (document.documentElement.scrollTop) {
			return document.documentElement.scrollTop;
		} else if (window.pageYOffset) {
			return window.pageYOffset;
		} else {
			return 0;
		}
	}
	obj.getHeight = function() {
		if (self.innerHeight) {
			return self.innerHeight;
		} else if(document.documentElement.clientHeight) {
			return document.documentElement.clientHeight;
		} else {
			return 200;
		}
	}

	obj.move = setInterval(function() {
		
		pos = obj.getTop() + obj.getHeight() / 5 - 15;

		if (pos > obj.bottomLimit)
			pos = obj.bottomLimit
		if (pos < obj.topLimit)
			pos = obj.topLimit
		interval = obj.top - pos;
		obj.top = obj.top - interval / 5;
		obj.style.top = obj.top + "px";
	}, 10)
}

/**
 * 팝업 띄우기
 * @date : 2019-05-17 [장근희]
 */
function openWindow() {
	wWidth = 637;
	wHight = 385;

	wX = (window.screen.width - wWidth) / 2;
	wY = (window.screen.height - wHight) / 2;

	window.open("/TYPHOON/popup/popup_service_end.html", "popup1", "directories=no,toolbar=no,left="+wX+",top="+wY+",width="+wWidth+",height="+wHight);
}
