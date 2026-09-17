/**
 * panel - index SNS(블로그, 트위터, 페이스북, 유튜브
 *
 * 메인 페이지 SNS별 최근글 1개
 */
'use strict';
(function($, window, document){
    var BLOG_URL="repositary/sns/kma_naver_blog.json",
        YOUTUBE_URL="repositary/sns/kma_youtube.json",
        YEBTV_URL="repositary/sns/yebtv_youtube.json",
        TWITTER_URL="repositary/sns/kma_twitter.json",
        FACEBOOK_URL="repositary/sns/kma_facebook.json",
        URGENT_URL="repositary/sns/kma_urgent_youtube.json",
        SNS_ORDER_URL="repositary/sns/sns_order.json",
    IndexSNS = function(wrapperId) {
        if(typeof jQuery === 'undefined') {
            alert('jQuery required!');
        }
//        if(typeof store === 'undefined') {
//            alert('store.js required!');
//        }
//        if(typeof Mustache === 'undefined') {
//            alert('mustache.js required!');
//        }
        
        var base = this;
        base.id = wrapperId;
        
        //base.updateData();
        base.addEventHandler();
    };
    function shouldUsingConfig(pinConfig, partialConfig) {
        var result = false;
        if(pinConfig && partialConfig && partialConfig.pin && partialConfig.pin.summary) {
	        if(partialConfig.datePeriod) {
	            var start = partialConfig.datePeriod.start;
	            var end = partialConfig.datePeriod.end;
	            if(start && end) {
	                var cur = moment();
	                start = moment(start, 'YYYY[-]MM[-]DD HH[;]mm');
	                end = moment(end, 'YYYY[-]MM[-]DD HH[;]mm');
	                if((cur.isAfter(start,'minute') || cur.isSame(start,'minute')) && cur.isBefore(end,'minute')) {
	                    result = true;
	                } else {
	                    result = false;
	                }
	            } else {
	               result = false;
	            }
	        } else {
	           result = true;
	        }
        } else {
            result = false;
        }
        return result;
    }
    IndexSNS.prototype = {
        refresh: function(pinConfig) {
            var base = this;
            base.pinConfig = pinConfig;
            base.updateOrder();
            base.updateData();
        },
        updateOrder: function() {
            var base = this;
            showLoading(base.id, true);

	        base.requestSnsOrder().then(
                function(data) {
                    base.updateSnsOrder(data);
                    showLoading(base.id, false);
                },
                base.error()
            );
        },
        updateData: function() {
            var base = this;
            showLoading(base.id, true);
            if(shouldUsingConfig(base.pinConfig, base.pinConfig ? base.pinConfig.naverBlog : null)) {
               base.updateBlog([ base.pinConfig.naverBlog.pin ]);
            } else {
                base.requestBlog().then(
                    function(data) {
                        base.updateBlog(data);
                        showLoading(base.id, false);
                    },
                    base.error()
                );
            }
            if(shouldUsingConfig(base.pinConfig, base.pinConfig ? base.pinConfig.twitter : null)) {
                base.updateTwitter([ base.pinConfig.twitter.pin ]);
            } else {
                base.requestTwitter().then(
                    function(data) {
                        base.updateTwitter(data);
                        showLoading(base.id, false);
                    },
                    base.error()
                );
            }
        
	        if(shouldUsingConfig(base.pinConfig, base.pinConfig ? base.pinConfig.facebook : null)) {
                base.updateFacebook([ base.pinConfig.facebook.pin ]);
            } else {
	            base.requestFacebook().then(
                    function(data) {
                        base.updateFacebook(data);
                        showLoading(base.id, false);
                    },
                    base.error()
                );
	        }
	        if(shouldUsingConfig(base.pinConfig, base.pinConfig ? base.pinConfig.youtube : null)) {
                base.updateYoutube([ base.pinConfig.youtube.pin ]);
            } else {
                base.requestYoutube().then(
                    function(data) {
                        base.updateYoutube(data);
                        showLoading(base.id, false);
                    },
                    base.error()
                );
            }
	        base.requestYebtv().then(
                function(data) {
                    base.updateYebtv(data);
                    showLoading(base.id, false);
                },
                base.error()
            );
            base.requestUrgent().then(
                function(data) {
                    base.updateUrgent(data);
                    showLoading(base.id, false);
                },
                base.error()
            );
            window.setTimeout(function() {
                showLoading(base.id, false);
            }, 500);
        },
        getData: function(url) {
            var prefix = this.getPrefix();
            var data = {
            };
            
            return $.ajax({
                url: prefix + url,
                data: data,
                dataType: "json"
            });
        },
        getPrefix: function() {
            if(window.appBase) {
                return window.appBase;
            } else {
                return "/";
            }
        },
        requestBlog: function() {
            var base = this;
            return base.getData(BLOG_URL);    
        },
        requestTwitter: function() {
            var base = this;
            return base.getData(TWITTER_URL);    
        },
        requestYoutube: function() {
            var base = this;
            return base.getData(YOUTUBE_URL);    
        },
        requestYebtv: function() {
            var base = this;
            return base.getData(YEBTV_URL);    
        },
        requestUrgent: function() {
            var base = this;
            return base.getData(URGENT_URL);    
        },
        requestFacebook: function() {
            var base = this;
            return base.getData(FACEBOOK_URL);    
        },
        requestSnsOrder: function() {
            var base = this;
            return base.getData(SNS_ORDER_URL);    
        },
        updateBlog: function(data) {
            var base = this;
            var $wrapper = $('#' + base.id);
            var $holder = $wrapper.find('div[data-role="blog"]');
            for(var i = 0 ; i < data.length ; i++) {
                var item = data[i];
                if(item.thumbnail) {
                    $holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
                } else {
                    $.each($holder.find('div[data-role="thumbnail"]'), function() {
                        $(this).remove();
                    });
                    $holder.find('.sns-item-flid').addClass('full-txt');
                }
                if(!item.title) {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
                } else {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');    
                }
                break;
            }
            
        },
        updateTwitter: function(data) {
            var base = this;
            var $wrapper = $('#' + base.id);
            
            var $holder = $wrapper.find('div[data-role="twitter"]');
            for(var i = 0 ; i < data.length ; i++) {
                var item = data[i];
                if(item.thumbnail) {
                    $holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/><span style="text-indent:-999999px;position:absolute;">트위터 게시글 열기</span></a>')
                } else {
                    $.each($holder.find('div[data-role="thumbnail"]'), function() {
                        $(this).remove();
                    });
                    $holder.find('.sns-item-flid').addClass('full-txt');
                }
                if(!item.title) {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
                } else {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');    
                }
                
                //console.log(item.summary.replace('\n','<br/>'))
                break;
            }
            
        },
        updateYoutube: function(data) {
            var base = this;
            var $wrapper = $('#' + base.id);
            
            var $holder = $wrapper.find('div[data-role="youtube"]');
            for(var i = 0 ; i < data.length ; i++) {
                var item = data[i];
                if(item.thumbnail) {
                    $holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
                } else {
                    $.each($holder.find('div[data-role="thumbnail"]'), function() {
                        $(this).remove();
                    });
                    $holder.find('.sns-item-flid').addClass('full-txt');
                }
                if(!item.title) {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
                } else {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');    
                }
                break;
            }
        },
        updateYebtv: function(data) {
            var base = this;
            var $wrapper = $('#' + base.id);
            
            var $holder = $wrapper.find('div[data-role="yebtv"]');
            if($holder.length == 0) return;
            for(var i = 0 ; i < data.length ; i++) {
                var item = data[i];
                if(item.thumbnail) {
                    $holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
                } else {
                    $.each($holder.find('div[data-role="thumbnail"]'), function() {
                        $(this).remove();
                    });
                    $holder.find('.sns-item-flid').addClass('full-txt');
                }
                if(!item.title) {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
                } else {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');    
                }
                break;
            }
        },
        updateUrgent: function(data) {
            var base = this;
            var $wrapper = $('#' + base.id);
            
            var $holder = $wrapper.find('div[data-role="urgent"]');
            if($holder.length == 0) return;
            for(var i = 0 ; i < data.length ; i++) {
                var item = data[i];
                if(item.thumbnail) {
                    $holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/></a>')
                } else {
                    $.each($holder.find('div[data-role="thumbnail"]'), function() {
                        $(this).remove();
                    });
                    $holder.find('.sns-item-flid').addClass('full-txt');
                }
                if(!item.title) {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
                } else {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');    
                }
                break;
            }
        },
        updateFacebook: function(data) {
            var base = this;
            var $wrapper = $('#' + base.id);
            
            var $holder = $wrapper.find('div[data-role="facebook"]');
            for(var i = 0 ; i < data.length ; i++) {
                var item = data[i];
                item.link = "https://www.facebook.com/kmaskylove";
                if(item.thumbnail) {
                    $holder.find('div[data-role="thumbnail"]').html('<a href="' + item.link + '" target="_blank" title="새창열림" aria-hidden="true"><img src="' + item.thumbnail + '" alt="' + item.title + '"/><span style="text-indent:-999999px;position:absolute;">페이스북 게시글 열기</span></a>')
                    
                } else {
                    $.each($holder.find('div[data-role="thumbnail"]'), function() {
                        $(this).remove();
                    });
                    $holder.find('.sns-item-flid').addClass('full-txt');
                }
                
                if(!item.title) {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.summary.replace('\n','<br/>') + '</a>');
                } else {
                    $holder.find('div[data-role="content"] p').html('<a href="' + item.link + '" target="_blank" title="새창열림">' + item.title + '<br />' + item.summary.replace('\n','<br/>') + '</a>');    
                }
                break;
            }
        },
        updateSnsOrder: function(data) {
            var base = this;
            var $wrapper = $('#' + base.id);
            
            var $holder = $wrapper.find('div[data-role="yebtv"]');
            var $target = $wrapper.find('div[data-role="youtube"]');
            if($holder.length == 0) return;
            for(var i = 0 ; i < data.length ; i++) {
                var item = data[i];
                if(item.order == 1) {
                	$holder.attr('data-role','youtube');
                	$target.attr('data-role','yebtv');
                	
                	$holder.find('i[class="icon-yeptv"]').attr('class', 'icon-yout');
                	$target.find('i[class="icon-yout"]').attr('class', 'icon-yeptv');
                }
                break;
            }
        },
        error: function() {
            var base = this;
            return function(request, status) {
                if(console) console.log(request, status);
                showLoading(base.id, false);
            };
        },
        addEventHandler: function() {
            var base = this;
            // save, cancel
            var $wrapper = $('#' + base.id);
            
        }
    };
    
    if (typeof exports !== 'undefined') exports.IndexSNS = IndexSNS;
    else window.IndexSNS = IndexSNS;
})(jQuery, window, document);