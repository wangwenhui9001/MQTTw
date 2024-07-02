// index.js
Page({
  data: {
    
  },
  loginForm: function(data) {
    console.log(data.detail.value)
    var pass = "0033"
    var password = data.detail.value.password
    if(pass===password){
      wx.navigateTo({
        url: '../page1/page1'
      })
    }
    else{
      console.log(password)
      console.log(pass)
      console.log('不相等')
    }

  }
})
