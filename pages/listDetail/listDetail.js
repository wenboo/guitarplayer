
//获取应用实例
var app = getApp()
var that;
var optionId;
var common = require('../template/getCode.js')
var Bmob=require("../../utils/bmob.js");
var pictures;
Page({
  data:{
      limit:5,
      loading:false,
      source: '',
      pictures: 
      [
        'https://p0.meituan.net/movie/ea4ac75173a8273f3956e514a4c78018253143.jpeg',
        'https://p0.meituan.net/movie/5d4fa35c6d1215b5689257307c461dd2541448.jpeg',
        'https://p0.meituan.net/movie/0c49f98a93881b65b58c349eed219dba290900.jpg',
        'https://p1.meituan.net/movie/45f98822bd15082ae3932b6108b17a01265779.jpg',
        'https://p1.meituan.net/movie/722de9a7b0c1f9c262162d87eccaec7c451290.jpg',
        'https://p0.meituan.net/movie/cb9be5bbedb78ce2ef8e83c93f83caca474393.jpg',
        'https://p1.meituan.net/movie/a852b992cdec15319c717ba9fa9b7a35406466.jpg',
        'https://p1.meituan.net/movie/dc1f94811793e9c653170cba7b05bf3e484939.jpg'
      ]
  },

  previewImage: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      pictures = this.data.pictures;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
  },

  /**
     * 生命周期函数--监听页面隐藏
     */
  onHide: function () {
    console.log("[cheng-Detail.js]onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("[cheng-Detail.js]onunLoad");
  },

  onLoad: function(options) {   
      that=this;
      optionId=options.moodId;
      console.log("[cheng-Detail.js]onLoad .. got index");
  },
  onReady:function(){
     wx.hideToast();
     console.log("[cheng-Detail.js]onReady");

    wx.previewImage({
      current: '',  // 不填写默认 urls 第一张
      urls: [
        'http://img.souutu.com/2016/0511/20160511055648316.jpg',
        'http://img.souutu.com/2016/0511/20160511055650751.jpg',
        'http://img.souutu.com/2016/0511/20160511054928658.jpg'
      ],
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

  /**
   * 显示界面
   */
  onShow: function() {  

    console.log("[cheng-Detail.js]onShow");
   
  

    that.setData({
      loading: true
    })
   
  },

 

  onShareAppMessage: function () {
   
  },

bindKeyInput:function(e){
  this.setData({
    publishContent: e.detail.value
  })
},
  onHide: function() {
      // Do something when hide.
  },
  onUnload:function(event){
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },
  seeBig:function(e){
    wx.previewImage({
      //current: that.data.listPic, // 当前显示图片的http链接
      //urls: [ that.data.listPic] // 需要预览的图片http链接列表
    })
  }
})
