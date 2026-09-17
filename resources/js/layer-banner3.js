/**
 * 2021 날씨누리 0303 오픈 레이어 배너.
 * + 바로가기 버튼.
 */
'use strict';
(function($, window, document){
	var LayerBanner3 = function(id, bannerImageFileName, bannerText, linkText, linkUrl) {
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
		this.linkUrl = linkUrl ? linkUrl : 'https://www.weather.go.kr';
		this.linkText = linkText ? linkText : '샘플 링크';
		this.key = "__" + this.id + "__";
		this.$wrapper = null;
		this.init();
	};
	LayerBanner3.prototype = {
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
			self.$wrapper.html('<div class="laba-bg"></div><div class="laba-body"><img class="laba-body-image" src="' + window.appBase + '/resources/image/banner/' + self.bannerImageFileName + '" alt="' + self.bannerText + '"/>'
				+ '<div class="laba-link"><a class="pop-open-banner laba-close-self"  data-pop-name="open-banner-pop" href="#">' + self.linkText + '</a></div></div>' 
				+ '<div class="laba-footer"><a href="#" class="laba-check"><span>다시 보지 않기</span></a><a href="#" class="laba-close-text">닫기</a></div>');
			window.setTimeout(function() {
				self.$wrapper.addClass('on');
			},10);
			weatherUI.popOpen('.pop-open-banner');
			self.$wrapper.find('.laba-close-self').on('click', function(e) {
				e.preventDefault();
				self.closeBanner();
			});
		},
		createEvents: function() {
			var self = this;
			self.$wrapper.on('click', '.laba-bg', function(e) {
				e.preventDefault();
				self.closeBanner();
			});
			self.$wrapper.on('click', '.laba-check', function(e) {
				e.preventDefault();
				$(this).toggleClass('on');
			});
			self.$wrapper.on('click', '.laba-close-text', function(e) {
				e.preventDefault();
				if(self.$wrapper.find('.laba-check').hasClass('on')) {
					if(self.config) {
					self.config.closeUntil = (new Date()).getTime() + 365*24*60*60*1000;
					} else {
						self.config = {
							enabled: true,
							closeUntil: (new Date()).getTime() + 365*24*60*60*1000
						};
					}
					store.set(self.key, self.config);	
				}				
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
	if (typeof exports !== 'undefined') exports.LayerBanner3 = LayerBanner3;
	else window.LayerBanner3 = LayerBanner3;
})(jQuery, window, document);
	