/**
 *  소식.지식 - 지식 - 강수 강도별 체감 영상(url: /community/knowledge/prec-video)
 */
'use strict';
(function($, window, document){
    
    $('.ground a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on').html('<span>지면상태 체감 영상 닫기</span>');
			$('.ground-cont').css({height:'auto', overflow:'auto'});
			$('.ground-cont').show();
		} else {
			// close
			$(this).removeClass('on').html('<span>지면상태 체감 영상 보기</span>');
			$('.ground-cont').hide();
		}
	});
	
	$('.window a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on').html('<span>차량 앞유리 체감 영상 닫기</span>');
			$('.window-cont').css({height:'auto', overflow:'auto'});
			$('.window-cont').show();
		} else {
			// close
			$(this).removeClass('on').html('<span>차량 앞유리 체감 영상 보기</span>');
			$('.window-cont').hide();
		}
	});
	
	$('.umb a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on').html('<span>우산 강수 체감 영상 닫기</span>');
			$('.umb-cont').css({height:'auto', overflow:'auto'});
			$('.umb-cont').show();
		} else {
			// close
			$(this).removeClass('on').html('<span>우산 강수 체감 영상 보기</span>');
			$('.umb-cont').hide();
		}
	});
    
})(jQuery, window, document);