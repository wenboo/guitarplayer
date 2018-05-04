// welcome.js

var logHeader = "[cheng-welcome.js]";
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    forwardPage: false       // 已经点击了跳转了
  },


  /**
   *  进入「吉他曲谱」 模块
   */
  clickButtonGuitarChart: function () {
    console.log(logHeader + "点击了 GuitarChart");
    if (!this.data.forwardPage) {
      this.setData({
        forwardPage: true
      })

      wx.navigateTo({
        url: '../chart/chart',
        success: function (res) {
          // success  
        },
        fail: function () {
          // fail  
        },
        complete: function () {
          // complete  
        }
      })
    }
  },

  /**
   * 进入 「吉他视频」 模块
   */
  clickButtonGuitarVideo: function () {
    if (!this.data.forwardPage) {
      this.setData({
        forwardPage: true
      })

      wx.navigateTo({
        url: '../video/video',
        success: function (res) {
          // success  
        },
        fail: function () {
          // fail  
        },
        complete: function () {
          // complete  
        }
      })
    }
  },

  /**
   * 进入 「反馈」 模块
   */
  clickFeedback: function () {

    if (!this.data.forwardPage) {
      this.setData({
        forwardPage: true
      })

      wx.navigateTo({
        url: '../feedback/feedback',
        success: function (res) {
          // success  
        },
        fail: function () {
          // fail  
        },
        complete: function () {
          // complete  
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(logHeader + "---------- onLoad ----------");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(logHeader + "---------- onReady ----------");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(logHeader + "---------- onShow ----------");
    this.setData({
      forwardPage: false
    })
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
    console.log(logHeader + "---------- onUnload ----------");
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

  }
})