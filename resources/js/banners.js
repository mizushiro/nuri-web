'use strict';

(function($, window, document){
	var BANNERS_URL="repositary/config/banners.json",
	BannerDrawer = function(wrapperId) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		
		var base = this;
		base.id = wrapperId;
		
    // if (window.innerWidth < 768) {
	// 		var $wrapper = $('#' + base.id);
    //   $wrapper.find('.link-field').removeClass('!aspect-[4/3]').addClass('gap-2');
    //   $wrapper.appendTo('#index-banners-mobile');
    // }
		base.updateData();
		// base.addEventHandler();
	};
	BannerDrawer.prototype = {
		refresh: function() {
			var base = this;
			base.updateData();
		},
		updateData: function() {
			var base = this;
			base.requestBanners().then(
				function(data) {
					base.updateBanners(data);
				},
				base.error()
			);
		},
		getData: function(url) {
			var prefix = this.getPrefix();
			var data = {
			};
			
			return $.ajax({
				url: prefix + url,
				data: data,
				dataType: "json"
			});
		},
		getPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		requestBanners: function() {
			var base = this;
			return base.getData(BANNERS_URL);	
		},
		updateBanners: function(data) {
			var base = this;
			var $wrapper = $('#' + base.id);
			var $holder = $wrapper;

      for(var i = 0 ; i < data.length ; i++) {
				var item = data[i];
				if(!item.image) {
          item.image = '';
        }
				if(!item.title) {
          item.title = '';
				}
        $holder.append('<div class="list-banner rounded"><a href="' + item.link + '" class="link" target="_blank" title="새창열림"><img class="block w-full border" src="' + item.thumbnail + '" alt="' + item.title + '"/></a></div>');
			}
			
		},
		error: function() {
			var base = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading(base.id, false);
			};
		},
		addEventHandler: function() {
			var base = this;
			var $wrapper = $('#' + base.id);
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.BannerDrawer = BannerDrawer;
	else window.BannerDrawer = BannerDrawer;
})(jQuery, window, document);