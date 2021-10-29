// 以下常量标识服务端环境
const ENV_PRO = "production"; // 线上环境
const ENV_TST = "test"; // 测试环境
const ENV_DEV = "development"; // 开发环境
const ENV_PRE = "predist"; // 灰度环境
const ENV_GIFT = "gift"; // 礼品卡本地开发
const APP_ENV = ENV_PRE; // 修改此项，即可更改请求的服务端环境

const BASE_URL_MAP = {
  [ENV_DEV]: "https://minapp.tyymt.com",
  [ENV_TST]: "https://minapptest.tyymt.com",
  [ENV_PRE]: "https://minappuat.tyymt.com",
  [ENV_PRO]: "https://minapp.tyymt.com",
};

const BASE_COS_URL_MAP = {
  [ENV_DEV]: "https://beiming-test-1302439057.cos.ap-nanjing.myqcloud.com",
  [ENV_TST]: "https://beiming-test-1302439057.cos.ap-nanjing.myqcloud.com",
  [ENV_PRE]: "https://beiming-test-1302439057.cos.ap-nanjing.myqcloud.com",
  [ENV_PRO]: "https://beiming-test-1302439057.cos.ap-nanjing.myqcloud.com",
};

export default {
  BASE_URL: BASE_URL_MAP[APP_ENV],
  BASE_COS_URL: BASE_COS_URL_MAP[APP_ENV],
};