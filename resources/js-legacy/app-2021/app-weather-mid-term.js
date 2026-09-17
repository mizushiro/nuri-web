/**
 *  날씨 - 중기예보(url: /weather/mid-term)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	$('a[data-graph="open-graph"]').click(function(e){
		e.preventDefault();
		var imageUrl = $(this).attr("href");
		var imageAlt = $(this).attr("data-alt");
		var $pops = $('[class*="modal-pop"][data-graph="open-graph"]');
		$pops.fadeIn().addClass('popcont-open');
		$('body').addClass("hidd");
		weatherUI.dimdOn();
		$('.pw-dimmed').fadeIn(500);
		var srcEle = this;
		$pops.find('button.pop-close').first().focus().on('click', function() {
			srcEle.focus();
		});
		$pops.find('.title').first().html(imageAlt + "의 최저/최고기온(℃)");
		$pops.find('.layer-pop-wrap').html('<img src="' + imageUrl + '" style="margin-top:20px;" alt="' + imageAlt + '"/>');
		$('.pw-dimmed').on('click',function(){
			$('.popcont-open').fadeOut(300).removeClass('.popcont-open');
			$('.pw-dimmed').fadeOut(300);
			$('body').removeClass("hidd");
			setTimeout(function(){
				weatherUI.dimdOff();
			});
		});
	});

})(jQuery, window, document);
	