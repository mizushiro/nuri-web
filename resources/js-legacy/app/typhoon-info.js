/**
 *
 * 메인 태풍 정보
 */
'use strict';
(function($, window, document){
	var VER="20200623",
	TyphoonInfo = function(wrapperId, viewType) {
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
		self.appConfigKey = "W_AC";
		self.state = {};
		self.config = {};
		self.readConfig();
		//self.updateData();
		self.addEventHandler();
		
		
	};
	TyphoonInfo.prototype = {
		refresh: function() {
			var self = this;
			if($('#' + self.id).attr('data-loaded') != '1') {
				self.updateData();
			}
		},
		readConfig: function() {
			var self = this;
			var loadedConfig = store.get(self.key);
			if(loadedConfig) {
				self.config = loadedConfig;
			}
			var loadedAppConfig = store.get(self.appConfigKey);
			if(loadedAppConfig) {
				self.appConfig = loadedAppConfig;
			}
		},
		updateData: function() {
			var self = this;
			if($('#' + self.id).attr('data-loaded') == '1') return;
			showLoading(self.id, true, "light");
			self.requestTyphoonInfo().then(
				function(html) {
					self.updateView(html);
					$('#' + self.id).attr('data-loaded', '1');
					$('#' + self.id).find('.typhoon-title > h4 > a').on('click', function(e) {
						e.preventDefault();
						var tabIndex = parseInt($(this).attr('data-item-id'));
						var typhoonTitle = $(this).parent().parent();
						
						if(!$(this).hasClass('on')) {
							typhoonTitle.find('> h4 > a').removeClass('on');
							typhoonTitle.find('> h4 > a').eq(tabIndex).addClass('on');
							$('#' + self.id).find('.typhoon-item').removeClass('on');
							$('#' + self.id).find('.typhoon-item').eq(tabIndex).addClass('on');
						}
					});
					
					function getKmaYoutube() {
						self.requestYoutubeInfo().then(
							function(data) {
								if(data) {
									for(var i in data) {
										var item = data[i];
										
										$('#' + self.id).find('.typ-ytb-frame').html('<iframe src="https://www.youtube.com/embed/' + item.id + '" width="100%" height="100%" frameborder="0" type="text/html" allowfullscreen></iframe>');
										$('#' + self.id).find('.typ-ytb-frame').show();
										break;
									}
								}
							},
							function(err) {
								console.log(err);
								$('#' + self.id).find('.typ-ytb-frame').hide();
							}
						);
					}
					self.requestTypYoutubeInfo().then(
							function(data) {
								if(data) {
									for(var i in data) {
										var item = data[i];
										
										$('#' + self.id).find('.typ-ytb-frame').html('<iframe src="https://www.youtube.com/embed/' + item.id + '" width="100%" height="100%" frameborder="0" type="text/html" allowfullscreen></iframe>');
										$('#' + self.id).find('.typ-ytb-frame').show();
										break;
									}
								} else {
									getKmaYoutube();	
								}	
							},function(err) {
								console.log(err);
								getKmaYoutube();
							}
					);
				},
				self.error()
			);
			
		},
		requestTyphoonInfo: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var unit = (self.appConfig && self.appConfig.unit) ? self.appConfig.unit.ws:"km/h";
			var data = {
					unit: unit,
					wf: "N",
			};
			var url = "";
			url = pathPrefix + "wnuri-typ/main-info.do"
			return $.ajax({
				url: url,
				data: data,
				dataType: "html"
			});
		},
		requestTypYoutubeInfo: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var url = "";
			url = pathPrefix + "repositary/sns/typ_youtube.json"
			return $.ajax({
				url: url,
				data: {},
				dataType: "json"
			});
		},
		requestYoutubeInfo: function() {
			var self = this;
			var pathPrefix = self.getPathPrefix();
			var url = "";
			url = pathPrefix + "repositary/sns/kma_youtube.json"
			return $.ajax({
				url: url,
				data: {},
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
		refreshForecast: function(bookmark) {
			var self = this;
			if(self.vshortShort) {
				self.vshortShort.refresh(bookmark);
			}
		},
		updateView: function(html) {
			var self = this;
			$('#' + self.id).html(html);
			// enable dfs forecast player
			self.dfsPlayer = new ImagePlayer("dfs-image-player",null, {
				type: "dfs",
				showOptionControl: true,
				showOption: false,
				timeTerm: parseFloat("5"),
				interval: parseFloat("0.5"),
				autoStart: false, 
				zoomLevel: "0",
				zoomX: "0000000",
				zoomY: "0000000",
				zoomEnabled: false,
				singleLineLimit: 0,
				isForecast: true,
				form: {},
				onImageClick: function(x, y, imageWidth, imageHeight) {
					var grid = 5.0,
						nx= 720.0 ,
						ny = 1240.0,
						iw = 500.0, 
						ih = 861.0,
						ratioX, ratioY, 
						marginRight = 36.0, 
						marginTop = 16.0;
					var ratio = imageWidth / iw;
					y = y - marginTop*ratio;
					iw = imageWidth - ( marginRight * ratio);
					ih = imageHeight - ( marginTop * ratio);
					
					ratioX = nx / iw;
					ratioY = ny / ih;
					var line=[{"x":1,"y":131},{"x":2,"y":131},{"x":3,"y":131},{"x":4,"y":131},{"x":5,"y":131},{"x":6,"y":131},{"x":7,"y":131},{"x":8,"y":131},{"x":9,"y":131},{"x":10,"y":131},{"x":11,"y":131},{"x":12,"y":131},{"x":13,"y":131},{"x":14,"y":131},{"x":15,"y":131},{"x":16,"y":131},{"x":17,"y":131},{"x":18,"y":131},{"x":19,"y":137},{"x":20,"y":137},{"x":21,"y":138},{"x":22,"y":137},{"x":23,"y":136},{"x":24,"y":134},{"x":25,"y":134},{"x":26,"y":130},{"x":27,"y":128},{"x":28,"y":127},{"x":29,"y":129},{"x":30,"y":128},{"x":31,"y":128},{"x":32,"y":127},{"x":33,"y":127},{"x":34,"y":126},{"x":35,"y":128},{"x":36,"y":130},{"x":37,"y":130},{"x":38,"y":131},{"x":39,"y":131},{"x":40,"y":130},{"x":41,"y":130},{"x":42,"y":130},{"x":43,"y":130},{"x":44,"y":131},{"x":45,"y":131},{"x":46,"y":131},{"x":47,"y":133},{"x":48,"y":133},{"x":49,"y":133},{"x":50,"y":133},{"x":51,"y":132},{"x":52,"y":132},{"x":53,"y":131},{"x":54,"y":132},{"x":55,"y":136},{"x":56,"y":138},{"x":57,"y":139},{"x":58,"y":139},{"x":59,"y":139},{"x":60,"y":142},{"x":61,"y":143},{"x":62,"y":144},{"x":63,"y":144},{"x":64,"y":144},{"x":65,"y":144},{"x":66,"y":143},{"x":67,"y":144},{"x":68,"y":144},{"x":69,"y":144},{"x":70,"y":144},{"x":71,"y":144},{"x":72,"y":144},{"x":73,"y":144},{"x":74,"y":144},{"x":75,"y":144},{"x":76,"y":144},{"x":77,"y":143},{"x":78,"y":144},{"x":79,"y":144},{"x":80,"y":145},{"x":81,"y":146},{"x":82,"y":148},{"x":83,"y":150},{"x":84,"y":150},{"x":85,"y":150},{"x":86,"y":150},{"x":87,"y":150},{"x":88,"y":150},{"x":89,"y":150},{"x":90,"y":150},{"x":91,"y":150},{"x":92,"y":150},{"x":93,"y":150},{"x":94,"y":150},{"x":95,"y":150},{"x":96,"y":150},{"x":97,"y":150},{"x":98,"y":150},{"x":99,"y":150},{"x":100,"y":150},{"x":101,"y":150},{"x":102,"y":150},{"x":103,"y":150},{"x":104,"y":150},{"x":105,"y":150},{"x":106,"y":150},{"x":107,"y":150},{"x":108,"y":150},{"x":109,"y":150},{"x":110,"y":150},{"x":111,"y":150},{"x":112,"y":150},{"x":113,"y":150},{"x":114,"y":150},{"x":115,"y":150},{"x":116,"y":150},{"x":117,"y":150},{"x":118,"y":150},{"x":119,"y":150},{"x":120,"y":150},{"x":121,"y":150},{"x":122,"y":150},{"x":123,"y":150},{"x":124,"y":150},{"x":125,"y":150},{"x":126,"y":150},{"x":127,"y":150},{"x":128,"y":150},{"x":129,"y":150},{"x":130,"y":150},{"x":131,"y":150},{"x":132,"y":150},{"x":133,"y":150},{"x":134,"y":150},{"x":135,"y":150},{"x":136,"y":150},{"x":137,"y":150},{"x":138,"y":150},{"x":139,"y":150},{"x":140,"y":150},{"x":141,"y":150},{"x":142,"y":150},{"x":143,"y":150},{"x":144,"y":150},{"x":145,"y":150},{"x":146,"y":150},{"x":147,"y":150},{"x":148,"y":150},{"x":149,"y":150}];
					y = ih - y ;
					var grid = {"x" : Math.round( (x * ratioX / grid) + 2 * ratioX ) ,"y" : Math.round( (y * ratioY / grid) + 2 * ratioY )};
					//console.log(x, y, imageWidth, imageHeight, grid);
					for( var i = 0; i < line.length; i++){
						if( grid.x == line[i].x && grid.y >= line[i].y && grid.y <= 255 ) {
							alert( '해당 지역은 표시할 수 없습니다.' );
							return;
						}
					}
					GlobalEvent.trigger($.Event("onGridReceived"), [grid.x , grid.y , self]);
				}
			});
			// enable dfs forecast player tab
			$('.dfs-data-title h4 a').on('click', function(e) {
				e.preventDefault();
				$('.dfs-data-title h4 a').removeClass('on');
				$(this).addClass('on');
				var data = $(this).attr('data-data');
				$('#' + self.id).find('input[name="data"]').val(data);
				self.dfsPlayer._updateNow();
			});
			// 초단기/동네예보
			self.vshortShort = new VshortShort('index-vshort-short', 'typhoon');
			self.vshortShort.updateData();
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
	
	if (typeof exports !== 'undefined') exports.TyphoonInfo = TyphoonInfo;
	else window.TyphoonInfo = TyphoonInfo;
})(jQuery, window, document);