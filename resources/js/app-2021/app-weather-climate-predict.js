/**
 *  날씨 - 장기전망 - 기후예측모델 - 한국기상청 /weather/long-term/climate-predict.do 
 */
'use strict';
(function($, window, document){
    GlobalEvent.on('TEST_EVENT', function(e, sender) {
    
    });
    var TYPE_DATA = {
        "m1": [
            ["prod_gskr_1mon_hano_spat_500_nps_fcst_", "500hPa 지위고도 편차"],
            ["prod_gskr_1mon_tano_spat_2m_gl_fcst_", "지상기온 편차"],
            ["prod_gskr_1mon_rano_spat_sfc_gl_fcst_", "강수량 편차"],
            ["prod_gskr_1mon_wdspa_wdvc_200_gl_fcst_", "200hPa 바람 편차"],
            ["prod_gskr_1mon_wdspa_wdvc_850_gl_fcst_", "850hPa 바람 편차"],
        ],
        "m3": [
            ["prod_gskr_6mon_hano_spat_500_nps_fcst_", "500hPa 지위고도 편차"],
            ["prod_gskr_6mon_tano_spat_2m_gl_fcst_", "지상기온 편차"],
            ["prod_gskr_6mon_rano_spat_sfc_gl_fcst_", "강수량 편차"],
            ["prod_gskr_6mon_wdspa_wdvc_200_gl_fcst_", "200hPa 바람 편차"],
            ["prod_gskr_6mon_wdspa_wdvc_850_gl_fcst_", "850hPa 바람 편차"],
        ]
    }
    var TERM = {
    	"w" : [
    		["w03", "+1주"],
    		["w04", "+2주"],
    		["w05", "+3주"],
    		["w06", "+4주"],
    	],
    	"m" : [
    		["m01", "+1월"],
    		["m02", "+2월"],
    		["m03", "+3월"],
    	],
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
                value: "m1",
                onchange: function(e, obj, player) {
                	var type = obj.value;
                	console.log(type);
                	if(type == "m1") {
                		 var html = "";
                         for(var i in TERM["w"]) {
                             var values = TERM["w"][i];
                             html += '<option value="' + values[0] + '">' + values[1] + '</option>';
                         }
                         $(obj.form.target).html(html);
                	} else if(type == "m3") {
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
                value: "hano_spat_500_nps_fcst_prod_gskr_1mon_",
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
