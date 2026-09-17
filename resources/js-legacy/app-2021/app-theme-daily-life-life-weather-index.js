/**
 * 지역별 종합지수 (theme/daily-life/life-weather-index)
 *
 * 날씨누리 홈페이지 (url: /)
 */
'use strict';
(function($, window, document){
    
    var    version = "1.0",
        bookmarkDropdown = null,
        bookmarkSelectedLat = 37.493546, 
        bookmarkSelectedLon = 126.921654,
        bookmarkSelectedDong = "서울특별시 동작구 신대방제2동",
        bookmarkSelectedDongCode = "1159068000",
        wsUnit = "m/s",
        appPrefix = (window.appBase ? window.appBase : '/'),
        indexLocalSearchbox = null,
        popLocalSearchbox = null,
        myPointSlider = null,
        vmap = null,
        hashParam = null,
        $contentBody = $('#content-body'),
        ptrEnabled = true;
        
    if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
        wsUnit = appConfig.config.unit.ws;
    }
    /* 화면 모드 셋팅 */
    var displayMode = (appConfig && appConfig.config && appConfig.config.displayMode) ? appConfig.config.displayMode : DISPLAY_MODE_DEFAULT;
    if(displayMode != DISPLAY_MODE_MAP) {
        displayMode = DISPLAY_MODE_DEFAULT;
    }
    var save_area_point_code = "1100000";
    var save_area_point_ko = "서울특별시";
    var save_json = null;  //jsondata
    var save_real_json = null; //실황

    
    var save_tmp_json = null;  //jsondata
    var save_tmp_real_json = null; //실황
    var save_dsr_real_json = null; //실황
    
    var save_data_point = 1; //현재 선택한 날짜 포인트 저장
    var save_day_point = 1;
    var save_day_array = new Array();  //날짜 정보 저장
    var uv_ment_array = new Array(); //자외선 ment  정의
    var air_ment_array = new Array(); //대기정체지수ment  정의
    var freeze_ment_array = new Array(); //대기정체지수ment  정의
    var yy, real_yy;
    var mm, real_mm;
    var dd, real_dd;
    var hh, real_hh;
    var date;
    var jisu_code = 'A07_2';
    var heat_ment;
    var heat_ment_list;
    var save_time = 1; 
    var nowchk="N";
	var uv_save_map_json;
    var heat_save_map_json;
    var heat_real_save_map_json;
    var air_save_map_json;
    var save_point = "1100000"; //현재 선택되어있는 
    var save_pkornm = "서울특별시";
    var first_check = true;
	var uv_date_text;
    var air_date_text;
    var freeze_date_text;
    var freeze_save_map_json;
    var day_ment_jisu_code;
    var ndsr_chk="N";
    
    uv_ment_array[0] = "<li>햇볕에 민감한 피부를 가진 분은 자외선 차단제를 발라야 함</li>";
    uv_ment_array[1] = "<li>2 ~ 3시간 햇볕에 노출 시 피부 화상을 입을 수 있음</li><li>모자, 선글라스 착용하고 자외선 차단제 바르기</li> ";
    uv_ment_array[2] = "<li>햇볕에 노출 시 1～2시간내에도 피부 화상을 입을 수있음</li><li>낮에는 그늘에 머무르기</li><li>외출 시 긴 소매, 모자, 선글라스 착용하고, 자외선 차단제 바르기</li> ";
    uv_ment_array[3] = "<li>햇볕에 노출 시 수십 분 이내에도 피부 화상을 입을 수 있음</li><li>낮 10시～3시까지 외출을 피하고실내나 그늘에 머무르기</li><li>외출 시 긴 소매, 모자, 선글라스 착용하고, 자외선 차단제 바르기</li> ";
    uv_ment_array[4] = "<li>햇볕에 노출 시 수십 분 이내에도 피부 화상을 입을 수 있음</li><li>가능한 실내에 머무르기</li><li>외출 시 긴 소매, 모자, 선글라스 착용하고, 자외선 차단제 바르기</li> ";
    
    air_ment_array[0] ="<li>기상조건에 의해 대기정체 가능성이 낮음</li>";
    air_ment_array[1] ="<li>기상조건에 의해 대기정체 가능성이 보통</li>";
    air_ment_array[2] ="<li>기상조건에 의해 대기정체 가능성이 높음</li>";
    air_ment_array[3] ="<li>기상조건에 의해 대기정체 가능성이 매우 높음</li>";
    
    freeze_ment_array[0] = "<li>동파가능성 낮음</li>";
    freeze_ment_array[1] = "<li>수도계량기 보호함 내부에 헌옷을 채우고, 외부엔 테이프로 밀폐</li><li>수도관이 노출되어 있는 경우에는 보온재로 감싸두기</li><li>집안의 수도관이 얼었을 때는 헤어드라이어로 서서히 가열해 녹이면 됨</li>";
    freeze_ment_array[2] = "<li>수도계량기 보호함 내부에 헌옷을 채우고, 외부엔 테이프로 밀폐</li><li>복도식 아파트는 수도계량기 보온에 더욱 유의</li> <li>장기간 집을 비울때는 수도꼭지를 조금 틀어 물이 흐르게 함</li>";
    freeze_ment_array[3] = "<li>수도꼭지를 조금 틀어놓아 물이 흐르게 함</li><li>수도계량기 및 수도관 동파 발생시지역 상하수도사업소에 신고</li>";
    function restr(indata){
        indata = indata.replace(/\</g, "<");
        return indata;
    }
    function restr2(indata){
        indata = indata.replace(/\&amp;/g, "&");
        return indata;
    }
    
	// $(".over-scroll-web").attr("tabindex","0");
    /*
        해시 파라미터 읽기.
        형식 : #tab=vmap/subtab=1/lat=36.7/lon=126.2/zoom=7
    */
    if(window.location.hash) {
        try {
            var route = window.location.hash.substr(1);
            var routes = route.split('/');
            hashParam = {};
            for(var i in routes) {
                var kv = routes[i].split('=');
                if(kv[1]) hashParam[kv[0]] = kv[1];
            }
        }catch(e) {
            if(window.console) console.log(e);
            hashParam = null;
        }
    }
    initDefaultMode();
    
    function initDefaultMode() {
        createCurrentWarning();
        createGlobalEvent();
        createJisuDataList();
        
    }
    
    //꽃가루지수 표출 순서
    function sort_D06_view_list(month){
      
         //계절별 지수 표출 순서 변경
         var tab_list_html="";        
         if(month == 8 || month == 9 || month == 10){
             $("#view_chk1").hide();
             $("#view_chk2").show();
         }else{
             $("#view_chk1").show();
             $("#view_chk2").hide();
         }
    }     

    function createJisuDataList(){
        showLoading('content-body', true);
        
        $.ajax({
            url: appPrefix + "resources/jsp/life/jisumap.jsp",
            data: { jisucode:jisu_code },
            type: 'get',
            success:function(data, status, xhr){
                save_json = data.data_json;
                save_real_json = data.real_data_json;
                
                yy = save_json[0].filetime.slice(0,4);
                mm = save_json[0].filetime.slice(4,6);
                dd = save_json[0].filetime.slice(6,8);
                hh = save_json[0].filetime.slice(8,10);
                //실황자료시간
                if(save_real_json!=""){
                    real_yy = save_real_json[0].filetime.slice(0,4);
                    real_mm = save_real_json[0].filetime.slice(4,6);
                    real_dd = save_real_json[0].filetime.slice(6,8);
                    real_hh = save_real_json[0].filetime.slice(8,10);
                }
                
                date = new Date(yy+"-"+mm+"-"+dd);
                var server_hh = data.server_time.slice(8,10);
                var server_mm = data.server_time.slice(4,6);
                var server_dd = data.server_time.slice(6,8);
                if(first_check){
                    
                    //중간 매뉴(지수메뉴) 구성
                    $(".tab-menu").append("<div class='tab-btn01 tab-sm' data-jisu-code='A07_2'><a class='on' title='선택됨' href='#'><span>자외선지수</span></a></div>");
                    
                    //체감온도 임시 오픈
                    if(Number(server_mm) > 4 && Number(server_mm) < 10){
                        $(".tab-menu").append("<div class='tab-btn02 tab-sm' data-jisu-code='A41'><a type='buton' href='#'><span>체감온도</span></a></div>");
                    }else{
                        $(".tab-menu").append("<div class='tab-btn02 tab-sm' data-jisu-code='A40'><a type='buton' href='#'><span>체감온도</span></a></div>");
                    }
                    
                    //지수 서비스 여부 확인 추가 또는 삭제 처리 필요 (서비스 중지 지수)                    
                    /*
                    if(Number(server_mm) > 10 || Number(server_mm) < 4){
                        $(".tab-menu").append("<div class='tab-btn02 tab-sm' data-jisu-code='A08'><a type='buton' href='#'><span>동파가능지수</span></a></div>");
                    }
                    */
                    $(".tab-menu").append("<div class='tab-btn03 tab-sm' data-jisu-code='A09'><a type='buton' href='#'><span>대기정체지수</span></a></div>");
                    
                    if(Number(server_mm) >= 8 && Number(server_mm) <= 10){
                        $(".tab-menu").append("<div class='tab-btn04 tab-sm' data-jisu-code='D08'><a type='buton' href='#'><span>꽃가루농도위험지수</span></a></div>");
                    }else{
                        $(".tab-menu").append("<div class='tab-btn04 tab-sm' data-jisu-code='D06'><a type='buton' href='#'><span>꽃가루농도위험지수</span></a></div>");
                    }
                    
                    first_check = false;
                }
               
                if(jisu_code == "A07_1"){//자외선 daily
                    $("#uv_time_info").html("<p>"+yy+"년 "+mm+"월 "+dd+"일 ("+getDays(date.getDay())+") "+hh+":00</p>"+"<p>제공기간 : 연중</p>");
                    $($($("#div_A07_1").find(".dfs-tab-head").find("li")).find("a")).removeClass("on").removeAttr('title');
                    if(hh == "06"){//6시에는 글피 제공 x
                        $($("#div_A07_1").find(".dfs-tab-head").find("li")["3"]).hide();
                        $($(".dfs-tab-head").find("li")["0"]).find("a").addClass("on").attr('title','선택됨');
                        save_data_point = 0;
                        save_day_point = 0;
                        save_time = 0;
                    }else{
                        $($("#div_A07_1").find(".dfs-tab-head").find("li")["0"]).hide();
                        $($("#div_A07_1").find(".dfs-tab-head").find("li")["1"]).find("a").addClass("on").attr('title','선택됨');
                        save_data_point = 1;
                        save_day_point = 1;
                        save_time = 1;
                    }
                    createUvMap('day');
			    }else if(jisu_code == "A07_2"){ //자외선 시간별(new)
                    //$("#uv_time_info").html("<p>"+yy+"년 "+mm+"월 "+dd+"일 ("+getDays(date.getDay())+") "+hh+":00</p>"+"<p>제공기간 : 연중</p>");
                    $($($("#div_A07_2").find(".dfs-tab-head").find("li")).find("a")).removeClass("on").removeAttr('title');
                    if(Number(server_hh) < 18 && Number(server_hh) >=0){//18시 이전에는 글피 제공 x

                        $($("#div_A07_2").find(".dfs-tab-head").find("li")["0"]).show();
                        $($("#div_A07_2").find(".dfs-tab-head").find("li")["3"]).hide();
                        $($(".dfs-tab-head").find("li")["0"]).find("a").addClass("on").attr('title','선택됨');
                        save_data_point = 0;
                        save_day_point = 0;
                        save_time = 0;
                    }else{
                        $($("#div_A07_2").find(".dfs-tab-head").find("li")["0"]).hide();
                        $($("#div_A07_2").find(".dfs-tab-head").find("li")["3"]).show();
                        $($("#div_A07_2").find(".dfs-tab-head").find("li")["1"]).find("a").addClass("on").attr('title','선택됨');
                        save_data_point = 1;
                        save_day_point = 1;
                        save_time = 1;
                    }
					               uvTimeList(data);
                }else if(jisu_code == "A09"){//대기정체지수
                    save_data_point = 0;
                    save_day_point = 0;
                    save_time = 0;
                    airTimeList(data);
                }else if(jisu_code == "A08"){//동파가능지수
                    save_data_point = 0;
                    save_day_point = 0;
                    save_time = 0;
                    freezeTimeList(data);
                }else if(jisu_code == "D06"|| jisu_code == "D07" || jisu_code == "D08"){//꽃가루농도위험지수
                    var period = "연중";
                    var nodataCheck;
                    //탭메뉴 출력
                    sort_D06_view_list(Number(server_mm));
                    if(jisu_code == "D06"|| jisu_code == "D07"){
                        period= "3월 ~ 6월";
                        
                        if(!(3 <= Number(mm) && Number(mm) <= 6 )){
                        //if(!(4 <= Number(mm) && Number(mm) <= 6 )){
                            nodataCheck = true;
                        }else{
                            nodataCheck = false;
                        }
                    }else if(jisu_code == "D08"){
                        period= "8월 ~ 10월";
                        if(!(8 <= Number(mm) && Number(mm) <= 10 )){
                        //if(!(8 <= Number(mm) && Number(mm) <= 11 )){
                            nodataCheck = true;
                        }else{
                            nodataCheck = false;
                        }
                    }
                    $("#flower_time_info").html("<p>"+yy+"년 "+mm+"월 "+dd+"일 ("+getDays(date.getDay())+") "+hh+":00 발표</p>"+"<p>제공기간 : "+period+"</p>");
                    $($($("#div_D06").find(".dfs-tab-head").find("li")).find("a")).removeClass("on").removeAttr('title');
                    //if(hh == "06"){//6시에는 글피 제공 x
                    if(Number(server_hh) < 18 && Number(server_hh) >= 0){
                        $($("#div_D06").find(".dfs-tab-head").find("li")["3"]).hide();
                        $($("#div_D06").find(".dfs-tab-head").find("li")["0"]).find("a").addClass("on").attr('title','선택됨');
                        save_data_point = 0;
                        save_day_point = 0;
                        save_time = 0;
                    }else{
                        $($("#div_D06").find(".dfs-tab-head").find("li")["0"]).hide();
                        $($("#div_D06").find(".dfs-tab-head").find("li")["1"]).find("a").addClass("on").attr('title','선택됨');;
                        save_data_point = 1;
                        save_day_point = 1;
                        save_time = 1;
                    }

                    if(nodataCheck){
                        $('#flower_map_area').html("");
                        $('#data_none').html("<div class='txt_alert'>서비스 제공기간이 아닙니다<br/>제공기간 :"+period+"</div>");
                        $("#flower_right_index_area").hide();
                        $("#flower_correspond").hide();
                        $('#flower_map_area').hide();
                        $('#data_none').show();
                        $('#flower_life_btn').hide();
                        $('#alert_flower').hide();
                    }else{
                        $('#flower_map_area').html("");
                        $('#flower_map_area').show();
                        $('#data_none').html("");
                        $('#data_none').hide();
                        $('#flower_life_btn').show();
                        flowerCreateMap();
                        $("#flower_right_index_area").show();
                        $("#flower_correspond").show();
                        $('#alert_flower').show();
                    }
                    flowerDayMent();
                    realFlowerData();
                }      
               
                showLoading('content-body', false);
            },
            error:function(xhr, status, error ){
                console.log(error);
                showLoading('content-body', false);
            }
         
        });
    }

    //꽃가루농도위험지수 멘트 호출
    function flowerDayMent(){
        $.ajax({ 
            url: appPrefix + "resources/jsp/life/day_ment.jsp",
            dataType : 'json',
            success: function (data) { 

                day_ment_jisu_code = data[jisu_code];
                var ment_thtml="";
                $.each(day_ment_jisu_code, function(index, item){
                    ment_thtml += "<tr>";
                    ment_thtml += "<th class='cor_circle flower'>";
                    ment_thtml += "<p><span class='circle "+item.color+"'></span>&nbsp;<strong>"+item.depth+"</strong></p>";
                    ment_thtml += "</th>";
                
                    ment_thtml += "<td>";
                    ment_thtml += "<ul class='cor_list'>";
                    ment_thtml += item.ment;
                    ment_thtml += "</ul>";
                    ment_thtml += "</td>";
                    ment_thtml += "</tr>";
                });
                ment_thtml += "<tr>";
                ment_thtml += "<td colspan='2'>※ 의학자문: 서울대학병원 운영 서울특별시 보라매 병원 내과 김덕겸, 허응영 서울의대 교수</td>";
                ment_thtml += "</tr>";
                $("#flower_list").find("tbody").html(ment_thtml);
                
                $("#flower_title").html("<h3>"+day_ment_jisu_code[0].nm+"</h3>");
                $.each($(".tt.flower_nm"), function(index, item){
                    if(index == 0){
                        $(item).html("오늘 "+day_ment_jisu_code[0].nm+"를 제공합니다.");
                    }else if(index == 1){
                        $(item).html("내일 "+day_ment_jisu_code[0].nm+"를 제공합니다.");
                    }else if(index == 2){
                        $(item).html("모레 "+day_ment_jisu_code[0].nm+"를 제공합니다.");
                    }else if(index == 3){
                        $(item).html("글피 "+day_ment_jisu_code[0].nm+"를 제공합니다.");
                    }
                });
                flowerCreateMap();
                realFlowerData();
            },
            error:function(xhr, status, error ){
                console.log(error);
            }
        });
    }

    function flowerCreateMap(){
        
        for(var i = 0; i < save_json.length; i++){
            save_json[i]["value"] = save_json[i]["value"+save_data_point];
            if(save_area_point_code == save_json[i].code){
                flower_map_point_click(save_area_point_ko, save_json[i]["value"+save_data_point]);
            }     
        }
        
        var data = save_json;
        var dataClasses = new Array();

        $.each(day_ment_jisu_code, function(index, item){
            dataClasses.push({from: Number(item.from) , to: Number(item.to) , color : colorChange(item.color)});

        });
        $('#flower_map_area').highcharts('Map', {
        chart: {
          borderWidth: 1,
          events: {
          	click: function() { //ie7에서 클릭할 때 반응하기 위한 이벤트 위치
          		if(this.hoverPoint != null) {
          			var obj = this.hoverPoint;
          			save_area_point_code = obj.code; //현재 선택되어 있는 지점 코드 저장
          			save_area_point_ko = obj.properties.SGG_NM; //현재 선택되어진 지점명 저장
          			
          			flower_map_point_click(obj.properties.SGG_NM,obj.value);
          		}
            }
          }
        },
        title: {
          text: ''
        },
        legend: {
          enabled : false
        },
        mapNavigation: {
          enabled: true
        },
        credits: {
            enabled: false
        },
        colorAxis: {
        dataClasses: dataClasses
      },
        series: [{
          data: data,
          mapData: Highcharts.maps['korea/drought_base'],
          joinBy: ['SGG_CD', 'code'],
          dataLabels: {
            enabled: false,
            color: '#FFFFFF'
          },
          name: ' ',
          tooltip: {
            pointFormatter: function(){
                var val = this.value;
                var lv = "";
            
                $.each(day_ment_jisu_code, function(index, item){
                    if(Number(item.from) <= val && val <=  Number(item.to) ){
                        lv = item.depth;
                    }
                })
                var redata = this.properties.SGG_NM + ' : ' +  lv + "(" + val + ")";
                return redata;
            }
            },
          point:{
            events: {
              click: function(){
                save_area_point_code = this.code; //현재 선택되어있는 지점 코드 저장
                save_area_point_ko = this.properties.SGG_NM; //현재 선택되어진 지점명 저장
                flower_map_point_click(this.properties.SGG_NM, this.value);
                realFlowerData();
              }
            }
          }
        },{
				data: lines,
				enableMouseTracking: false,
				name: 'line',
				type: 'mapline',
				color: '#808080',
				lineWidth: 1,
				zIndex:10
            }]
      });

    }

    function colorChange(color){
        var color_text;
        switch(color){
            case "red": color_text = "#e1260a"
            break
            case "orange": color_text = "#FD8D3C"
            break
            case "yellow": color_text = "#FED98E"
            break
            case "l_gray": color_text = "#e5e5e5"
            break
            default : color_text = "#e5e5e5"
            break
        }
        return color_text;
    }

    //자외선지수 지도 클릭시 설명 표시
    function flower_map_point_click(indata, indata2){
        //등급 관련 
        var val = indata2; //지역 value값
        var lv = ""; //등급명
        var icon = ""; //등급 class
        var con = "";
        var mark_select = 0;
        var sment
        $.each(day_ment_jisu_code, function(index, item){
            if(Number(item.from) <= val && val <=  Number(item.to) ){
                lv = item.depth;
                con = jisu_code+"_"+(4-index);
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="'+item.nm+' '+lv+'"></span>';
                mark_select = (4-index)-1;
                sment = item.sment;
            }
        })
        
        var date_text = new Date(yy,(Number(mm)-1),dd);
        var selectedDay = $("#div_D06 .dfs-tab-head li a.on span").text();
		
        date_text.setDate(date_text.getDate()+save_day_point);
        //등급 입력
        $("#flower_stn_date").html(indata+"<span>"+(Number(date_text.getMonth())+1)+"월 "+date_text.getDate()+"일</span>"); //지역명
        
        $("#flower_gageText").removeClass(data_color_Rating(1)+" "+data_color_Rating(2)+" "+data_color_Rating(3)+" "+data_color_Rating(4)+" "+data_color_Rating(5));
        $("#flower_gageText").addClass(data_color_Rating(mark_select+1));
        $("#flower_gageText").html(lv); //아이콘 등급 한글명
        $("#flower_gageIcon").html(icon); //아이콘 설정
        
        //마크 위치 지정
        var memarray = new Array();
        var i = 0;

        $("#flowerSment").html(sment); //ment 변경
        
        $("#flower_right_index_area > .state_wrap:last-child .state_area ul li").each(function(index, item){
            $(item).html($(item).html().replace("<span>▼</span>", ""));
        });
        var $predList = $("#flower_right_index_area > .state_wrap:last-child .state_area ul li");
        var state_area_text = $($predList[mark_select]).html();
        $($predList[mark_select]).html(state_area_text + "<span>▼</span>");

        // $("#div_D06").find(".state_area").find("ul").find("li").each(function(index,item){
        //     $(item).html($(item).html().replace("<span>▼</span>",""));
        // });

        // var state_area_text = $($("#div_D06").find(".state_area").find("ul").find("li")[mark_select]).html();
        // $($("#div_D06").find(".state_area").find("ul").find("li")[mark_select]).html(state_area_text+"<span>▼</span>");
   
    }

    function realFlowerData() {
        if (save_real_json && save_real_json.length > 0) {
            // 실황 데이터를 가지고 있는 모든 지점 code를 배열로 추출
            var realCodes = save_real_json.map(function(d) { return d.code; });
        
            // 현재 선택된 지점이 실황 대상인지 확인
            var isRealTarget = realCodes.includes(save_area_point_code);
        
            if (isRealTarget) {
                var $d06Li = $("#div_D06 .dfs-tab-head li:visible").first();
                var firstText = $d06Li.find("span").text().trim();
                var selectedLi = $d06Li.find("a").hasClass("on");
                
                if((firstText.includes("오늘") || firstText.includes("내일")) && selectedLi){
                    $("#real_flower_data").show();
                }else {
                    $("#real_flower_data").hide();
                    return;
                } 
                //$("#real_flower_data").show();
                //$("#flower_stn_date2").show();
        
                // 현재 선택된 지점의 실황 데이터 찾기
                var realData = save_real_json.find(function(d) {
                    return d.code === save_area_point_code;
                });
        
                if (realData) {
                    var realFileTime = realData.filetime;
                    var realHH = realFileTime.slice(8,10);
                    //$("#real_flower_time span").text("발표시간: " + realHH + ":00");
                    $("#real_flower_time").text("실황(" + parseInt(realFileTime.slice(4,6)) + "월 " + parseInt(realFileTime.slice(6,8)) + "일 " + parseInt(realHH) + "시)");

                    var realVal = realData.value0;
                    var realLv = "";
                    var realIcon = "";
                    var real_mark_select = 0;
        
                    $.each(day_ment_jisu_code, function(index, item){
                        if(Number(item.from) <= realVal && realVal <= Number(item.to)){
                            realLv = item.depth;
                            var con = jisu_code + "_" + (4 - index);
                            realIcon = '<img src="' + appPrefix + 'resources/images/life/_indexImg/icons/e/' + con + '_icon.jpg" alt="' + item.nm + ' ' + realLv + '">';
                            real_mark_select = (4-index)-1;
                        }
                    });

                    var $txt = $("#flower_gageText2");
                    $txt.removeClass(
                        data_color_Rating(1) + " " + 
                        data_color_Rating(2) + " " + 
                        data_color_Rating(3) + " " + 
                        data_color_Rating(4) + " " + 
                        data_color_Rating(5)
                    );
                    $txt.addClass(data_color_Rating(real_mark_select + 1));
                    $txt.text(realLv);
                    
        
                    // DOM 업데이트
                    //$("#real_flower_data #flower_gageText2").text(realLv);
                    $("#real_flower_data #flower_gageIcon2").html(realIcon);

                    $("#real_flower_data .state_area ul li").each(function(index, item){
                        $(item).html($(item).html().replace("<span>▼</span>", ""));
                    });
                    var $realList = $("#real_flower_data .state_area ul li");
                    var real_state_area_text = $($realList[real_mark_select]).html();
                    $($realList[real_mark_select]).html(real_state_area_text + "<span>▼</span>");
                }
            } else {
                $("#real_flower_data").hide();
                //$("#flower_stn_date2").hide();
            }
        } else {
            $("#real_flower_data").hide();
            //$("#flower_stn_date2").hide();
        }
        
    }


    //생활기상정보 - 지역별 조합지수 - 데이터 조회(체감온도 데이터)
    function createHeatDataList(jisucode){
        showLoading('content-body', true);
        
        $.ajax({
            url: appPrefix +"resources/jsp/life/heat_jisu_A40.jsp",
            data: { jisucode: jisucode},
            type: 'get',
            success:function(data, status, xhr){
                if(heat_ment == null){
                    heatMent(data);
                    showLoading('content-body', false);
                }else{
                    heatTimeList(data);
                    showLoading('content-body', false);
                }
                
            },
            error:function(xhr, status, error ){
                console.log(error);
                showLoading('content-body', false);
            }
        });
    }
    
    function createEtcDataList(){
  
        $.ajax({
            url: appPrefix +"resources/jsp/life/etc_jisu.jsp",
            type: 'get',
            success:function(data, status, xhr){
                    save_tmp_json = data.tmp_json;
                    save_tmp_real_json = data.tmp_real_json;
                    save_dsr_real_json = data.dsr_real_json;
            },
            error:function(xhr, status, error ){
                console.log(error);
           }
        });
    }

    //체감온도 맨트 호출
    function heatMent(jisu_data){
        $.ajax({ 
            url: appPrefix + "resources/jsp/life/heat_ment.jsp",
            dataType : 'json',
            success: function (data) { 
            heat_ment = data;
            heatTimeList(jisu_data);
            },
            error:function(xhr, status, error ){
                console.log(error);
            }
        });
    }
    //체감온도 시간 리스트 생성
    var fileTimeMM="0";
    function heatTimeList(data){
        
        var heat_time_data = data.json["0"];
        heat_save_map_json = data.map_json;
        heat_real_save_map_json = data.real_json;
        
        var tr_thtml="";
        $("#heatTit").html("단계별 대응요령 / "+ heat_time_data.KONAME);
        $("#heatMapTit").html("체감온도("+ heat_time_data.KONAME+")");
        $("#heatMapTit2").html("체감온도("+ heat_time_data.KONAME+")");
        $("#heatMapTit3").html("체감온도("+ heat_time_data.KONAME+")");
        $("#heatSmentTit").html("대응요령 / "+ heat_time_data.KONAME);
        var heat_yy =heat_save_map_json[0].filetime.slice(0,4);
        var heat_mm =heat_save_map_json[0].filetime.slice(4,6);
        fileTimeMM  = data.MM;
        var heat_dd =heat_save_map_json[0].filetime.slice(6,8);
        var heat_hh =Number(heat_save_map_json[0].filetime.slice(8,10));
        
        var heat_date = new Date(heat_yy+"-"+heat_mm+"-"+heat_dd);

        // 서버시간(현재시간)
        var heat_servertime_hh =heat_time_data.servertime.slice(8,10);
        
        
        $("#heat_time_left").html(heat_yy+"년 "+heat_mm+"월 "+heat_dd+"일 ("+getDays(heat_date.getDay())+")"+" | "+heat_hh+":00"+"<br/>");

        tr_thtml += "<tr>";
        tr_thtml += "<th scope='col' id='th_0'>날짜</th>";
        var server_file_time = Number(heat_servertime_hh)-Number(heat_hh);
        var time_type=0;
        if(0 > server_file_time){//18시 데이터가 들어오고 00시가 지났을때
            heat_date.setDate(heat_date.getDate()+1);
            if(jisu_code == "A40"){
				tr_thtml += "<th scope='col' id='th_1' colspan='"+(24-(Number(heat_servertime_hh)-1))+"'><span class='dtag'>오늘("+heat_date.getDate()+"일)</span></th>";
			}else{
				tr_thtml += "<th scope='col' id='th_1' colspan='"+(24-(Number(heat_servertime_hh)))+"'><span class='dtag'>오늘("+heat_date.getDate()+"일)</span></th>";
			}			
            heat_date.setDate(heat_date.getDate()+1);
             tr_thtml += "<th scope='col' id='th_2' colspan='24'><span class='dtag'>내일("+heat_date.getDate()+"일)</span></th>";
            heat_date.setDate(heat_date.getDate()+1);
            if(heat_hh >= 18){
                tr_thtml += "<th scope='col' id='th_3' colspan='24'><span class='dtag'>모레("+heat_date.getDate()+"일)</span></th>";
            }
            time_type= 1;
        }else if(12 <= server_file_time ){//18시 데이터가 안들어왔을때
            if(jisu_code == "A40"){
				tr_thtml += "<th scope='col' id='th_1' colspan='"+(24-(Number(heat_servertime_hh)-1))+"'><span class='dtag'>오늘("+heat_date.getDate()+"일)</span></th>";
			}else{
				tr_thtml += "<th scope='col' id='th_1' colspan='"+(24-(Number(heat_servertime_hh)))+"'><span class='dtag'>오늘("+heat_date.getDate()+"일)</span></th>";
			}
            heat_date.setDate(heat_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_2' colspan='24'><span class='dtag'>내일("+heat_date.getDate()+"일)</span></th>";
            heat_date.setDate(heat_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_3' colspan='24'><span class='dtag'>모레("+heat_date.getDate()+"일)</span></th>";
            time_type= 2;
        }else{
            if(jisu_code == "A40"){
				tr_thtml += "<th scope='col' id='th_1' colspan='"+(24-(Number(heat_servertime_hh)-1))+"'><span class='dtag'>오늘("+heat_date.getDate()+"일)</span></th>";
			}else{
				tr_thtml += "<th scope='col' id='th_1' colspan='"+(24-(Number(heat_servertime_hh)))+"'><span class='dtag'>오늘("+heat_date.getDate()+"일)</span></th>";
			}
            heat_date.setDate(heat_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_2' colspan='24'><span class='dtag'>내일("+heat_date.getDate()+"일)</span></th>";
            heat_date.setDate(heat_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_3' colspan='24'><span class='dtag'>모레("+heat_date.getDate()+"일)</span></th>";
            heat_date.setDate(heat_date.getDate()+1);
            time_type= 3;
            if(Number(heat_hh) >= 18 && Number(heat_hh) != 24){
                tr_thtml += "<th scope='col' id='th_4' colspan='24'><span class='dtag'>글피("+heat_date.getDate()+"일)</span></th>";
                time_type= 4;
            }
        }
        tr_thtml += "</tr>";
        $("#heat_tbl").find("thead").html(tr_thtml);
        heat_date = new Date(heat_yy,Number(heat_mm) -1 ,heat_dd);
        var th_thtml="";
        th_thtml+="<tr>";
        th_thtml+="<th>시각</th>";
        var data_num = 0;
        if(Number(heat_servertime_hh) >= 24){
            heat_servertime_hh = 0;
        }
        
        
        if(time_type == 1){

            data_num = (24-heat_hh)+Number(heat_servertime_hh)-1;

            save_time=data_num;
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = Number(heat_servertime_hh); i <= 24; i++){
                if(jisu_code == "A40" && i == Number(heat_servertime_hh)) {
					//A40 실황 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>실황</a></td>";
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)){
				    data_num++;
					continue;
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)+1){
					//A40 아님 -> 서버 시간 +1 시각에 선택 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>"+numberPlusZero(i)+"시</a></td>";
				}else{
					//나머지 예보 시각
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
				}
                    data_num++;
            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            heat_date.setDate(heat_date.getDate()+1);
            if(heat_hh >= 18){
                for(var i = 1; i <= 24; i++){
                    th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                    data_num++;
                }
            }
        }else if(time_type == 2){
            data_num = Number(server_file_time)-1;
            save_time=data_num;
            for(var i = Number(heat_servertime_hh); i <= 24; i++){
                if(jisu_code == "A40" && i == Number(heat_servertime_hh)) {
					//A40 실황 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>실황</a></td>";
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)){
				    data_num++;
					continue;
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)+1){
					//A40 아님 -> 서버 시간 +1 시각에 선택 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>"+numberPlusZero(i)+"시</a></td>";
				}else{
					//나머지 예보 시각
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
				}
                    data_num++;
            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
        }else if(time_type == 3){
            data_num = Number(server_file_time)-1;
            save_time=data_num;
            for(var i = Number(heat_servertime_hh); i <= 24; i++){
                if(jisu_code == "A40" && i == Number(heat_servertime_hh)) {
					//A40 실황 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>실황</a></td>";
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)){
				    data_num++;
					continue;
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)+1){
					//A40 아님 -> 서버 시간 +1 시각에 선택 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>"+numberPlusZero(i)+"시</a></td>";
				}else{
					//나머지 예보 시각
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
				}
                    data_num++; 
            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
        }else if(time_type == 4){
            data_num = Number(server_file_time)-1;
            save_time=data_num;
            for(var i = Number(heat_servertime_hh); i <= 24; i++){
                if(jisu_code == "A40" && i == Number(heat_servertime_hh)) {
					//A40 실황 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>실황</a></td>";
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)){
				    data_num++;
					continue;
				}else if(jisu_code != "A40" && i == Number(heat_servertime_hh)+1){
					//A40 아님 -> 서버 시간 +1 시각에 선택 표시
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='Y' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt on'>"+numberPlusZero(i)+"시</a></td>";
				}else{
					//나머지 예보 시각
					th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
				}
                    data_num++; 

            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            heat_date.setDate(heat_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-nowchk='N' data-bar_day='"+heat_date.getFullYear()+"년 "+(heat_date.getMonth()+1)+"월 "+heat_date.getDate()+"일 "+i+"시' class='heat-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
        }
        //
        if(fileTimeMM>=10 || fileTimeMM <=4){
            $("#heat_mm_info").html("10~4월은 겨울철 체감온도 사용");
        }else{
            $("#heat_mm_info").html("");
        }
        
        if(nowchk=="Y") {
			if(jisu_code == "A40"){
				$("#heat_time_right").html(heat_yy+"년 "+heat_mm+"월 "+heat_dd+"일 "+(Number(heat_servertime_hh))+"시 실황");
				$("#heatMapTit2").css("display","block");
				$("#drsMapTit").css("display","block");
				$("#drsMapTit").removeClass("on").removeAttr('title');
				$("#heatMapTit2").addClass("on").attr('title','선택됨');
				$(".legend_temperatrue").show();
				
			}else{
				$("#heat_time_right").html(heat_yy+"년 "+heat_mm+"월 "+heat_dd+"일 "+(Number(heat_servertime_hh)+1)+"시 예보");
				$("#heatMapTit2").css("display","none");
				$("#drsMapTit").css("display","none");
				$(".legend_temperatrue").hide();
			}
            
            $(".legend_sun").hide();
        }else{
            $("#heat_time_right").html(heat_yy+"년 "+heat_mm+"월 "+heat_dd+"일 "+(Number(heat_servertime_hh)+1)+"시 예보"); 
            $("#heatMapTit2").css("display","none");
            $("#drsMapTit").css("display","none");
            if(jisu_code=="A40"){
                $(".legend_temperatrue").show();
            }else{
                $(".legend_temperatrue").hide();
            }
            $(".legend_sun").hide();
        }
        
        th_thtml+="</tr>";
        $("#heat_tbl").find("tbody").html(th_thtml);
        var heatMent_thtml ="";
        heat_ment_list = new Array();
        $.each(heat_ment[jisu_code], function(index, item){
            heatMent_thtml += "<tr>";
            heatMent_thtml += "<th class='cor_circle'>";
            heatMent_thtml += "<p "+(item.depth == "-"?"class='in_txt'":"")+" ><span class='circle  "+data_color_Rating(5-index)+"'></span><strong>"+item.depth+"</strong></p>";
            heatMent_thtml += "</th>";
            heatMent_thtml += "<td>"+item.jisu+"</td>";
            heatMent_thtml += "<td>";
            heatMent_thtml += "<ul class='cor_list'>";
            heatMent_thtml += item.ment;
            heatMent_thtml += "</ul>";
            heatMent_thtml += "</td>";
            heatMent_thtml += "</tr>";
            var dataObj = new Object();
            if(item.jisu.indexOf(" 이상<br/>")  == -1){
                if(item.jisu.indexOf("이상") != -1){
                    dataObj.from = Number(item.jisu.split(" 이상")[0]);
                    dataObj.to = 100;
                }else{
                    dataObj.to = Number(item.jisu.split(" 미만")[0]);
                    dataObj.from = -100;
                }
            }else{
                dataObj.from = Number(item.jisu.split(" 이상<br/>")[0]);
                dataObj.to =Number(item.jisu.split(" 이상<br/>")[1].split(" 미만")[0]);
                
               

            }
            
            if(index == 0 ){dataObj.color = "#54278F"}
            if(index == 1 ){dataObj.color = "#e1260a"}
            if(index == 2 ){dataObj.color = "#FD8D3C"}
            if(index == 3 ){dataObj.color = "#FED98E"}
            if(index == 4 ){dataObj.color = "#efefef"}
           
            heat_ment_list.push(dataObj);
        });
        $("#div_A41").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
        $($("#div_A41").find(".dfs-tab-head").find("li")[0]).find("a").addClass("on").attr('title','선택됨');
        if(Number(heat_servertime_hh) >= 18 && heat_hh != 24){
            $("#dfs-tab-head_A41").show();
        }else{
            $("#dfs-tab-head_A41").hide();
        }
        
        //23시이후로는 오늘날짜 테그hide -칸이 좁아서 이미지깨짐
        if(heat_servertime_hh >=23 ){
            $("#heat_tbl thead>tr>th").eq(1).find('span').hide();
        }
        
        $(".over-scroll-web").stop().animate({scrollLeft : 0},0);
        if(jisu_code=="A40"){
            $("#heat_state_area_list").hide();
            $("#heat_state_area").hide();
            $("#heat_correspond").hide();
            $("#heatTit").hide();
            $("#heat_correspond_table").hide();
            $(".detail_resulrt_area").css("margin-top","30px");
            
        }else{
            $("#heat_state_area_list").show();
            $("#heat_state_area").show();
            $("#heat_correspond").show();
            $("#heatTit").show();
            $("#heat_correspond_table").show(); 
            $("#heatMent").html(heatMent_thtml);
        }
        save_time = save_time + 1;        
        createHeatMap()
    }

	//자외선지수 시간테이블-2022추가
    function uvTimeList(uv_data){

        var uv_time_data = uv_data.data_json["0"];
        var tr_thtml="";
        var uv_yy =uv_time_data.filetime.slice(0,4);
        var uv_mm =uv_time_data.filetime.slice(4,6);
        var uv_dd =uv_time_data.filetime.slice(6,8);
        var uv_hh =uv_time_data.filetime.slice(8,10);
        var uv_date = new Date(uv_yy,Number(uv_mm)-1,uv_dd);
        var uv_servertime_hh =uv_data.server_time.slice(8,10);
        $("#uv_time_left").html(uv_yy+"년 "+uv_mm+"월 "+uv_dd+"일 ("+getDays(uv_date.getDay())+")"+" | "+uv_hh+":00");
        uv_date_text =" "+uv_mm+"월 "+uv_dd+"일";
        tr_thtml += "<tr>";
        tr_thtml += "<th scope='col' id='th_A07_0'>날짜</th>";
        var server_file_time = Number(uv_servertime_hh)-Number(uv_hh);
        var time_type=12;
        var tmrflag = false; //내일자료
        for(var i = 0; i < 4; i++){  //하루에 4번 (3시간마다)

                    if(server_file_time< 0  || uv_hh >= 18 || uv_servertime_hh >=18){//18시 발표시간의 데이터는 다음날(6시)자료부터 표출
                        uv_date.setDate(uv_date.getDate()+1);
                    }
                    if(Number(uv_servertime_hh) < 18){
                        tr_thtml += "<th scope='col' id='th_A07_1' colspan='4'><span class='dtag'>오늘("+uv_date.getDate()+"일)</span></th>";
                        uv_date.setDate(uv_date.getDate()+1);
                        tr_thtml += "<th scope='col' id='th_A07_2' colspan='4'><span class='dtag'>내일("+uv_date.getDate()+"일)</span></th>";
                        uv_date.setDate(uv_date.getDate()+1);
                        tr_thtml += "<th scope='col' id='th_A07_3' colspan='4'><span class='dtag'>모레("+uv_date.getDate()+"일)</span></th>";

                    }else{
                       // uv_date.setDate(uv_date.getDate()+1);
                        tr_thtml += "<th scope='col' id='th_A07_1' colspan='4'><span class='dtag'>내일("+uv_date.getDate()+"일)</span></th>";
                        uv_date.setDate(uv_date.getDate()+1);
                        tr_thtml += "<th scope='col' id='th_A07_2' colspan='4'><span class='dtag'>모레("+uv_date.getDate()+"일)</span></th>";
                        uv_date.setDate(uv_date.getDate()+1);
                        tr_thtml += "<th scope='col' id='th_A07_3' colspan='4'><span class='dtag'>글피("+uv_date.getDate()+"일)</span></th>";
                        tmrflag = true;

                    }
                 
                    break;
   
        }

        save_time = parseInt(server_file_time/3);
        $("#uv_tbl").find("thead").html(tr_thtml);
        uv_date = new Date(uv_yy,Number(uv_mm)-1,uv_dd);
        if(tmrflag){
            //내일자료부터 표출될경우
            uv_date.setDate(uv_date.getDate()+1);
        }
        var th_thtml="";
        th_thtml+="<tr>";
        th_thtml+="<th>시각</th>";

        var uv_index = (Number(uv_hh) < 24?Number(uv_hh):0)+(parseInt(server_file_time/3)*3);

        //데이터가 안나와서 server_file_time이 마이너스일때(반나절이상지난 데이터를 사용할때)
        if((server_file_time/3) < 0 ||uv_servertime_hh >=18){

            var num = parseInt((server_file_time+24)/3);            
            var startindex = parseInt((uv_servertime_hh-6)/3);

            if(uv_servertime_hh%3 == 0){
                uv_index = uv_index+3;
            }
            if(uv_index ==18 && uv_servertime_hh>18){
                uv_index = uv_index+3;
            }
            if(uv_servertime_hh< 9 || uv_servertime_hh >=18){
                num = parseInt((6-uv_hh+24)/3);
                startindex = 0;
            }
            var chk_num = num; //첫시간 실황 표출을 위함
            
            for(var i = 0; i < time_type; i++){

                if(startindex > i && startindex < 4){
                    th_thtml += "<td>-</td>";
                }else{
                    if(uv_index>18){
                        uv_index = 9;
                    }else if(uv_index <9){
                        uv_index = 9;
                    }
                    if(chk_num==num){
                        th_thtml+="<td><a href='javascript:' data-indata='"+num+"' data-nowchk='Y' data-bar_day='"+uv_date.getFullYear()+"년 "+(uv_date.getMonth()+1)+"월 "+uv_date.getDate()+"일 "+uv_index+"시' class='uv-time-bt li_h'>실황</a></td>";
                    }else{
                        th_thtml+="<td><a href='javascript:' data-indata='"+num+"' data-nowchk='N' data-bar_day='"+uv_date.getFullYear()+"년 "+(uv_date.getMonth()+1)+"월 "+uv_date.getDate()+"일 "+uv_index+"시' class='uv-time-bt'>"+numberPlusZero(uv_index-3)+"시</br>~"+numberPlusZero(uv_index)+"시</a></td>";
                    }
                    num++;
                    uv_index = uv_index+3; 
                }

                if(uv_index > 18){
                    uv_index = 0;
                    uv_date.setDate(uv_date.getDate()+1);
                    num = num+4;
                }
    
            }
        }else{
            var num = parseInt(server_file_time/3);
            var startindex = parseInt((uv_servertime_hh-6)/3);
     
            if(uv_servertime_hh< 9){
                num = parseInt((6-uv_hh)/3);
                startindex = 0;
            }
            var chk_num = num; //첫시간 실황 표출을 위함
            for(var i = 0; i < time_type; i++){

                if(startindex > i && startindex < 4){
                    th_thtml += "<td>-</td>";
                }else{
                    uv_index = uv_index+3; 
              
                    if(uv_index>18){
                        uv_index = 9;
                    }else if(uv_index <9){
                        uv_index = 9;
                    }
                    if(chk_num==num){
                        th_thtml+="<td><a href='javascript:' data-indata='"+num+"' data-nowchk='Y' data-bar_day='"+uv_date.getFullYear()+"년 "+(uv_date.getMonth()+1)+"월 "+uv_date.getDate()+"일 "+uv_index+"시' class='uv-time-bt li_h'>실황</a></td>";
                    }else{
                        th_thtml+="<td><a href='javascript:' data-indata='"+num+"' data-nowchk='N' data-bar_day='"+uv_date.getFullYear()+"년 "+(uv_date.getMonth()+1)+"월 "+uv_date.getDate()+"일 "+uv_index+"시' class='uv-time-bt'>"+numberPlusZero(uv_index-3)+"시~"+numberPlusZero(uv_index)+"시</a></td>";
                    }
                    num++;
                }
                if(uv_index >= 18){
                    uv_index = 0;
                    uv_date.setDate(uv_date.getDate()+1);
                    num = num+4;
                }
            }

        }

        th_thtml+="</tr>";
        $("#uv_tbl").find("tbody").html(th_thtml);
        $(".uv-time-bt").eq(0).addClass("on").attr('title','선택됨');
       /* if(Number(uv_servertime_hh) >= 18){
            $("#dfs-tab-head_A07").show();
        }else{
            $("#dfs-tab-head_A07").hide();
        }*/
        $(".uv-time-bt").eq(0).click();
        //createUvMap();
        $(".over-scroll-web").stop().animate({scrollLeft : 0},0);
    }

    //대기정체지수 시간테이블
    function airTimeList(air_data){
        var air_time_data = air_data.data_json["0"];
        air_save_map_json = air_data.data_json;
        var tr_thtml="";
        $("#airTit").html("단계별 대응요령 / "+ air_time_data.KONAME);
        $("#airMapTit").html("체감온도("+ air_time_data.KONAME+")");
        $("#airSmentTit").html("대응요령 / "+ air_time_data.KONAME);
        var air_yy =air_time_data.filetime.slice(0,4);
        var air_mm =air_time_data.filetime.slice(4,6);
        var air_dd =air_time_data.filetime.slice(6,8);
        var air_hh =air_time_data.filetime.slice(8,10);
        var air_date = new Date(air_yy,Number(air_mm)-1,air_dd);
        var air_servertime_yy =air_data.server_time.slice(0,4);
        var air_servertime_mm =air_data.server_time.slice(4,6);
        var air_servertime_dd =air_data.server_time.slice(6,8);
        var air_servertime_hh =air_data.server_time.slice(8,10);
        $("#air_time_left").html(air_yy+"년 "+air_mm+"월 "+air_dd+"일 ("+getDays(air_date.getDay())+")"+" | "+air_hh+":00");
        air_date_text =" "+air_mm+"월 "+air_dd+"일";
        tr_thtml += "<tr>";
        tr_thtml += "<th scope='col' id='th_A09_0'>날짜</th>";
        var server_file_time = Number(air_servertime_hh)-Number(air_hh);//지금시간 - 파일시간
        var time_type=0;
        if(server_file_time >= 0){

            for(var i = 0; i < 8; i++){  //하루에 8번 3시간 간격 
                if(i*3 == Number(air_hh)+(parseInt(server_file_time/3)*3) ){
                    tr_thtml += "<th scope='col' id='th_A09_1' colspan='"+(8-i)+"'><span class='dtag'>오늘("+air_date.getDate()+"일)</span></th>";
                    air_date.setDate(air_date.getDate()+1);
                    tr_thtml += "<th scope='col' id='th_A09_2' colspan='8'><span class='dtag'>내일("+air_date.getDate()+"일)</span></th>";
                    air_date.setDate(air_date.getDate()+1);
                    tr_thtml += "<th scope='col' id='th_A09_3' colspan='8'><span class='dtag'>모레("+air_date.getDate()+"일)</span></th>";
                    time_type = 24 - i + parseInt(server_file_time/3);
                    if(Number(air_servertime_hh) >= 18){
                        air_date.setDate(air_date.getDate()+1);
                        tr_thtml += "<th scope='col' id='th_A09_4' colspan='8'><span class='dtag'>글피("+air_date.getDate()+"일)</span></th>";
                        time_type = time_type + 8;
                    }
                    break;
                }
            }
        }else{
            for(var i = 1; i <= 8; i++){  //하루에 8번 3시간 간격 
                if(i*3 == Number(air_hh)+(parseInt(server_file_time/3)*3) ){
                    if(server_file_time< 0  || air_hh == 21){//21시 발표시간의 데이터는 다음날(0시)자료부터 표출
                        air_date.setDate(air_date.getDate()+1);
                    }
                    tr_thtml += "<th scope='col' id='th_A09_1' colspan='"+(8-i)+"'><span class='dtag'>오늘("+air_date.getDate()+"일)</span></th>";
                    air_date.setDate(air_date.getDate()+1);
                    tr_thtml += "<th scope='col' id='th_A09_2' colspan='8'><span class='dtag'>내일("+air_date.getDate()+"일)</span></th>";
                    air_date.setDate(air_date.getDate()+1);
                    tr_thtml += "<th scope='col' id='th_A09_3' colspan='8'><span class='dtag'>모레("+air_date.getDate()+"일)</span></th>";
                    time_type = 24 - i ;
                    if(Number(air_servertime_hh) >= 18){
                        air_date.setDate(air_date.getDate()+1);
                        tr_thtml += "<th scope='col' id='th_A09_4' colspan='8'><span class='dtag'>글피("+air_date.getDate()+"일)</span></th>";
                        time_type = time_type + 8;
                    }
                    break;
                }
            }
        }
        save_time = parseInt(server_file_time/3);
        $("#air_tbl").find("thead").html(tr_thtml);
        air_date = new Date(air_yy,Number(air_mm)-1,air_dd);
        var th_thtml="";
        th_thtml+="<tr>";
        th_thtml+="<th>시각</th>";
        var air_index = (Number(air_hh) < 24?Number(air_hh):0)+(parseInt(server_file_time/3)*3);
         //데이터가 안나와서 server_file_time이 마이너스일때(반나절이상지난 데이터를 사용할때)
         if(parseInt(server_file_time/3) < 0){
            var num = parseInt((server_file_time+24)/3);
            for(var i = num; i < time_type+num ; i++){
                if(air_servertime_hh%3 == 0){
                    air_index = air_index+3; 
                }
                th_thtml+="<td><a href='javascript:' data-indata='"+i+"' data-bar_day='"+air_date.getFullYear()+"년 "+(air_date.getMonth()+1)+"월 "+air_date.getDate()+"일 "+air_index+"시' class='air-time-bt'>"+numberPlusZero(air_index)+"시</a></td>";
                if(air_index == 24){
                    air_index = 0;
                    air_date.setDate(air_date.getDate()+1);
                }
                if(air_servertime_hh%3 != 0){
                    air_index = air_index+3; 
                }
            }
        }else{
            for(var i = parseInt(server_file_time/3); i < time_type; i++){
                air_index = air_index+3;
                th_thtml+="<td><a href='javascript:' data-indata='"+i+"' data-bar_day='"+air_date.getFullYear()+"년 "+(air_date.getMonth()+1)+"월 "+air_date.getDate()+"일 "+air_index+"시' class='air-time-bt'>"+numberPlusZero(air_index)+"시</a></td>";
                if(air_index == 24){
                    air_index = 0;
                    air_date.setDate(air_date.getDate()+1);
                }
            }
        }
        th_thtml+="</tr>";
        $("#air_tbl").find("tbody").html(th_thtml);
        $($(".air-time-bt")[0]).addClass("on").attr('title','선택됨');
        if(Number(air_servertime_hh) >= 18){
            $("#dfs-tab-head_A09").show();
        }else{
            $("#dfs-tab-head_A09").hide();
        }
        //$($(".air-time-bt")[0]).addClass("on").attr('title','선택됨');
        $($(".air-time-bt")[0]).click();
        //createAirMap();
        $(".over-scroll-web").stop().animate({scrollLeft : 0},0);
        //21시이후로는 오늘날짜 테그hide -칸이 좁아서 이미지깨짐
        if(air_servertime_hh >=21 ){
            $("#air_tbl thead>tr>th").eq(1).find('span').hide();
        }

    }

    //동파가능지수 시간 리스트 생성
    function freezeTimeList(data){
        var freeze_time_data = data.data_json["0"];
        freeze_save_map_json = data.data_json;
        var tr_thtml="";
        
        var freeze_yy =freeze_time_data.filetime.slice(0,4);
        var freeze_mm =freeze_time_data.filetime.slice(4,6);
        var freeze_dd =freeze_time_data.filetime.slice(6,8);
        var freeze_hh =freeze_time_data.filetime.slice(8,10);
        var freeze_date = new Date(freeze_yy,Number(freeze_mm)-1,freeze_dd);

        var freeze_servertime_yy = data.server_time.slice(0,4);
        var freeze_servertime_mm = data.server_time.slice(4,6);
        var freeze_servertime_dd = data.server_time.slice(6,8);
        var freeze_servertime_hh = data.server_time.slice(8,10);
        
        
        $("#freeze_time_left").html(freeze_yy+"년 "+freeze_mm+"월 "+freeze_dd+"일 ("+getDays(freeze_date.getDay())+")"+" | "+freeze_hh+":00");

        tr_thtml += "<tr>";
        tr_thtml += "<th scope='col' id='th_A08_0'>날짜</th>";
        var server_file_time = Number(freeze_servertime_hh)-Number(freeze_hh);
        var time_type=0;
        if(0 > server_file_time){//18시 데이터가 들어오고 00시가 지났을때
            freeze_date.setDate(freeze_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_A08_1' colspan='"+(24-freeze_servertime_hh)+"'><span class='dtag'>오늘("+freeze_date.getDate()+"일)</span></th>";
            freeze_date.setDate(freeze_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_A08_2' colspan='24'><span class='dtag'>내일("+freeze_date.getDate()+"일)</span></th>";
            freeze_date.setDate(freeze_date.getDate()+1);
            if(freeze_hh == 18){
                tr_thtml += "<th scope='col' id='th_A08_3' colspan='24'><span class='dtag'>모레("+freeze_date.getDate()+"일)</span></th>";
            }
            time_type= 1;
        }else if(12 <= server_file_time ){//18시 데이터가 안들어왔을때
            tr_thtml += "<th scope='col' id='th_A08_1' colspan='"+(24-freeze_servertime_hh)+"'><span class='dtag'>오늘("+freeze_date.getDate()+"일)</span></th>";
            freeze_date.setDate(freeze_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_A08_2' colspan='24'><span class='dtag'>내일("+freeze_date.getDate()+"일)</span></th>";
            freeze_date.setDate(freeze_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_A08_3' colspan='24'><span class='dtag'>모레("+freeze_date.getDate()+"일)</span></th>";
            time_type= 2;
        }else{
            tr_thtml += "<th scope='col' id='th_A08_1' colspan='"+(24-Number(freeze_hh)-server_file_time)+"'><span class='dtag'>오늘("+freeze_date.getDate()+"일)</span></th>";
            freeze_date.setDate(freeze_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_A08_2' colspan='24'><span class='dtag'>내일("+freeze_date.getDate()+"일)</span></th>";
            freeze_date.setDate(freeze_date.getDate()+1);
            tr_thtml += "<th scope='col' id='th_A08_3' colspan='24'><span class='dtag'>모레("+freeze_date.getDate()+"일)</span></th>";
            freeze_date.setDate(freeze_date.getDate()+1);
            time_type= 3;
            if(Number(freeze_servertime_hh) >= 18){
                tr_thtml += "<th scope='col' id='th_A08_4' colspan='24'><span class='dtag'>글피("+freeze_date.getDate()+"일)</span></th>";
                time_type= 4;
            }
        }
        tr_thtml += "</tr>";
        $("#freeze_tbl").find("thead").html(tr_thtml);
        freeze_date = new Date(freeze_yy,Number(freeze_mm)-1,freeze_dd);
        var th_thtml="";
        th_thtml+="<tr>";
        th_thtml+="<th>시각</th>";
        var data_num = 0;
        if(Number(freeze_servertime_hh) >= 24){
            freeze_servertime_hh = 0;
        }
        
        
        if(time_type == 1){
            if(freeze_hh == 18){
                data_num = 6+Number(freeze_servertime_hh);
            }else{
                data_num = 18+Number(freeze_servertime_hh);
            }
            save_time=data_num;
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = Number(freeze_servertime_hh)+1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            if(freeze_hh == 18){
                for(var i = 1; i <= 24; i++){
                    th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                    data_num++;
                }
            }
        }else if(time_type == 2){
            data_num = server_file_time;
            save_time=data_num;
            for(var i = Number(freeze_servertime_hh)+1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
        }else if(time_type == 3){
            data_num = server_file_time;
            save_time=data_num;
            for(var i = Number(freeze_servertime_hh)+1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
        }else if(time_type == 4){
            data_num = server_file_time;
            save_time=data_num;
            for(var i = Number(freeze_servertime_hh)+1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
            freeze_date.setDate(freeze_date.getDate()+1);
            for(var i = 1; i <= 24; i++){
                th_thtml+="<td><a href='javascript:' data-indata='"+data_num+"' data-bar_day='"+freeze_date.getFullYear()+"년 "+(freeze_date.getMonth()+1)+"월 "+freeze_date.getDate()+"일 "+i+"시' class='freeze-time-bt'>"+numberPlusZero(i)+"시</a></td>";
                data_num++;
            }
        }
     
        //$("#freeze_time_right").html(freeze_yy+"년 "+freeze_mm+"월 "+freeze_dd+"일 "+(Number(freeze_servertime_hh)+1)+"시 예보");
        th_thtml+="</tr>";
        $("#freeze_tbl").find("tbody").html(th_thtml);
		      freeze_date_text = $("#freeze_tbl").find("tbody").find("td").first().find("a").data("bar_day").split("년")[1].split("일")[0]+"일";

        $($(".freeze-time-bt")[0]).addClass("on").attr('title','선택됨');
        $("#div_A08").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
        $($("#div_A08").find(".dfs-tab-head").find("li")[0]).find("a").addClass("on").attr('title','선택됨');
        if(Number(freeze_servertime_hh) >= 18){
            $("#dfs-tab-head_A08").show();
        }else{
            $("#dfs-tab-head_A08").hide();
        }
        $(".over-scroll-web").stop().animate({scrollLeft : 0},0);

        //23시이후로는 오늘날짜 테그hide -칸이 좁아서 이미지깨짐
        if(freeze_servertime_hh >=23 ){
            $("#freeze_tbl thead>tr>th").eq(1).find('span').hide();
        }

        createFreezeMap()
    }

    //요일
    function getDays(num){
        if(num == 0) return "일";
        if(num == 1) return "월";
        if(num == 2) return "화";
        if(num == 3) return "수";
        if(num == 4) return "목";
        if(num == 5) return "금";
        if(num == 6) return "토";
    }
    //9보다 작을때 0붙이기
    function numberPlusZero(num){
        if(Number(num) < 10){
            return "0"+num
        }else{
            return num
        }
    }
    $(".life_btn").find("button").on("click",function(e){
        e.preventDefault();
        if(jisu_code == "A07_1" || jisu_code == "A07_2"){
            if(nowchk=="Y"){
                void(window.open(appPrefix+'resources/jsp/life/imgdata_popup.jsp'+'?CODE='+jisu_code.replaceAll("A","N")+'&point=0&nowchk=Y','jisu_pop','width=820, height=760').focus());
            }else{
                void(window.open(appPrefix+'resources/jsp/life/imgdata_popup.jsp'+'?CODE='+jisu_code+'&point='+save_time+'&nowchk=N','jisu_pop','width=820, height=760').focus());
            }
        }else if(jisu_code == "A08" || jisu_code ==  "A09"){
            void(window.open(appPrefix+'resources/jsp/life/timedata_popup_test.jsp'+'?CODE='+jisu_code+'&point='+save_time,'jisu_pop','width=820, height=760').focus());
        }else if(jisu_code == "D06" || jisu_code == "D07" || jisu_code == "D08"){
            void(window.open(appPrefix+'resources/jsp/life/imgdata_popup_test.jsp'+'?CODE='+jisu_code+'&point='+save_data_point,'jisu_pop','width=820, height=760').focus());
        }else{
            if(nowchk=="Y"){
                //일사량 구분추가
                void(window.open(appPrefix+'resources/jsp/life/heatdata_popup.jsp'+'?CODE='+jisu_code.replaceAll("A","N")+'&point=0&nowchk=Y','jisu_pop','width=820, height=760').focus());    
            }else{
                void(window.open(appPrefix+'resources/jsp/life/heatdata_popup.jsp'+'?CODE='+jisu_code+'&point='+save_time+'&nowchk=N','jisu_pop','width=820, height=760').focus());    
            }
             
        }
    });
    $(".life_btn02").find("button").on("click",function(e){
        e.preventDefault();
        var url = "popup_life_01.jsp";
        if(jisu_code == "D06" || jisu_code == "D07" || jisu_code == "D08"){
            url = "popup_health_06.jsp";
        }
        void(window.open(appPrefix+'resources/jsp/life/'+url,'jisu_pop','width=905, height=580').focus());
        
    });
    
    
    //체감온도 시간 클릭시 지도 변경
    $(document).on("click",".heat-time-bt",function(e){
        e.preventDefault();
        save_time = $(this).data("indata");
        save_point = "1100000";
        nowchk=$(this).data("nowchk");
        
        if(fileTimeMM>=10 || fileTimeMM <=4){
            $("#heat_mm_info").html("10~4월은 겨울철 체감온도 사용");
        }else{
            $("#heat_mm_info").html("");
        }
        
        if(nowchk=="Y"){
			if(jisu_code == "A40"){
				$("#heat_time_right").html($(this).data("bar_day")+" 실황");            
				$("#heatMapTit2").css("display","block");
				$("#drsMapTit").css("display","block");
				$("#drsMapTit").removeClass("on").removeAttr('title');
				$("#heatMapTit2").addClass("on").attr('title','선택됨');
			}else{
				$("#heat_time_right").html($(this).data("bar_day")+" 예보");            
				$("#heatMapTit2").css("display","none");
				$("#drsMapTit").css("display","none");
				nowchk="N";
				ndsr_chk="N";
			}            
        }else{
            $("#heat_time_right").html($(this).data("bar_day")+" 예보");
            $("#heatMapTit2").css("display","none");
            $("#drsMapTit").css("display","none");
            ndsr_chk="N";
        }
        if(jisu_code=="A40"){
            $(".legend_temperatrue").show();
        }else{
            $(".legend_temperatrue").hide();
        }
        $(".legend_sun").hide();
        
        $(".heat-time-bt").each(function(index,item){
            $(item).removeClass("on").removeAttr('title');
        });
        
        $(this).addClass("on").attr('title','선택됨');
        createHeatMap();
 	     	changeDateTap('heat');
    });
    
    //체감온도 맵 체감온도 선택
    $(document).on("click","#heatMapTit2",function(e){
        //태그 활성화 처리
        //일사량 태그 비활성화 처리
        ndsr_chk="N";
        
        $("#heatMapTit2").addClass("on").attr('title','선택됨');
        $("#drsMapTit").removeClass("on").removeAttr('title');
        if(jisu_code=="A40"){
            $(".legend_temperatrue").show();
        }else{
            $(".legend_temperatrue").hide();
        }
        $(".legend_sun").hide();
        createHeatMap();
    });
    
    //체감온도 맵 일사량 선택
    $(document).on("click","#drsMapTit",function(e){
        //태그 활성화 처리
        //체감온도 태그 비활성화 처리
        ndsr_chk="Y";
        $("#drsMapTit").addClass("on").attr('title','선택됨');
        $("#heatMapTit2").removeClass("on").removeAttr('title');
        $(".legend_sun").show();
        $(".legend_temperatrue").hide();
        createHeatMap();
    });
    
    
    //대기정체지수 시간 클릭시 지도 변경
    $(document).on("click",".air-time-bt",function(e){
        e.preventDefault();
        save_time = $(this).data("indata");
        save_point = "1100000";
        air_date_text = $(this).data("bar_day").split("년")[1].split("일")[0]+"일";
        $(".air-time-bt").each(function(index,item){
            $(item).removeClass("on").removeAttr('title');
        });
        $(this).addClass("on").attr('title','선택됨');
	      	changeDateTap('air');
        createAirMap();
    });
	
	 //자외선지수 시간 클릭시 지도 변경
    $(document).on("click",".uv-time-bt",function(e){
        e.preventDefault();
        save_time = $(this).data("indata");
        save_point = "1100000";
        uv_date_text = $(this).data("bar_day").split("년")[1].split("일")[0]+"일";
        nowchk=$(this).data("nowchk");
        $(".uv-time-bt").each(function(index,item){
            $(item).removeClass("on").removeAttr('title');
        });
        $(this).addClass("on").attr('title','선택됨');
        changeDateTap('uv');
        createUvMap();
    });

	//-1,현재,+1 시간이동 버튼
    $(document).on("click",".timeBtnChange",function(e){
        e.preventDefault();
        var mode = $(this).data("indata");
        var type = $(this).parent().data("indata");
        var s_time = $("."+type+"-time-bt.on").parent().index();
        if(type != "uv"){
            if(mode == 'minus'){
                if(s_time != 1){
                    $("."+type+"-time-bt").eq((s_time-2)).click();
                }          
            }else if(mode == 'now'){
                $("."+type+"-time-bt").eq(0).click();
            }else if(mode =='plus'){
                $("."+type+"-time-bt").eq(s_time).click();        
            }
        }else if(type == "uv"){
            if(mode == 'minus'){
                if(s_time != 1){
                    $("#uv_tbl tbody>tr>td").eq((s_time-2)).find('a').click();
                }          
            }else if(mode == 'now'){
                $("."+type+"-time-bt").eq(0).click();
            }else if(mode =='plus'){
                $("#uv_tbl tbody>tr>td").eq(s_time).find('a').click();        
            }
        }
        
    });

    //시간변경시 오늘, 내일 탭 변경
    function changeDateTap(type, mode){
        var arr = [];
        var num = 0;
        var sum = 0;
        var timeIndex = $('.'+type+'-time-bt.on').parent().index();
        for (var index = 1; index < $('#'+type+'_tbl thead>tr>th').length; index++) {
            arr[index-1] = $('#'+type+'_tbl thead>tr>th').eq(index).attr("colspan");       
        }
        for (var i = 0; i < arr.length; i++) {
            sum += Number(arr[i]);
            if(sum<timeIndex){
                num ++; 
            }
        }

        $(".over-scroll-web."+type).stop().animate({scrollLeft :$('.'+type+'-time-bt.on').parent().position().left},200);
        
        if(type =='air'){
            $("#div_A09").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
            $("#div_A09").find(".dfs-tab-head").find("li").eq(num).find("a").addClass("on").attr('title','선택됨');
        }else if(type == 'uv'){
            $("#div_A07_2").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
            var text =  $('#'+type+'_tbl thead>tr>th').eq(1).text();
            if(text.indexOf("오늘") != -1){
                $("#div_A07_2").find(".dfs-tab-head").find("li").eq(num).find("a").addClass("on").attr('title','선택됨');
            }else{//다음날 (18시이후)
                $("#div_A07_2").find(".dfs-tab-head").find("li").eq(num+1).find("a").addClass("on").attr('title','선택됨');
            }

        }else if(type == 'freeze'){
            $("#div_A08").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
            $("#div_A08").find(".dfs-tab-head").find("li").eq(num).find("a").addClass("on").attr('title','선택됨');
        }else if(type == 'heat'){
            $("#div_A41").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
            $("#div_A41").find(".dfs-tab-head").find("li").eq(num).find("a").addClass("on").attr('title','선택됨');
        }  
    }

    //동파지수 시간 클릭시 지도 변경
    $(document).on("click",".freeze-time-bt",function(e){
        e.preventDefault();
        save_time = $(this).data("indata");
        save_point = "1100000";
        freeze_date_text = $(this).data("bar_day").split("년")[1].split("일")[0]+"일";
        $(".freeze-time-bt").each(function(index,item){
            $(item).removeClass("on").removeAttr('title');
        });
        $(this).addClass("on").attr('title','선택됨');
        changeDateTap('freeze');
        createFreezeMap();
    });

    
    //자외선지수 오늘내일모레글피버튼
    $("#div_A07_1").find(".dfs-tab-head").find("li").on("click",function(e){
        e.preventDefault();
        save_data_point = $(this).data("index");
        save_day_point = $(this).data("index");
        save_time = $(this).data("index");
        $($($("#div_A07_1").find(".dfs-tab-head").find("li")).find("a")).removeClass("on").removeAttr('title');
        $(this).find("a").addClass("on").attr('title','선택됨');
        createUvMap('day');
    });

	//신자외선지수 오늘내일모레글피버튼
    $("#div_A07_2").find(".dfs-tab-head").find("li").on("click",function(e){
        e.preventDefault();
        $("#div_A07_2").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');

        $(this).find("a").addClass("on").attr('title','선택됨');
        var th_index = $(this).data("index");
        var th_point = 0;
        for(var i = 0 ; i < th_index ; i++){
            th_point += $("#th_A07_"+i).outerWidth();
        }
        $(".over-scroll-web").stop().animate({scrollLeft : th_point},200);
    });
    //체감온도 오늘 내일 모레 글피 버튼
    $("#div_A41").find(".dfs-tab-head").find("li").on("click",function(e){
        e.preventDefault();
        //$("#div_A41").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
        //$(this).find("a").addClass("on").attr('title','선택됨');
        var th_index = $(this).data("index");
        var th_point = 0;
        for(var i = 0 ; i < th_index ; i++){
            th_point += $("#th_"+i).outerWidth();
        }
        $(".over-scroll-web").stop().animate({scrollLeft : th_point},200);
    });
    //동파지수 오늘 내일 모레 글피 버튼
    $("#div_A08").find(".dfs-tab-head").find("li").on("click",function(e){
        e.preventDefault();
        $("#div_A08").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
        $(this).find("a").addClass("on").attr('title','선택됨');
        var th_index = $(this).data("index");
        var th_point = 0;
        for(var i = 0 ; i < th_index ; i++){
            th_point += $("#th_A08_"+i).outerWidth();
        }
        $(".over-scroll-web").stop().animate({scrollLeft : th_point},200);
    });

    //대기정체지수 오늘 내일 모레 글피 버튼
    $("#div_A09").find(".dfs-tab-head").find("li").on("click",function(e){
        e.preventDefault();
        $("#div_A09").find(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
        $(this).find("a").addClass("on").attr('title','선택됨');
        var th_index = $(this).data("index");
        var th_point = 0;
        for(var i = 0 ; i < th_index ; i++){
            th_point += $("#th_A09_"+i).outerWidth();
        }
        $(".over-scroll-web").stop().animate({scrollLeft : th_point},200);
    });

    //꽃가루농도위험지수  오늘내일모레글피버튼
    $("#div_D06").find(".dfs-tab-head").find("li").on("click",function(e){
        e.preventDefault();
        save_data_point = $(this).data("index");
        save_day_point = $(this).data("index");
        save_time = $(this).data("index");
        $($($("#div_D06").find(".dfs-tab-head").find("li")).find("a")).removeClass("on").removeAttr('title');
        $(this).find("a").addClass("on").attr('title','선택됨');
        flowerCreateMap();
        realFlowerData();
    });

    //세부메뉴 버튼(자외선지수,체감온도,대기정체지수,동파지수,꽃가루농도위험지수 ) 
    $(document).on("click",".tab-sm",function(e){
        e.preventDefault();
        $($(".tab-sm").find("a")).removeClass("on").removeAttr('title');
        $($(this).find("a")).addClass("on").attr('title','선택됨');
        $.each($(".tab-sm"), function(index, item){
            if($(this).data("jisu-code") == "D08"){
				$("#div_D06").hide();
			}else{
                $("#div_"+$(item).data("jisu-code")).hide();
		    }
        });
        jisu_code =$(this).data("jisu-code");
        
        if($(this).data("jisu-code") == "A41" || $(this).data("jisu-code") == "A40"){//체감온도 클릭시 A41(노인) 을 기본 선택으로 설정
            $.each($(".life_tab").find("li").find("img"), function(index, item){
                $(item).attr("src",$(item).attr("src").replace("_on","_off"));
                if($(item).data("jisu-code") == jisu_code){
                    $(item).attr("src",$(item).attr("src").replace("_off","_on"));
                }
            });
            createEtcDataList();
            createHeatDataList(jisu_code);
            
        }else if($(this).data("jisu-code") == "D06" || $(this).data("jisu-code") == "D08"){//꽃가루농도위험지수 클릭시 A06(참나무) 을 기본 선택으로 설정
            $.each($(".life_tab.tree_tab").find("li").find("img"), function(index, item){
                //console.log($(item).data("jisu-code")+"__"+jisu_code);
                $(item).attr("src",$(item).attr("src").replace("_on","_off"));
                if($(item).data("jisu-code") == jisu_code){
                    $(item).attr("src",$(item).attr("src").replace("_off","_on"));
                }
            });
            createJisuDataList();
        }else{
            createJisuDataList();
        }
        
        //체감온도 일반 표출을 위한 분기       
        if(jisu_code=="A40"){
            $("#div_A41").show();
            $("#A40_tab_list").show();
            $("#A41_tab_list").hide();
            nowchk="Y";
            ndsr_chk="N";
            $("#heatMapTit2").css("display","block");
            $("#drsMapTit").css("display","block");
            $("#drsMapTit").removeClass("on").removeAttr('title');
            $("#heatMapTit2").addClass("on").attr('title','선택됨');
            $(".legend_temperatrue").show();
            $(".legend_sun").hide();
        }else{
            if(jisu_code=="A41"){
                $("#A40_tab_list").hide();
                $("#A41_tab_list").show();
                nowchk="Y";
                ndsr_chk="N";
                $("#heatMapTit2").css("display","block");
                $("#drsMapTit").css("display","block");
                $("#drsMapTit").removeClass("on").removeAttr('title');
                $("#heatMapTit2").addClass("on").attr('title','선택됨');
                $(".legend_temperatrue").hide();
                $(".legend_sun").hide();
            }else{
                $("#div_A41").hide();
            }
            //꽃가루 지수 표출 순서 변경에 따른 추가
            if(jisu_code=="D08"){
                $("#div_D06").show();
            }else{
                $("#div_"+$(this).data("jisu-code")).show();
            }
        }    
    });

    //체감온도 종류 버튼
    $(".heat_tab").find("li").on("click",function(e){
        e.preventDefault();
        if($(this).find("img").attr("src").indexOf("off") != -1){
            
            $.each($(".heat_tab").find("li").find("img"), function(index, item){
                $(item).attr("src",$(item).attr("src").replace("_on","_off"));
            });
            $(this).find("img").attr("src",$(this).find("img").attr("src").replace("_off","_on"));
            jisu_code = $(this).find("img").data("jisu-code");
            //최초이동시 처음 시간대 설정
            nowchk="Y";
            ndsr_chk="N";
            createEtcDataList();
            createHeatDataList(jisu_code);
            
        }
    });

     //꽃가루농도위험지수 종류 버튼
     $(".life_tab.tree_tab").find("li").on("click",function(e){
        e.preventDefault();
        if($(this).find("img").attr("src").indexOf("off") != -1){
            $.each($(".life_tab.tree_tab").find("li").find("img"), function(index, item){
                $(item).attr("src",$(item).attr("src").replace("_on","_off"));
            });
            $(this).find("img").attr("src",$(this).find("img").attr("src").replace("_off","_on"));
            jisu_code = $(this).find("img").data("jisu-code");
            //day_ment_jisu_code = day_ment[jisu_code];
            createJisuDataList();
        }
    });

    //오늘 내일 모레 글피 버튼 스크롤시 이벤트
    $(".over-scroll-web").on("scroll",function(e){
        e.preventDefault();
        
        $(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
        overScrollWebScroll(this);
    });

    function overScrollWebScroll(obj){

        var scrollWidth = $(obj).scrollLeft();
        var checkIndex ;
        var thWidth = 0;
	      	var th_point =[];
        var th_width = 0;
        //스크롤이 맞춰서 날짜 이동 기능
        for(var i =0; i<$($(obj).find("thead").find("th")).length;i++){
            th_width += $($(obj).find("thead").find("th").eq(i)).outerWidth();
            th_point[i] = th_width;
        }
 
        if(scrollWidth == 0 || scrollWidth < th_point[0]){
            $($(obj).find("th")[1]).find("span").css("margin-left",0 );
        }else if(scrollWidth < th_point[1]){
            if(scrollWidth < th_point[1] - ($($(obj).find("thead").find("th").eq(1).find("span")).outerWidth()+10)){

                $($(obj).find("th")[1]).find("span").css("margin-left",scrollWidth-th_point[0]);
                $($(obj).find("th")[2]).find("span").css("margin-left",0 );
            }
        }else if(scrollWidth < th_point[2]){
            if(scrollWidth < th_point[2] - ($($(obj).find("thead").find("th").eq(2).find("span")).outerWidth()+10)){
                $($(obj).find("th")[2]).find("span").css("margin-left",scrollWidth-th_point[1]);
                $($(obj).find("th")[3]).find("span").css("margin-left",0);
            }
        }else if(scrollWidth < th_point[3]){
            if(scrollWidth < th_point[3] - ($($(obj).find("thead").find("th").eq(3).find("span")).outerWidth()+10)){
                $($(obj).find("th")[3]).find("span").css("margin-left",scrollWidth -th_point[2]);
                $($(obj).find("th")[4]).find("span").css("margin-left",0);
            }
        }else if($($(obj).find("th")).length >= 4){
            $($(obj).find("th")[4]).find("span").css("margin-left",scrollWidth -th_point[3]);
        }

        $(obj).parents(".cmp-dfs-slider").find("li").find("a").removeClass("on").removeAttr('title');
        $.each($(obj).parents(".time_tbl_wr").find("li"), function(index, item){
            if($(item).data("index")){
                var thtml = $(item).html();
                $(item).html(thtml);
            }
        });
        $.each($(obj).find(".table-col.table-bold.time_tbl").find("th"), function(index, item){
            thWidth = thWidth + $(item).outerWidth()
            if(scrollWidth+1 >= thWidth){
                checkIndex = index;
            }
           
        });
        if(checkIndex == null){
            checkIndex = 0 ;
        }
        //자외선지수 9-18시자료 표출에따른 내일,모레,글피 탭 변경에 의한 예외처리
        if($(obj).find("table").attr("id") == "uv_tbl"){
            if($("#th_A07_1").text().indexOf("오늘") != -1){
                //오늘,내일,모레 탭 on
                $($(obj).parents(".time_tbl_wr").find("li")[checkIndex]).find("a").addClass("on").attr('title','선택됨');
            }else{
                //내일,모레,글피 탭 on
                $($(obj).parents(".time_tbl_wr").find("li")[checkIndex+1]).find("a").addClass("on").attr('title','선택됨');
            }
        }else{
            //오늘,내일,모레 탭 on
            $($(obj).parents(".time_tbl_wr").find("li")[checkIndex]).find("a").addClass("on").attr('title','선택됨');
        }


    }

    var lines = Highcharts.geojson(Highcharts.maps['korea/mapline'], 'mapline');        
    
    //클래스 변환 값, 데이터 출력 값
    //자외선 지수 지도
    function createUvMap(version){
        var data =""; 
		      if(version == 'day'){
		      	   for(var i = 0; i < save_json.length; i++){
	               save_json[i]["value"] = save_json[i]["value"+save_data_point];
	               if(save_area_point_code == save_json[i].code){
	                   map_point_click(save_area_point_ko, save_json[i]["value"+save_data_point],version);
	               }     
	           }
            data = save_json;
		      }else{
            
            if(nowchk=="Y"){            
	            for(var i = 0; i < save_real_json.length; i++){
	                save_real_json[i]["value"] = save_real_json[i]["value0"];
	                if(save_area_point_code == save_real_json[i].code){
	                    map_point_click(save_area_point_ko, save_real_json[i]["value0"],version);
	                }     
	            }
                data = save_real_json;
            }else{
                for(var i = 0; i < save_json.length; i++){
	                   save_json[i]["value"] = save_json[i]["value"+save_time];
	                   if(save_area_point_code == save_json[i].code){
	                       map_point_click(save_area_point_ko, save_json[i]["value"+save_time],version);
	                   }     
	               }
                data = save_json;
            }
		      }
       
        $('#uv_map_area').highcharts('Map', {
        chart: {
          borderWidth: 1,
          events: {
          	click: function() { //ie7에서 클릭할 때 반응하기 위한 이벤트 위치
          		if(this.hoverPoint != null) {
          			var obj = this.hoverPoint;
          			save_area_point_code = obj.code; //현재 선택되어 있는 지점 코드 저장
          			save_area_point_ko = obj.properties.SGG_NM; //현재 선택되어진 지점명 저장
          			
          			map_point_click(obj.properties.SGG_NM,obj.value,version);
          		}
            }
          }
        },
        title: {
          text: ''
        },
        legend: {
          enabled : false
        },
        mapNavigation: {
          enabled: true
        },
        credits: {
            enabled: false
        },        
        /* 없애고 데이터 자체에 color 로 넣어도됨 */
        colorAxis: {
        dataClasses: [{
          from: 0,
          to: 2.9,
          color: "#e5e5e5"
        }, {
          from: 3,
          to: 5.9,
          color: "#FED98E"
        }, {
          from: 6,
          to: 7.9,
          color: "#FD8D3C"
        }, {
          from: 8,
          to: 10.9,
          color: "#e1260a"
        }, {
          from: 11,
          to: 100,
          color: "#54278F"
        }]
      },
        series: [{
          data: data,
          mapData: Highcharts.maps['korea/drought_base'],
          joinBy: ['SGG_CD', 'code'],
          dataLabels: {
            enabled: false,
            color: '#FFFFFF'
          },
          name: ' ',
          tooltip: {
            pointFormatter: function(){
            var val = this.value;
            var lv = "";
            if(0 <= val && val <= 2){
              lv = "낮음";
            }else if(2 < val && val <= 5){
              lv = "보통";
              }else if(5 < val && val <= 7){
              lv = "높음";
              }else if(7 < val && val <= 10){
              lv = "매우높음";
              }else if(10 < val){
              lv = "위험";
              }
            var redata = this.properties.SGG_NM + ' : ' +  lv + "(" + val + ")";
            return redata;
            }
            },
          point:{
            events: {
              click: function(){
                /* 액션필요 */
                save_area_point_code = this.code; //현재 선택되어있는 지점 코드 저장
                save_area_point_ko = this.properties.SGG_NM; //현재 선택되어진 지점명 저장
                map_point_click(this.properties.SGG_NM, this.value,version);
              }
            }
          }
        },{
                data: lines,
				            enableMouseTracking: false,
				            name: 'line',
				            type: 'mapline',
				            color: '#808080',
				            lineWidth: 1,
				            zIndex:10
            }]
      });
      //$("#mapcon > .highcharts-container > div").css("marginTop","-38px");
    }
    //체감온도 지도 
    function createHeatMap(){
        if((typeof save_time === "undefined" || save_time < 0) && jisu_code != "A40" ){
            save_time = 0;
        }
    	if(jisu_code != "A40"){
			nowchk="N";
		}
        var sc = 0;
        //alert("createHeatMap_click_nowchk:"+nowchk+"_save_time:"+save_time);
        if(nowchk=="Y"){
            if(ndsr_chk == "Y"){
                // 일사량 (실황) 
                for(var i = 0; i < save_dsr_real_json.length; i++){
                    heat_save_map_json[i]["value"] = save_dsr_real_json[i]["value0"];
                    if(save_area_point_code == save_dsr_real_json[i].code){
                        sc = save_dsr_real_json[i]["value0"];
                        heatImage_click(save_area_point_ko, sc, save_area_point_code);
                    }     
                }
                
                var data = heat_save_map_json; 
            }else{
                //체감온도
                for(var i = 0; i < heat_real_save_map_json.length; i++){
                    heat_save_map_json[i]["value"] = heat_real_save_map_json[i]["value0"];
                    if(save_area_point_code == heat_real_save_map_json[i].code){
                        sc = heat_real_save_map_json[i]["value0"];
                        heatImage_click(save_area_point_ko, sc, save_area_point_code);
                    }     
                }
                
                var data = heat_save_map_json; 
            }
        }else{
            for(var i = 0; i < heat_save_map_json.length; i++){
                heat_save_map_json[i]["value"] = heat_save_map_json[i]["value"+save_time];
                if(save_area_point_code == heat_save_map_json[i].code){
                    sc = heat_save_map_json[i]["value"+save_time];
                    heatImage_click(save_area_point_ko, sc, save_area_point_code);
                }     
            }
            
            var data = heat_save_map_json;
        }
        
        var m4 = 30;
        var m5 = 31;
		      /* 2020.05.13 east*/   
        if(jisu_code == "A41" || jisu_code == "A42" || jisu_code == "A43" || jisu_code == "A46"){
            m4 = 34;
            m5 = 37;
        }else{
            m4 = 35;
            m5 = 38;
        }
        var dataClasses = new Array();
        if(ndsr_chk == "Y"){//일반
            dataClasses=  [{
                from: 0.00,
                to: 0.99,
                color: "#000090"
            }, {
                from: 0.10,
                to: 0.19,
                color: "#00119C"
            }, {
                from: 0.20,
                to: 0.29,
                color: "#0016A4"
            }, {
                from: 0.30,
                to: 0.39,
                color: "#001BAC"
            }, {
                from: 0.40,
                to: 0.49,
                color: "#0021B3"
            }, {
                from: 0.50,
                to: 0.59,
                color: "#0027BC"
            }, {
                from: 0.60,
                to: 0.69,
                color: "#002CC3"
            }, {
                from: 0.70,
                to: 0.79,
                color: "#0032CB"
            }, {
                from: 0.80,
                to: 0.89,
                color: "#0037D4"
            }, {
                from: 0.90,
                to: 0.99,
                color: "#003CDB"
            }, {
                from: 1.00,
                to: 1.09,
                color: "#0042E3"
            }, {
                from: 1.10,
                to: 1.19,
                color: "#0047EB"
            }, {
                from: 1.20,
                to: 1.29,
                color: "#004CF4"
            }, {
                from: 1.30,
                to: 1.39,
                color: "#0052FB"
            }, {
                from: 1.40,
                to: 1.49,
                color: "#0057FA"
            }, {
                from: 1.50,
                to: 1.59,
                color: "#005EEC"
            }, {
                from: 1.60,
                to: 1.69,
                color: "#0065DD"
            }, {
                from: 1.70,
                to: 1.79,
                color: "#006DCF"
            }, {
                from: 1.80,
                to: 1.89,
                color: "#0075C0"
            }, {
                from: 1.90,
                to: 1.99,
                color: "#007BB3"
            }, {
                from: 2.00,
                to: 2.09,
                color: "#0083A3"
            }, {
                from: 2.10,
                to: 2.19,
                color: "#008B95"
            }, {
                from: 2.20,
                to: 2.29,
                color: "#009286"
            }, {
                from: 2.30,
                to: 2.39,
                color: "#009978"
            }, {
                from: 2.40,
                to: 2.49,
                color: "#00A16A"
            }, {
                from: 2.50,
                to: 2.59,
                color: "#00A85B"
            }, {
                from: 2.60,
                to: 2.69,
                color: "#00B016"
            }, {
                from: 2.70,
                to: 2.79,
                color: "#08B840"
            }, {
                from: 2.80,
                to: 2.89,
                color: "#28C138"
            }, {
                from: 2.90,
                to: 2.99,
                color: "#47C930"
            }, {
                from: 3.00,
                to: 3.09,
                color: "#64D128"
            }, {
                from: 3.10,
                to: 3.19,
                color: "#84DA20"
            }, {
                from: 3.20,
                to: 3.29,
                color: "#A1E217"
            }, {
                from: 3.30,
                to: 3.39,
                color: "#C1EB0E"
            }, {
                from: 3.40,
                to: 3.49,
                color: "#E0E007"
            }, {
                from: 3.50,
                to: 3.59,
                color: "#FFFD00"
            }, {
                from: 3.60,
                to: 3.69,
                color: "#FFED00"
            }, {
                from: 3.70,
                to: 3.79,
                color: "#FFDB00"
            }, {
                from: 3.80,
                to: 3.89,
                color: "#FFCB00"
            }, {
                from: 3.90,
                to: 3.99,
                color: "#FFBA00"
            }, {
                from: 4.00,
                to: 4.09,
                color: "#FFA900"
            }, {
                from: 4.10,
                to: 4.19,
                color: "#FF9800"
            }, {
                from: 4.20,
                to: 4.29,
                color: "#FF8600"
            }, {
                from: 4.30,
                to: 4.39,
                color: "#FF7700"
            }, {
                from: 4.40,
                to: 4.49,
                color: "#FF6600"
            }, {
                from: 4.50,
                to: 4.59,
                color: "#FF5500"
            }, {
                from: 4.60,
                to: 4.69,
                color: "#FF4400"
            }, {
                from: 4.70,
                to: 4.79,
                color: "#FF3400"
            }, {
                from: 4.80,
                to: 4.89,
                color: "#FF2300"
            }, {
                from: 4.90,
                to: 4.99,
                color: "#FF1100"
            }, {
                from: 5.0,
                to: 100,
                color: "#FF0000"
            }
            ]
        }else if(jisu_code == "A41" || jisu_code == "A42" || jisu_code == "A43" || jisu_code == "A46"){
            dataClasses=  [{
                 from: -100,
                to: 28.9,
                color: "#efefef"
            }, {
                from: 29,
                to: 30.9,
                color: "#FED98E"
            }, {
                from: 31,
                to: 33.9,
                color: "#FD8D3C"
            }, {
                from: 34,
                to: 36.9,
                color: "#e1260a "
            }, {
                from: 37,
                to: 100,
                color: "#54278F"
            }]
        }else if(jisu_code == "A44" || jisu_code == "A45"){//농촌, 비닐하우스
            dataClasses=  [{
                from: -100,
                to: 28.9,
                color: "#efefef"
            }, {
                from: 29,
                to: 32.9,
                color: "#FED98E"
            }, {
                from: 33,
                to: 34.9,
                color: "#FD8D3C"
            }, {
                from: 35,
                to: 37.9,
                color: "#e1260a "
            }, {
                from: 38,
                to: 100,
                color: "#54278F"
            }]
        }else if(jisu_code == "A40"){//일반
            dataClasses=  [{
                from: -100,
                to: -20.1,
                color: "#EEEEEE"
            }, {
                from: -20.0,
                to: -19.1,
                color: "#E5ACFF"
            }, {
                from: -19.0,
                to: -18.1,
                color: "#DA87FF"
            }, {
                from: -18.0,
                to: -17.1,
                color: "#CD61FF"
            }, {
                from: -17.0,
                to: -16.1,
                color: "#C23EFF"
            }, {
                from: -16.0,
                to: -15.1,
                color: "#B71FFF"
            }, {
                from: -15.0,
                to: -14.1,
                color: "#AD07FF"
            }, {
                from: -14.0,
                to: -13.1,
                color: "#A000F7"
            }, {
                from: -13.0,
                to: -12.1,
                color: "#9200E4"
            }, {
                from: -12.0,
                to: -11.1,
                color: "#8700CE"
            }, {
                from: -11.0,
                to: -10.1,
                color: "#7F00BF"
            }, {
                from: -10.0,
                to: -9.1,
                color: "#CBCCE8"
            }, {
                from: -9.0,
                to: -8.1,
                color: "#B3B4DE"
            }, {
                from: -8.0,
                to: -7.1,
                color: "#9A9BD3"
            }, {
                from: -7.0,
                to: -6.1,
                color: "#8081C7"
            }, {
                from: -6.0,
                to: -5.1,
                color: "#6567BC"
            }, {
                from: -5.0,
                to: -4.1,
                color: "#4C4EB1"
            }, {
                from: -4.0,
                to: -3.1,
                color: "#3436A7"
            }, {
                from: -3.0,
                to: -2.1,
                color: "#1F219D"
            }, {
                from: -2.0,
                to: -1.1,
                color: "#0D1096"
            }, {
                from: -1.0,
                to: -0.1,
                color: "#000390"
            }, {
                from: 0.0,
                to: 0.9,
                color: "#ACE5FF"
            }, {
                from: 1.0,
                to: 1.9,
                color: "#87D9FF"
            }, {
                from: 2.0,
                to: 2.9,
                color: "#61FFFF"
            }, {
                from: 3.0,
                to: 3.9,
                color: "#3EC1FF"
            }, {
                from: 4.0,
                to: 4.9,
                color: "#1FB5FF"
            }, {
                from: 5.0,
                to: 5.9,
                color: "#07ABFF"
            }, {
                from: 6.0,
                to: 6.9,
                color: "#009DF6"
            }, {
                from: 7.0,
                to: 7.9,
                color: "#008DDE"
            }, {
                from: 8.0,
                to: 8.9,
                color: "#0080C4"
            }, {
                from: 9.0,
                to: 9.9,
                color: "#0077B3"
            }, {
                from: 10.0,
                to: 10.9,
                color: "#96FE96"
            }, {
                from: 11.0,
                to: 11.9,
                color: "#69FC69"
            }, {
                from: 12.0,
                to: 12.9,
                color: "#40F940"
            }, {
                from: 13.0,
                to: 13.9,
                color: "#1EF31E"
            }, {
                from: 14.0,
                to: 14.9,
                color: "#08E908"
            }, {
                from: 15.0,
                to: 15.9,
                color: "#00D500"
            }, {
                from: 16.0,
                to: 16.9,
                color: "#00BD00"
            }, {
                from: 17.0,
                to: 17.9,
                color: "#00A400"
            }, {
                from: 18.0,
                to: 18.9,
                color: "#008E00"
            }, {
                from: 19.0,
                to: 19.9,
                color: "#008000"
            }, {
                from: 20.0,
                to: 20.9,
                color: "#FFF09A"
            }, {
                from: 21.0,
                to: 21.9,
                color: "#FFEA6E"
            }, {
                from: 22.0,
                to: 22.9,
                color: "#FFE343"
            }, {
                from: 23.0,
                to: 23.9,
                color: "#FFDC1F"
            }, {
                from: 24.0,
                to: 24.9,
                color: "#FFD604"
            }, {
                from: 25.0,
                to: 25.9,
                color: "#F9CD00"
            }, {
                from: 26.0,
                to: 26.9,
                color: "#EDC300"
            }, {
                from: 27.0,
                to: 27.9,
                color: "#E0B900"
            }, {
                from: 28.0,
                to: 28.9,
                color: "#D4B000"
            }, {
                from: 29.0,
                to: 29.9,
                color: "#CCAA00"
            }, {
                from: 30.0,
                to: 30.9,
                color: "#FCABAB"
            }, {
                from: 31.0,
                to: 31.9,
                color: "#FA8585"
            }, {
                from: 32.0,
                to: 32.9,
                color: "#F86060"
            }, {
                from: 33.0,
                to: 33.9,
                color: "#F63E3E"
            }, {
                from: 34.0,
                to: 34.9,
                color: "#F32121"
            }, {
                from: 35.0,
                to: 35.9,
                color: "#EE0B0B"
            }, {
                from: 36.0,
                to: 36.9,
                color: "#E30000"
            }, {
                from: 37.0,
                to: 37.9,
                color: "#D50000"
            }, {
                from: 38.0,
                to: 38.9,
                color: "#FF0000"
            }, {
                from: 39.0,
                to: 39.9,
                color: "#BF0000"
            }, {
                from: 40.0,
                to: 61,
                color: "#333333"
            }
            
            ]
        }else{
            dataClasses= [{
                from: -100,
                to: 30.9,
                color: "#efefef"
            }, {
                from: 31,
                to: 32.9,
                color: "#FED98E"
            }, {
                from: 33,
                to: 34.9,
                color: "#FD8D3C"
            }, {
                from: 35,
                to: 37.9,
                color: "#e1260a "
            }, {
                from: 38,
                to: 100,
                color: "#54278F"
            }]
        }
        $('#heat_map_area').highcharts('Map', {
              chart: {
                  borderWidth: 1,
                  events: {
          	           click: function() { //ie7에서 클릭할 때 반응하기 위한 이벤트 위치
          		              if(this.hoverPoint != null) {
          			                 var obj = this.hoverPoint;
          			                 save_area_point_code = obj.code; //현재 선택되어 있는 지점 코드 저장
          			                 save_area_point_ko = obj.properties.SGG_NM; //현재 선택되어진 지점명 저장
          			                 heatImage_click(obj.properties.SGG_NM, obj.value, obj.properties.SGG_CD);
          		              }
                      }
                  }
              },
              title: {
                  text: ''
              },
              legend: {
                  enabled : false
              },
              mapNavigation: {
                  enabled: true
              },
            credits: {
                enabled: false
            },              
              /* 없애고 데이터 자체에 color 로 넣어도됨 */
			           /* 2020.05.13 east*/ 
              colorAxis: {
                dataClasses: dataClasses
            },
              series: [{
                  data: data,
                  mapData: Highcharts.maps['korea/drought_base'],
                  joinBy: ['SGG_CD', 'code'],
                  dataLabels: {
                      enabled: false,
                      color: '#FFFFFF'
                  },
                  name: ' ',
                  tooltip: {
                      pointFormatter: function(){
                        var val = this.value;
                        var lv = "";
                        if(jisu_code == "A41" || jisu_code == "A42" || jisu_code == "A43" || jisu_code == "A46"){
                            if(val < 29){
                                lv = "-";
                            }else if(29 <= val && val < 31){
                                lv = "관심";
                            }else if(31 <= val && val < 34){
                                lv = "주의";
                            }else if(34 <= val && val < 37){
                                lv = "경고";
                            }else if(37 <= val){
                                lv = "위험";
                            }
                        }else if(jisu_code == "A44" || jisu_code == "A45"){
                            if(val < 29){
                                lv = "-";
                            }else if(29 <= val && val < 33){
                                lv = "관심";
                            }else if(33 <= val && val < 35){
                                lv = "주의";
                            }else if(35 <= val && val < 38){
                                lv = "경고";
                            }else if(38 <= val){
                                lv = "위험";
                            }                        
                        }else if(jisu_code == "A40"){
                            lv = "-";
                        }else{
                            if(val < 31){
                                lv = "-";
                            }else if(31 <= val && val < 33){
                                lv = "관심";
                            }else if(33 <= val && val < 35){
                                lv = "주의";
                            }else if(35 <= val && val < 38){
                                lv = "경고";
                            }else if(38 <= val){
                                lv = "위험";
                            }
                        }
                        var redata = this.properties.SGG_NM + ' : ' +  lv + "(" + val + ")";
                        return redata;
                      }
                  },
                  point:{
                      events: {
                          click: function(){
                              /* 액션필요 */
                              save_area_point_code = this.code; //현재 선택되어있는 지점 코드 저장
                              save_area_point_ko = this.properties.SGG_NM; //현재 선택되어진 지점명 저장
                              heatImage_click(this.properties.SGG_NM, this.value, this.properties.SGG_CD);
                          }
                      }
                  }
              },{
				              data: lines,
				              enableMouseTracking: false,
				              name: 'line',
				              type: 'mapline',
				              color: '#808080',
				              lineWidth: 1,
				              zIndex:10
            }]
          });
          
          //heatImage_click(save_pkornm, sc, save_point);
    }
    //대기정체지수 지도
    function createAirMap(){
        var sc = 0;
        for(var i = 0; i < air_save_map_json.length; i++){
            air_save_map_json[i]["value"] = air_save_map_json[i]["value"+save_time];
            if(save_area_point_code == air_save_map_json[i].code){
                sc = air_save_map_json[i]["value"+save_time];
                airImage_click(save_area_point_ko, sc, save_area_point_code);
            }     
        }
        
        var data = air_save_map_json;
        var m4 = 30;
        var m5 = 31;
		      /* 2020.05.13 east*/   
        if(jisu_code == "A41" || jisu_code == "A42" || jisu_code == "A43" || jisu_code == "A46"){
            m4 = 34;
            m5 = 37;
        }else{
            m4 = 35;
            m5 = 38;
        }
        
        $('#air_map_area').highcharts('Map', {
              chart: {
                  borderWidth: 1,
                  events: {
          	        click: function() { //ie7에서 클릭할 때 반응하기 위한 이벤트 위치
          		        if(this.hoverPoint != null) {
          			        var obj = this.hoverPoint;
          			        save_area_point_code = obj.code; //현재 선택되어 있는 지점 코드 저장
          			        save_area_point_ko = obj.properties.SGG_NM; //현재 선택되어진 지점명 저장
                     save_point =  obj.properties.SGG_CD;
          			        airImage_click(obj.properties.SGG_NM, obj.value, obj.properties.SGG_CD);
          		        }
                    }
                  }
              },
              title: {
                  text: ''
              },
              legend: {
                  enabled : false
              },
              mapNavigation: {
                  enabled: true
              },
            credits: {
                enabled: false
            },
              /* 없애고 데이터 자체에 color 로 넣어도됨 */
			           /* 2020.05.13 east*/ 
              colorAxis: {
                dataClasses: [{
                    from: 101,
                    to: 102,
                    color: "#FFFFFF"
                }, {
                    from: 0,
                    to: 25,
                    color: "#e5e5e5"
                }, {
                    from: 26,
                    to: 50,
                    color: "#FED98E"
                }, {
                    from: 51,
                    to: 75,
                    color: "#FD8D3C"
                }, {
                    from: 76,
                    to: 100,
                    color: "#e1260a"
                }]
            },
              series: [{
                  data: data,
                  mapData: Highcharts.maps['korea/drought_base'],
                  joinBy: ['SGG_CD', 'code'],
                  dataLabels: {
                      enabled: false,
                      color: '#FFFFFF'
                  },
                  name: ' ',
                  tooltip: {
                      pointFormatter: function(){
                        var val = this.value;
                        var lv = "";
                        if(0 <= val && val <= 25){
                            lv = "매우높음";
                        }else if(25 < val && val <= 50){
                            lv = "높음";
                        }else if(50 < val && val <= 75){
                            lv = "보통";
                        }else if(75 < val && val <= 100){
                            lv = "낮음";
                        }else if(100 < val && val <= 101){
                            lv = "없음";
                        }
                        var redata = this.properties.SGG_NM + ' : ' +  lv + "(" + val + ")";
                        return redata;
                      }
                  },
                  point:{
                      events: {
                          click: function(){
                              /* 액션필요 */
                              save_area_point_code = this.code; //현재 선택되어있는 지점 코드 저장
                              save_area_point_ko = this.properties.SGG_NM; //현재 선택되어진 지점명 저장
                              save_point =  this.properties.SGG_CD;
                              airImage_click(this.properties.SGG_NM, this.value, this.properties.SGG_CD);
                          }
                      }
                  }
              },{
                   data: lines,
                   enableMouseTracking: false,
                   name: 'line',
                   type: 'mapline',
                   color: '#808080',
                   lineWidth: 1,
                   zIndex:10
            }]
          });
          //airImage_click(save_pkornm, sc, save_point);
    }
    
    //지도에서 지역 클릭 했을때(체감온도)
    function heatImage_click(NM, value, SGG_CD){
        var heat_state_area="";
        var state_area_thtml="";
        var mark_select = 0;
        if(jisu_code == "A40"){
			value = etc_data_search('heat',nowchk,SGG_CD);
		}else{
			value = etc_data_search('heat',"N",SGG_CD);
		}
		
        $("#heatData").text(value+" ℃");
        
        if(jisu_code == "A41" || jisu_code == "A42" || jisu_code == "A43" || jisu_code == "A46"){
            if(value >= 37){
                heat_state_area = "위험";
                mark_select=5;
            }else if(value < 37 && value >= 34){
                heat_state_area = "경고";
                mark_select=4;
            }else if(value < 34 && value >= 31){
                heat_state_area = "주의";
                mark_select=3;
            }else if(value < 31 && value >= 29){
                heat_state_area = "관심";
                mark_select=2;
            }else if(value < 29){
                heat_state_area = "-";
                mark_select=1;
            }else{
                heat_state_area = "-";
                mark_select=1;
            }
        }else if(jisu_code == "A44" || jisu_code == "A45"){//농촌, 비닐하우스
            if(value >= 38){
                heat_state_area = "위험";
                mark_select=5;
            }else if(value < 38 && value >= 35){
                heat_state_area = "경고";
                mark_select=4;
            }else if(value < 35 && value >= 33){
                heat_state_area = "주의";
                mark_select=3;
            }else if(value < 33 && value >= 29){
                heat_state_area = "관심";
                mark_select=2;
            }else if(value < 29){
                heat_state_area = "-";
                mark_select=1;
            }else{
                heat_state_area = "-";
                mark_select=1;
            }
         }else if(jisu_code == "A40"){//일반
                heat_state_area = "";
                mark_select=1;
         }else{
            if(value >= 38){
                heat_state_area = "위험";
                mark_select=5;
            }else if(value < 38 && value >= 35){
                heat_state_area = "경고";
                mark_select=4;
            }else if(value < 35 && value >= 33){
                heat_state_area = "주의";
                mark_select=3;
            }else if(value < 33 && value >= 31){
                heat_state_area = "관심";
                mark_select=2;
            }else if(value < 31){
                heat_state_area = "-";
                mark_select=1;
            }else{
                heat_state_area = "-";
                mark_select=1;
            }
        }
        state_area_thtml += "<span class='icon_img'><img src='"+appPrefix +"resources/images/life/_indexImg/icons/g/"+jisu_code+"_"+mark_select+".png' alt='체감온도 "+heat_state_area+"'></span>";
        state_area_thtml += "<span class='state "+data_color_Rating(mark_select)+"'>"+heat_state_area+"</span>";
        $("#heat_state_area").html(state_area_thtml);
        if(mark_select == 1){
            $("#heatSment").html("<li>관심 단계에 도달하지 않은 상태</li>");
        }else{
            $("#heatSment").html(heat_ment[jisu_code][5-mark_select].sment);
        }
        $("#heat_stn_date").html(NM+"<span>"+$("#heat_time_right").text().split("년 ")[1].split("일")[0]+"일</span>");
        
        //실 데이터 표출
        if(jisu_code=="A40"){
            $("#heatData").attr('class','babyblue');
        }else{
            $("#heatData").attr('class',data_color_Rating(mark_select));
        }
        
        //일사량 (실황)
        if(nowchk=="Y"){
			if(jisu_code == "A40"){
				$("#dsr_list").css("display","block");
				$("#dsrData").html(etc_data_search('dsr',nowchk,SGG_CD)+" MJ/m<sup>2</sup>");
			}else{
				$("#dsr_list").css("display","none");
			}
        }else{
            $("#dsr_list").css("display","none");
        }
        //기온(예측/실황)
        if(jisu_code == "A40"){
			$("#tmpData").text(etc_data_search('tmp',nowchk,SGG_CD)+" ℃");
		}else{
			$("#tmpData").text(etc_data_search('tmp',"N",SGG_CD)+" ℃");
		}
        
        
        $("#div_A41").find(".state_area").find("ul").find("li").each(function(index,item){
            $(item).html($(item).html().replace("<span>▼</span>",""));
        });
        var state_area_text = $($("#div_A41").find(".state_area").find("ul").find("li")[mark_select-1]).html();
        $($("#div_A41").find(".state_area").find("ul").find("li")[mark_select-1]).html(state_area_text+"<span>▼</span>");
    }
    
    //일사량, 기온 데이터 확인
    function etc_data_search(jisuchk,datakind,localcode){
        var revalue="N";
      
        if(datakind=="N"){  //예보
            if(jisuchk=="tmp"){
                for(var i = 0; i < save_tmp_json.length; i++){ 
                    if(localcode == save_tmp_json[i].code){
                        revalue = save_tmp_json[i]["value"+save_time];
                    }     
                }
            }else if(jisuchk=="heat"){
                for(var i = 0; i < heat_save_map_json.length; i++){ 
                    if(localcode == heat_save_map_json[i].code){
                        revalue = heat_save_map_json[i]["value"+save_time];
                    }     
                }
            }
        }else{  //실황
            if(jisuchk=="tmp"){
                for(var i = 0; i < save_tmp_real_json.length; i++){ 
                    if(localcode == save_tmp_real_json[i].code){
                        revalue = save_tmp_real_json[i]["value0"];
                    }     
                } 
            }else if(jisuchk=="dsr"){ 
                for(var i = 0; i < save_dsr_real_json.length; i++){ 
                    if(localcode == save_dsr_real_json[i].code){
                        revalue = save_dsr_real_json[i]["value0"];
                    }     
                } 
            }else if(jisuchk=="heat"){ 
                for(var i = 0; i < heat_real_save_map_json.length; i++){ 
                    if(localcode == heat_real_save_map_json[i].code){
                        revalue = heat_real_save_map_json[i]["value0"];
                    }     
                }
            }
        }
      
        return revalue;         
    } 
    
    //동파가능지수 지도 
    function createFreezeMap(){
        var sc = 0;
        for(var i = 0; i < freeze_save_map_json.length; i++){
            freeze_save_map_json[i]["value"] = freeze_save_map_json[i]["value"+save_time];
            if(save_point == freeze_save_map_json[i].code){
                sc = freeze_save_map_json[i]["value"+save_time];
            }     
        }
        
        var data = freeze_save_map_json;
        var m4 = 30;
        var m5 = 31;
		/* 2020.05.13 east*/   
        if(jisu_code == "A41" || jisu_code == "A42" || jisu_code == "A43" || jisu_code == "A46"){
            m4 = 34;
            m5 = 37;
        }else{
            m4 = 35;
            m5 = 38;
        }
        
        $('#freeze_map_area').highcharts('Map', {
              chart: {
                  borderWidth: 1,
                  events: {
          	        click: function() { //ie7에서 클릭할 때 반응하기 위한 이벤트 위치
          		        if(this.hoverPoint != null) {
          			        var obj = this.hoverPoint;
          			        save_area_point_code = obj.code; //현재 선택되어 있는 지점 코드 저장
          			        save_area_point_ko = obj.properties.SGG_NM; //현재 선택되어진 지점명 저장
          			
          			        freezeImage_click(obj.properties.SGG_NM, obj.value, obj.properties.SGG_CD);
          		        }
                    }
                  }
              },
              title: {
                  text: ''
              },
              legend: {
                  enabled : false
              },
              mapNavigation: {
                  enabled: true
              },
            credits: {
                enabled: false
            },
              /* 없애고 데이터 자체에 color 로 넣어도됨 */
			   /* 2020.05.13 east*/ 
              colorAxis: {
                dataClasses: [{
                    from: 0,
                    to: 25,
                    color: "#e5e5e5"
                }, {
                    from: 26,
                    to: 50,
                    color: "#FED98E"
                }, {
                    from: 51,
                    to: 75,
                    color: "#FD8D3C"
                }, {
                    from: 76,
                    to: 100,
                    color: "#e1260a"
                }]
            },
              series: [{
                  data: data,
                  mapData: Highcharts.maps['korea/drought_base'],
                  joinBy: ['SGG_CD', 'code'],
                  dataLabels: {
                      enabled: false,
                      color: '#FFFFFF'
                  },
                  name: ' ',
                  tooltip: {
                      pointFormatter: function(){
                        var val = this.value;
                        var lv = "";
                        if(0 <= val && val <= 25){
                            lv = "낮음";
                        }else if(25 < val && val <= 50){
                            lv = "보통";
                        }else if(50 < val && val <= 75){
                            lv = "높음";
                        }else if(75 < val){
                            lv = "매우높음";
                        }
                        var redata = this.properties.SGG_NM + ' : ' +  lv;
                        return redata;
                      }
                  },
                  point:{
                      events: {
                          click: function(){
                              /* 액션필요 */
                              save_area_point_code = this.code; //현재 선택되어있는 지점 코드 저장
                              save_area_point_ko = this.properties.SGG_NM; //현재 선택되어진 지점명 저장
                              freezeImage_click(this.properties.SGG_NM, this.value, this.properties.SGG_CD);
                          }
                      }
                  }
              },{
				              data: lines,
				              enableMouseTracking: false,
				              name: 'line',
				              type: 'mapline',
				              color: '#808080',
				              lineWidth: 1,
				              zIndex:10
            }]
          });
          freezeImage_click(save_pkornm, sc, save_point);
    }
    //지도에서 지역 클릭 했을때(동파가능지수)
    function freezeImage_click(NM, value, SGG_CD){
        var lv;
        var con;
        var icon;
        var mark_select;
        var state_area_thtml="";
        if(0 <= value && value <= 25){
            lv = "낮음";
            con = "A08_1";
            icon = '<div class="'+con+'"></div>';
            mark_select = 0;
        }else if(25 < value && value <= 50){
            lv = "보통";
            con = "A08_2";
            icon = '<div class="'+con+'"></div>';
            mark_select = 1;
        }else if(50 < value && value <= 75){
            lv = "높음";
            con = "A08_3";
            icon = '<div class="'+con+'"></div>';
            mark_select = 2;
        }else if(75 < value){
            lv = "매우높음";
            con = "A08_4";
            icon = '<div class="'+con+'"></div>';
            mark_select = 3;
        }
        state_area_thtml += "<span class='icon_img'><img src='"+ appPrefix +"resources/images/life/_indexImg/icons/g/"+jisu_code+"_"+(mark_select+1)+".png' alt='동파가능지수 "+lv+"'></span>";
        state_area_thtml += "<span class='state "+data_color_Rating(mark_select+1)+"'>"+lv+"</span>";
        $("#freeze_state_area").html(state_area_thtml);
        $("#freezeSment").html(freeze_ment_array[mark_select]);
        $("#freeze_stn_date").html(NM+"<span>"+freeze_date_text+"</span>");

        $("#div_"+jisu_code).find(".state_area").find("ul").find("li").each(function(index,item){
            $(item).html($(item).html().replace("<span>▼</span>",""));
        });
        var state_area_text = $($("#div_"+jisu_code).find(".state_area").find("ul").find("li")[mark_select]).html();
        $($("#div_"+jisu_code).find(".state_area").find("ul").find("li")[mark_select]).html(state_area_text+"<span>▼</span>");
    }

    //지도에서 지역 클릭 했을때(대기정체지수)
    function airImage_click(NM, value, SGG_CD){
        var lv;
        var con;
        var icon;
        var mark_select;
        var state_area_thtml="";
        if(100 < value && value <= 101){
            lv = "예측값이 없는 경우 근접지역 예측값을 참고하시기 바랍니다.";
            con = "A09";
            icon = '<div class="'+con+'" ></div>';
            mark_select = 3;
        }else if(0 <= value && value <= 25){
            lv = "낮음";
            con = "A09_1";
            icon = '<div class="'+con+'"></div>';
            mark_select = 0;
        }else if(25 < value && value <= 50){
            lv = "보통";
            con = "A09_2";
            icon = '<div class="'+con+'"></div>';
            mark_select = 1;
        }else if(50 < value && value <= 75){
            lv = "높음";
            con = "A09_3";
            icon = '<div class="'+con+'"></div>';
            mark_select = 2;
        }else if(75 < value && value <= 100){
            lv = "매우높음";
            con = "A09_4";
            icon = '<div class="'+con+'"></div>';
            mark_select = 3;
        }
        state_area_thtml += "<span class='icon_img'><img src='"+ appPrefix +"resources/images/life/_indexImg/icons/g/"+jisu_code+"_"+(mark_select+1)+".png' alt='대기정체지수 "+lv+"'></span>";
        state_area_thtml += "<span class='state "+data_color_Rating(mark_select+1)+"'>"+lv+"</span>";
        $("#air_state_area").html(state_area_thtml);
        $("#airSment").html(air_ment_array[mark_select]);
        $("#air_stn_date").html(NM+"<span>"+air_date_text+"</span>");
        $("#div_"+jisu_code).find(".state_area").find("ul").find("li").each(function(index,item){
            $(item).html($(item).html().replace("<span>▼</span>",""));
        });
        var state_area_text = $($("#div_"+jisu_code).find(".state_area").find("ul").find("li")[mark_select]).html();
        $($("#div_"+jisu_code).find(".state_area").find("ul").find("li")[mark_select]).html(state_area_text+"<span>▼</span>");
    }




    //지수에 대한 색깔 선택
    function data_color_Rating(num){
        if(num == 1){
            return "l_gray";
        }else if(num == 2){
            return "yellow";
        }else if(num == 3){
            return "orange";
        }else if(num == 4){
            return "red";
        }else if(num == 5){
            return "purple";
        } 
    }
    //자외선지수 지도 클릭시 설명 표시
    function map_point_click(indata, indata2,version){
        //등급 관련 
        var val = Number(indata2); //지역 value값
        var lv = ""; //등급명
        var icon = "A07"; //등급 class
        var con = "";
        var mark_select = 0;
        if(version == 'day'){
            if(0 <= val && val <= 2){
                lv = "낮음";
                con = "A07_1_1";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 0;
            }else if(2 < val && val <= 5){
                lv = "보통";
                con = "A07_1_2";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 1;
            }else if(5 < val && val <= 7){
                lv = "높음";
                con = "A07_1_3";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 2;
            }else if(7 < val && val <= 10){
                lv = "매우높음";
                con = "A07_1_4";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 3;
            }else if(10 < val){
                lv = "위험";
                con = "A07_1_5";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 4;
            }
        }else{//신자외선 a07_2
            if(0 <= val && val < 3){
                lv = "낮음";
                con = "A07_2_1";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 0;
            }else if(3 <= val && val < 6){
                lv = "보통";
                con = "A07_2_2";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 1;
            }else if(6 <= val && val < 8){
                lv = "높음";
                con = "A07_2_3";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 2;
            }else if(8 <= val && val < 11){
                lv = "매우높음";
                con = "A07_2_4";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 3;
            }else if(11 <= val){
                lv = "위험";
                con = "A07_2_5";
                icon = '<img src="'+ appPrefix +'resources/images/life/_indexImg/icons/e/'+con+'_icon.jpg" alt="자외선지수"></span>';
                mark_select = 4;
            }
        }
        var date_text = new Date(yy,Number(mm)-1,dd);
        date_text.setDate(date_text.getDate()+save_day_point);
        //등급 입력
        
        //$("#htit").html(indata+"<span>"+(Number(date_text.getMonth())+1)+"월 "+date_text.getDate()+"일</span>"); //지역명
        $("#htit").html(indata+"<span>"+uv_date_text+"</span>"); //지역명
        $("#tittext").html(lv);  //등급한글명
        $("#tit_time_text").html(save_day_array[save_day_point]); //선택날짜
        
        $("#gageText").removeClass(data_color_Rating(1)+" "+data_color_Rating(2)+" "+data_color_Rating(3)+" "+data_color_Rating(4)+" "+data_color_Rating(5));
        $("#gageText").addClass(data_color_Rating(mark_select+1));
        $("#gageText").html(lv); //아이콘 등급 한글명
        $("#gageIcon").html(icon); //아이콘 설정
        
        //마크 위치 지정
        var memarray = new Array();
        var i = 0;
  
        for(var idx = 0; idx < 5; idx++){
            memarray[idx] = $("#legmark"+idx).removeClass('on').removeAttr('title');//class 요소중 'on' 이라는 요소 삭제
        }
        memarray[mark_select].addClass("on").attr('title','선택됨');
        $("#sment").html(restr(uv_ment_array[mark_select])); //ment 변경
        $("#div_"+jisu_code).find(".state_area").find("ul").find("li").each(function(index,item){
            $(item).html($(item).html().replace("<span>▼</span>",""));
        });
        var state_area_text = $($("#div_"+jisu_code).find(".state_area").find("ul").find("li")[mark_select]).html();
        $($("#div_"+jisu_code).find(".state_area").find("ul").find("li")[mark_select]).html(state_area_text+"<span>▼</span>");
    }
    
    function createCurrentWarning() {
        var todayWarning = new TodayWarning('today-warning');
    }
    
    function createPopMyPointsEvent() {
        $('.cmp-pop-my-points .sym-close').click(function(e) {
            e.preventDefault();
            var $comp = $(this).parents('.cmp-pop-my-points');
            $comp.css({ marginTop: -$comp.height() + 'px' })
                .bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ $(this).addClass('closed'); });
        });
    }
    
    
    function createGlobalEvent() {
        var isMapMode = displayMode == DISPLAY_MODE_MAP;
        GlobalEvent.on('onAppConfigUpdated', function(e) {
            window.location.reload();
        });
        GlobalEvent.on('onAreaBookmarkDeleted', function(e, bookmarkIndex, bookmark, sender) {
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
        });
        GlobalEvent.on('onAreaBookmarkAdded', function(e, bookmarkIndex, bookmark, sender) {
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated(bookmarkIndex, bookmark);
        });
        GlobalEvent.on('onAddAreaBookmark', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            if(!isMapMode) createJisuDataList();
        });
        GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            if(!isMapMode) createJisuDataList();
        });
        
        GlobalEvent.on('onSaveAreaBookmark', function(e) {
            bookmarkDropdown.refresh();
            if(myPointSlider) myPointSlider.onAreaBookmarkUpdated();
        });
        
        GlobalEvent.on('onAreaBookmarkSelected', function(e, bookmarkIndex, bookmark, sender) {
            if(!bookmark || !bookmark.dong) return;
            if(!bookmark.dong.lat || !bookmark.dong.lon){
                var latlon = convertDfsGrid('toLL', bookmark.dong.x, bookmark.dong.y)
                if(latlon['lat'] && latlon['lng']) {
                    bookmark.dong.lat = latlon['lat'];
                    bookmark.dong.lon = latlon['lng'];
                }
            }
                
            if(sender.id != bookmarkDropdown.id) {
                bookmarkDropdown.refreshSelected(bookmark);
            } 
            
            if(myPointSlider && sender.id != myPointSlider.id) {
                myPointSlider.refreshSelected(bookmark);
            }
            if(!isMapMode) createJisuDataList();
        });
        
        GlobalEvent.on('onAreaShow', function(e, bookmark, sender) {
            if(!bookmark.dong.lat || !bookmark.dong.lon){
                var latlon = convertDfsGrid('toLL', bookmark.dong.x, bookmark.dong.y)
                if(latlon['lat'] && latlon['lng']) {
                    bookmark.dong.lat = latlon['lat'];
                    bookmark.dong.lon = latlon['lng'];
                }
            }
            if(sender && sender.id == 'pop-local-search') {
                $('.pop-local-search').removeClass('on');
            }
            if(myPointSlider && sender.id != myPointSlider.id) {
                 myPointSlider.refreshSelected(bookmark);
            }
            if(bookmarkDropdown) bookmarkDropdown.refreshSelected(bookmark);
            if(!isMapMode) createJisuDataList();

        });
        
        $(document).click(function(e){
            var canCloseLocalSearchItems = $(e.target).parents('.cmp-local-search').length == 0
                && $(e.target).parents('.cmp-local-search-items').length == 0; 
            if(canCloseLocalSearchItems) {
                $('.cmp-local-search-items').removeClass('on').removeClass('opened');
            }
            
            var canCloseTodayWarning = $(e.target).parents('.cmp-main-wrn.accordion-wrap').length == 0;
            if(canCloseTodayWarning) {
                $('.cmp-main-wrn .box-con-on.accordion-tit.on').trigger('click');
            }
            
            var canCloseHelpTooltip = $(e.target).parents('.cmp-help-tooltip').length == 0 && $(e.target).attr('data-role')!="toggle-help";
            if(canCloseHelpTooltip) $('.cmp-help-tooltip').removeClass('on');
        });
    }    
    function readBookmarkSelectedInfo() {
        var lat = 37.493546;
        var lon = 126.921654;
        var favoriteFound = false;
        if(bookmarkDropdown.config 
                && ((bookmarkDropdown.config.bookmarks && bookmarkDropdown.config.bookmarks.length > 0) 
                        || bookmarkDropdown.config.selectedBookmark)) {
            if(bookmarkDropdown.config.selectedBookmark) {
                var bm = bookmarkDropdown.config.selectedBookmark;
                if(bm.dong && bm.dong.lat && bm.dong.lon && bm.dong.lat != "null" && bm.dong.lon != "null") {
                    lat = bm.dong.lat;
                    lon = bm.dong.lon;
                    bookmarkSelectedDong = bm.fullName;
                    bookmarkSelectedDongCode = bm.dong.code;
                    favoriteFound = true;
                } else {
                    if(bm.dong) {
                        var latlon = convertDfsGrid("toLL", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
                        if(latlon['lat'] && latlon['lng']) {
                            lat = latlon['lat'];
                            lon = latlon['lng'];
                            bookmarkSelectedDong = bm.fullName;
                            favoriteFound = true;
                        }
                        bookmarkSelectedDongCode = bm.dong.code;
                    }
                }
                
            } else {
                var bm = bookmarkDropdown.config.bookmarks[0];
                if(bm.dong && bm.dong.lat && bm.dong.lon && bm.dong.lat != "null" && bm.dong.lon != "null") {
                    lat = bm.dong.lat;
                    lon = bm.dong.lon;
                    bookmarkSelectedDong = bm.fullName;
                    bookmarkSelectedDongCode = bm.dong.code;
                    favoriteFound = true;
                } else {
                    if(bm.dong) {
                        var latlon = convertDfsGrid("toLL", bm.dong.x?bm.dong.x:bm.x,bm.dong.y?bm.dong.y:bm.y);
                        if(latlon['lat'] && latlon['lng']) {
                            lat = latlon['lat'];
                            lon = latlon['lng'];
                            bookmarkSelectedDong = bm.fullName;
                            bookmarkSelectedDongCode = bm.dong.code;
                            favoriteFound = true;
                        }
                    }
                }
            }
        }
        bookmarkSelectedLat = lat;
        bookmarkSelectedLon = lon;
        return favoriteFound;
    }
    
   
    
    
    // 팝업
    function openExternalPop(url) {
        if(!url) return;
        
        if(url.substring(0,1) == "/") {
            url = window.location.origin + url;
        }
        
        window.open(url);
    }        
    /**
        code: "toXY"
            lat, lng to x, y
        code: "toLL" 
            x, y to lat, lng 
        return { lat, lng, x, y }
    */
   //지도 관련
    function convertDfsGrid(code,v1,v2) {
        //
        // LCC DFS 좌표변환을 위한 기초 자료
        //
        var RE = 6371.00877; // 지구 반경(km)
        var GRID = 5.0;      // 격자 간격(km)
        var SLAT1 = 30.0;    // 투영 위도1(degree)
        var SLAT2 = 60.0;    // 투영 위도2(degree)
        var OLON = 126.0;    // 기준점 경도(degree)
        var OLAT = 38.0;     // 기준점 위도(degree)
        var XO = 43;         // 기준점 X좌표(GRID)
        var YO = 136;        // 기1준점 Y좌표(GRID)
    
        var DEGRAD = Math.PI / 180.0;
        var RADDEG = 180.0 / Math.PI;
    
        var re = RE / GRID;
        var slat1 = SLAT1 * DEGRAD;
        var slat2 = SLAT2 * DEGRAD;
        var olon  = OLON  * DEGRAD;
        var olat  = OLAT  * DEGRAD;
    
        var sn = Math.tan( Math.PI*0.25 + slat2*0.5 ) / Math.tan( Math.PI*0.25 + slat1*0.5 );
        sn = Math.log( Math.cos(slat1) / Math.cos(slat2) ) / Math.log(sn);
        var sf = Math.tan( Math.PI*0.25 + slat1*0.5 );
        sf = Math.pow(sf,sn) * Math.cos(slat1) / sn;
        var ro = Math.tan( Math.PI*0.25 + olat*0.5 );
        ro = re * sf / Math.pow(ro,sn);
        var rs = {};
        if (code == "toXY") {
            rs['lat'] = v1;
            rs['lng'] = v2;
            var ra = Math.tan( Math.PI*0.25 + (v1)*DEGRAD*0.5 );
            ra = re * sf / Math.pow(ra,sn);
            var theta = v2 * DEGRAD - olon;
            if (theta >  Math.PI) theta -= 2.0 * Math.PI;
            if (theta < -Math.PI) theta += 2.0 * Math.PI;
            theta *= sn;
            rs['x'] = Math.floor( ra*Math.sin(theta) + XO + 0.5 );
            rs['y'] = Math.floor( ro - ra*Math.cos(theta) + YO + 0.5 );
        } else {
            rs['x'] = v1;
            rs['y'] = v2;
            var xn = v1 - XO;
            var yn = ro - v2 + YO;
            ra = Math.sqrt( xn*xn+yn*yn );
            if (sn < 0.0) -ra;
            var alat = Math.pow( (re*sf/ra),(1.0/sn) );
            alat = 2.0*Math.atan(alat) - Math.PI*0.5;
    
            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            } else {
                if (Math.abs(yn) <= 0.0) {
                    theta = Math.PI*0.5;
                    if( xn < 0.0 ) -theta;
                } else theta = Math.atan2(xn,yn);
            }
            var alon = theta/sn + olon;
            rs['lat'] = alat*RADDEG;
            rs['lng'] = alon*RADDEG;
        }
        return rs;
    }
})(jQuery, window, document);
