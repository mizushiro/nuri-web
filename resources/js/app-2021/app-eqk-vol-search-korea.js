/**
 *  지진화산 - 지진조회 - 국내(url: /eqk-vol/search/korea.do)
 */
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
	
	});
	function tmValidate(str) {
		var reg = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
		return reg.test(str);
	}
	function numberValidate(str) {
		var reg = new RegExp("^[0-9\-\.]+$");
		return reg.test(str);
	}
	function checkField(f, isDownload) {
		if(f.startTm.value != "" && !tmValidate(f.startTm.value)) { 
			alert("발생기간 시작 날짜 형식을 알맞게 입력해 주세요. 형식은  YYYY-MM-DD 입니다.");
			f.startTm.focus(); 
			return false;
		}
		else if(f.endTm.value != "" && !tmValidate(f.endTm.value)) { 
			alert("발생기간 종료 날짜 형식을 알맞게 입력해 주세요. 형식은  YYYY-MM-DD 입니다.");
			f.endTm.focus();
			return false;
		}
		else if(f.startLat.value != "" && !numberValidate(f.startLat.value)) { 
			alert("위도범위 시작 위도를 숫자로 입력해 주세요.");
			f.startLat.focus();
			return false;
		}
		else if(f.endLat.value != "" && !numberValidate(f.endLat.value)) { 
			alert("위도범위 끝 위도를 숫자로 입력해 주세요.");
			f.endLat.focus();
			return false;
		}
		else if(f.startLon.value != "" && !numberValidate(f.startLon.value)) { 
			alert("경도범위 시작 경도를 숫자로 입력해 주세요.");
			f.startLon.focus();  
			return false;
		}
		else if(f.endLon.value != "" && !numberValidate(f.endLon.value)) { 
			alert("경도범위 끝 경도를 숫자로 입력해 주세요.");
			f.endLon.focus();  
			return false;
		}
		else if(parseFloat(f.startSize.value) > parseFloat(f.endSize.value)) { 
			alert("규모 시작 범위가 끝 범위보다 큽니다.\n규모 시작 범위를 끝 범위보다 작게 입력해 주세요.");
			f.startSize.focus();  
			return false;
		}
		f.xls.value = isDownload ? "1" : "0";
		return true;
	}
	$('#select-dp-type').on('change', function(e) {
	   if(this.value == "a") {
	       $('#select-start-size')[0].selectedIndex = 0;
	   } else if(this.value == "m") {
	       $('#select-start-size')[0].selectedIndex = 3;
	   }
	});
	$('#default-form').on('submit', function(e) {
		return checkField(this);
	});
	$('a[data-action="xls-download"]').on('click', function(e) {
		e.preventDefault();
		var f = $('#default-form')[0];
		if(checkField(f, true)){
			f.submit();
		}
	});
	
	$('#input-start-tm').datepicker( { changeYear:true, changeMonth:true, yearRange:"c-30:c+10" } );
	$('#input-end-tm').datepicker( { changeYear:true, changeMonth:true, yearRange:"c-30:c+10" } );
		
})(jQuery, window, document);
