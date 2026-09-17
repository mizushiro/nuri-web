function setCookie( name, value, eds ){
	var td = new Date();
	td.setTime( td.getTime() + eds*3600*24*1000 );
	document.cookie = name + "=" + escape( value ) + ";expires=" + td.toGMTString() +";domain=.kma.go.kr;path=/;";
}
function setCookie_(name,value,expireday){
	var todayDate = new Date();
	
	todayDate.setDate(todayDate.getDate()+ expireday);
	
	document.cookie = name + "=" + value + ";expires=" + todayDate.toGMTString() + ";domain=.kma.go.kr;path=/;";
}
function getCookie( name ) {
	var nc = name + "="; var x = 0;
	while ( x <= document.cookie.length ) {
		var y = (x+nc.length);
		if ( document.cookie.substring( x, y ) == nc ) {
			if ( (eoc=document.cookie.indexOf( ";", y )) == -1 )
				eoc = document.cookie.length;
			return unescape( document.cookie.substring( y, eoc ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 ) break;
	}
	return "";
}
function changeCookie(name){
	var expireday = new Date();
	
	expireday.setDate(expireday.getDate() - 1);
	
	document.cookie = name + "=" + ";expires = "+ expireday.toGMTString() + ";domain=.kma.go.kr;path=/;";
}

function delCookie(name){
	var expireday = new Date();
	
	expireday.setDate(expireday.getDate() - 1);
	
	document.cookie = name + "=" + ";expires = "+ expireday.toGMTString() + ";domain=.kma.go.kr;path=/;  ";
}