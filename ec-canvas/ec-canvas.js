import WxCanvas from "./wx-canvas";
import * as echarts from "./echarts";

let ctx;

function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

Component({
  properties: {
    canvasId: {
      type: String,
      value: "ec-canvas",
    },

    ec: {
      type: Object,
    },

    forceUseOldCanvas: {
      type: Boolean,
      value: false,
    },
  },

  data: {},

  ready: function () {
    // Disable prograssive because drawImage doesn't support DOM as parameter
    // See https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html
    echarts.registerPreprocessor((option) => {
      if (option && option.series) {
        if (option.series.length > 0) {
          option.series.forEach((series) => {
            series.progressive = 0;
          });
        } else if (typeof option.series === "object") {
          option.series.progressive = 0;
        }
      }
    });

    if (!this.data.ec) {
      console.warn(
        '组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" ' +
          'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>'
      );
      return;
    }

    if (!this.data.ec.lazyLoad) {
      this.init();
    }
  },

  methods: {
    canvasIdErrorCallback: function (e) {
      console.log("canvasIdErrorCallback: ", e);
      console.error(e.detail.errMsg);
    },
    init: function (callback) {
      const version = wx.getSystemInfoSync().SDKVersion;
      const canUseNewCanvas = compareVersion(version, "2.9.0") >= 0;
      const forceUseOldCanvas = this.data.forceUseOldCanvas;
      this.initByNewWay(callback);
    },

    initByOldWay(callback) {
      // 1.9.91 <= version < 2.9.0：原来的方式初始化
      ctx = wx.createCanvasContext(this.data.canvasId, this);
      const canvas = new WxCanvas(ctx, this.data.canvasId, false);

      echarts.setCanvasCreator(() => {
        return canvas;
      });
      // const canvasDpr = wx.getSystemInfoSync().pixelRatio // 微信旧的canvas不能传入dpr
      const canvasDpr = 1;
      var query = wx.createSelectorQuery().in(this);
      query
        .select(".ec-canvas")
        .boundingClientRect((res) => {
          if (typeof callback === "function") {
            this.chart = callback(canvas, res.width, res.height, canvasDpr);
          } else if (
            this.data.ec &&
            typeof this.data.ec.onInit === "function"
          ) {
            this.chart = this.data.ec.onInit(
              canvas,
              res.width,
              res.height,
              canvasDpr
            );
          } else {
            this.triggerEvent("init", {
              canvas: canvas,
              width: res.width,
              height: res.height,
              canvasDpr: canvasDpr, // 增加了dpr，可方便外面echarts.init
            });
          }
        })
        .exec();
    },

    initByNewWay(callback) {
      // version >= 2.9.0：使用新的方式初始化
      const query = wx.createSelectorQuery().in(this);
      query
        .select(".ec-canvas")
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          const canvasNode = res[0].node;
          this.canvasNode = canvasNode;

          const canvasDpr = wx.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;

          const ctx = canvasNode.getContext("2d");

          const canvas = new WxCanvas(
            ctx,
            this.data.canvasId,
            true,
            canvasNode
          );
          echarts.setCanvasCreator(() => {
            return canvas;
          });

          if (typeof callback === "function") {
            this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr);
          } else if (
            this.data.ec &&
            typeof this.data.ec.onInit === "function"
          ) {
            this.chart = this.data.ec.onInit(
              canvas,
              canvasWidth,
              canvasHeight,
              canvasDpr
            );
          } else {
            this.triggerEvent("init", {
              canvas: canvas,
              width: canvasWidth,
              height: canvasHeight,
              dpr: canvasDpr,
            });
          }
        });
    },
    canvasToTempFilePath(opt) {
      // 新版
      const query = wx.createSelectorQuery().in(this);
      query
        .select(".ec-canvas")
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          const canvasNode = res[0].node;
          opt.canvas = canvasNode;
          wx.canvasToTempFilePath(opt);
        });
    },

    touchStart(e) {
      if (this.chart && e.touches.length > 0) {
        // !? 修复真机echarts无法点击二次的bug (源码是  var touch = e.touches[0];)
        var touch = e.touches[e.touches.length - 1];
        var handler = this.chart.getZr().handler;
        handler.dispatch("mousedown", {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.dispatch("mousemove", {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.processGesture(wrapTouch(e), "start");
      }
    },

    touchEnd(e) {
      if (this.chart) {
        const touch = e.changedTouches ? e.changedTouches[0] : {};
        var handler = this.chart.getZr().handler;
        handler.dispatch("mouseup", {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.dispatch("click", {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.processGesture(wrapTouch(e), "end");
      }
    },
  },
});

function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}
