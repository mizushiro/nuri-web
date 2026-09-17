/**
 *  날씨 - 장기전망 - 기후감시요소 /weather/long-term/climate-monitoring.do 
 */
'use strict';
(function($, window, document){
    GlobalEvent.on('TEST_EVENT', function(e, sender) {
    
    });
    var TYPE_DATA = {
        "cos_enso_": [
            ["oisst_spat_sstaidx_week_", "주별 해수면온도 편차"],
            ["ersstv5_spat_ssta_1mon_", "월별 해수면온도 편차"],
            ["ersstv5_enso_table", "엘니뇨·라니냐"],

        ],
        "cos_telc_nsidc_": [
            ["sicespatnps_spat_nps_1day_", "일별 북극해빙 분포"],
            ["sicespatnps_spat_nps_mon_", "월별 북극해빙 분포"],
            ["sicetsnps_ts_nps_1day_", "면적 변화 시계열"],
        ],
        "cos_telc_ncep_ao_": [
            ["aovert_65n90n_1day_", "북극진동 시계열"],
            ["tano_vert_65n90n_1day_", "북극지역 기온 편차의 연직분포 변화"],
        ],
        "cos_telc_ncep_snow_rutgers_snowa_": [
            ["spat_1day_", "일 눈덮임 편차 분포"],
            ["spat_1mon_", "월별 눈덮임 편차 분포"],
        ],
        "cos_ncep_oano_": [
            ["spat_top_gl_day_", "최근 7일 지구장파복사 편차 분포"],
            ["spat_top_gl_mon_", "월별 지구장파복사 편차 분포"],
        ],
        "cos_telc_ncep_qbo_ts_1mon_": [
        
        ],
        "cos_ncep_hano_": {
        	w: [
                ["spat_500_gl_week_", "500hPa 지위고도 분포"],
                ["spat_slp_gl_week_", "해면기압 분포"],
                ["ta2mspat_2m_gl_week_", "지상기온 편차 분포"],
            ],
            m: [
                ["spat_500_gl_mon_", "500hPa 지위고도 분포"],
                ["spat_slp_gl_mon_", "해면기압 분포"],
                ["ta2mspat_2m_gl_mon_", "지상기온 편차 분포"],
            ],
        }
    }
    
    var player = new ImagePlayer("image-player-wrapper",null, {
        type: "climate_monitoring",
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
        isForecast: false,
        form: {
            type: {
                value: "cos_enso_",
                onchange: function(e, obj, player) {
                	if(obj.value == "cos_ncep_hano_") {
                		$(obj.form.term).parents('.cho-wrap01').show();
                		obj.form.term.selectedIndex = 0;
                		var term = obj.form.term.value;
                		if(TYPE_DATA[obj.value][term]) {
                            var html = "";
                            for(var i = 0 ; i < TYPE_DATA[obj.value][term].length ; i++) {
                                var values = TYPE_DATA[obj.value][term][i];
                                html += '<option value="' + values[0] + '">' + values[1] + '</option>';
                            }
                            $(obj.form.data).html(html);
                            if(TYPE_DATA[obj.value][term].length == 0) {
                                $(obj.form.data).parents('.cho-wrap01').first().hide();
                            } else {
                                $(obj.form.data).parents('.cho-wrap01').first().show();
                            }
                        }
                	} else {
                		$(obj.form.term).parents('.cho-wrap01').hide();
                		if(TYPE_DATA[obj.value]) {
                            var html = "";
                            for(var i = 0 ; i < TYPE_DATA[obj.value].length ; i++) {
                                var values = TYPE_DATA[obj.value][i];
                                html += '<option value="' + values[0] + '">' + values[1] + '</option>';
                            }
                            $(obj.form.data).html(html);
                            if(TYPE_DATA[obj.value].length == 0) {
                                $(obj.form.data).parents('.cho-wrap01').first().hide();
                            } else {
                                $(obj.form.data).parents('.cho-wrap01').first().show();
                            }
                        }
                	}
                    $(obj.form.tm).val('');
                    player._updateNow();
                }
            },
            data: {
                value: "oisst_spat_sstaidx_week_",
                onchange: function(e, obj, player) {
                    player._update();
                }
            },
            target: {
                onchange: function(e, obj, player) {
                    player._update();
                }
            },
            term: {
                onchange: function(e, obj, player) {
                	var term = obj.value;
                	var type = obj.form.type.value;
            		if(TYPE_DATA[type][term]) {
                        var html = "";
                        for(var i = 0 ; i < TYPE_DATA[type][term].length ; i++) {
                            var values = TYPE_DATA[type][term][i];
                            html += '<option value="' + values[0] + '">' + values[1] + '</option>';
                        }
                        $(obj.form.data).html(html);
                        if(TYPE_DATA[type][term].length == 0) {
                            $(obj.form.data).parents('.cho-wrap01').first().hide();
                        } else {
                            $(obj.form.data).parents('.cho-wrap01').first().show();
                        }
                    }
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
