const Subscription = require('egg').Subscription

class UpdateCache extends Subscription {
    // 通过schedule属性来配置定时任务执行间隔
    static get schedule () {
        return {
            cron: '0 30 7 * * *', // 每天7：30 0秒执行
            // interval: '1m', // 间隔1分
            type: 'all', // 指定所有的worker都执行
        }
    }

    // subscribe 真正定时任务执行被运行的函数
    async subscribe() {
        const { ctx } = this
        const result = await ctx.service.sendmsg.send();
        ctx.logger.info('定时任务执行消息提醒 结果: %j', result);
    }
}

module.exports = UpdateCache

