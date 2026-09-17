/**
 * 레이어 배너.
 *
 */
'use strict';
(function($, window, document){
	var LayerBanner = function(id, bannerImageFileName, bannerText) {
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
		this.bannerImageFileName = bannerImageFileName ? bannerImageFileName : 'sample_banner1.png';
		this.bannerText = bannerText ? bannerText : '샘플 배너';
		this.key = "__" + this.id + "__";
		this.$wrapper = null;
		this.init();
	};
	LayerBanner.prototype = {
		init: function() {
			if(this.shouldCreate()) {
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
			self.$wrapper = $('<div>').addClass('laba-wrap').attr('id', self.id).prependTo($('body'));
			self.$wrapper.html('<div class="laba-bg"></div><div class="laba-body"><img class="laba-body-image" src="' + window.appBase + '/resources/image/banner/' + self.bannerImageFileName + '" alt="' + self.bannerText + '"/></div><div class="laba-footer"><a href="#" class="laba-close"><span>오늘은 <span>그만보기</span></span></a></div>');
			window.setTimeout(function() {
				self.$wrapper.addClass('on');
			},10);
		},
		createEvents: function() {
			var self = this;
			self.$wrapper.on('click', '.laba-bg', function(e) {
				e.preventDefault();
				self.closeBanner();
			});
			self.$wrapper.on('click', '.laba-close', function(e) {
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
				self.closeBanner();
			});
		},
		closeBanner: function() {
			var self = this;
			self.$wrapper.removeClass('on');
			window.setTimeout(function() {
				self.$wrapper.remove();
			},330);
		}
	};
	if (typeof exports !== 'undefined') exports.LayerBanner = LayerBanner;
	else window.LayerBanner = LayerBanner;
})(jQuery, window, document);
	