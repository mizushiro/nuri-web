/**
 * Bookmark 초단기 강수 예측 텍스트( 10분강수 이용)
 * 
 */
'use strict';
(function($, window, document){
	var DEFAULT_OPTIONS={
		
	},
	VsrtRainText = function(opts) {
		if(typeof jQuery === 'undefined') {
			alert('jQuery required!');
		}
		if(typeof store === 'undefined') {
			alert('store.js required!');
		}
		if(typeof Mustache === 'undefined') {
			alert('mustache.js required!');
		}
		var base = this;
		base.options = Object.assign({}, DEFAULT_OPTIONS);
		if(opts) base.options = Object.assign({}, opts);
			
		base.addEventHandler();	
	};
	/* 강수 여부를 강수량 0.1 mm 이상으로 변경.*/
	function makeRainText(data, isRainNow, x, y, dates) {
		var txt = "";
		if(!data || !data.data) return txt;
		var rainExists = false;
		var results = data.data.resultList;
		var startIndex = 0;

		for(var i = 0 ; i < results.length ; i++) {
			var item = results[i];
			item[0] = moment(item[0], 'YYYY[.]MM[.]DD[.]HH[:]mm').add('minutes', -10).format('YYYY[.]MM[.]DD[.]HH[:]mm');
			results[i] = item;
		}
		var startFound = false;
		for(var i = startIndex; i < results.length ; i++) {
			var item = results[i];
			if(item[1] == "+000min") {
				startIndex = i;
				startFound = true;
				break;
			}
		}
		// 실황은 사용하지 않음.(ODAM 의 그것을 사용)
		if(startFound) startIndex++;
		var lastIndex = startIndex + 36;
		for(var i = lastIndex ; i > startIndex ; i--) {
			var item = results[i];
			if(typeof dates[item[0].substring(0,13)] != "undefined") {
				lastIndex = i;
				break;
			}
		}
		for(var i = startIndex; i <= lastIndex ; i++) {
			var item = results[i];
			if(item[2] > 0 && !!dates[item[0].substring(0,13)]) {
				rainExists = true;
				break;
			}
		}
		console.log("isRainNow", isRainNow);
		console.log("startIndex", startIndex);
		console.log("lastIndex", lastIndex);
		var NO_RAIN_COUNT = 1;
		if(rainExists) {
			txt = "";
			//실황
			var rainStartIndex = -1;
			var rainEndIndex = -1;
			if(isRainNow) {
				// 현재시각 비가 오고 있을 경우
				rainStartIndex = startIndex;
				// 비가 그치는 시각 찾음
				for(var i = startIndex, noRainBucket = 0; i < lastIndex ; i++) {
					var item = results[i];
					if(item[2] <= 0 || !dates[item[0].substring(0,13)]) {
						noRainBucket++;
					} else {
						noRainBucket = 0;
					}
					if(noRainBucket >= NO_RAIN_COUNT) {
						rainEndIndex = i - NO_RAIN_COUNT - 1;
						break;
					}
				}
			} else {
				// 현재시각 비가 오지 않고 있을 경우
				// 비가 시작되는 시각을 찾음.
				for(var i = startIndex; i < lastIndex ; i++) {
					var item = results[i];
					if(item[2] > 0 && !!dates[item[0].substring(0,13)]) {
						rainStartIndex = i;
						break;
					}
				}
				//비가 시작되었을 경우. 비가 그치는 시각 찾음.
				if(rainStartIndex > -1) {
					for(var i = rainStartIndex + 1, noRainBucket = 0; i < lastIndex ; i++) {
						var item = results[i];
						if(item[2] <= 0 || !dates[item[0].substring(0,13)]) {
							noRainBucket++;
						} else {
							noRainBucket = 0;
						}
						if(noRainBucket >= NO_RAIN_COUNT) {
							rainEndIndex = i - NO_RAIN_COUNT - 1;
							break;
						}
					}
				}
			}
			var isRainAfterEnd = false;
			var rainRestartIndex = -1;
			if(rainEndIndex > -1) {
				for(var i = rainEndIndex+1; i <= lastIndex ; i++) {
					var item = results[i];
					// 다시 비가 오는 경우는 초단기예보만 체크.
					//if(item[2] > 0 && !!dates[item[0].substring(0,13)]) {
					if(!!dates[item[0].substring(0,13)]) {
						isRainAfterEnd = true;
						rainRestartIndex = i;
						break;
					}
				}
			}
			
			console.log("rainStartIndex", rainStartIndex);
			console.log("rainEndIndex", rainEndIndex);
			console.log("rainRestartIndex", rainRestartIndex);
			if(rainStartIndex > -1 
				&& rainEndIndex > -1 
				&& rainEndIndex <= rainStartIndex) {
				rainEndIndex = rainStartIndex + 1;
			}
			if(rainStartIndex > -1 
				&& rainEndIndex > -1 
				&& rainRestartIndex > -1 
				&& rainRestartIndex <= rainEndIndex) {
				rainRestartIndex = rainEndIndex + 1;
			}
			
			if(lastIndex > -1) {
				if(isRainNow) {
					if(rainEndIndex == -1) {
						txt += "지금 내리는 비는 " + (moment(results[lastIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('HH[시]mm[분]')) + " 이후까지 지속 예상.";
					} else {
						if(isRainAfterEnd) {
							txt += "지금 내리는 비는 " + (moment(results[rainEndIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('HH[시]mm[분]')) + "에 잠시 그쳤다가 " + 
									(moment(results[rainRestartIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('HH[시]mm[분]')) + "에 다시 시작되겠음.";
						} else {
							txt += "지금 내리는 비는 " + (moment(results[rainEndIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('HH[시]mm[분]')) + "에 그칠 것으로 예상됨.";	
						}
					}
				} else {
					if(rainEndIndex == -1) {
						txt += (moment(results[rainStartIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('HH[시]mm[분]')) + "에 비가 시작되어 " + 
								(moment(results[lastIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('H[시]mm[분]')) + " 이후까지 지속 예상됨.";
					} else {
						if(isRainAfterEnd) {
							txt += (moment(results[rainStartIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('HH[시]mm[분]')) + "에 비가 시작되어 " + 
									(moment(results[rainEndIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('H[시]mm[분]')) + "에 잠시 그쳤다가 " +
									(moment(results[rainRestartIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('H[시]mm[분]')) + "에 다시 시작되겠음." ;
						} else {
							txt += (moment(results[rainStartIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('HH[시]mm[분]')) + "에 비가 시작되어 " + 
									(moment(results[rainEndIndex][0], 'YYYY[.]MM[.]DD[.]HH[:]mm').format('H[시]mm[분]')) + "에 그칠 것으로 예상됨.";
						}
					}
				}
			}
		}
		return txt;
	}
	VsrtRainText.prototype = {
		updateRainDescription: function(isRainNow, x, y, dates) {
			var base = this;
			base.requestVsrtRain(x,y).then(function(data, success) {
				var rainText = makeRainText(data, isRainNow, x, y, dates);
				if(rainText) {
					$('.weather-cont-wrap').addClass('rain-attached');
					$('.rain-content').html(rainText);
					$('.rain-content').show();
				} else {
					$('.weather-cont-wrap').removeClass('rain-attached');
					$('.rain-content').empty().hide(); 
				}
			});
		},
		
		error: function() {
			var base = this;
			return function(request, status) {
				if(console) console.log(request, status);
			};
		},
		getPrefix: function() {
			if(window.appBase) {
				return window.appBase;
			} else {
				return "/";
			}
		},
		
		requestVsrtRain: function(x,y) {
			var base = this;
			var tm = moment().utc().format("YYYYMMDDHHmm");
			var data = {
				tm: tm,
				lat: "",
				lon: "",
				x: x,
				y: y,
				disp: "V",
				type: "BLND"
			};
			var url = "https://vapi.kma.go.kr/capi/url/vs_prcp_blnd_pt_txt1.php";
			if(window.vmapBaseUrl.indexOf("devvmap") > -1) {
				url = "https://devvapi.kma.go.kr/capi/url/vs_prcp_blnd_pt_txt1.php";
			}
			return $.ajax({
				url: url,
				data: data,
				dataType: "json"
			});
		},
		addEventHandler: function() {
			var base = this;		
		}
	};
	if (typeof exports !== 'undefined') exports.VsrtRainText = VsrtRainText;
	else window.VsrtRainText = VsrtRainText;
})(jQuery, window, document);


