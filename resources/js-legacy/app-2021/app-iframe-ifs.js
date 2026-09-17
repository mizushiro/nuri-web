/**
 * 지역별 영향예보 iframe (/iframe/ifs)
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
        appPrefix = (window.appBase ? window.appBase : '/'),
        indexLocalSearchbox = null,
        popLocalSearchbox = null,
        myPointSlider = null,
        hashParam = null,
        $contentBody = $('#content-body'),
        ptrEnabled = true;

    /* 화면 모드 셋팅 */
    var displayMode = "default";
    
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
        createBookmarks();
        createGlobalEvent();
    }

    function createPTR(){
        var ptr = PullToRefresh.init({
            mainElement: '.cont-wrap',
            triggerElement: '.container',
            distThreshold: 80,
            distMax: 100,
            distReload: 70,
            distIgnore: 20,
            instructionsPullToRefresh: '당겨서 날씨를 새로고칩니다.',
            instructionsReleaseToRefresh: '놓으면 새로고칩니다.',
            instructionsRefreshing: '새로고칩니다.',
            refreshTimeout: 300,
            shouldPullToRefresh: function() {
                return !this.triggerElement.scrollTop // !window.scrollY 
                        && ptrEnabled 
                        && !$('#today-warning').hasClass('on')
                        && $('.cmp-main-tabs .tab-item').eq(0).hasClass('on');
            },
            onRefresh: function() {
                window.setTimeout(function() {
                    if(bookmarkDropdown) {
                        var bookmark = bookmarkDropdown.config.selectedBookmark;
                        if(bookmark) {
                            updateImpactForecast(bookmark);
                        }
                    }
                },10);
            }
        });
    }

    function createBookmarks() {
        bookmarkDropdown = new BookmarkDropdown('index-bookmarks');
    }
    
    function createPopMyPointsEvent() {
        $('.cmp-pop-my-points .sym-close').click(function(e) {
            e.preventDefault();
            var $comp = $(this).parents('.cmp-pop-my-points');
            $comp.css({ marginTop: -$comp.height() + 'px' })
                .bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ $(this).addClass('closed'); });
        });
    }
    
    
    function updateImpactForecast(bookmark) {  
        showLoading('ifs-holder', true);
        var dongFullName = bookmark.fullName;
        var dongFullHtml = dongFullName = null ? '' : '<div class="cmp-my-point-slider"><div class="my-item"><a style=\'cursor:default;\'>' + dongFullName + '</a></div></div>';
        requestIfs(bookmark.dong.code, wsUnit).then(
            function(html) {            	
                $('#ifs-holder').html(dongFullHtml + html);
                $('.more').css('display','none');
            },
            function(err) {
                console.log(err);
                showLoading('ifs-holder', false);
            }
        );
    }
    
    function createGlobalEvent() {
        var isMapMode = displayMode == DISPLAY_MODE_MAP;
        GlobalEvent.on('onAppConfigUpdated', function(e) {
            window.location.reload();
        });
        GlobalEvent.on('onAddAreaBookmark', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            if(!isMapMode) updateImpactForecast(bookmark);
        });
        GlobalEvent.on('onAddAreaRecent', function(e, bookmark) {
            bookmarkDropdown.refresh(bookmark);
            if(!isMapMode) updateImpactForecast(bookmark);
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
            
            if(!isMapMode) updateImpactForecast(bookmark);
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
            if(bookmarkDropdown) bookmarkDropdown.refreshSelected(bookmark);
            if(!isMapMode) updateImpactForecast(bookmark);

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
    
    function requestIfs(code, wsUnit) {
		var caller = "iframe";
        return $.ajax({
            url: (window.appBase?window.appBase:"/") + "wnuri-fct2021/weather/ifs.do",
            data: {code: code, unit: wsUnit, caller: caller},
            dataType: "html"
        });
    }
     
    /**
        code: "toXY"
            lat, lng to x, y
        code: "toLL" 
            x, y to lat, lng 
        return { lat, lng, x, y }
    */
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
