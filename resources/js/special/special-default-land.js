'use strict';
(function($){
	/* 지역 필터 */
	function createForecastAreaFilter() {
		function closeBox() {
			createDimm().fadeOut(200, function() {
				$(this).remove();
			});
			$('.sp-land-forecast-filter-con').fadeOut(200);
		}
		
		function createEvents() {
			$('.sp-land-forecast-filter-title a').on('click', function(e) {
				e.preventDefault();
				createDimm().fadeIn(200).on('click', function(e) { closeBox(); });
				var $box = $('.sp-land-forecast-filter-con').first();
				$box.fadeIn(200);
			});
			
			$('.sp-land-forecast-filter-con-close').on('click', function(e) { e.preventDefault(); closeBox(); });
			
			$('.sp-land-forecast-filter-con ul li a').on('click', function(e) {
				e.preventDefault();
				var pageNo = $(this).attr('data-page');
				var showArea = !$(this).hasClass('checked');
				if(showArea) {
					$(this).addClass('checked');
					filterArea(pageNo, true);
				} else {
					$(this).removeClass('checked');
					filterArea(pageNo, false);
				}
				//closeBox();
			});	
		}
		function filterArea(pageNo, show) {
			$.each($('.table-col-append'), function(idx, ele) {
				if(pageNo == idx + 1) {
					if(show) {
						window.setTimeout(function() { $(ele).show(); refreshSticky(); } , 0);
					} else {
						window.setTimeout(function() { $(ele).hide(); refreshSticky(); } , 0);
					}	
				}
			});
		}
		createEvents();
	}
	var $stickyItem = $('.table-col-sticky').first();
	var stickyMenuTop = $stickyItem.offset().top;
	var stickyMenuHeight = $stickyItem.height();
	var overScrollHeight = $('.over-scroll').first().height();
	function refreshSticky() {
		stickyMenuTop = $stickyItem.offset().top;
		stickyMenuHeight = $stickyItem.height();
		overScrollHeight = $('.over-scroll').first().height();
	}
	function init() {
		/*
		$(window).on('scroll', function(e) {
			var scrollTop = $(this).scrollTop();
			if(stickyMenuTop < scrollTop) {
				if(stickyMenuTop + overScrollHeight - (2*stickyMenuHeight) < scrollTop) {
					if($stickyItem.hasClass('on')) {
						$stickyItem .removeClass('on');
						$stickyItem.parent().css({ paddingTop: 0});
					}
				} else {
					if(!$stickyItem.hasClass('on')) {
						$stickyItem .addClass('on');
						$stickyItem.parent().css({ paddingTop: stickyMenuHeight});
					}
				}
			} else {
				if($stickyItem.hasClass('on')) {
					$stickyItem .removeClass('on');
					$stickyItem.parent().css({ paddingTop: 0});
				}
				
			}
		});
		*/	
		createForecastAreaFilter();
	}
	
	/** init page */
	init();
})(jQuery);
