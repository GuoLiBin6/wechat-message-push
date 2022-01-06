const Controller = require('egg').Controller;

class TokenController extends Controller {
    async index(args) {
        const { originalUrl = '' } = args
        const queryStr = originalUrl.split('?')[1] || ''
        const queryList = queryStr.split('&');
        const queryMap = {}
        queryList.map(item=>{
            const itemList = item.split('=')
            queryMap[itemList[0]] = itemList[1] || '';
        })
        this.ctx.body = queryMap['echostr'] || '';
    }
}

module.exports = TokenController;
