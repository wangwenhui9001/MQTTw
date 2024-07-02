// pages/page1/page1.js
var mqtt = require('../../utils/mqtt.min')
var state = 0
var id = 0
var str = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tx1:"未连接",
    tx2:"",
    url:"wxs://bemfa.com/wss",
    port:"9504",
    subtopic:"",
    posttopic:"post",
    msg:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  talk:function(){
    wx.navigateTo({
      url: '../page2/page2'
    })
  },
  start:function(){
    if(state==0) this.connectMqtt()
    state=1
  },
  /**
   * MQTT连接函数
   */
  connectMqtt:function(){
    var that = this
    const options = {
      connectTimeout:4000,
      clientId:'745ccbc6d54413f4a4e184f69d1ea3fb',
      path:'/wss',
      port:9504,
      username:'',
      password:''
    }
    client = mqtt.connect('wxs://bemfa.com',options)
    client.on('connect',(e)=>{
      console.log('服务器连接成功')
      str = that.data.tx2
      that.setData({tx2:'服务器连接成功\n'+str})
      that.setData({tx1:'已连接'})
      client.subscribe('hello',{qos:0},function(err){
        str = that.data.tx2
        that.setData({tx2:'订阅成功<hello>\n'+str})
        if(!err) console.log('主题订阅成功')
      })
    })
    //消息监听
    client.on('message',function(topic,message){
      str = that.data.tx2
      id++
      that.setData({tx2:id+'.'+'收到消息：'+topic+'->'+message.toString()+'\n'+str})
      console.log('收到消息：'+message.toString())
    })
    client.on('reconnect',(error)=>{
      console.log('正在重新连接',error)
    })
    client.on('rerror',(error)=>{
      state = 0
      str = that.data.tx2
      that.setData({tx2:'服务器连接丢失\n'+str})
      console.log('重新连接失败',error)
    })
   },
   getSubtopic:function(e){
     str = e.detail.value
     this.setData({subtopic:str})
   },
   getPosttopic:function(e){
    str = e.detail.value
    this.setData({posttopic:str})
   },
   getMsg:function(e){
    str = e.detail.value
    this.setData({msg:str})
   },
   sub:function(){
     var that = this
     if(state==1&&!(that.data.subtopic==='')){
      client.subscribe(that.data.subtopic,{qos:0},function(err){
        str = that.data.tx2
        that.setData({tx2:'订阅成功<'+that.data.subtopic+'>\n'+str})
        if(!err) console.log('主题订阅成功')
      })
     }
   },
   post:function(){
     var that = this
     if(state==1&&!(that.data.posttopic==='')&&!(that.data.msg==='')){
      client.publish(that.data.posttopic,that.data.msg)
      str = that.data.tx2
        that.setData({tx2:'发送成功：'+that.data.posttopic+'->'+that.data.msg+'\n'+str})
      console.log('消息发送成功')
     }
   }
})
