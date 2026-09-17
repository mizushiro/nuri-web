(function($, window, document){
	function getCookie( name ) {
		var nc = name + "="; var x = 0;
		while ( x <= document.cookie.length ) {
			var y = (x+nc.length);
			if ( document.cookie.substring( x, y ) == nc ) {
				if ( (eoc=document.cookie.indexOf( ";", y )) == -1 )
					eoc = document.cookie.length;
				return unescape(document.cookie.substring( y, eoc ));
			}
			x = document.cookie.indexOf( " ", x ) + 1;
			if ( x == 0 ) break;
		}
		return "";
	}

	function setCookie( name, value, eds ){
		var td = new Date();
		td.setTime( td.getTime() + eds*3600*24*1000 );
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + td.toGMTString() +";";
	}
	function resizeFrame(obj) {
		var newheight = null;
		if(document.getElementById) {
			newheight = obj.contentWindow.document.body.scrollHeight;
		}
		if(newheight){
			$(obj).attr('height', newheight + "px");
		} else {
			$(obj).attr('height', "550px");
		}
		if($(obj).height() < 100) {
			$(obj).attr('height', "450px");
		}
	}
	function isMobileApp() {
		return typeof mobileApp != "undefined" && mobileApp;
	}
	function createDialog(lastModified) {
		var $body = isMobileApp()?$("div.container"):$("body");
		var html = '<div class="bangjae-dialog" tabindex="0">\n';
		html += '	<div class="bangjae-dialog-title"><h2>방재 속보</h2></div>\n';
		html += '	<a class="bangjae-dialog-close" href="#close" title="닫기">X</a>\n';
		html += '	<div class="bangjae-dialog-iframe">\n';
		html += '		<iframe src="' + getPrefix() +'wnuri-main/bangjae/bang.do" name="iframe_bangjae" id="iframe_bangjae" width="680px"  frameborder="0" marginwidth="0" marginheight="0" scrolling="auto" title="방재속보"></iframe>\n';
		html += '	</div>\n';
		html += '	<div class="bangjae-dialog-footer">\n';
		html += '		<span><input type="checkbox" style="-webkit-appearance:checkbox;"id="bangjae_do_not_open" data-last-modified="' + lastModified + '"/> <label for="bangjae_do_not_open">오늘 다시 열지 않기</label></span>';
		html += '		<a class="bangjae-dialog-footer-close" href="#close"><strong>닫기</strong></a>';
		html += '	</div>\n';
		html += '</div>';
		$body.append(html);
		$('.bangjae-dialog-close').on('click', function(e) {
			$('.bangjae-dialog').hide();
		});
		$('.bangjae-dialog-iframe iframe').on('load', function(e) {
			resizeFrame(this);
		});
		
		$('.bangjae-dialog-footer-close').on('click', function(e) {
			var $checkbox = $('#bangjae_do_not_open');
			var lastModified = $checkbox.attr('data-last-modified');
			if($checkbox[0].checked) {
				setCookie(lastModified,'nevermind', 1);
			}
			
			$('.bangjae-dialog').fadeOut();
		});
		$(document).ready(function(){
			$('.bangjae-dialog').first().trigger('focus');
		});
	}
	function getPrefix() {
		if(window.appBase) {
			return window.appBase;
		} else {
			return "/";
		}
	};
	$.ajax({
		url: getPrefix() + '/wnuri-main/rest/bangjae/exists.do'
		, cache:false
		, type: 'post'
		, dataType: "json"
		, success:function(data) {
			var lastModified = "BJ";
			if(data.lastModified) {
				lastModified += data.lastModified;
			}
			if(data.bangjaeExists) {
				if(getCookie(lastModified) != 'nevermind') {
					$.ajax({
						url: getPrefix() + '/wnuri-main/rest/bangjae/eqk-exists.do'
						, cache:false
						, type: 'post'
						, dataType: "json"
						, success:function(data) {
							var isEqkBangjae = data.bangjaeEqkExists;						
							createDialog(lastModified);
							
							if(!mobilecheck() && isEqkBangjae) {
								$('.bangjae-dialog').attr("style", "left:34% !important;");
							}
						}
						, error: function(data) {
							if(window.console) window.console.log(data);
						}
					});
				}
			}
		}
		, error: function(data) {
			if(window.console) window.console.log(data);
		}
	});
})(jQuery, window, document);