/**
 *  테마 - 유명산 단풍 (url: /theme/autumn-leaves.do)
 */
'use strict';

function applyMapleData(data) {
    console.log(data);
    if(data && data.flower) {
        if(data.flower.obsPlaceDetail) {
            data.flower.obsPlaceDetail = data.flower.obsPlaceDetail.replace(/&#40;/g,'(');
            data.flower.obsPlaceDetail = data.flower.obsPlaceDetail.replace(/&#41;/g,')');
        }
    }
    if(data.treeType == "4") {
        data.flowerClassCode = "02";
        data.flowerMapCode = "01";
        data.flowerMapAlt = "전국 지도";
    }
    var template = $('#maple-photo-template').html();
    
    var html =  Mustache.render(template, data);
    $('#maple-photo-body').html(html);
    
    $('#maple-photo-body').on('click', 'a[data-action="detail-view"]', function(e) {
        e.preventDefault();
        var title = $(this).attr('data-title');
        var imageType = $(this).attr('data-image');
        var $pops = $('[class*="modal-pop"][data-pop="detail-view"]');
        $pops.fadeIn().addClass('popcont-open');
        $('body').addClass("hidd");
        weatherUI.dimdOn();
        $('.pw-dimmed').fadeIn(500);
        var srcEle = this;
        $pops.find('button.pop-close').first().focus().on('click', function() {
            srcEle.focus();
        });
        $pops.find('.title').first().html(data.flower.obsPlace + " " + title);
        var detailTemplate = $('#maple-photo-detail-template').html();
        var templateData = Object.assign({}, data);
        if("bf-macro" == imageType) {
            templateData.image = data.flower.bfMacroName;
            templateData.shotDate = data.flower.bfShotDate;
            templateData.shotTemp = data.flower.bfShotTemp;
            templateData.shotWeather = data.flower.bfShotWeather;
        } else if("bf-full" == imageType) {
            templateData.image = data.flower.bfFullName;
            templateData.shotDate = data.flower.bfShotDate;
            templateData.shotTemp = data.flower.bfShotTemp;
            templateData.shotWeather = data.flower.bfShotWeather;
        } else if("cf-macro" == imageType) {
            templateData.image = data.flower.cfMacroName;
            templateData.shotDate = data.flower.cfShotDate;
            templateData.shotTemp = data.flower.cfShotTemp;
            templateData.shotWeather = data.flower.cfShotWeather;
        } else if("cf-full" == imageType) {
            templateData.image = data.flower.cfFullName;
            templateData.shotDate = data.flower.cfShotDate;
            templateData.shotTemp = data.flower.cfShotTemp;
            templateData.shotWeather = data.flower.cfShotWeather;
        } else if("ff-macro" == imageType) {
            templateData.image = data.flower.ffMacroName;
            templateData.shotDate = data.flower.ffShotDate;
            templateData.shotTemp = data.flower.ffShotTemp;
            templateData.shotWeather = data.flower.ffShotWeather;
        } else if("ff-full" == imageType) {
            templateData.image = data.flower.ffFullName;
            templateData.shotDate = data.flower.ffShotDate;
            templateData.shotTemp = data.flower.ffShotTemp;
            templateData.shotWeather = data.flower.ffShotWeather;
        }
        templateData.title = title;
        var html = Mustache.render(detailTemplate, templateData);
        $pops.find('.layer-pop-wrap').html(html);
        $('.pw-dimmed').on('click',function(){
            $('.popcont-open').fadeOut(300).removeClass('.popcont-open');
            $('.pw-dimmed').fadeOut(300);
            $('body').removeClass("hidd");
            setTimeout(function(){
                weatherUI.dimdOff();
            });
        });
    });
}
(function($, window, document){
    GlobalEvent.on('EVENT', function(e, sender) {
    
    });
})(jQuery, window, document);
