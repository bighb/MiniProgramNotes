import api from "../api/index";


// 获取用户openid
function getUserOpenId() {
    return new Promise((resolve, reject) => {
        let sendData = {
            userId: wx.getStorageSync("userId"),
        };
        api.getUserOpenIdApi(sendData).then((res) => {
            if (res.msg === "success") {
                let openid = res.data.openId
                wx.setStorageSync("openid", openid);
                resolve();
            } else {
                reject();
            }
        });
    });
}

// 获取用户标识
function getUserId() {
    return new Promise((resolve, reject) => {
        api.getUserIdApi().then((res) => {
            if (res.msg === "success") {
                let userId = res.data.userId;
                wx.setStorageSync("userId", userId);
                resolve();
            } else {
                reject();
            }
        })
    });
}
// 获取小程序全局配置
function getConfigureInfo() {
    return new Promise((resolve, reject) => {
        api.getConfigure().then((res) => {
            if (res.success) {
                wx.setStorageSync('config', res.result)
                wx.setStorageSync('healthCode', res.result && res.result.healthCode === 'true')
                resolve();
            } else {
                reject();
            }
        })
    });
}
export {
    getUserId,
    getUserOpenId,
    getConfigureInfo
};