import env from "../config/env";
import crypto from "../utils/crypto"

const {
  BASE_URL
} = env;

import {
  rtLogger,
  stagingLogger
} from "../utils/logger";

import {
  default as wxApis
} from "./wx.apis";

const {
  getStorageSync,
  removeStorageSync,
  wxRequest
} = wxApis

import {
  loginWithCode
} from './login'

const clearToken = () => {
  removeStorageSync("token");
}

const state = {
  isLoginInProgress: false,
  isLogin: getStorageSync("token") ? true : false
};

const updateState = (key, value) => {
  state[key] = value;
};

const getState = (key) => {
  return state[key];
};

// 等待登录
const waitForLogin = (loopInterval = 100) => {
  return new Promise(function (resolve, reject) {
    const interval = setInterval(function () {
      if (!getState("isLoginInProgress")) {
        clearInterval(interval);
        resolve();
      }
    }, loopInterval);
  });
};

const getRequest = (httpRequestMethod) => (
  url,
  data,
  queryString = "",
  baseUrl = BASE_URL
) => {
  const resolvedBaseUrl = `${baseUrl}${url}${queryString}`;


  function doFetch() {

    const url = resolvedBaseUrl
    const method = httpRequestMethod

    return new Promise(function (resolve, reject) {
      // 商城接口入参加密
      if (url.indexOf('blade-wx') != -1) {
        console.log(data);
        if (method === 'GET') {
          data = {
            data: crypto.encryptAES(JSON.stringify(data), crypto.aesKey)
          }
        } else {
          data = crypto.encryptAES(JSON.stringify(data), crypto.aesKey)
        }
      }
      wxRequest({
        url,
        data: data,
        method: method,
        timeout: 60000,
        header: {
          "Content-Type": "application/json",
          "wh-tour-token": getStorageSync("token"),
        },
        success: function (res) {
          // 商城接口出参解密
          if (url.indexOf('blade-wx') != -1) {
            res.data = JSON.parse(crypto.decryptAES(res.data, crypto.aesKey));
            console.log(res.data);
          }
          if (res.statusCode === 500) {
            wx.showToast({
              title: "服务异常",
              icon: "none",
              duration: 2000,
            });
          }
          if (res.data.code == 71 || res.data.code == 72) {
            console.log("登录失效了");
            // 登录失效
            clearToken()
            updateState("isLoginInProgress", false);
            updateState("isLogin", false);
            return doFetchWithLogin().then(recursiveRes => {
              resolve(recursiveRes)
            })


          } else {
            resolve(res.data);
          }

          // 实时日志
          rtLogger.info(url, data, method, res);

          // TODO: 以下代码是方便 测试 在小程序内调试
          stagingLogger.info({
            url,
            reqData: data,
            method,
            res,
          });
        },
        fail: function (err) {

          // TODO: 场景判断
          wx.showToast({
            title: "请求超时",
            icon: "none",
            duration: 2000,
          });

          // 实时日志
          rtLogger.error(url, data, method, err);

          // TODO: 以下代码是方便 测试 在小程序内调试
          stagingLogger.error({
            url,
            reqData: data,
            method,
            err,
          });

          reject(err);
        },
        complete: function (res) {

        },
      });
    });
  }

  function doFetchWithLogin() {
    updateState("isLoginInProgress", true);
    return loginWithCode().then(res => {
      updateState("isLogin", true);
      updateState("isLoginInProgress", false);
      return doFetch()
    })
  }

  function doRequestWithWaitForLogin() {
    return waitForLogin().then(doFetch);
  }
  return getState("isLogin") ?
    doFetch() :
    getState("isLoginInProgress") ?
    doRequestWithWaitForLogin() :
    doFetchWithLogin()
}

const request = {
  apiPost: getRequest("POST"),
  apiGet: getRequest("GET"),
  apiPut: getRequest("PUT"),
}

export default request