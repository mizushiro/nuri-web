/**
 *  날씨 - 기상특보 - 기상특보(url: /weather/warning/list)
 */
'use strict';
(function($, window, document){
	var vmap = null;
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		window.location.reload();
	});
	
	$('[data-form-role="submit"]').on('click', function(e) {
		e.preventDefault();
		var $f = $('#' + $(this).attr('data-form-id')).trigger('submit');
	});
	
	$('#select-date').datepicker({minDate: '-1m', maxDate: 1});
})(jQuery, window, document);
