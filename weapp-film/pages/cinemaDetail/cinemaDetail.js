const config = require('../../comm/config')
Page({
    data: {
        id: '',
        cinemaDetail: '',
        movies: [],
        movieIndex: 0,
        dateIndex: 0,
        DateShow: '',
        Dates: '',
        loading: true,
        scrollLeft: 0
    },
    onLoad: function (options) {
        const that = this
        wx.getSystemInfo({
            success: (res) => {
                that.setData({
                    left: res.windowWidth / 2 - 48
                })
            }
        })
        this.setData({
            id: options.id
        })
        this.getCinema()
    },
    //对获取到的数据进行相应处理
    getCinema: function (movieid) {
        const that = this
        wx.request({
            url: config.apiList.cinema + that.data.id + (movieid ? '&movieid=' + movieid : ''),
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                let DateShow = res.data.data.DateShow
                //对取到的电影售票信息中的售价进行处理
                for (let date in DateShow) {
                    for (let i = 0; i < DateShow[date].length; i++) {
                        let sellPrArray = DateShow[date][i].sellPrStr.split('<i>')
                        let PrArray = DateShow[date][i].prStr ? DateShow[date][i].prStr.split('<i>') : ''
                        let sellPr = ''
                        let pr = ''
                        if (sellPrArray.length > 2) {
                            sellPr = sellPrArray[2].substr(2, 2) + (sellPrArray[3] ? sellPrArray[3].substr(3) : '')
                        } else {
                            sellPr = sellPrArray[1].substr(2, 2)
                        }
                        if (PrArray) {
                            if (PrArray.length > 2) {
                                pr = PrArray[2].substr(2, 2) + (PrArray[3] ? PrArray[3].substr(3,1) : '')
                            } else {
                                pr = PrArray[1].substr(2, 2)
                            }
                        }
                        DateShow[date][i].sellPr = sellPr
                        DateShow[date][i].pr = pr
                    }
                }
                that.setData({
                    cinemaDetail: res.data.data.cinemaDetailModel,
                    movies: res.data.data.movies,
                    DateShow: DateShow,
                    Dates: res.data.data.Dates,
                    loading: false
                })
                wx.stopPullDownRefresh()
            },
            fail: function () {
                wx.showToast({
                    title: '网络开小差了',
                    icon: 'loading'
                })
            }
        })
    },
    //获取选中电影的索引并保存
    chooseMovie: function (e) {
        const {index} = e.currentTarget.dataset
        const {movies} = this.data
        this.setData({
            movieIndex: index,
            dateIndex:0,
            scrollLeft: 83 * index
        })
        this.getCinema(movies[index].id)
    },
    //获取选中日期的索引并保存
    chooseDate: function (e) {
        const {index} = e.currentTarget.dataset
        this.setData({
            dateIndex: index
        })
    },
    //横向滚动到某个位置，据该位置最近的电影图片被选中
    scrollChoose: function (e) {
        const {scrollLeft} = e.detail
        const movieIndex = Math.round(scrollLeft / 83)
        const {movies} = this.data
        this.setData({
            movieIndex,
            dateIndex:0,
            scrollLeft: 83 * movieIndex
        })
        this.getCinema(movies[movieIndex].id)
    },
    //下拉刷新
    onPullDownRefresh: function () {
        this.setData({
            movieIndex: 0,
            dateIndex: 0,
            loading: true,
            scrollLeft: 0
        })
        this.getCinema()
    }
})