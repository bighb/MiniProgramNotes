import {
  default as wxApis,
} from "./wx.apis";

import {
  default as env,
} from "../config/env";

import {
  getUserId,
  getUserOpenId
} from "./auth"
const {
  login: getCode,
  wxRequest,
  setStorageSync,
  getStorageSync
} = wxApis;

const {
  BASE_URL
} = env

let isLogining = false;
// TODO: 这是 独立于 封装 request 外的 wx.request 请求
const loginWithCode = () => getCode().then(code => {

  return new Promise((resolve, reject) => {
    if (getStorageSync("token")) {
      // 已经有token
      console.log("已经登录了:", getStorageSync("token"));
      resolve()
    } else if (isLogining) {
      console.log("已经有接口去登录了");
      // 正在登录中，请求轮询稍后，避免重复调用登录接口
      setTimeout(() => {
        loginWithCode()
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }, 500);
    } else {
      console.log("去登录");
      isLogining = true;
      wxRequest({
        method: 'POST',
        url: `${BASE_URL}/userservice/user/v1/wx/login`,
        data: {
          ...code,
          fregisteType: 1,
        },
        success: function (res) {
          if (res.statusCode === 500) {
            wx.showToast({
              title: "服务异常",
              icon: "none",
              duration: 2000,
            });
          }
          isLogining = false;
          if (res.data.code === '202000000') {
            const {
              data: {
                data: {
                  token
                }
              }
            } = res
            console.log("登录完成", token);
            setStorageSync("token", token);
            setStorageSync("isLogin", true);
            resolve()
            // 获取userId和openId
            // if (getStorageSync("userId") && getStorageSync("openid")) return
            getUserId().then(() => {
              getUserOpenId()
            })
          } else {
            reject(new Error('获取Token失败'))
          }

        },
        fail: function (err) {
          isLogining = false;
          reject(new Error('获取Token失败', err))
        },
        complete: function (res) {},
      })
    }

  })
}).catch(err => {
  isLogining = false;
})

export {
  loginWithCode
}