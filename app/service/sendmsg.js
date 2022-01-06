const moment = require('moment');
const Service = require('egg').Service;

class SendMsgService extends Service {
    // 发送模板
    async sendOut() {
        const { ctx, app } = this;
        const token = await this.getToken();
        const data = await this.getTemplateData();
        ctx.logger.info('获取token结果：%j', token);

        // 模板消息接口文档
        const users = app.config.weChat.users;
        const promise = users.map(id => {
            ctx.logger.info('------------开始每日发送------------');
            data.touser = id;
            return this.toWechat(token, data);
        });
        const results = await Promise.all(promise);
        ctx.logger.info('----------结束发送每日提醒结果')
        return results;
    }

    // 通知微信接口
    async toWechat(token, data) {
        // 模板消息接口文档
        const url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
        const result = await this.ctx.curl(url, {
            method: 'POST',
            data,
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result;
    }

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
        // return '52_S193_KtCiFSLYf4rd0bAdmq_5nPMl8EwUkeCCLxiYjuY682M3txINNZiH2lEwzJvdrQ8_Q5lK4BUBQEsnNuAzrzGAz1NcL3-e2qKcKglKx2UoeSS34dJXzoQ-RZ56_oR8_GXNl36W8fLlM2MOAAaAAADPP'
    }

    // 获取模板数据
    getTemplateData() {
        const { app } = this;
        
        const data = {
            topcolor: '#ff0000',
            template_id: app.config.weChat.daily,
            data: {
                dateTime: {
                    value: this.getDatetime(),
                    color: '#c33cc'
                },
            },
        }

        return data;
    }

    getDatetime () {
        const week = {
            1: '星期一',
            2: '星期二',
            3: '星期三',
            4: '星期四',
            5: '星期五',
            6: '星期六',
            0: '星期日',
        };
        return moment().format('YYYY年MM月DD日 ') + week[moment().weekday()];
    }

}

module.exports = SendMsgService
