exports.keys = 'glb-tencent-token'

// 添加view配置
exports.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
        '.tpl': 'nunjucks',
    },
};

// 添加news配置项
exports.news = {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0',
};

// 添加 middleware robot
exports.middleware = ['robot'];

// robot's configurations
exports.robot = {
    ua: [
        /curl/i,
        /Baiduspider/i
    ]
};
// 查看效果 curl http://localhost:7001/news -A "Baiduspider"

exports.weChat = {
    appId: 'your-app-id',
    secret: 'your-secret',
    users: ['someone-openid'],
    daily: 'tTtUTEma5nYDdl-epRJbDl0iDJISjEOQVa_cbJirpWw'
}
