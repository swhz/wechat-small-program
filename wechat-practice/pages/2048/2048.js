const GameManager = require('./game_manager.js')

Page({
    data: {
        // 游戏数据可以通过参数控制
        grids: [],
        over: false,
        won: false,
        score: 0,
        highscore: 0,
        overMsg: '游戏结束！'
    },

    onLoad: function() {
        this.GameManager = new GameManager(4)
        this.setData({
            grids: this.GameManager.setup(),
            highscore: wx.getStorageSync('highscore') || 0
        })
    },

    // 更新视图数据
    updateView: function(data) {
        // 游戏结束
        if(data.over){
            data.overMsg = '游戏结束！'
        }
        // 获胜
        if(data.won){
            data.overMsg = '你赢了！'
        }
        this.setData(data);
    },

    // 重新开始
    restart: function() {
        this.updateView({
            grids: this.GameManager.restart(),
            over: false,
            won: false,
            score: 0
        })
    },

    touchStartClienX: 0,
    touchStartClientY: 0,
    touchEndClientX: 0,
    touchEndClientY: 0,
    isMultiple: false, // 多手指操作

    touchStart: function(events) {
        // 多指操作
        this.isMultiple = events.touches.length > 1
        if (this.isMultiple) {
            return;
        }
        const touch = events.touches[0]

        this.touchStartClientX = touch.clientX
        this.touchStartClientY = touch.clientY

    },

    touchMove: function(events) {
        const touch = events.touches[0]
        this.touchEndClientX = touch.clientX
        this.touchEndClientY = touch.clientY
    },

    touchEnd: function(events) {
        if (this.isMultiple) {
            return;
        }
        const dx = this.touchEndClientX - this.touchStartClientX
        const absDx = Math.abs(dx)
        const dy = this.touchEndClientY - this.touchStartClientY
        const absDy = Math.abs(dy)

        if (Math.max(absDx, absDy) > 10) {
            const direction = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0)

            const data = this.GameManager.move(direction) || {
                grids: this.data.grids,
                over: this.data.over,
                won: this.data.won,
                score: this.data.score
            }
            const highscore = wx.getStorageSync('highscore') || 0
            if(data.score > highscore){
                wx.setStorageSync('highscore', data.score);
            }
            this.updateView({
                grids: data.grids,
                over: data.over,
                won: data.won,
                score: data.score,
                highscore: Math.max(highscore, data.score)
            })

        }

    }
})

