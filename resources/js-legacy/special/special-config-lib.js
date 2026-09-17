/**
 * 특별기상지원 탭 적용
 
 설정 샘플 
 
    {
        "forestfire": {
            "enable": false
        },
        "marineaccident": {
            "enable": false
        },
        "newyear": {
            "enable": false,
            "datePeriod": {
                "start": "2022-02-01 09:00",
                "end": "2022-02-09 00:00"
            }
        },
        "summer": {
            "enable": false,
            "datePeriod": {
                "start": "2021-07-01 09:00",
                "end": "2021-08-01 00:00"
            }
        },
        "chuseok": {
            "enable": true,
            "datePeriod": {
                "start": "2021-10-01 09:00",
                "end": "2021-10-21 00:00"
            }
        },
        "csat": {
            "enable": false,
            "datePeriod": {
                "start": "2021-11-01 09:00",
                "end": "2021-12-01 00:00"
            }
        },
        "sunrise": {
            "enable": false,
            "datePeriod": {
                "start": "2021-12-25 09:00",
                "end": "2022-01-02 00:00"
            }
        }
    }
 */
'use strict';
var SPECIAL_ENV = {
    "forestfire": {
        "target": "_blank",
        "link": "https://www.weather.go.kr/w/special/forest-fire/index.do",
        "name": "산불 기상지원",
        "label": "산불사고"
    },
    "marineaccident": {
        "target": "_blank",
        "link": "https://www.weather.go.kr/w/special/marine-accident/index.do",
        "name": "해양사고 기상지원",
        "label": "해양사고"
    },
    "newyear": {
        "target": "_blank",
        "link": "https://www.weather.go.kr/w/special/newyear/index.do",
        "name": "설연휴 특별기상지원",
        "label": "설연휴"
    },
    "summer": {
        "target": "_blank",
        "link": "https://www.weather.go.kr/w/special/summer/index.do",
        "name": "하계교통대책기간 기상지원",
        "label": "<span>하계</span><span>교통지원</span>"
    },
    "chuseok": {
        "target": "_blank",
        "link": "https://www.weather.go.kr/w/special/chuseok/index.do",
        "name": "추석연휴 특별기상지원",
        "label": "추석연휴"
    },
    "csat": {
        "target": "_blank",
        "link": "https://www.weather.go.kr/w/special/csat/index.do",
        "name": "수능시험 특별기상지원",
        "label": "수능시험"
    },
    "sunrise": {
        "target": "_blank",
        "link": "https://www.weather.go.kr/w/special/sunrise/index.do",
        "name": "해돋이·해넘이 기상지원",
        "label": "<span>해돋이</span><span>해넘이</span>"
    }
};

function applySpecialConfig(config) {
    if(!config) return;
    var $tabs = $('.cmp-main-tabs');
    var specialTabEnabled = false;
    for(var configKey in config) {
        var configItem = config[configKey];
        var configItemEnabled = false;
        if(configItem.enable) {
            if(typeof configItem.datePeriod === "object") {
                // 기간 설정
                try {
	                var start = moment(configItem.datePeriod.start, 'YYYY-MM-DD HH:mm');
	                var end = moment(configItem.datePeriod.end, 'YYYY-MM-DD HH:mm');
	                var now = moment();
	                if(now.isAfter(start) && now.isBefore(end)) {
	                   configItemEnabled = true;
	                }
	           }catch(e) {
	               console.log(e);
	               configItemEnabled = false;
	           }
            } else {
                configItemEnabled = true;
            }
        }
        if(configItemEnabled) {
            specialTabEnabled = true;
            var specialItem = SPECIAL_ENV[configKey];
            if(!specialItem) continue;
            var $tabsOn = $('.cmp-main-tabs > .tab-item');
            var $newTab = $('<div class="tab-item">');
            $newTab.append('<h2 class="tab-head sp-tab-head sp-' + configKey + '"><a href="' + specialItem.link + '" class="no-tab-content" target="' + specialItem.target + '" title="' + (specialItem.target == '_blank' ? '새창열림' : '') + '">' + specialItem.label + '</a></h2>').appendTo($tabs);
        }
    }
    if(specialTabEnabled) {
        if(!$tabs.hasClass('sp-tab-enabled')) {
            $tabs.addClass('sp-tab-enabled');
        }
    }
    
}
