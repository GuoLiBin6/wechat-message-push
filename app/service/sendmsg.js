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
            return this.toWechat(token, Object.assign({}, data, {touser: id}));
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
    }

     // 获取天气
    async getWeather(city = '北京') {
        try {
            const { app } = this;
            const url = 'https://api.map.baidu.com/weather/v1/?data_type=all&ak=' + app.config.weather.ak + '&district_id=' + app.config.weather.code[city];
            const result = await this.ctx.curl(url, {
                method: 'get',
                dataType: 'json',
            });
            console.log('天气结果', result)
            if (result && result.data && result.data.status === 0) {
                const now = result.data.result.now;
                const forecasts = result.data.result.forecasts[0];
                return {
                    wea: now.text,
                    tem: now.temp,
                    temMax: forecasts.high,
                    temMin: forecasts.low,
                    win: now.wind_dir,
                    wind_class: now.wind_class,
                };
            }
        } catch (error) {
            return {
                wea: '未知',
                tem: '未知',
                temMax: '未知',
                temMin: '未知',
                win: '未知',
                wind_class: '未知',
            };
        }
    }

    getMeetDay() {
        const { app } = this;
        const loveDay = app.config.time.meet;
        return moment(moment().format('YYYY-MM-DD')).diff(loveDay, 'day');
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

    async getOneSentence() {
        const url = 'https://v1.hitokoto.cn/';
        const result = await this.ctx.curl(url, {
            method: 'get',
            dataType: 'json',
        });
        if (result && result.status === 200) {
            return result.data.hitokoto;
        }
        return '昨天的不开心就到此为止吧，今天依旧光芒万丈啊 宝贝';
    }

    // 获取模板数据
    async getTemplateData() {
        const { app } = this;
        
        const getWeather = await this.getWeather()
        const getMeetDay = this.getMeetDay()
        const message = await this.getOneSentence()
        const data = {
            topcolor: '#ff0000',
            template_id: app.config.weChat.daily,
            data: {
                dateTime: {
                    value: this.getDatetime(),
                    color: '#cc33cc'
                },
                meet: {
                    value: getMeetDay,
                    color: '#cc33cc',
                },
                wea: {
                    value: getWeather.wea,
                    color: '#33ff33'
                },
                tem: {
                    value: getWeather.tem,
                    color: '#33ff33'
                },
                temMax: {
                    value: getWeather.temMax,
                    color: '#33ff33'
                },
                temMin: {
                    value: getWeather.temMin,
                    color: '#33ff33'
                },
                win: {
                    value: getWeather.win,
                    color: '#33ff33'
                },
                message: {
                    value: message,
                    color: '#8C8C8C'
                },
            },
        }

        return data;
    }
    

}

module.exports = SendMsgService
