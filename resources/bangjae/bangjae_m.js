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
	function createDialog(lastModified) {
		var $body = $("body");
		var html = '<div class="bangjae-dialog">\n';
		html += '	<div class="bangjae-dialog-title"><h2>방재 속보</h2></div>\n';
		html += '	<a class="bangjae-dialog-close">X</a>\n';
		html += '	<div class="bangjae-dialog-iframe">\n';
		html += '		<div id="panel_bangjae"></div>\n';
		html += '	<div/>\n';
		html += '	<div class="bangjae-dialog-footer">\n';
		html += '		<label for="bangjae_do_not_open"><input type="checkbox" id="bangjae_do_not_open" data-last-modified="' + lastModified + '"/> 오늘 다시 열지 않기</label>';
		html += '	</div>\n';
		html += '<div/>';
		$body.append(html);
		$('.bangjae-dialog-close').on('click', function(e) {
			$('.bangjae-dialog').hide();
		});
		$('#bangjae_do_not_open').on('click', function(e) {
			var lastModified = $(this).attr('data-last-modified');
			setCookie(lastModified,'nevermind', 1);
			$('.bangjae-dialog').fadeOut();
		});
	}
	function getPrefix() {
		if(window.appBase) {
			return window.appBase;
		} else {
			return "/";
		}
	}
	$.ajax({
		url: getPrefix() + '/wnuri-main/rest/bangjae/exists.do'
		, cache:false
		, type: 'post'
		, success:function(data) {
			var lastModified = "MBJ";
			
			if(data.lastModified) {
				lastModified += data.lastModified;
			}
			if(data.bangjaeExists) {
				if(getCookie(lastModified) != 'nevermind') {
					createDialog(lastModified);
					jQuery.ajax({
						url: getPrefix() +'wnuri-main/bangjae/bang.do'
						, cache: false
						, type: 'post'
						, dataType: 'html'
						, success:function(data) {
							
							data = data.replace("<style type='text/css'>", "<dummy>");
							data = data.replace("</style>", "</dummy>");
							jQuery('#panel_bangjae').html(data);
							jQuery('#panel_bangjae').find('img').each(function(idx){
								$(this).removeAttr('width');
								$(this).removeAttr('height');
								$(this).addClass('bang-img');
							});
						}
					});
				}
			}
		}
	});
})(jQuery, window, document);