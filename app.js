// 需要显示home的场景值
const showHomeButtonScenes = [
  1007, // 单聊分享卡片
  1008, // 群聊分享卡片
  1011,
  1012,
  1013,
  1020, // 公众号 profile 页相关小程序列表
  1035, // 公众号自定义菜单
  1036,
  1043, // 公众号模板消息
  1047,
  1048,
  1049,
  1058, // 公众号文章
  1065, // url
  1067, // 公众号文章广告
  1082, // 公众号会话下发的文字链
  1091, // 公众号文章商品卡片
  1167, // 开放标签
  1102, //公众号 profile 页服务预览
];
App({
  /**
   * 实时监测当前页面路由的栈，判断自定义导航栏的home back图标显示
   */
  onShow: async function (options) {
    const { scene } = options;
    const pages = getCurrentPages();
    const index = pages.findIndex((page) => page.route === "pages/home/home");
    if (index === -1 && showHomeButtonScenes.includes(scene)) {
      // 表示当前路由没有home
      this.globalData.navShowHome = true;
    } else {
      // 表示当前路由没有home
      this.globalData.navShowHome = false;
    }
  },

  onLaunch: async function () {
    // 机型判断
    this.setNavSize();
    this.autoUpdate();
  },

  autoUpdate: function () {
    var self = this;
    // 获取小程序更新机制兼容
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: "更新提示",
            content: "检测到新版本，是否下载新版本并重启小程序？",
            success: function (res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                self.downLoadAndUpdate(updateManager);
              } else if (res.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: "温馨提示~",
                  content:
                    "本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~",
                  showCancel: false, //隐藏取消按钮
                  confirmText: "确定更新", //只保留确定更新按钮
                  success: function (res) {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      self.downLoadAndUpdate(updateManager);
                    }
                  },
                });
              }
            },
          });
        }
      });
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  },

  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function (updateManager) {
    var self = this;
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading();
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate();
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.hideLoading();
      wx.showModal({
        title: "已经有新版本了哟~",
        content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
      });
    });
  },
  //   机型判断
  setNavSize() {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf("iOS") > -1,
      navHeight,
      // 判断是否为iPhoneX
      screenHeight = sysinfo.screenHeight,
      bottom = sysinfo.safeArea.bottom,
      isIPhoneX = screenHeight !== bottom;
    if (!isiOS) {
      navHeight = 48;
    } else {
      navHeight = 44;
      // 是ios再判断
      if (isIPhoneX) {
        this.globalData.bottomSafeHeight = screenHeight - bottom;
      } else {
        this.globalData.bottomSafeHeight = 0;
      }
    }
    this.globalData.navHeight = navHeight;
    this.globalData.status = statusHeight;
    this.globalData.toTop = navHeight + statusHeight;
    this.globalData.isIPhoneX = isIPhoneX;
  },
  globalData: {
    userInfo: null,
    navShowHome: false,
    bgImg: "", // 顶部背景图片
    navHeight: "",
    status: "",
    toTop: "",
    bottomSafeHeight: 0, // 底部安全距离
    isIPhoneX: false,
  },
});
