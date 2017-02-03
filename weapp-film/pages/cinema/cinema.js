const config = require('../../comm/config')
Page({
  data: {
    cinemadata: [],
    loading: true
  },
  onLoad: function () {
    //调用getCinemas函数请求影院数据
    this.getCinemas()
  },
  //请求城市影院数据
  getCinemas: function () {
    const that = this
    wx.request({
      url: config.apiList.cinemas,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //调用sortCinema函数对得到的数据进行整理并返回
        const cinemadata = that.sortCinema(res.data.data)
        that.setData({
          cinemadata,
          loading: false
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  //对影院数据进行整理
  sortCinema: function (data) {
    let sdata = []
    for (let area in data) {
      sdata.push({ "id": area, "open": false, "area": area, "cinemas": data[area] })
    }
    sdata[0].open = true
    return sdata
  },
  //控制下拉列表开闭
  cinemasToggle: function (e) {
    const {area} = e.currentTarget.dataset
    let {cinemadata} = this.data
    //使用map方法找到对应地区的open属性，改变其值
    cinemadata = cinemadata.map(x => {
      if (x.area === area) {
        x.open = !x.open
      } else {
        x.open = false
      }
      return x
    })
    this.setData({
      cinemadata,
    })
  }
})