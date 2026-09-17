/**
 * 바다특보
 */
'use strict';
(function($, window, document){
	var STNS=[
		{code: "KO", name: "전국"},
		{code: "KI", name: "경기/인천"},
		{code: "CN", name: "충남"},
		{code: "JB", name: "전북"},
		{code: "JN", name: "전남"},
		{code: "JJ", name: "제주"},
		{code: "KW", name: "경남/부산/울산"},
		{code: "KB", name: "경북"},
		{code: "GW", name: "강원"},
	], 
	MarineWarning = function(wrapperId) {
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
		self.state = {
				data: {
					area: "KO"
				}
		};
		self.appConfigKey = "W_AC";
		
		self.key = "W_SC";
		self.updateData();
		self.addEventHandler();
	};
	MarineWarning.prototype = {
		readConfig: function() {
			var self = this;
			var loadedAppConfig = store.get(self.appConfigKey);
			if(loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
		},
		refresh: function(bookmark) {
			var self = this;
			self.updateData();
		},
		updateData: function(area) {
			var self = this;
			showLoading(self.id, true, "light");
			self.requestRemote(area?area:self.state.data.area)
			.then(
				function(data) {
					self.state.data = Object.assign({}, data);
					self.updateView();
					showLoading(self.id, false, "light");
				},
				self.error()
			)	
		},
		getData: function(area) {
			var self = this;
			var prefix = self.getPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var data = {
				stn: area,
				seqId: self.state.data.seqId?self.state.data.seqId:"",
				unit: unit
			};
			
			return $.ajax({
				url: prefix + "wnuri-sfct/rest/warning/marine.do",
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
		requestRemote: function(area) {
			var self = this;
			return self.getData(area);	
		},
		updateView: function() {
			var self = this;
			var $wrapper = $('#' + self.id);
			var data = self.state.data;
			var areaName = "전국";
			if(data.stn == "KI") areaName = "경기/인천";
			else if(data.stn == "CN") areaName = "충남";
			else if(data.stn == "JB") areaName = "전북";
			else if(data.stn == "JN") areaName = "전남";
			else if(data.stn == "JJ") areaName = "제주";
			else if(data.stn == "KW") areaName = "경남/부산/울산";
			else if(data.stn == "KB") areaName = "경북";
			else if(data.stn == "GWI") areaName = "강원";
			
			$wrapper.find('#imgIssue').attr('src', self.getPrefix() + "repositary/xml/wrn/img/" + data.img).attr('alt', areaName + ' 지역에 발효중인 해상특보 지도');
			if(data.txt) {
				$wrapper.find('#txtIssue').html(data.txt.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
			} else {
				$wrapper.find('#txtIssue').html("-");
			}
			var tmText = moment(data.seqId.substring(0,10),'YYYYMMDDHH').format('MM[월] DD[일] HH[시 이후]');
			$wrapper.find('span.time').html(tmText);
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
			$wrapper.find('input[name="area"]').on('click', function(e) {
				self.updateData(this.value);
			});
			$wrapper.find('.inp-radio-wrap a.inp-area-btn').on('click', function(e) {
				e.preventDefault();
				$wrapper.find('.inp-radio-wrap').removeClass('on');
				var $r = $(this).parents(".inp-radio-wrap");
				$r.addClass('on');
				var area = $(this).attr('data-value');
				self.updateData(area);
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.MarineWarning = MarineWarning;
	else window.MarineWarning = MarineWarning;
})(jQuery, window, document);