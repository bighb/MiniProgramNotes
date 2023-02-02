// session 参数 key（后台吐回）
export const SESSION_KEY = "sessionId";

let isLogining = false;
export function doLogin() {
  return new Promise((resolve, reject) => {
    const session = wx.getStorageSync(SESSION_KEY);
    if (session) {
      // 缓存中有 session
      resolve();
    } else if (isLogining) {
      // 正在登录中，请求轮询稍后，避免重复调用登录接口
      setTimeout(() => {
        doLogin()
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }, 500);
    } else {
      isLogining = true;
      wx.login({
        success: (res) => {
          if (res.code) {
            const reqData = {
              code: res.code,
            };
            wx.request({
              url: API.login,
              data: reqData,
              // method: "POST",
              success: (resp) => {
                const data = resp.data;
                isLogining = false;
                // 保存登录态
                if (data.return_code === 0) {
                  wx.setStorageSync(SESSION_KEY, data[SESSION_KEY]);
                  resolve();
                } else {
                  reject(data.return_msg);
                }
              },
              fail: (err) => {
                // 登录失败，解除锁，防止死锁
                isLogining = false;
                reject(err);
              },
            });
          } else {
            // 登录失败，解除锁，防止死锁
            isLogining = false;
            reject();
          }
        },
        fail: (err) => {
          // 登录失败，解除锁，防止死锁
          isLogining = false;
          reject(err);
        },
      });
    }
  });
}
