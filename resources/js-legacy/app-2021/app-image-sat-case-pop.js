/**
 *  영상 - 위성 - 사례영상 - 팝업 (url: /image/sat/sat-case-pop01.do)
 */
'use strict';
(function($, window, document){
	var delay = 500;
	var start_frame = 0;
	var play_frame = 0;
	var end_frame = 0;
	var slideshow_playing = false;
	var running = false;
	function init_slideshow() {
		var lis = $('#slide-images').find('li');
		end_frame = (lis.length==0)? 0 : (lis.length -1);
		play_frame = end_frame;
	}
	function fadeInOut(frame, start_frame, end_frame, delay, lis) {
		return (function() {
			if(!slideshow_playing) return;
			if(running) return;
			running = true;
			var from = frame;
			if (frame == end_frame) { frame = start_frame; } else { frame++; }
			var to = frame;
			play_frame = transition(from, to);
			setTimeout(fadeInOut(frame, start_frame, end_frame, delay), delay + 850);
		});
	}

	function transition(from, to) {
		var lis = $('#slide-images').find('li');
		lis.eq(from).hide();
		lis.eq(to).show();
		running = false;

		$('#observation_select')[0].selectedIndex = to;
		return to;
	}
	
	function play_slideshow() {
		if(slideshow_playing) return;
		slideshow_playing = true;
		setTimeout(fadeInOut(play_frame,start_frame,end_frame, delay),delay);
		return;
	}
	
	function stop_slideshow() {
		slideshow_playing = false;
		return;
	}
	
	function init_body() {
		init_slideshow();
		$('#check_01').on('click', function(e) {
			var o = this;
			if(o.checked) {
				play_slideshow();
			} else {
				stop_slideshow();
			}
		});
	}
	$(document).ready(init_body);

})(jQuery, window, document);
