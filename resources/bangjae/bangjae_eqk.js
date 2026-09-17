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
			newheight = obj.contentWindow.document.body.scrollHeight + 10;
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
	function createEqkDialog(lastModified) {
		var $body = isMobileApp()?$("div.container"):$("body");
		var html = '<div class="bangjae-eqk-dialog" tabindex="0">\n';
		html += '	<div class="bangjae-eqk-dialog-title" style="height:28px;"></div>\n';
		html += '	<a class="bangjae-eqk-dialog-close" href="#close" title="닫기">X</a>\n';
		html += '	<div class="bangjae-eqk-dialog-iframe">\n';
		html += '		<iframe src="' + getPrefix() +'wnuri-main/bangjae/bang-eqk.do" name="iframe_bangjae" id="iframe_bangjae" width="598px"  frameborder="0" marginwidth="0" marginheight="0" scrolling="auto" title="방재속보"></iframe>\n';
		html += '	</div>\n';
		html += '	<div class="bangjae-eqk-dialog-footer">\n';
		html += '		<span><input type="checkbox" style="-webkit-appearance:checkbox;"id="bangjae_do_not_open" data-last-modified="' + lastModified + '"/> <label for="bangjae_do_not_open">오늘 다시 열지 않기</label></span>';
		html += '		<a class="bangjae-eqk-dialog-footer-close" href="#close"><strong>닫기</strong></a>';
		html += '	</div>\n';
		html += '</div>';
		$body.append(html);
		$('.bangjae-eqk-dialog-close').on('click', function(e) {
			$('.bangjae-eqk-dialog').hide();
		});
		$('.bangjae-eqk-dialog-iframe iframe').on('load', function(e) {
			resizeFrame(this);
		});
		
		$('.bangjae-eqk-dialog-footer-close').on('click', function(e) {
			var $checkbox = $('#bangjae_do_not_open');
			var lastModified = $checkbox.attr('data-last-modified');
			if($checkbox[0].checked) {
				setCookie(lastModified,'nevermind', 1);
			}
			
			$('.bangjae-eqk-dialog').fadeOut();
		});
		$(document).ready(function(){
			$('.bangjae-eqk-dialog').first().trigger('focus');
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
		url: getPrefix() + '/wnuri-main/rest/bangjae/eqk-exists.do'
		, cache:false
		, type: 'post'
		, dataType: "json"
		, success:function(data) {
			var lastModified = "BJEQK";
			if(data.lastModified) {
				lastModified += data.lastModified;
			}
			if(data.bangjaeEqkExists) {
				if(getCookie(lastModified) != 'nevermind') {
					$.ajax({
						url: getPrefix() + '/wnuri-main/rest/bangjae/exists.do'
						, cache:false
						, type: 'post'
						, dataType: "json"
						, success:function(data) {
							var isBangjae = data.bangjaeExists;						
							createEqkDialog(lastModified);
							
							if(isBangjae) {
								if(mobilecheck()) {
									//$('.bangjae-eqk-dialog').attr("style", "top:128px !important;");
								}
								else {
									//$('.bangjae-eqk-dialog').attr("style", "left:67% !important;");
								}								
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