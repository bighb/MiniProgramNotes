Page({
  /**
   * 页面的初始数据
   */
  data: {},
  onLoad(){
    console.log("开始请求");
    wx.request({
      url: "https://example.com/ajax?dataType=member",
      data: {}, // /
      dataType: "json",
      success(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      },
    });
  }
});
