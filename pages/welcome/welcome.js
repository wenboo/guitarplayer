// welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },


  /**
   * clickButtonGuitarChart 点击事件监听
   */
  clickButtonGuitarChart: function () {
    console.log("[cheng-welcome]点击了 GuitarChart");
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
  },

  /**
   * clickButtonGuitarVideo 点击事件监听
   */
  clickButtonGuitarVideo: function () {
    // 打印所有关于点击对象的信息
    // console.log("hello world");
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
  
  }
})