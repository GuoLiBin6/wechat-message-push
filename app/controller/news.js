const Controller = require('egg').Controller;

class NewsController extends Controller {
    async list() {
        // const dataList = {
        //     list: [
        //         { id: 1, title: 'news 1', url: '/news/1' },
        //         { id: 2, title: 'news 2', url: '/news/2' },
        //     ]
        // };
        const ctx = this.ctx;
        const page = ctx.query.page || 1;
        const dataList = await ctx.service.news.list(page);
        await this.ctx.render('news/list.tpl', dataList);
    }
}

module.exports = NewsController