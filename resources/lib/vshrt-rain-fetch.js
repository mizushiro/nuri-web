function vshrtRainFetch(vmap, options, onComplete) {
	$.ajax({ url: 'https://vapi.kma.go.kr/capi/url/vs_10minutes_rain_timeline.php?tm=' + options.tm, dataType: 'json'}).then(function(data) {
		var count = 0;
		var radar = { urls: [], opacity: options.opacity };
		var times = data.data.times;
		var completed = false;
		
		for (var i = 0; i < times.length && i < 13; i++) {
	        // keyHeader: ["resdate", "restime", "min", "exists"]
	        var time = times[i];
	        var exists = (time[3] === 1);
	        if (exists) {
	            var url = "https://vapi.kma.go.kr/capi/url/vs_qpf_web_img.php?option=0&size=1453&zoom_level=0&zoom_x=0000000&zoom_y=0000000&disp=X&h_yn=Y"
	                    + '&tm=' + time[0] + time[1] + '&ef=' + time[2];
	            fetch(url).then(function (res) {
	                return res.json();
	            }).then(function (data) {
	                var result = (data.resultCode === "0" && data.data) ? data.data.result : null;
	                if(result != null) {
		                //vmap.setRadar(radar);
		            }
	            });
	            var ef = parseInt(time[2]);
	            var tmKst = moment.tz(moment(time[0] + time[1], 'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss'), 'Etc/GMT').tz('Asia/Seoul').format("YYYYMMDDHHmm");
	            
	            if(ef == 0) {
	            	//radar.urls[i] = 'https://vapi.kma.go.kr/BUFD/rdr_sfc_pty_img_' + tmKst + '_1453.png';
	            	radar.urls[i] = 'https://www.weather.go.kr/w/cgi-bin/rdr_new/nph-vs_rdr_cmp_img?tm=' + tmKst + '&size=1453';
	            } else {
	            	radar.urls[i] = 'https://vapi.kma.go.kr/BUFD/qpf_ana_img_' + tmKst + '_m' + ((1000 + ef)+"").substring(1)+ '_1453.png';
	            }
	        }
	    }
	    vmap.setRadar(radar);
		var items = [];
		for (var i = 0; i < times.length && i < 13; i++) {
			var time = times[i];
			var date = time[0] + time[1];
			var min = time[2];
			var efcDate = moment(date, 'YYYYMMDDHHmm'); 
			efcDate.add(min, 'minutes');
			items.push({ 
				name:'초단기강수예측', 
				url:[radar.urls[i]], 
				tm:moment.tz(moment(date, 'YYYYMMDDHHmm').format('YYYY-MM-DDTHH:mm:ss'), 'Etc/GMT').tz('Asia/Seoul').format('YYYYMMDDHHmm'), 
				ftm:moment.tz(efcDate.format('YYYY-MM-DDTHH:mm:ss'), 'Etc/GMT').tz('Asia/Seoul').format('YYYYMMDDHHmm') 
			});
		}
		if(onComplete) onComplete(items);
	});
}