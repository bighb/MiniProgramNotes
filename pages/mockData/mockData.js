// pages/mockData/mockData.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("开始请求");
    let that = this;
    wx.request({
      url: "https://example.com/ajax?dataType=member",
      data: {}, // /
      dataType: "json",
      success(res) {
        console.log(res.data.list);
        that.setData({
          list: res.data.list,
        });
      },
      fail(err) {
        console.log(err);
      },
    });
  },

  toWeData(event) {
    let obj = event.currentTarget.dataset;
    console.log(event.currentTarget.dataset);
    wx.navigateTo({
      url: `/pages/weData/weData?name=${obj.name}`,
    });
  },
});
