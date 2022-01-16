const Controller = require('egg').Controller;

class ConfigController extends Controller {

    async createMenu() {
        console.log('调用 controller')
        const { ctx, app } = this;
        const result = await ctx.service.config.createMenu();
        ctx.body = result;
        ctx.set('Content-Type', 'application/json');
    }
}

module.exports = ConfigController;
