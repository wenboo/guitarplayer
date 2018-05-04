// videoSearch.js

var logHeader = "[cheng-videoSearch.js]";
var common = require('../../utils/common.js');
var app = getApp();
var Bmob = require("../../utils/bmob.js");
var that;
var size = 5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noResultsTipHidden: 'none',     // 隐藏 0 结果提示
    videoPlayHidden: 'none',
    videoImage: 'block',
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
    that = this;
    that.setData({
      //loading: false
    })
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
   * 搜索
   */
  onFocus: function (e) {

    var that = this;

    this.setData({
      moodList: []
    })
  },

  /**
    * 搜索提交
    */
  lostFocus: function (e) {

    var that = this;

    this.setData({
      inputValue: e.detail.value
    })

    // 开始查询
    if (this.data.inputValue != '') {
      console.log(logHeader + "准备搜索关键词：" + this.data.inputValue);
      startToSearch(this.data.inputValue);
    }

    console.log(logHeader + "内容为空，不搜索：" + this.data.inputValue);
  },

  /**
   * 点击搜索跳转至吉他谱搜索界面
   */

  videoSearch: function (e) {
    console.log(logHeader + "开始搜索吉他视频");

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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
     * 当检索没有结果的时候，尝试向后台反馈
     */
  clickNoResultsTip: function (e) {
    console.log(logHeader + "检索结果为 0，向后台反馈要搜索的内容：" + this.data.inputValue);

    /*
    if (!this.data.forwardPage) {
      this.setData({
        forwardPage: true
      })
    */

    wx.navigateTo({
      url: '../feedback/feedback?str=' + this.data.inputValue,
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this;

    // 如果是最后一页则不执行下面代码
    if (that.data.count <= 0) {
      console.log(logHeader + "已经是最后一页");
      common.showModal("已经是最后一页");
      return false;
    }

    // 如果没有在加载数据过程中，下拉加载才有效，避免多次加载
    if (!that.data.loadingData) {
      console.log(logHeader + "loadingData 为 false，开始继续加载数据 ...");
      bottomLoopSearch(that.data.inputValue, that);
    }

    console.log(logHeader + "已经在加载数据了，等等吧 ...");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 转发
    return {
      title: '趣玩吉他',
      desc: '',
      path: '/pages/video/video'
    }
  },

  /**
   * 用户点击了视频上的预览图片
   */
  onVideoImageClick: function (e) {
    that = this;
    var videoId = that.data.moodList[e.currentTarget.dataset.index].videoId;
    var objId = that.data.moodList[e.currentTarget.dataset.index].objId;

    // 点击率记录到数据库
    var GuitarVideo = Bmob.Object.extend("GuitarVideo");
    var queryHit = new Bmob.Query(GuitarVideo);
    // 这个 id 是要修改条目的 id
    queryHit.get(objId, {
      success: function (result) {
        // 回调中可以取得这个 diary 对象的一个实例，然后就可以修改它了
        result.increment("hit");
        result.save();
        // The object was retrieved successfully.
      },
      error: function (object, error) {
      }
    });

    that.data.moodList[e.currentTarget.dataset.index].videoPlayHidden = "block";
    that.data.moodList[e.currentTarget.dataset.index].videoImage = "none";

    that.setData({
      moodList: that.data.moodList
    })

    var videoContext = wx.createVideoContext(videoId);
    videoContext.play();
    console.log("[cheng-video.js] onVideoImageClick");
  },
})

function bottomLoopSearch(searchContent, that) {

  // 开始检索和加载数据
  that.setData({
    loadingData: true
  });

  //如果是最后一页则不执行下面代码
  if (that.data.count <= 0) {
    console.log(logHeader + "已经是最后一页");
    common.showModal("已经是最后一页");
    return false;
  }

  var molist = new Array();
  var image;
  var lastid;

  wx.getStorage({
    key: 'user_id',
    success: function (ress) {
      if (ress.data) {
        var GuitarVideo = Bmob.Object.extend("GuitarVideo");
        var query = new Bmob.Query(GuitarVideo);

        // 条件查询
        query.equalTo("delete", "0");
        query.equalTo("author", searchContent);
        query.lessThan("vid", that.data.count);
        query.descending("vid");

        query.limit(size);

        console.log(logHeader + "开始根据条件查询...");

        // 查询所有数据
        query.find({
          success: function (results) {

            console.log(logHeader + "查询成功，结果为: " + results.length + " 条数据");

            if (results.length <= 0) {
              console.log(logHeader + "最后一页 stop");
              common.showModal("已经是最后一页");
              that.setData({
                loadingData: false
              })
              return false;
            }

            for (var i = 0; i < results.length; i++) {
              var objId = results[i].id; //get("objectId");
              var url = results[i].get("url");
              var title = results[i].get("title");
              var poster = results[i].get("poster");
              var createdAt = results[i].createdAt;
              image = poster;
              lastid = results[i].get("vid");
              var videoId = "videoId" + lastid.toString();
              console.log(logHeader + "构建 ListView Item JSON 对象：" + title);

              var jsonA;

              jsonA = {
                "objId": objId || '',
                "videoId": videoId || '',  // vid
                "url": url || '',
                "title": title || '',
                "image": image || '',
                "poster": poster || '',
                "videoImage": "block" || '',
                "videoPlayHidden": "none",
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
            console.log(error);
          }
        });

      }

    },
    fail: function (error) {

      that.setData(
        {
          loadingData: false
        });

      console.log(logHeader + "失败");
    }
  })
}

function startToSearch(searchContent) {

  that.setData({
    //loading: false
  });

  var molist = new Array();
  var image;
  var lastid;

  wx.getStorage({
    key: 'user_id',
    success: function (ress) {
      if (ress.data) {

        // 复合查询：没有删除 && titile 为搜索关键字
        var GuitarChart = Bmob.Object.extend("GuitarVideo");
        var query = new Bmob.Query(GuitarChart);
        query.equalTo("delete", "0");
        query.equalTo("author", searchContent);       // 按作者查找，模糊查询要收费，太 bug 了
        query.descending("vid");                	  // 按日期降序排列

        query.limit(size);

        console.log(logHeader + "开始根据条件查询...");
        // 查询所有数据
        query.find({
          success: function (results) {
            console.log(logHeader + "查询成功，结果为: " + results.length + " 条数据");
            if (results.length == 0) {
              console.log(logHeader + "没有搜索到相关内容，准备报给后台备份");
              that.setData({
                noResultsTipHidden: "block"         /* 无结果提示用户反馈给后台 */
              })
            }
            else {
              for (var i = 0; i < results.length; i++) {
                var objId = results[i].id; //get("objectId");
                var url = results[i].get("url");
                var title = results[i].get("title");
                var poster = results[i].get("poster");
                var createdAt = results[i].createdAt;
                image = poster;
                lastid = results[i].get("vid");
                var videoId = "videoId" + lastid.toString();
                console.log(logHeader + "构建 ListView Item JSON 对象：" + title);

                var jsonA;

                jsonA = {
                  "objId": objId || '',
                  "videoId": videoId || '',  // vid
                  "url": url || '',
                  "title": title || '',
                  "image": image || '',
                  "poster": poster || '',
                  "videoImage": "block" || '',
                  "videoPlayHidden": "none",
                }
                molist.push(jsonA);
              }

              that.setData({
                noResultsTipHidden: "none",                        /* 有结果则不显示反馈提示 */
                count: lastid,
                loadingData: false,
                moodList: that.data.moodList.concat(molist)
                // loading: true
              })
            }
          },
          error: function (error) {
            common.dataLoading(error, "loading");
            that.setData({
              loadingData: false
            })
            console.log(error);
          }
        });

      }

    },
    fail: function (error) {
      that.setData(
        {
          loadingData: false
        });

      console.log(logHeader + "失败");
    }
  })
}