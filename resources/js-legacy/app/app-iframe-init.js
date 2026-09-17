'use strict';
if(typeof jQuery === 'undefined') {
	alert('jQuery required!');
}

// common
function showLoading(id, show, clazz) {
	var $wrapper = $('#' + id);
	if(!clazz) clazz = "";
	var loading = '<div class="loading_wrap"><div class="lds-spinner ' + clazz + '"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
	if(show) {
		if($wrapper.has('.loading_wrap').length > 0) {
			$wrapper.find('.loading_wrap').show();
		} else {
			$wrapper.append(loading);
		}	
	} else {
		if($wrapper.has('.loading_wrap').length) {
			$wrapper.find('.loading_wrap').hide();
		}
	}
}

(function($, window, document){
	var GlobalEvent = $({});

	if (typeof exports !== 'undefined') exports.GlobalEvent = GlobalEvent;
	else window.GlobalEvent = GlobalEvent;
})(jQuery, window, document);



// link via button event
$('button[data-role="link-to"]').on('click', function(e) {
	var url = $(this).attr('data-link');
	if(!url) return;
	var target = $(this).attr('data-target');
	if(!target) {
		window.location.href = url;
	} else {
		window.open(url, target).focus();	
	}
});
$('button[data-role="popup-to"]').on('click', function(e) {
	var url = $(this).attr('data-link');
	if(!url) return;
	var target = $(this).attr('data-target');
	var width = $(this).attr('data-width');
	var height = $(this).attr('data-height');
	window.open(url,target+"",'width=' + width + 'px, height=' + height + 'px, scrollbars=no').focus();
});
$(document).ready(function(){	
	
});

(function() {
	
	weatherUI.movieChkToggle('.movi-toggle');

})();
