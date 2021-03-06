// chartSearch.js

var logHeader = "[cheng-chartSearch.js]";
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;
var size = 12;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //forwardPage: false,           // 已经点击了跳转了
    noResultsTipHidden: 'none',     // 隐藏 0 结果提示
    inputValue: "",
    moodList: [],
    pageSize: size,                 // 每次加载多少条
    limit: size,                    // 跟上面要一致
    //loading: false,
    globalCid: 0,
    isInit: false,
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
      startToSearch(this.data.inputValue, that);
    }

    console.log(logHeader + "内容为空，不搜索：" + this.data.inputValue);
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
   * button点击事件监听
   */
  clickButton: function (e) {
    // 获取点击了条目的 index
    var cid = this.data.moodList[e.currentTarget.dataset.index].cid; //this.data.moodList[0].index;
    var objId = this.data.moodList[e.currentTarget.dataset.index].objId;

    // 点击率记录到数据库
    var GuitarChart = Bmob.Object.extend("GuitarChart");
    var queryHit = new Bmob.Query(GuitarChart);
    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
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

    console.log(logHeader + "点击了index为：" + cid + " 的条目");
    // 根据 index 发起 GuitarChartFile 的查询
    var GuitarChartFile = Bmob.Object.extend("GuitarChartFile");
    var query = new Bmob.Query(GuitarChartFile);
    // 条件查询
    query.equalTo("cid", cid);
    query.ascending("seq");      // 按照吉他谱的升序排列
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log(logHeader + "查询吉他图片条目成功，结果为: " + results.length + " 条数据");
        var imgUrls = new Array();
        var url;

        for (var i = 0; i < results.length; i++) {
          url = results[i].get("url");
          imgUrls.push(url);
        }
        console.log(logHeader + "吉他谱图片地址数组构建 OK");

        // 微信预览开始
        wx.previewImage({
          // 不填写默认 urls 第一张
          current: '',
          urls: imgUrls,
          //这根本就不走
          success: function (res) {
            console.log(res);
          },
          //也根本不走
          fail: function () {
            console.log('fail')
          }
        })
      },
      error: function (error) {
        common.dataLoading(error, "loading");
        // that.setData({
        //   loading: true
        // })
        console.log(error)
      }
    });
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    bottomLoopSearch(that.data.inputValue, that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 转发?
    return {
      title: '趣玩吉他',
      desc: '',
      path: '/pages/chart/chart'
    }
  },
})



function startToSearch(searchContent, that) {

  var molist = new Array();
  var lastid = 0;

  wx.getStorage({
    key: 'user_id',
    success: function (ress) {
      if (ress.data) {
        // 复合查询：没有删除 && titile 为搜索关键字
        var GuitarChart = Bmob.Object.extend("GuitarChart");
        var query1 = new Bmob.Query(GuitarChart);
        // 作者
        query1.equalTo("delete", "0");
        query1.equalTo("title", searchContent);

        // 吉他谱名字
        var query2 = new Bmob.Query(GuitarChart);
        query2.equalTo("delete", "0");
        query2.equalTo("content", searchContent);

        var query = Bmob.Query.or(query1, query2);
        query.descending("cid");

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

                var title = results[i].get("title");
                var content = results[i].get("content");
                var cid = results[i].get("cid");
                lastid = cid;
                console.log(logHeader + "构建 ListView Item JSON 对象：" + title);
                var jsonA;
                jsonA = {
                  "title": title || '',
                  "content": content || '',
                  "cid": cid || ''
                }
                molist.push(jsonA);
              }
              that.setData({
                noResultsTipHidden: "none",                        /* 有结果则不显示反馈提示 */
                moodList: that.data.moodList.concat(molist),
                globalCid: lastid
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


function bottomLoopSearch(searchContent, that) {

  var molist = new Array();
  var lastid = 0;

  wx.getStorage({
    key: 'user_id',
    success: function (ress) {
      if (ress.data) {
        // 复合查询：没有删除 && titile 为搜索关键字
        var GuitarChart = Bmob.Object.extend("GuitarChart");
        var query1 = new Bmob.Query(GuitarChart);
        // 作者
        query1.equalTo("delete", "0");
        query1.equalTo("title", searchContent);

        // 吉他谱名字
        var query2 = new Bmob.Query(GuitarChart);
        query2.equalTo("delete", "0");
        query2.equalTo("content", searchContent);

        var query = Bmob.Query.or(query1, query2);
        query.descending("cid");
        query.lessThan("cid", that.data.globalCid);
        query.limit(size);

        console.log(logHeader + "开始根据条件查询...");

        // 查询所有数据
        query.find({
          success: function (results) {

            if (results.length <= 0) {
              common.showModal("已经是最后一页");
              return false;
            }

            console.log(logHeader + "查询成功，结果为: " + results.length + " 条数据");
            for (var i = 0; i < results.length; i++) {
              var objId = results[i].id;
              var title = results[i].get("title");
              var content = results[i].get("content");
              var cid = results[i].get("cid");
              lastid = cid;
              console.log(logHeader + "构建 ListView Item JSON 对象：" + title);
              var jsonA;
              jsonA = {
                "objId": objId || '',
                "title": title || '',
                "content": content || '',
                "cid": cid || ''
              }
              molist.push(jsonA);
            }
            that.setData({
              moodList: that.data.moodList.concat(molist),
              globalCid: cid
            })
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
