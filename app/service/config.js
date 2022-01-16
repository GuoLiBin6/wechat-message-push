const Service = require('egg').Service;

class ConfigService extends Service {

    // 获取Access Token
    async getToken() {
        const { app } = this;
        const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + app.config.weChat.appId + '&secret=' + app.config.weChat.secret;
        const result = await this.ctx.curl(url, {
            method: 'get',
            dataType: 'json',
        });
        if (result.status === 200) {
            return result.data.access_token;
        }
    }

    async createMenu() {
        const token = await this.getToken()
        console.log('token', token)
        const data = await this.ctx.curl(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, {
            data: {
                "button":[
                    {	
                        "type":"click",
                        "name":"Music",
                        "key":"V1001_TODAY_MUSIC"
                    },
                    {
                        "name":"Menu",
                        "sub_button":[
                            {	
                                "type":"view",
                                "name":"Search",
                                "url":"http://www.soso.com/"
                            },
                            {
                                "type":"click",
                                "name":"Good",
                                "key":"V1001_GOOD"
                            }
                        ]
                    }
                ]
            },
            method: 'post',
            dataType: 'json',
        });
        // console.log('创建按钮结果', data)
        return data;
    }
}

module.exports = ConfigService;