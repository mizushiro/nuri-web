/**
 *  관측.기후 - 육상 - 과거관측(url: /obs-climate/land/past-obs/)
 */
'use strict';
(function($, window, document){
    
    $('.obs-comm-btn a[data-map-mode-action="open"]').on('click', function(e) {
		e.preventDefault();
		var isClosed = !$(this).hasClass('on');
		if(isClosed) {
			// open
			$(this).addClass('on');
			$('.obs-comm-cont').css({height:'auto', overflow:'auto'});
		} else {
			// close
			$(this).removeClass('on');
			$('.obs-comm-cont').css({height:'0px', overflow:'hidden'});
		}
	});
    
})(jQuery, window, document);
