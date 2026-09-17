/**
 * 등표
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
			self.getData()
				.then(
					function(html) {
						self.updateView(html);
						showLoading("sea-lhaws-data-holder", false, "light");
					},
					self.error()
				);	
			showLoading("sea-lhaws-map", true, "light");
			self.getLhaws()
				.then(
					function(data) {
						self.updateLhawsView(data);
						showLoading("sea-lhaws-map", false, "light");
					},
					self.error()
				);
		},
		moveTm: function(dtm) {
			var self = this;
			showLoading("sea-lhaws-map", true, "light");
			self.getData(parseInt(dtm))
			.then(
				function(html) {
					self.updateView(html);
					showLoading("sea-lhaws-map", false, "light");
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
				url: prefix + "wnuri-sfct/current/lhaws.do",
				data: data,
				dataType: "html"
			});
		},
		getLhaws: function() {
			var self = this;
			var prefix = self.getPrefix();
			var data={};
			return $.ajax({
				url: prefix + "wnuri-sfct/rest/current/lhaws.do",
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
		updateLhawsView: function(lhaws) {
			var self = this;
			if(!lhaws) return;
			var $wrapper = $('#' + self.id);
			var prefix = self.getPrefix();
			$wrapper.find('.updated-at').html(moment(lhaws.tm,'YYYYMMDDHHm').format('MM[월] DD[일] HH:mm 발표'));
			for(var key in lhaws.data) {
				var item = lhaws.data[key];
				var $stnWrap = $wrapper.find('div[data-stn="' + key + '"]');
				$stnWrap.find("h4").text(item.stnKo);
				if(item.ws) {
					if(self.appConfig && self.appConfig.unit.ws == "m/s") {
						$stnWrap.find("dl>dt").html('<dt><span class="blind">풍속<br/></span><strong>' + item.ws + '</strong><br/>m/s</dt>');
					} else {
						$stnWrap.find("dl>dt").html('<dt><span class="blind">풍속<br/></span><strong>' + (item.ws * 3.6).toFixed(1) + '</strong><br/>km/h</dt>');
					}	
				} else {
					$stnWrap.find("dl>dt").html('<dt><span class="blind">풍속<br/></span><strong>&nbsp;</strong><br/>&nbsp;</dt>');
				}
				
				if(item.wd1){
					var $stnWd = $stnWrap.find("dl>dd");
					$stnWd.attr('class','arrow_' + item.wd);
					$stnWd.html('<img class="png24" src="' + prefix + 'resources/images/arrow_' + item.wd + '.png" alt="' + item.wdKo+ '">');
				} else {
					$stnWrap.find("dl>dd").html('');
				}
				var $stnWh = $stnWrap.find("p");
				if(item.whSig) {
					$stnWh.html('<span class="blind">파고<br></span><strong>' + item.whSig+ '</strong>m');
				} else {
					$stnWh.html('<span class="blind">파고<br></span><strong>');
				}
				
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
	
	if (typeof exports !== 'undefined') exports.SeaLhaws = SeaLhaws;
	else window.SeaLhaws = SeaLhaws;
})(jQuery, window, document);