// chart.js

var logHeader = "[cheng-chart.js]"
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
    loadingData: true,
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
    console.log(logHeader + "---------- onLoad ----------");

    var that = this;

    // onLoad 时候会请求数据条目总数，防止在此过程中下拉至底部
    that.setData({
      loadingData: true
    })

    console.log(logHeader + "设置了全局加载标记 -->" + that.data.loadingData);
    var GuitarChart = Bmob.Object.extend("GuitarChart");
    var query = new Bmob.Query(GuitarChart);

    //此处查一次总计条数
    query.count({
      success: function (results) {
        that.setData({
          count: results + 1        // 解决少 1 条问题
        })

        getData(that);
      }
    });

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
    // that = this;
    // getData(that);
  },


  /**
   * 点击搜索跳转至吉他谱搜索界面
   */
  chartSearch: function (e) {
    console.log(logHeader + "开始搜索吉他谱");

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
    console.log(logHeader + "点击了 index 为：" + cid + " 的条目");

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
    console.log(logHeader + "---------- onHide ----------");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(logHeader + "---------- onUnload ----------");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(logHeader + "上拉加载更多 ...");
    var that = this;
    // 如果没有在加载数据过程中，下拉加载才有效，避免多次加载
    if (!that.data.loadingData) {
      console.log(logHeader + "loadingData 为 false，开始继续加载数据 ...");
      getData(that);
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
      path: '/pages/chart/chart'
    }
  },
})


function getData(that) {

  console.log(logHeader + "上拉 OK 了，准备 ...");

  // 开始检索和加载数据
  that.setData({
    loadingData: true
  });

  var molist = new Array();
  var lastid = 0;

  wx.getStorage({
    key: 'user_id',
    success: function (ress) {
      if (ress.data) {
        // clearInterval(myInterval)
        var GuitarChart = Bmob.Object.extend("GuitarChart");
        var query = new Bmob.Query(GuitarChart);

        // 条件查询
        query.equalTo("delete", "0");
        query.lessThan("cid", that.data.count);
        query.limit(size);
        query.descending("cid");

        console.log(logHeader + "开始根据条件查询...");
        // 查询所有数据
        query.find({
          success: function (results) {

            if (results.length <= 0) {
              console.log(logHeader + "最后一页 stop");
              common.showModal("已经是最后一页");
              that.setData({
                loadingData: false,
              })
              return false;
            }

            console.log(logHeader + "查询成功，结果为: " + results.length + " 条数据");
            for (var i = 0; i < results.length; i++) {
              var objId = results[i].id; // get("objectId");
              var url = results[i].get("url");
              var title = results[i].get("title");
              var content = results[i].get("content");
              var cid = results[i].get("cid");
              lastid = results[i].get("cid");
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
      console.log(logHeader + "失败")
    }
  })
}