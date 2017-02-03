// pages/my/my.js
const app = getApp()
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  navigatorTo: function (e) {
    let {id} = e.currentTarget.dataset
    id = Number(id)
    if(app.globalData.login) {
      console.log(id)
      switch (id) {
        case 1:
          wx.navigateTo({
            url:'../order/order'
          })
          break
        case 2:
          wx.navigateTo({
            url:'../coupon/coupon'
          })
          break
        case 3:
          wx.navigateTo({
            url:'../memcard/memcard'
          })
          break
        case 4:
          wx.navigateTo({
            url:'../wantWatch/wantWatch'
          })
          break
        case 5:
          wx.navigateTo({
            url:'../watched/watched'
          })
          break
      }
    } else {
      wx.navigateTo({
        url:'../login/login'
      })
    }
  }
})