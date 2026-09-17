/**
 *  소식,지식 - 소식
 */
 
 var indexSNS = new IndexSNS("index-sns");
'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});
	//indexSNS.refresh();
	showLoading('weather-on', true);
	addScript("https://www.kma.go.kr/kma/wtouch/wtouchOnJs.jsp");
	var typeNumSlick = weatherUI.slickNumTab('.slick-type-num');
//	if(typeNumSlick.find('.slick-slide').length > 1) {
//		typeNumSlick.on('vmousedown touchstart', function(e) {
//			mainSlick.slick("slickSetOption","swipe", false);
//		}).on('afterChange', function() {
//			mainSlick.slick("slickSetOption","swipe", true);
//		});
//	}
	weatherUI.slickChange2('.sns-list');
//	.on('vmousedown touchstart', function(e) {
//		mainSlick.slick("slickSetOption","swipe", false);
//	}).on('afterChange', function() {
//		mainSlick.slick("slickSetOption","swipe", true);
//	});
	$('.slick-type-num').find('[aria-hidden]').each(function() {
		$(this).removeAttr('aria-hidden');
	});
	$('.sns-list').find('[aria-hidden]').each(function() {
		$(this).removeAttr('aria-hidden');
	});
})(jQuery, window, document);

function applySnsConfig(config) {
    indexSNS.refresh(config);
}
//날씨터치
window.udpateWeatherOn = function(data) {
	showLoading('weather-on', false);
	var $wrapper = $('#weather-on');
	if(data.list && data.list.length > 0) {
		var item = data.list[0];
		$wrapper.find('iframe').attr('src', item.video.replace("https://youtu.be","https://www.youtube.com/embed")).attr('title', '날씨해설 ' + item.title + ' 유튜브 동영상');
		$wrapper.find('.swiper-slide .txt').html(item.content);
	}
}

function addScript( src ) {
	var s = document.createElement( 'script' );
	s.setAttribute( 'src', src );
	document.body.appendChild( s );
}

/* 포토 뉴스 */
function applyPhotonews(articles) {
    for(var i in articles) {
        articles[i].index = parseInt(i);
        articles[i].count = parseInt(i)+1;
        articles[i].on = i == 0;
        if(articles[i].subject) {
            articles[i].subject = articles[i].subject.replace(/\&#40;/g, '(');
            articles[i].subject = articles[i].subject.replace(/\&#41;/g, ')');
        }
    }
    var template = $('#photonews-template').html();
    var html =  Mustache.render(template, { articles: articles.slice(0, 8) } );
    var $wrapper = $('#photonews-holder').html(html);
    
    // 사진으로 보는 기상청 우측슬라이더
    var mSlider = function(element) {
        this.$n = 0;
        this.li = element.find(".mcarousel li");
        this.li_a = element.find(".mcarousel li a");
        this.$slide = this.li.length-1;
        //this.left = element.find(".mleft");
        //this.right = element.find(".mright");      
        //this.buttons();   
        this.li.eq(this.$n).fadeIn('fast');
        this.focusing();
    }
    mSlider.prototype.buttons = function() {
        var that = this;    
        this.right.click(function () {
            if (that.$n <= (that.$slide - 1)) {
                that.li.eq(that.$n).hide();
                that.$n++;
                that.li.eq(that.$n).fadeIn('fast');
            } else {
                that.li.eq(that.$slide).hide();
                that.$n = 0;
                that.li.eq(0).fadeIn('fast');
            }
        });
        this.left.click(function () {
            if (that.$n >= 1) {
                that.li.eq(that.$n).hide();
                that.$n--;
                that.li.eq(that.$n).fadeIn('fast');
            } else {
                that.li.eq(0).hide();
                that.$n = (that.$slide)
            }
            that.li.eq(that.$n).fadeIn('fast');
        });
    };
    mSlider.prototype.focusing = function() {
        var that = this;
        this.li_a.keydown(function(ev){
            var keycode = ev.keyCode;
        /*
            if(keycode == 9){
                if(ev.shiftKey){
                    //console.log('shift key');
                    if (that.$n >= 1) {
                        that.li.eq(that.$n).hide();
                        that.$n--;
                        that.li.eq(that.$n).show();
                    } else {
                        that.li.eq(0).hide();
                        that.$n = (that.$slide)
                    }
                    that.li.eq(that.$n).show();
                }else{
                    //console.log('onley tab');
                    if (that.$n <= (that.$slide - 1)) {
                        that.li.eq(that.$n).hide();
                        that.$n++;
                        that.li.eq(that.$n).show();
                    } else {
                        that.li.eq(that.$slide).hide();
                        that.$n = 0;
                        that.li.eq(0).show();
                    }
                }
            }
        */      
        });
    };
    var slider1 = new mSlider(jQuery(".mslider01")); 
    var slider2 = new mSlider(jQuery(".mslider02")); 
    var slider3 = new mSlider(jQuery(".mslider03")); 
    var slider4 = new mSlider(jQuery(".mslider04")); 
    var slider5 = new mSlider(jQuery(".mslider05")); 
    $wrapper.find('.swiper_photo .swiper-slide > a').on('click',function(){
        var photoClassName = $(this).attr('class');
        var numFromString = photoClassName.substr(photoClassName.length - 1);
        var realIdx = numFromString - 1;
        $wrapper.find('.mslider').hide();
        $wrapper.find('.mslider').eq(realIdx).show();
        $wrapper.find('.thumb_tab > .detail p').removeClass('on');
        $wrapper.find('.thumb_tab > .detail p').eq(realIdx).addClass('on');
    });
    
    // 사진으로 보는 기상청
    var swiper_photo = new Swiper('.swiper_photo', {
        slidesPerView: 3,
        spaceBetween: 10,
        //slidesPerGroup: 3,
        loop: false,
        loopFillGroupWithBlank: true,
        pagination: {
            el: '.swiper-pagination_photo',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next_ft_photo',
            prevEl: '.swiper-button-prev_ft_photo',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            }
        }
    });
    $wrapper.find('.thumb_tab_target').find('.mleft').on('click', function(e) {
        e.preventDefault();
        swiper_photo.slidePrev();
        var realIdx = swiper_photo.realIndex;
        $wrapper.find('.mslider').hide();
        $wrapper.find('.mslider').eq(realIdx).show().find('.mleft').focus();
        $wrapper.find('.thumb_tab > .detail p').removeClass('on');
        $wrapper.find('.thumb_tab > .detail p').eq(realIdx).addClass('on');
    });
    $wrapper.find('.thumb_tab_target').find('.mright').on('click', function(e) {
        e.preventDefault();
        swiper_photo.slideNext();
        var realIdx = swiper_photo.realIndex;
        $wrapper.find('.mslider').hide();
        $wrapper.find('.mslider').eq(realIdx).show().find('.mright').focus();;
        $wrapper.find('.thumb_tab > .detail p').removeClass('on');
        $wrapper.find('.thumb_tab > .detail p').eq(realIdx).addClass('on');
    });
}
