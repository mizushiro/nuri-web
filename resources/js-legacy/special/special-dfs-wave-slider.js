'use strict';
  
	function createDfsWaveSlider() {
        var isHr1Fct = $('.cmp-dfs-slider').first().hasClass('hr1-fct');
        var dfsSlider = null;
        var isMovingToTab = false;
        var obj = '.dfs-tab-body .dfs-slider';
        var $slider = $(obj);
        var $slideWrap = $slider.find('.slide-wrap');
        var scrollWidth = 0;
        var slidePoints = null;
        var midtchartWidth = 0;
        var midtchartLeft = 0;
        var isModeChart = false;
        var isModeTable = false;
        var $slides = $slider.find('.slide');
        var $dailyHeads = $slider.find('.slide:not(.day-ten) .daily-head');
        var slideLength = $slides.length;
        var lastTabIndex = 0;
        
        prepareSlider();
        
        dfsSlider = new IScroll('.dfs-tab-body .dfs-slider', { eventPassthrough:true, scrollX: true, scrollY: false, mouseWheel: false, scrollbars: 'custom', resizePolling : 40, probeType : 3, interactiveScrollbars: true});
        
        updateChart();
        
        dfsSlider.on('scroll', function(){
            if(isMovingToTab) return;
            var scrollX = -this.x;
            var selectedTabIndex = 0;
            for(var i = 0 ; i < slidePoints.length ; i++) {
                var p1 = slidePoints[i] - (i > 0 ? (isHr1Fct ? 55 : 30) : 0);
                var p2 = (i+1 >= slidePoints.length) ? 99999999 : (slidePoints[i+1] - (isHr1Fct ? 55 : 30));
                if(p1 <= scrollX && scrollX < p2) {
                    selectedTabIndex = i;
                    break;
                }
            }
            if(isHr1Fct) {
                if(selectedTabIndex < $dailyHeads.length && scrollX >= 0) {
                    var selectedSlideLeft = slidePoints[selectedTabIndex];
                    var slideWidth = (selectedTabIndex+1 < slidePoints.length) ? ( slidePoints[selectedTabIndex+1] - selectedSlideLeft ) : 9999;
                    var marginLeft = scrollX - selectedSlideLeft;
                    if(marginLeft < slideWidth - $dailyHeads.eq(selectedTabIndex).width() - 70) {
                        $dailyHeads.eq(selectedTabIndex).css({ 'margin-left': (selectedTabIndex == 0 ? marginLeft : marginLeft+55)+ 'px'});
                    }
                } else if(scrollX < 0) {
                    $dailyHeads.eq(0).css({ 'margin-left': 'auto'});
                }
            }
            if(lastTabIndex != selectedTabIndex) {
                if(isHr1Fct) {
                    if(lastTabIndex < $dailyHeads.length) {
                        $dailyHeads.eq(lastTabIndex).css({ 'margin-left': 'auto'});
                    }
                }
				lastTabIndex = selectedTabIndex;
				selectTab(lastTabIndex);
            }
        });
        /* 
            보기 옵션 열기 
        */
        $('.cmp-dfs-slider a[data-layer]').click(function(e) {
            e.preventDefault();
            var dataLayer = $(this).attr('data-layer');
            var $panel = $('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']');
            if(!$panel.hasClass('on')) $panel.addClass('on')
            $panel.find('.big-close').unbind('click').bind('click', function(e) {
                e.preventDefault();
                $panel.removeClass('on');
            });
        });
        /*
            예보 보기 옵션 레이어 이벤트.
        */
        $('.cmp-dfs-slider').on('click', '.view-options a.sym-btn[data-option]', function(e) {
            e.preventDefault();
            var dataLayer = 'view-options';
            $(this).parent().parent().find('a.sym-btn').removeClass('on');
            $(this).addClass('on');
            var optionType = $(this).attr('data-option');
            var optionValue = $(this).attr('data-value');
            if(optionType == 'series') {
                $('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(optionValue);
                window.setTimeout(function() {
                    prepareSlider();
                    dfsSlider.refresh();
                    updateChart();
                    $('.dfs-tab-head > li > a').first().trigger('click');
                    }, 0);
                $('.cmp-dfs-slider a.sym-btn[data-view]').removeClass('on');
                $('.cmp-dfs-slider a.sym-btn[data-view="' + optionValue + '"]').addClass('on');
            }
            $('.cmp-dfs-slider').find('div[data-layer=' + dataLayer +']').removeClass('on');
        });
        $('.cmp-dfs-slider').on('click', 'a.sym-btn[data-view]', function(e) {
            e.preventDefault();
            $(this).parent().find('a.sym-btn[data-view]').removeClass('on');
            $(this).addClass('on');
            
            var mode = $(this).attr('data-view');
            $('.cmp-dfs-slider').removeClass('mode-chart').removeClass('mode-table').removeClass('mode-default').addClass(mode);
            window.setTimeout(function() {
                prepareSlider();
                dfsSlider.refresh();
                updateChart();
                $('.dfs-tab-head > li > a').first().trigger('click');
                }, 0);
            $('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"]').removeClass('on');
            $('.cmp-dfs-slider [data-layer="view-options"] [data-option="series"][data-value="' + mode + '"]').addClass('on');
        });
        /*
            오늘 내일 모레 10일 이후 탭과 스크롤 연동.
        */
        $('.cmp-dfs-slider .dfs-tab .dfs-tab-head').on('click', 'a', function(e) {
            e.preventDefault();
            $(this).parents('.dfs-tab-head').find('a.on').removeClass('on');
            $(this).addClass('on');
            var date = $(this).attr('data-date');
            var $slider = $('.cmp-dfs-slider .dfs-slider').first();
            var scrollLeft = 0;
            $slider.find('.daily').each(function(idx, ele) {
                if(date == $(ele).attr('data-date')) return false;
                scrollLeft +=  Math.ceil($(ele).width());
            });
            if(isHr1Fct) scrollLeft -= 47;
            isMovingToTab = true;
            if(dfsSlider) dfsSlider.scrollTo( -scrollLeft, 0, 500, IScroll.utils.ease.quadratic);
            window.setTimeout(function() { isMovingToTab = false;}, 500);
        });
        $('.cmp-dfs-updated a').on('click', function(e) {
            e.preventDefault();
            if($(this).hasClass('open-box')) {
                $(this).toggleClass('on');
            } else if($(this).hasClass('close-box')) {
                $('.cmp-dfs-updated a.open-box').toggleClass('on');
            }
        });
        // 윈도우 사이즈 변경에 따라 슬라이더 갱신.
        var isMobileSize = $(window).width() <= 1100;
        $(window).resize(function(e) {
            var width = $(window).width();
            if(isMobileSize) {
                if(width > 1100) {
                    window.setTimeout(function() {
                        prepareSlider();
                        if(dfsSlider) dfsSlider.refresh();
                    },0);
                    isMobileSize = false;
                }
            } else {
                if(width <= 1100) {
                    window.setTimeout(function() {
                        prepareSlider();
                        if(dfsSlider) dfsSlider.refresh();
                    },0);
                    isMobileSize = true;
                }
            }
        });
        
        /*
            슬라이더 준비.
        */
        function prepareSlider() {
            isModeChart = $('.cmp-dfs-slider').hasClass('mode-chart');
            isModeTable = $('.cmp-dfs-slider').hasClass('mode-table');
            scrollWidth = 0;
            slidePoints = [];
            
            if(!isModeTable) {
                $slides.each(function(idx, ele) {
                    var slideWidth = 0;
                    $(ele).find('.item').each(function(idx2, ele2) {
                        var w = Math.ceil($(ele2).width());
                        slideWidth += w;
                    });
                    $(ele).css('width', slideWidth + 'px');
                    slidePoints.push(scrollWidth);
                    scrollWidth += slideWidth;
                });
                
                scrollWidth += 78;
                $slideWrap.css('width', scrollWidth + 'px');
            } else {
                $slides.each(function(idx, ele) {
                    var slideWidth = Math.ceil($(ele).width());
                    slidePoints.push(scrollWidth);
                    scrollWidth += slideWidth;
                });
                $slideWrap.css('width', scrollWidth + 'px');
            }
//            console.log("isModeTable", isModeTable, "slidePoints", slidePoints, "scrollWidth", scrollWidth);
        }
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
        }
        function selectTab(tabIndex) {
            $('.cmp-dfs-slider > .dfs-tab > .dfs-tab-head-wrap > .dfs-tab-head > li > a.on').removeClass('on').trigger('blur');
            var $a = $('.cmp-dfs-slider .dfs-tab .dfs-tab-head li').eq(tabIndex).find('a').addClass('on');
            //window.setTimeout(function(){$a.trigger('focus');}, 0);
        }
        function updateChart() {
            /* 파고 차트 */
            var chartWidth = 0;
            $.each($slides, function(idx,ele) {
                chartWidth += $(ele).width();
            });
            /* 파고차트 */
            var $wavechartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .wavechart').css({ width: chartWidth + 'px'});
            $('<div>').attr('id', 'my-wavechart').css({ width: '100%', height: '100%'}).appendTo($wavechartWrap);
            var wavechartSeries = JSON.parse($wavechartWrap.attr('data-data'));
            var waveList = wavechartSeries[0];
            var maxWh = 0;
            for(var i = 0 ; i < waveList.length; i++) {
                if(maxWh < waveList[i]) {
                    maxWh = waveList[i];
                }
            } 
            maxWh += maxWh * 0.4;
            var waveChart = createChart('my-wavechart', [{data: waveList, name:'', dataLabels: { overflow:'allow', formatter: function () { return this.y + 'm'; },}}], { 
                    chart: { 
                        type: 'areaspline',
                        paddingTop: 20, 
                        paddingBottom: 20, 
                        marginBottom: 2,
                    }, 
                    plotOptions: {
                        series: {
                            showInLegend:false,
                            animation: false,
                            marker : { enabled: true },
                            fillColor: {
                                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                        }
                    },
                    xAxis: { lineColor: '#39B1E8', lineWidth: 1},
                    yAxis: { max: maxWh, min:0 }
                });
            /* 차트 모드 */
            if(isModeChart) {
                /* 풍향 풍속 */
                var $windchartWrap = $('.cmp-dfs-slider .dfs-tab-body .slide-wrap .windchart').css({ width: chartWidth + 'px'});
                $('<div>').attr('id', 'my-windchart').css({ width: '100%', height: '100%'}).appendTo($windchartWrap);
                var windchartSeries = JSON.parse($windchartWrap.attr('data-data'));
                var windList = [];
                var wsList = windchartSeries[0];
                var wdList = windchartSeries[1];
                var maxWs = 0;
                var minWs = 99999999;
                for(var i = 0 ; i < wsList.length; i++) {
                    if(maxWs < wsList[i]) {
                        maxWs = wsList[i];
                    }
                    if(minWs > wsList[i]) {
                        minWs = wsList[i];
                    }
                    windList.push({x:i, y: wsList[i], arrow: wdList[i] + '_b'});
                }
                minWs -= (maxWs - minWs) * 0.4; 
                maxWs += (maxWs - minWs) * 0.4;
                var windChart = createChart('my-windchart', [
                            {data: windList, name:'1',
                                dataLabels: {
                                    formatter: function() {
                                        return '<span class="wdic ' + this.point.arrow + ' sm" />';
                                    },
                                    overflow: 'allow',
                                    enabled: true,
                                    useHTML: true,
                                    inside: true
                                }
                            },
                            {data: windList, name:'dummy',
                                dataLabels: {
                                    formatter: function () { return this.y; },
                                    overflow: 'allow',
                                    enabled: true,
                                    y: 24
                                },  
                            }
                        ], { 
                        chart: { 
                            type: 'spline',
                            paddingTop: 20, 
                            paddingBottom: 20, 
                        },
                        plotOptions: {
                            series: {
                                showInLegend:false,
                                animation: false,
                            }
                        },
                        xAxis: { lineColor: '#39B1E8', lineWidth: 2 },
                        yAxis: { min: minWs, max: maxWs, tickInterval:0.01}
                    });
                
            }
        }
        /**
            차트
            series : array of array or..
            options : chart options
        */
        function createChart(id, series, options) {
            if(!series || series.length < 1) return;
            
            var minPadding = 1.0 / (series[0].data.length * 2.0); 
            var maxPadding = minPadding;
            var minValue = 999;
            var maxValue = -999;
            for(var j = 0 ; j < series.length ; j++) {
                var valList = series[j].data;
                for(var i = 0 ; i < valList.length ; i++) {
                    var val = valList[i];
                    if(typeof val.y != 'undefined') {
                        if(val.y > maxValue) maxValue = val.y;
                        if(val.y < minValue) minValue = val.y;
                    } else {
                        if(val > maxValue) maxValue = val;
                        if(val < minValue) minValue = val;
                    }   
                }
            }
            var lineColor = "#009AE0", fontColor = "#000000";
            var chartOptions = {
                plotOptions: {
                    series: { 
                        pointStart: 1, 
                        fillColor:'#009AE1' 
                    },
                    line: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '℃'; }
                        },  
                        enableMouseTracking: false,
                    },
                    spline: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '℃'; }
                        },  
                        enableMouseTracking: false,
                    },
                    area: { 
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '%'; },
                            verticalAlign: 'bottom',
                        },  
                        enableMouseTracking: false,
                        marker: { enabled: false }
                    },
                    bar: {
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y + '%'; },
                            verticalAlign: 'bottom',
                        },  
                        enableMouseTracking: false
                    },
                    column: {
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y >= 0 ? this.y + '%' : ''; },
                            inside: false,
                        },  
                        enableMouseTracking: false
                    },
                    areaspline: {
                        color: lineColor,
                        dataLabels: {
                            enabled: true, 
                            style: { fontSize: '14px', fontWeight: 'normal', color: fontColor, textOutline: false },
                            formatter: function () { return this.y >= 0 ? this.y + '%' : ''; },
                            inside: false,
                        },  
                        enableMouseTracking: false
                    }
                },
                series: series,
                yAxis: {
                    min: minValue-1, max: maxValue+1,
                    tickInterval: 0.1,
                    gridLineColor: "rgba(0,0,0,0)",
                    labels:{ enabled: false },
                    title: { enabled: false },
                },
                xAxis: {
                    lineColor: "rgba(0,0,0,0)",
                    tickColor: "rgba(0,0,0,0)",
                    labels: { enabled: false },
                    title: { enabled: false },
                    minPadding: minPadding,
                    maxPadding: maxPadding,
                    margin: 0, padding: 0,
                },
                chart: { backgroundColor: "rgba(0,0,0,0)", margin: 0, padding: 0, style: { fontFamily: "'ns', sans-serif" } },
                title: { text: null },
                credits: { enabled:false},
            };
            if(options) _.merge(chartOptions, options);
            console.log(chartOptions, options);
            var chart = Highcharts.chart(id, chartOptions); 
            return chart;       
        }
    }