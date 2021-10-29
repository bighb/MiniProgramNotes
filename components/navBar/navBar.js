const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        background: {
            type: String,
            value: 'white'
        },
        color: {
            type: String,
            value: 'rgba(0, 0, 0, 1)'
        },
        textStyle: {
            type: String,
            value: ''
        },
        titleText: {
            type: String,
            value: ''
        },
        titlePosition: {
            type: String,
            value: 'center'
        },
        titleImg: {
            type: String,
            value: ''
        },
        backIcon: {
            type: String,
            value: '/images/icon/back_black.png'
        },
        homeIcon: {
            type: String,
            value: '/images/icon/nav_home.png'
        },
        backAndHome: {
            type: Object,
            value: {
                backimg: '/images/icon/back_home/back_black.png',
                homeimg: '/images/icon/back_home/home_black.png'
            }
        },
        isTabBar: {
            type: Boolean,
            value: false
        },
        showBack: {
            type: Boolean,
            value: true
        },
        showHome: {
            type: Boolean,
            value: false
        },
        fontSize: {
            type: Number,
            value: 36
        },
        iconHeight: {
            type: Number,
            value: 19
        },
        iconWidth: {
            type: Number,
            value: 58
        },
        // 自定义滚动之后的颜色，非必填
        customScrollStyle: {
            type: Object,
            value: {}
        },
        defaultHeightToTop: {
            type: Number,
            value: 100
        }
    },
    attached: function () {
        var that = this;
        that.setNavSize();
        that.setStyle();
        if (that.data.background === 'white') {
            that.changeNavColor('black')
            that.setData({
                backIcon: '/images/icon/back_black.png'
            })
        } else if (that.data.background === 'transparent') {
            that.changeNavColor('white')
            that.setData({
                backIcon: '/images/icon/transparent_backIcon.png',
                homeIcon: '/images/icon/transparent_home.png',
                backAndHome: {
                    backimg: '/images/icon/back_home/back_.png',
                    homeimg: '/images/icon/back_home/_home.png'
                }
            })
        } else {
            that.changeNavColor('white')
            that.setData({
                backIcon: '/images/icon/arrow_left_white.png'
            })
        }
    },

    data: {
        showHome: false
    },
    pageLifetimes: {
        show: function () {
            if (this.data.showHome) {
                this.setData({
                    showHome: true
                })
            } else {
                const pages = getCurrentPages();
                const currentPage = pages[pages.length - 1]
                if (pages.length === 0) {
                    this.setData({
                        showBack: false,
                        showHome: app.globalData.navShowHome
                    })
                } else if (currentPage.route === 'pages/home/home') {
                    this.setData({
                        showHome: false,
                    })
                } else if (pages.length === 1) {
                    this.setData({
                        showBack: false,
                        showHome: true
                    })
                } else {
                    this.setData({
                        showBack: true,
                        showHome: app.globalData.navShowHome
                    })
                }
                console.log('back==' + this.data.showBack, 'home===' + this.data.showHome);
            }
        }
    },
    methods: {
        // 通过获取系统信息计算导航栏高度
        setNavSize: function () {
            var that = this,
                sysinfo = wx.getSystemInfoSync(),
                statusHeight = sysinfo.statusBarHeight,
                isiOS = sysinfo.system.indexOf('iOS') > -1,
                navHeight;
            if (!isiOS) {
                navHeight = 48;
            } else {
                navHeight = 44;
            }
            that.setData({
                status: statusHeight,
                navHeight: navHeight
            })
        },
        setStyle: function () {
            var that = this,
                containerStyle, textStyle, iconStyle;
            containerStyle = [
                'background:' + that.data.background
            ].join(';');
            textStyle = [
                'color:' + that.data.color,
                'font-size:' + that.data.fontSize + 'rpx', 'font-weight:blod'
            ].join(';');
            iconStyle = [
                'width: ' + that.data.iconWidth + 'px',
                'height: ' + that.data.iconHeight + 'px',
            ].join(';');
            that.setData({
                containerStyle: containerStyle,
                textStyle: textStyle,
                iconStyle: iconStyle
            })
        },
        // 返回事件
        back: function () {
            wx.navigateBack({
                delta: 1,
                fail: function (err) {
                    wx.switchTab({
                        url: '/pages/home/home',
                    })
                }
            })
            this.triggerEvent('back', {
                back: 1
            })

        },
        home: function () {
            app.globalData.navShowHome = false
            wx.switchTab({
                url: '/pages/home/home',
            })
        },
        // 动态修改背景颜色
        onPageScroll: function (e) {
            const heightToTop = e.scrollTop
            if (heightToTop > this.data.defaultHeightToTop) {
                // 这里扩展需求，根据自定义颜色来控制滚动后的导航栏和状态栏颜色
                if (JSON.stringify(this.data.customScrollStyle) !== "{}") {
                    const {
                        background,
                        color,
                        changeNavColor,
                        backIcon
                    } = this.data.customScrollStyle
                    this.data.containerStyle = [
                        'background:' + background,
                    ].join(';');
                    this.data.textStyle = [
                        'color:' + color
                    ].join(';');
                    this.setData({
                        containerStyle: this.data.containerStyle,
                        backIcon: backIcon === 'white' ? '/images/icon/arrow_left_white.png' : '/images/icon/back_black.png',
                        textStyle: this.data.textStyle
                    })
                    this.changeNavColor(changeNavColor)
                } else {
                    this.data.containerStyle = [
                        'background:' + 'white',
                    ].join(';');
                    this.data.textStyle = [
                        'color:' + 'black'
                    ].join(';');
                    // 单独判断背景透明的情况
                    if (this.data.background === 'transparent') {
                        console.log('透明');
                        this.setData({
                            containerStyle: this.data.containerStyle,
                            backIcon: '/images/icon/back_black.png',
                            homeIcon: '/images/icon/nav_home.png',
                            textStyle: this.data.textStyle,
                            backAndHome: {
                                backimg: '/images/icon/back_home/back_black.png',
                                homeimg: '/images/icon/back_home/home_black.png'
                            }
                        })
                    } else {
                        this.setData({
                            containerStyle: this.data.containerStyle,
                            backIcon: '/images/icon/back_black.png',
                            homeIcon: '/images/icon/nav_home.png',
                            textStyle: this.data.textStyle
                        })
                    }

                    this.changeNavColor('black')
                }

            } else {
                this.data.containerStyle = [
                    'background:' + 'transparent'
                ].join(';');
                this.data.textStyle = [
                    'color:' + this.data.color
                ].join(';');
                // 单独判断背景透明的情况
                if (this.data.background === 'transparent') {
                    this.setData({
                        containerStyle: this.data.containerStyle,
                        backIcon: '/images/icon/transparent_backIcon.png',
                        homeIcon: '/images/icon/transparent_home.png',
                        textStyle: this.data.textStyle,
                        backAndHome: {
                            backimg: '/images/icon/back_home/back_.png',
                            homeimg: '/images/icon/back_home/_home.png'
                        }
                    })
                } else {
                    this.setData({
                        containerStyle: this.data.containerStyle,
                        backIcon: '/images/icon/arrow_left_white.png',
                        homeIcon: '/images/icon/nav_home.png',
                        textStyle: this.data.textStyle
                    })
                }

                this.changeNavColor('white')
            }
        },
        changeNavColor: function (color) {
            color = color === 'white' ? '#ffffff' : '#000000'
            wx.setNavigationBarColor({
                frontColor: color,
                backgroundColor: color
            })
        }

    }
})