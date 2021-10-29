import * as echarts from "../../ec-canvas/echarts";

import {
  allCity
} from "./cityData.js";

const app = getApp();

Page({

  data: {
    myChart: null,
    echartsComponnet: "",
    geoJson: [],
    ec: {
      lazyLoad: true // 延迟加载
    },
    city: allCity,
    activate: 420100,
  },
  onLoad() {
    this.data.echartsComponnet = this.selectComponent("#mychart-dom-area");
    let that = this
    wx.request({
      url: 'https://prd-zywx-picture-1302439057.cos.ap-shanghai.myqcloud.com/wx/js/mapData.json', //
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          geoJson: res.data
        })
        that.init_echarts(); //初始化图表
      }
    })
  },
  //初始化图表
  init_echarts: function () {
    let that = this
    this.data.echartsComponnet.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr, // new
      });
      canvas.setChart(chart);
      echarts.registerMap("hubei", this.data.geoJson);
      const option = {
        toolbox: {
          show: false,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            dataView: {
              readOnly: false
            },
            restore: {},
            saveAsImage: {},
          },
        },
        series: [{
          type: "map",
          mapType: "hubei",
          selectedMode: 'single',
          label: {
            normal: {
              show: true,
            },
            emphasis: {
              textStyle: {
                color: "#fff",
                fontSize: '12px'
              },
            },
          },
          itemStyle: {
            normal: {
              borderColor: "#DBDADA",
              areaColor: "#fff",
            },
            emphasis: {
              areaColor: "yellow",
              borderWidth: 0,
            },
          },
          select: {
            itemStyle: {
              areaColor: "#b8d739",
              color: "#ffffff"
            },
          },
          animation: false,

          data: [],
        }, ],
      };
      chart.setOption(option);
      chart.on("click", function (params) {
        console.log('params.name: ', params.name);
        that.changeCity(params.name)
      });
      this.data.myChart = chart
      this.data.myChart.dispatchAction({
        type: 'select', // 高亮指定的数据图形。通过seriesName或者seriesIndex指定系列。如果要再指定某个数据可以再指定dataIndex或者name。
        name: '武汉'
      })
      return chart;
    })

  },
  changeCity(name) {

    this.data.myChart.dispatchAction({
      type: 'downplay', // 取消高亮指定的数据图形
    })
    this.data.myChart.dispatchAction({

      type: 'unselect', // 取消高亮指定的数据图形

    })
    this.data.myChart.dispatchAction({
      type: 'select', // 高亮指定的数据图形。通过seriesName或者seriesIndex指定系列。如果要再指定某个数据可以再指定dataIndex或者name。
      name: name
    })
    let item = allCity.find(e => {
      return e.text === name
    })
    this.data.activate = item.value
    this.setData({
      activate: this.data.activate
    })
  },
  changeMapCity(event) {
    this.data.activate = event.currentTarget.dataset.value
    this.setData({
      activate: this.data.activate
    })
    this.data.myChart.dispatchAction({
      type: 'unselect', // 取消高亮指定的数据图形

    })
    this.data.myChart.dispatchAction({
      type: 'select', // 高亮指定的数据图形。通过seriesName或者seriesIndex指定系列。如果要再指定某个数据可以再指定dataIndex或者name。
      name: event.currentTarget.dataset.name
    })
  }
});