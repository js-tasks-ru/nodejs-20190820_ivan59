const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');

app.use(serve('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx) => {
  ctx.body = await new Promise((resolve) => {
    app.on('message', (message) => {
      if (message) {
        resolve(message);
      }
    });
  });
  app.on('close', () => resolve());
  ctx.response.status = 200;
});


router.post('/publish', async (ctx) => {
  // console.log(ctx.request.body.message);
  ctx.response.status = 201;
  ctx.app.emit('message', ctx.request.body.message);
});

app.use(router.routes());

module.exports = app;
