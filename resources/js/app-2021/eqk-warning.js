/**
 *
 * 리뉴메인 지진정보(속보)
 */
'use strict';
(function($, window, document){
	var VER="20201205-1",
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
			var $tabs = $('.cmp-main-tabs');
			$tabs.addClass('eqk-tab-enabled');
			var $newTab = $('<div class="tab-item">');
			$newTab.append('<h2 class="tab-head eqk"><a href="#">지진</a></h2> <div class="tab-content" id="' + self.id + '">' + html + '</div>').appendTo($('.cmp-main-tabs'));
			var $tabsOn = $('.cmp-main-tabs > .tab-item.on');
			self.alignTabs();
			window.setTimeout(function() {
				$tabsOn.removeClass('on');
				$newTab.addClass('on');
				},999);			
			
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
		},
		alignTabs: function() {
			var leftPx = 0;
			$('#content-body').find('.tab-item').each(function(){
				var $th = $(this).find('> .tab-head');
				$th.css('left', leftPx + 'px');
				leftPx += $th.width();
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.EqkWarning = EqkWarning;
	else window.EqkWarning = EqkWarning;
})(jQuery, window, document);