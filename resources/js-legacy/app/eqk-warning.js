/**
 *
 * 메인 지진정보(속보)
 */
'use strict';
(function($, window, document){
	var VER="20191205-1",
	EqkWarning = function(wrapperId, viewType) {
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
		self.state = {};
		self.config = {};
		self.updateData();
		self.addEventHandler();
	};
	EqkWarning.prototype = {
		refresh: function() {
			var self = this;
			self.updateData();
		},
		updateData: function() {
			var self = this;
			self.requestEqkExists().then(
				function(eqk) {
					//console.log(eqk);
					if(eqk && eqk.eqkExists) {
						self.requestRemote()
						.then(
							function(html) {
								self.updateView(html);
							},
							self.error()
						)	
					}
				},
				self.error()
			);
		},
		getData: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var data = {
				
			};
			var url = "";
			url = pathPrefix + "wnuri-eqk-vol/eqk/warning.do"
			return $.ajax({
				url: url,
				data: data,
				dataType: "html"
			});
		},
		requestEqkExists: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var data = {
				
			};
			var url = "";
			url = pathPrefix + "wnuri-eqk-vol/rest/eqk/alert-exists.do"
			return $.ajax({
				url: url,
				data: data,
				type: 'post',
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
		requestRemote: function(code, unit) {
			var self = this;
			return self.getData(code, unit);	
		},
		updateView: function(html) {
			var self = this;
			$('.maintab').find('button').removeClass('on');
			$('.maintab').prepend('<div class="tab-btn04"><button class="on" type="button" data-main="4">지진</button></div>');
			weatherUI.mainTab('.maintab', '.maintab-wrap');
			var $wrapper = $('<div class="tab-cont04 on" data-main="4" id="index-eqk-warning"></div>');
			$wrapper.html(html);
			$('.maintab-wrap').slick('slickAdd',$wrapper, 0, true);
			$('.maintab-wrap').slick('slickGoTo', 0, false);
			if(typeof mainSlick != "undefined" && mainSlick != null) {
				window.setTimeout(function() {
					mainSlick.find('.slick-slide').height('auto');
					mainSlick.find('.slick-list').height('auto');
					mainSlick.slick('setOption', null, null, true);
				},0);
			}
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
	
	if (typeof exports !== 'undefined') exports.EqkWarning = EqkWarning;
	else window.EqkWarning = EqkWarning;
})(jQuery, window, document);