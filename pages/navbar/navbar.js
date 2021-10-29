const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //页面状态栏高度
    toTop: app.globalData.toTop,
  },
  // 页面滚动时
  onPageScroll(e) {
    const child = this.selectComponent("#navBar");
    child.onPageScroll(e);
  },
});
