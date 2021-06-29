Page({
  data: {
    logs: [],
  },
  onShow: function () {
    var logs = wx.getStorageSync("todo_logs");
    if (logs) {
      this.setData({ logs: logs.reverse() });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("res: ", res);
    let info = {
      name: "黄奔",
    };
    return {
      title: "送你一张权益卡",
      path: "/pages/logs/logs?info=" + JSON.stringify(info),
      imageUrl: "../../assets/logo.png",
    };
  },
});
