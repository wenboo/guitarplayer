// search.js

//获取应用实例
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    moodList: [],
    pageSize: 3,          // 每次加载多少条
    limit: 3,             // 跟上面要一致
    //loading: false,
    windowHeight1: 0,
    windowWidth1: 0,
    count: 0,
    scrollTop: {
      scroll_top1: 0,
      goTop_show: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      //loading: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.videoContext = wx.createVideoContext('myVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var molist = new Array();
    that = this;
    
    getReturn(that);

    var GuitarVideo = Bmob.Object.extend("GuitarVideo");
    var query = new Bmob.Query(GuitarVideo);

    //此处查一次总计条数
    query.count({
      success: function (results) {
        that.setData({
          count: results
        })
        console.log(that.data.count, results)
      }
    });

    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth
        })
      }
    })
  },

 
/**
 * 点击搜索跳转至吉他谱搜索界面

  chartSearch: function (e) {
    console.log("[cheng-video.js] 开始搜索吉他视频");

    wx.navigateTo({
      url: '../chartSearch/chartSearch',
      success: function (res) {
        
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
  }, */

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
    wx.stopPullDownRefresh();
    var limit = that.data.limit
    console.log("下拉刷新....." + that.data.limit)
    that.setData({
      limit: that.data.pageSize,

    })
    that.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var limit = that.data.limit
    console.log("上拉加载更多...." + that.data.limit)
    that.setData({
      limit: limit + that.data.pageSize,

    });
    this.onShow()
  },

  scrollTopFun: function (e) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 转发?
    return {
      title: '心邮',
      desc: '倾诉烦恼，邮寄心情，分享快乐',
      path: '/pages/index/index'
    }
  },
})


function getReturn() {

  //如果是最后一页则不执行下面代码
  if (that.data.limit > that.data.pageSize && that.data.limit - that.data.pageSize >= that.data.count) {
    console.log("stop")
    common.showModal("已经是最后一页")
    return false;
  }

  that.setData({
    //loading: false
  });

  var molist = new Array();

  wx.getStorage({
    key: 'user_id',
    success: function (ress) {
      if (ress.data) {
        // clearInterval(myInterval)
        var GuitarVideo = Bmob.Object.extend("GuitarVideo");
        var query = new Bmob.Query(GuitarVideo);

        if (that.data.limit == that.data.pageSize) {
          query.limit(that.data.limit);
        }
        if (that.data.limit > that.data.pageSize) {
          query.limit(that.data.limit)
        }
        
        // 条件查询
        query.equalTo("delete", "0");
       
        console.log("[cheng-video.js]开始根据条件查询...");
        // 查询所有数据
        query.find({
          success: function (results) {
            that.setData({
              //loading: true
            });

            console.log("[cheng-video.js]查询成功，结果为: " + results.length +" 条数据");
            for (var i = 0; i < results.length; i++) {
       
              var url = results[i].get("url");
              var title = results[i].get("title");
              var createdAt = results[i].createdAt;
            
              
              var jsonA;

              jsonA = {
                "url": url || '',
                "title": title || ''
              }

              molist.push(jsonA)
       
              console.log("[cheng-video.js]构建 ListView Item JSON 对象：" + jsonA);

              //this.videoContext.seek(5);

              that.setData({
                moodList: molist,
                // loading: true
              })
            }
          },
          error: function (error) {
            common.dataLoading(error, "loading");
            // that.setData({
            //   loading: true
            // })
            console.log(error)
          }
        });

      }

    },
    fail: function (error) {
      console.log("失败")
    }
  })
}