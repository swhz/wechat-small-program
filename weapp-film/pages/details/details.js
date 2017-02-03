Page({
  data: {
    films: [],
    loading: false,
    title: '正在热映',
    video: 'video-hide',
    datails: ''
  },
  //页面加载时根据id请求电影数据
  onLoad: function (options) {
    const id = 'http://m.maoyan.com/movie/' + options.id + '.json'
    this.setData({
      title: options.titles
    })
    const that = this
    wx.request({
      url: id, 
      data: {
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          films: res.data.data,
          loading: true
        })
        let pages = that.data.films.MovieDetailModel.dra
        //运用正则表达式将pages中的html标签去除
        pages = pages.replace(/<.*?>/ig,"")
        that.setData({
          details: pages
        })
      }
    })
  },
  //设置标题栏标题
  onReady: function(){
    const that = this
    wx.setNavigationBarTitle({
      title: that.data.title
    })
  },
  //无真实api接口，只是测试
  pay: function(){
    wx.requestPayment({
       'timeStamp': '',
       'nonceStr': '',
       'package': '',
       'signType': 'MD5',
       'paySign': '',
       success:function(res){
          console.log('success');
       },
       fail:function(res){
          console.log('fail');
       }
    })
  },
  //视频显示
  vShow: function(){
    this.setData({
      video: 'video-show'
    })
  },
  //视频隐藏
  vHid: function(){
    this.setData({
      video: 'video-hide'
    })
  }
})
