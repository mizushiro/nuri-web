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
    var save_data_point = 1; //현재 선택한 날짜 포인트 저장
    var save_day_point = 1;
    var save_day_array = new Array();  //날짜 정보 저장
    var yy;
    var mm;
    var dd;
    var hh;
    var date;
    var jisu_code = 'A01_2';
    var day_ment;
    var day_ment_jisu_code;
    var nodataCheck = false;
    var save_point = "1100000"; //현재 선택되어있는 
    var save_pkornm = "서울특별시";
    var first_check = true;
    var period= "";
    var sysdate = new Date();
    var annodate = new Date(2022,10,14,9);//2022111409에 보건지수(꽃가루제외) 삭제 2단계
    var termidate = new Date(2023,1,13,9);//2023021309에 보건지수(꽃가루제외) 삭제 3단계
    
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
        //꽃가루 제외한 나머지 화면에서 지우기
        if(termidate < sysdate){
            //꽃가루 농도지수(참나무) 기본셋팅
            jisu_code = 'D06';
            $(".tab-sm").hide();
            $(".tab-btn05").show();      
        }
       
        createCurrentWarning();
        createGlobalEvent();
        createJisuDataList();

        
    }

    function createJisuDataList(){
        showLoading('content-body', true);
        $.ajax({
            url: appPrefix + "resources/jsp/life/jisumap.jsp",
            data: { jisucode:jisu_code },
            type: 'get',
            success:function(data, status, xhr){
                save_json = data.data_json;
                yy = save_json[0].filetime.slice(0,4);
                mm = save_json[0].filetime.slice(4,6);
                dd = save_json[0].filetime.slice(6,8);
                hh = save_json[0].filetime.slice(8,10);
                date = new Date(yy+"-"+mm+"-"+dd);
                save_area_point_code = save_point;
                save_area_point_ko = save_pkornm;
                if(first_check){
                    var server_mm = data.server_time.slice(4,6);
                    var server_dd = data.server_time.slice(6,8);
                    
                    dayMent(data);
                    first_check = false;
                }else{
                    
                    
                    if(jisu_code == "D05" ){
                        period= "9월 ~ 익년 4월"; 
                        if(!( 9 <= Number(mm) || Number(mm) <= 4 )){
                            nodataCheck = true;
                        }else{
                            nodataCheck = false;
                        }
                    }else if(jisu_code == "D06"|| jisu_code == "D07"){
                        period= "4월 ~ 6월";
                        if(!(4 <= Number(mm) && Number(mm) <= 6 )){
                            nodataCheck = true;
                        }else{
                            nodataCheck = false;
                        }
                    }else if(jisu_code == "D08"){
                        period= "8월 ~ 10월";
                        if(!(8 <= Number(mm) && Number(mm) <= 10 )){
                            nodataCheck = true;
                        }else{
                            nodataCheck = false;
                        }
                    }else{
                        period= "연중";
                        nodataCheck = false;
                    }
                    
                    $("#time_info").html("<p>"+yy+"년 "+mm+"월 "+dd+"일 ("+getDays(date.getDay())+") "+hh+":00</p>"+"<p>제공기간 : "+period+"</p>");
                    $($($(".dfs-tab-head").find("li")).find("a")).removeClass("on");
                    if(hh == "06"){
                        $($(".dfs-tab-head").find("li")["3"]).hide();
                        $($(".dfs-tab-head").find("li")["0"]).find("a").addClass("on");
                        save_data_point = 0;
                        save_day_point = 0;
                    }else{
                        $($(".dfs-tab-head").find("li")["0"]).hide();
                        $($(".dfs-tab-head").find("li")["1"]).find("a").addClass("on");
                        save_data_point = 1;
                        save_day_point = 1;
                        
                    }

                    if(nodataCheck){
                        $('#map_area').html("");
                        $('#data_none').html("<div class='txt_alert'>서비스 제공기간이 아닙니다<br/>제공기간 :"+period+"</div>");
                        $(".right_index_area").hide();
                        $(".correspond").hide();
                        $('#map_area').hide();
                        $('#data_none').show();
                        $('.life_btn').hide();
                    }else{
                        $('#map_area').html("");
                        $('#map_area').show();
                        $('#data_none').html("");
                        $('#data_none').hide();
                        $('.life_btn').show();
                        createMap();
                        $(".right_index_area").show();
                        $(".correspond").show();
                    }
                    createMentList();
                    
                }
                showLoading('content-body', false);
                
            },
            error:function(xhr, status, error ){
                console.log(error);
                showLoading('content-body', false);
            }
         
        });
    }

    //맨트 호출
    function dayMent(jisu_data){
        $.ajax({ 
            url: appPrefix + "resources/jsp/life/day_ment.jsp",
            dataType : 'json',
            success: function (data) { 

                day_ment = data;
                day_ment_jisu_code = day_ment[jisu_code];
                $("#time_info").html("<p>"+yy+"년 "+mm+"월 "+dd+"일 ("+getDays(date.getDay())+") "+hh+":00</p>"+"<p>제공기간 : 연중</p>");
                $($($(".dfs-tab-head").find("li")).find("a")).removeClass("on");
                if(hh == "06"){
                    $($(".dfs-tab-head").find("li")["3"]).hide();
                    $($(".dfs-tab-head").find("li")["0"]).find("a").addClass("on");
                    save_data_point = 0;
                    save_day_point = 0;
                }else{
                    $($(".dfs-tab-head").find("li")["0"]).hide();
                    $($(".dfs-tab-head").find("li")["1"]).find("a").addClass("on");
                    save_data_point = 1;
                    save_day_point = 1;
                }
                createMentList()
                createMap();
                if(termidate < sysdate){
                    changeMenu(4);
                }else if(annodate < sysdate){
                    changeMenu(0);
                }
            //heatTimeList(jisu_data);
            },
            error:function(xhr, status, error ){
                console.log(error);
            }
        });
    }
    function createMentList(){
        var ment_thtml="";
        $.each(day_ment_jisu_code, function(index, item){
            ment_thtml += "<tr>";
            ment_thtml += "<th class='cor_circle'>";
            ment_thtml += "<p><span class='circle "+item.color+"'></span>&nbsp;<strong>"+item.depth+"</strong></p>";
            ment_thtml += "</th>";
           
            if(jisu_code == 'A01_2'){
                ment_thtml += "<td>"+item.jisu+"</td>";
            }
            ment_thtml += "<td>";
            ment_thtml += "<ul class='cor_list'>";
            ment_thtml += item.ment;
            ment_thtml += "</ul>";
            ment_thtml += "</td>";
            ment_thtml += "</tr>";
        });
        ment_thtml += "<tr>";
        ment_thtml += "<td colspan='"+(jisu_code == 'A01_2'?"3":"2")+"'>※ 의학자문: 서울대학병원 운영 서울특별시 보라매 병원 내과 김덕겸, 허응영 서울의대 교수</td>";
        ment_thtml += "</tr>";
        if(jisu_code == 'A01_2'){
            $("#A01_2_no").hide();
            $("#A01_2_yes").show();
            $("#A01_2_yes").find("tbody").html(ment_thtml);
        }else{
            $("#A01_2_yes").hide();
            $("#A01_2_no").show();
            $("#A01_2_no").find("tbody").html(ment_thtml);
        }
        $(".cmp-common-heading").html("<h3>"+day_ment_jisu_code[0].nm+"</h3><p class='time_right'>"+yy+"년 "+mm+"월 "+dd+"일 "+hh+"시 예보</p>");
        $.each($(".tt"), function(index, item){
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
    
    
    
    
    //오늘내일모레글피버튼
    $(".dfs-tab-head").find("li").on("click",function(e){
        e.preventDefault();
        save_data_point = $(this).data("index");
        save_day_point = $(this).data("index");
        $($($(".dfs-tab-head").find("li")).find("a")).removeClass("on");
        $($(this).find("a")).addClass("on");
        if(nodataCheck){
            $('#map_area').html("");
            $('#data_none').html("<div class='txt_alert'>서비스 제공기간이 아닙니다<br/>제공기간 :"+period+"</div>");
            $(".right_index_area").hide();
            $(".correspond").hide();
        }else{
            $('#data_none').html("");
            createMap();
            $(".right_index_area").show();
            $(".correspond").show();
        }
    });
    
    //순차적으로 꽃가루농도위험지수 제외하고 비활성화 
    function changeMenu(idx){
        $($(".tab-sm").find("a")).removeClass("on");
        $($(".tab-sm").eq(idx).find("a")).addClass("on");
        $.each($(".tab-sm"), function(index, item){
            $("#div_"+$(item).data("jisu-code")).hide();
        });
        jisu_code =$(".tab-sm").eq(idx).data("jisu-code");
        day_ment_jisu_code = day_ment[jisu_code];
        save_area_point_code = save_point;
        save_area_point_ko = save_pkornm;
        if(jisu_code == "D06"){
            $.each($(".life_tab").find("li").find("img"), function(index, item){
                if($(item).data("jisu-code") == "D06"){
                    $(item).attr("src",$(item).attr("src").replace("_off","_on"));
                }else{
                    $(item).attr("src",$(item).attr("src").replace("_on","_off"));
                }
            });
            $(".tree_tab").show();
        }else{
            $(".tree_tab").hide();
        }
        var state_area_ment = ["낮음","주의","경고","위험"];
        if(jisu_code == "A01_2"){
            state_area_ment = ["낮음","주의","경고","위험"];
        }else{
            state_area_ment = ["낮음","보통","높음","매우<br/>높음"];
        }
        $(".state_area").find("ul").find("li").each(function(index,item){
            if(jisu_code != "A01_2" && index == 3){
                $(".tab-sm").eq(idx).addClass("line_two");
            }else{
                $(".tab-sm").eq(idx).removeClass("line_two");
            }
            $(item).html(state_area_ment[index]);
        });
        if(jisu_code == "D02"){
            $(".life_btn02").hide();
        }else{
            if(jisu_code == "A01_2"){
                $(".life_btn02").find("button").html("식중독이란");
            }else if(jisu_code == "D05"){
                $(".life_btn02").find("button").html("날씨와 감기");
            }else if(jisu_code == "D01"){
                $(".life_btn02").find("button").html("천식과 날씨");
            }else if(jisu_code == "D06" || jisu_code == "D07" || jisu_code == "D08"){
                $(".life_btn02").find("button").html("꽃가루 알레르기란");
            }
            $(".life_btn02").show();
        }

        //20221114이후에는 꽃가루만 화면 표출 나머지 멘트와 링크주소 표출
        if(sysdate >= annodate && (jisu_code == "A01_2" || jisu_code == "D05" ||jisu_code == "D01" ||jisu_code == "D02" )){
            if(jisu_code == "A01_2"){
                $(".cmp-common-heading").html("<h3>식중독지수</h3>");
            }else if(jisu_code == "D05"){
                $(".cmp-common-heading").html("<h3>감기가능지수</h3>");
            }else if(jisu_code == "D01"){
                $(".cmp-common-heading").html("<h3>천식폐질환가능지수</h3>");
            }else if(jisu_code == "D02"){
                $(".cmp-common-heading").html("<h3>뇌졸중가능지수</h3>");
            }
            $("#service_status_ment").show();
            $(".cmp-dfs-slider").hide();
            $("#service_status_ment span").hide();
            $("#life_txt_info").hide();
        }else if((jisu_code == "A01_2" || jisu_code == "D05" ||jisu_code == "D01" ||jisu_code == "D02" )){
            $("#service_status_ment").show();
            $("#life_txt_info").hide();
            createJisuDataList();
        }else{
            $("#service_status_ment").hide();
            $("#life_txt_info").show();
            $(".cmp-dfs-slider").show();
            createJisuDataList();
        }
    }

    //세부메뉴 버튼
    $(document).on("click",".tab-sm",function(e){
        e.preventDefault();
        changeMenu($(this).index());
    });

    //지수 종류 버튼
    $(".life_tab").find("li").on("click",function(e){
        e.preventDefault();
        if($(this).find("img").attr("src").indexOf("off") != -1){
            $.each($(".life_tab").find("li").find("img"), function(index, item){
                $(item).attr("src",$(item).attr("src").replace("_on","_off"));
            });
            $(this).find("img").attr("src",$(this).find("img").attr("src").replace("_off","_on"));
            jisu_code = $(this).find("img").data("jisu-code");
            day_ment_jisu_code = day_ment[jisu_code];
            createJisuDataList();
        }
    });
   
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



    var lines = Highcharts.geojson(Highcharts.maps['korea/mapline'], 'mapline');        
    
    //클래스 변환 값, 데이터 출력 값
    //자외선 지수 지도
    function createMap(){
        
        for(var i = 0; i < save_json.length; i++){
            save_json[i]["value"] = save_json[i]["value"+save_data_point];
            if(save_area_point_code == save_json[i].code){
                map_point_click(save_area_point_ko, save_json[i]["value"+save_data_point]);
            }     
        }
        
        var data = save_json;
        var dataClasses = new Array();

        $.each(day_ment_jisu_code, function(index, item){
            dataClasses.push({from: Number(item.from) , to: Number(item.to) , color : colorChange(item.color)});

        });
        $('#map_area').highcharts('Map', {
        chart: {
          borderWidth: 1,
          events: {
          	click: function() { //ie7에서 클릭할 때 반응하기 위한 이벤트 위치
          		if(this.hoverPoint != null) {
          			var obj = this.hoverPoint;
          			save_area_point_code = obj.code; //현재 선택되어 있는 지점 코드 저장
          			save_area_point_ko = obj.properties.SGG_NM; //현재 선택되어진 지점명 저장
          			
          			map_point_click(obj.properties.SGG_NM,obj.value);
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
        /* 없애고 데이터 자체에 color 로 넣어도됨 */
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
                /* 액션필요 */
                save_area_point_code = this.code; //현재 선택되어있는 지점 코드 저장
                save_area_point_ko = this.properties.SGG_NM; //현재 선택되어진 지점명 저장
                map_point_click(this.properties.SGG_NM, this.value);
              }
            }
          }
        },{
				data: Number(lines),
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
    

    //지수에 대한 색 선택
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
    $(".life_btn").find("button").on("click",function(e){
        e.preventDefault();
        void(window.open(appPrefix+'resources/jsp/life/imgdata_popup_test.jsp'+'?CODE='+jisu_code+'&point='+save_data_point,'jisu_pop','width=820, height=760').focus());
    });
    //~란 버튼 클릭시 팝업
    $(".life_btn02").find("button").on("click",function(e){
        e.preventDefault();
        var url = "popup_life_02.jsp";
        if(jisu_code == "A01_2"){
            url = "popup_life_02.jsp";
        }else if(jisu_code == "D05"){
            url = "popup_health_08.jsp";
        }else if(jisu_code == "D01"){
            url = "popup_health_07.jsp";
        }else if(jisu_code == "D02"){

        }else if(jisu_code == "D06" || jisu_code == "D07" || jisu_code == "D08"){
            url = "popup_health_06.jsp";
        }
        void(window.open(appPrefix+'resources/jsp/life/'+url,'jisu_pop','width=905, height=580').focus());
    });
    
    //자외선지수 지도 클릭시 설명 표시
    function map_point_click(indata, indata2){
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
		
        date_text.setDate(date_text.getDate()+save_day_point);
        //등급 입력
        $("#h_tit").html(indata+"<span>"+(Number(date_text.getMonth())+1)+"월 "+date_text.getDate()+"일</span>"); //지역명
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
            memarray[idx] = $("#legmark"+idx).removeClass('on');//class 요소중 'on' 이라는 요소 삭제
        }
        memarray[mark_select].addClass("on");
        $("#sment").html(sment); //ment 변경
        $(".state_area").find("ul").find("li").each(function(index,item){
            $(item).html($(item).html().replace("<span>▼</span>",""));
        });
        var state_area_text = $($(".state_area").find("ul").find("li")[mark_select]).html();
        $($(".state_area").find("ul").find("li")[mark_select]).html(state_area_text+"<span>▼</span>");
    }
    
    function createCurrentWarning() {
        var todayWarning = new TodayWarning('today-warning');
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
