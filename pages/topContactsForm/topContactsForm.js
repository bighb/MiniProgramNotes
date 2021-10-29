import WxValidate from "../../utils/WxValidate";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toTop: app.globalData.toTop,
    bottomSafeHeight: app.globalData.bottomSafeHeight,
    isLoading: false,
    form: {
      name: "",
      IDCard: "",
      phone: "",
    },
    //表单错误提示信息
    errorMessage: {
      msg: "",
      param: "",
    },
    formType: "add",
    checked: false, //用户须知按钮
    fid: "", //联系人主键
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.user) {
      let formInfo = JSON.parse(options.user);
      this.data.fid = formInfo.fid;
      this.data.form.name = formInfo.fname;
      this.data.form.IDCard = formInfo.fidNo;
      this.data.form.phone = formInfo.fmobile;
      this.setData({
        form: this.data.form,
        formType: "edit",
      });
    }
    this.initValidate(); //验证规则函数
  },
  iptChange(event) {
    let currentTarget = event.currentTarget.dataset.id;
    switch (currentTarget) {
      case "1":
        this.setData({
          "form.name": event.detail.value,
        });
        break;
      case "2":
        this.setData({
          "form.IDCard": event.detail.value,
        });
        break;
      case "3":
        this.setData({
          "form.phone": event.detail.value,
        });
        break;
      default:
        break;
    }
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    });
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      name: {
        required: true,
        chineseRule: true,
      },
      IDCard: {
        required: true,
        idcard: true,
      },
      phone: {
        required: true,
        tel: true,
      },
    };
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: "请填写姓名",
      },
      phone: {
        required: "请输入手机号",
        tel: "请输入正确的手机号",
      },
      IDCard: {
        required: "请输入身份证号码",
        idcard: "请输入正确的身份证号码",
      },
    };

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages);
    // 自定义验证规则
    this.WxValidate.addMethod(
      "chineseRule",
      (value, param) => {
        return (
          this.WxValidate.optional(value) ||
          /^[ \u3000\u3400-\u4DBF\u4E00-\u9FFF·]{0,19}$/.test(value)
        );
      },
      "请输入正确姓名"
    );
  },

  //保存
  submit() {
    if (!this.data.checked && this.data.formType === "add") return;
    // 去除空格
    for (const key in this.data.form) {
      if (Object.hasOwnProperty.call(this.data.form, key)) {
        this.data.form[key] = this.data.form[key].trim();
      }
    }
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(this.data.form)) {
      const error = this.WxValidate.errorList[0];
      this.setData({
        errorMessage: error,
      });
      return false;
    } else {
      this.setData({
        errorMessage: {
          msg: "",
          param: "",
        },
      });
    }
  },

  // 阅读内容单选按钮
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
});
