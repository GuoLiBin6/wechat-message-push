const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        this.ctx.body = 'hello world';
    }

    async send() {
        const { ctx, app } = this;
        const result = await ctx.service.sendmsg.sendOut();
        ctx.logger.info('主动触发，发送模板消息结果：%j', result);
        ctx.body = result;
        ctx.set('Content-Type', 'application/json');
    }
}

module.exports = HomeController;
