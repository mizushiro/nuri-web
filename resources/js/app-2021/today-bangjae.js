/**
 * panel - /index.do
 *
 * 신규 방재창 상단 탭 버튼
 */
'use strict';
(function($, window, document){
	var VER="20240821",
	TodayBangjae = function(wrapperId) {
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
		self.key = "W_DC";
		self.state = {};
		self.config = {};
		self.readConfig();
		self.updateData();
		self.addEventHandler();
	};
	TodayBangjae.prototype = {
		refresh: function() {
			var self = this;
			self.updateData();
		},
		readConfig: function() {
			var loadedConfig = store.get(this.key);
			if(loadedConfig) {
				this.config = loadedConfig;
			}
		},
		updateData: function() {
			var self = this;
			//showLoading(self.id, true, "light");
			
			self.getBangjaeExists()
				.then(
					function(data) {
						var lastTmFc = "";
						var bngEx = data.bangjaeExists;
						if(data.lastTmFc) {
							lastTmFc = data.lastTmFc;
						}
						
						self.requestRemote(bngEx)
							.then(
								function(data) {
									self.updateView(data);
									var $checkbox = $('#bj_do_not_open');
									$checkbox.attr('data-last-tmfc',lastTmFc);
									showLoading(self.id, false);
								},
								self.error()
							);					
					},
					self.error()
				);
		},
		getData: function(bngEx, unit) {
			var pathPrefix = this.getPathPrefix();
			var data = {
				bngEx: bngEx,
				unit: unit
			};
			return $.ajax({
				url: pathPrefix + "wnuri-main/bangjae/bang-xml.do",
				data: data,
				dataType: "html"
			});
		},
		getBangjaeExists: function() {
			var pathPrefix = this.getPathPrefix();
			var data = {
				
			};

			return $.ajax({
				url: pathPrefix + "wnuri-main/rest/bangjae/bangjae-xml-exists.do",
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
		requestRemote: function(bngEx, unit) {
			var self = this;
			return self.getData(bngEx, unit);	
		},
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var key = "KMA_BJ";
			$wrapper.html(html);
			var $btn = $('#' + self.id + ' .accordion-tit');
			var $closeBtn = $('#' + self.id + ' .close');	
			$btn.each(function(){
				if($(this).hasClass('on')){
					$(this).attr("title","펼쳐짐");
				}else{
					$(this).attr("title","접힘");
					
					// 방재속보 버튼에 new 표시 삭제
					//$('#new').css('display','none');
				}
			});
			$btn.unbind('click');					
			$btn.on('click',function(e){
				var _this = $(this);		
				var $checkbox = $('#bj_do_not_open');				
				var lastTmFc = $checkbox.attr('data-last-tmfc');		
				if(!$(this).hasClass('on')){
					$(this).parents('.accordion-wrap').find('.accordion-tit').removeClass('on').next('.accordion-con').stop(true).slideUp(100);
					$(this).addClass('on').next('.accordion-con').stop(true).slideDown(100, function() { 
						var warnHeight = _this.next('.accordion-con').height() + 10;
						_this.parents('.cmp-main-tabs').css('min-height', warnHeight + 'px');
					});
					$(this).attr("title","펼쳐짐").parent().addClass('on');
				}else{
					$(this).removeClass('on').next('.accordion-con').stop(true).slideUp(100, function() {
						_this.parents('.cmp-main-tabs').css('min-height', 'auto');	
					});
					$(this).attr("title","접힘").parent().removeClass('on');
					
					// 방재속보 버튼에 new 표시 삭제
					//if($('#new').css("display") == "block") {
					//	$('#new').css("display", "none");
					//	setCookie(key, lastTmFc, 1);
					//}					
				};
			});
			weatherUI.tab('#' + self.id + ' .tab-wrap01', '#' + self.id + ' .tab-cont-wrap01');
			
			$closeBtn.on('click', function(e) {
				e.preventDefault();
				var $checkbox = $('#bj_do_not_open');
				var lastTmFc = $checkbox.attr('data-last-tmfc');
				if($btn.hasClass('on')){
					$btn.removeClass('on').next('.accordion-con').stop(true).slideUp(100, function() {
						$btn.parents('.cmp-main-tabs').css('min-height', 'auto');	
					});
					$btn.attr("title","접힘").parent().removeClass('on');
					
					// 방재속보 버튼에 new 표시 삭제
					//if($('#new').css("display") == "block") {
					//	$('#new').css("display", "none");
					//	setCookie(key, lastTmFc, 1);
					//}
				}
			});				
			
			$('#bj_do_not_open').on('click', function(e) {
				var $checkbox = $('#bj_do_not_open');
				var lastTmFc = $checkbox.attr('data-last-tmfc');
				if($checkbox[0].checked) {
					setCookie(key, lastTmFc, 1);
				}
				
				if($btn.hasClass('on')){
					$btn.removeClass('on').next('.accordion-con').stop(true).slideUp(100, function() {
						$btn.parents('.cmp-main-tabs').css('min-height', 'auto');	
					});
					$btn.attr("title","접힘").parent().removeClass('on');
					
					// 방재속보 버튼에 new 표시 삭제
					//$('#new').css('display','none');
				}
			});			
			
			$(document).ready(function(){
				var $checkbox = $('#bj_do_not_open');
				var key = "KMA_BJ";
				var lastTmFc = $checkbox.attr('data-last-tmfc');
				var sublastTmFc = "";
				if(lastTmFc) {
					sublastTmFc = lastTmFc.substring(0,8);
				}
				var resCookie = getCookie(key);
				
				if(resCookie) {
					if(resCookie != lastTmFc) {
						// 방재속보 버튼에 new 표시
						// $('#new').css('display','block');
					}
				}
				
				if(resCookie.substring(0,8) != sublastTmFc) {
					$btn.first().trigger('click');
				}	
			});
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
			var $wrapper = $('#' + self.id);
			
			$wrapper.on('click','.accordion-tit', function(){
				var _this = this;
				window.setTimeout(function() {
					var warnHeight = $wrapper.find('.accordion-con').height();
					if($(_this).hasClass('on')) {
						$('.cmp-main-tabs').css('min-height', warnHeight + 'px');
					} else {
						$('.cmp-main-tabs').css('min-height', 'auto');
					}
				},0);
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.TodayBangjae = TodayBangjae;
	else window.TodayBangjae = TodayBangjae;
	
	function getCookie( name ) {
		var nc = name + "="; var x = 0; var eoc = "";
		while ( x <= document.cookie.length ) {
			var y = (x+nc.length);
			if ( document.cookie.substring( x, y ) == nc ) {
				if ( (eoc=document.cookie.indexOf( ";", y )) == -1 )
					eoc = document.cookie.length;
				return unescape(document.cookie.substring( y, eoc ));
			}
			x = document.cookie.indexOf( " ", x ) + 1;
			if ( x == 0 ) break;
		}
		return "";
	}

	function setCookie( name, value, eds ){
		var td = new Date();
		td.setTime( td.getTime() + eds*3600*24*1000 );
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + td.toGMTString() +";";
	}
})(jQuery, window, document);