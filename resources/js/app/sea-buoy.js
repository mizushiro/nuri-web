/**
 * 해상기상부이
 */
'use strict';
(function($, window, document){
	var VER="0.1", 
	SeaBuoy = function(wrapperId) {
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
	SeaBuoy.prototype = {
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
			showLoading("sea-buoy-data-holder", true, "light");
			self.getDataJS();
			showLoading("sea-buoy-map", true, "light");
			self.getBuoy()
				.then(
					function(data) {
						self.updateBuoyView(data);
						showLoading("sea-buoy-map", false, "light");
					},
					self.error()
				);
		},
		moveTm: function(dtm) {
			var self = this;
			showLoading("sea-buoy-map", true, "light");
			self.getData(parseInt(dtm))
			.then(
				function(html) {
					self.updateView(html);
					showLoading("sea-buoy-map", false, "light");
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
			
			return $.ajax({
				url: prefix + "wnuri-sfct/current/buoy.do",
				data: data,
				dataType: "html"
			});
		},
		getDataJS: function(dtm) {
			var self = this;
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var $wrapper = $('#' + self.id);
			var data = serializeObject($wrapper.find('form')[0]);
			data.unit = unit;
			if(dtm === 0) {
				data.tm = "";
			} 
			if(dtm) data.dtm = dtm;
			
			var url = "";
			for(var key in data) {
				url += "&" + key + "=" + data[key];
			}
			url = "https://www.kma.go.kr/mini/marine/buoyJs.jsp?" + url.substring(1);
			addScript(url);
		},
		getBuoy: function() {
			var self = this;
			var prefix = self.getPrefix();
			var data={};
			return $.ajax({
				url: prefix + "wnuri-sfct/rest/current/buoy.do",
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
		updateView: function(html) {
			var self = this;
			var $wrapper = $('#' + self.id);
			$wrapper.find('div[data-role="data-holder"]').html(html);
			var tm = $wrapper.find('p[data-role="tm"]').attr('data-tm');
			$wrapper.find('input[name="tm"]').val(moment(tm,'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
		},
		updateBuoyView: function(buoy) {
			var self = this;
			if(!buoy) return;
			var $wrapper = $('#' + self.id); 
			var prefix = self.getPrefix();
			$wrapper.find('.updated-at').html(moment(buoy.tm,'YYYYMMDDHHm').format('MM[월] DD[일] HH:mm 발표'));
			for(var key in buoy.data) {
				var item = buoy.data[key];
				var $stnWrap = $wrapper.find('div[data-stn="' + key + '"]');
				$stnWrap.find("h4").text(item.stnKo);
				if(item.ws1) {
					if(self.appConfig && self.appConfig.unit.ws == "m/s") {
						$stnWrap.find("dl>dt").html('<dt><span class="blind">풍속<br/></span><strong>' + item.ws1 + '</strong><br/>m/s</dt>');
					} else {
						$stnWrap.find("dl>dt").html('<dt><span class="blind">풍속<br/></span><strong>' + (item.ws1 * 3.6).toFixed(1) + '</strong><br/>km/h</dt>');
					}	
				} else {
					$stnWrap.find("dl>dt").html('<dt><span class="blind">풍속<br/></span><strong>&nbsp;</strong><br/>&nbsp;</dt>');
				}
				
				if(item.wd1){
					var $stnWd = $stnWrap.find("dl>dd");
					$stnWd.attr('class','arrow_' + item.wd1);
					$stnWd.html('<img class="png24" src="' + prefix + 'resources/images/arrow_' + item.wd1 + '.png" alt="' + item.wd1Ko+ '">');
				} else {
					$stnWrap.find("dl>dd").html('');
				}
				if(item.whSig) {
					var $stnWh = $stnWrap.find("p");
					$stnWh.html('<span class="blind">파고<br></span><strong>' + item.whSig+ '</strong>m');
				} else {
					$stnWrap.find("p").html('<span class="blind">파고<br></span>');
				}
				
			}
		},
		error: function() {
			var self = this;
			return function(request, status) {
				if(console) console.log(request, status);
				showLoading("sea-buoy-map", false, "light");
				showLoading("sea-buoy-data-holder", false, "light");
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
				self.updateData();
			});
			$wrapper.on('change', 'select[name="type"]', function(e) {
				//self.updateData();
			});
			$wrapper.on('click', 'button[data-role="select-type"]', function(e) {
				self.updateData();
			});

			$wrapper.on('click', 'button[data-role="move"]', function(e) {
				var dtm = $(this).attr('data-hours');
				self.moveTm(dtm);
			});
			$wrapper.on('keypress', 'input[name="tm"]', function(e) {
				if (e.keyCode == 13) {
					self.updateData();
		        }
			});
		}
	};
	function addScript( src ) {
		var s = document.createElement( 'script' );
		s.setAttribute( 'src', src );
		document.body.appendChild( s );
	}
	window.updateBuoyList = function(data) {
		var self = this;
		self.appConfigKey = "W_AC";
		var loadedAppConfig = store.get(self.appConfigKey);
		if(loadedAppConfig) {
			self.appConfig = loadedAppConfig;
		}
		if(data.stn == 0) {
			var template = '<p class="ann-txt" data-role="tm" data-tm="' + data.tm + '">' + data.resultTm + '</p>' + $('#buoy-all-template').html();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var tableHtml =  Mustache.render(template, {unit: unit});
			
			var $table = $(tableHtml);
			var rows = data.data;
			var bodyHtml = "";
			for(var i = 0 ; i < rows.length ; i++ ) {
				var rowHtml = "<tr>";
				var cols = rows[i];
				if(cols.length == 14) {
					rowHtml += '<td rowspan="23">' + cols[0].replace('일','일<br/>').replace('시','시<br/>') + '</td>\n';
					for(var k = 1 ; k < cols.length ; k++) {
						rowHtml += '<td>' + cols[k] + '</td>\n';	
					}
				} else {
					for(var k = 0 ; k < cols.length ; k++) {
						rowHtml += '<td>' + cols[k] + '</td>\n';	
					}
				}
				rowHtml += "</tr>";
				bodyHtml += rowHtml;
			}
			$table.find('tbody').html(bodyHtml);
			$('#sea-buoy-data-holder').html($table);
			var tm = $('#sea-buoy-data-holder').find('p[data-role="tm"]').attr('data-tm');
			$('input[name="tm"]').val(moment(tm,'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
		} else {
			var template = '<p class="ann-txt" data-role="tm" data-tm="' + data.tm + '">' + data.resultTm + '</p>' + $('#buoy-stn-template').html();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var tableHtml =  Mustache.render(template, {unit: unit});
			var $table = $(tableHtml);
			var rows = data.data;
			var bodyHtml = "";
			for(var i = 0 ; i < rows.length ; i++ ) {
				var rowHtml = "<tr>";
				var cols = rows[i];
				for(var k = 0 ; k < cols.length ; k++) {
					rowHtml += '<td>' + cols[k] + '</td>\n';
				}
				rowHtml += "</tr>";
				bodyHtml += rowHtml;
			}
			$table.find('tbody').html(bodyHtml);
			
			$('#sea-buoy-data-holder').html($table);
			var tm = $('#sea-buoy-data-holder').find('p[data-role="tm"]').attr('data-tm');
			$('input[name="tm"]').val(moment(tm,'YYYY.M.D.H:m').format('YYYY.MM.DD.HH:mm'));
		}
		
		
	}
	
	if (typeof exports !== 'undefined') exports.SeaBuoy = SeaBuoy;
	else window.SeaBuoy = SeaBuoy;
})(jQuery, window, document);