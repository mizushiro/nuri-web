/**
 * panel - /eqk-vol/recent-eqk/domestic
 *
 * 최근 지진 통보문
 */
'use strict';
(function($, window, document){
	var VER="20191205-1",
	EqkReport = function(wrapperId) {
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
		self.state = {};
		self.config = {};
		self.updateEqkList();
		self.updateData();
		self.updateNotice();
		self.addEventHandler();
	};
	EqkReport.prototype = {
		refresh: function() {
			var self = this;
			self.updateData();
		},
		updateEqkList: function() {
			var self = this;
			showLoading(self.id, true, "light");
			self.requestRemoteEqkList().then(
				function(list) {
					self.updateEqkListView(list);
					self.updateData();
				},
				self.error()
			);	
		},
		updateNotice: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			$.ajax({
				url: pathPrefix + "wnuri-eqk-vol/eqk/eqk-micro.do",
				dataType: "html"
			}).then(function(html) {
				$('#eqk-micro').html(html);
			}, self.error());
			
			$.ajax({
				url: pathPrefix + "wnuri-eqk-vol/eqk/eqk-912.do",
				dataType: "html"
			}).then(function(html) {
					$('#eqk-912').html(html);
			}, self.error());
		},
		updateData: function() {
			var self = this;
			self.requestRemote()
			.then(
				function(data) {
					self.updateView(data);
					showLoading(self.id, false, "light");
				},
				self.error()
			);
		},
		getData: function(eqkType, eqk) {
			var pathPrefix = this.getPathPrefix();
			var data = {
				eqkType: eqkType,
				eqk: eqk
			};
			
			return $.ajax({
				url: pathPrefix + "wnuri-eqk-vol/eqk/report.do",
				data: data,
				dataType: "html"
			});
		},
		getEqkList: function(eqkType) {
			var pathPrefix = this.getPathPrefix();
			var data = {
				eqkType: eqkType
			};
			
			return $.ajax({
				url: pathPrefix + "wnuri-eqk-vol/rest/eqk/list.do",
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
		requestRemote: function() {
			var self = this;
			var $wrapper = $('#' + self.id);
			var eqkType = $wrapper.find('select[name="eqkType"]').val();
			var eqk = $wrapper.find('select[name="eqk"]').val();
			return self.getData(eqkType, eqk);	
		},
		requestRemoteEqkList: function() {
			var self = this;
			var $wrapper = $('#' + self.id);
			var eqkType = $wrapper.find('select[name="eqkType"]').val();
			return self.getEqkList(eqkType);
		},
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			$wrapper.find('div[data-role="eqk-info-holder"]').html(html);
		},
		updateEqkListView: function(list) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var $sel = $wrapper.find('select[name="eqk"]');
			var template = '{{#data}}<option value="{{data}}">{{titleText}}</option>{{/data}}';
			var html =  Mustache.render(template, {data: list});
			//$sel.html('<option value="">선택</option>' + html);
			$sel.html(html);
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading(self.id, false, "light");
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			$wrapper.find('select[name="eqkType"]').on('change', function(e) {
				//self.updateEqkList();
			});
			$wrapper.find('select[name="eqk"]').on('change', function(e) {
				//self.updateData();
			});
			
			$wrapper.find('button[data-role="eqk-type-select"]').on('click', function(e) {
				self.updateEqkList();
			});
			
			$wrapper.find('button[data-role="eqk-select"]').on('click', function(e) {
				self.updateData();
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.EqkReport = EqkReport;
	else window.EqkReport = EqkReport;
})(jQuery, window, document);