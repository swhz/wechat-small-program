//index.js
//获取应用实例
// const app = getApp()
// const scrollFixedNum = 0
Page({
  data: {
    loading: true,    //页面加载中标签的状态
    fixed: false,     //导航栏固定与否
    noData: false,     //是否还有数据
    scrollTop: 0,      //scroll-view滚动条高度
    navIndex: 0,       //导航栏选项索引
    tabId: -1,          //导航栏选项id，数据请求参数
    tabType: 'Home',    //导航栏选项类型，数据请求参数
    list: [],           //展现列表项内容
    allList: {},        //所有列表项内容
    nextPage: '',        //下一个分页，数据请求参数
    pageIndex: '',        //当前分页，数据请求参数
    bannerConfig: {          //轮播图默认参数
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      mode: "aspectFit"
    },                     
    activityUrls: [         // 四个模块图片链接
      'http://m.ipinbb.com/ipbb/static/images/home-01.png',
      "http://m.ipinbb.com/ipbb/static/images/home-02.png",
      "http://m.ipinbb.com/ipbb/static/images/home-03.png",
      "http://m.ipinbb.com/ipbb/static/images/home-04.png"
    ]
  },
  onLoad: function () {
    const that = this
    //获取设备宽度，计算得到导航栏距离页面顶部的距离（单位：px）
    wx.getSystemInfo({
      success: function (res) {
        const width = res.windowWidth
        that.setData({
          scrollFixedNum: Math.round(640 * (width / 750))
        })
        // scrollFixedNum:res.window
      }
    })
    this.getBannerImg()
    this.getNavbar()
    this.getGoodsList()
  },
  //获取轮播图数据
  getBannerImg: function () {
    const that = this
    wx.request({
      url: 'http://service.ipinbb.com:8080/goodsService/getHomeBanner',
      method: 'GET',
      success: function (res) {
        that.setData({
          bannerImgs: res.data.lst
        })
        wx.stopPullDownRefresh()
      },
      fail: function () {
        that.setData({
          loading: false
        })
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading',
          duration: 1000
        })
      }
    })
  },
  //获取导航栏数据
  getNavbar: function () {
    const that = this
    wx.request({
      url: 'http://service.ipinbb.com:8080/goodsService/getHomeTabs',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          navItems: res.data
        })
      },
      fail: function () {
        that.setData({
          loading: false
        })
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading',
          duration: 1000
        })
      }
    })
  },
  //获取商品列表数据
  getGoodsList: function () {
    const that = this
    const {tabId, tabType, nextPage, pageIndex} = this.data
    // console.log(this.data)
    wx.request({
      url: 'http://m.ipinbb.com/ipbb/home/load',
      data: {
        nextPage: nextPage,
        ti: tabId,
        ft: tabType,
        page: pageIndex
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          loading: false
        })
        //如果请求数据为空，那么设置noData为true，并return
        if (!res.data) {
          that.setData({
            noData: true
          })
          return
        }
        const nextPage = JSON.stringify(res.data.nextPage)
        //如果pageIndex不为0，则将请求到的数据添加到原存储数据的数组中
        if (pageIndex) {
          let {allList} = that.data
          allList[tabId] = allList[tabId].concat(res.data.lst)
          that.setData({
            list: allList[tabId],
            nextPage,
            allList,
            pageIndex: pageIndex + 1
          })
        } else {
          let {allList} = that.data
          allList[tabId] = res.data.lst
          that.setData({
            list: res.data.lst,
            nextPage,
            allList,
            pageIndex: pageIndex + 1
          })
        }
        // }
      },
      fail: function () {
        that.setData({
          loading: false
        })
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading',
          duration: 1000
        })
      }
    })
  },
  //点击导航栏选项触发函数
  chooseNav: function (e) {
    //提取当前导航栏选项参数
    const {index, tabid, tabtype} = e.currentTarget.dataset
    const {allList, scrollTop, scrollFixedNum} = this.data
    //如果当前滚动条高度大于scrollFixedNum，那么设置滚动条为scrollFixedNum
    if (scrollTop > scrollFixedNum) {
      this.setData({
        scrollTop: scrollFixedNum
      })
    }
    //设置当前选项卡参数
    this.setData({
      navIndex: index,
      tabId: tabid,
      tabType: tabtype,
      nextPage: '',
      pageIndex: 0,
      noData: false
    })
    //如果选项卡数据有保存，则直接提取，否则调用getGoodsList请求数据
    if (allList[tabid]) {
      this.setData({
        list: allList[tabid]
      })
    } else {
      this.setData({
        loading: true
      })
      this.getGoodsList()
    }
  },
  //上拉加载数据
  loadData: function (e) {
    this.setData({
      loading: true
    })
    this.getGoodsList()
  },
  //获取当前滚动条滚动高度
  getScrollTop: function (e) {
    const {scrollTop} = e.detail
    const {scrollFixedNum} = this.data
    //如果滚动高度大于scrollFixedNum则将导航栏固定在顶部
    if (scrollTop > scrollFixedNum) {
      this.setData({
        fixed: true,
        scrollTop,
      })
    } else {
      this.setData({
        fixed: false,
        scrollTop,
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    //初始化数据
    this.setData({
        loading: true,
        noData: false,
        scrollTop: 0,
        navIndex: 0,
        tabId: -1,
        tabType: 'Home',
        list: [],
        allList: {},
        nextPage: '',
        pageIndex: '',
      })
      this.onLoad()
  }
  // touchStartClinetY: 0,
  // touchEndClientY: 0,
  // isMultiple: false,
  // touchStart: function (e) {
  //   console.log('touchStart')
  //   console.log(e)
  //   this.isMultiple = e.touches.length > 1
  //   if (this.isMultiple) {
  //     return
  //   }
  //   this.touchStartClientY = e.touches[0].clientY
  //   console.log(e.touches[0].ClientY)
  // },
  // touchMove: function (e) {
  //   console.log('touchMove')
  //   console.log(e)
  //   this.touchEndClientY = e.touches[0].clientY
  //   console.log(this.touchEndClientY)
  // },
  // touchEnd: function (e) {
  //   console.log('touchEnd')
  //   if (this.isMultiple) {
  //     return
  //   }
  //   const dy = this.touchEndClientY - this.touchStartClientY
  //   const {scrollTop} = this.data
  //   console.log(dy)
  //   console.log(scrollTop)
  //   if (scrollTop < 1 && dy > 10) {
  //     this.setData({
  //       loading: true,
  //       noData: false,
  //       refresh: true,
  //       scrollTop: 0,
  //       navIndex: 0,
  //       tabId: -1,
  //       tabType: 'Home',
  //       list: [],
  //       allList: {},
  //       nextPage: '',
  //       pageIndex: '',
  //     })
  //     this.onLoad()
  //   }
  // }
})
