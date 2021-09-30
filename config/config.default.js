exports.keys = '自己的Cookie安全字符串'

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
    ua: [/Baiduspider/i]
};
// 查看效果 curl http://localhost:7001/news -A "Baiduspider"
