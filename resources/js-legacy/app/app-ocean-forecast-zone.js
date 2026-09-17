/**
 *  바다 - 바다예보 - 유의파고  (url: /ocean/forecast/wave-height)
 */
'use strict';

var unit = {
	ws: 'km/h'
}
var gOptions = store.get("W_AC");
if(gOptions) {
	unit.ws = gOptions.unit.ws;
}
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		window.location.reload();
	});
	/*
	 * b : 유의파고
	 * c : 파향
	 * d : 파주기
	 * e : 풍속
	 * f : 풍향
	 */
	var marineZoneForecast = new MarineZoneForecast('marine-zone-forecast');
})(jQuery, window, document);

function getWindSpeedUnit() {
	return unit.ws;
}
function getWindSpeed(msValue, showUnit, prefix, suffix, roundCount) {
	if(!msValue || isNaN(msValue)) return "";
	if(prefix == null) prefix = "";
	if(suffix == null) suffix = "";
	if(roundCount != null && roundCount > 0) {
		var multi = 10;
		for(var i = 1 ; i < roundCount ; i++) {
			multi *= 10;
		}
		if(unit.ws == 'km/h') {
			if(showUnit) {
				return prefix + Math.round(parseFloat(msValue) * multi * 3.6)/multi + 'km/h' + suffix;
			} else {
				return prefix + Math.round(parseFloat(msValue) * multi * 3.6)/multi + suffix;
			}
		} else {
			if(showUnit) {
				return prefix + Math.round(parseFloat(msValue) * multi)/multi + 'm/s' + suffix;
			} else {
				return prefix + Math.round(parseFloat(msValue) * multi)/multi + suffix;
			}
		}
	} else {
		if(unit.ws == 'km/h') {
			if(showUnit) {
				return prefix + Math.round(parseFloat(msValue) * 3.6) + 'km/h' + suffix;
			} else {
				return prefix + Math.round(parseFloat(msValue) * 3.6) + suffix;
			}
		} else {
			if(showUnit) {
				return prefix + Math.round(parseFloat(msValue)) + 'm/s' + suffix;
			} else {
				return prefix + Math.round(parseFloat(msValue)) + suffix;
			}
		}
	}
}
