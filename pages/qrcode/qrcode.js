import drawQrcode from "../../utils/weapp.qrcode.min.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: "myQrcode",
      // ctx: wx.createCanvasContext('myQrcode'),
      text: "https://github.com/yingye",
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        imageResource: "../../images/icon.png",
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60,
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
