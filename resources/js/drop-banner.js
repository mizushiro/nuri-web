/**
 * 상단 드롭바 배너.
 *
 */
'use strict';
(function($, window, document){
	var DropBanner = function(id) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		this.id = id;
		this.key = "__" + this.id + "__";
		this.$wrapper = null;
		this.$layer = null;
		this.init();
	};
	DropBanner.prototype = {
		init: function() {
			if(window.innerWidth > 768 && this.shouldCreate()) {
				this.createMarkup();
				this.createEvents();
			}
		},
		shouldCreate: function() {
			var self = this;
			var config = store.get(self.key);
			if(!config) {
				config = {
					enabled: true,
					closeUntil: null
				};
			}
			self.config = config;
			var now = new Date();
			return self.config.enabled  
				&& (self.config.closeUntil == null || self.config.closeUntil < now.getTime());
		},
		createMarkup: function() {
			var self = this;
			self.$wrapper = $('<div>').addClass('ba-wrap').attr('id', self.id).prependTo($('header'));
			self.$wrapper.html('<div class="ba-body"><div class="ba-body-text"><a href="#" title="새창열림" target="_blank"><em>날씨누리 메뉴 개편 관련 안내</em></a></div><a href="javascript:void(0);" class="ba-close"><span>오늘은 <span>그만보기</span></span></a>');
			setTimeout(function() {
				self.$wrapper.addClass('on');
			}, 1000);

			self.$layer = $('<div>').addClass('overlay-layer').prependTo($('body'));
			self.$layer.html('<div class="popup-layer"><img src="/w/resources/images/content_drop_banner.png"></div>');
		},
		createEvents: function() {
			var self = this;
			self.$wrapper.on('click', '.ba-body-text a', function(e) {
				e.preventDefault();
				self.$layer.addClass('on');
			});
			self.$layer.on('click', function(e) {
				if (e.target !== this && !$(e.target).hasClass('popup-layer')) return;
				self.$layer.removeClass('on');

			});
			self.$wrapper.on('click', '.ba-close', function(e) {
				e.preventDefault();
				if(self.config) {
					self.config.closeUntil = (new Date()).getTime() + 1*24*60*60*1000;
				} else {
					self.config = {
						enabled: true,
						closeUntil: (new Date()).getTime() + 1*24*60*60*1000
					};
				}
				store.set(self.key, self.config);
				self.$wrapper.removeClass('on');
				window.setTimeout(function() {
					self.$wrapper.remove();
				},330);
			});
		}
	};
	if (typeof exports !== 'undefined') exports.DropBanner = DropBanner;
	else window.DropBanner = DropBanner;
})(jQuery, window, document);
	