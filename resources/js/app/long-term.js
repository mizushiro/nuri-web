/**
 * panel - weather/long-term/month1, month3
 *
 * 중장기 전망
 */
'use strict';
(function($, window, document){
	var VER="20210121-1",
	LongTerm = function(wrapperId, type, isCmt) {
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
		self.isCmt = isCmt;
		self.type = type;
		self.id = wrapperId;
		self.state = {};
		self.config = {};
		self.updateData();
		self.addEventHandler();
	};
	LongTerm.prototype = {
		refresh: function() {
			var self = this;
			self.updateData();
		},
		updateData: function() {
			var self = this;
			showLoading('pdf-holder', true, "light");
			self.requestRemote()
			.then(
				function(data) {
					self.updateView(data);
					showLoading('pdf-holder', false);
				},
				self.error()
			)	
		},
		getData: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var $wrapper = $('#' + self.id);
			var stn = $wrapper.find('select[name="stn"]').val();
			var data = {
				kind: self.type,
				stn: stn
			};
			
			return $.ajax({
				url: pathPrefix + "wnuri-fct/rest/weather/long-term.do",
				data: data,
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
		updateView: function(data) {
			var self = this;
			if(!data.filename) {
				alert(self.type + "개월 전망 PDF 를 찾을 수 없습니다.");
				return;
			}
			var $wrapper = $('#' + self.id);
			var template = '';
			if(self.isCmt) {
				template = '<object width="100%" height="1475px" data="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{cmtfilename}}#toolbar=0&navpanes=0&scrollbar=1&view=fix&messages=0" type="application/pdf">';
				template += '<param name="src" value="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{cmtfilename}}#toolbar=0&navpanes=0&scrollbar=1&view=fix&messages=0" />';
				template += '<iframe src="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{cmtfilename}}#toolbar=0&navpanes=0&scrollbar=1&view=fix&messages=0" width="100%" height="100%" style="border:none;">브라우저가 PDF 보기를 지원하지 않습니다. 다운로드하셔서 보시기 바랍니다.'; 
				template += '<a href="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{cmtfilename}}">다운로드 PDF</a>';
				template += '</iframe>';
				template += '</object>';
			} else {
				template = '<object width="100%" height="1475px" data="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{filename}}#toolbar=0&navpanes=0&scrollbar=1&view=fix&messages=0" type="application/pdf">';
				template += '<param name="src" value="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{filename}}#toolbar=0&navpanes=0&scrollbar=1&view=fix&messages=0" />';
				template += '<iframe src="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{filename}}#toolbar=0&navpanes=0&scrollbar=1&view=fix&messages=0" width="100%" height="100%" style="border:none;">브라우저가 PDF 보기를 지원하지 않습니다. 다운로드하셔서 보시기 바랍니다.'; 
				template += '<a href="' + self.getPathPrefix() + 'repositary/xml/fct/mon/{{filename}}">다운로드 PDF</a>';
				template += '</iframe>';
				template += '</object>';
			}
			
			var html =  Mustache.render(template, data);
			$wrapper.find('.pdf-box').html(html);
			
			if(data.kind == '3' && data.stn == '108') {
				$wrapper.find('p.cmt-down').css('display', '');
			}
			else {
				$wrapper.find('p.cmt-down').css('display', 'none');
			}
			
			$wrapper.find('a.pdf-download').attr('href', self.getPathPrefix() + 'repositary/xml/fct/mon/' + data.filename);
			$wrapper.find('a.cmt-pdf-download').attr('href', self.getPathPrefix() + 'repositary/xml/fct/mon/' + data.cmtfilename);
			
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading('pdf-holder', false);
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			$wrapper.find('select[name="stn"]').on('change', function(e) {
				// 웹접근성 - 의도하지 않는 조작 방지
				//self.updateData();
			});
			$wrapper.find('button[data-role="data-select"]').on('click', function(e) {
				self.updateData();
			})
		}
	};
	
	if (typeof exports !== 'undefined') exports.LongTerm = LongTerm;
	else window.LongTerm = LongTerm;
})(jQuery, window, document);