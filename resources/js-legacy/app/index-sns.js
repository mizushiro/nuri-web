/**
 * panel - index SNS(블로그, 트위터, 페이스북, 유튜브
 *
 * 메인 페이지 SNS별 최근글 1개
 */
'use strict';
(function($, window, document){
	var BLOG_URL="repositary/sns/kma_naver_blog.json",
		YOUTUBE_URL="repositary/sns/kma_youtube.json",
		TWITTER_URL="repositary/sns/kma_twitter.json",
		FACEBOOK_URL="repositary/sns/kma_facebook.json",
	IndexSNS = function(wrapperId) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
//		if(typeof store === 'undefined') {
//			alert('store.js required!');
//		}
//		if(typeof Mustache === 'undefined') {
//			alert('mustache.js required!');
//		}
		
		var base = this;
		base.id = wrapperId;
		
		//base.updateData();
		base.addEventHandler();
	};
	IndexSNS.prototype = {
		refresh: function() {
			var base = this;
			base.updateData();
		},
		updateData: function() {
			var base = this;
			showLoading(base.id, true);
			base.requestBlog().then(
				function(data) {
					base.updateBlog(data);
					showLoading(base.id, false);
				},
				base.error()
			);
			base.requestTwitter().then(
					function(data) {
						base.updateTwitter(data);
						showLoading(base.id, false);
					},
					base.error()
				);
			base.requestFacebook().then(
					function(data) {
						base.updateFacebook(data);
						showLoading(base.id, false);
					},
					base.error()
				);
			base.requestYoutube().then(
					function(data) {
						base.updateYoutube(data);
						showLoading(base.id, false);
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
		requestBlog: function() {
			var base = this;
			return base.getData(BLOG_URL);	
		},
		requestTwitter: function() {
			var base = this;
			return base.getData(TWITTER_URL);	
		},
		requestYoutube: function() {
			var base = this;
			return base.getData(YOUTUBE_URL);	
		},
		requestFacebook: function() {
			var base = this;
			return base.getData(FACEBOOK_URL);	
		},
		updateBlog: function(data) {
			var base = this;
			var $wrapper = $('#' + base.id);
			
			var $holder = $wrapper.find('div[data-role="blog"]');
			for(var i = 0 ; i < data.length ; i++) {
				var item = data[i];
				if(item.thumbnail) {
					$holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" tabindex="-1" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
				} else {
					$.each($holder.find('div[data-role="thumbnail"]'), function() {
						$(this).remove();
					});
					$holder.find('.sns-item-flid').addClass('full-txt');
				}
				if(!item.title) {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
				} else {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');	
				}
				break;
			}
			
		},
		updateTwitter: function(data) {
			var base = this;
			var $wrapper = $('#' + base.id);
			
			var $holder = $wrapper.find('div[data-role="twitter"]');
			for(var i = 0 ; i < data.length ; i++) {
				var item = data[i];
				if(item.thumbnail) {
					$holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" tabindex="-1" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
				} else {
					$.each($holder.find('div[data-role="thumbnail"]'), function() {
						$(this).remove();
					});
					$holder.find('.sns-item-flid').addClass('full-txt');
				}
				if(!item.title) {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
				} else {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');	
				}
				
				//console.log(item.summary.replace('\n','<br/>'))
				break;
			}
			
		},
		updateYoutube: function(data) {
			var base = this;
			var $wrapper = $('#' + base.id);
			
			var $holder = $wrapper.find('div[data-role="youtube"]');
			for(var i = 0 ; i < data.length ; i++) {
				var item = data[i];
				if(item.thumbnail) {
					$holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" tabindex="-1" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
				} else {
					$.each($holder.find('div[data-role="thumbnail"]'), function() {
						$(this).remove();
					});
					$holder.find('.sns-item-flid').addClass('full-txt');
				}
				if(!item.title) {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
				} else {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');	
				}
				break;
			}
		},
		updateFacebook: function(data) {
			var base = this;
			var $wrapper = $('#' + base.id);
			
			var $holder = $wrapper.find('div[data-role="facebook"]');
			for(var i = 0 ; i < data.length ; i++) {
				var item = data[i];
				item.link = "https://www.facebook.com/kmaskylove";
				if(item.thumbnail) {
					$holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" tabindex="-1" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
					
				} else {
					$.each($holder.find('div[data-role="thumbnail"]'), function() {
						$(this).remove();
					});
					$holder.find('.sns-item-flid').addClass('full-txt');
				}
				
				if(!item.title) {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
				} else {
					$holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');	
				}
				break;
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
			// save, cancel
			var $wrapper = $('#' + base.id);
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.IndexSNS = IndexSNS;
	else window.IndexSNS = IndexSNS;
})(jQuery, window, document);