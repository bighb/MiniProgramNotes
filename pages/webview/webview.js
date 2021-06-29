// pages/components/webView/webView.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // decodeURIComponent 是防止url中包含多个？ 符号，导致解析失败
    if (options.url) {
      this.setData({
        url: decodeURIComponent(options.url),
      });
    }
  },
  getmessage(e) {
    let obj = e.detail.data[e.detail.data.length - 1];
    this.setData({
      testUrl: obj.url,
    });
  },

  onShareAppMessage: function (options) {
    return {
      path:
        "/pages/webView/webView?url=" + encodeURIComponent(options.webViewUrl),
    };
  },
});
