 
/**
 * ImagePlayer
 */
'use strict';
var ImagePlayerConfig = {
    interval: 0.5, // seconds
    autoStart: false,
    showOption: true,
    showOptionControl: false,
    zoomEnabled: false,
    singleLineLimit: 12,
};
var MAP_ATTR = { 
    "freezing_rain": {
        "default": {
            className:"legend-sfc",
            bounds: { 
                "boundLBLng": 124.390,
                "boundLBLat": 32.5558,
                "boundLTLng": 124.390,
                "boundLTLat": 38.6759,
                "boundRTLng": 131.671,
                "boundRTLat": 38.6759,
                "boundRBLng": 131.671,
                "boundRBLat": 32.5558,
                "zoomLvl": 0, 
            }, 
            legend: {
                "units":"",
                "colorLvl":{
                    "r":[255,250,251,252],
                    "g":[255,252,201,125],
                    "b":[255,0,0,0],
                    "v":["","1단계","2단계","3단계"],
                    "d":[0,0,1,0]
                }, 
                "colorSp":{
                    "r":[255,250,251,252],
                    "g":[255,252,201,125],
                    "b":[255,0,0,0],
                    "v":["","1단계","2단계","3단계"],
                    "d":[0,0,1,0]
                },"colorBar": { 
                    "start": 0,"end": 110,"interval": -1,"markUnit": 0,"display": "range" 
                }
            }
        }
    },
    "cmp": {
        "SFC-HSR": {
            bounds: { 
                "boundLBLng": 121.3322516155,
                "boundLBLat": 30.8101038494,
                "boundLTLng": 120.6091166580,
                "boundLTLat": 40.1670385352,
                "boundRTLng": 133.0225827684,
                "boundRTLat": 40.0701181652,
                "boundRBLng": 132.0821758282,
                "boundRBLat": 30.7283967663,
                "zoomLvl": 0, 
            }, 
            legend: {
                "units":"mm/h",
                "colorLvl":{
                    "r":[250,0,0,0,0,0,0,0,255,255,249,224,204,255,255,210,180,224,201,179,147,179,76,0,51],
                    "g":[250,200,155,51,255,190,140,90,255,220,205,185,170,102,50,0,0,169,105,41,0,180,78,3,51],
                    "b":[250,255,245,245,0,0,0,0,0,31,0,0,0,0,0,0,0,255,255,255,228,222,177,144,51],
                    "v":["",0,0.1,0.5,1,2,3,4,5,6,7,8,9,10,15,20,25,30,40,50,60,70,80,90,110],
                    "d":[0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0]
                }, 
                "colorSp":{
                    "r":[250,0,0,0,0,0,0,0,255,255,249,224,204,255,255,210,180,224,201,179,147,179,76,0,51],
                    "g":[250,200,155,51,255,190,140,90,255,220,205,185,170,102,50,0,0,169,105,41,0,180,78,3,51],
                    "b":[250,255,245,245,0,0,0,0,0,31,0,0,0,0,0,0,0,255,255,255,228,222,177,144,51],
                    "v":["",0,0.1,0.5,1,2,3,4,5,6,7,8,9,10,15,20,25,30,40,50,60,70,80,90,110],
                    "d":[0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0]
                },"colorBar": { 
                    "start": 0,"end": 110,"interval": -1,"markUnit": 0,"display": "range" 
                }
            }
        },
        "SFC": {
            className:"legend-sfc",
            bounds: { 
                "boundLBLng": 121.3322516155,
                "boundLBLat": 30.8101038494,
                "boundLTLng": 120.6091166580,
                "boundLTLat": 40.1670385352,
                "boundRTLng": 133.0225827684,
                "boundRTLat": 40.0701181652,
                "boundRBLng": 132.0821758282,
                "boundRBLat": 30.7283967663,
                "zoomLvl": 0, 
            }, 
            legend: {
                "units":"",
                "colorLvl":{
                    "r":[255,46,93,255],
                    "g":[255,96,255,95],
                    "b":[255,255,255,255],
                    "v":["없음","비","눈비","눈"],
                    "d":[0,0,1,0]
                }, 
                "colorSp":{
                    "r":[179,76,0,51],
                    "g":[180,78,3,51],
                    "b":[222,177,144,51],
                    "v":[70,80,90,110],
                    "d":[0,0,1,0]
                },"colorBar": { 
                    "start": 0,"end": 110,"interval": -1,"markUnit": 0,"display": "range" 
                }
            }
        }
    } 
};
(function($, window, document){
    var DEBUG=true, 
        STATIC_IMAGES=[
            "https://www.kma.go.kr/images/weather/player/video-set-open.gif",
            "https://www.kma.go.kr/images/weather/player/video-set-close.gif",
            "https://www.kma.go.kr/images/ajax-loader.gif"
        ],
        DATA_URL={
            cmp: 'wnuri-img/rest/radar/cmp/images.do',
            cbs: 'wnuri-img/rest/radar/cmp/cbs-images.do',
            stn: 'wnuri-img/rest/radar/stn/images.do',
            qpf: 'wnuri-img/rest/radar/qpf/images.do',
            qpfs: 'wnuri-img/rest/radar/qpfs/images.do',
            lgt: 'wnuri-img/rest/lgt/images.do',
            rsl: 'wnuri-img/rest/rsl/images.do',
            seafct: 'wnuri-img/rest/seafct/images.do',
            sat: 'wnuri-img/rest/sat/images/gk2a.do',
            sat_coms: 'wnuri-img/rest/sat/images/coms.do',
            sat_hima: 'wnuri-img/rest/sat/images/hima.do',
            sat_ascat: 'wnuri-img/rest/sat/images/ascat.do',
            sat_terra_aqua: 'wnuri-img/rest/sat/images/terra-aqua.do',
            sat_dust: 'wnuri-img/rest/sat/images/dust.do',
            sat_water_temp: 'wnuri-img/rest/sat/images/water-temp.do',
            cht_analysis: 'wnuri-img/rest/cht/images/analysis.do',
            cht_forecast: 'wnuri-img/rest/cht/images/forecast.do',
            cht_expert: 'wnuri-img/rest/cht/images/expert.do',
            cht_ocean_wave: 'wnuri-img/rest/cht/images/ocean-wave.do',
            cht_surge_height: 'wnuri-img/rest/cht/images/ocean-forecast.do',
            cht_current: 'wnuri-img/rest/cht/images/ocean-forecast.do',
            cht_seavis: 'wnuri-img/rest/cht/images/ocean-forecast.do',
            freezing_rain: 'wnuri-img/rest/freezing-rain/images.do',
            dfs: 'wnuri-img/rest/dfs/images.do',
            climate_monitoring: 'wnuri-img/rest/climate/monitoring-images.do',
            climate_predict: 'wnuri-img/rest/climate/predict-images.do',
            fct_vshrt_rain: 'wnuri-img/rest/radar/qpf/ani-images.do',
        },
        MAX_INTERVAL=5,
        MAX_INTERVAL_TEXT="5",
        MIN_INTERVAL=0.11,
        MIN_INTERVAL_TEXT="0.1",
        MAX_ZOOM_LEVEL=4,
        MIN_ZOOM_LEVEL=1,
        ImagePlayer = function(id, items, opts) {
            this.id = id;
            this.items = items;
            this.$container = $('#'+id);
            if(this.$container.length == 0) return;
            
            this.appConfigKey = "W_AC";
            this.readConfig();
            this.timer = null;
            this.direction = 1;
            this.playing = false;
            this.preloaded = false;
            this.options = Object.assign({}, ImagePlayerConfig);
            if(opts) this.options = Object.assign(this.options, opts);
            if(this.options.kmapEnabled) {
                this.items = [];
            }
            if(this.items || this.options.kmapEnabled) {
                this.init();
            } else {
                var me = this;
                var frm = me.$container.find('form[name="image-player-form"]')[0];
                var param = serializeObject(frm);
                param.leaflet = me.options.leafletEnabled?"1":"0";
                param.kmap = me.options.kmapEnabled?"1":"0";
                var unit = (me.appConfig && me.appConfig.unit) ? me.appConfig.unit.ws:"km/h";
                param.unit = unit;
                fetchImages(me.options.type, param)
                .then( 
                    function(data) {
                        showLoading(me.id, false, "light");
                        if(!data || data.length == 0) {
                            me.items = [];
                            me.init();
                            alert("자료가 존재하지 않습니다.\n\n ※ 과거자료 조회는 기상자료개방포털(data.kma.go.kr)을 이용해주시기 바랍니다.");
                            return;
                        }
                        if((me._isChart() || me.options.type == "sat_terra_aqua" || me.options.type == "fct_vshrt_rain") && data.length < 2) {
                            me.$container.find('.movi-set-wrap').hide();
                            me.$container.find('.image-control-form-player').hide();
                        }else if(me._isClimate()) {
                            if(data.length < 2) {
                                me.$container.find('.movi-set-wrap').hide();
                                me.$container.find('.image-control-form-player').hide();
                            } else {
                                me.$container.find('.movi-set-wrap').show();
                                me.$container.find('.image-control-form-player').show();
                            }
                            me._buildClimateTargetDate(data);
                        }else {
                            me.$container.find('.movi-set-wrap').show();
                            me.$container.find('.image-control-form-player').show();
                        }
                        me.items = data;
                        me.init();
                    },
                    function(err) {
                        showLoading(me.id, false, "light");
                        alert("데이터 다운로드 오류입니다.");
                        me.items = [];
                        me.init();
                    }
                );
            }
            
    };
    var verifyTm = function(tm) {
            var reg = new RegExp("^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}:[0-9]{2}$");
            return reg.test(tm);
    };
    var verifyChartTm = function(tm) {
        var reg = new RegExp("^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}$");
        return reg.test(tm);
    };
    var verifyClimateTm = function(tm) {
        var reg = new RegExp("^[0-9]{4}\.[0-9]{2}\.[0-9]{2}$");
        return reg.test(tm);
    };
    function getPrefix() {
        if (DEBUG) {
            return 'https://www.weather.go.kr/w/';
        }
        if (window.appBase) {
            return window.appBase;
        } else {
            return "/";
        }
    };
    var fetchImages = function(type, param) {
        var expertDatas = [
            'kim_gdps_erly_asia_gph850_ft06_pa4_',
            'kim_gdps_erly_asia_dft850_ft06_pa4_',
            'kim_gdps_erly_asia_tgc2d_ft06_pa4_',
            'kim_gdps_erly_asia_wnd850_ft06_pa4_',
            'kim_gdps_lc20_fxkorh_',
            'kim_surf_newsur_pa4_',
            'kim_kor1_anlmod_pb4_',
        ]
        var analysisDatas = [
			"dfs_medm_stn_best_tmxn01",
			"dfs_medm_stn_best_tmxn02",
			"dfs_medm_stn_best_tmxn03",
			"dfs_medm_stn_best_tmxn04",
        ]

        if (expertDatas.includes(param.data)) {
            type = 'cht_expert';
        }
        else if (analysisDatas.includes(param.data)) {
            type = 'cht_analysis';
        }

        var  formType = "get",
            responseDataType = "json";
        var url = null;
        if(type && DATA_URL[type]) {
            url = DATA_URL[type];
        } else {
            if(typeof errorCallback === "function") {
                return errorCallback();
            }
        }
        return $.ajax({
            url: getPrefix() + url,
            type: formType,
            dataType: responseDataType,
            data: param
        });
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
    ImagePlayer.prototype = {
        init: function() {
            var me = this;
            me._preloadStaticImages();
            me._initDom();
            me._initEvents();
            
            me._refreshPlayControl();
            me._fillForm();
            me._refreshFormOptions();
            
            if(me.options.autoStart) {
                if(!me.preloaded) {
                    me._startPreload(function() {
                        me._playStart();
                        me.$container.find('input[name="autoStart"]').val("true");
                        me._refreshPlayControl();
                    });
                } else {
                    me._playStart();
                    me.$container.find('input[name="autoStart"]').val("true");
                    me._refreshPlayControl();
                }
            }
            if(me.options.kmapEnabled) {
                me.createKmap(me.options.kmapOptions);
            } else if(me.options.leafletEnabled) {
                me._initLeafletMap();
                me._makeRdrLegend();
                me._showImage(me.selectedIndex);
            }

            // if (timebar) {
            //     timebar.setTimebar(me.id, me.items, 0);
            // }
        },
        readConfig: function() {
            var me = this;
            var loadedAppConfig = store.get(me.appConfigKey);
            if(loadedAppConfig) {
                me.appConfig = loadedAppConfig;
            }
        },
        kmapOnload: function(name, dates) {
            var me = this;
            if(dates) {
                me.items = [];
                for(var i in dates) {
                    var item = dates[i];
                    me.items.push({ 
                        name: name + "",
                        tm: item.tm.replace(/[\-T\:]/g, '').substring(0,12),
                        ftm: item.ftm.replace(/[\-T\:]/g, '').substring(0,12),
                        url: (item.url && item.url.length > 0) ? item.url[0]: ''
                    });
                }
                me.reinit();
            }
            if(me.options.kmapOptions && me.options.kmapOptions.onPostCreate) {
                me.options.kmapOptions.onPostCreate();
            }
        },
        createKmap: function(opts) {
            var me = this;
            me.options.kmapEnabled = true;
            // 존재하면 리턴
            if(me.$container.find('#kmap').length > 0) return;
            var legendHtml = "<div id=\"legend\" class=\"legend-position\">";
                legendHtml += "    <div v-for=\"(legend, key) in legends\" class=\"legend\" v-if=\"legend.display\">";
                legendHtml += "        <div class=\"legendWrap\">";
                legendHtml += "            <div class=\"co\">";
                legendHtml += "                <div v-for=\"attr in legend.attributes\" v-if=\"attr.visible\"";
                legendHtml += "                    v-bind:style=\"{width: legend.width + 'px', height: calcHeigth(legend) + 'px',";
                legendHtml += "                                    margin: legend.margin + 'px', background: attr.color}\"></div>";
                legendHtml += "            </div>";
                legendHtml += "            <div class=\"no\" :class=\"legend.class\">";
                legendHtml += "                <span v-for=\"attr in legend.attributes\" v-if=\"attr.visible && attr.label\">";
                legendHtml += "                    <template v-if=\"legend.unit == 'm/s'\">{{ Number((attr.label * config.unitValue).toFixed(1)) }}</template>";
                legendHtml += "                    <template v-else>{{ attr.label }}</template>";
                legendHtml += "                </span>";
                legendHtml += "            </div>";
                legendHtml += "        </div>";
                legendHtml += "        <div v-show=\"legend.unit && legend.unit != '없음'\" class=\"unit\">";
                legendHtml += "            <template v-if=\"legend.unit == 'm/s'\">{{ config.unit }}</template>";
                legendHtml += "            <template v-else>{{ legend.unit }}</template>";
                legendHtml += "        </div>";
                legendHtml += "    </div>";
                legendHtml += "    </div>";
            var $imageSlide = me.$container.find(".image-player-slide").first();
            var $kmapApp = $('<div class="kmap-app">').html(legendHtml);
            var $kmap = $('<div class="wgis-inner-map" id="kmap">').attr('id','kmap').appendTo($kmapApp);
            $kmap.css({
                'height': $imageSlide.width()
            });
            $kmapApp.appendTo($imageSlide.empty());
            
            for(var i in me.options.kmapLayers) {
                var kmapLayer = me.options.kmapLayers[i];
                if(typeof kmapLayer === "object") {
                    if(!kmapLayer.options) kmapLayer.options = {};
                    kmapLayer.options.onLoad = function(name, dates) { me.kmapOnload(name, dates) };
                }
            }
            var units =  { ws: ((me.appConfig && me.appConfig.unit) ? me.appConfig.unit.ws:"m/s") };
            createLegend('kmap', { el: "#legend", units: units} );
            var mapOpts = {
                onLoad: function(vmap) {
                    me.vmap = vmap;
                    KMAP_addLayer(vmap, me.options.kmapLayers);
                    if(me.options.kmapOptions 
                            && !me.options.kmapOptions.lat 
                            && !me.options.kmapOptions.lon
                            && me.appConfig 
                            && me.appConfig.locationMode != "no-location") {
                        showLoading('kmap',true);
                        getLocation(function(lat, lon, err) {
                            vmap.setCenter([lon, lat]);
                            vmap.addLocation([lon, lat]);
                            if(err && me.options.kmapOptions.defaultZoom) vmap.setZoom(me.options.kmapOptions.defaultZoom);
                            showLoading('kmap',false);
                        });
                    } else {
                    	window.setTimeout(function() {
                    		if(me.options.kmapOptions && !me.options.kmapOptions.lat && !me.options.kmapOptions.lon) {
                        		var defaultLat = 37.493546;
                            	var defaultLon = 126.921654;
                            	vmap.setCenter([defaultLon, defaultLat]);
                                vmap.addLocation([defaultLon, defaultLat]);
                        	} else if(me.options.kmapOptions && me.options.kmapOptions.lat > 0 && me.options.kmapOptions.lon > 0){
                        		vmap.setCenter([me.options.kmapOptions.lon, me.options.kmapOptions.lat]);
                        	}
                    		
                    		if(me.options.kmapOptions && me.options.kmapOptions.defaultZoom) vmap.setZoom(me.options.kmapOptions.defaultZoom);
                    	}, 10);
                    }
                    if(me.options.kmapOptions && me.options.kmapOptions.onLoad) {
                    	me.options.kmapOptions.onLoad(me);
                    }
                },
            };
            mapOpts = Object.assign(mapOpts, opts);
            console.log('KMAP_createMap opts', mapOpts, opts);
            KMAP_createMap("kmap", mapOpts);
            me.$container.find(".legend").show();
        },
        removeKmap: function() {
            var me = this;
            me.options.kmapEnabled = false;
            me.$container.find("#kmap").remove();
            me.$container.find(".legend").hide();
        },
        kmapLayerUpdate: function(layers) {
            var me = this;
            
            if(me.vmap && me.options.kmapEnabled) {
                KMAP_removeLayer(me.vmap, me.options.kmapLayers);
                me.options.kmapLayers = layers;
                
                for(var i in me.options.kmapLayers) {
                    var kmapLayer = me.options.kmapLayers[i];
                    if(typeof kmapLayer === "object") {
                        if(!kmapLayer.options) kmapLayer.options = {};
                        kmapLayer.options.onLoad = function(name, dates) { me.kmapOnload(name, dates) };
                    }
                }
                
                KMAP_addLayer(me.vmap, me.options.kmapLayers);
            }    
        },
        _initLeafletMap: function() {
            var me = this;
            if(me.mapWrapper) return;
            me.mapWrapper = anaMapInit(me.$container.find(".image-player-slide").empty());
            
        },
        _makeRdrLegend: function(rdrInfo) {
            var me = this;
            var dataCode = me.options.form.data?me.options.form.data.value:null;
            var mapAttr = me._getMapAttr(me.options.type, dataCode);
            if(!mapAttr) return;
            var $legendWrap = $('<div>').addClass('image-player-legend');
            if(mapAttr.className) {
                $legendWrap.addClass(mapAttr.className);
            }
            var $legend = $('<ul>');
            var colorLvl = mapAttr.legend.colorLvl;
            var colorLvlLength = colorLvl.v.length;
            for(var i = colorLvlLength-1; i >=0; i--) {
                var r = colorLvl.r[i];
                var g = colorLvl.g[i];
                var b = colorLvl.b[i];
                var v = colorLvl.v[i];
                var $li = $('<li>');
                $('<span>').addClass('legend-color').css({backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')'}).appendTo($li);
                $('<span>').addClass('legend-text').html(v).appendTo($li);
                $legend.append($li);
            }
            $('<li>').append($('<span>').addClass('legend-unit').html(mapAttr.legend.units)).appendTo($legend);
            $legend.appendTo($legendWrap);
            me.$container.find('#map>.image-player-legend').remove();
            me.$container.find('#map').append($legendWrap);
            
            
        },
        reinit: function() {
            var me = this;
            me._initDom();
            me._refreshPlayControl();
            if(me.options.kmapEnabled) {
                me.createKmap(me.options.kmapOptions);
            } else if(me.options.leafletEnabled) {
                me._makeRdrLegend();
            }
            me._showImage(me.selectedIndex);
        },
        _initDom: function() {
            var me = this;
            moment.locale('ko',{
                    weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
                    weekdaysShort: ["일","월","화","수","목","금","토"]
            });
            me.$container.find('form[name="image-player-form"]').on('submit', function(e) { e.preventDefault(); })
            if(me.options.showOptionControl) {
                var $optionBtn = me.$container.find('.image-control-btn a');
                if(me.options.showOption) {
                    $optionBtn.addClass("close");
                    $optionBtn.removeClass("open");
                    $optionBtn.html('주요 옵션만 보기');
                    me.$container.find('.image-player-params').show();
                    me.$container.find('input[name="showOption"]').val("true");
                    me.$container.find('.time-line').show();
                } else {
                    $optionBtn.removeClass("close");
                    $optionBtn.addClass("open");
                    $optionBtn.html('모든 옵션 보기');
                    me.$container.find('.image-player-params').hide();
                    me.$container.find('input[name="showOption"]').val("false");
                    me.$container.find('.time-line').hide();
                } 
                me.$container.find('.image-control-btn').show();    
            } else {
                me.$container.find('.image-control-btn').hide();    
            }
            me.$container.find('input[name="itv"]').val(me.options.interval);
            me.$container.find('select[name="timeTerm"]').val(me.options.timeTerm);
            
            if(me.options.selectedIndex) {
                me.selectedIndex = parseInt(me.options.selectedIndex);
            } else {
                if(me.options.isForecast) {
                    me.selectedIndex = 0;
                } else {
                    me.selectedIndex = me.items.length - 1;
                }
            }

            var lastItem = me._updateTimeLine();
            var tmText = "";
            if(lastItem && lastItem.tm) {
                if(lastItem.tm.length == 10) {
                    tmText = moment(lastItem.tm,'YYYYMMDDHH').format('YYYY.MM.DD.HH');
                } else if(lastItem.tm.length == 8) {
                    tmText = moment(lastItem.tm,'YYYYMMDD').format('YYYY.MM.DD');
                } else if(lastItem.tm.length == 6) {
                    tmText = moment(lastItem.tm,'YYYYMM').format('YYYY.MM');
                } else {
                    tmText = moment(lastItem.tm,'YYYYMMDDHHmm').format('YYYY.MM.DD.HH:mm');
                }
            }
            
            me.$container.find('input[name="tm"]').val(tmText);
            if(me._isClimate()) {
                me.$container.find('input[name="tm_display"]').val(tmText + " " + lastItem.ftm);
            } else {
                me.$container.find('input[name="tm_display"]').val(tmText);
            }

            // init zoom
            if(!me.options.kmapEnabled && !me.options.leafletEnabled) {
                  if(me.options.zoomEnabled) {
                      me._updateZoomControl();
                      me.$container.on("click", '.image-player-slide-images li img', function(e) {
                          me.__eventImageClick(e, this);
                      });
                      // 이미지 높이 계산
                      me.$container.find('.image-player-slide-images img').first().on("load", function(e) {
                          me._refreshZoomControlPos();
                      });
                    
                      $(window).on('resize', function() {
                          me._refreshZoomControlPos();
                      });
                      me._refreshZoomControlPos();
                  } else {
                      me._refreshZoomControlPos();
                  }
                  // create arrow
                  me._showImage(me.selectedIndex);
                  me._createArrowControl();
            }
            // init panzoom
            if(me.options.panZoomEnabled) {
                me._addPanZoomUi();
            };
        },
        _updateNow: function() {
            var me = this;
            var frm = me.$container.find('form[name="image-player-form"]')[0];
            var param = serializeObject(frm);
            param.leaflet = me.options.leafletEnabled?"1":"0";
            var unit = (me.appConfig && me.appConfig.unit) ? me.appConfig.unit.ws:"km/h";
            param.unit = unit;
            if(me.options.kmapEnabled) {
                if(me.options.kmapLayers) {
                    var newLayers = _.map(me.options.kmapLayers, function(layer) {
                    	var newOptions = Object.assign(layer.options ? layer.options : {}, {tm: null});
                        return Object.assign(layer, { options : newOptions  });
                    });
                    me.kmapLayerUpdate(newLayers);
                }
            } else {
                fetchImages(me.options.type, param)
                .then( 
                    function(data) {
                        showLoading(me.id, false, "light");
                        if(!data || data.length == 0) {
                            alert("자료가 존재하지 않습니다.\n\n ※ 과거자료 조회는 기상자료개방포털(data.kma.go.kr)을 이용해주시기 바랍니다.");
                            return;
                        }
                        if(me._isChartExtTerm3()) { // 2021-06-21 분석일기도 3시간 단위 선택을 위한 조건문 추가
                        	me.$container.find('button.ext3').css('display','block');
                        	me.$container.find('button.ext6').css('display','block');
                        }
                        else if(me._isChartExtTerm6()) {
                        	me.$container.find('button.ext3').css('display','none');
                        	me.$container.find('button.ext6').css('display','block');
                        }
                        else {
                        	me.$container.find('button.ext3').css('display','none');
                        	me.$container.find('button.ext6').css('display','none');
                        }
                        
                        if((me._isChart() || me.options.type == "sat_terra_aqua" || me.options.type == "fct_vshrt_rain") && data.length < 2) {
                            me.$container.find('.movi-set-wrap').hide();
                            me.$container.find('.image-control-form-player').hide();
                        } else if(me._isClimate()) {
                            if(data.length < 2) {
                                me.$container.find('.movi-set-wrap').hide();
                                me.$container.find('.image-control-form-player').hide();
                            } else {
                                me.$container.find('.movi-set-wrap').show();
                                me.$container.find('.image-control-form-player').show();
                            }
                            me._buildClimateTargetDate(data);
                        } else {
                            me.$container.find('.movi-set-wrap').show();
                            me.$container.find('.image-control-form-player').show();
                        }
                        me.items = data;
                        me.reinit();
                    },
                    function(err) {
                        showLoading(me.id, false, "light");
                        alert("데이터 다운로드 오류입니다.");
                    }
                );
            }
        },
        _buildClimateTargetDate: function(data) {
            var me = this;
            if(!data || data.length < 0) return;
            var latestFtm = data[0].latestFtm;
            var term = data[0].term;
            var url = data[0].url;
            if(!term) return;

            if(term == "W") {
                var ttm = moment(latestFtm.substring(0,4) + "-01-01", "YYYY[-]MM[-]DD");
                var week = parseInt(latestFtm.substring(5));
                ttm.week(week);
                var loopTtm = ttm.clone();
                var lastTtm = ttm.clone().add(-1, 'year').add(1,'days');
                var $ttmSelect = me.$container.find('select[name="target"]').first();
                var template = '{{#data}}<option value="{{value}}" {{#selected}}selected{{/selected}}>{{text}}</option>{{/data}}';
                var ttmList = [];
                for( ; loopTtm.isAfter(lastTtm) ; loopTtm.add(-1,'weeks')) {
                	var tm1 = loopTtm.clone().day(0);
                	var tm2 = loopTtm.clone().day(6);
                    if(url.indexOf('cos_ncep_hano_') > -1 || url.indexOf('cos_ncep_tano_') > -1) {
                    	tm1.add(1,'days');
                    	tm2.add(1,'days');
                    }
                    var text1 = tm1.format('YYYY-MM-DD');
                    var text2 = tm2.format('YYYY-MM-DD');
                    var value = loopTtm.format('YYYY[W]ww');
                    ttmList.push({ value: value, text: (text1 + ' ~ ' + text2), selected: data[0].ftm == value } );
                }
                var html = Mustache.render(template, { data: ttmList });
                $ttmSelect.html(html);
                var $ttmBox = $ttmSelect.parents('.cont-box02').show();
                $ttmBox.next().hide();
            } else if(term == "M") {
                var ttm = moment(latestFtm, "YYYYMM");
                var loopTtm = ttm.clone();
                var lastTtm = ttm.clone().add(-1, 'year');
                var $ttmSelect = me.$container.find('select[name="target"]').first();
                var template = '{{#data}}<option value="{{value}}" {{#selected}}selected{{/selected}}>{{text}}</option>{{/data}}';
                var ttmList = [];
                for( ; loopTtm.isAfter(lastTtm) ; loopTtm.add(-1,'month')) {
                    var text = loopTtm.format('YYYY[년] M[월]');
                    var value = loopTtm.format('YYYYMM');
                    ttmList.push({ value: value, text: text, selected: data[0].ftm == value } );
                }
                var html = Mustache.render(template, { data: ttmList });
                $ttmSelect.html(html);
                var $ttmBox = $ttmSelect.parents('.cont-box02').show();
                $ttmBox.next().hide();
            } else if(term == "D") {
                var $ttmSelect = me.$container.find('select[name="target"]').first();
                $ttmSelect.empty();
                var $ttmBox = $ttmSelect.parents('.cont-box02').hide();
                $ttmBox.next().show();
            } else {
                var $ttmSelect = me.$container.find('select[name="target"]').first();
                $ttmSelect.empty();
                var $ttmBox = $ttmSelect.parents('.cont-box02').hide();
                $ttmBox.next().hide();
            }
        },
        _updateTimeLine: function() {
            var me = this;
            var isSingleLine = false;
            if(me.items.length <= me.options.singleLineLimit) {
                isSingleLine = true;
            }
            var lastItem = null;
            var lastHour = "";
            var $playerForm = me.$container.find('form[name="image-player-form"]');
            var $tmInput = me.$container.find('input[name="tm"]');
            var param = serializeObject($playerForm[0]);

            for(var i = 0 ; i < me.items.length ; i++) {
                var item = me.items[i];
                if(me._isChart() && param.type != "RWW3") {
                    lastHour = moment(item.tm,'YYYYMMDDHH').format('DD[.]HH[:00]');    
                } else if(me._isClimate()) {
                    lastHour = "";
                } else {
                    lastHour = moment(item.tm,'YYYYMMDDHHmm').format('HH[:]mm');
                }
            }

            lastItem = me.items.length > 0 ? me.items[me.items.length - 1] : null;
            if(lastItem) {
                if(me._isChart() && param.type != "RWW3") {
                    $tmInput.val(moment(lastItem.tm,'YYYYMMDDHH').format('YYYY[.]MM[.]DD[.]HH'));
                } else if(lastItem.tm.length == 8) {
                	$tmInput.val(moment(lastItem.tm,'YYYYMMDD').format('YYYY[.]MM[.]DD'));
                } else if(lastItem.tm.length == 6) {
                	$tmInput.val(moment(lastItem.tm,'YYYYMM').format('YYYY[.]MM'));
                } else {
                    $tmInput.val(moment(lastItem.tm,'YYYYMMDDHHmm').format('YYYY[.]MM[.]DD[.]HH[:]mm'));
                }    
            }
            me.$container.find(".movi-line").slider({
                slide: function( event, ui ) {
                    $(ui.handle).parent().next().css("width",ui.value + "%");
                    var index = Math.round((me.items.length-1) * ui.value/100);
                    var item = me.items[index];
                    me._showImage(index);
                }
            });
            me.$container.find(".movi-line span").text(lastHour);
            return lastItem;
        },
        _updateZoomControl: function() {
            var me = this;
            var $zoomControl = me.$container.find('.image-player-zoom-control');
            if($zoomControl.length == 0) {
                $zoomControl = $('<div />').addClass('image-player-zoom-control');
                $('<strong/>').appendTo($zoomControl);
                for(var i = 0 ; i <= MAX_ZOOM_LEVEL ; i++) {
                    var $a = $('<a/>').html(i).appendTo($zoomControl);
                    $a.attr('data-zoom-level', i);
                    if(i == parseInt(me.options.zoomLevel)) {
                        $a.addClass("on");
                    }
                    $a.on('click', function(e) {
                        me._zoomTo(parseInt($(this).attr('data-zoom-level')));
                    });
                }
                $zoomControl.appendTo(me.$container.find('.image-player-slide-wrapper'));
            } else {
                $zoomControl.find('a').removeClass("on");
                $zoomControl.find('a').each(function(index) {
                    if(index == parseInt(me.options.zoomLevel)) {
                        $(this).addClass("on");
                    }
                });
            }            
        },
        _refreshZoomControlPos: function(){
            var me = this;
            var imgHeight = me.$container.find('.image-player-slide img').first().height();
            //me.$container.find('.image-player-slide').css({ height: imgHeight + "px"});
            if(me.options.zoomEnabled) {
                me.$container.find('.image-player-zoom-control').css({ top: "10px", right: "10px"});
                me.$container.find('.image-player-zoom-control').show();
            }
        },
        _createArrowControl: function() {
            var me = this;
            if(true) return;
            var $arrowControl = $('<div />').addClass('image-player-arrow-control');
            $arrowControl.hide();
            var html = '<a class="image-player-arrow-left">Left</a>';
            html += '<a class="image-player-arrow-right">Right</a>';
            html += '<a class="image-player-arrow-top">Top</a>';
            html += '<a class="image-player-arrow-bottom">Bottom</a>';
            $arrowControl.html(html);
            $arrowControl.appendTo(me.$container.find('.image-player-slide').first());
            $arrowControl.on('click', 'a', function(e) {
                if($(this).hasClass('image-player-arrow-left')) {
                    if(!me.preloading) me._moveArea(-1,0);
                } else if($(this).hasClass('image-player-arrow-right')) {
                    if(!me.preloading)me._moveArea(1,0);
                } else if($(this).hasClass('image-player-arrow-top')) {
                    if(!me.preloading)me._moveArea(0,1);
                } else if($(this).hasClass('image-player-arrow-bottom')) {
                    if(!me.preloading)me._moveArea(0,-1);
                } 
            });
        },
        _toggleArrowControl: function(show) {
            var me = this;
            if(show) me.$container.find('.image-player-arrow-control').show();
            else me.$container.find('.image-player-arrow-control').hide();
        },
        _refreshImageList: function() {
            var me = this;
            if(me.items.length == 0) return;
            var width = me.$container.find('.movi-line').eq(0).width();
            var per = me.selectedIndex/(me.items.length-1) * 100;
            me.$container.find('.movi-bar-wrap').eq(0).css({"width": per + "%"});
            me.$container.find('.movi-line > span').eq(0).css({"left": per + "%"});
            var item = me.items[me.selectedIndex];
            if(me._isChart() && me.items.length > 1) {
                var tooltipText =  moment(item.ftm,'YYYYMMDDHH').format('MM[/]DD[.]HH');
                me.$container.find('.movi-line > span').eq(0).html(tooltipText);
                var tmText = moment(me.items[me.selectedIndex].ftm,'YYYYMMDDHH').format('YYYY[.]MM[.]DD[.]HH');
                me.$container.find('input[name="tm_display"]').val(tmText);
            } else if(me._isChart()) {
                var tooltipText =  moment(item.tm,'YYYYMMDDHH').format('MM[/]DD[.]HH');
                me.$container.find('.movi-line > span').eq(0).html(tooltipText);
                var tmText = moment(me.items[me.selectedIndex].tm,'YYYYMMDDHH').format('YYYY[.]MM[.]DD[.]HH');
                me.$container.find('input[name="tm_display"]').val(tmText);
            } else if(me._isClimate()) {
                if(item.tm.length == 6) {
                    var tooltipText =  moment(item.tm,'YYYYMM').format('M월');
                    me.$container.find('.movi-line > span').eq(0).html(item.ftm);
                    var tmText = moment(me.items[me.selectedIndex].tm,'YYYYMM').format('YYYY[.]MM');
                    if(me.options.type == "climate_predict") {
                        me.$container.find('input[name="tm_display"]').val(tmText.substring(0,4) + " " + item.ftm);
                    } else {
                        me.$container.find('input[name="tm_display"]').val(tmText + " " + item.ftm);
                    }
                } else {
                    var tooltipText =  moment(item.tm,'YYYYMMDD').format('MM[/]DD');
                    me.$container.find('.movi-line > span').eq(0).html(item.ftm);
                    var tmText = moment(me.items[me.selectedIndex].tm,'YYYYMMDD').format('YYYY[.]MM[.]DD');
                    me.$container.find('input[name="tm_display"]').val(tmText + " " + item.ftm);
                }
            } else {
                var tooltipText =  moment(item.ftm?item.ftm:item.tm,'YYYYMMDDHHmm').format('HH[:]mm');
                me.$container.find('.movi-line > span').eq(0).html(tooltipText);
                var tmText = moment(me.items[me.selectedIndex].ftm?me.items[me.selectedIndex].ftm:me.items[me.selectedIndex].tm,'YYYYMMDDHHmm').format('YYYY[.]MM[.]DD[.]HH[:]mm');
                me.$container.find('input[name="tm_display"]').val(tmText);    
            }
        },
        _fillForm: function() {
            var me = this;
            var form = me.$container.find('form[name="image-player-form"]')[0];
            var options = me.options;
            var fields = ["autoStart", "zoomLevel", "zoomX", "zoomY", "showOption"];
            for(var i in fields) {
                var field = fields[i];
                if(form.elements[field]) {
                    form.elements[field].value = options[field];
                }
            }
        },
        _refreshFormOptions: function() {
            var me = this;
            for(var name in me.options.form) {
                var value = me.options.form[name].value;
                var onclick = me.options.form[name].onclick;
                var onchange = me.options.form[name].onchange;
                me.$container.find('input[name="' + name + '"]').each(function() {
                    if(this.value == value) {
                        if(this.type == "radio" || this.type == "checkbox") {
                            this.checked = true;
                        } else {
                            this.value = value;
                        }
                    }
                });
                me.$container.find('select[name="' + name + '"]').each(function() {
                    $.each($(this).find("option"), function(index, item) {
                        if(item.value == value) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                });
                
                me.$container.on('click', 'input[name="' + name + '"]', function(e) {
                    me.options.form[this.name].value = this.value;
                    if( onclick && typeof onclick === "function") {
                        me.options.form[this.name].onclick(e, this, me);    
                    }
                });
                
                me.$container.on('keypressed', 'input[name="' + name + '"]', function(e) {
                    me.options.form[this.name].value = this.value;
                })
                me.$container.on('change', 'select[name="' + name + '"]', function(e) {
                    me.options.form[this.name].value = this.value;
                    if( onchange && typeof onchange === "function") {
                        me.options.form[this.name].onchange(e, this, me);
                    }
                    // trigger force update
                    me._update();
                });
            }
        },
        _refreshPlayControl: function() {
            var me = this;
            var $btn = me.$container.find('button[data-role="play-slide"]');
            if(me.playing) {
                if(!$btn.hasClass("stop-slide")) {
                    $btn.addClass('stop-slide')
                }
                $btn.attr('title','정지');
            } else {
                if($btn.hasClass("stop-slide")) {
                    $btn.removeClass('stop-slide')
                }
                $btn.attr('title','재생');
            }
        },
        _clearTimeout: function() {
            var me = this;
            if(me.timer) {
                window.clearTimeout(me.timer);
            }
        },
        _playStart: function() {
            var me = this;
            me._clearTimeout();
            this.playing = true;
            me._playImage();    
        },
        _playStop: function() {
            var me = this;
            me._clearTimeout();
            this.playing = false;    
        },
        _playImage: function() {
            var me = this;
            if(me.playing) {
                var newIndex = me.selectedIndex + me.direction;
                var gap = false;
                if(newIndex == me.items.length - 1) {
                    gap = true;
                }
                if(newIndex >= me.items.length) newIndex = 0;
                if(newIndex < 0) newIndex = me.items.length-1;
                me._showImage(newIndex);
                var itv = me.options.interval * 1000;
                if(gap) {
                    itv = itv < 1000 ? 1500 : itv;
                }
                me.timer = window.setTimeout(function() {
                    me._playImage();
                }, itv);
            }
        },
        _moveImage: function(direction) {
        	var me = this;
        	var newIndex = me.selectedIndex + direction;
            var gap = false;
            if(newIndex == me.items.length - 1) {
                gap = true;
            }
            if(newIndex >= me.items.length) newIndex = 0;
            if(newIndex < 0) newIndex = me.items.length-1;
            me._showImage(newIndex);
        },
        getPrefix: function() {
            if(window.appBase) {
                return window.appBase;
            } else {
                return "/";
            }
        },
        _getMapAttr: function(type, data) {
            if(data) {
                return MAP_ATTR[type][data];
            } else {
                return MAP_ATTR[type]["default"];
            }
        },
        setImage: function(index) {
            var me = this;
            me._showImage(index);
        },
        _showImage: function(index) {
            var me = this;
            index = parseInt(index);
            if(index < 0) index = 0;
            if (me.selectedIndex >= me.items.length) index = 0;

            if(me.options.leafletEnabled && me.mapWrapper) {
                var item = me.items[index];
                if(item) {
                    var dataCode = me.options.form.data?me.options.form.data.value:null;
                    me.mapWrapper.setImage(me.mapWrapper.map, item.url, me._getMapAttr(me.options.type, dataCode));
                    me.selectedIndex = index;
                    me._refreshImageList();

                }
            } else if(me.options.kmapEnabled) {
                var item = me.items[index];
                if(item) {
                    me.vmap.setIndex(index);
                    if(me.options.type == "lgt") {
                    	try {
                    		var dt = moment(item.ftm,'YYYYMMDDHHmm').toDate();
                        	KMAP_getLegend(me.vmap).setLegend('lgt', true, dt, { dateNum: 12, interval: 10 });
                    	}catch(e) {
                    		console.log(e);
                    	}
                    }
                    me.selectedIndex = index;
                    me._refreshImageList();
                }
            } else {
                var prefix = DEBUG ? 'https://www.weather.go.kr' : '';
                var $img = me.$container.find('.image-player-slide img');
                var item = me.items[index];
                if(item) {
                    if($img.length == 0) {
                        $img = $('<img/>');
                        me.$container.find('.image-player-slide').append($img);
                        $img.on('click', function(e) { me.__eventImageClick(e, this); });
                    }
                    
                    $img.attr('src', prefix + item.url);
                    $img.attr('alt', item.name);
                    if(me.options.panZoomEnabled) {
                        me._addPanZoom($img[0]);
                    }
                    me.selectedIndex = index;
                    me._refreshImageList();
                }
            }

            // if (timebar) {
            //     timebar.setTimebar(me.id, me.items, 0);
            // }
            
        },
        _relocateImage: function(index) {
            var me = this;
            me._clearTimeout();
            me._showImage(index);
            if(me.playing) {
                me.timer = window.setTimeout(function() {
                    me._playImage();
                }, me.options.interval * 1000);
            }
        },
        _isChart: function() {
            var me = this;
            return me.options.type.substring(0,3) == "cht";
        },
        _isClimate: function() {
            var me = this;
            return me.options.type.substring(0,7) == "climate";
        },
        _isChartExtTerm3: function() {
        	// 2021-06-21 분석일기도 3시간 단위 선택을 위한 조건문 추가
            var me = this;     
            return me.options.type == "cht_analysis" && me.options.form.data.value == 'kim_sfc3_anlden_pa4';
        },
        _isChartExtTerm6: function() {
        	// 2021-06-21 분석일기도 6시간 단위 선택을 위한 조건문 추가
            var me = this;   
            return me.options.type == "cht_analysis" && me.options.form.data.value.substring(4,6) == 'up';
        },
        _addPanZoom: function(ele) {
            var me = this;
            var centerCenter = {x: 0.5, y: 0.5};
            me.pzZooming = false;
            if(me.pzInstance) {
                me.pzInstance.dispose();
            }
            var pzInstance = panzoom(ele, {
                maxZoom: 8,
                minZoom: 1,
                smoothScroll: true,
                transformOrigin: centerCenter,
                // initialX: 0,
                // initialY: 0,
                // initialX: me.pzCurrentTransform ? me.pzCurrentTransform.x : 0,
                // initialY: me.pzCurrentTransform ? me.pzCurrentTransform.Y : 0,
                // initialZoom: me.pzCurrentTransform ? me.pzCurrentTransform.zoom : 1,
                // bounds: true,
                //   boundsPadding: 1.0,
                beforeWheel: function(e) {
                    // allow wheel-zoom only if altKey is down. Otherwise - ignore
                    var shouldIgnore = !e.altKey;
                    return shouldIgnore;
                }
            });
            me.pzInstance = pzInstance;
            me.pzInstance.on('zoomend', function(e) {
                me.pzInstance.resume();
                console.log('Fired when zoom animation ended', e);
                console.log(me.pzInstance.getTransform());
                me.pzCurrentTransform = me.pzInstance.getTransform();
            });
            
            me.pzInstance.on('panend', function(e) {
                console.log('Fired when pan ended', e);
                console.log(me.pzInstance.getTransform());
                me.pzCurrentTransform = me.pzInstance.getTransform();
            });
                        
            return pzInstance;    
        },
        _addPanZoomUi: function() {
            var me = this;
            $('<div class="image-player-pzui mobile"><a href="#" data-pz-role="zoom-in" title="확대"><span>+</span></a><a href="#" data-pz-role="zoom-out" title="축소"><span>-</span></a></div>').appendTo(me.$container.find('.image-player-slide-wrapper').first());
            $('<div class="image-player-pzui"><a href="#" data-pz-role="zoom-in" title="확대"><span>+</span></a><a href="#" data-pz-role="zoom-out" title="축소"><span>-</span></a></div>').appendTo(me.$container.find('.image-player-slide').first());
            var $rect = me.$container.find('.image-player-slide').first();
            me.$container.find('a[data-pz-role]').each(function(idx,ele) {
                $(ele).on('click', function(e) {
                    e.preventDefault();
                    if(me.pzZooming) return;
                    if(me.pzInstance) {
                        var rect = $rect[0].getBoundingClientRect()
                        var cx = rect.width/2;
                        var cy = rect.height/2;
                        var isZoomIn = $(this).attr('data-pz-role') === 'zoom-in';
                        var zoomBy = isZoomIn ? 2 : 0.5;
                        me.pzInstance.smoothZoom(cx, cy, zoomBy);
                        me.pzInstance.pause();
                    }
                });
            });
        },
        _initEvents: function() {
            var me = this;
            
            me.$container.on('change', 'input[name="tm"]', function(e) {
            	if(me._isChart()) {
            		if(!verifyChartTm(this.value)) {
            			alert("시간 형식이 유효하지 않습니다. 형식은 yyyy.MM.dd.HH입니다.");
            			this.focus();
            		}
            	} else if(me._isClimate()) {
            		if(this.value.length == 10 && !verifyClimateTm(this.value)) {
            			alert("시간 형식이 유효하지 않습니다. 형식은 yyyy.MM.dd입니다.");
            			this.focus();
            		}
            	} else {
            		if(!verifyTm(this.value)) {
            			alert("시간 형식이 유효하지 않습니다. 형식은 yyyy.MM.dd.HH:mm입니다.");
            			if(me.options.type == "lgt") {
            				this.value = moment().format('YYYY[.]MM[.]DD[.]HH[:]mm');
                		}
            			this.focus();
            		} else {
            			if(me.options.type == "lgt") {
                			var inputTm = moment(this.value, 'YYYY[.]MM[.]DD[.]HH[:]mm');
                			if(inputTm.isAfter(moment())) {
                				alert("과거 혹은 현재 시간을 입력해 주세요.");
                				this.value = moment().format('YYYY[.]MM[.]DD[.]HH[:]mm');
                				this.focus();
                			}
                		}
            		}
            	}
            });
            me.$container.on('click', '.image-player-slide img', function(e) {
                if(me.options.kmapEnabled) return;
                if(me.options.type == "dfs" 
                    || (me.options.type.length >= 4 && me.options.type.substring(0,4) == "cht_")
                    || me._isClimate() ) return;
                var src = $(this).attr('src');
                $('<div>').css({
                    background: 'rgba(0,0,0,.7) url('+src+') no-repeat center',
                    backgroundSize: 'contain',
                    width:'100%', height:'100%',
                    position:'fixed',
                    zIndex:'10000',
                    top:'0', left:'0',
                    cursor: 'zoom-out',
                }).click(function(){
                    $(this).remove();
                }).appendTo('body');
            });
            me.$container.on('click', '.image-player-move button', function(e) {
                var move = $(this).attr('data-move');
                var moveUnit = $(this).attr('data-move-unit');
                if(!moveUnit) moveUnit = "hours";
                if(!move) move = "0";
                move = parseInt(move);
                var $playerForm = me.$container.find('form[name="image-player-form"]');
                var $tmInput = me.$container.find('input[name="tm"]');
                if($tmInput.length < 1) return;
                var tmVal= $tmInput.val();
                var param = serializeObject($playerForm[0]);
                var tmMoment = null;
                if(me._isClimate()){
                    tmMoment = moment(tmVal, 'YYYY[.]MM[.]DD[.]HH');
                } else {
                    tmMoment = (me._isChart() && param.type != "RWW3")?moment(tmVal, 'YYYY[.]MM[.]DD[.]HH'):moment(tmVal, 'YYYY[.]MM[.]DD[.]HH[:]mm');
                }
                if(move == 0) {
                    $tmInput.val("");
                    me._updateNow();
                    return;
                } else {
                    if(tmMoment.isValid()) {
                        tmMoment = tmMoment.add(move, moveUnit);
                        if(me._isChart() && param.type != "RWW3") { 
                            $tmInput.val(tmMoment.format('YYYY[.]MM[.]DD[.]HH'));
                        } else if(me._isClimate()){
                              $tmInput.val(tmMoment.format('YYYY[.]MM[.]DD'));
                        } else {
                            $tmInput.val(tmMoment.format('YYYY[.]MM[.]DD[.]HH[:]mm'));
                        }
                    }
                }
                me._update();
            }); 
            me.$container.on('click', '.image-control-btn a', function() {
                if($(this).hasClass('close')) {
                    $(this).removeClass('close');
                    $(this).addClass('open');
                    $(this).html('모든 옵션 보기');
                    me.$container.find('.image-player-params').hide('fast', function() {
                        me._refreshZoomControlPos();
                        me.$container.find('.time-line').hide();
                    });                    
                    me.options.showOption = false;
                    me.$container.find('input[name="showOption"]').val("false");
                } else {
                    $(this).removeClass('open');
                    $(this).addClass('close');
                    $(this).html('주요 옵션만 보기');
                    me.$container.find('.image-player-params').show('fast', function() {
                        me._refreshZoomControlPos();
                        me.$container.find('.time-line').show();
                    });                    
                    me.options.showOption = true;
                    me.$container.find('input[name="showOption"]').val("true");
                }
            });
            me.$container.on('click', '.player-itv-change-btn', function(e) {
                var itvValue = parseFloat($(this).attr('data-itv-value'));
                if(itvValue > 0) {
                    if(parseFloat(me.options.interval) >= MAX_INTERVAL) {
                        alert("최저 속도입니다.");
                        return;
                    } 
                } else if(itvValue < 0) {
                    if(parseFloat(me.options.interval) <= MIN_INTERVAL) {
                        alert("최고 속도 입니다.");
                        return;
                    } 
                } else { 
                    return; 
                }
                if(me.options.interval <= 1) {
                    if(me.options.interval == 1 && itvValue > 0) {
                        ;
                    } else {
                        itvValue = (0.1*itvValue);
                    }
                } else {
                    me.options.interval = Math.floor(me.options.interval);
                }
                me.options.interval = me.options.interval + itvValue;
                if(me.options.interval < 1) {
                    me.$container.find('input[name="itv"]').val(me.options.interval.toFixed(1));
                } else {
                    me.$container.find('input[name="itv"]').val(me.options.interval.toFixed(0));
                }
            });
            me.$container.on('click', '.btn_controller_first', function(e) {
                e.preventDefault();
                //me.direction = -1;
                var newIndex = 0;
                me._relocateImage(newIndex);
                
            });
            me.$container.on('click', '.btn_controller_prev', function(e) {
                e.preventDefault();
                //me.direction = -1;
                var newIndex = me.selectedIndex - 1;
                if(newIndex < 0) newIndex = me.items.length-1;
                me._relocateImage(newIndex);
                
            });
            me.$container.on('click', '.btn_controller_next', function(e) {
                e.preventDefault();
                //me.direction = 1;
                var newIndex = me.selectedIndex + 1;
                if(newIndex >= me.items.length) newIndex = 0;
                me._relocateImage(newIndex);
            });
            me.$container.on('click', '.btn_controller_last', function(e) {
                e.preventDefault();
                //me.direction = 1;
                var newIndex = me.items.length - 1;
                me._relocateImage(newIndex);
            });
            me.$container.on('click', 'button[data-role="prev-slide"]', function(e) {
            	e.preventDefault();
            	me._moveImage(-1);
            });
            me.$container.on('click', 'button[data-role="next-slide"]', function(e) {
            	e.preventDefault();
            	me._moveImage(1);
            });
            me.$container.on('click', 'button[data-role="play-slide"]', function(e) {
                e.preventDefault();
                if(me.playing) {
                    me._playStop();
                    me.$container.find('input[name="autoStart"]').val("false");
                    me._refreshPlayControl();
                } else {
                    if(!me.options.kmapEnabled && !me.preloaded) {
                        me._startPreload(function() {
                            me._playStart();
                            me.$container.find('input[name="autoStart"]').val("true");
                            me._refreshPlayControl();
                        });
                    } else {
                        me._playStart();
                        me.$container.find('input[name="autoStart"]').val("true");
                        me._refreshPlayControl();
                    }
                }    
            });
            me.$container.on('click', 'button[data-role="data-select"]', function(e) {
                e.preventDefault();
                if(me.options.type == "cht_analysis") {
                	var $tmInput = me.$container.find('input[name="tm"]');
                    $tmInput.val("");
                    me._updateNow();
                } else {
                    me._update();
                }
            });
        },
        _showLoader: function(show) {
            var me = this;
            var css = me._getLoaderStyle();
            showLoading(me.id, show, css);
//            var $loader = me.$container.find('.image-player-loader');
//            if(show) {
//                if($loader.length == 0) {
//                    me.$container.append('<div class="image-player-loader"><img src="https://www.kma.go.kr/images/ajax-loader.gif" alt="Loading..."/></div>');
//                }
//            } else {
//                if($loader.length != 0) {
//                    $loader.remove();
//                }    
//            }
        },
        _startPreload: function(callback) {
            var me = this;
            me.preloading = true;
            me.preloadTimedout = false;
            if(me.preloadTimer) {
                window.clearTimeout(me.preloadTimer);
            }
            // show loader
            me._showLoader(true);
            
            for(var i = 0 ; i < me.items.length ; i++) {
                var item = me.items[i];
                var img = new Image();
                img.src = item.url;
                $(img).attr('data-item-index', i).on('load', function() {
                    if(!me.preloadTimedout) {
                        var itemIndex = $(this).attr('data-item-index');
                        me.items[itemIndex].loaded = true;
                        var allLoaded = true;
                        for(var k = 0 ; k < me.items.length ; k++) {
                            if(!me.items[k].loaded) {
                                allLoaded = false;
                                break;
                            }                        
                        }
                        if(allLoaded) {
                            me.$container.find('.image-player-slide-images').empty();
                            me.preloading = false;
                            me.preloaded = true;    
                            me._showLoader(false);
                            if(!!callback) callback();        
                        }
                    }
                });
            }
            me.preloadTimer = window.setTimeout(function() {
                me.preloadTimedout = true;
                me.$container.find('.image-player-slide-images').empty();
                me.preloading = false;
                me.preloaded = true;
                me._showLoader(false);
                if(!!callback) callback();
            }, 10000);
        },
        _preloadStaticImages: function() {
            var me = this;
            window.preloadStaticImages = [];
            for(var i = 0 ; i < STATIC_IMAGES.length ; i++) {
                var img = new Image(); img.src = STATIC_IMAGES[i];
                window.preloadStaticImages.push(img);
            }
        },        
        _getLoaderStyle: function() {
            var me = this;
            var style = "light";
            if(me.options.type == "cmp") {
                if(me.form && me.form.data && me.form.data.value == "SFC") {
                    style = "dark";
                }
            }
            return style;
        },
        _updateImages: function(frm) {
            var me = this;
            var param = serializeObject(frm);
            param.leaflet = me.options.leafletEnabled?"1":"0";
            param.kmap = me.options.kmapEnabled?"1":"0";
            var css = me._getLoaderStyle();
            if(me.options.kmapEnabled) {
                me.options.timeTerm = param.timeTerm;
                me.createKmap(me.options.kmapOptions);
                if(me.options.kmapLayers) {
                    var newLayers = _.map(me.options.kmapLayers, function(layer) {
                        var newOptions = Object.assign(layer.options ? layer.options : {}, {tm: param.tm, interval: param.timeTerm});
                        return Object.assign(layer, { options: newOptions });
                    });
                    me.kmapLayerUpdate(newLayers);
                }
            } else {
                me.removeKmap();
                showLoading(me.id, true, css);
                var unit = (me.appConfig && me.appConfig.unit) ? me.appConfig.unit.ws:"km/h";
                param.unit = unit;
                fetchImages(me.options.type, param)
                .then( 
                    function(data) {
                        showLoading(me.id, false, "light");
                        if(!data || data.length == 0) {
                            alert("자료가 존재하지 않습니다.\n\n ※ 과거자료 조회는 기상자료개방포털(data.kma.go.kr)을 이용해주시기 바랍니다.");
                            return;
                        }
                        if((me._isChart() || me.options.type == "sat_terra_aqua" || me.options.type == "fct_vshrt_rain") && data.length < 2) {
                            me.$container.find('.movi-set-wrap').hide();
                            me.$container.find('.image-control-form-player').hide();
                        } else if(me._isClimate()) {
                            if(data.length < 2) {
                                me.$container.find('.movi-set-wrap').hide();
                                me.$container.find('.image-control-form-player').hide();
                            }
                            me._buildClimateTargetDate(data);
                        } else {
                            me.$container.find('.movi-set-wrap').show();
                            me.$container.find('.image-control-form-player').show();
                        }
                        me.items = data;
                        // timebar.setTimebar(me.id, me.items, me.selectedIndex);

                        if(me.options.leafletEnabled) {
                            me._makeRdrLegend();
                        }
                          if(me.playing) {
                              me._playStop();
                              me.preloaded = false;
                              me._startPreload(function() {
                                  me._playStart();
                                  me._refreshPlayControl();
                              });
                              me._updateZoomControl();
                          } else {
                              me._showImage(me.selectedIndex);
                              me._updateZoomControl();
                          }
                    },
                    function(err) {
                        alert("데이터 다운로드 오류입니다.");
                        showLoading(me.id, false, "light");
                    }
                );
            }
        },
        _update: function() {
            var me = this;
            var frm = me.$container.find('form[name="image-player-form"]')[0];
            // apply JS options to form
            frm.zoomLevel.value = me.options.zoomLevel;
            frm.zoomX.value = me.options.zoomX;
            frm.zoomY.value = me.options.zoomY;
            if(frm.data && frm.data.value) {
                me.options.form.data.value = frm.data.value;
                
                if(me._isChartExtTerm3()) { // 2021-06-21 분석일기도 3시간 단위 선택을 위한 조건문 추가
                	me.$container.find('button.ext3').css('display','block');
                	me.$container.find('button.ext6').css('display','block');
                }
                else if(me._isChartExtTerm6()) {
                	me.$container.find('button.ext3').css('display','none');
                	me.$container.find('button.ext6').css('display','block');
                }
                else {
                	me.$container.find('button.ext3').css('display','none');
                	me.$container.find('button.ext6').css('display','none');
                }
            }
            me._updateImages(frm);
        },
        _calcArea: function(xx, yy, imageWidth, imageHeight) {
            var     me = this,
                LEG_pixel = 35,     // 범레 폭(pixel)
                TITLE_pixel = 20,   // 제목 폭(pixel)
                img_rate = 1.1,     // 이미지 계산시 확대 비율
                img_NI = imageWidth - LEG_pixel/img_rate,     // 결과이미지내 자료영역
                img_NJ = imageHeight - TITLE_pixel/img_rate,
                img_OJ = TITLE_pixel/img_rate,  // 결과이미지내 제목 폭(pixel)
                nmap = 5,   // 5개 영역으로 구분
                di = 0.5*img_NI/(nmap-1),
                dj = 0.5*img_NJ/(nmap-1);
            var point = {};
            if (yy < 0.5*dj) {
                if (xx < 0.5*di) { point.type="move"; point.x = -1; point.y = 1; }
                else if (xx > img_NI-0.5*di) { point.type="move"; point.x = 1; point.y = 1; }
                else { point.type="move"; point.x = 0; point.y = 1; }
            }
            else if (yy > img_NJ+img_OJ-0.5*dj) {
                if (xx < 0.5*di) { point.type="move"; point.x = -1; point.y = -1; }
                else if (xx > img_NI-0.5*di) { point.type="move"; point.x = 1; point.y = -1; }
                else { point.type="move"; point.x = 0; point.y = -1; }
            }
            else {
                if (xx < 0.5*di) { point.type="move"; point.x = -1; point.y = 0; }
                else if (xx > img_NI-0.5*di) { point.type="move"; point.x = 1; point.y = 0; }
                else {
                    for (var j = 1; j <= nmap; j++) {
                        var y1 = (img_NJ*0.5 - dj)*0.5 + dj*(j-1);
                        var y2 = y1 + dj;
                        if (j == 1) y1 = dj*0.5;
                        if (j == nmap) y2 = img_NJ - dj*0.5;
                        y1 += img_OJ;
                        y2 += img_OJ;

                        if (yy >= y1 && yy < y2) {
                            for (var i = 1; i <= nmap; i++) {
                                var x1 = (img_NI*0.5 - di)*0.5 + di*(i-1);
                                var x2 = x1 + di;
                                if (i == 1) x1 = di*0.5;
                                if (i == nmap) x2 = img_NI - di*0.5;
                                if (xx >= x1 && xx < x2) {
                                    point.type="zoom"; point.x = i; point.y = nmap-j+1;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            return point;
        },
        // 이미지 마우스 핸들러
        _imageClick: function(xx, yy, imageWidth, imageHeight) {
            var me = this;
            if(typeof me.options.onImageClick == "function") {
                me.options.onImageClick(xx, yy, imageWidth, imageHeight);
            }
            
            if(!me.options.zoomEnabled) return;
            var point = me._calcArea(xx, yy, imageWidth, imageHeight);
            if(point) {
                if(point.type == "move") {
                    me._moveArea(point.x, point.y);
                } else if(point.type == "zoom") {
                    me._zoomArea(point.x, point.y);
                }
            }            
        },
        _zoomValue: function(x,y,prevOptions) {
            var me = this;
            var v = parseInt(prevOptions==null?me.options.zoomLevel:prevOptions.zoomLevel);
            if ( v >= MAX_ZOOM_LEVEL) return null;
            var zoomOption = {};
            
            if (v == 0) {
                zoomOption.zoomX = x + (prevOptions==null?me.options.zoomX.substr(v+1,6):prevOptions.zoomX.substr(v+1,6));
                zoomOption.zoomY = y + (prevOptions==null?me.options.zoomY.substr(v+1,6):prevOptions.zoomY.substr(v+1,6));
            }
            else {
                if(prevOptions == null) {
                    zoomOption.zoomX = me.options.zoomX.substr(0,v) + x + me.options.zoomX.substr(v+1,6);
                    zoomOption.zoomY = me.options.zoomY.substr(0,v) + y + me.options.zoomY.substr(v+1,6);
                } else {
                    zoomOption.zoomX = prevOptions.zoomX.substr(0,v) + x + prevOptions.zoomX.substr(v+1,6);
                    zoomOption.zoomY = prevOptions.zoomY.substr(0,v) + y + prevOptions.zoomY.substr(v+1,6);
                }                
            }
            zoomOption.zoomLevel = v + 1;
            return zoomOption;
        },
        _unzoomValue: function(prevOptions) {
            var me = this;
            var v = parseInt(prevOptions==null?me.options.zoomLevel:prevOptions.zoomLevel);
            if ( v <= MIN_ZOOM_LEVEL) return null;
            var zoomOption = {};
            v-=1;
            if (v <= 0) {
                zoomOption.zoomLevel = 0;
                zoomOption.zoomX = '0000000';
                zoomOption.zoomY = '0000000';
            }
            else {
                if(prevOptions == null) {
                    zoomOption.zoomLevel = v;
                    zoomOption.zoomX = me.options.zoomX.substr(0,v) + '0' + me.options.zoomX.substr(v+1,6);
                    zoomOption.zoomY = me.options.zoomY.substr(0,v) + '0' + me.options.zoomY.substr(v+1,6);
                } else {
                    zoomOption.zoomLevel = v;
                    zoomOption.zoomX = prevOptions.zoomX.substr(0,v) + '0' + prevOptions.zoomX.substr(v+1,6);
                    zoomOption.zoomY = prevOptions.zoomY.substr(0,v) + '0' + prevOptions.zoomY.substr(v+1,6);
                }
            }
            return zoomOption;
        },
        _zoomTo: function(targetZoomLevel) {
            var me = this;
            me.preloaded = false;
            var currentZoomLevel = parseInt(me.options.zoomLevel);
            if(targetZoomLevel == 0) {
                // full size
                me._unzoomArea(0);
                me._toggleArrowControl(false);
            } else {
                me._toggleArrowControl(true);
                if(currentZoomLevel < targetZoomLevel) {
                    // zoom
                    var $img = me.$container.find('.image-player-slide>img').first();
                    var centerX = parseInt($img.width()/2);
                    var centerY = parseInt($img.height()/2);
                    var point = me._calcArea(centerX, centerY, $img.width(), $img.height());
                    var targetZoomOption = null;
                    for(var i = currentZoomLevel ; i < targetZoomLevel ; i++) {
                        targetZoomOption = me._zoomValue(point.x, point.y, targetZoomOption);
                    }
                    if(targetZoomOption != null) {
                        me.options.zoomLevel = targetZoomOption.zoomLevel;
                        me.options.zoomX = targetZoomOption.zoomX;
                        me.options.zoomY = targetZoomOption.zoomY;
                        me._update();
                    }
                } else if(currentZoomLevel > targetZoomLevel) {
                    // unzoom
                    var targetZoomOption = null;
                    for(var i = currentZoomLevel ; i > targetZoomLevel ; i--) {
                        targetZoomOption = me._unzoomValue(targetZoomOption);
                    }
                    if(targetZoomOption != null) {
                        me.options.zoomLevel = targetZoomOption.zoomLevel;
                        me.options.zoomX = targetZoomOption.zoomX;
                        me.options.zoomY = targetZoomOption.zoomY;
                        me._update();
                    }
                }
            }
        },
        // 확대
        _zoomArea: function(x,y) {
            var me = this;
            me.preloaded = false;
            var frm = me.$container.find('form[name="image-player-form"]')[0];
            var v = parseInt(me.options.zoomLevel);
            if (v == 7) {
                alert("더이상의 확대는 안됩니다.");
                return;
            }
            var zoomOption = me._zoomValue(x,y);
            if(zoomOption.zoomLevel == 0) {
                me._toggleArrowControl(false);
            } else {
                me._toggleArrowControl(true);
            }
            if(zoomOption == null) return;
            me.options.zoomLevel = zoomOption.zoomLevel;
            me.options.zoomX = zoomOption.zoomX;
            me.options.zoomY = zoomOption.zoomY;
            me._update();
        },

        // 축소
        _unzoomArea: function(w) {
            var me = this;
            me.preloaded = false;
            var frm = me.$container.find('form[name="image-player-form"]')[0];
            var zoomOption = null;
            if (w == 0) {
                zoomOption = {};
                zoomOption.zoomLevel = 0;
                zoomOption.zoomX = '0000000';
                zoomOption.zoomY = '0000000';
            }
            else if (w == 1) {
                zoomOption = me._unzoomValue();
                if(zoomOption == null) return;
            }
            me.options.zoomLevel = zoomOption.zoomLevel;
            me.options.zoomX = zoomOption.zoomX;
            me.options.zoomY = zoomOption.zoomY;
            me._update();
        },

        // 확대영역에서 이동
        _moveArea: function(dx,dy) {
            var me = this;
            me.preloaded = false;
            if (me.options.zoomLevel <= 0) return;
            me._moveAreaPosition(dx,dy);
            me._update();
        },

        _moveAreaPosition: function(dx,dy) {
            var me = this;
            var frm = me.$container.find('form[name="image-player-form"]')[0];
            var v, x, y, v1;
            if (me.options.zoomLevel <= 0) return;

            v = parseInt(me.options.zoomLevel) - 1;
            x = parseInt(me.options.zoomX.charAt(v)) + dx;
            y = parseInt(me.options.zoomY.charAt(v)) + dy;
            if (v < 0) v = 0;

            if (v >= 1) {
                me.options.zoomLevel = v;
                if (x < 1) { me._moveAreaPosition(-1,0); x = 2; }
                if (x > 5) { me._moveAreaPosition(1,0);  x = 4; }
                if (y < 1) { me._moveAreaPosition(0,-1); y = 2; }
                if (y > 5) { me._moveAreaPosition(0,1);  y = 4; }
                me.options.zoomLevel = v + 1;
            }
            else {
                if (x < 1) x = 1;
                if (x > 5) x = 5;
                if (y < 1) y = 1;
                if (y > 5) y = 5;
            }
            if (v == 0) {
                me.options.zoomX = x + me.options.zoomX.substr(v+1,6);
                me.options.zoomY = y + me.options.zoomY.substr(v+1,6);
            }
            else {
                me.options.zoomX = me.options.zoomX.substr(0,v) + x + me.options.zoomX.substr(v+1,6);
                me.options.zoomY = me.options.zoomY.substr(0,v) + y + me.options.zoomY.substr(v+1,6);
            }
        },
        __eventImageClick: function(e, obj) {
            var me = this;
            var offset = $(obj).offset();
            var xx = e.pageX - offset.left;
            var yy = e.pageY - offset.top;
            me._imageClick(xx,yy,$(obj).width(), $(obj).height());
        },
        debug: function(log) {
            if(window.console && DEBUG) {
                window.console.log({name: NAME , log: log} );
            }
        }
    }    
    if (typeof exports !== 'undefined') exports.ImagePlayer = ImagePlayer;
    else window.ImagePlayer = ImagePlayer;
})(jQuery, window, document);
