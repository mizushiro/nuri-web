var KmapOvr = (function() {
    var _this;
    var layer;
    var source;
    var loaded = false;

    var PROJ = "EPSG:980201";
    var APP_URL = window.wgisBaseUrl ? window.wgisBaseUrl: 'https://www.weather.go.kr/wgis-nuri';
    var URL = APP_URL + "/js/info/sfc.geojson";
    var ID_PATTERN = "main-ovr-";

    function KmapOvr(vmap, lang) {
        this.map = vmap.map;
        this.lang = lang ? lang : "ko";	// ko, en
        _this = this;
    }

    KmapOvr.prototype = {
        open: function(list, callback) {
            if(!loaded) {
                load(function(success) {
                    if(success) {
                        render(list, callback);
                    }
                });
            } else {
                render(list, callback);
                layer.setVisible(true);
            }
        },
        close: function() {
            var ovrs = this.map.getOverlays().getArray();
            for(var i = 0; i < ovrs.length; i++) {
                var ovr = ovrs[i];
                ovr.setPosition(null);
            }
            if(layer) layer.setVisible(false);
        },
        setLang: function(lang) {
            this.lang = lang;
            source.changed();
        }
    }

    var resolutions = [
        {level: [1], max: 2822.23, min: 1777.89},
        {level: [1, 2, 3], max: 1777.89, min: 444.47},
        {level: [1, 2, 3, 4, 5], max: 444.47, min: 0},
    ]

    function pointStyle(feature) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 0)', width: 1 }),
                fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0)' })
            }),
            text: new ol.style.Text({
                textAlign: 'center',
                text: (_this.lang.toLowerCase() === "ko") ? feature.getProperties().stnKo : feature.getProperties().stnEn,
                font: 'bold 11px NanumGothic',
                fill: new ol.style.Fill({color: 'black'}),
                stroke: new ol.style.Stroke({color: '#ffffff', width: 2}),
                placement: 'point',
                offsetY: -22
            })
        })
    };

    function load(callback) {
        $.ajax({
            url: URL,
            dataType: 'json',
        }).then(
            function(geojson) {
                loaded = true;
                createOverlay(geojson);
                if(typeof callback == "function") callback(true);
            },
            function(e) {
                loaded = false;
                console.log(e);
                if(typeof callback == "function") callback(false);
            }
        );
    }

    function render(list, callback) {
        for(var i in list) {
            var data = list[i];
            if(data.stnId) {
                var overlay = _this.map.getOverlayById(ID_PATTERN + data.stnId);
                if(overlay) {
                    var element = overlay.getElement();
                    element.innerHTML = bind(data);
                    element.setAttribute('data-index', i);
                    if(callback && typeof callback === "function") {
                        element.onclick = function(e) {
                            callback(e, list[parseInt(this.getAttribute('data-index'))]);
                        }
                    }
                }
            }
        }
        source.changed();
    }

    function bind(data) {
        var type = data.type;
        var templates = {
            YES_TA: (data.tmx ? '<span style="color: red;">' + data.tmx + '</span>' : '') + (data.tmn ? '<span style="color: blue;">' + data.tmn + '</span>' : ''),
            YES_RN: (data.rnDay ? '<span style="color: red;">' + data.rnDay + '</span>' : '') + (data.sdNew ? '<span style="color: blue;">' + data.sdNew + '</span>' : ''),
            OBS_TA: (data.wwIconSrc ? '<span><img width="16" height="16" src="' + data.wwIconSrc + '" alt="' + data.wwKo + '" title="' + data.wwKo + '"></span>' : '') + (data.ta ? '<span>' + data.ta + '</span>' : ''),
            OBS_RN: (data.rnHr1 ? '<span style="color: red;">' + data.rnHr1 + '</span>' : '') + (data.sdTot ? '<span style="color: blue;">' + data.sdTot + '</span>' : ''),
            OBS_VC: (data.wdIconSrc ? '<span><img width="16" height="16" src="' + data.wdIconSrc + '" alt="' + data.wd + '" title="' + data.wd + '" class="wd"></span>' : '') + (data.ws ? '<span>' + data.ws + '</span>' : ''),
            NOW_TA: (data.wwIconSrc ? '<span><img width="16" height="16" src="' + data.wwIconSrc + '" alt="' + data.wwKo + '" title="' + data.wwKo + '"></span>' : '') + (data.ta ? '<span>' + data.ta + '</span>' : ''),
            NOW_RN: (data.rnHr1 ? '<span class="val">' + data.rnHr1 + '</span>' : '') + (data.wdIconSrc ? '<span><img width="12" height="12" src="' + data.wdIconSrc +'" alt="' + data.wdKo + '" title="' + data.wdKo + '" class="wd"></span><span>' + data.ws + '</span>' : ''),
            FCT_AM: (data.wwIconSrc ? '<span><img width="16" height="16" src="' + data.wwIconSrc + '" alt="' + data.wwKo + '" title="' + data.wwKo + '"></span>' : '') + (data.ta ? '<span>' + data.ta + '</span>' : ''),
            FCT_PM: (data.wwIconSrc ? '<span><img width="16" height="16" src="' + data.wwIconSrc + '" alt="' + data.wwKo + '" title="' + data.wwKo + '"></span>' : '') + (data.ta ? '<span>' + data.ta + '</span>' : ''),
            AWS: (data.ta ? '<span>' + data.ta + '</span>' : '') + (data.ws10 ? '<span>' + data.ws10 + '</span>' : '') + (data.rnHr1 ? '<span>' + data.rnHr1 + '</span>' : ''),
        }
        return templates[type];
    }

    function isNotEmpty(value) {
        return (value !== undefined && value !== null && value !== "");
    }

    function createOverlay(geojson) {
        var features = (new ol.format.GeoJSON({ featureProjection: PROJ })).readFeatures(geojson);
        addLayer(features);
        addOverlays(features);
    }

    function addLayer(features) {
        layer = new ol.layer.Vector({
            visible: true,
            source: new ol.source.Vector({
                features: features
            }),
            style: styleFunction,
            zIndex: 1001
        });
        source = layer.getSource();
        _this.map.addLayer(layer);
        return layer;
    }

    function addOverlays(features) {
        for(var key in features) {
            var feature = features[key];
            var prop = feature.getProperties();
            var coord = feature.getGeometry().getCoordinates();
            var overlay = new ol.Overlay({
                id: ID_PATTERN + prop.stnId,
                element: document.createElement("div"),
                className: 'sfc-main',
                offset: [0, 0],
                position: coord,
                positioning: 'center-center'
            });
            feature.set('overlay', overlay);
            feature.set('position', coord);
            _this.map.addOverlay(overlay);
        }
    }

    function styleFunction(feature, resolution) {
        var level = feature.getProperties().level;
        var display = resolutions.find(function(r) {
            return (resolution < r.max && resolution >= r.min)
        });
        var displayLevel = display? display.level : [];
        var visible = (displayLevel.indexOf(level) > -1);
        var overlay = feature.getProperties().overlay;
        if(visible) {
            overlay.setPosition(feature.getProperties().position);
        } else {
            overlay.setPosition(null);
        }
        return visible ? pointStyle(feature) : undefined;
    }

    return KmapOvr;
}());

