/**
 * 등표(API)
 */
'use strict';
(function($, window, document){
	var VER="0.1", 
	SeaLhaws = function(wrapperId) {
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
				data: { type: 't99', reg: '100'}
		};
		self.appConfigKey = "W_AC";
		self.readConfig();
		self.updateData();
		self.addEventHandler();
	};
	var serializeObject = function(frm) {
		var result = {};
		var extend = function(i, element) {
			var node = result[element.name];
			if ("undefined" !== typeof node && node !== null) {
				if($.isArray(node)) {
					node.push(element.value);
				} else {
					result[element.name] = [node, element.value];
				}
			} else {
				result[element.name] = element.value;
			}
		}
		$.each($(frm).serializeArray(), extend);
		return result;
	}
	SeaLhaws.prototype = {
		readConfig: function() {
			var self = this;
			var loadedAppConfig = store.get(self.appConfigKey);
			if(loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
		},
		refresh: function(bookmark) {
			var self = this;
			self.readConfig();
			self.updateData();
		},
		updateData: function() {
			var self = this;
			showLoading("sea-lhaws-data-holder", true, "light");
			
			self.getLhaws()
				.then(
					function(data) {
						self.updateLhawsList(data);
					},
					self.error()
				);	
		},
		updateDataInputTm: function(tm, stn) {
			var self = this;
			showLoading("sea-lhaws-data-holder", true, "light");

			self.getLhawsTm(tm, stn)
				.then(
					function(data) {
						self.updateLhawsList(data);
					},
					self.error()
				);
		},
		moveTm: function(dtm) {
			var self = this;
			self.getData(parseInt(dtm))
			.then(
				function(data) {
					self.updateLhawsList(data);
					self.updateView(data);
				},
				self.error()
			)	
		},
		getData: function(dtm) {
			var self = this;
			var prefix = self.getPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find('form')[0]);
			data.unit = unit;
			if(dtm === 0) {
				data.tm = "";
			} 
			data.dtm = dtm;
			
			return self.requestLhawsData(data);
		},
		getLhaws: function() {
			var self = this;
			var data={};
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			data.unit = unit;
			return self.requestLhawsData(data);
		},
		getLhawsTm: function(tm, stn) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find('form')[0]);
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			data.tm = tm;
			data.stn = stn;
			data.unit = unit;
			return self.requestLhawsData(data);
		},
		requestLhawsData: function(data) {
			var self = this;
			var prefix = self.getPrefix();
			return $.ajax({
				url: prefix + "observation/sea/lhaws-obs-data.do",
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
			var $wrapper = $('#' + self.id);
			var tm = data.tm;
			$wrapper.find('input[name="tm"]').val(moment(tm,'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
		},
		updateLhawsList: function(data) {
			var self = this;
			var $wrapper = $('#' + self.id);
			var prefix = self.getPrefix();
			$wrapper.find('.updated-at').html(moment(data.tm,'YYYYMMDDHHm').format('MM[월] DD[일] HH:mm 발표'));
			
			if(data.isSuccess) {
				if (data.stn == 0) {
					var template = '<p class="ann-txt" data-role="tm" data-tm="' + data.tm + '">' + data.resultTm + '</p>' + $('#lhaws-all-template').html();
					var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws : "km/h";
					var tableHtml = Mustache.render(template, { unit: unit });

					var $table = $(tableHtml);
					var rows = data.data;
					var spanNum = data.regCnt;
					var bodyHtml = "";
					for (var i = 0; i < rows.length; i++) {
						var rowHtml = "<tr>";
						var cols = rows[i];						
						if (cols.length == 6) {
							rowHtml += '<td rowspan=' + spanNum + '>' + cols[0].replace('일', '일<br/>').replace('시', '시<br/>') + '</td>\n';
							for (var k = 1; k < cols.length; k++) {
								rowHtml += '<td>' + cols[k] + '</td>\n';
							}
						} else {
							for (var k = 0; k < cols.length; k++) {
								rowHtml += '<td>' + cols[k] + '</td>\n';
							}
						}
						rowHtml += "</tr>";
						bodyHtml += rowHtml;
					}
					$table.find('tbody').html(bodyHtml);
					$('#sea-lhaws-data-holder').html($table);
					var tm = $('#sea-lhaws-data-holder').find('p[data-role="tm"]').attr('data-tm');
					$('input[name="tm"]').val(moment(tm, 'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
				} else {
					var template = '<p class="ann-txt" data-role="tm" data-tm="' + data.tm + '">' + data.resultTm + '</p>' + $('#lhaws-stn-template').html();
					var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws : "km/h";
					var tableHtml = Mustache.render(template, { unit: unit });
					var $table = $(tableHtml);
					var rows = data.data;
					var bodyHtml = "";
					for (var i = 0; i < rows.length; i++) {
						var rowHtml = "<tr>";
						var cols = rows[i];
						for (var k = 0; k < cols.length; k++) {
							rowHtml += '<td rowspan="1">' + cols[k] + '</td>\n';
						}
						rowHtml += "</tr>";
						bodyHtml += rowHtml;
					}
					$table.find('tbody').html(bodyHtml);

					$('#sea-lhaws-data-holder').html($table);
					var tm = $('#sea-lhaws-data-holder').find('p[data-role="tm"]').attr('data-tm');
					$('input[name="tm"]').val(moment(tm, 'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
				}
			}
			else {
				var bodyHtml = "";
				bodyHtml += "<div class='box-summary normal-box'>";
				bodyHtml += "<div class='text-box guide-box'>";
				bodyHtml += "<ul class='txt'>";
				bodyHtml += "<li>해양기상관측 자료제공이 원활하지 않습니다.<br>이용에 불편을 드려 죄송합니다.</li>";
				bodyHtml += "<li><a href='/w/observation/sea/lhaws.do' class='cmp-blue-btn' target='_blank' title='새창열림'>";
				bodyHtml += "등표 관측자료 제공<br>임시페이지 바로가기</a></li>";
				bodyHtml += "</ul></div></div>";
				$('#sea-lhaws-data-holder').html(bodyHtml);
			}
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading("sea-lhaws-map", false, "light");
				showLoading("sea-lhaws-data-holder", false, "light");
			};
		},
		addEventHandler: function() {
			var self = this;
			// save, cancel
			var $wrapper = $('#' + self.id);
			$wrapper.on('change', 'select[name="stn"]', function(e) {
				//self.updateData();
			});
			$wrapper.on('click', 'button[data-role="select-stn"]', function(e) {
				var tm = $('input[name="tm"]').val();
				var stn = $('select[name="stn"]').val();
				self.updateDataInputTm(tm, stn);
			});
			$wrapper.on('change', 'select[name="type"]', function(e) {
				//self.updateData();
			});
			$wrapper.on('click', 'button[data-role="select-type"]', function(e) {
				self.updateData();
			});

			$wrapper.on('click', 'button[data-role="move"]', function(e) {
				var dtm = $(this).attr('data-minutes');
				self.moveTm(dtm);
			});
			$wrapper.on('keypress', 'input[name="tm"]', function(e) {
				if (e.keyCode == 13) {
					self.updateData();
		        }
			});
		}
	};
	
	if (typeof exports !== 'undefined') exports.SeaLhaws = SeaLhaws;
	else window.SeaLhaws = SeaLhaws;
})(jQuery, window, document);
