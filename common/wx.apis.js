// wx api wrapper

export default {
  //  调试相关
  getRealtimeLogManager: wx.getRealtimeLogManager ?
    wx.getRealtimeLogManager() :
    null,
  login: () => {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            resolve({
              code: res.code,
            });
          } else {
            reject(new Error("登录失败"));
          }
        },
      });
    });
  },
  getStorageSync: wx.getStorageSync,
  setStorageSync: wx.setStorageSync,
  removeStorageSync: wx.removeStorageSync,
  wxRequest: wx.request,
};