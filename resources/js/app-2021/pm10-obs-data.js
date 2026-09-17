/**
 * 황사 관측자료.
 */
'use strict';
(function($, window, document){
	var VER="0.1", 
	Pm10ObsData = function(wrapperId) {
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
			data: null
		};
		self.updateData();
		self.addEventHandler();
	};
	
	Pm10ObsData.prototype = {
		refresh: function(bookmark) {
			var self = this;
			self.updateData();
		},
		updateData: function() {
			var self = this;
			showLoading("pm10-map", true, "light");
			self.getPm10All()
				.then(
					function(data) {
						self.updateView(data);
						showLoading("pm10-map", false, "light");
					},
					self.error()
				);
		},
		getPm10All: function() {
			var self = this;
			var prefix = self.getPrefix();
			var data={};
			return $.ajax({
				url: prefix + "wnuri-fct/rest/pm10/all.do",
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
		updateView: function(data) {
			var self = this;
			if(!data) return;
			var $wrapper = $('#' + self.id);
			var $mtt = $wrapper.find('.mtt');
			var $tbody = $wrapper.find('tbody[data-role="data-holder-body"]');
			
			$wrapper.find('.date-right').html('<p>[ PM10 : 1시간 평균값 ] ' + data.nowDate + ' 현재</p>');
			$mtt.empty();
			
			for(var stnId in data.data) {
				var item = data.data[stnId];
				var $li = $('<li>').addClass('pm10_' + item.stnId)
					.html('<a>' + item.stnKo.replace("(감)","") + '</a><span class="val">' + item.pm10Avg + '</span>');
				if(item.icon) {
					$li.append('<span class="icon"><img src="' + window.appBase + 'resources/icon/NY@32/Light/' + item.icon + '.png" class="png24" alt="' + item.iconDesc + '"></span>');
				}
				$mtt.append($li);
			}
			
			$tbody.empty();
			var keys = Object.keys( data.data );
			
			for(var i = 0 ; i < keys.length ; i+=2) {
				var $tr = $('<tr>');
				var item = data.data[keys[i]];
				$tr.append('<td class="th">' +  item.stnDisplay + '</td><td>' + item.pm10Avg + '</td>');
				if(i+1 < keys.length) {
					item = data.data[keys[i+1]];
					$tr.append('<td class="th">' +  item.stnDisplay + '</td><td>' + item.pm10Avg + '</td>');
				} else {
					$tr.append('<td class="th">&nbsp;</td><td>&nbsp;</td>');
				}
				$tbody.append($tr);
			}
			console.log(data);
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading("pm10-map", false, "light");
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			
		}
	};
	
	if (typeof exports !== 'undefined') exports.Pm10ObsData = Pm10ObsData;
	else window.Pm10ObsData = Pm10ObsData;
})(jQuery, window, document);