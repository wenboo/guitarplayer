// feedback.js

var Bmob = require("../../utils/bmob.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
  feedback:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  formBindsubmit: function (e) {
    
    var that = this;

    if (e.detail.value.feedback.length == 0) {
      this.setData({
        tip: '提示：用户名和密码不能为空！',
        feedback: ''
      })
    }else{
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;

          var nickName = userInfo.nickName;
          var avatarUrl = userInfo.avatarUrl;
          var city = userInfo.city;
          var country = userInfo.country;
          var province = userInfo.province;
          var gender = userInfo.gender;
          var content = e.detail.value.feedback;

          //创建类和实例
          var Feedback = Bmob.Object.extend("Feedback");
          var feedback = new Feedback();
          feedback.set("nickname", nickName);
          feedback.set("avatarUrl", avatarUrl);
          feedback.set("city", city);
          feedback.set("country", country);
          feedback.set("province", province);
          //feedback.set("gender", gender);
          feedback.set("content", content);
          //添加数据，第一个入口参数是null
          feedback.save(null, {
            success: function (result) {
              // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
              console.log("[cheng-feedback.js] 提交反馈成功");

              wx.navigateTo({
                url: '../welcome/welcome',
                success: function (res) {

                },
                fail: function () {
                  // fail  
                },
                complete: function () {
                  // complete  
                }
              });
            },
            error: function (result, error) {
              // 添加失败
              console.log("[cheng-feedback.js] 提交反馈失败");

            }
          });
        }
      })
    }
  },
})