// var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const testPhoneNum = 13030303333
const testPassword = 123456
const testVcode = 12345
const app = getApp()
Page({
    data: {
        tabs: ["帐号密码登陆", "手机号快捷登陆"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 5
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderWidth: res.windowWidth / that.data.tabs.length - that.data.sliderLeft*2
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    getUserName: function (e) {
        this.setData({
            userName:e.detail.value
        })
    },
    getUserPw: function (e) {
        this.setData({
            userPassword:e.detail.value
        })
    },
    getPhoneNum: function (e) {
        this.setData({
            phoneNum:e.detail.value
        })
    },
    gainVcode: function (e) {
        wx.showModal({
            title: '验证码是：',
            content: '12345',
        })
    },
    getVcode: function (e) {
        this.setData({
            vcode:e.detail.value
        })
    },
    login: function () {
        if(this.data.activeIndex == 0) {
            const {userName,userPassword} = this.data
            if(userName == testPhoneNum && userPassword == testPassword) {
                wx.showToast({
                    title: '登陆成功',
                    icon: 'success',
                    duration:1000
                })
                app.globalData.login = true
                wx.switchTab({
                    url:'../my/my'
                })
            } else {
                wx.showToast({
                    title: '登陆失败',
                    icon:'loading',
                    duration:2000
                })
            }
        } else {
            const {phoneNum,vcode} = this.data
            if(phoneNum == testPhoneNum && vcode == testVcode) {
                wx.showToast({
                    title: '登陆成功',
                    icon: 'success',
                    duration:1000
                })
                app.globalData.login = true
                wx.switchTab({
                    url:'../my/my'
                })
            } else {
                 wx.showToast({
                    title: '登陆失败',
                    icon:'loading',
                    duration:2000
                })
            }
        }
    },
    wechatLogin: function () {
        wx.showToast({
            title: '微信登陆',
            icon: 'success',
            duration:1000
        })
    }
});