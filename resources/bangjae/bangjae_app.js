(function($, window, document){
	function getValue( name ) {
		var valueObj = store.get(name);
		var cur = (new Date()).getTime();
		if(valueObj && valueObj.until) {
			if(cur >= valueObj.until) {
				return "";
			} else {
				return valueObj.value;
			}
		} else {
			return "";
		}
	}
	function setValue( name, value, eds ){
		var td = new Date();
		td.setTime( td.getTime() + eds*3600*24*1000 );
		store.set(name, { value: value, until: td.getTime() });
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
		html += '		<iframe src="' + getPrefix() +'wnuri-main/bangjae/bang.do" name="iframe_bangjae" id="iframe_bangjae" width="598px"  frameborder="0" marginwidth="0" marginheight="0" scrolling="auto" title="방재속보"></iframe>\n';
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
				setValue(lastModified,'nevermind', 1);
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
				if(getValue(lastModified) != 'nevermind') {
					createDialog(lastModified);
				}
			}
		}
		, error: function(data) {
			if(window.console) window.console.log(data);
		}
	});
})(jQuery, window, document);