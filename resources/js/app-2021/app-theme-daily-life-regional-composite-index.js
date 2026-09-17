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
     var jisu_code="A41";
     var heat_A40_viewChk="Y";
     
     if(appConfig.config && appConfig.config.unit && appConfig.config.unit.ws) {
         wsUnit = appConfig.config.unit.ws;
     }
     /* 화면 모드 셋팅 */
     var displayMode = (appConfig && appConfig.config && appConfig.config.displayMode) ? appConfig.config.displayMode : DISPLAY_MODE_DEFAULT;
     if(displayMode != DISPLAY_MODE_MAP) {
         displayMode = DISPLAY_MODE_DEFAULT;
     }
     
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

    $(document).on("click",".dfs-tab-head li",function(e){
        e.preventDefault();
       
        $(this).parent(".dfs-tab-head").find("li").find("a").removeClass("on").removeAttr('title');
        $(this).find("a").addClass("on").attr('title','선택됨');
        $(".tit.mb20").trigger("click");
        var th_index = $(this).data("index");
        var th_point = 0;
        var parentObj = $(this).parent().parent().parent().parent();
        
        for(var i = 0 ; i < th_index-1 ; i++){
            th_point += $($(parentObj).find(".over-scroll-web").find("th")[i]).outerWidth();
        }
        $(parentObj).find(".over-scroll-web").stop().animate({scrollLeft : th_point},400);
        
    });
     function initDefaultMode() {
         createMyPointSlider();
         createSearchBox();
         createCurrentWarning();
         createBookmarks();
         createGlobalEvent();
     }
     
     function sort_view_list(month){
         
            //계절별 지수 표출 순서 변경
            var jisu_list_html="";
            var tab_list_html="";
            
            
            tab_list_html='<div class="tbl_area">'
            tab_list_html+='    <div id="life_tab1" class="life_tab" style="display: none; margin: 50px auto 0;">';
            tab_list_html+='        <ul>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A41_tab_on.jpg" data-jisu-code="A41" alt="노인"><br><span>노인</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A42_tab_off.jpg" data-jisu-code="A42" alt="어린이"><br><span>어린이</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A44_tab_off.jpg" data-jisu-code="A44" alt="농촌"><br><span>농촌</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A45_tab_off.jpg" data-jisu-code="A45" alt="비닐하우스"><br><span>비닐하우스</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A46_tab_off.jpg" data-jisu-code="A46" alt="취약거주환경"><br><span>취약거주환경</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A47_tab_off.jpg" data-jisu-code="A47" alt="도로"><br><span>도로</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A48_tab_off.jpg" data-jisu-code="A48" alt="건설현장"><br><span>건설현장</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A49_tab_off.jpg" data-jisu-code="A49" alt="조선소"><br><span>조선소</span></button></li>';
            tab_list_html+='            <li><button type="button"><img src="../../resources/images/life/_indexImg/icons/e/A40_tab_off.jpg" data-jisu-code="A40" alt="일반인"><br><span>일반인</span></button></li>';
            tab_list_html+='        </ul>';
            tab_list_html+='    </div>';            
            tab_list_html+='</div>';
            
            //지수 표출 순서 정리 (아이톤 표출 순서는 area_life_new에정리)
            if(month=="4"){
                jisu_list_html += '<div class="grade_area"></div>';//꽃가루 
                jisu_list_html += '<div class="tbl_area" id="table_tbl_area"></div>';  //자외선
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA09"></div>'; //대기정체
                jisu_list_html += tab_list_html+'<div class="tbl_area" id="chart2_area"></div>'; //체감온도
            }else if(month=="5" || month=="6"){
                jisu_list_html += tab_list_html+'<div class="tbl_area" id="chart2_area"></div>'; //체감온도
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA07_2"></div>';  //자외선
                jisu_list_html += '<div class="grade_area"></div>';//꽃가루 
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA09"></div>'; //대기정체                
            }else if(month=="7"){
                jisu_list_html += tab_list_html+'<div class="tbl_area" id="chart2_area"></div>'; //체감온도 
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA07_2"></div>';  //자외선
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA09"></div>'; //대기정체
                jisu_list_html += '<div class="grade_area"></div>';//꽃가루 
            }else if(month=="8" || month=="9"){
                jisu_list_html += tab_list_html+'<div class="tbl_area" id="chart2_area"></div>'; //체감온도
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA07_2"></div>';  //자외선
                jisu_list_html += '<div class="grade_area"></div>';//꽃가루 
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA09"></div>'; //대기정체
            }else if(month=="10"){
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA07_2"></div>';  //자외선
                jisu_list_html += '<div class="grade_area"></div>';//꽃가루 
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA09"></div>'; //대기정체
                jisu_list_html += tab_list_html+'<div class="tbl_area" id="chart2_area"></div>'; //체감온도
            }else{
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA09"></div>'; //대기정체 
                jisu_list_html += '<div class="tbl_area" id="table_tbl_areaA07_2"></div>';  //자외선
                jisu_list_html += tab_list_html+'<div class="tbl_area" id="chart2_area"></div>'; //체감온도
                jisu_list_html += '<div class="grade_area"></div>';//꽃가루                 
            }
               
            $("#jisu_list").html(jisu_list_html);
            
           
     }
 
     //var data_json = "";
     //var server_hh = "";
     //생활기상정보 - 지역별 조합지수 - 데이터 조회
     var systemMM ="0";     
     function createDataList(bookmark){
         showLoading('content-body', true);
         
         $.ajax({
             url: appPrefix + "resources/jsp/life/area_life_new.json.jsp",
             data: { area: bookmark.dong.code },
             type: 'get',
             success:function(data, status, xhr){

                 $(".grade_area").html("");
                 var data_json = data["data_json"];
                 var real_data_json = data["real_data_json"];
                 var chart2_thtml = "";
                 var table_thtml = "";
                 var table_thtmlA07_2 = "";
                 var table_thtmlA09 = "";
                 var day_thtml = "";
                 var day_t_cnt = 0;
                 var nodata_str = "";
                 var passmap = new HashMap();
                 var passval;
                 var passarr;
                 var server_hh = data.server_time.slice(8,10);//몇시인지 확인
                 systemMM = data["MM"];
                 $("#chart2_area").html("");
                 passval = data.index_arr.replace("{", "").replace("}", "").replace(/'/gi, "");
                 passarr = passval.split(", ");
                 //계절별 데이터 표출 정렬
                 sort_view_list(systemMM);  
                 
                 $(".life_tab").find("li").find("button").find("img").on("click",function(){
                     heat_icon_click(this);
                 });
                 
                 $.each(passarr, function(index2, item2){//index_arr 순서대로
                     $.each(data_json, function(index, item){
                        if(item.TYPE == "CHART2" && item.code == "A41" && item.TF == "T"){
                            heat_A40_viewChk="N";   
                        }
                                                                      
                        if(item.code == item2){
                            var date = new Date(item.filetime.slice(0,4), Number(item.filetime.slice(4,6))-1, item.filetime.slice(6,8));
                            var time_type = 0;
                            var hh = item.filetime.slice(8,10);
                            var server_file_time = Number(server_hh)-Number(hh);
                            //지수종합정보 표출
                            
                            if((item.TF == "T" && item.TYPE != "CHART2") ||  (item.TYPE == "CHART2" && (item.code == "A41" || item.code == "A40") && item.TF == "T")){
                                if(passmap.get(item.code) != "N"){
                                    var jisuinfodata = "";
                                    var jisuinfo_cnt;
                                    //console.log(item.KONAME);
                                    if(item.TYPE=="DAY"){
                                        if(Number(hh) <=3 || Number(hh) >=18){
                                            jisuinfo_cnt = 1;
                                        }else{
                                            jisuinfo_cnt = 0;
                                        }
                                    }else{//시간일 경우: 배포시간을 고려해서 현재시간의 다음타임값을 표출
                                        jisuinfo_cnt = server_file_time;
                                        //다음날 - 현재는 시간만 비교해서 배포시간보다 이전이면 다음날로 간주.(날짜까지 정확하게 비교하면 수정필요) 
                                        if(jisuinfo_cnt < 0){
                                            jisuinfo_cnt = jisuinfo_cnt+24;
                                        }
                                        if(server_file_time != 0){

                                            if(item.TYPE != "CHART2"){//체감온도가 아니면 3시간 단위
                                                jisuinfo_cnt = parseInt(jisuinfo_cnt/3);
                                            }
                                        }
                                    }
                                     
                                    jisuinfodata = data_Rating(item.code,item["value"+jisuinfo_cnt]);
                                    var KONAME = item.KONAME
                                    
                                    if(item.code == "A40"){
                                        if(heat_A40_viewChk=="Y"){
                                            chart2_thtml += "<li>";
                                            chart2_thtml += "<span class='info_img'><img src='"+ appPrefix +"resources/images/life/_indexImg/icons/e/"+jisuinfodata["1"]+"_icon.jpg' alt='"+item.KONAME.replaceAll("<p>","").replaceAll("</p>","")+"' ></span>";
                                            chart2_thtml += "<span class='info_txt'>"+item.KONAME.replaceAll("<p>"," ").replaceAll("</p>","")+"</span>";
                                            //chart2_thtml += "<span class='info_alert "+(item.code == "A09"?data_color_Rating((5-Number(jisuinfodata[1].substring(jisuinfodata[1].length-1)))):data_color_Rating(jisuinfodata[1].substring(jisuinfodata[1].length-1)))+"'>"+jisuinfodata["0"].split("(")["0"]+"</span>";
                                            chart2_thtml += "<span class='info_alert bblue'>"+jisuinfodata["0"].split("(")["0"].replace("<br>","")+"</span>";
                                            chart2_thtml += "</li>";
                                        }
                                    }else{
                                        chart2_thtml += "<li>";
                                        chart2_thtml += "<span class='info_img'><img src='"+ appPrefix +"resources/images/life/_indexImg/icons/e/"+jisuinfodata["1"]+"_icon.jpg' alt='"+item.KONAME.replaceAll("<p>","").replaceAll("</p>","")+"' ></span>";
                                        chart2_thtml += "<span class='info_txt'>"+item.KONAME.replaceAll("<p>"," ").replaceAll("</p>","")+"</span>";
                                        //chart2_thtml += "<span class='info_alert "+(item.code == "A09"?data_color_Rating((5-Number(jisuinfodata[1].substring(jisuinfodata[1].length-1)))):data_color_Rating(jisuinfodata[1].substring(jisuinfodata[1].length-1)))+"'>"+jisuinfodata["0"].split("(")["0"]+"</span>";
                                        chart2_thtml += "<span class='info_alert "+data_color_Rating(jisuinfodata[1].substring(jisuinfodata[1].length-1))+"'>"+jisuinfodata["0"].split("(")["0"].replace("<br>","")+"</span>";
                                        chart2_thtml += "</li>";
                                    }
                                }
                            }
                        }
                    });
                });
                
                day_thtml += "<div class='flower_wrap'>";
                                
                $.each(data_json, function(index, item){
                    var date = new Date(item.filetime.slice(0,4), Number(item.filetime.slice(4,6))-1, item.filetime.slice(6,8));
                    var time_type = 0;
                    var hh = item.filetime.slice(8,10);
                    var server_file_time = Number(server_hh)-Number(hh);
                    if(item.code == "A41" && item.TF == "T" && item.TYPE == "CHART2"){
                        $(".life_tab").show();
                    }
                    
                    if(item.TF == "T" && item.TYPE == "CHART2"){//체감온도
                    
                        var heat_thtml = "";
                        var data_num = 0;
                        var heat_tbody_thtml = "";
                        var heat_tbody_nthlit_thtml = "";
                        var koname = item.KONAME.replace("<p>"," ").replace("</p>","").replace("<p>"," ").replace("</p>","");
                        heat_thtml += "<h3 class='tit mb20 A4_ "+item.code+"'>"+koname+"</h3>";
                        if(item.code == "A40"){
                           heat_thtml += "<p class='smalltxt_info' style='display: none;'>※ 10~4월은 겨울철 체감온도 사용</p>";
                        }
                        heat_thtml += "<div class='cmp-dfs-slider hr1-fct A4_ "+item.code+"'>";
                        heat_thtml += "<div class='dfs-tab'>";
                        heat_thtml += "<div class='dfs-tab-head-wrap'>";
                        heat_thtml += "<ul class='dfs-tab-head' id='dfs-tab-head_"+item.code+"'>";
                        heat_thtml += "<li data-index='1'><a href='#' class='on' title='선택됨'><span>오늘</span></a><i class='tt-btn' tabindex='0'><span class='tt' >오늘 체감온도를 1시간 간격으로 제공합니다.</span></i></li>";
                        heat_thtml += "<li data-index='2'><a href='#'><span>내일</span></a><i class='tt-btn' tabindex='0'><span class='tt'>내일 체감온도를 1시간 간격으로 제공합니다.</span></i></li>";
                        heat_thtml += "<li data-index='3'><a href='#'><span>모레</span></a><i class='tt-btn' tabindex='0'><span class='tt'>모레 체감온도를 1시간 간격으로 제공합니다.</span></i></li>";
                        if(Number(server_hh) >= 18){
                            heat_thtml += "<li data-index='4' ><a href='#'><span>글피</span></a><i class='tt-btn' tabindex='0'><span class='tt' >글피 체감온도를 1시간 간격으로 제공합니다.</span></i></li>";
                        }
                        heat_thtml += "<li style='display: none;' ><a href='#'><span>none</span></a><i class='tt-btn'><span class='tt'>none</span></i></li>";
                        heat_thtml += "</ul>";
                        heat_thtml += "</div>";
                       
                        //실황자료 확인
                        var real_date = "";
                        var real_hh = "";
                        var chk_code ="";
                        var real_value = "";
                        var real_value_Rating = "['','','']"; 
                        $.each(real_data_json, function(real_index, real_item){
                            chk_code = item.code.replace("A","N");
                            if(chk_code == real_item.code){
                                real_date = real_item.filetime.slice(0,4)+"."+real_item.filetime.slice(4,6)+"."+real_item.filetime.slice(6,8);    
                                real_hh = real_item.filetime.slice(8,10);
                                real_value = real_item.value0;
                                
                                real_value_Rating = data_Rating(item.code,real_value);
                            }
                            
                        });
                                                
                        if(item.code == "A40"){                        
                            heat_thtml += "<p id='now_n3' class='side_info_txt'>"+real_date+" "+server_hh+"시 <br> <strong>실황</strong>: <span class='small_tag "+real_value_Rating[2]+"'>"+ real_value_Rating["0"].split("(")["0"].replace("<br>","") + "</span></p>";
                        }
                        heat_thtml += "</div>";

                        heat_thtml += "<div class='over-scroll-web A4_ "+item.code+"' tabindex='0' onscroll='overScrollWebScroll(this)'>";
                        heat_thtml += "<table class='table-col' id='tbl1'>";
                        heat_thtml += "<caption class='hide-caption'>"+koname+"를 표시한 표</caption>";
                        heat_thtml += "<thead>";
                        heat_thtml += "<tr class='tagtable'>";
                        //여기부터 다시 분석!(하루이상차이날 일은 거의 없다고했으니,, 그냥 시간비교만)
                        if(0 > server_file_time){//18시 데이터가 들어오고 00시가 지났을때
                            date.setDate(date.getDate()+1);
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_1' colspan='"+(24-Number(server_hh))+"'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            date.setDate(date.getDate()+1);
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_2' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            date.setDate(date.getDate()+1);
                            if(hh >= 18){
                                heat_thtml += "<th scope='col' id='th_"+item.code+"_3' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            }
                            time_type= 1;
                        }else if(12 <= server_file_time ){//18시 데이터가 안들어왔을때
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_1' colspan='"+(24-Number(server_hh))+"'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            date.setDate(date.getDate()+1);
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_2' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            date.setDate(date.getDate()+1);
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_3' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            time_type= 2;
                        }else{
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_1' colspan='"+(24-Number(hh)-server_file_time)+"'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            date.setDate(date.getDate()+1);
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_2' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            date.setDate(date.getDate()+1);
                            heat_thtml += "<th scope='col' id='th_"+item.code+"_3' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                            date.setDate(date.getDate()+1);
                            time_type= 3;
                            if(Number(hh) >= 18 && Number(hh) != 24){
                                heat_thtml += "<th scope='col' id='th_"+item.code+"_4' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                time_type= 4;
                            }
                        }
                        heat_thtml += "</tr>";
                        heat_thtml += "<tr>";

                        heat_tbody_thtml += "<tbody>";
                        heat_tbody_thtml += "<tr class='Graph'>";

                        heat_tbody_nthlit_thtml += "<tr class='nthlit1'>";
                        if(time_type == 1){

                            data_num = (24 - hh) +Number(server_hh);
                            for(var i = Number(server_hh)+1; i <= 24; i++){
                                
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){

                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";

                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            if(hh >= 18){
                                for(var i = 1; i <= 24; i++){

                                    heat_tbody_thtml += "<td class='grap'>";
                                    heat_tbody_thtml += "<ul class='level_table'>";
                                    heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                    heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                    heat_tbody_thtml += "</div>";
                                    for(var j = 0 ; j < 100; j++){
                                        heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                        heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                        heat_tbody_thtml += "</li>";
                                    }
                                    heat_tbody_thtml += "</ul>";
                                    heat_tbody_thtml += "</td>";
                                    heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                    heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                    data_num++;
                                }
                            }
                        }else if(time_type == 2){
                            data_num = server_file_time;
                            
                            for(var i = Number(server_hh)+1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                        }else if(time_type == 3){
                            data_num = server_file_time;
                            
                            for(var i = Number(server_hh)+1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                        }else if(time_type == 4){
                            data_num = server_file_time;
                            
                            for(var i = Number(server_hh)+1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                            
                            for(var i = 1; i <= 24; i++){
                                heat_tbody_thtml += "<td class='grap'>";
                                heat_tbody_thtml += "<ul class='level_table'>";
                                heat_tbody_thtml += "<div style='position:absolute;display:none;'>";
                                heat_tbody_thtml += "<div class='mouseView ring1'></div>";
                                heat_tbody_thtml += "</div>";
                                for(var j = 0 ; j < 100; j++){
                                    heat_tbody_thtml += "<li style="+(Number(item["value"+data_num])+35 == 100-j? "'height:1px; position:relative;top:-20px;' class='dott1'": "'height:1px'" )+">"
                                    heat_tbody_thtml +=  (Number(item["value"+data_num])+35 == 100-j? "<div class='ring1'><p><a href='javascript:' onmouseover='previewShow(event,this,'t_tip1','"+koname+"' : "+item["value"+data_num]+"("+heat_ment(item["value"+data_num],item.code)+")');'>"+item["value"+data_num]+"</a></p><span class='crit"+heat_color(item["value"+data_num],item.code)+"'></span></div>": "");
                                    heat_tbody_thtml += "</li>";
                                }
                                heat_tbody_thtml += "</ul>";
                                heat_tbody_thtml += "</td>";
                                heat_tbody_nthlit_thtml += "<td scope='col'><div class='a5"+heat_color(item["value"+data_num],item.code)+"'>"+heat_ment(item["value"+data_num],item.code)+"</div></td>";
                                heat_thtml += "<th>"+numberPlusZero(i)+"시</th>";
                                data_num++;
                            }
                        }
                        heat_thtml += "</tr>";
                        heat_thtml += "</thead>";
                        heat_tbody_nthlit_thtml += "</tr>";
                        heat_thtml += heat_tbody_thtml;
                        //체감온도 일반일경우 단계 표출은 하지 않음
                        if(item.code!="A40"){
                            heat_thtml += heat_tbody_nthlit_thtml;
                        }

                        
                        heat_thtml += "</table>";
                        heat_thtml += "</div>";
                        heat_thtml += "</div>";
                        $("#chart2_area").append(heat_thtml)
                        //23시이후로는 오늘날짜 테그hide -칸이 좁아서 이미지깨짐
                        if(server_hh >=23){
                            $("#tbl1 thead>tr:eq(0)>th").eq(0).find('span').hide();
                        }

                        
                    }
                     if(item.TYPE == "TABLE"){
                         if(item.TF == "T"){
                             if(item.code == "A09"){//대기정체지수
                                 var hh_cnt = (server_hh >= 18?4:3); 
                                 var data_cnt = 0;
                                 table_thtmlA09 += "<h3 class='tit mb20'>"+item.KONAME.replace("<p>"," ").replace("</p>","")+"</h3>";
                                 
                                 table_thtmlA09 += "<div class='cmp-dfs-slider hr1-fct'>";
                                 table_thtmlA09 += "<div class='dfs-tab'>";
                                 table_thtmlA09 += "<div class='dfs-tab-head-wrap'>";
                                 table_thtmlA09 += "<ul class='dfs-tab-head' id='dfs-tab-head_"+item.code+"'>";
                                 table_thtmlA09 += "<li data-index='1'><a href='#' class='on' title='선택됨'><span>오늘</span></a><i class='tt-btn' tabindex='0'><span class='tt'>오늘 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                 table_thtmlA09 += "<li data-index='2'><a href='#'><span>내일</span></a><i class='tt-btn' tabindex='0'><span class='tt'>내일 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                 table_thtmlA09 += "<li data-index='3'><a href='#'><span>모레</span></a><i class='tt-btn' tabindex='0'><span class='tt'>모레 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                 if(Number(server_hh) >= 18){
                                     table_thtmlA09 += "<li data-index='4' ><a href='#'><span>글피</span></a><i class='tt-btn' tabindex='0'><span class='tt' >글피 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                 }
                                 table_thtmlA09 += "<li style='display: none;' ><a href='#'><span>none</span></a><i class='tt-btn'><span class='tt'>none</span></i></li>";
                                 table_thtmlA09 += "</ul>";
                                 table_thtmlA09 += "</div>";
                                 table_thtmlA09 += "</div>";

                                 table_thtmlA09 += "<div class='over-scroll-web' tabindex='0' onscroll='overScrollWebScroll(this)'>";
                                 table_thtmlA09 += "<table class='table-col' id='airTbl'>";
                                 table_thtmlA09 += "<caption class='hide-caption'>오늘, 내일, 모레, 글피 날짜 기준 3시간 단위로 "+item.KONAME+" 등급을 표시한 표</caption>";
                                 table_thtmlA09 += "<thead>";
                                 table_thtmlA09 += "<tr class='tagtable'>";
                                
                                 //table_thtmlA09 += "<th scope='col' colspan='"+(8-(hh/3)-parseInt((server_hh-hh)/3))+"'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 if(server_hh-hh < 0  || hh == 21){//21시 발표시간의 데이터는 다음날(0시)자료부터 표출
                                    date.setDate(date.getDate()+1);
                                 }
                                 table_thtmlA09 += "<th scope='col' colspan='"+(8-parseInt(server_hh/3))+"'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtmlA09 += "<th scope='col' colspan='8'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtmlA09 += "<th scope='col' colspan='8'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtmlA09 += (server_hh >= 18?"<th scope='col' colspan='8'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>" : "");
                                 table_thtmlA09 += "</tr>";
                                 table_thtmlA09 += "<tr>";

                                 for(var i = 1; i <= hh_cnt;i++){
                                     if(i == 1){
                                         //for(var j = hh/3+1+parseInt((server_hh-hh)/3); j <= 8;j++){
                                        for(var j = parseInt(server_hh/3)+1; j <= 8;j++){
                                             var jNum = j*3;
                                             if(jNum < 10 ){
                                                 jNum = "0"+jNum;
                                             }
                                             table_thtmlA09 += "<th>"+jNum+"시</th>";
                                             data_cnt++;
                                         }
                                     }else{
                                         for(var j = 1; j <= 8;j++){
                                             var jNum = j*3;
                                             if(jNum < 10 ){
                                                 jNum = "0"+jNum;
                                             }
                                             table_thtmlA09 += "<th>"+jNum+"시</th>";
                                             data_cnt++;
                                         }
                                     }
                                 }
                                 table_thtmlA09 += "</tr>";
                                 table_thtmlA09 += "</thead>";
                                 table_thtmlA09 += "<tbody>";
                                 table_thtmlA09 += "<tr>";
                                 //for(var i = 0; i < data_cnt; i++){
                                 if(server_hh-hh >= 0){
                                     var num =  parseInt((server_hh-hh)/3);
                                    for(var i = num; i < data_cnt+num; i++){
                                        var table_data = data_Rating(item.code,item["value"+i]);
                                        table_thtmlA09 += "<td><span class='info_tag "+table_data["2"]+"'>"+table_data["0"].split("(")["0"]+"</span></td>";
                                    }

                                 }else{
                                     //var num = hh/3+1+parseInt((server_hh-hh)/3);
                                     var num = parseInt((server_hh-hh+24)/3);
                                     /*if(server_hh%3 == 0){
                                        //현재시간이 3의 배수이면 +1을 해줘야함
                                        num++;
                                    }*/
     
                                     for(var i = num; i < data_cnt+num; i++){
                                         var table_data = data_Rating(item.code,item["value"+i]);
                                         table_thtmlA09 += "<td><span class='info_tag "+table_data["2"]+"'>"+table_data["0"].split("(")["0"]+"</span></td>";
                                     }

                                 }
                                 table_thtmlA09 += "</tr>";
                                 table_thtmlA09 += "</tbody>";
                                 table_thtmlA09 += "</table>";
                                 table_thtmlA09 += "</div>";
                                 table_thtmlA09 += "</div>";
                                 
                             }else if(item.code == "A07_2"){//자외선지수

                                //var hh_cnt = (server_hh >= 18?4:3); 
                                var hh_cnt = 3; 
                                var data_cnt = 0;
                                table_thtmlA07_2 += "<h3 class='tit mb20'>"+item.KONAME.replace("<p>"," ").replace("</p>","")+"</h3>";
                                table_thtmlA07_2 += "<div class='cmp-common-heading'><span>※ 자외선지수 예측값은 예측시간과 다음시간 사이의 최대값을 표출</span><br>";
                                table_thtmlA07_2 += "<span>※ 자외선지수는 06~18시까지 표출이 됩니다.</span></div>"
                                table_thtmlA07_2 += "<div class='cmp-dfs-slider hr1-fct'>";
                                table_thtmlA07_2 += "<div class='dfs-tab'>";
                                table_thtmlA07_2 += "<div class='dfs-tab-head-wrap'>";
                                table_thtmlA07_2 += "<ul class='dfs-tab-head' id='dfs-tab-head_"+item.code+"'>";
                                if(Number(server_hh) < 18){
                                    table_thtmlA07_2 += "<li data-index='1'><a href='#' class='on' title='선택됨'><span>오늘</span></a><i class='tt-btn' tabindex='0'><span class='tt'>오늘 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                    table_thtmlA07_2 += "<li data-index='2'><a href='#'><span>내일</span></a><i class='tt-btn' tabindex='0'><span class='tt'>내일 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                    table_thtmlA07_2 += "<li data-index='3'><a href='#'><span>모레</span></a><i class='tt-btn' tabindex='0'><span class='tt'>모레 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                }else{
                                    table_thtmlA07_2 += "<li data-index='1'><a href='#' class='on' title='선택됨'><span>내일</span></a><i class='tt-btn' tabindex='0'><span class='tt'>내일 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                    table_thtmlA07_2 += "<li data-index='2'><a href='#'><span>모레</span></a><i class='tt-btn' tabindex='0'><span class='tt'>모레 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                    table_thtmlA07_2 += "<li data-index='3'><a href='#'><span>글피</span></a><i class='tt-btn' tabindex='0'><span class='tt'>글피 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";

                                }
                                /*
                                if(Number(server_hh) >= 18){
                                    table_thtml += "<li data-index='4' ><a href='#'><span>글피</span></a><i class='tt-btn' tabindex='0'><span class='tt' >글피 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 3시간 간격으로 제공합니다.</span></i></li>";
                                }*/
                                table_thtmlA07_2 += "<li style='display: none;' ><a href='#'><span>none</span></a><i class='tt-btn'><span class='tt'>none</span></i></li>";
                                table_thtmlA07_2 += "</ul>";
                                table_thtmlA07_2 += "</div>";
                                
                                //실황자료 확인
                                var real_date = "";
                                var real_hh = "";
                                var chk_code ="";
                                var real_value = "";
                                var real_value_Rating = "['','','']";
                                $.each(real_data_json, function(real_index, real_item){
                                    chk_code = item.code.replace("A","N");
                                    if(chk_code == real_item.code){
                                        real_date = real_item.filetime.slice(0,4)+"."+real_item.filetime.slice(4,6)+"."+real_item.filetime.slice(6,8);    
                                        real_hh = real_item.filetime.slice(8,10);
                                        real_value = real_item.value0;
                                        real_value_Rating = data_Rating(item.code,real_value);
                                    }
                                    
                                });
                                //
                                
                                //table_thtmlA07_2 += "<p id='now_n4' class='side_info_txt'>"+real_date+" "+real_hh+"시 <br> <strong>실황:</strong><span class='small_tag "+real_value_Rating[2]+"'>"+ real_value_Rating["0"].split("(")["0"].replace("<br>","")+"</span><strong>"+real_value+"</strong></p>"
                                table_thtmlA07_2 += "<p id='now_n4' class='side_info_txt'>"+real_date+" "+real_hh+"시 <br> <strong>실황:</strong><span class='small_tag "+real_value_Rating[2]+"'>"+ real_value_Rating["0"].split("(")["0"].replace("<br>","")+"</span></p>"
                                table_thtmlA07_2 += "</div>";

                                table_thtmlA07_2 += "<div class='over-scroll-web' tabindex='0' onscroll='overScrollWebScroll(this)'>";
                                table_thtmlA07_2 += "<table class='table-col uv_tbl'>";//style='width:1200px;'
                                table_thtmlA07_2 += "<caption class='hide-caption'>오늘, 내일, 모레, 글피 날짜 기준 3시간 단위로 "+item.KONAME+" 등급을 표시한 표</caption>";
                                table_thtmlA07_2 += "<colgroup><col span='30'></colgroup>";
                                table_thtmlA07_2 += "<thead>";
                                table_thtmlA07_2 += "<tr class='tagtable'>";
                                if(server_hh-hh < 0  || hh >= 18 || server_hh >=18){//21시 발표시간의 데이터는 다음날(0시)자료부터 표출
                                    date.setDate(date.getDate()+1);
                                }

                                 //자외선지수 반칸씩 이동
                                 //18시 이후는 내일, 모레, 글피로 표출
                                 table_thtmlA07_2 += "<th scope='col' colspan='8'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtmlA07_2 += "<th scope='col' colspan='8'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtmlA07_2 += "<th scope='col' colspan='8'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                // date.setDate(date.getDate()+1);
                                // table_thtmlA07_2 += (server_hh >= 18?"<th scope='col' colspan='10'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>" : "");
                                 table_thtmlA07_2 += "</tr>";
                                 table_thtmlA07_2 += "<tr>";
                                  
                                  for(var i = 1; i <= hh_cnt;i++){
                                      //if(i == 1){//오늘
                                    table_thtmlA07_2 += "<th colspan='2'>06시</br>~09시</th><th colspan='2'>09시</br>~12시</th><th colspan='2'>12시</br>~15시</th><th colspan='2'>15시</br>~18시</th>";

                                  }
                                  table_thtmlA07_2 += "</tr>";
                                  table_thtmlA07_2 += "</thead>";
                                  table_thtmlA07_2 += "<tbody>";
                                  table_thtmlA07_2 += "<tr>";
                                  data_cnt = hh_cnt * 4;

                                  if(server_hh-hh >= 0  && server_hh < 18){ 
                                      var num =  parseInt((server_hh-hh)/3)+1;
                                      var startindex = parseInt((server_hh-6)/3);

                                      if(server_hh< 6){
                                          //num = parseInt((6-hh)/3);
                                          startindex = -1;

                                        }
                                       
                                      var cnt = num;
                                      for (var i = 0; i < data_cnt; i++) {
                                          var table_data = data_Rating(item.code, item["value" + cnt]);
                                          if (i <= startindex && startindex < 4) { // 4개 시간대마다 공백을 생성하지 않음
                                              table_thtmlA07_2 += "<td colspan='2' style='width:80px;'>-</td>";
                                          } else {
                                              table_thtmlA07_2 += "<td colspan='2' style='width:80px;'><span class='info_tag " + table_data["2"] + "'>" + table_data["0"].split("(")[0] + "</span></td>";
                                              cnt++;
                                          }
                                          if(i == 3 || i == 7 || i == 11) {
                                            cnt = cnt + 4;
                                          }
                                      }
 
                                  }else{ //지난자료들은 다음달 6시 기준으로 셋팅


                                      var num;
                                      var startindex;
                                      if(server_hh < 6){
                                          num = parseInt((24-hh+6)/3);
                                          startindex = -1;
                                      }else if(server_hh >= 18 && server_hh-hh < 0){
                                          num = parseInt((24-hh+24+6)/3);
                                          startindex = -1;
                                      }else if(server_hh >= 18 && server_hh-hh >= 0){
                                          num = parseInt((24-hh+6)/3);
                                          startindex = -1;
                                      }else if(server_hh >= 6 && server_hh-hh < 18){
                                          num = parseInt((24-hh+Number(server_hh))/3) +1;
                                          startindex = -1;
                                      }
                                      var cnt = num;
                                      for (var i = 0; i < data_cnt; i++) {
                                          var table_data = data_Rating(item.code, item["value" + cnt]);
                                          if (i <= startindex && startindex < 4) { // 4개 시간대마다 공백을 생성하지 않음
                                              table_thtmlA07_2 += "<td colspan='2' style='width:80px;'>-</td>";
                                     
                                          } else {
                                              table_thtmlA07_2 += "<td colspan='2' style='width:80px;'><span class='info_tag " + table_data["2"] + "'>" + table_data["0"].split("(")[0] + "</span></td>";
                                              cnt++;
                                          }
                                          if(i == 3 || i == 7 || i == 11) {
                                            cnt = cnt + 4;
                                          }

                                      }
 
                                  }
                           
                                 table_thtmlA07_2 += "</tr>";
                                 table_thtmlA07_2 += "</tbody>";
                                 table_thtmlA07_2 += "</table>";
                                 table_thtmlA07_2 += "</div>";
                                 table_thtmlA07_2 += "</div>";

                             }else{ //동파지수
                                 var hh_cnt = (server_hh >= 18?4:3); 
                                 var data_cnt = 0;
                                 table_thtml += "<h3 class='tit mb20'>"+item.KONAME.replace("<p>"," ").replace("</p>","")+"</h3>";

                                 table_thtml += "<div class='cmp-dfs-slider hr1-fct'>";
                                 table_thtml += "<div class='dfs-tab'>";
                                 table_thtml += "<div class='dfs-tab-head-wrap'>";
                                 table_thtml += "<ul class='dfs-tab-head' id='dfs-tab-head_"+item.code+"'>";
                                 table_thtml += "<li data-index='1'><a href='#' class='on' title='선택됨'><span>오늘</span></a><i class='tt-btn' tabindex='0'><span class='tt'>오늘 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 1시간 간격으로 제공합니다.</span></i></li>";
                                 table_thtml += "<li data-index='2'><a href='#'><span>내일</span></a><i class='tt-btn' tabindex='0'><span class='tt'>내일 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 1시간 간격으로 제공합니다.</span></i></li>";
                                 table_thtml += "<li data-index='3'><a href='#'><span>모레</span></a><i class='tt-btn' tabindex='0'><span class='tt'>모레 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 1시간 간격으로 제공합니다.</span></i></li>";
                                 if(Number(server_hh) >= 18){
                                     table_thtml += "<li data-index='4' ><a href='#'><span>글피</span></a><i class='tt-btn' tabindex='0'><span class='tt' >글피 "+item.KONAME.replace("<p>"," ").replace("</p>","")+"를 1시간 간격으로 제공합니다.</span></i></li>";
                                 }
                                 table_thtml += "<li style='display: none;' ><a href='#'><span>none</span></a><i class='tt-btn'><span class='tt'>none</span></i></li>";
                                 table_thtml += "</ul>";
                                 table_thtml += "</div>";
                                 table_thtml += "</div>";

                                 table_thtml += "<div class='over-scroll-web' tabindex='0' onscroll='overScrollWebScroll(this)'>";
                                 table_thtml += "<table class='table-col'>";
                                 table_thtml += "<caption class='hide-caption'>오늘, 내일, 모레, 글피 날짜 기준 1시간 단위로 "+item.KONAME+" 등급을 표시한 표</caption>";
                                 table_thtml += "<thead>";
                                 table_thtml += "<tr>";

                                 table_thtml += "<th scope='col' colspan='"+(24-(server_hh))+"'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtml += "<th scope='col' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtml += "<th scope='col' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>";
                                 date.setDate(date.getDate()+1);
                                 table_thtml += (server_hh >= 18?"<th scope='col' colspan='24'><span class='dtag'>"+date.getDate()+"일("+date_fmt(date.getDay())+")</span></th>" : "");
                                 table_thtml += "</tr>";
                                 table_thtml += "<tr>";
                                 for(var i = 1; i <= hh_cnt;i++){
                                     if(i == 1){
                                         for(var j =Number(server_hh)+1; j <= 24;j++){
                                             var jNum = j;
                                             if(jNum < 10 ){
                                                 jNum = "0"+jNum;
                                             }
                                             table_thtml += "<th>"+jNum+"시</th>";
                                             data_cnt++;
                                         }
                                     }else{
                                         for(var j = 1; j <= 24;j++){
                                             var jNum = j;
                                             if(jNum < 10 ){
                                                 jNum = "0"+jNum;
                                             }
                                             table_thtml += "<th>"+jNum+"시</th>";
                                             data_cnt++;
                                         }
                                     }
                                 }
                                 table_thtml += "</tr>";
                                 table_thtml += "</thead>";
                                 table_thtml += "<tbody>";
                                 table_thtml += "<tr>";

                              for(var i = server_file_time; i < data_cnt; i++){
                                     var table_data = data_Rating(item.code,item["value"+i]);
                                     table_thtml += "<td><span class='info_tag "+data_color_Rating(table_data[1].substring(table_data[1].length-1))+"'>"+table_data["0"].split("(")["0"]+"</span></td>";
                                 }
                                 if(server_file_time != 0){
                                    for(var i = 0; i < server_file_time; i++){
                                        table_thtml += "<td><span>-</span></td>";
                                    }
                                 }
                              
                                 table_thtml += "</tr>";
                                 table_thtml += "</tbody>";
                                 table_thtml += "</table>";
                                 table_thtml += "</div>";
                                 table_thtml += "</div>";
                             }
                         }
                     }
                     
                     if(item.TYPE == "DAY"){
                         if(item.TF == "T"){
                            var realInfo = null;
                            // === 실황 데이터 최신값 찾기 ===
                            $.each(real_data_json, function(_, real_item){
                                if(real_item.code == item.code){
                                    if(!realInfo || real_item.filetime > realInfo.filetime){
                                        realInfo = {
                                            code: real_item.code,
                                            date: real_item.filetime.slice(0,4)+"."+real_item.filetime.slice(4,6)+"."+real_item.filetime.slice(6,8),
                                            hh: real_item.filetime.slice(8,10),
                                            rating: data_Rating(real_item.code, real_item.value0)
                                        };
                                    }
                                }
                            });
                            //if(realInfo){ // 실황 있는 경우
                            //}
                             day_t_cnt++;
                             //if(item.filetime.slice(8,10) == "18"){
                             if(Number(server_hh) >= "18"){
                                 var value1 = data_Rating(item.code,item.value1);
                                 var value2 = data_Rating(item.code,item.value2);
                                 var value3 = data_Rating(item.code,item.value3);
                                 date.setDate(date.getDate()+1);

                                 day_thtml += "<div class='flower_area'>";
                                 //day_thtml += "<div class="+(day_t_cnt%2 == 1?'left_area':'right_area')+">";
                                 day_thtml += "<h3 class='tit'>"+item.KONAME.replace("<p>"," ").replace("</p>","").replace("<p>"," ").replace("</p>","")+"</h3>";
                                 if(item.code != "D08"){
                                    day_thtml += "<br><span>※ 실황은 서울특별시, 서귀포시 기준으로 표출됨 </span>";
                                    day_thtml += "<br><span>※ 실황은 매시 자료이며, 예측은 일자료임 </span>";
                                 }
                                 // f_box (실황)
                                if(realInfo){
                                    day_thtml += "<div class='f_box'>";
                                    day_thtml += "<p class='f_box_date'>"+realInfo.date+" "+realInfo.hh+"시</p>";
                                    day_thtml += "<p class='f_grade'><strong>실황:</strong><span class='small_tag "+data_color_Rating(realInfo.rating[1].split("_")[1])+"'>"+realInfo.rating[0].split("(")[0].trim()+"</span></p>";
                                    day_thtml += "</div>";
                                }
                                 day_thtml += "<ul>";
                                 day_thtml += "<li>";
                                 day_thtml += "<span class='date_tit'>내일("+(Number(date.getMonth())+1)+"월"+date.getDate()+"일)</span>";
                                 day_thtml += "<span><img src='"+appPrefix + "resources/images/life/_indexImg/icons/g/"+value1["1"]+".png' alt='"+(value1["3"] == "" ? value1["0"]: value1["3"])+"' ></span>";
                                 day_thtml += "<span class='font_"+data_color_Rating(value1["1"].split(item.code+"_")[1])+"'>"+value1["0"]+"</span>";
                                 day_thtml += "</li>";
                                 day_thtml += "<li>";
                                 date.setDate(date.getDate()+1);
                                 day_thtml += "<span class='date_tit'>모레("+(Number(date.getMonth())+1)+"월"+date.getDate()+"일)</span>";
                                 day_thtml += "<span><img src='"+appPrefix + "resources/images/life/_indexImg/icons/g/"+value2["1"]+".png' alt='"+(value2["3"] == "" ? value2["0"]: value2["3"])+"' ></span>";
                                 day_thtml += "<span class='font_"+data_color_Rating(value2["1"].split(item.code+"_")[1])+"'>"+value2["0"]+"</span>";
                                 day_thtml += "</li>"
                                 day_thtml += "<li>";
                                 date.setDate(date.getDate()+1);
                                 day_thtml += "<span class='date_tit'>글피("+(Number(date.getMonth())+1)+"월"+date.getDate()+"일)</span>";
                                 day_thtml += "<span><img src='"+appPrefix + "resources/images/life/_indexImg/icons/g/"+value3["1"]+".png' alt='"+(value3["3"] == "" ? value3["0"]: value3["3"])+"' ></span>";
                                 day_thtml += "<span class='font_"+data_color_Rating(value3["1"].split(item.code+"_")[1])+"'>"+value3["0"]+"</span>";
                                 day_thtml += "</li>";
                                 day_thtml += "</ul>";
                                 day_thtml += "</div>";
                                 //if(realInfo){
                                    //day_thtml += "</div>";
                                 //}
                             //}else if(item.filetime.slice(8,10) == "06"){
                             }else{     
                                 var value0 = data_Rating(item.code,item.value0);
                                 var value1 = data_Rating(item.code,item.value1);
                                 var value2 = data_Rating(item.code,item.value2);
                                 
                                 day_thtml += "<div class='flower_area'>";                                
                                 //day_thtml += "<div class="+(day_t_cnt%2 == 1?'left_area':'right_area')+">";
                                 day_thtml += "<h3 class='tit'>"+item.KONAME.replace("<p>"," ").replace("</p>","").replace("<p>"," ").replace("</p>","")+"</h3>";
                                 if(item.code != "D08"){
                                    day_thtml += "<br><span>※ 실황은 서울특별시, 서귀포시 기준으로 표출됨 </span>";
                                    day_thtml += "<br><span>※ 실황은 매시 자료이며, 예측은 일자료임 </span>";
                                 }
                                 // f_box (실황)
                                if(realInfo){
                                    day_thtml += "<div class='f_box'>";
                                    day_thtml += "<p class='f_box_date'>"+realInfo.date+" "+realInfo.hh+"시</p>";
                                    day_thtml += "<p class='f_grade'><strong>실황:</strong><span class='small_tag "+data_color_Rating(realInfo.rating[1].split("_")[1])+"'>"+realInfo.rating[0].split("(")[0].trim()+"</span></p>";
                                    day_thtml += "</div>";
                                }
                                 day_thtml += "<ul>";
                                 day_thtml += "<li>";
                                 day_thtml += "<span class='date_tit'>오늘("+(Number(date.getMonth())+1)+"월"+date.getDate()+"일)</span>";
                                 day_thtml += "<span><img src='"+appPrefix + "resources/images/life/_indexImg/icons/g/"+value0["1"]+".png' alt='"+(value0["3"] == "" ? value0["0"]: value0["3"])+"' ></span>";
                                 day_thtml += "<span class='font_"+data_color_Rating(value0["1"].split(item.code+"_")[1])+"'>"+value0["0"]+"</span>";
                                 day_thtml += "</li>";
                                 day_thtml += "<li>";
                                 date.setDate(date.getDate()+1);
                                 day_thtml += "<span class='date_tit'>내일("+(Number(date.getMonth())+1)+"월"+date.getDate()+"일)</span>";
                                 day_thtml += "<span><img src='"+appPrefix + "resources/images/life/_indexImg/icons/g/"+value1["1"]+".png' alt='"+(value1["3"] == "" ? value1["0"]: value1["3"])+"' ></span>";
                                 day_thtml += "<span class='font_"+data_color_Rating(value1["1"].split(item.code+"_")[1])+"'>"+value1["0"]+"</span>";
                                 day_thtml += "</li>";
                                 day_thtml += "<li>";
                                 date.setDate(date.getDate()+1);
                                 day_thtml += "<span class='date_tit'>모레("+(Number(date.getMonth())+1)+"월"+date.getDate()+"일)</span>";
                                 day_thtml += "<span><img src='"+appPrefix + "resources/images/life/_indexImg/icons/g/"+value2["1"]+".png' alt='"+(value2["3"] == "" ? value2["0"]: value2["3"])+"' ></span>";
                                 day_thtml += "<span class='font_"+data_color_Rating(value2["1"].split(item.code+"_")[1])+"'>"+value2["0"]+"</span>";
                                 day_thtml += "</li>"
                                 day_thtml += "</ul>";
                                 day_thtml += "</div>";
                                 //day_thtml += "</div>";


                             }
                         }
                     }
                     if(item.TYPE == "CHART" && item.TF == "T"){
                     }else if(item.TF == "F"){
                        /*2020.05.14, 20200626-필터링 지수 추가*/
                         if(item.code != 'A03'&& item.code != 'A05' && item.code != 'A06' /*&& item.code != 'A40'*/){
                             nodata_str += item.NOKONAME.replace("<p>", "").replace("</p>", "").replace("<p>", "").replace("</p>", "")+", ";
                         }
                    }
                    
 
                 });
                day_thtml += "</div>";

                var strTemp = "";
                strTemp ='<p>* 생활기상정보에서 제공하는 여름철 체감온도는 대상&middot;환경별로 특화된 정보이며,날씨누리 첫 화면의 날씨정보와 함께 제공되는 일반적인 체감온도(폭염특보 기준)와 다를 수 있습니다.</p>';
                //$(".alert_info_area").html(restr('&lt;div class="alert_info_txt"> &lt;span style="font-weight:bold">'+nodata_str.substring(0,nodata_str.length-2)+'&lt;/span>는&nbsp;서비스 기간에 따라 제공됩니다.' + strTemp + '<p>* 2023년 2월 20일부터 기존의 대기확산지수는 대기정체지수로 변경되어 서비스합니다.<br>* 2020년 5월 15일부터 기존의 더위체감지수가 체감온도로 변경되어 서비스되며, 체감온도와 유사한 열지수, 불쾌지수는 사용자 혼란을 방지하기 위해 2020년 6월 1일부터 서비스가 종료되었습니다.&lt;/p><p>※ 국민건강보험공단과의 협업 및 서비스일원화에 따라, <strong>2022년 11월 14일</strong> 부터는 식중독지수, 감기가능지수, 천식폐질환가능지수 서비스는 국민건강보험공단의 ‘<strong>국민건강 알람서비스</strong>( <a href="http://forecast.nhis.or.kr/menu.do">http://forecast.nhis.or.kr/menu.do</a>)’, 뇌졸중가능지수는 건강IN>건강예측>뇌졸중예측(<a href="http://www.nhis.or.kr/nhis/healthin/retrieveCerebralPrediction.do" style="word-break:break-all;">http://www.nhis.or.kr/nhis/healthin/retrieveCerebralPrediction.do</a>)에서 개인맞춤형 서비스로 확인 가능합니다.&lt;/p>&lt;/div>'));
                $(".alert_info_area").html(restr('&lt;div class="alert_info_txt"><p> &lt;span style="font-weight:bold">지수별 서비스 기간 안내 &lt;/span><br> * 자외선지수(연중), 대기정체지수(연중), 꽃가루농도위험지수(소나무 참나무, 3월~6월 / 잡초류, 8월~10월)는 서비스 기간에 따라 제공됩니다.</p>'+ strTemp+ '<p>* 2020년 5월 15일부터 기존의 더위체감지수가 체감온도로 변경되어 서비스되며, 체감온도와 유사한 열지수, 불쾌지수는 사용자 혼란을 방지하기 위해 &nbsp;&nbsp;&nbsp;2020년 6월 1일부터 서비스가 종료되었습니다.&lt;/p><p>* 2023년 2월 20일부터 기존의 대기확산지수는 대기정체지수로 변경되어 서비스합니다.&lt;/p>&lt;/div>'));
                $("#chart2_li_list").html(chart2_thtml);
                //보건지수 꽃가루지수 외 삭제(css수정)
                var sysdate = new Date();
                var annodate = new Date(2022,10,14,9);
                if(sysdate > annodate){
                    $("#chart2_li_list").css("justify-content", "center");
                }
                //$("#chart2_li_list").attr("tabindex","0");
                $("#table_tbl_areaA07_2").html(table_thtmlA07_2);
                $("#table_tbl_areaA09").html(table_thtmlA09);
                //$("#table_tbl_area").html(table_thtml);
                //대기정체 21시이후로는 오늘날짜 테그hide -칸이 좁아서 이미지깨짐
                if(server_hh >=21 ){
                    $("#airTbl thead>tr:eq(0)>th").eq(0).find('span').hide();
                }
                $(".grade_area").html(day_thtml);
                if(heat_A40_viewChk=="Y") {
                    heat_icon_click($(".life_tab").find("li").find("button").find("img")[8]);
                }else {
                    heat_icon_click($(".life_tab").find("li").find("button").find("img")[0]);
                }
                showLoading('content-body', false);
                $.each( $(".over-scroll-web") , function(index,item){

                    if($(".dfs-tab-head").length-1 != index){
                        $(item).prepend("<div class='skip_nav'><a href='#"+$($(".dfs-tab-head")[index+1]).attr("id")+"'>건너뛰기</a></div>");
                    }else{
                        $(".grade_area").attr("id","grade_area");
                        $(".grade_area").attr("tabindex","0");
                        $(".alert_info_area").attr("tabindex","0");
                        $(item).prepend("<div class='skip_nav'><a href='#grade_area'>건너뛰기</a></div>");
                    }
                });
             },
             error:function(xhr, status, error ){
                 console.log(error);
                 showLoading('content-body', false);
             }
             
         })
         function restr(indata){
            indata = indata.replace(/\&lt;/g, "<");
            return indata;
        }
     }
     $(".life_btn").find("button").on("click",function(e){
        e.preventDefault();
        void(window.open(appPrefix+'resources/jsp/life/jisu_data_table.html','jisu_pop','width=600, height=730').focus());
    });

    function date_fmt(indata){
        var arr=['일','월','화','수','목','금','토'];
        return arr[indata];

    }
     function heat_color(value,code){
        var color = "";
        if(code == 'A41' || code == 'A42' || code == 'A46'){
            // 체감온도(노인,어린이,취약거주)
            if(37 <= value ){
                color = "_5";
            }else if(34 <= value && value < 37){
                color = "_4";
            }else if(31 <= value && value < 34){
                color = "_3";
            }else if(29 <= value && value < 31){
                color = "_2";
            }else{
                color = "_1";
            } 
        }else if(code == 'A44' || code == 'A45'){
            // 체감온도(농촌, 비닐하우스)
            if(38 <= value ){
                color = "_5";
            }else if(35 <= value && value < 38){
                color = "_4";
            }else if(33 <= value && value < 35){
                color = "_3";
            }else if(29 <= value && value < 33){
                color = "_2";
            }else{
                color = "_1";
            } 
        }else if(code == 'A40'){    
            color = "_0";
        }else{
            // 체감온도(도로,건설,조선소)
            if(38 <= value ){
                color = "_5";
            }else if(35 <= value && value < 38){
                color = "_4";
            }else if(33 <= value && value < 35){
                color = "_3";
            }else if(31 <= value && value < 33){
                color = "_2";
            }else{
                color = "_1";
            }
        }
        return color;
     }
     function heat_ment(value,code){
         var tooltipment = "";
        if(code == 'A41' || code == 'A42' || code == 'A46'){
            // 체감온도(노인,어린이,취약거주)
            if(37 <= value ){
                tooltipment = "위험";
            }else if(34 <= value && value < 37){
                tooltipment = "경고";
            }else if(31 <= value && value < 34){
                tooltipment = "주의";
            }else if(29 <= value && value < 31){
                tooltipment = "관심";
            }else{
                tooltipment = "-";
            } 
        }else if(code == 'A44' || code == 'A45'){
            // 체감온도(농촌, 비닐하우스)
            if(38 <= value ){
                tooltipment = "위험";
            }else if(35 <= value && value < 38){
                tooltipment = "경고";
            }else if(33 <= value && value < 35){
                tooltipment = "주의";
            }else if(29 <= value && value < 33){
                tooltipment = "관심";
            }else{
                tooltipment = "-";
            }
        }else if(code == 'A40'){            
            tooltipment = "-";
        }else{
            // 체감온도(도로,건설,조선소)
            if(38 <= value ){
                tooltipment = "위험";
            }else if(35 <= value && value < 38){
                tooltipment = "경고";
            }else if(33 <= value && value < 35){
                tooltipment = "주의";
            }else if(31 <= value && value < 33){
                tooltipment = "관심";
            }else{
                tooltipment = "-";
            }
        }
        return tooltipment;
    }
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
     
     /*
     $(".life_tab").find("li").find("button").find("img").on("click",function(){
               heat_icon_click(this);
     });
     */
     function heat_icon_click(obj){
      
        $(".over-scroll-web.A4_").stop().animate({scrollLeft : 0},0);
        
        $(".life_tab").find("li").find("button").find("img").each(function(index,item){
            $(item).attr("src",$(item).attr("src").replace("_on","_off"));
        });
        $(obj).attr("src",$(obj).attr("src").replace("_off","_on"));
       
        $(".A4_").hide();
        jisu_code = $(obj).data("jisu-code");
        $("#dfs-tab-head_"+jisu_code).find("li").find("a").removeClass("on").removeAttr('title');
        $($("#dfs-tab-head_"+jisu_code).find("li")[0]).find("a").addClass("on").attr('title','선택됨');
        $("."+$(obj).data("jisu-code")).show();
        
        
        if($(obj).data("jisu-code")=="A40"){
            if(Number(systemMM)>=10 || Number(systemMM)<=4){
                $(".smalltxt_info").show();
            }else{
                $(".smalltxt_info").hide();
            }
        }else{
            $(".smalltxt_info").hide();
        }

        //체감온도 변화에 따른 지수종합정보 체감온도 부분 변경
        /*이미지 없어서 보류
        $("#chart2_li_list li").eq(4).find("span").remove();
        $.each(data_json, function(index, item){
            if(item.code == jisu_code){
                
                var hh = item.filetime.slice(8,10);
                var server_file_time = Number(server_hh)-Number(hh);
                var jisuinfo_cnt = (server_file_time > 0? server_file_time : server_file_time+24);
                var jisuinfodata = data_Rating(jisu_code,item["value"+jisuinfo_cnt]);
            
                var html = "<span class='info_img'><img src='"+ appPrefix +"resources/images/life/_indexImg/icons/e/"+jisuinfodata["1"]+"_icon.jpg' alt='"+item.KONAME.replace("<p>","").replace("</p>","")+"' ></span>";
                html += "<span class='info_txt'>"+item.KONAME.replace("<p>"," ").replace("</p>","")+"</span>";
                html += "<span class='info_alert "+data_color_Rating(jisuinfodata[1].substring(jisuinfodata[1].length-1))+"'>"+jisuinfodata["0"].split("(")["0"].replace("<br>","")+"</span>";
                $("#chart2_li_list li").eq(4).html(html);
            }
        });
        */

     }
     function data_Rating(indata, indata2){
         var redata = new Array();
         redata[0] = "-";
         redata[1] = "";
         redata[2] = "";
         redata[3] = "";
         
         if(indata == "A03"){
             if(-3.2 <= indata2){
                 redata[0] = "관심 ("+indata2+")";
                 redata[1] = "A03_1";
                 redata[2] = "col_a";
             }else if(-10.5 <= indata2 && indata2 < -3.2){
                 redata[0] = "주의 ("+indata2+")";
                 redata[1] = "A03_2";
                 redata[2] = "col_b";
             }else if(-15.4 <= indata2 && indata2 < -10.5){
                 redata[0] = "경고 ("+indata2+")";
                 redata[1] = "A03_3";
                 redata[2] = "col_c";
             }else if(indata2 < -15.4){
                 redata[0] = "위험 ("+indata2+")";
                 redata[1] = "A03_4";
                 redata[2] = "col_d";
                 if(indata2 < -15){
                     redata[3] = "장시간 야외 외출 시 모자, 벙어리장갑, 목도리, 마스크 등을 꼭 착용하세요.";
                 }
             }
         }else if(indata == "A05"){
             if(indata2 < 32){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "A05_1";
             }else if(32 <= indata2 && indata2 < 41){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "A05_2";
             }else if(41 <= indata2 && indata2 < 54){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "A05_3";
             }else if(54 <= indata2 && indata2 < 66){
                 redata[0] = "매우 높음 ("+indata2+")";
                 redata[1] = "A05_4";
                 redata[3] = "날이 매우 무더우므로 야외 활동 및 작업을 중지하거나 강도를 조절하세요.";
             }else if(66 <= indata2){
                 redata[0] = "위험 ("+indata2+")";
                 redata[1] = "A05_5";    
                 redata[3] = "날이 매우 무더우므로 야외 활동 및 작업을 중지하거나 강도를 조절하세요.";
             }    
         }else if(indata == "A06"){
             if(indata2 < 68){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "A06_1";
             }else if(68 <= indata2 && indata2 < 75){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "A06_2";
             }else if(75 <= indata2 && indata2 < 80){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "A06_3";
             }else if(80 <= indata2){
                 redata[0] = "매우&lt;br/>높음 ("+indata2+")";
                 redata[1] = "A06_4";
                 redata[3] = "불쾌감이 높으므로 실내 온도와 습도를 적절하게 조절하세요.";
             }
         }else if(indata == "A09"){
 
             if(0 <= indata2 && indata2 <= 25){
                 redata[0] = "낮음<br>("+indata2+")";
                 redata[1] = "A09_1";
                 redata[2] = "l_gray";
             }else if(25 < indata2 && indata2 <= 50){
                 redata[0] = "보통<br>("+indata2+")";
                 redata[1] = "A09_2";
                 redata[2] = "yellow";
             }else if(50 < indata2 && indata2 <= 75){
                 redata[0] = "높음<br>("+indata2+")";
                 redata[1] = "A09_3";
                 redata[2] = "orange";
             }else if(75 < indata2){
                 redata[0] = "매우<br>높음<br>("+indata2+")";
                 redata[1] = "A09_4";
                 redata[2] = "red";
             }else if(100 == indata2){
                 redata[3] = "기상조건에 의한 대기정체 가능성이 매우 높음";
             }
         }else if(indata == "A08"){
             if(0 <= indata2 && indata2 <= 25){
                 //redata[0] = "낮음 ("+indata2+")";
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "A08_1";
                 redata[2] = "col_a";
             }else if(25 < indata2 && indata2 <= 50){
               //  redata[0] = "보통 ("+indata2+")";
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "A08_2";
                 redata[2] = "col_b";
             }else if(50 < indata2 && indata2 <= 75){
               //  redata[0] = "높음 ("+indata2+")";
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "A08_3";
                 redata[2] = "col_c";
             }else if(75 < indata2){
                // redata[0] = "매우&lt;br/>높음 ("+indata2+")";
                 redata[0] = "매우<br>높음<br>  ("+indata2+")";
                 redata[1] = "A08_4";
                 redata[2] = "col_d";
             }else if(100 == indata2){
                 redata[3] = "동파를 방지하기 위해 외출 시 수도꼭지를 조금 틀어놓아 수도 관에 물이 흐르도록 하세요.";
             }
         }else if(indata == "A01_2"){
             if(indata2 < 55){
                 redata[0] = "관심 ("+indata2+")";
                 redata[1] = "A01_2_1";
             }else if(55 <= indata2 && indata2 < 71){
                 redata[0] = "주의 ("+indata2+")";
                 redata[1] = "A01_2_2";
             }else if(71 <= indata2 && indata2 < 86){
                 redata[0] = "경고 ("+indata2+")";
                 redata[1] = "A01_2_3";
             }else if(86 <= indata2){
                 redata[0] = "위험 ("+indata2+")";
                 redata[1] = "A01_2_4";
                 redata[3] = "식중독 발생 가능성이 매우 높으므로 식중독 예방에 각별히 주의하세요.";
             }
         }else if(indata == "A07"){
            
             if(indata2 < 3){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "A07_1";
             }else if(3 <= indata2 && indata2 < 6){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "A07_2";
             }else if(6 <= indata2 && indata2 < 8){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "A07_3";
             }else if(8 <= indata2 && indata2 < 11){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "A07_4";
                 redata[3] = "자외선에 의한 피부화상을 입을 수 있으므로 실내에 머물거나 외출 시 노출피부를 차단하고 자외선 차단제를 바르세요.";
             }else if(11 <= indata2){
                 redata[0] = "위험 ("+indata2+")";
                 redata[1] = "A07_5";
                 redata[3] = "자외선에 의한 피부화상을 입을 수 있으므로 실내에 머물거나 외출 시 노출피부를 차단하고 자외선 차단제를 바르세요.";
             } 
         }else if(indata == "A07_1"){
             if(indata2 < 3){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "A07_1_1";
             }else if(3 <= indata2 && indata2 < 6){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "A07_1_2";
             }else if(6 <= indata2 && indata2 < 8){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "A07_1_3";
             }else if(8 <= indata2 && indata2 < 11){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "A07_1_4";
                 redata[3] = "자외선에 의한 피부화상을 입을 수 있으므로 실내에 머물거나 외출 시 노출피부를 차단하고 자외선 차단제를 바르세요.";
             }else if(11 <= indata2){
                 redata[0] = "위험 ("+indata2+")";
                 redata[1] = "A07_1_5";
                 redata[3] = "자외선에 의한 피부화상을 입을 수 있으므로 실내에 머물거나 외출 시 노출피부를 차단하고 자외선 차단제를 바르세요.";
             }
         }else if(indata == "A07_2"){
            if(indata2 < 3){
                redata[0] = "낮음 ("+indata2+")";
                redata[1] = "A07_2_1";
                redata[2] = "l_gray";
            }else if(3 <= indata2 && indata2 < 6){
                redata[0] = "보통 ("+indata2+")";
                redata[1] = "A07_2_2";
                redata[2] = "yellow";
            }else if(6 <= indata2 && indata2 < 8){
                redata[0] = "높음 ("+indata2+")";
                redata[1] = "A07_2_3";
                redata[2] = "orange";
            }else if(8 <= indata2 && indata2 < 11){
                redata[0] = "매우<br>높음<br> ("+indata2+")";
                redata[1] = "A07_2_4";
                redata[2] = "red";
                redata[3] = "자외선에 의한 피부화상을 입을 수 있으므로 실내에 머물거나 외출 시 노출피부를 차단하고 자외선 차단제를 바르세요.";
            }else if(11 <= indata2){
                redata[0] = "위험 ("+indata2+")";
                redata[1] = "A07_2_5";
                redata[2] = "purple";
                redata[3] = "자외선에 의한 피부화상을 입을 수 있으므로 실내에 머물거나 외출 시 노출피부를 차단하고 자외선 차단제를 바르세요.";
            }
         }else if(indata == "A40"){
             redata[0] = indata2+"℃";
             redata[1] = "A40_1";
             redata[2] = "bblue";
          //수정 더위 체감지수 추가  20180422
          /*2020.05.14 east */
         }else if(indata == "A41"){
             if(indata2 < 29){
                 redata[0] = "- ("+indata2+")";
                 redata[1] = "A41_1";
                 redata[2] = "l_gray";
             }else if(29 <= indata2 && indata2 < 31){
                 redata[0] = "관심 ("+indata2+")";
                 redata[1] = "A41_2";
                 redata[2] = "yellow";
             }else if(31 <= indata2 && indata2 < 34){
                 redata[0] = "주의 ("+indata2+")";
                 redata[1] = "A41_3";
                 redata[2] = "orange";
             }else if(34 <= indata2 && indata2 < 37){
                 redata[0] = "경고 ("+indata2+")";
                 redata[1] = "A41_4";
                 redata[2] = "red";
             }else if(37 <= indata2){
                 redata[0] = "위험 ("+indata2+")";
                 redata[1] = "A41_5"; 
                 redata[2] = "purple";                 
             } 
          }else if(indata == "A42"){
             if(indata2 < 29){
                 redata[0] = "- ("+indata2+")";
                 redata[1] = "A22_1";
                 redata[2] = "l_gray";
             }else if(29 <= indata2 && indata2 < 31){
                 redata[0] = "관심 ("+indata2+")";
                 redata[1] = "A22_2";
                 redata[2] = "yellow";
             }else if(31 <= indata2 && indata2 < 34){
                 redata[0] = "주의 ("+indata2+")";
                 redata[1] = "A22_3";
                 redata[2] = "orange";
             }else if(34 <= indata2 && indata2 < 37){
                 redata[0] = "경고 ("+indata2+")";
                 redata[1] = "A22_4";
                 redata[2] = "red";
             }else if(37 <= indata2){
                 redata[0] = "위험 ("+indata2+")";
                 redata[1] = "A22_5"; 
                 redata[2] = "purple";                          
             }
          }else if(indata == "A46"){
              if(indata2 < 29){
                  redata[0] = "- ("+indata2+")";
                  redata[1] = "A26_1";
                  redata[2] = "l_gray";
              }else if(29 <= indata2 && indata2 < 31){
                  redata[0] = "관심 ("+indata2+")";
                  redata[1] = "A26_2";
                  redata[2] = "yellow";
              }else if(31 <= indata2 && indata2 < 34){
                  redata[0] = "주의 ("+indata2+")";
                  redata[1] = "A26_3";
                  redata[2] = "orange";
              }else if(34 <= indata2 && indata2 < 37){
                  redata[0] = "경고 ("+indata2+")";
                  redata[1] = "A26_4";
                  redata[2] = "red";
              }else if(37 <= indata2){
                  redata[0] = "위험 ("+indata2+")";
                  redata[1] = "A26_5";   
                  redata[2] = "purple";                      
              } 
          
         }else if(indata == "A44"){
             if(indata2 < 29){
                redata[0] = "- ("+indata2+")";
                redata[1] = "A24_1";
                redata[2] = "l_gray";
            }else if(29 <= indata2 && indata2 < 33){
                redata[0] = "관심 ("+indata2+")";
                redata[1] = "A24_2";
                redata[2] = "yellow";
            }else if(33 <= indata2 && indata2 < 35){
                redata[0] = "주의 ("+indata2+")";
                redata[1] = "A24_3";
                redata[2] = "orange";
            }else if(35 <= indata2 && indata2 < 38){
                redata[0] = "경고 ("+indata2+")";
                redata[1] = "A24_4";
                redata[2] = "red";
            }else if(38 <= indata2){
                redata[0] = "위험 ("+indata2+")";
                redata[1] = "A24_5";   
                redata[2] = "purple";                    
            } 
         }else if(indata == "A45"){
             if(indata2 < 29){
                redata[0] = "- ("+indata2+")";
                redata[1] = "A25_1";
                redata[2] = "l_gray";
            }else if(29 <= indata2 && indata2 < 33){
                redata[0] = "관심 ("+indata2+")";
                redata[1] = "A25_2";
                redata[2] = "yellow";
            }else if(33 <= indata2 && indata2 < 35){
                redata[0] = "주의 ("+indata2+")";
                redata[1] = "A25_3";
                redata[2] = "orange";
            }else if(35 <= indata2 && indata2 < 38){
                redata[0] = "경고 ("+indata2+")";
                redata[1] = "A25_4";
                redata[2] = "red";
            }else if(38 <= indata2){
                redata[0] = "위험 ("+indata2+")";
                redata[1] = "A25_5";   
                redata[2] = "purple";                  
            } 
         }else if(indata == "A47"){
             if(indata2 < 31){
                redata[0] = "- ("+indata2+")";
                redata[1] = "A27_1";
                redata[2] = "l_gray";
            }else if(31 <= indata2 && indata2 < 33){
                redata[0] = "관심 ("+indata2+")";
                redata[1] = "A27_2";
                redata[2] = "yellow";
            }else if(33 <= indata2 && indata2 < 35){
                redata[0] = "주의 ("+indata2+")";
                redata[1] = "A27_3";
                redata[2] = "orange";
            }else if(35 <= indata2 && indata2 < 38){
                redata[0] = "경고 ("+indata2+")";
                redata[1] = "A27_4";
                redata[2] = "red";
            }else if(38 <= indata2){
                redata[0] = "위험 ("+indata2+")";
                redata[1] = "A27_5";  
                redata[2] = "purple";                  
            } 
         }else if(indata == "A48"){
             if(indata2 < 31){
                redata[0] = "- ("+indata2+")";
                redata[1] = "A28_1";
                redata[2] = "l_gray";
            }else if(31 <= indata2 && indata2 < 33){
                redata[0] = "관심 ("+indata2+")";
                redata[1] = "A28_2";
                redata[2] = "yellow";
            }else if(33 <= indata2 && indata2 < 35){
                redata[0] = "주의 ("+indata2+")";
                redata[1] = "A28_3";
                redata[2] = "orange";
            }else if(35 <= indata2 && indata2 < 38){
                redata[0] = "경고 ("+indata2+")";
                redata[1] = "A28_4";
                redata[2] = "red";
            }else if(38 <= indata2){
                redata[0] = "위험 ("+indata2+")";
                redata[1] = "A28_5";  
                redata[2] = "purple";                   
            } 
         }else if(indata == "A49"){
             if(indata2 < 31){
                redata[0] = "- ("+indata2+")";
                redata[1] = "A29_1";
                redata[2] = "l_gray";
            }else if(31 <= indata2 && indata2 < 33){
                redata[0] = "관심 ("+indata2+")";
                redata[1] = "A29_2";
                redata[2] = "yellow";
            }else if(33 <= indata2 && indata2 < 35){
                redata[0] = "주의 ("+indata2+")";
                redata[1] = "A29_3";
                redata[2] = "orange";
            }else if(35 <= indata2 && indata2 < 38){
                redata[0] = "경고 ("+indata2+")";
                redata[1] = "A29_4";
                redata[2] = "red";
            }else if(38 <= indata2){
                redata[0] = "위험 ("+indata2+")";
                redata[1] = "A29_5"; 
                redata[2] = "purple";                  
            } 
         }else if(indata == "A50"){
             if(indata2 < 31){
                redata[0] = "- ("+indata2+")";
                redata[1] = "A30_1";
                redata[2] = "l_gray";
            }else if(31 <= indata2 && indata2 < 33){
                redata[0] = "관심 ("+indata2+")";
                redata[1] = "A30_2";
                redata[2] = "yellow";
            }else if(33 <= indata2 && indata2 < 35){
                redata[0] = "주의 ("+indata2+")";
                redata[1] = "A30_3";
                redata[2] = "orange";
            }else if(35 <= indata2 && indata2 < 38){
                redata[0] = "경고 ("+indata2+")";
                redata[1] = "A30_4";
                redata[2] = "red";
            }else if(38 <= indata2){
                redata[0] = "위험 ("+indata2+")";
                redata[1] = "A30_5"; 
                redata[2] = "purple";                  
            } 
         //수정 생활/보건기상지수 통합 20190219
         }else if(indata == "D05"){
             if(indata2 == 0){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "D05_1";
             }else if(indata2 == 1){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "D05_2";
             }else if(indata2 == 2){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "D05_3";
             }else if(indata2 == 3){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "D05_4";
                 redata[3] = "감기 발생 가능성이 높으므로 충분한 수면을 취하고 과로하지 않는 것이 좋습니다. 또한 체온을 일정하게 유지하시고 실내습도도 적절하게 유지하세요.";
             } 
         }else if(indata == "D01"){
             if(indata2 == 0){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "D01_1";
             }else if(indata2 == 1){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "D01_2";
             }else if(indata2 == 2){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "D01_3";
             }else if(indata2 == 3){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "D01_4";
                 redata[3] = "천식, 폐질환 환자들은 각별한 주의가 필요하며, 청결한 환경을 유지하세요. ";
             }
         }else if(indata == "D02"){
             if(indata2 == 0){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "D02_1";
             }else if(indata2 == 1){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "D02_2";
             }else if(indata2 == 2){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "D02_3";
             }else if(indata2 == 3){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "D02_4";
                 redata[3] = "고혈압, 뇌졸중 기왕력 환자들은 각별히 주의하시고 급격한 날씨 변화에 노출되지 않도록 외출 및 환기에 주의하세요.";
             }
 
         }else if(indata == "D06"){
             if(indata2 == 0){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "D06_1";
             }else if(indata2 == 1){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "D06_2";
             }else if(indata2 == 2){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "D06_3";
             }else if(indata2 == 3){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "D06_4";
                 redata[3] = "꽃가루 알레르기(참나무) 환자는 외출을 자제하시고, 창문을 닫아 꽃가루의 실내 유입을 차단하세요. 외출 시에는 선글라스와 마스크를 꼭 착용하세요.";
             } 
         }else if(indata == "D07"){
             if(indata2 == 0){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "D07_1";
             }else if(indata2 == 1){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "D07_2";
             }else if(indata2 == 2){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "D07_3";
             }else if(indata2 == 3){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "D07_4";
                 redata[3] = "꽃가루 알레르기(소나무) 환자는 외출을 자제하시고, 창문을 닫아 꽃가루의 실내 유입을 차단하세요. 외출 시에는 선글라스와 마스크를 꼭 착용하세요.";
             } 
         }else if(indata == "D08"){
             if(indata2 == 0){
                 redata[0] = "낮음 ("+indata2+")";
                 redata[1] = "D08_1";
             }else if(indata2 == 1){
                 redata[0] = "보통 ("+indata2+")";
                 redata[1] = "D08_2";
             }else if(indata2 == 2){
                 redata[0] = "높음 ("+indata2+")";
                 redata[1] = "D08_3";
             }else if(indata2 == 3){
                 redata[0] = "매우높음 ("+indata2+")";
                 redata[1] = "D08_4";
                 redata[3] = "꽃가루 알레르기(잡초류) 환자는 외출을 자제하시고, 창문을 닫아 꽃가루의 실내 유입을 차단하세요. 외출 시에는 선글라스와 마스크를 꼭 착용하세요.";
             }
         }
         return redata;
     }
     
     function createMyPointSlider() {
         myPointSlider = new MyPointSlider('my-point-slider');
     }
     //9보다 작을때 0붙이기
     function numberPlusZero(num){
         if(Number(num) < 10){
             return "0"+num
         }else{
             return num
         }
     }

    
     
     function createSearchBox() {
         indexLocalSearchbox = new DongSearchbox('index-local-search');
         var $popLocalSearch = $('.modal-layer.pop-local-search');
         $popLocalSearch.find('.modal-layer-close').on('click', function(e) {
             e.preventDefault();
             $popLocalSearch.removeClass('on');
         });
         $('a[data-role="pop-local-search"]').on('click', function(e) {
             e.preventDefault();
             if(!$popLocalSearch.hasClass('on')) $popLocalSearch.addClass('on');
             window.setTimeout( function() {
                 $popLocalSearch.find('input').first().trigger('focus');
             },0);
         });
         $popLocalSearch.on('click', '.cmp-local-search-input > .pop-open', function(e) {
             e.preventDefault();
             $popLocalSearch.removeClass('on');
         });
         popLocalSearchbox = new DongSearchbox('pop-local-search');
     }
     function createCurrentWarning() {
         var todayWarning = new TodayWarning('today-warning');
     }
     function createBookmarks() {
         bookmarkDropdown = displayMode == DISPLAY_MODE_DEFAULT ? new BookmarkDropdown('index-bookmarks') : new BookmarkDropdown('index-map-bookmarks');
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
             if(!isMapMode) createDataList(bookmark);
         });
         GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
             bookmarkDropdown.refresh(bookmark);
             if(!isMapMode) createDataList(bookmark);   
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
             if(!isMapMode) createDataList(bookmark);
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
             if(!isMapMode) createDataList(bookmark);
 
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
     
    
     
     
     //팝업
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
 