let app = getApp();
//替换成开发者后台设置的安全域名
let url = "http://127.0.0.1:8080";
Page({
    data:{
        corpId: '',
        authCode:'',
        userId:'',
        param: '',
    },
    onLoad(query){
        this.setData({
            param: query.param
        })
    },
    onShow() {
        let _this = this;
        this.setData({
            corpId: app.globalData.corpId,
        })
    },

    login() {
      let _this = this;
      dd.getAuthCode({
            success:(res)=>{
                // 1. 获取免登授权码
                _this.setData({
                    authCode:res.authCode
                })
            
                // 2. 获取登录身份
                dd.httpRequest({
                    url: url+'/login',
                    method: 'POST',
                    data: {
                        authCode: res.authCode,
                        authCorpId:app.globalData.corpId,
                    },
                    dataType: 'json',
                    success: function(res) {
                        if (res && res.data.success) {
                            console.log('httpRequest success --->',res)
                            let userId = res.data.data.userId;
                            let userName = res.data.data.userName;
                            _this.setData({
                                userId:userId,
                                userName:userName
                            })
                        } else {
                            console.log("httpRequest failed --->", res)
                            dd.alert({content: JSON.stringify(res)});
                        }
                    },
                    fail: function(res) {
                        console.log("httpRequest failed --->",res)
                        dd.alert({content: JSON.stringify(res)});
                    },
                    complete: function(res) {
                        dd.hideLoading();
                    }
                    
                });
            },
            fail: (err)=>{
                dd.alert({
                    content: JSON.stringify(err)
                })
            }
        })
    },

    sendMsg(){
        dd.httpRequest({
            url: url+'/sendMsg',
            method: 'POST',
            data: {
                userId: this.data.userId,
                corpId:app.globalData.corpId,
            },
            dataType: 'json',
            success: function(res) {
                console.log('success----',res)
            },
            fail: function(res) {
                console.log("httpRequestFail---",res)
                dd.alert({content: JSON.stringify(res)});
            },
            complete: function(res) {
                dd.hideLoading();
            }
        });
    }
})