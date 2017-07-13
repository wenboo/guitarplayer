// video.js

//获取应用实例
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;
var size = 4;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingData: false,
    moodList: [],
    pageSize: size,          // 每次加载多少条
    limit: size,             // 跟上面要一致
    //loading: false,
    count: 0,
    isInit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("[cheng-chart.js]----------onLoad----------");

    that = this;

    wx.getSystemInfo({
      success: function (res) {
        var win = res.windowWidth;
        that.setData({
          w: win
        })
      },
    })

    // onLoad 时候会请求数据条目总数，防止在此过程中下拉至底部
    that.setData({
      loadingData: true
    })

    console.log("[cheng-chart.js]设置了全局加载标记 -->" + that.data.loadingData);
    var GuitarVideo = Bmob.Object.extend("GuitarVideo");
    var query = new Bmob.Query(GuitarVideo);

    //此处查一次总计条数
    query.count({
      success: function (results) {
        that.setData({
          count: results
        })

        getData(that);
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("[cheng-video.js]]----------onReady----------");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("[cheng-chart.js]----------onShow----------");
    // that = this;
    // getData(that);
  },


  /**
   * 点击搜索跳转至吉他谱搜索界面
   */

  videoSearch: function (e) {
    console.log("[cheng-video.js] 开始搜索吉他视频");

    wx.navigateTo({
      url: '../videoSearch/videoSearch',
      success: function (res) {

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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("[cheng-video.js]----------onHide----------");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("[cheng-video.js]----------onUnload----------");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("[cheng-video.js]上拉加载更多 ...");
    var that = this;
    // 如果是最后一页则不执行下面代码
    //if (that.data.limit > that.data.pageSize && that.data.limit - that.data.pageSize >= that.data.count) {
    if (that.data.count <= 0) {
      console.log("[cheng-video.js]最后一页 stop");
      common.showModal("已经是最后一页");
      return false;
    }

    /*
    var limit = that.data.limit 
    console.log("上拉加载更多....[limit]" + that.data.limit)
    that.setData({
      limit: limit + that.data.pageSize,
    });
    */

    // this.onShow()
    // 如果没有在加载数据过程中，下拉加载才有效，避免多次加载
    if (!that.data.loadingData) {
      console.log("[cheng-video.js]loadingData 为 false，开始继续加载数据 ...");
      getData(that);
    }

    console.log("[cheng-video.js]已经在加载数据了，等等吧 ...");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 转发
    return {
      title: '心邮',
      desc: '倾诉烦恼，邮寄心情，分享快乐',
      path: '/pages/index/index'
    }
  },
})


function getData(that) {

  console.log("[cheng-video.js]上拉 OK 了，准备 ...");

  // 开始检索和加载数据
  that.setData({
    loadingData: true
  });


  //如果是最后一页则不执行下面代码
  //if (that.data.limit > that.data.pageSize && that.data.limit - that.data.pageSize >= that.data.count) {
  if (that.data.count <= 0) {
    console.log("stop");
    common.showModal("已经是最后一页");
    return false;
  }

  var molist = new Array();
  var lastid = 0;

  wx.getStorage({
    key: 'user_id',
    success: function (ress) {
      if (ress.data) {
        // clearInterval(myInterval)
        var GuitarVideo = Bmob.Object.extend("GuitarVideo");
        var query = new Bmob.Query(GuitarVideo);

        /*
        if (that.data.limit == that.data.pageSize) {
          query.limit(that.data.limit);
        }
        if (that.data.limit > that.data.pageSize) {
          query.limit(that.data.limit)
        }
        */

        // 条件查询
        query.equalTo("delete", "0");
        query.lessThan("vid", that.data.count);
        query.limit(size);
        query.descending("vid");

        console.log("[cheng-chart.js]开始根据条件查询...");
        // 查询所有数据
        query.find({
          success: function (results) {
            /*
            that.setData({
              //loading: true
            });
           */
            console.log("[cheng-video.js]查询成功，结果为: " + results.length + " 条数据");
            for (var i = 0; i < results.length; i++) {
              var url = results[i].get("url");
              var title = results[i].get("title");
              var poster = results[i].get("poster");
              var createdAt = results[i].createdAt;
              lastid = results[i].get("vid");
              console.log("[cheng-video.js]构建 ListView Item JSON 对象：" + title);

              var jsonA;

              jsonA = {
                "url": url || '',
                "title": title || '',
                "poster": poster || ''
              }
              molist.push(jsonA);

            }
            that.setData({
              count: lastid,
              loadingData: false,
              moodList: that.data.moodList.concat(molist)
              // loading: true
            })
          },
          error: function (error) {
            common.dataLoading(error, "loading");
            that.setData({
              loadingData: false
            })
            console.log(error)
          }
        });

      }

    },
    fail: function (error) {
      that.setData({
        loadingData: false
      })
      console.log("失败")
    }
  })
}
