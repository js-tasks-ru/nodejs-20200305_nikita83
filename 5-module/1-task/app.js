const path = require("path");
const Koa = require("koa");
const app = new Koa();

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();

let users = Array.from([]);

app.use(async (ctx, next) => {
  try {
    return next();
  } catch (e) {
    ctx.status = 501;
    ctx.body = "if you see this text please call me us";
  }
});

router.get("/subscribe", async (ctx, next) => {
  const getMessage = async () => {
    const _getMessage = await new Promise((resolve, reject) =>
      users.push(resolve)
    );
    return _getMessage;
  };
  ctx.body = await getMessage();
  await next();
});

router.post("/publish", async (ctx, next) => {
  return (async function() {
    const _setMessage = ctx.request.body.message;
    if (_setMessage !== undefined) {
      ctx.status = 200;
      await users.map(resolve => resolve(_setMessage));
    } else ctx.status = 400;
    await next();
  })();
});

app.use(router.routes());

module.exports = app;
