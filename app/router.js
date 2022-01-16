module.exports = app => {
    const { router, controller } = app;
    // router.get('/', controller.token.index);
    router.get('/', controller.home.index);
    router.get('/news', controller.news.list);
    router.get('/send', controller.home.send);
    router.get('/createMenu', controller.config.createMenu);
};
