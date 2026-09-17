/**
 *  태풍 - 모델예측(url: /typ/prediction)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	
	var currentSlide = 0;
	$(document).ready(function() {
		function selectImage() {
			$('#slide-images').find('a').each(function(idx) {
				if(idx == currentSlide) {
					$(this).parent().show();	
					$(this).focus();
				} else {
					$(this).parent().hide();
				}
			});
		}
		$('#slide-images').find('a').each(function(idx) {
			$(this).on('click', function(e) {
				e.preventDefault();
				currentSlide++;
				if(currentSlide >= 3) currentSlide = 0;
				selectImage();
			});
		});
	});
})(jQuery, window, document);
