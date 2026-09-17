var legends = {};
var EventBus = new Vue();
// 설정에서 단위 변경시
// EventBus.$emit('config', { unit: unit.ws, unitValue: unit.ws === "km/h" ? 3.6 : 1 }); 
function createLegend(mapId, opts) {
	var wsUnit = "m/s";
	if(appConfig && appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
		wsUnit = appConfig.config.unit.ws;
	}
	var options = {
		el: '#legend',
		units : { ws: wsUnit }
	};
	
	if(opts ) options = Object.assign(options, opts);
	var lg = new Vue({
	    el: options.el,
	    data: {
	        fold: false,
	        config: { unit: "km/h", unitValue: 3.6 },
	        legends: {
	            FOG: {
	                title: "FOG", display: false, width: 8, height: 200, unit: "온도차", class: "dense",
	                attributes: [
	                    {key: "0.0", label: "안개", color: "rgba(255,255,255,0)", visible: true},
	                    {key: "0.0", label: "0", color: "rgba(255,0,0,255)", visible: true},
	                    {key: "1.0", label: "1", color: "rgba(192,0,0,255)", visible: true},
	                    {key: "2.0", label: "2", color: "rgba(255,192,0,255)", visible: true},
	                    {key: "3.0", label: "3", color: "rgba(255,255,0,255)", visible: true},
	                    {key: "4.0", label: "4", color: "rgba(0,176,80,255)", visible: true},
	                    {key: "5.0", label: "5", color: "rgba(146,208,80,255)", visible: true},
	                    {key: "0.0", label: "저층운", color: "rgba(255,255,255,0)", visible: true}
	                ]
	            },
	            ADPS: {
	                title: "ADPS", display: false, width: 8, height: 200, unit: "",
	                attributes: [
	                    {key: "1.0", label: "", color: "rgba(0,255,0,255)", visible: true},
	                    {key: "2.0", label: "화산재", color: "rgba(0,115,0,255)", visible: true},
	                    {key: "3.0", label: "", color: "rgba(255, 170, 0, 255)", visible: true},
	                    {key: "3.4", label: "", color: "rgba(232, 154, 0, 255)", visible: true},
	                    {key: "3.8", label: "황사", color: "rgba(209, 139, 0, 255)", visible: true},
	                    {key: "4.2", label: "", color: "rgba(186, 124, 0, 255)", visible: true},
	                    {key: "4.6", label: "", color: "rgba(143, 95, 0, 255)", visible: true},
	                    {key: "5.0", label: "", color: "rgba(255, 0, 0, 255)", visible: true},
	                    {key: "5.2", label: "", color: "rgba(220, 0, 0, 255)", visible: true},
	                    {key: "5.4", label: "연무", color: "rgba(186, 0, 0, 255)", visible: true},
	                    {key: "5.6", label: "", color: "rgba(152, 0, 0, 255)", visible: true},
	                    {key: "5.8", label: "", color: "rgba(84, 0, 0, 255)", visible: true}
	                ]
	            },
	            lgt: {
	                title: "lgt", display: false, width: 8, height: 200, unit: "시각",
	                attributes: [
	                    {key: "0", label: "00:00", color: "red", visible: true},
	                    {key: "1", label: "00:00", color: "purple", visible: true},
	                    {key: "2", label: "00:00", color: "blue", visible: true},
	                    {key: "3", label: "00:00", color: "aqua", visible: true},
	                    {key: "4", label: "00:00", color: "green", visible: true},
	                    {key: "5", label: "00:00", color: "yellow", visible: true}
	                ]
	            },
	            "rww-b": {
	                title: "rww-b", type: "rww", display: false, width: 8, height: 320, unit: "m", class: "dense half",
	                attributes: [
	                    {key: "100", label: "", color: "#3D8544", visible: true},
	                    {key: "95", label: "9.5", color: "#8533FF", visible: true},
	                    {key: "90", label: "9.0", color: "#3385FF", visible: true},
	                    {key: "85", label: "8.5", color: "#33A9FF", visible: true},
	                    {key: "80", label: "8.0", color: "#33EA33", visible: true},
	                    {key: "75", label: "7.5", color: "#C247FF", visible: true},
	                    {key: "70", label: "7.0", color: "#D670FF", visible: true},
	                    {key: "65", label: "6.5", color: "#EAADFF", visible: true},
	                    {key: "60", label: "6.0", color: "#AD3333", visible: true},
	                    {key: "55", label: "5.5", color: "#EA4733", visible: true},
	                    {key: "50", label: "5.0", color: "#FF926F", visible: true},
	                    {key: "45", label: "4.5", color: "#FFCAA0", visible: true},
	                    {key: "40", label: "4.0", color: "#EDED84", visible: true},
	                    {key: "35", label: "3.5", color: "#FFFF4C", visible: true},
	                    {key: "30", label: "3.0", color: "#94ED83", visible: true},
	                    {key: "25", label: "2.5", color: "#B8FFA7", visible: true},
	                    {key: "20", label: "2.0", color: "#81AEFF", visible: true},
	                    {key: "15", label: "1.5", color: "#94C1FF", visible: true},
	                    {key: "10", label: "1.0", color: "#CAE4FF", visible: true},
	                    {key: "05", label: "0.5", color: "#E9F4FF", visible: true},
	                ]
	            },
	            "rww-d": {
	                title: "rww-d", type: "rww", display: false, width: 8, height: 320, unit: "m", class: "dense half",
	                attributes: [
	                    {key: "20", label: "", color: "#3D8544", visible: true},
	                    {key: "19", label: "19.0", color: "#853333", visible: true},
	                    {key: "18", label: "18.0", color: "#C23333", visible: true},
	                    {key: "17", label: "17.0", color: "#E133E1", visible: true},
	                    {key: "16", label: "16.0", color: "#FFADFF", visible: true},
	                    {key: "15", label: "15.0", color: "#FF5B4B", visible: true},
	                    {key: "14", label: "14.0", color: "#FF835B", visible: true},
	                    {key: "13", label: "13.0", color: "#FFAB7B", visible: true},
	                    {key: "12", label: "12.0", color: "#FFC393", visible: true},
	                    {key: "11", label: "11.0", color: "#FFDBAB", visible: true},
	                    {key: "10", label: "10.0", color: "#E4E470", visible: true},
	                    {key: "9", label: "9.0", color: "#FFFFA7", visible: true},
	                    {key: "8", label: "8.0", color: "#94ED83", visible: true},
	                    {key: "7", label: "7.0", color: "#B8FFA7", visible: true},
	                    {key: "6", label: "6.0", color: "#81AEFF", visible: true},
	                    {key: "5", label: "5.0", color: "#94C1FF", visible: true},
	                    {key: "4", label: "4.0", color: "#A5D2FF", visible: true},
	                    {key: "3", label: "3.0", color: "#CAE4FF", visible: true},
	                    {key: "2", label: "2.0", color: "#E4F6FF", visible: true},
	                    {key: "1", label: "1.0", color: "#FEFEFE", visible: true},
	                ]
	            },
	            "rww-ef": {
	                title: "rww-ef", type: "rww", display: false, width: 8, height: 365, unit: "m/s", class: "dense half",
	                attributes: [
	                    {key: "60", label: "60", color: "rgba(51,51,51,1)", visible: true},
	                    {key: "55", label: "55", color: "rgba(191,0,0,1)", visible: true},
	                    {key: "50", label: "50", color: "rgba(213,0,0,1)", visible: true},
	                    {key: "45", label: "45", color: "rgba(238,11,11,1)", visible: true},
	                    {key: "40", label: "40", color: "rgba(246,62,62,1)", visible: true},
	                    {key: "35", label: "35", color: "rgba(250,133,133,1)", visible: true},
	                    {key: "30", label: "30", color: "rgba(127,0,191,1)", visible: true},
	                    {key: "25", label: "25", color: "rgba(146,0,228,1)", visible: true},
	                    {key: "20", label: "20", color: "rgba(173,7,255,1)", visible: true},
	                    {key: "15", label: "15", color: "rgba(194,62,255,1)", visible: true},
	                    {key: "10", label: "10", color: "rgba(218,135,255,1)", visible: true},
	                    {key: "9", label: "9", color: "rgba(0,3,144,1)", visible: true},
	                    {key: "8", label: "8", color: "rgba(31,33,157,1)", visible: true},
	                    {key: "7", label: "7", color: "rgba(76,78,177,1)", visible: true},
	                    {key: "6.5", label: "6.5", color: "rgba(128,129,199,1)", visible: true},
	                    {key: "6", label: "6", color: "rgba(179,180,222,1)", visible: true},
	                    {key: "5.5", label: "5.5", color: "rgba(0,119,179,1)", visible: true},
	                    {key: "5", label: "5", color: "rgba(0,141,222,1)", visible: true},
	                    {key: "4.5", label: "4.5", color: "rgba(7,171,255,1)", visible: true},
	                    {key: "4", label: "4", color: "rgba(62,193,255,1)", visible: true},
	                    {key: "3.5", label: "3.5", color: "rgba(135,217,255,1)", visible: true},
	                    {key: "3", label: "3", color: "rgba(0,128,0,1)", visible: true},
	                    {key: "2.5", label: "2.5", color: "rgba(0,164,0,1)", visible: true},
	                    {key: "2", label: "2", color: "rgba(0,213,0,1)", visible: true},
	                    {key: "1.5", label: "1.5", color: "rgba(30,243,30,1)", visible: true},
	                    {key: "1", label: "1", color: "rgba(105,252,105,1)", visible: true},
	                    {key: "0.5", label: "0.5", color: "rgba(204,170,0,1)", visible: true},
	                    {key: "0", label: "0", color: "rgba(255,234,110,1)", visible: true},
	                ]
	           },
	            wrn: {
	                title: "wrn", display: false, width: 15, height: 200, margin: 4, unit: "",
	                attributes: [
	                    {key: "3", label: "해제", color: "rgb(220,220,220)", visible: false},
	                    {key: "C", label: "한파", color: "rgb(0,127,255)", visible: false},
	                    {key: "D", label: "건조", color: "rgb(255,127,0)", visible: false},
	                    {key: "F", label: "안개", color: "rgb(128,20,10)", visible: false},
	                    {key: "H", label: "폭염", color: "rgb(195,0,195)", visible: false},
	                    {key: "R", label: "호우", color: "rgb(0,0,255)", visible: false},
	                    {key: "S", label: "대설", color: "rgb(255,0,255)", visible: false},
	                    {key: "T", label: "태풍", color: "rgb(255,0,0)", visible: false},
	                    {key: "V", label: "풍랑", color: "rgb(0,255,255)", visible: false},
	                    {key: "W", label: "강풍", color: "rgb(0,240,0)", visible: false},
	                    {key: "Y", label: "황사", color: "rgb(255,255,0)", visible: false},
	                    {key: "O", label: "폭풍해일", color: "rgb(195,192,145)", visible: false},
	                    {key: "N", label: "지진해일", color: "rgb(195,150,100)", visible: false}
	                ]
	            },
	            ifs: {
	                title: "ifs", display: false, width: 15, height: 60, margin: 4, unit: "",
	                attributes: [
	                    {key: "1", label: "관심", color: "rgb(52,212,244)", visible: true},
	                    {key: "2", label: "주의", color: "rgb(253,220,30)", visible: true},
	                    {key: "3", label: "경고", color: "rgb(230,130,37)", visible: true},
	                    {key: "4", label: "위험", color: "rgb(184,25,31)", visible: true}
	                ]
	            },
	            pop: {
	                title: "pop", display: false, width: 10, height: 350, unit: "mm/h", class: "dense",
	                attributes: [
	                    {key: "110", label: "110", color: "rgb(51,51,51)", visible: true},
	                    {key: "90", label: "90", color: "rgb(0,3,144)", visible: true},
	                    {key: "80", label: "80", color: "rgb(76,78,177)", visible: true},
	                    {key: "70", label: "70", color: "rgb(179,180,222)", visible: true},
	                    {key: "60", label: "60", color: "rgb(147,0,228)", visible: true},
	                    {key: "50", label: "50", color: "rgb(179,41,255)", visible: true},
	                    {key: "40", label: "40", color: "rgb(201,105,255)", visible: true},
	                    {key: "30", label: "30", color: "rgb(224,169,255)", visible: true},
	                    {key: "25", label: "25", color: "rgb(180,0,0)", visible: true},
	                    {key: "20", label: "20", color: "rgb(210,0,0)", visible: true},
	                    {key: "15", label: "15", color: "rgb(255,50,0)", visible: true},
	                    {key: "10", label: "10", color: "rgb(255,102,0 )", visible: true},
	                    {key: "9", label: "9", color: "rgb(204,170,0)", visible: true},
	                    {key: "8", label: "8", color: "rgb(224,185,0)", visible: true},
	                    {key: "7", label: "7", color: "rgb(249,205,0)", visible: true},
	                    {key: "6", label: "6", color: "rgb(255,220,31)", visible: true},
	                    {key: "5", label: "5", color: "rgb(255,225,0)", visible: true},
	                    {key: "4", label: "4", color: "rgb(0,90,0)", visible: true},
	                    {key: "3", label: "3", color: "rgb(0,140,0)", visible: true},
	                    {key: "2", label: "2", color: "rgb(0,190,0)", visible: true},
	                    {key: "1", label: "1", color: "rgb(0,255,0)", visible: true},
	                    {key: "0.5", label: "0.5", color: "rgb(0,51,245)", visible: true},
	                    {key: "0.1", label: "0.1", color: "rgb(0,155,245)", visible: true},
	                    {key: "0", label: "0", color: "rgb(0,200,255)", visible: true}
	                ]
	            },
	            pty: {
	                title: "pty", display: false, width: 15, height: 60, margin: 4, unit: "",
	                attributes: [
	                    {key: "1", label: "눈", color: "rgb(255,95,255)", visible: true},
	                    {key: "2", label: "눈비", color: "rgb(93,255,255)", visible: true},
	                    {key: "3", label: "비", color: "rgb(46,96,255)", visible: true},
	                    {key: "4", label: "없음", color: "rgb(255,255,255)", visible: true}
	                ]
	            },
	            frc: {
	                title: "frc", display: false, width: 15, height: 45, margin: 4, unit: "",
	                attributes: [
	                    {key: "1", label: "3단계", color: "rgb(252,125,0)", visible: true},
	                    {key: "2", label: "2단계", color: "rgb(251,201,0)", visible: true},
	                    {key: "3", label: "1단계", color: "rgb(250,252,0)", visible: true}
	                ]
	            },
	            rdr_vi: {
	                title: "rdr_vi", display: false, width: 10, height: 200, class: "dense",
	                attributes: [
	                    {key: "300", label: " ", color: "rgb(152,84,198)", visible: true},
	                    {key: "60", label: "60", color: "rgb(218,135,255)", visible: true},
	                    {key: "30", label: "30", color: "rgb(238,11,11)", visible: true},
	                    {key: "10", label: "10", color: "rgb(255,204,0)", visible: true},
	                    {key: "5", label: "5", color: "rgb(0,128,0)", visible: true},
	                    {key: "2", label: "2", color: "rgb(0,176,0)", visible: true},
	                    {key: "1", label: "1", color: "rgb(4,233,231)", visible: true},
	                    {key: "0", label: "mm/h", visible: true},
	                    {key: "0", label: "낙뢰", color: "rgb(255,0,0)", visible: true}
	                ]
	            },
	            rdr_wv: {
	                title: "rdr_wi", display: false, width: 10, height: 200, class: "dense",
	                attributes: [
	                    {key: "300", label: " ", color: "rgb(152,84,198)", visible: true},
	                    {key: "60", label: "60", color: "rgb(218,135,255)", visible: true},
	                    {key: "30", label: "30", color: "rgb(238,11,11)", visible: true},
	                    {key: "10", label: "10", color: "rgb(255,204,0)", visible: true},
	                    {key: "5", label: "5", color: "rgb(0,128,0)", visible: true},
	                    {key: "2", label: "2", color: "rgb(0,176,0)", visible: true},
	                    {key: "1", label: "1", color: "rgb(4,233,231)", visible: true},
	                    {key: "0", label: "mm/h", visible: true},
	                    {key: "0", label: "낙뢰", color: "rgb(255,0,0)", visible: true}
	                ],
	            },
	            rdr_rain: {
	                title: "rdr_rain", display: false, width: 10, height: 350, unit: "mm/h", class: "dense",
	                attributes: [
	                    {key: "110", label: "110", color: "rgb(51,51,51)", visible: true},
	                    {key: "90", label: "90", color: "rgb(0,3,144)", visible: true},
	                    {key: "80", label: "80", color: "rgb(76,78,177)", visible: true},
	                    {key: "70", label: "70", color: "rgb(179,180,222)", visible: true},
	                    {key: "60", label: "60", color: "rgb(147,0,228)", visible: true},
	                    {key: "50", label: "50", color: "rgb(179,41,255)", visible: true},
	                    {key: "40", label: "40", color: "rgb(201,105,255)", visible: true},
	                    {key: "30", label: "30", color: "rgb(224,169,255)", visible: true},
	                    {key: "25", label: "25", color: "rgb(180,0,0)", visible: true},
	                    {key: "20", label: "20", color: "rgb(210,0,0)", visible: true},
	                    {key: "15", label: "15", color: "rgb(255,50,0)", visible: true},
	                    {key: "10", label: "10", color: "rgb(255,102,0 )", visible: true},
	                    {key: "9", label: "9", color: "rgb(204,170,0)", visible: true},
	                    {key: "8", label: "8", color: "rgb(224,185,0)", visible: true},
	                    {key: "7", label: "7", color: "rgb(249,205,0)", visible: true},
	                    {key: "6", label: "6", color: "rgb(255,220,31)", visible: true},
	                    {key: "5", label: "5", color: "rgb(255,225,0)", visible: true},
	                    {key: "4", label: "4", color: "rgb(0,90,0)", visible: true},
	                    {key: "3", label: "3", color: "rgb(0,140,0)", visible: true},
	                    {key: "2", label: "2", color: "rgb(0,190,0)", visible: true},
	                    {key: "1", label: "1", color: "rgb(0,255,0)", visible: true},
	                    {key: "0.5", label: "0.5", color: "rgb(0,51,245)", visible: true},
	                    {key: "0.1", label: "0.1", color: "rgb(0,155,245)", visible: true},
	                    {key: "0", label: "0", color: "rgb(0,200,255)", visible: true}
	                ]
	            },
	            rdr_po: {
	                title: "rdr_po", display: false, width: 10, height: 470, unit: "mm/h", class: "dense",
	                attributes: [
	                    {key: "200", label: "200", color: "rgb(51,51,51)", visible: true},
	                    {key: "100", label: "100", color: "rgb(0,3,144)", visible: true},
	                    {key: "90", label: "90", color: "rgb(31,33,157)", visible: true},
	                    {key: "80", label: "80", color: "rgb(76,78,177)", visible: true},
	                    {key: "70", label: "70", color: "rgb(128,129,199)", visible: true},
	                    {key: "60", label: "60", color: "rgb(179,180,222)", visible: true},
	                    {key: "50", label: "50", color: "rgb(127,0,191)", visible: true},
	                    {key: "40", label: "40", color: "rgb(146,0,228)", visible: true},
	                    {key: "35", label: "35", color: "rgb(173,7,255)", visible: true},
	                    {key: "30", label: "30", color: "rgb(194,62,255)", visible: true},
	                    {key: "25", label: "25", color: "rgb(218,135,255)", visible: true},
	                    {key: "20", label: "20", color: "rgb(191,0,0)", visible: true},
	                    {key: "18", label: "18", color: "rgb(213,0,0)", visible: true},
	                    {key: "16", label: "16", color: "rgb(238,11,11)", visible: true},
	                    {key: "14", label: "14", color: "rgb(246,62,62)", visible: true},
	                    {key: "12", label: "12", color: "rgb(250,133,133)", visible: true},
	                    {key: "10", label: "10", color: "rgb(204,170,0)", visible: true},
	                    {key: "9", label: "9", color: "rgb(224,185,0)", visible: true},
	                    {key: "8", label: "8", color: "rgb(249,205,0)", visible: true},
	                    {key: "7", label: "7", color: "rgb(255,220,31)", visible: true},
	                    {key: "6", label: "6", color: "rgb(255,234,110)", visible: true},
	                    {key: "5", label: "5", color: "rgb(0,128,0)", visible: true},
	                    {key: "4", label: "4", color: "rgb(0,164,0)", visible: true},
	                    {key: "3", label: "3", color: "rgb(0,213,0)", visible: true},
	                    {key: "2", label: "2", color: "rgb(30,243,30)", visible: true},
	                    {key: "1.5", label: "1.5", color: "rgb(105,252,105)", visible: true},
	                    {key: "1.0", label: "1.0", color: "rgb(0,119,179)", visible: true},
	                    {key: "0.8", label: "0.8", color: "rgb(0,141,222)", visible: true},
	                    {key: "0.6", label: "0.6", color: "rgb(7,171,255)", visible: true},
	                    {key: "0.4", label: "0.4", color: "rgb(62,193,255)", visible: true},
	                    {key: "0.2", label: "0.2", color: "rgb(135,217,255)", visible: true},
	                    {key: "0.0", label: "0.0", color: "rgb(250,250,250)", visible: true}
	                ]
	            }
	        },
	        default: {
	            title: "dfs", display: false, width: 10, height: 300, unit: "",
	            attributes: []
	        }
	    },
	    created: function() {
	        // 이벤트 구독 - 픙속
	        EventBus.$on('config', this.onReceiveConfig);
	    },
	    methods:{
	        onReceiveConfig: function(object) {
	            this.config = object;
	        },
	        calcHeigth: function(legend) {
	            return (legend.height / legend.attributes.length);
	        },
	        setLegend: function(key, visible, data, opts) {
	            var legend = this.legends[key];
	
	            if(!legend && data) {	// 범례가 없으면 생성
	                var value = Object.assign({}, this.default, {title: key});
	                Vue.set(this.legends, key, value);
	                legend = this.legends[key];
	            }
	            if(legend) {
	                legend.display = visible;
	                if(visible && data) {
	                	var options = { interval: 10 };
	                	if(opts) options = Object.assign(options, opts);
	                    this.setAttributes(key, data, legend, options);
	                }
	            }
	        },
	        setAttributes: function(key, data, legend, options) {
	            switch(key) {
	            case "lgt":
	                // label
	                for(var i=0; i<6; i++) {
	                    var nextTime = data.toString().slice(15,21);
	                    legend.attributes[i].label = nextTime;
	                    data.setMinutes(data.getMinutes() - options.interval);
	                }
	                break;
	            case "wrn":
	                // visible
	                var count = 0;
	                legend.attributes.forEach(function(attribute) {
	                    var visible = (data.indexOf(attribute.key) > -1);
	                    attribute.visible = visible;
	                    if(visible) count++;
	                });
	                if(count === 0) {
	                    legend.display = false;
	                    return false;
	                }
	                legend.height = (legend.width * legend.attributes.length);
	                break;
	            default:
	                legend.attributes = [];
	                legend.unit = data.unit;
	                for(var j = data.color.length-1; j >= 0; j--) {
	                    var attr = {
	                        key: j,
	                        color: data.color[j],
	                        label: data.label[j],
	                        visible: true
	                    }
	                    legend.attributes.push(attr);
	                }
	            }
	        },
	        getPaletteId: function(id, date){ //date: kst
	            var paletteId = "";
	            switch (id) {
	                case "WCT":
	                case "TMP":
	                    date.setHours(date.getHours() + 9);
	                    var month = new Date(date).getMonth() + 1;
	                    if(3 <= month && month < 6) {  //3 4 5
	                        paletteId = "E_IDFE_T_3";
	                    }else if(6 <= month && month < 9) { // 6 7 8
	                        paletteId = "E_IDFE_T_6";
	                    }else if(9 <= month && month < 12) { // 9 10 11
	                        paletteId = "E_IDFE_T_9";
	                    }else {                   // 12 1 2
	                        paletteId = "E_IDFE_T_12";
	                    }
	                    break;
	                case "REH":
	                    paletteId = "E_IDFE_RH";
	                    break;
	                case "PCP":
	                    paletteId = "E_IDFE_RN";
	                    break;
	                case "PTY":
	                    paletteId = "E_IDFE_PT";
	                    break;
	                case "SNO":
	                    paletteId = "E_IDFE_FSC";
	                    break;
	                case "WAV":
	                    paletteId = "E_IDFE_SWH";
	                    break;
	                case "WSD":
	                case "UVWSD":
	                    paletteId = "E_IDFE_WS";
	                    break;
	                default :
	                    paletteId = "E_IDFE_"+id;
	            }
	            return paletteId;
	        },
	        getPaletteById: function(legendId) {
	            var data;
	            for(var i in dfsLegends) {
	            	var legend = dfsLegends[i];
	                if(legend.id === legendId) {
	                    data = legend; break;
	                }
	            }
	            return data;
	        },
	        foldUnfold: function() {
	            this.fold = !this.fold;
	        }
	    }
	});
	legends[mapId] = lg;
	return lg;
}