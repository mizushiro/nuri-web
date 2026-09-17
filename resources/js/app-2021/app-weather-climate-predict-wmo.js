/**
 *  날씨 - 장기전망 - 기후예측모델 - WMO 장기예보선도센터 /weather/long-term/climate-predict-wmo.do 
 */
'use strict';
(function($, window, document){
    GlobalEvent.on('TEST_EVENT', function(e, sender) {
    
    });
//    cilmateImageInfo.put("mme_scm__HGT500mb_Global", ClimateImageProperty.createPredictionProperty("WMO 기후예측모델", "500hPa 지위고도 편차", "mme_scm_", "/forecast/gpc/hgt500mb", "yyyyMM", new String[] {"Apr","May","Jun"}, "_HGT500mb_Global.png"));
//	cilmateImageInfo.put("mme_scm__TMP2m_Global", ClimateImageProperty.createPredictionProperty("WMO 기후예측모델", "지상기온 편차", "mme_scm_", "/forecast/gpc/tmp2m", "yyyyMM", new String[] {"Apr","May","Jun"}, "_TMP2m_Global.png"));
//	cilmateImageInfo.put("mme_scm__APCP0m_Global", ClimateImageProperty.createPredictionProperty("WMO 기후예측모델", "강수량 편차", "mme_scm_", "/forecast/gpc/apcp0m", "yyyyMM", new String[] {"Apr","May","Jun"}, "_APCP0m_Global.png"));
//	
    var TYPE_DATA = {
        "m3": [
            ["mme_scm__HGT500mb_Global", "500hPa 지위고도 편차"],
            ["mme_scm__TMP2m_Global", "지상기온 편차"],
            ["mme_scm__APCP0m_Global", "강수량 편차"],
        ]
    }
    var TERM = {
    	"m" : [
        	["m01", "+1월"],
        	["m02", "+2월"],
        	["m03", "+3월"],
        ]
    }
    var player = new ImagePlayer("image-player-wrapper",null, {
        type: "climate_predict",
        showOptionControl: true,
        showOption: false,
        timeTerm: parseFloat("5"),
        interval: parseFloat("0.5"),
        autoStart: false, 
        zoomLevel: "0",
        zoomX: "0000000",
        zoomY: "0000000",
        zoomEnabled: false,
        panZoomEnabled: true,
        singleLineLimit: 0,
        isForecast: true,
        form: {
            type: {
                value: "m3",
                onchange: function(e, obj, player) {
                	var type = obj.value;
                	console.log(type);
                	if(type == "m3") {
                		var html = "";
                        for(var i in TERM["m"]) {
                            var values = TERM["m"][i];
                            html += '<option value="' + values[0] + '">' + values[1] + '</option>';
                        }
                        $(obj.form.target).html(html);
                	} else {
                		$(obj.form.target).hide();
                	}
                    if(TYPE_DATA[type]) {
                        var html = "";
                        for(var i in TYPE_DATA[type]) {
                            var values = TYPE_DATA[type][i];
                            html += '<option value="' + values[0] + '">' + values[1] + '</option>';
                        }
                        $(obj.form.data).html(html);
                        if(TYPE_DATA[type].length == 0) {
                            $(obj.form.data).parents('.cho-wrap01').first().hide();
                        } else {
                            $(obj.form.data).parents('.cho-wrap01').first().show();
                        }
                    }
                    $(obj.form.tm).val('');
                    player._updateNow();
                }
            },
            data: {
                value: "mme_scm__HGT500mb_Global",
                onchange: function(e, obj, player) {
                    player._update();
                }
            },
            target: {
                onchange: function(e, obj, player) {
                    player._update();
                }
            }
        }
    });
    function minHeightImageWrap() {
        var $imageWrap = $('.image-player-slide');
        var width = $imageWrap.width();
        $imageWrap.css({'height':'auto', 'min-height':'auto', 'overflow':'hidden'});
    }
    $(window).on('resize', function(e) {
        minHeightImageWrap();
    });
    minHeightImageWrap();
    addSwitchToggleEvent('.switch-toggle');
})(jQuery, window, document);
