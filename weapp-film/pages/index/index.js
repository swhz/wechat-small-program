const config = require('../../comm/config')
Page({
  data: {
    films: [],
    limit: 6,
    loading: false,
    windowHeight: 0,
    windowWidth: 0
  },
  onLoad: function () {
    this.setData({
      loading: false
    })
    this.getMovies()
    //获取设备信息
    const that = this
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  //获取上映电影信息
  getMovies: function () {
    const that = this
    wx.request({
      url: config.apiList.movies,
      data: {
        offset: 0,
        type: 'hot',
        limit: that.data.limit
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          films: res.data.data.movies,
          loading: true
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      limit: 6,
      loading: false
    })
    this.onShow()
  },
  //下拉加载
  onReachBottom: function () {
    const limit = this.data.limit + 6
    this.setData({
      limit: limit
    })
    this.onShow()
  }
})
