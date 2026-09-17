/**
 *
 * 메인 태풍 정보
 */
'use strict';
(function($, window, document){
	var VER="20220726",
	TyphoonInfo = function(wrapperId, viewType) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		var self = this;
		self.id = wrapperId;
		self.viewType = viewType?viewType:"";
		self.appConfigKey = "W_AC";
		self.state = {};
		self.config = {};
		self.readConfig();
		//self.updateData();
		self.addEventHandler();
	};
	TyphoonInfo.prototype = {
		refresh: function() {
			var self = this;
			if($('#' + self.id).attr('data-loaded') != '1') {
				self.updateData();
			}
		},
		readConfig: function() {
			var self = this;
			var loadedConfig = store.get(self.key);
			if(loadedConfig) {
				self.config = loadedConfig;
			}
			var loadedAppConfig = store.get(self.appConfigKey);
			if(loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
		},
		updateData: function() {
			var self = this;
			if($('#' + self.id).attr('data-loaded') == '1') return;
			showLoading(self.id, true, "light typhoon-info");
			self.requestTyphoonInfo().then(
				function(html) {
					self.updateView(html);
					var typhoonTabNumber = window.typhoonTabNumber || 1;
					var $tabTitles = $('#' + self.id).find('.typhoon-title > h4 > a');
					var tabLength = $tabTitles.length;
					if(typhoonTabNumber > tabLength) {
						typhoonTabNumber = tabLength;
					}
					$tabTitles.each(function(i, e) {
						if(i == typhoonTabNumber-1) {
							$(this).addClass('on');
						} else {
							$(this).removeClass('on');
						}
					});
					$('#' + self.id).find('.typhoon-item').eq(typhoonTabNumber-1).addClass('on');
					
					$('#' + self.id).attr('data-loaded', '1');
					$('#' + self.id).find('.typhoon-title > h4 > a').on('click', function(e) {
						e.preventDefault();
						var tabIndex = parseInt($(this).attr('data-item-id'));
						var typhoonTitle = $(this).parent().parent();
						
						if(!$(this).hasClass('on')) {
							typhoonTitle.find('> h4 > a').removeClass('on');
							typhoonTitle.find('> h4 > a').eq(tabIndex).addClass('on');
							$('#' + self.id).find('.typhoon-item').removeClass('on');
							$('#' + self.id).find('.typhoon-item').eq(tabIndex).addClass('on');
						}
					});
					
					function getKmaYoutube() {
						self.requestYoutubeInfo().then(
							function(data) {
								if(data) {
									for(var i in data) {
										var item = data[i];
										
										$('#' + self.id).find('.typ-ytb-frame').html('<iframe src="https://www.youtube.com/embed/' + item.id + '" width="100%" height="100%" frameborder="0" type="text/html" allowfullscreen></iframe>');
										$('#' + self.id).find('.typ-ytb-frame').show();
										break;
									}
								}
							},
							function(err) {
								console.log(err);
								$('#' + self.id).find('.typ-ytb-frame').hide();
							}
						);
					}
					self.requestTypYoutubeInfo().then(
							function(data) {
								if(data) {
									for(var i in data) {
										var item = data[i];
										
										$('#' + self.id).find('.typ-ytb-frame').html('<iframe src="https://www.youtube.com/embed/' + item.id + '" width="100%" height="100%" frameborder="0" type="text/html" allowfullscreen></iframe>');
										$('#' + self.id).find('.typ-ytb-frame').show();
										break;
									}
								} else {
									getKmaYoutube();	
								}	
							},function(err) {
								console.log(err);
								getKmaYoutube();
							}
					);
				},
				self.error()
			);
			
		},
		requestTyphoonInfo: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var data = {
					unit: unit,
					wf: "N",
			};
			var url = "";
			url = pathPrefix + "wnuri-typ2021/main-info.do"
			return $.ajax({
				url: url,
				data: data,
				dataType: "html"
			});
		},
		requestTypYoutubeInfo: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var url = "";
			url = pathPrefix + "repositary/sns/typ_youtube.json"
			return $.ajax({
				url: url,
				data: {},
				dataType: "json"
			});
		},
		requestYoutubeInfo: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var url = "";
			url = pathPrefix + "repositary/sns/yebtv_youtube.json"
			return $.ajax({
				url: url,
				data: {},
				dataType: "json"
			});
		},
		getPathPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		refreshForecast: function(bookmark) {
			var self = this;
			if(self.vshortShort) {
				self.vshortShort.refresh(bookmark);
			}
		},
		updateView: function(html) {
			var self = this;
			$('#' + self.id).html(html);
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading(self.id, false);
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
		}
	};
	
	if (typeof exports !== 'undefined') exports.TyphoonInfo = TyphoonInfo;
	else window.TyphoonInfo = TyphoonInfo;
})(jQuery, window, document);