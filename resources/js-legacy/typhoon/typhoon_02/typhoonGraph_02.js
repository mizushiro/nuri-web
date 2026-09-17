var GraphManager = function() {

  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  var charts = {
    chart1: {
      type: 'line',
      plotBackgroundColor: '#FFFFFF',
      plotShadow: true,
      margin: [25, 32, 27, 43] //marginTop, marginRight, marginBottom and marginLeft
    },

    chart2: {
      type: 'line',
      plotBackgroundColor: '#FFFFFF',
      plotShadow: true,
      margin: [25, 50, 27, 50] //marginTop, marginRight, marginBottom and marginLeft
    },

    chart3: {
      type: 'line',
      plotBackgroundColor: '#FFFFFF',
      plotShadow: true,
      margin: [25, 60, 27, 50] //marginTop, marginRight, marginBottom and marginLeft
    }

  };

  var yAxisTitleStyles = {
    style1: {
      color: "gray",
      fontSize: 6
    },

    style2: {
      color: "gray",
      fontSize: 12
    }
  };

  var subtitleStyle = {
    fontWeight: 'bold'
  };

  var dateTimeLabelFormats = {
    millisecond: '%H:%M:%S.%L',
    second: '%H:%M:%S',
    minute: '%H:%M',
    hour: '%H:%M',
    day: '%m. %d',
    week: '%m. %d',
    month: '%m \'%Y',
    year: '%Y'
  };

  var exportFormat = {
    enabled: false
  };


  function zeroToNull(val) {
    return val == 0 ? null : val;
  }
  ;

  function tooltip(x, y, title, color) {
    var date = new Date(x);
    var timestamp = date.yyyymmddhhmi();
    var displayTime = typhoonLang.msg('graph.0023').format(timestamp.substring(0, 4)
      , timestamp.substring(4, 6)
      , timestamp.substring(6, 8)
      , timestamp.substring(8, 10));

    var displayTitle = title;
    displayTitle = displayTitle.substring(0, displayTitle.indexOf("("));

    var format = '<span style="font-size:11px;">' + displayTime + '<br/></span>'
      + '<span style="fill:' + color + '" x="8" dy="15">●</span>'
      + '<span dx="0"> ' + displayTitle + ': </span>'
      + '<span style="font-weight:bold" dx="0">' + y + '</span>';
    return format;
  }
  ;

  function getTitle(chartId, title) {
    return "<a href='javascript:;' id='viewBtn" + chartId + "' title='" + typhoonLang.msg('graph.0019') + "' style=''>" + title + "</a>";
  }


  function download(chartId) {
    var useLocalDecimalPoint = false;
    var jThis = $("#viewBtn" + chartId);
    var c = $('#' + chartId).highcharts();

    jThis.click(function(event) {
      //c.exportChartLocal({ type: Highcharts.exporting.MIME_TYPES.XLS });
      event.preventDefault();

      //초기화
      $('.graphDetailLayer .tit a').trigger("click");

      var aTag = $(c.subtitle.alignOptions.text);
      $(".graphDetailLayer .tit h1").text(aTag.text());

      var rows = c.getDataRows();

      var html = '';
      html += '<table class="table_midterm">'
        + '<thead>'
        + '<tr>';

      for (var i = 0 ; i < rows[0].length ; i++) {
        var width = "";
        var val = rows[0][i];

        if (i == 0) {
          width = "130px";
          val = typhoonLang.msg('graph.0022');
        } else if (rows[0].length > 2 && i == 1) {
          width = "113px";
        }
        html += '<th id="t' + i + '" width="' + width + '">' + val + '</th>';
      }

      html += '</tr>'
        + '</thead>'
        + '</table>'
        + '<div class="scroll" tabindex="0">'
        + '<table class="table_midterm">'
        + '<tbody>';

      // Transform the rows to HTML
      Highcharts.each(rows, function(row, i) {

        if (i > 0) {

          var tag = 'td',
            val,
            j,
            n = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.';

          html += '<tr>';

          for (j = 0; j < row.length; j = j + 1) {
            val = row[j] == null ? "-" : row[j];

            var width = "";

            if (j == 0) {
              val = val.substring(0, 16);
              width = "130px";
            } else if (row.length > 2 && j == 1) {
              width = "113px";
            }
            // Add the cell
            if (typeof val === 'number') {
              if (n === ',') {
                html += '<' + tag + (typeof val === 'number' ? ' class="number"' : '') + ' headers="t' + j + '" width="' + width + '">' + val.toString().replace(".", ",") + '</' + tag + '>';
              } else {
                html += '<' + tag + (typeof val === 'number' ? ' class="number"' : '') + ' headers="t' + j + '" width="' + width + '">' + val.toString() + '</' + tag + '>';
              }
            } else {
              html += '<' + tag + ' headers="t' + j + '" width="' + width + '">' + val + '</' + tag + '>';
            }
          }

          html += '</tr>';
        }

      });
      html += '</tbody></table></div></table>';

      $(".graphDetailLayer").append(html).css('display', 'block');
    });

  }
  ;

  this.showWs = function(item, chartId, optNum1, optNum2) {

    var maxWs = 0;
    var maxPs = 0;
    var pinIdx = 0;
    var startLine = 0;
    var datas = [];
    var datasPs = [];

    for (var i = 0 ; i < item.centers.length ; i++) {
      var info = item.centers[i].get("info");
      var data = [];
      var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate.getTime() : info.tmDate.getTime();

      data.push(tmDate);
      data.push(zeroToNull(info.ws));
      datas.push(data);
      datasPs.push([tmDate, zeroToNull(info.ps)]);

      // 현재
      if (info.tmTp == 'C') {
        pinIdx = tmDate;
      }

      // 시작 라인
      if (i == 0) {
        startLine = tmDate;
      }

      if (info.ps > 0 && maxPs < info.ps) {
        maxPs = info.ps;
      }

      if (info.ws > 0 && maxWs < info.ws) {
        maxWs = info.ws;
      }

    } //for



    var intervalWs = Math.ceil((maxWs / 4) / 10) * 10;
    var intervalPs = Math.ceil((maxPs / 4) / 10) * 10;
    intervalPs += intervalPs % intervalWs;


    $('#' + chartId).highcharts({

      chart: charts["chart" + optNum1],

      title: {
        text: null
      },
      subtitle: {
        useHTML: true,
        text: getTitle(chartId, typhoonLang.msg('graph.0001')),
        style: subtitleStyle,
        y: -1.5
      },

      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [{
          value: startLine,
          width: 1,
          color: '#d0d0d0',
        }, {
          value: pinIdx,
          width: 1,
          color: 'rgba(68, 170, 213, .2)'
        }],
        type: 'datetime',
        dateTimeLabelFormats: dateTimeLabelFormats,
        plotBands: [{ // visualize the weekend
          from: pinIdx,
          to: datas[datas.length - 1][0],
          color: 'rgba(68, 170, 213, .2)'
        }]
      },
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: typhoonLang.msg('graph.0002'),
            style: yAxisTitleStyles['style' + optNum2],
            x: -20
          },
          gridLineWidth: 0,
          tickInterval: intervalWs,
          minorGridLineWidth: 0,
          minorTickInterval: intervalWs,
          minorTickLength: 4,
          minorTickWidth: 1,
          minorTickColor: '#d8d8d8',
          labels: {
            align: 'left',
            x: -23,
            format: '{value}',
            style: {
              color: "gray"
            }
          },
          showFirstLabel: false,
          plotLines: [
            {
              value: 17,
              color: 'orange',
              width: 1,
              label: {
                text: typhoonLang.msg('graph.0003'),
                align: 'left',
                style: {
                  color: 'orange'
                }

              }
            }, {
              value: 25,
              color: 'orange',
              width: 1,
              label: {
                text: typhoonLang.msg('graph.0004'),
                align: 'left',
                style: {
                  color: 'orange'
                }
              }
            }, {
              value: 33,
              color: 'orange',
              width: 1,
              label: {
                text: typhoonLang.msg('graph.0005'),
                align: 'left',
                style: {
                  color: 'orange'
                }
              }
            }, {
              value: 44,
              color: 'orange',
              width: 1,
              label: {
                text: typhoonLang.msg('graph.0006'),
                align: 'left',
                style: {
                  color: 'orange'
                }
              }
            }]
        },
        { // Secondary yAxis
          title: {
            text: typhoonLang.msg('graph.0007'),
            style: yAxisTitleStyles['style' + optNum2],
            x: -7
          },
          gridLineWidth: 0,
          tickInterval: intervalPs,
          minorGridLineWidth: 0,
          minorTickInterval: intervalPs,
          minorTickLength: 6,
          minorTickWidth: 1,
          minorTickColor: '#d8d8d8',
          labels: {
            align: 'left',
            x: 10,
            format: '{value}',
            style: {
              color: 'gray'
            }
          },
          opposite: true
        }],
      tooltip: {
        formatter: function() {
          var unit = this.series.index == 0 ? '㎧' : 'hPa';
          return tooltip(this.x, this.y + unit, this.series.name, this.series.color);
        }
      },
      legend: {
        enabled: false

      },
      credits: {
        enabled: false
      },
      series: [{
        name: typhoonLang.msg('graph.0020'),
        type: 'spline',
        yAxis: 0,
        color: Highcharts.getOptions().colors[0],
        data: datas
      }, {
        name: typhoonLang.msg('graph.0021'),
        type: 'spline',
        yAxis: 1,
        color: "#FC73B0",
        data: datasPs
      }],
      exporting: exportFormat
    });


    download(chartId);
  };

  this.showRad = function(item, chartId, optNum1, optNum2) {

    var max = 0;
    var pinIdx = 0;
    var startLine = 0;
    var datas = [];

    for (var i = 0 ; i < item.centers.length ; i++) { 
      var info = item.centers[i].get("info");
      var data = [];
      var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate.getTime() : info.tmDate.getTime();
      var rad15 = info.rad15.toNumber();
      data.push(tmDate);
      data.push(zeroToNull(rad15));
      datas.push(data);

      // 현재
      if (info.tmTp == 'C') {
        pinIdx = tmDate ;
      }

      // 시작 라인
      if (i == 0) {
        startLine = tmDate;
      }

      if (rad15 > 0 && max < rad15) {
        max = rad15;
      }

    } //for

    var interval = Math.ceil((max / 4) / 10) * 10;

    $('#' + chartId).highcharts({

      chart: charts["chart" + optNum1],

      title: {
        text: null
      },
      subtitle: {
        useHTML: true,
        text: getTitle(chartId, typhoonLang.msg('graph.0010')),
        style: subtitleStyle,
        y: -1.5
      },

      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [{
          value: startLine,
          width: 1,
          color: '#d0d0d0',
        }, {
          value: pinIdx,
          width: 1,
          color: 'rgba(68, 170, 213, .2)'
        }],
        type: 'datetime',
        dateTimeLabelFormats: dateTimeLabelFormats,
        plotBands: [{ // visualize the weekend
          from: pinIdx,
          to: datas[datas.length - 1][0],
          color: 'rgba(68, 170, 213, .2)'
        }]
      },
      yAxis: { // left y axis
        title: {
          text: typhoonLang.msg('graph.0011'),
          style: yAxisTitleStyles['style' + optNum2],
          x: -22
        },
        gridLineWidth: 0,
        tickInterval: interval,
        minorGridLineWidth: 0,
        minorTickInterval: interval,
        minorTickLength: 4,
        minorTickWidth: 1,
        minorTickColor: '#d8d8d8',
        labels: {
          align: 'left',
          x: -29,
          format: '{value}',
          style: {
            color: 'gray'
          }
        },
        showFirstLabel: false,
        plotLines: [{
          value: 0,
          color: 'orange',
          width: 1,
          label: {
            text: typhoonLang.msg('graph.0012'),
            align: 'left',
            style: {
              color: 'orange'
            }
          }
        }, {
          value: 300,
          color: 'orange',
          width: 1,
          label: {
            text: typhoonLang.msg('graph.0013'),
            align: 'left',
            style: {
              color: 'orange'
            }
          }
        }, {
          value: 500,
          color: 'orange',
          width: 1,
          label: {
            text: typhoonLang.msg('graph.0014'),
            align: 'left',
            style: {
              color: 'orange'
            }
          }
        }, {
          value: 800,
          color: 'orange',
          width: 1,
          label: {
            text: typhoonLang.msg('graph.0015'),
            align: 'left',
            style: {
              color: 'orange'
            }
          }
        }]
      },
      tooltip: {
        formatter: function() {
          return tooltip(this.x, this.y + '㎞', this.series.name, this.series.color);
        }
      },
      legend: {
        enabled: false

      },
      credits: {
        enabled: false
      },
      series: [{
        name: typhoonLang.msg('graph.0011'),
        color: Highcharts.getOptions().colors[4],
        data: datas,
        zIndex: 1
      }],
      exporting: exportFormat
    });

    download(chartId);
  };

  this.showSp = function(item, chartId, optNum1, optNum2) {

    var max = 0;
    var pinIdx = 0;
    var startLine = 0;
    var datas = [];
    for (var i = 0 ; i < item.centers.length ; i++) {
      var info = item.centers[i].get("info");
      var data = [];
      var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate.getTime() : info.tmDate.getTime();

      data.push(tmDate);
      data.push(zeroToNull(info.sp));
      datas.push(data);

      // 현재
      if (info.tmTp == 'C') {
        pinIdx = tmDate;
      }

      // 시작 라인
      if (i == 0) {
        startLine = tmDate;
      }

      if (info.sp > 0 && max < info.sp) {
        max = info.sp;
      }
    } //for

    var interval = Math.ceil((max / 4) / 10) * 10;

    $('#' + chartId).highcharts({

      chart: charts["chart" + optNum1],

      title: {
        text: null
      },
      subtitle: {
        useHTML: true,
        text: getTitle(chartId, typhoonLang.msg('graph.0016')),
        style: subtitleStyle,
        y: -1.5
      },

      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [{
          value: startLine,
          width: 1,
          color: '#d0d0d0',
        }, {
          value: pinIdx,
          width: 1,
          color: 'rgba(68, 170, 213, .2)'
        }],
        type: 'datetime',
        dateTimeLabelFormats: dateTimeLabelFormats,
        plotBands: [{ // visualize the weekend
          from: pinIdx,
          to: datas[datas.length - 1][0],
          color: 'rgba(68, 170, 213, .2)'
        }]
      },
      yAxis: { // left y axis
        title: {
          text: typhoonLang.msg('graph.0017'),
          style: yAxisTitleStyles['style' + optNum2],
          x: -22
        },
        gridLineWidth: 0,
        tickInterval: interval,
        minorGridLineWidth: 0,
        minorTickInterval: interval,
        minorTickLength: 4,
        minorTickWidth: 1,
        minorTickColor: '#d8d8d8',
        labels: {
          align: 'left',
          x: -29,
          format: '{value}',
          style: {
            color: 'gray'
          }
        },
        showFirstLabel: false
      },
      tooltip: {
        formatter: function() {
          return tooltip(this.x, this.y + '㎞/h', this.series.name, this.series.color);
        }
      },
      legend: {
        enabled: false

      },
      credits: {
        enabled: false
      },
      series: [{
        name: typhoonLang.msg('graph.0017'),
        color: "#90D29F",
        data: datas,
        zIndex: 1
      }],
      exporting: exportFormat
    });

    download(chartId);
  };

  this.showWsTd = function(item, chartId, optNum1, optNum2) {
    var pinIdx = 0;
    var startLine = 0;
    var datas = [];
    for (var i = 0 ; i < item.centers.length ; i++) {
      var info = item.centers[i].get("info");
      var data = [];
      var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate.getTime() : info.tmDate.getTime();

      data.push(tmDate);
      data.push(zeroToNull(info.ws));
      datas.push(data);

      // 현재
      if (info.tmTp == 'C') {
        pinIdx = tmDate;
      }

      // 시작 라인
      if (i == 0) {
        startLine = tmDate;
      }
    } //for

    $('#' + chartId).highcharts({

      chart: charts["chart" + optNum1],

      title: {
        text: null
      },
      subtitle: {
        useHTML: true,
        text: getTitle(chartId, typhoonLang.msg('graph.0018')),
        style: subtitleStyle,
        y: -1.5
      },

      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [{
          value: startLine,
          width: 1,
          color: '#d0d0d0',
        }, {
          value: pinIdx,
          width: 1,
          color: 'rgba(68, 170, 213, .2)'
        }],
        type: 'datetime',
        dateTimeLabelFormats: dateTimeLabelFormats,
        plotBands: [{ // visualize the weekend
          from: pinIdx,
          to: datas[datas.length - 1][0],
          color: 'rgba(68, 170, 213, .2)'
        }]
      },
      yAxis: { // left y axis
        title: {
          text: typhoonLang.msg('graph.0002'),
          style: yAxisTitleStyles['style' + optNum2],
          x: -15
        },
        gridLineWidth: 0,
        tickInterval: 5,
        minorGridLineWidth: 0,
        minorTickInterval: 5,
        minorTickLength: 7,
        minorTickWidth: 1,
        minorTickColor: '#d8d8d8',
        labels: {
          align: 'left',
          x: -20,
          format: '{value}',
          style: {
            color: 'gray'
          }
        },
        showFirstLabel: false
      },
      tooltip: {
        formatter: function() {
          return tooltip(this.x, this.y + '㎧', this.series.name, this.series.color);
        }
      },
      legend: {
        enabled: false

      },
      credits: {
        enabled: false
      },
      series: [{
        name: typhoonLang.msg('graph.0002'),
        type: 'spline',
        data: datas
      }],
      exporting: exportFormat
    });

    download(chartId);
  };

  this.showSpTd = function(item, chartId, optNum1, optNum2) {


    var pinIdx = 0;
    var startLine = 0;
    var datas = [];
    for (var i = 0 ; i < item.centers.length ; i++) {
      var info = item.centers[i].get("info");
      var data = [];
      var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate.getTime() : info.tmDate.getTime();

      data.push(tmDate);
      data.push(zeroToNull(info.sp));
      datas.push(data);

      // 현재
      if (info.tmTp == 'C') {
        pinIdx = tmDate;
      }

      // 시작 라인
      if (i == 0) {
        startLine = tmDate;
      }
    } //for

    $('#' + chartId).highcharts({

      chart: charts["chart" + optNum1],

      title: {
        text: null
      },
      subtitle: {
        useHTML: true,
        text: getTitle(chartId, typhoonLang.msg('graph.0016')),
        style: subtitleStyle,
        y: -1.5
      },

      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [{
          value: startLine,
          width: 1,
          color: '#d0d0d0',
        }, {
          value: pinIdx,
          width: 1,
          color: 'rgba(68, 170, 213, .2)'
        }],
        type: 'datetime',
        dateTimeLabelFormats: dateTimeLabelFormats,
        plotBands: [{ // visualize the weekend
          from: pinIdx,
          to: datas[datas.length - 1][0],
          color: 'rgba(68, 170, 213, .2)'
        }]
      },
      yAxis: { // left y axis
        title: {
          text: typhoonLang.msg('graph.0017'),
          style: yAxisTitleStyles['style' + optNum2],
          x: -15
        },
        gridLineWidth: 0,
        tickInterval: 5,
        minorGridLineWidth: 0,
        minorTickInterval: 5,
        minorTickLength: 7,
        minorTickWidth: 1,
        minorTickColor: '#d8d8d8',
        labels: {
          align: 'left',
          x: -20,
          color: 'gray',
          format: '{value}'
        },
        showFirstLabel: false
      },
      tooltip: {
        formatter: function() {
          return tooltip(this.x, this.y + '㎞/h', this.series.name, this.series.color);
        }
      },
      legend: {
        enabled: false

      },
      credits: {
        enabled: false
      },
      series: [{
        name: typhoonLang.msg('graph.0017'),
        color: Highcharts.getOptions().colors[3],
        data: datas,
        zIndex: 1
      }],
      exporting: exportFormat
    });

    download(chartId);
  };



};
